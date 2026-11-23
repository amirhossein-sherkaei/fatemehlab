import { NextResponse } from 'next/server';
import { and, asc, desc, eq, lt, sql, isNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, paymentAttempts, rateLimitBuckets } from '@/db/schema';
import {
  appendOrderEvent,
  cancelPendingOrderInTransaction,
  finalizePaymentInTransaction,
  isUnresolvedPaymentAttempt,
} from '@/lib/order-payment';
import {
  isZibalDefinitiveFailure,
  isZibalInProgress,
  isZibalPaymentVerified,
  verifyZibalPayment,
} from '@/lib/zibal';

const MAX_ORDERS_PER_RUN = 50;
const PAYMENT_REQUEST_STALE_MS = 2 * 60 * 1000;
const ORDER_HOLD_MS = 30 * 60 * 1000;

async function getLatestAttempt(orderId: string) {
  const [attempt] = await db.select().from(paymentAttempts)
    .where(eq(paymentAttempts.orderId, orderId))
    .orderBy(desc(paymentAttempts.attemptNumber))
    .limit(1);
  return attempt ?? null;
}

async function getZibalAttempt(orderId: string, authority: string) {
  const [attempt] = await db.select().from(paymentAttempts)
    .where(and(
      eq(paymentAttempts.orderId, orderId),
      eq(paymentAttempts.authority, authority),
      eq(paymentAttempts.provider, 'zibal'),
    ))
    .limit(1);
  return attempt ?? null;
}

async function repairAuthorityPointer(orderId: string, authority: string): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [current] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!current || current.status !== 'pending') return false;
    if (current.paymentAuthority === authority) return true;
    if (current.paymentAuthority) return false;

    const [attempt] = await tx.select({ status: paymentAttempts.status, authority: paymentAttempts.authority, provider: paymentAttempts.provider })
      .from(paymentAttempts)
      .where(and(
        eq(paymentAttempts.orderId, orderId),
        eq(paymentAttempts.authority, authority),
        eq(paymentAttempts.provider, 'zibal'),
      ))
      .limit(1);
    if (!attempt || !['awaiting_customer', 'in_bank', 'unknown', 'verified'].includes(attempt.status)) return false;

    const [updated] = await tx.update(orders).set({ paymentAuthority: authority })
      .where(and(eq(orders.id, orderId), eq(orders.status, 'pending'), isNull(orders.paymentAuthority)))
      .returning({ id: orders.id });
    if (updated) {
      await appendOrderEvent(tx, {
        orderId,
        actorType: 'system',
        eventType: 'payment.authority_pointer_repaired',
        summary: 'پیوند تراکنش زیبال از دفتر تلاش‌های پرداخت بازیابی شد.',
        metadata: { provider: 'zibal' },
      });
    }
    return Boolean(updated);
  });
}

async function markZibalAttemptStatus(
  orderId: string,
  authority: string,
  status: 'in_bank' | 'unknown',
  gatewayCode: number | null,
  message: string,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [order] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order || order.status !== 'pending' || order.paymentAuthority !== authority) return false;

    const [attempt] = await tx.select({ id: paymentAttempts.id, status: paymentAttempts.status, provider: paymentAttempts.provider })
      .from(paymentAttempts)
      .where(and(
        eq(paymentAttempts.orderId, orderId),
        eq(paymentAttempts.authority, authority),
        eq(paymentAttempts.provider, 'zibal'),
      ))
      .limit(1);
    if (!attempt || attempt.provider !== 'zibal') return false;

    await tx.update(paymentAttempts).set({
      status,
      gatewayCode,
      gatewayMessage: message.slice(0, 180),
      lastCheckedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(paymentAttempts.id, attempt.id));

    if (attempt.status !== status) {
      await appendOrderEvent(tx, {
        orderId,
        actorType: 'system',
        eventType: status === 'in_bank' ? 'payment.in_bank' : 'payment.reconciliation_pending',
        summary: status === 'in_bank'
          ? 'استعلام زمان‌بندی‌شده زیبال نشان داد تراکنش هنوز در بانک در حال انجام است؛ منابع سفارش حفظ شدند.'
          : 'وضعیت تراکنش زیبال هنوز قطعی نیست؛ سفارش و منابع رزروشده حفظ شدند.',
        metadata: { gatewayCode, provider: 'zibal' },
      });
    }
    return true;
  });
}

async function settleZibalOrder(orderId: string, authority: string, amount: number, refNumber: string | null): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [order] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority, totalAmount: orders.totalAmount })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order || order.paymentAuthority !== authority || order.totalAmount !== amount) return false;

    const [attempt] = await tx.select({ provider: paymentAttempts.provider, amount: paymentAttempts.amount })
      .from(paymentAttempts)
      .where(and(
        eq(paymentAttempts.orderId, orderId),
        eq(paymentAttempts.authority, authority),
        eq(paymentAttempts.provider, 'zibal'),
      ))
      .limit(1);
    if (!attempt || attempt.provider !== 'zibal' || attempt.amount !== order.totalAmount) return false;
    if (order.status !== 'pending' && !['paid', 'processing', 'shipped', 'delivered'].includes(order.status)) return false;

    return finalizePaymentInTransaction(tx, orderId, authority, refNumber, 'system');
  });
}

async function failAndExpireZibalOrder(
  orderId: string,
  authority: string,
  gatewayCode: number | null,
  message: string,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [order] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order || order.status !== 'pending' || order.paymentAuthority !== authority) return false;

    const [attempt] = await tx.select({ id: paymentAttempts.id, provider: paymentAttempts.provider })
      .from(paymentAttempts)
      .where(and(
        eq(paymentAttempts.orderId, orderId),
        eq(paymentAttempts.authority, authority),
        eq(paymentAttempts.provider, 'zibal'),
      ))
      .limit(1);
    if (!attempt) return false;

    await tx.update(paymentAttempts).set({
      status: 'failed',
      gatewayCode,
      gatewayMessage: message.slice(0, 180),
      lastCheckedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(paymentAttempts.id, attempt.id));

    await appendOrderEvent(tx, {
      orderId,
      actorType: 'gateway',
      eventType: 'payment.failed',
      summary: 'زیبال در استعلام زمان‌بندی‌شده عدم تکمیل تراکنش را قطعی اعلام کرد.',
      metadata: { gatewayCode, provider: 'zibal' },
    });
    return cancelPendingOrderInTransaction(tx, orderId, {
      actorType: 'system',
      expectedAuthority: authority,
      summary: 'پس از پاسخ قطعی زیبال مبنی بر ناموفق بودن تراکنش و پایان مهلت نگهداری، سفارش لغو و موجودی، کوپن و امتیازهای رزروشده آزاد شدند.',
    });
  });
}

async function expireWithoutActiveAttempt(orderId: string): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [current] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!current || current.status !== 'pending' || current.paymentAuthority) return false;

    const [latest] = await tx.select({ status: paymentAttempts.status, createdAt: paymentAttempts.createdAt })
      .from(paymentAttempts).where(eq(paymentAttempts.orderId, orderId))
      .orderBy(desc(paymentAttempts.attemptNumber)).limit(1);

    if (latest && isUnresolvedPaymentAttempt(latest.status)) return false;
    return cancelPendingOrderInTransaction(tx, orderId, {
      actorType: 'system',
      summary: 'سفارش پرداخت‌نشده پس از پایان مهلت نگهداری و بدون تراکنش فعال لغو شد؛ منابع رزروشده آزاد شدند.',
    });
  });
}

export async function GET(req: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || cronSecret.length < 16) {
      console.error('[cron/cleanup] CRON_SECRET is not configured or too short');
      return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 });
    }
    if (req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const merchantId = process.env.ZIBAL_MERCHANT_ID;
    const cutoff = new Date(Date.now() - ORDER_HOLD_MS);
    const candidates = await db.select({ id: orders.id, paymentAuthority: orders.paymentAuthority })
      .from(orders)
      .where(and(eq(orders.status, 'pending'), lt(orders.createdAt, cutoff)))
      .orderBy(asc(orders.createdAt))
      .limit(MAX_ORDERS_PER_RUN);

    let cleanedCount = 0;
    let settledCount = 0;
    let inBankCount = 0;
    let heldUnknownCount = 0;
    let skippedCount = 0;
    let verificationErrorCount = 0;

    for (const candidate of candidates) {
      let authority = candidate.paymentAuthority;
      let latest = await getLatestAttempt(candidate.id);

      if (!authority && latest?.provider === 'zibal' && latest.authority && ['awaiting_customer', 'in_bank', 'unknown', 'verified'].includes(latest.status)) {
        const repaired = await repairAuthorityPointer(candidate.id, latest.authority);
        if (repaired) authority = latest.authority;
      }

      if (!authority) {
        if (latest?.status === 'requesting') {
          if (Date.now() - latest.createdAt.getTime() > PAYMENT_REQUEST_STALE_MS) {
            await db.update(paymentAttempts).set({
              status: 'unknown',
              gatewayMessage: 'Cron found a stale payment request without a persisted Zibal trackId; manual reconciliation required.',
              lastCheckedAt: new Date(),
              updatedAt: new Date(),
            }).where(and(eq(paymentAttempts.id, latest.id), eq(paymentAttempts.status, 'requesting'), eq(paymentAttempts.provider, 'zibal')));
            heldUnknownCount++;
          } else {
            skippedCount++;
          }
          continue;
        }
        if (latest && isUnresolvedPaymentAttempt(latest.status)) {
          // A legacy/unknown provider is deliberately never sent to Zibal.
          heldUnknownCount++;
          continue;
        }
        const cleaned = await expireWithoutActiveAttempt(candidate.id);
        if (cleaned) cleanedCount++;
        else skippedCount++;
        continue;
      }

      const matchingAttempt = await getZibalAttempt(candidate.id, authority);
      if (!matchingAttempt) {
        // Never call Zibal with a trackId/authority from a different provider.
        heldUnknownCount++;
        continue;
      }
      if (!merchantId) {
        heldUnknownCount++;
        continue;
      }

      try {
        const verification = await verifyZibalPayment(merchantId, authority);
        const { response, state } = verification;

        if (response.ok && isZibalPaymentVerified(state, matchingAttempt.amount)) {
          const finalized = await settleZibalOrder(candidate.id, authority, matchingAttempt.amount, state.refNumber);
          if (finalized) settledCount++;
          else skippedCount++;
          continue;
        }

        if (response.ok && isZibalDefinitiveFailure(state)) {
          const expired = await failAndExpireZibalOrder(candidate.id, authority, state.result, state.message || 'Zibal reports definitive payment failure.');
          if (expired) cleanedCount++;
          else skippedCount++;
          continue;
        }

        if (response.ok && isZibalInProgress(state) && state.status === -1) {
          const updated = await markZibalAttemptStatus(candidate.id, authority, 'in_bank', state.result, state.message || 'Zibal payment is still in progress at the bank.');
          if (updated) inBankCount++;
          else skippedCount++;
          continue;
        }

        const updated = await markZibalAttemptStatus(
          candidate.id,
          authority,
          'unknown',
          state.result,
          state.message || `Zibal verification unresolved (HTTP ${response.status}, status ${state.status ?? 'unknown'}).`,
        );
        if (!response.ok) verificationErrorCount++;
        if (updated) heldUnknownCount++;
        else skippedCount++;
      } catch (error) {
        console.error('[cron/cleanup:zibal-reconcile]', candidate.id, error instanceof Error ? error.name : 'UnknownError');
        verificationErrorCount++;
        heldUnknownCount++;
      }
    }

    const [pendingSummary] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(orders).where(and(eq(orders.status, 'pending'), lt(orders.createdAt, cutoff)));

    // Remove only expired hashed limiter buckets; no raw identifiers are stored.
    const rateLimitRetention = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const deletedRateLimitRows = await db.delete(rateLimitBuckets)
      .where(lt(rateLimitBuckets.updatedAt, rateLimitRetention))
      .returning({ keyHash: rateLimitBuckets.keyHash });

    return NextResponse.json({
      success: true,
      scannedCount: candidates.length,
      cleanedCount,
      settledCount,
      inBankCount,
      heldUnknownCount,
      verificationErrorCount,
      skippedCount,
      pendingOlderThanHoldWindow: pendingSummary?.count || 0,
      deletedExpiredRateLimitBuckets: deletedRateLimitRows.length,
      message: 'تراکنش‌های قدیمی فقط از زیبال و با شناسه‌ای که در دفتر پرداخت متعلق به همین درگاه است تطبیق داده شدند؛ پاسخ برگشت از بانک به‌تنهایی پرداخت محسوب نشد. وضعیت‌های نامشخص حفظ شدند و سوابق درگاه قبلی حذف نشدند.',
    });
  } catch (error) {
    console.error('[cron/cleanup]', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}
