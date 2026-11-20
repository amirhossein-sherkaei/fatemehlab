import { randomUUID } from 'node:crypto';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { coupons, customers, orderEvents, orderItems, orders, paymentAttempts, products } from '@/db/schema';

export const SETTLED_ORDER_STATUSES = ['paid', 'processing', 'shipped', 'delivered'] as const;
export const ACTIVE_PAYMENT_ATTEMPT_STATUSES = ['requesting', 'unknown', 'awaiting_customer', 'in_bank', 'verified'] as const;

export function isSettledOrderStatus(status: string | null | undefined): boolean {
  return SETTLED_ORDER_STATUSES.includes(status as (typeof SETTLED_ORDER_STATUSES)[number]);
}

export function isUnresolvedPaymentAttempt(status: string | null | undefined): boolean {
  return ACTIVE_PAYMENT_ATTEMPT_STATUSES.includes(status as (typeof ACTIVE_PAYMENT_ATTEMPT_STATUSES)[number]);
}

export async function appendOrderEvent(
  tx: any,
  event: {
    orderId: string;
    actorType: 'customer' | 'admin' | 'gateway' | 'system';
    actorId?: string | null;
    eventType: string;
    fromStatus?: string | null;
    toStatus?: string | null;
    summary: string;
    metadata?: Record<string, string | number | boolean | null>;
  },
): Promise<void> {
  await tx.insert(orderEvents).values({
    orderId: event.orderId,
    actorType: event.actorType,
    actorId: event.actorId ?? null,
    eventType: event.eventType,
    fromStatus: event.fromStatus ?? null,
    toStatus: event.toStatus ?? null,
    summary: event.summary,
    metadata: event.metadata ?? {},
  });
}

async function recalculateCustomerTier(tx: any, customerId: string): Promise<void> {
  const [customer] = await tx.select({ loyaltyPoints: customers.loyaltyPoints })
    .from(customers).where(eq(customers.id, customerId)).limit(1);
  if (!customer) return;
  const tier = customer.loyaltyPoints >= 1500 ? 'gold' : customer.loyaltyPoints >= 500 ? 'silver' : 'bronze';
  await tx.update(customers).set({ tier }).where(eq(customers.id, customerId));
}

/** Must be called inside a transaction while holding the shared order payment advisory lock. */
export async function finalizePaymentInTransaction(
  tx: any,
  orderId: string,
  authority: string,
  refId: string | null,
  actorType: 'gateway' | 'system' = 'gateway',
): Promise<boolean> {
  const [current] = await tx.select({
    status: orders.status,
    paymentAuthority: orders.paymentAuthority,
    customerId: orders.customerId,
    totalAmount: orders.totalAmount,
    trackingCode: orders.trackingCode,
  }).from(orders).where(eq(orders.id, orderId)).limit(1);

  if (!current) return false;
  if (isSettledOrderStatus(current.status)) return current.paymentAuthority === authority;
  if (current.status !== 'pending' || current.paymentAuthority !== authority || current.totalAmount <= 0) return false;

  const [attempt] = await tx.select({ id: paymentAttempts.id, amount: paymentAttempts.amount, status: paymentAttempts.status, attemptNumber: paymentAttempts.attemptNumber })
    .from(paymentAttempts)
    .where(and(eq(paymentAttempts.orderId, orderId), eq(paymentAttempts.authority, authority)))
    .limit(1);
  if (attempt && (attempt.amount !== current.totalAmount || ['failed', 'reversed'].includes(attempt.status))) return false;

  const [updated] = await tx.update(orders)
    .set({ status: 'paid', ...(refId ? { paymentRefId: refId } : {}) })
    .where(and(eq(orders.id, orderId), eq(orders.status, 'pending'), eq(orders.paymentAuthority, authority)))
    .returning({ id: orders.id });
  if (!updated) {
    const [latest] = await tx.select({ status: orders.status }).from(orders).where(eq(orders.id, orderId)).limit(1);
    return isSettledOrderStatus(latest?.status);
  }

  if (attempt) {
    await tx.update(paymentAttempts)
      .set({ status: 'verified', refId, gatewayCode: 100, lastCheckedAt: new Date(), verifiedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(paymentAttempts.id, attempt.id), eq(paymentAttempts.orderId, orderId), eq(paymentAttempts.authority, authority)));
  } else {
    // Backward compatibility for an authority created before the attempt ledger
    // was introduced. Continue the order's sequence if another legacy/partial row exists.
    const [lastAttempt] = await tx.select({ attemptNumber: paymentAttempts.attemptNumber })
      .from(paymentAttempts).where(eq(paymentAttempts.orderId, orderId))
      .orderBy(sql`${paymentAttempts.attemptNumber} DESC`).limit(1);
    await tx.insert(paymentAttempts).values({
      orderId,
      requestKey: randomUUID(),
      attemptNumber: (lastAttempt?.attemptNumber ?? 0) + 1,
      amount: current.totalAmount,
      status: 'verified',
      authority,
      refId,
      gatewayCode: 100,
      gatewayMessage: 'Verified callback for a legacy transaction.',
      requestedAt: new Date(),
      lastCheckedAt: new Date(),
      verifiedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  if (current.customerId && current.totalAmount > 0) {
    const earnedPoints = Math.floor(current.totalAmount / 100000);
    if (earnedPoints > 0) {
      await tx.update(customers)
        .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${earnedPoints}` })
        .where(eq(customers.id, current.customerId));
      await recalculateCustomerTier(tx, current.customerId);
    }
  }

  await appendOrderEvent(tx, {
    orderId,
    actorType,
    eventType: 'payment.verified',
    fromStatus: 'pending',
    toStatus: 'paid',
    summary: 'پرداخت توسط درگاه و سرور تأیید شد.',
    metadata: { ...(refId ? { refId } : {}), amount: current.totalAmount },
  });
  return true;
}

/** Reconciles an order only after the gateway has independently confirmed payment. */
export async function finalizeVerifiedOrder(orderId: string, authority: string, refId: string | null): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    return finalizePaymentInTransaction(tx, orderId, authority, refId, 'system');
  });
}

/**
 * Cancel an unpaid order and release its reserved resources exactly once.
 * Caller must hold the shared order payment advisory lock and must only pass
 * expectedAuthority after a definitive gateway FAILED/REVERSED result.
 */
export async function cancelPendingOrderInTransaction(
  tx: any,
  orderId: string,
  options: { actorType: 'admin' | 'system'; actorId?: string | null; expectedAuthority?: string; summary?: string },
): Promise<boolean> {
  const [current] = await tx.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  if (!current || current.status !== 'pending') return false;
  if (options.expectedAuthority === undefined && current.paymentAuthority) return false;
  if (options.expectedAuthority !== undefined && current.paymentAuthority !== options.expectedAuthority) return false;

  const conditions = [eq(orders.id, orderId), eq(orders.status, 'pending')];
  if (options.expectedAuthority === undefined) conditions.push(isNull(orders.paymentAuthority));
  else conditions.push(eq(orders.paymentAuthority, options.expectedAuthority));

  const [claimed] = await tx.update(orders)
    .set({ status: 'cancelled', paymentAuthority: null })
    .where(and(...conditions))
    .returning({ id: orders.id, customerId: orders.customerId, usedPoints: orders.usedPoints, couponCode: orders.couponCode });
  if (!claimed) return false;

  const items = await tx.select({ productId: orderItems.productId, quantity: orderItems.quantity })
    .from(orderItems).where(eq(orderItems.orderId, orderId));
  for (const item of items) {
    await tx.update(products)
      .set({ stock: sql`${products.stock} + ${item.quantity}` })
      .where(eq(products.id, item.productId));
  }

  if (claimed.usedPoints > 0 && claimed.customerId) {
    await tx.update(customers)
      .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${claimed.usedPoints}` })
      .where(eq(customers.id, claimed.customerId));
    await recalculateCustomerTier(tx, claimed.customerId);
  }
  if (claimed.couponCode) {
    await tx.update(coupons)
      .set({ usedCount: sql`GREATEST(0, ${coupons.usedCount} - 1)` })
      .where(eq(coupons.code, claimed.couponCode));
  }

  await appendOrderEvent(tx, {
    orderId,
    actorType: options.actorType,
    actorId: options.actorId ?? null,
    eventType: 'order.cancelled',
    fromStatus: 'pending',
    toStatus: 'cancelled',
    summary: options.summary ?? 'سفارش پرداخت‌نشده لغو و منابع رزروشده آزاد شد.',
    metadata: { releasedItemLines: items.length, restoredPoints: claimed.usedPoints, couponRestored: Boolean(claimed.couponCode) },
  });
  return true;
}
