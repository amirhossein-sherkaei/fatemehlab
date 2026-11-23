import { NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, paymentAttempts } from '@/db/schema';
import { appendOrderEvent, finalizePaymentInTransaction, isSettledOrderStatus } from '@/lib/order-payment';
import { getClientIp } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';
import {
  isZibalDefinitiveFailure,
  isZibalInProgress,
  isZibalPaymentVerified,
  normalizeZibalTrackId,
  verifyZibalPayment,
  type ZibalState,
} from '@/lib/zibal';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';
  const parsed = new URL(configured);
  if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
    throw new Error('INSECURE_PUBLIC_BASE_URL');
  }
  return parsed.origin;
}

function failureRedirect(baseUrl: string, reason: string, orderId?: string | null) {
  const target = new URL('/order/failure', baseUrl);
  target.searchParams.set('reason', reason);
  if (orderId) target.searchParams.set('orderId', orderId);
  return NextResponse.redirect(target);
}

function successRedirect(baseUrl: string, orderId: string, trackingCode: string) {
  const target = new URL('/order/success', baseUrl);
  target.searchParams.set('id', orderId);
  target.searchParams.set('code', trackingCode);
  return NextResponse.redirect(target);
}

async function settleVerifiedZibalOrder(orderId: string, trackId: string, refNumber: string | null): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);

    const [order] = await tx.select({
      status: orders.status,
      paymentAuthority: orders.paymentAuthority,
      totalAmount: orders.totalAmount,
    }).from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order || order.paymentAuthority !== trackId) return false;

    const [attempt] = await tx.select({
      id: paymentAttempts.id,
      provider: paymentAttempts.provider,
      amount: paymentAttempts.amount,
      status: paymentAttempts.status,
    }).from(paymentAttempts)
      .where(and(
        eq(paymentAttempts.orderId, orderId),
        eq(paymentAttempts.authority, trackId),
        eq(paymentAttempts.provider, 'zibal'),
      ))
      .limit(1);

    if (!attempt || attempt.amount !== order.totalAmount) return false;
    if (isSettledOrderStatus(order.status)) return true;
    if (order.status !== 'pending' || order.totalAmount <= 0) return false;

    return finalizePaymentInTransaction(tx, orderId, trackId, refNumber, 'gateway');
  });
}

async function recordUnresolvedZibalState(
  orderId: string,
  trackId: string,
  state: ZibalState,
  status: 'in_bank' | 'unknown',
): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [order] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order || order.status !== 'pending' || order.paymentAuthority !== trackId) return false;

    const [attempt] = await tx.select({ id: paymentAttempts.id, provider: paymentAttempts.provider, status: paymentAttempts.status })
      .from(paymentAttempts)
      .where(and(
        eq(paymentAttempts.orderId, orderId),
        eq(paymentAttempts.authority, trackId),
        eq(paymentAttempts.provider, 'zibal'),
      ))
      .limit(1);
    if (!attempt) return false;

    await tx.update(paymentAttempts).set({
      status,
      gatewayCode: state.result,
      gatewayMessage: (state.message || `Zibal verification status: ${state.status ?? 'unknown'}`).slice(0, 180),
      lastCheckedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(paymentAttempts.id, attempt.id));

    if (attempt.status !== status) {
      await appendOrderEvent(tx, {
        orderId,
        actorType: 'gateway',
        eventType: status === 'in_bank' ? 'payment.in_bank' : 'payment.reconciliation_pending',
        summary: status === 'in_bank'
          ? 'زیبال اعلام کرد تراکنش هنوز در بانک در حال انجام است؛ شناسه قبلی حفظ شد.'
          : 'نتیجه تأیید زیبال قطعی نیست؛ سفارش و شناسه تراکنش برای تطبیق حفظ شدند.',
        metadata: { gatewayCode: state.result, provider: 'zibal' },
      });
    }
    return true;
  });
}

async function recordDefinitiveZibalFailure(
  orderId: string,
  trackId: string,
  state: ZibalState,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [order] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order || order.status !== 'pending' || order.paymentAuthority !== trackId) return false;

    const [attempt] = await tx.select({ id: paymentAttempts.id, provider: paymentAttempts.provider })
      .from(paymentAttempts)
      .where(and(
        eq(paymentAttempts.orderId, orderId),
        eq(paymentAttempts.authority, trackId),
        eq(paymentAttempts.provider, 'zibal'),
      ))
      .limit(1);
    if (!attempt) return false;

    await tx.update(paymentAttempts).set({
      status: 'failed',
      gatewayCode: state.result,
      gatewayMessage: (state.message || 'Zibal reports that the payment was not completed.').slice(0, 180),
      lastCheckedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(paymentAttempts.id, attempt.id));

    await tx.update(orders).set({ paymentAuthority: null })
      .where(and(eq(orders.id, orderId), eq(orders.status, 'pending'), eq(orders.paymentAuthority, trackId)));

    await appendOrderEvent(tx, {
      orderId,
      actorType: 'gateway',
      eventType: 'payment.failed',
      summary: 'زیبال عدم تکمیل تراکنش را به‌صورت قطعی تأیید کرد؛ امکان تلاش مجدد فراهم شد.',
      metadata: { gatewayCode: state.result, provider: 'zibal' },
    });
    return true;
  });
}

export async function GET(req: Request) {
  let baseUrl: string;
  try {
    baseUrl = getBaseUrl();
  } catch {
    return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 });
  }

  const params = new URL(req.url).searchParams;
  const trackId = normalizeZibalTrackId(params.get('trackId'));
  const orderId = params.get('orderId');
  const callbackSuccess = params.get('success');

  try {
    if (!trackId || !orderId || !UUID_PATTERN.test(orderId)) {
      return failureRedirect(baseUrl, 'missing_params', UUID_PATTERN.test(orderId || '') ? orderId : null);
    }
    if (callbackSuccess !== null && callbackSuccess !== '0' && callbackSuccess !== '1') {
      return failureRedirect(baseUrl, 'invalid_callback', orderId);
    }

    const callbackLimit = await rateLimit('zibal-callback:' + getClientIp(req) + ':' + orderId, { failClosedOnStoreError: true });
    if (callbackLimit.unavailable) return failureRedirect(baseUrl, 'server_error', orderId);
    if (!callbackLimit.success) return failureRedirect(baseUrl, 'verify_failed', orderId);

    const merchantId = process.env.ZIBAL_MERCHANT_ID;
    if (!merchantId) return failureRedirect(baseUrl, 'server_error', orderId);

    const [order] = await db.select({
      id: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentAuthority: orders.paymentAuthority,
      trackingCode: orders.trackingCode,
    }).from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return failureRedirect(baseUrl, 'order_not_found', orderId);

    const [attempt] = await db.select({
      id: paymentAttempts.id,
      provider: paymentAttempts.provider,
      amount: paymentAttempts.amount,
      status: paymentAttempts.status,
    }).from(paymentAttempts)
      .where(and(
        eq(paymentAttempts.orderId, orderId),
        eq(paymentAttempts.authority, trackId),
      ))
      .limit(1);

    if (!attempt || attempt.provider !== 'zibal' || attempt.amount !== order.totalAmount || order.paymentAuthority !== trackId) {
      console.error('[SECURITY] Zibal callback ledger or authority mismatch', { orderId });
      return failureRedirect(baseUrl, 'security_error', orderId);
    }

    if (isSettledOrderStatus(order.status)) {
      return successRedirect(baseUrl, orderId, order.trackingCode);
    }
    if (order.status !== 'pending' || order.totalAmount <= 0) {
      return failureRedirect(baseUrl, 'invalid_order_state', orderId);
    }

    // The callback's `success` flag is only a hint. Every callback is verified
    // against Zibal's server API before an order can be marked as paid.
    let verification: Awaited<ReturnType<typeof verifyZibalPayment>>;
    try {
      verification = await verifyZibalPayment(merchantId, trackId);
    } catch (error) {
      console.error('[Zibal Callback Network Error]', error instanceof Error ? error.name : 'UnknownError');
      await recordUnresolvedZibalState(orderId, trackId, {
        result: null, status: null, amount: null, trackId, refNumber: null, message: 'Zibal verification network error.',
      }, 'unknown');
      return failureRedirect(baseUrl, 'payment_processing', orderId);
    }

    const { response, state } = verification;
    if (response.ok && isZibalPaymentVerified(state, order.totalAmount)) {
      const finalized = await settleVerifiedZibalOrder(orderId, trackId, state.refNumber);
      return finalized
        ? successRedirect(baseUrl, orderId, order.trackingCode)
        : failureRedirect(baseUrl, 'verification_conflict', orderId);
    }

    if (response.ok && isZibalDefinitiveFailure(state)) {
      const recorded = await recordDefinitiveZibalFailure(orderId, trackId, state);
      return recorded
        ? failureRedirect(baseUrl, 'payment_not_completed', orderId)
        : failureRedirect(baseUrl, 'verification_conflict', orderId);
    }

    if (response.ok && isZibalInProgress(state) && state.status === -1) {
      await recordUnresolvedZibalState(orderId, trackId, state, 'in_bank');
      return failureRedirect(baseUrl, 'payment_processing', orderId);
    }

    await recordUnresolvedZibalState(orderId, trackId, state, 'unknown');
    console.error('[Zibal Callback Unresolved]', {
      result: state.result,
      status: state.status,
      amountMatches: state.amount === order.totalAmount,
      callbackSuccess,
    });
    return failureRedirect(baseUrl, 'payment_processing', orderId);
  } catch (error) {
    console.error('[Zibal Callback Error]', error instanceof Error ? error.name : 'UnknownError');
    return failureRedirect(baseUrl, 'server_error', UUID_PATTERN.test(orderId || '') ? orderId : null);
  }
}
