import { NextResponse } from 'next/server';
import { and, asc, desc, eq, lt, sql, isNull } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, paymentAttempts, rateLimitBuckets } from '@/db/schema';
import {
  appendOrderEvent,
  cancelPendingOrderInTransaction,
  finalizePaymentInTransaction,
  finalizeVerifiedOrder,
  isUnresolvedPaymentAttempt,
} from '@/lib/order-payment';
import { inquireZarinpalAuthority, verifyZarinpalAuthority } from '@/lib/zarinpal';

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

async function repairAuthorityPointer(orderId: string, authority: string): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [current] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!current || current.status !== 'pending') return false;
    if (current.paymentAuthority === authority) return true;
    if (current.paymentAuthority) return false;

    const [attempt] = await tx.select({ status: paymentAttempts.status, authority: paymentAttempts.authority })
      .from(paymentAttempts)
      .where(and(eq(paymentAttempts.orderId, orderId), eq(paymentAttempts.authority, authority)))
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
        summary: 'پیوند تراکنش قبلی از دفتر تلاش‌های پرداخت بازیابی شد.',
      });
    }
    return Boolean(updated);
  });
}

async function markAttemptStatus(orderId: string, authority: string, status: 'in_bank' | 'unknown' | 'failed' | 'reversed', gatewayCode: number | null, message: string): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [order] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order || order.status !== 'pending' || order.paymentAuthority !== authority) return false;

    const [attempt] = await tx.select({ id: paymentAttempts.id, status: paymentAttempts.status })
      .from(paymentAttempts)
      .where(and(eq(paymentAttempts.orderId, orderId), eq(paymentAttempts.authority, authority)))
      .limit(1);
    if (!attempt) return false;

    await tx.update(paymentAttempts).set({
      status,
      gatewayCode,
      gatewayMessage: message.slice(0, 180),
      lastCheckedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(paymentAttempts.id, attempt.id));

    if (status === 'failed' || status === 'reversed') {
      await appendOrderEvent(tx, {
        orderId,
        actorType: 'gateway',
        eventType: status === 'failed' ? 'payment.failed' : 'payment.reversed',
        summary: status === 'failed' ? 'استعلام زمان‌بندی‌شده زرین‌پال تراکنش را ناموفق اعلام کرد.' : 'استعلام زمان‌بندی‌شده زرین‌پال تراکنش را برگشت‌خورده اعلام کرد.',
        metadata: { gatewayCode },
      });
      return cancelPendingOrderInTransaction(tx, orderId, {
        actorType: 'system',
        expectedAuthority: authority,
        summary: 'پس از پاسخ قطعی درگاه مبنی بر ناموفق/برگشت‌خورده بودن تراکنش، سفارش منقضی و موجودی، کوپن و امتیازهای رزروشده آزاد شدند.',
      });
    }

    if (attempt.status !== status) {
      await appendOrderEvent(tx, {
        orderId,
        actorType: 'system',
        eventType: status === 'in_bank' ? 'payment.in_bank' : 'payment.reconciliation_pending',
        summary: status === 'in_bank' ? 'درگاه اعلام کرد تراکنش هنوز در بانک در حال انجام است؛ منابع سفارش حفظ شدند.' : 'وضعیت تراکنش از درگاه هنوز قطعی نیست؛ منابع سفارش حفظ شدند.',
        metadata: { gatewayCode },
      });
    }
    return true;
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

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
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
    let inquiryErrorCount = 0;

    for (const candidate of candidates) {
      let authority = candidate.paymentAuthority;
      let latest = await getLatestAttempt(candidate.id);

      if (!authority && latest?.authority && ['awaiting_customer', 'in_bank', 'unknown', 'verified'].includes(latest.status)) {
        const repaired = await repairAuthorityPointer(candidate.id, latest.authority);
        if (repaired) authority = latest.authority;
      }

      if (!authority) {
        if (latest?.status === 'requesting') {
          if (Date.now() - latest.createdAt.getTime() > PAYMENT_REQUEST_STALE_MS) {
            await db.update(paymentAttempts).set({
              status: 'unknown',
              gatewayMessage: 'Cron found an expired request without a persisted authority; manual reconciliation required.',
              lastCheckedAt: new Date(),
              updatedAt: new Date(),
            }).where(and(eq(paymentAttempts.id, latest.id), eq(paymentAttempts.status, 'requesting')));
            heldUnknownCount++;
          } else {
            skippedCount++;
          }
          continue;
        }
        if (latest && isUnresolvedPaymentAttempt(latest.status)) {
          heldUnknownCount++;
          continue;
        }
        const cleaned = await expireWithoutActiveAttempt(candidate.id);
        if (cleaned) cleanedCount++;
        else skippedCount++;
        continue;
      }

      if (!merchantId) {
        heldUnknownCount++;
        continue;
      }

      try {
        const inquiry = await inquireZarinpalAuthority(merchantId, authority);
        const state = inquiry.result;
        if (!inquiry.response.ok || state.code !== 100 || !state.status) {
          inquiryErrorCount++;
          heldUnknownCount++;
          continue;
        }

        if (state.status === 'VERIFIED') {
          const finalized = await finalizeVerifiedOrder(candidate.id, authority, state.refId);
          if (finalized) settledCount++;
          else skippedCount++;
          continue;
        }

        if (state.status === 'PAID') {
          const current = await db.select({ totalAmount: orders.totalAmount, status: orders.status, paymentAuthority: orders.paymentAuthority })
            .from(orders).where(eq(orders.id, candidate.id)).limit(1);
          const order = current[0];
          if (!order || order.status !== 'pending' || order.paymentAuthority !== authority) {
            skippedCount++;
            continue;
          }
          const verification = await verifyZarinpalAuthority(merchantId, order.totalAmount, authority);
          if (verification.response.ok && [100, 101].includes(verification.result.code)) {
            const finalized = await finalizeVerifiedOrder(candidate.id, authority, verification.result.refId ?? state.refId);
            if (finalized) settledCount++;
            else skippedCount++;
          } else {
            await markAttemptStatus(candidate.id, authority, 'unknown', verification.result.code, 'Inquiry reported PAID but final verification is unresolved.');
            heldUnknownCount++;
          }
          continue;
        }

        if (state.status === 'IN_BANK') {
          const updated = await markAttemptStatus(candidate.id, authority, 'in_bank', state.code, 'IN_BANK');
          if (updated) inBankCount++;
          else skippedCount++;
          continue;
        }

        if (state.status === 'FAILED' || state.status === 'REVERSED') {
          const result = await markAttemptStatus(candidate.id, authority, state.status === 'FAILED' ? 'failed' : 'reversed', state.code, state.status);
          if (result) cleanedCount++;
          else skippedCount++;
          continue;
        }

        await markAttemptStatus(candidate.id, authority, 'unknown', state.code, `Unrecognized inquiry status: ${state.status}`);
        heldUnknownCount++;
      } catch (error) {
        console.error('[cron/cleanup:reconcile]', candidate.id, error);
        inquiryErrorCount++;
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
      inquiryErrorCount,
      skippedCount,
      pendingOlderThanHoldWindow: pendingSummary?.count || 0,
      deletedExpiredRateLimitBuckets: deletedRateLimitRows.length,
      message: 'تراکنش‌های قدیمی ابتدا از زرین‌پال استعلام شدند؛ فقط پرداخت قطعی ثبت شد و فقط سفارش‌های بدون تراکنش فعال یا با نتیجه قطعی ناموفق لغو شدند. وضعیت‌های نامشخص و درحال انجام حفظ شدند.',
    });
  } catch (error) {
    console.error('[cron/cleanup]', error);
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}
