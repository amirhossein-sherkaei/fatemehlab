import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { desc, eq, sql, inArray, gte, and } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

const SETTLED_STATUSES = ['paid', 'processing', 'shipped', 'delivered'];

export async function GET() {
  try {
    await verifyAdmin();

    const [summary] = await db.select({
      totalRevenue: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`.mapWith(Number),
      totalOrders: sql<number>`count(*)`.mapWith(Number),
    }).from(orders).where(inArray(orders.status, SETTLED_STATUSES));

    const [pending] = await db.select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(orders).where(inArray(orders.status, ['pending', 'processing']));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(start.getDate() - 6);

    const last7Days = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        date: date.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0],
        revenue: 0,
        orders: 0,
      };
    });

    const chartOrders = await db.select({ totalAmount: orders.totalAmount, createdAt: orders.createdAt })
      .from(orders)
      .where(and(inArray(orders.status, SETTLED_STATUSES), gte(orders.createdAt, start)));
    for (const order of chartOrders) {
      const key = new Date(order.createdAt).toISOString().split('T')[0];
      const day = last7Days.find((item) => item.fullDate === key);
      if (day) { day.revenue += order.totalAmount; day.orders += 1; }
    }

    const topItems = await db.select({
      productId: orderItems.productId,
      name: orderItems.productName,
      totalSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number),
      revenue: sql<number>`coalesce(sum(${orderItems.quantity} * ${orderItems.price}), 0)`.mapWith(Number),
    }).from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(inArray(orders.status, SETTLED_STATUSES))
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(5);

    const productIds = [...new Set(topItems.map((item) => item.productId))];
    const productRows = productIds.length
      ? await db.select({ id: products.id, mainImage: products.mainImage, slug: products.slug })
          .from(products).where(inArray(products.id, productIds))
      : [];
    const productMap = new Map(productRows.map((item) => [item.id, item]));
    const topProducts = topItems.map((item) => ({ ...item, mainImage: productMap.get(item.productId)?.mainImage, slug: productMap.get(item.productId)?.slug }));

    const totalRevenue = summary?.totalRevenue || 0;
    const totalOrders = summary?.totalOrders || 0;
    return NextResponse.json({
      success: true,
      kpi: {
        totalRevenue,
        totalOrders,
        avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
        pendingCount: pending?.count || 0,
      },
      chartData: last7Days,
      topProducts,
    });
  } catch (error) {
    console.error('[admin/analytics]', error);
    return NextResponse.json({ message: 'خطا در دریافت گزارش فروش' }, { status: 500 });
  }
}
