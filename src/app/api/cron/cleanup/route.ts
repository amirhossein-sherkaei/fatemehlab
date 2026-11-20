import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products, customers, coupons } from '@/db/schema';
import { and, eq, lt, sql, isNull, isNotNull } from 'drizzle-orm';

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

    const cutoff = new Date(Date.now() - 30 * 60 * 1000);
    const candidates = await db.select({ id: orders.id })
      .from(orders)
      .where(and(eq(orders.status, 'pending'), lt(orders.createdAt, cutoff), isNull(orders.paymentAuthority)));

    let cleanedCount = 0;
    let skippedCount = 0;

    for (const candidate of candidates) {
      const cleaned = await db.transaction(async (tx) => {
        // Claim the order first. This conditional transition is the idempotency boundary.
        const [claimed] = await tx.update(orders)
          .set({ status: 'cancelled' })
          .where(and(
            eq(orders.id, candidate.id),
            eq(orders.status, 'pending'),
            isNull(orders.paymentAuthority),
            lt(orders.createdAt, cutoff),
          ))
          .returning({ id: orders.id, customerId: orders.customerId, usedPoints: orders.usedPoints, couponCode: orders.couponCode });

        if (!claimed) return false;
        const items = await tx.select({ productId: orderItems.productId, quantity: orderItems.quantity })
          .from(orderItems).where(eq(orderItems.orderId, claimed.id));
        for (const item of items) {
          await tx.update(products)
            .set({ stock: sql`${products.stock} + ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
        if (claimed.usedPoints > 0 && claimed.customerId) {
          await tx.update(customers)
            .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${claimed.usedPoints}` })
            .where(eq(customers.id, claimed.customerId));
        }
        if (claimed.couponCode) {
          await tx.update(coupons)
            .set({ usedCount: sql`GREATEST(0, ${coupons.usedCount} - 1)` })
            .where(eq(coupons.code, claimed.couponCode));
        }
        return true;
      });
      if (cleaned) cleanedCount++;
      else skippedCount++;
    }

    const [awaitingPayment] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(orders)
      .where(and(eq(orders.status, 'pending'), lt(orders.createdAt, cutoff), isNotNull(orders.paymentAuthority)));

    return NextResponse.json({
      success: true,
      cleanedCount,
      skippedCount,
      awaitingPaymentReconciliation: awaitingPayment?.count || 0,
      message: `تعداد ${cleanedCount} سفارش بدون تراکنش فعال آزاد شد.`,
    });
  } catch (error) {
    console.error('[cron/cleanup]', error);
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}
