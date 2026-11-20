import { NextResponse } from 'next/server';
import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, paymentAttempts } from '@/db/schema';
import { appendOrderEvent, finalizeVerifiedOrder, isSettledOrderStatus } from '@/lib/order-payment';
import { inquireZarinpalAuthority, verifyZarinpalAuthority, type ZarinpalInquiryState } from '@/lib/zarinpal';
import { getClientIp } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

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

async function recordGatewayState(
  orderId: string,
  authority: string,
  state: ZarinpalInquiryState,
): Promise<boolean> {
  const status = state.status === 'FAILED' ? 'failed'
    : state.status === 'REVERSED' ? 'reversed'
      : state.status === 'IN_BANK' ? 'in_bank'
        : 'unknown';

  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [order] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order || order.status !== 'pending' || order.paymentAuthority !== authority) return false;

    const [attempt] = await tx.select({ id: paymentAttempts.id, status: paymentAttempts.status })
      .from(paymentAttempts)
      .where(and(eq(paymentAttempts.orderId, orderId), eq(paymentAttempts.authority, authority)))
      .limit(1);

    if (attempt) {
      await tx.update(paymentAttempts).set({
        status,
        gatewayCode: Number.isFinite(state.code) ? state.code : null,
        gatewayMessage: state.status || 'Unknown gateway state',
        lastCheckedAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(paymentAttempts.id, attempt.id));
    }

    if (status === 'failed' || status === 'reversed') {
      await appendOrderEvent(tx, {
        orderId,
        actorType: 'gateway',
        eventType: status === 'failed' ? 'payment.failed' : 'payment.reversed',
        summary: status === 'failed' ? 'زرین‌پال تراکنش را ناموفق اعلام کرد؛ سفارش برای تلاش مجدد حفظ شد.' : 'زرین‌پال تراکنش را برگشت‌خورده اعلام کرد؛ سفارش برای تلاش مجدد حفظ شد.',
        metadata: { gatewayCode: state.code },
      });
    } else if (status === 'in_bank') {
      await appendOrderEvent(tx, {
        orderId,
        actorType: 'gateway',
        eventType: 'payment.in_bank',
        summary: 'درگاه اعلام کرد تراکنش هنوز در بانک در حال انجام است؛ پرداخت جدیدی ساخته نمی‌شود.',
        metadata: { gatewayCode: state.code },
      });
    }
    return true;
  });
}

async function reconcileInquiry(
  merchantId: string,
  orderId: string,
  amount: number,
  authority: string,
  trackingCode: string,
  baseUrl: string,
  inquiry: Awaited<ReturnType<typeof inquireZarinpalAuthority>>,
) {
  const state = inquiry.result;
  if (!inquiry.response.ok || state.code !== 100 || !state.status) {
    console.error('[Zarinpal Inquiry Response]', inquiry.data);
    return failureRedirect(baseUrl, 'verify_failed', orderId);
  }

  if (state.status === 'VERIFIED') {
    const finalized = await finalizeVerifiedOrder(orderId, authority, state.refId);
    return finalized ? successRedirect(baseUrl, orderId, trackingCode) : failureRedirect(baseUrl, 'verification_conflict', orderId);
  }

  if (state.status === 'PAID') {
    let verification;
    try {
      verification = await verifyZarinpalAuthority(merchantId, amount, authority);
    } catch (error) {
      console.error('[Zarinpal verify after inquiry PAID]', error);
      return failureRedirect(baseUrl, 'payment_processing', orderId);
    }
    if (verification.response.ok && [100, 101].includes(verification.result.code)) {
      const finalized = await finalizeVerifiedOrder(orderId, authority, verification.result.refId ?? state.refId);
      return finalized ? successRedirect(baseUrl, orderId, trackingCode) : failureRedirect(baseUrl, 'verification_conflict', orderId);
    }
    await recordGatewayState(orderId, authority, { ...state, status: 'PAID', code: verification.result.code });
    return failureRedirect(baseUrl, 'payment_processing', orderId);
  }

  if (state.status === 'FAILED' || state.status === 'REVERSED' || state.status === 'IN_BANK') {
    await recordGatewayState(orderId, authority, state);
    return failureRedirect(baseUrl, state.status === 'IN_BANK' ? 'payment_processing' : 'payment_not_completed', orderId);
  }

  await recordGatewayState(orderId, authority, state);
  return failureRedirect(baseUrl, 'verify_failed', orderId);
}

export async function GET(req: Request) {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir').replace(/\/+$/, '');
  const params = new URL(req.url).searchParams;
  const authority = params.get('Authority');
  const callbackStatus = params.get('Status');
  const orderId = params.get('orderId');

  try {
    if (!authority || authority.length > 128 || /[^a-zA-Z0-9_-]/.test(authority) || !orderId || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(orderId)) {
      return failureRedirect(baseUrl, 'missing_params', orderId);
    }
    if (callbackStatus !== 'OK' && callbackStatus !== 'NOK') return failureRedirect(baseUrl, 'invalid_callback', orderId);

    const callbackLimit = await rateLimit('payment-callback:' + getClientIp(req) + ':' + orderId, { failClosedOnStoreError: true });
    if (callbackLimit.unavailable) return failureRedirect(baseUrl, 'server_error', orderId);
    if (!callbackLimit.success) return failureRedirect(baseUrl, 'verify_failed', orderId);

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) return failureRedirect(baseUrl, 'server_error', orderId);

    // Read first, perform network calls outside the DB transaction, then use the
    // shared advisory lock only for the atomic state transition. This prevents
    // holding a database connection/lock while waiting on the remote gateway.
    const [order] = await db.select({
      id: orders.id,
      status: orders.status,
      totalAmount: orders.totalAmount,
      paymentAuthority: orders.paymentAuthority,
      trackingCode: orders.trackingCode,
    }).from(orders).where(eq(orders.id, orderId)).limit(1);

    if (!order) return failureRedirect(baseUrl, 'order_not_found', orderId);
    if (order.paymentAuthority !== authority) {
      console.error('[SECURITY] Zarinpal authority mismatch for order ' + orderId);
      return failureRedirect(baseUrl, 'security_error', orderId);
    }
    if (order.status === 'cancelled') return failureRedirect(baseUrl, 'cancelled', orderId);
    if (isSettledOrderStatus(order.status)) return successRedirect(baseUrl, orderId, order.trackingCode);
    if (order.status !== 'pending') return failureRedirect(baseUrl, 'invalid_order_state', orderId);

    if (callbackStatus === 'NOK') {
      let inquiry;
      try {
        inquiry = await inquireZarinpalAuthority(merchantId, authority);
      } catch (error) {
        console.error('[Zarinpal NOK Inquiry Error]', error);
        return failureRedirect(baseUrl, 'verify_failed', orderId);
      }
      return reconcileInquiry(merchantId, orderId, order.totalAmount, authority, order.trackingCode, baseUrl, inquiry);
    }

    let verification;
    try {
      verification = await verifyZarinpalAuthority(merchantId, order.totalAmount, authority);
    } catch (error) {
      console.error('[Zarinpal Verify Request Error]', error);
      return failureRedirect(baseUrl, 'payment_processing', orderId);
    }

    if (verification.response.ok && [100, 101].includes(verification.result.code)) {
      const finalized = await finalizeVerifiedOrder(orderId, authority, verification.result.refId);
      return finalized ? successRedirect(baseUrl, orderId, order.trackingCode) : failureRedirect(baseUrl, 'verification_conflict', orderId);
    }

    console.error('[Zarinpal Verify Error]', verification.data);
    let fallbackInquiry;
    try {
      fallbackInquiry = await inquireZarinpalAuthority(merchantId, authority);
    } catch (error) {
      console.error('[Zarinpal Verify Fallback Inquiry Error]', error);
      return failureRedirect(baseUrl, 'payment_processing', orderId);
    }
    return reconcileInquiry(merchantId, orderId, order.totalAmount, authority, order.trackingCode, baseUrl, fallbackInquiry);
  } catch (error) {
    console.error('[Payment Verify Error]', error);
    return failureRedirect(baseUrl, 'server_error', orderId);
  }
}
