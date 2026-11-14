import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products, customers, coupons } from '@/db/schema';
import { and, eq, lt, sql } from 'drizzle-orm';


export async function GET(req: Request) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || cronSecret.length < 16) {
      console.error('[cron/cleanup] CRON_SECRET is not configured or too short');
      return NextResponse.json({ message: 'Server misconfigured' }, { status: 500 });
    }

    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);

    const pendingOrders = await db
      .select()
      .from(orders)
      .where(and(eq(orders.status, 'pending'), lt(orders.createdAt, thirtyMinsAgo)));

    let cleanedCount = 0;

    for (const order of pendingOrders) {
      await db.transaction(async (tx) => {
        const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        for (const item of items) {
          await tx.update(products)
            .set({ stock: sql`${products.stock} + ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }

        if (order.usedPoints > 0 && order.customerId) {
          await tx.update(customers)
            .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${order.usedPoints}` })
            .where(eq(customers.id, order.customerId));
        }

        if (order.couponCode) {
          await tx.update(coupons)
            .set({ usedCount: sql`${coupons.usedCount} - 1` })
            .where(eq(coupons.code, order.couponCode));
        }

        await tx.update(orders).set({ status: 'cancelled' }).where(eq(orders.id, order.id));
      });
      cleanedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `تعداد ${cleanedCount} سفارش رها شده پاکسازی شد.`,
    });
  } catch (error) {
    console.error('Cron cleanup error:', error);
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}