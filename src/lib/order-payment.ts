import { and, eq, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { customers, orders } from '@/db/schema';

export const SETTLED_ORDER_STATUSES = ['paid', 'processing', 'shipped', 'delivered'] as const;

export function isSettledOrderStatus(status: string | null | undefined): boolean {
  return SETTLED_ORDER_STATUSES.includes(status as (typeof SETTLED_ORDER_STATUSES)[number]);
}

/**
 * Finalize an order only after the gateway has independently confirmed its authority.
 * The conditional status+authority update is the single-winner boundary, so loyalty points
 * can only be credited once even when the callback and the customer's retry request race.
 */
export async function finalizeVerifiedOrder(
  orderId: string,
  authority: string,
  refId: string | null,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    const [current] = await tx
      .select({
        status: orders.status,
        paymentAuthority: orders.paymentAuthority,
        customerId: orders.customerId,
        totalAmount: orders.totalAmount,
      })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!current) return false;
    if (isSettledOrderStatus(current.status)) return true;
    if (current.status !== 'pending' || current.paymentAuthority !== authority) return false;

    const [updated] = await tx
      .update(orders)
      .set({
        status: 'paid',
        ...(refId ? { paymentRefId: refId } : {}),
      })
      .where(and(
        eq(orders.id, orderId),
        eq(orders.status, 'pending'),
        eq(orders.paymentAuthority, authority),
      ))
      .returning({ id: orders.id });

    if (!updated) {
      const [latest] = await tx
        .select({ status: orders.status })
        .from(orders)
        .where(eq(orders.id, orderId))
        .limit(1);
      return isSettledOrderStatus(latest?.status);
    }

    if (current.customerId && current.totalAmount > 0) {
      const earnedPoints = Math.floor(current.totalAmount / 100000);
      if (earnedPoints > 0) {
        const [customer] = await tx
          .update(customers)
          .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${earnedPoints}` })
          .where(eq(customers.id, current.customerId))
          .returning({ loyaltyPoints: customers.loyaltyPoints });

        if (customer) {
          const newTier = customer.loyaltyPoints >= 1500
            ? 'gold'
            : customer.loyaltyPoints >= 500
              ? 'silver'
              : 'bronze';
          await tx
            .update(customers)
            .set({ tier: newTier })
            .where(eq(customers.id, current.customerId));
        }
      }
    }

    return true;
  });
}
