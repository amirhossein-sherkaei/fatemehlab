import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();

    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    
    // ۱. محاسبه آمار کلی
    const validOrders = allOrders.filter(o => o.status !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = validOrders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // ۲. داده‌های نمودار ۷ روز اخیر
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
        fullDate: d.toISOString().split('T')[0],
        revenue: 0,
        orders: 0
      };
    });

    validOrders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      const dayData = last7Days.find(d => d.fullDate === orderDate);
      if (dayData) {
        dayData.revenue += order.totalAmount;
        dayData.orders += 1;
      }
    });

    // ۳. پرفروش‌ترین محصولات
    const topItems = await db
      .select({
        productId: orderItems.productId,
        name: orderItems.productName,
        totalSold: sql<number>`sum(${orderItems.quantity})`,
        revenue: sql<number>`sum(${orderItems.quantity} * ${orderItems.price})`
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(sql`${orders.status} != 'cancelled'`)
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(5);

    // گرفتن عکس محصولات
    const topProducts = await Promise.all(topItems.map(async (item) => {
      const [prod] = await db.select({ mainImage: products.mainImage, slug: products.slug }).from(products).where(eq(products.id, item.productId)).limit(1);
      return { ...item, mainImage: prod?.mainImage, slug: prod?.slug };
    }));

    // ۴. سفارشات در انتظار
    const pendingCount = allOrders.filter(o => o.status === 'processing' || o.status === 'pending').length;

    return NextResponse.json({
      success: true,
      kpi: { totalRevenue, totalOrders, avgOrderValue, pendingCount },
      chartData: last7Days,
      topProducts
    });

  } catch (error) {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}