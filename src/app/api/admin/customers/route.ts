import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers, orders } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();
    
    // دریافت همه مشتریان
    const allCustomers = await db.select().from(customers).orderBy(desc(customers.createdAt));
    
    // محاسبه آمار سفارشات هر مشتری
    const orderStats = await db
      .select({
        customerId: orders.customerId,
        totalOrders: sql<number>`count(${orders.id})`.mapWith(Number),
        totalSpent: sql<number>`sum(case when ${orders.status} != 'cancelled' then ${orders.totalAmount} else 0 end)`.mapWith(Number)
      })
      .from(orders)
      .groupBy(orders.customerId);

    // ترکیب اطلاعات
    const customersWithStats = allCustomers.map(customer => {
      const stats = orderStats.find(s => s.customerId === customer.id);
      return {
        ...customer,
        totalOrders: stats?.totalOrders || 0,
        totalSpent: stats?.totalSpent || 0,
      };
    });

    return NextResponse.json({ success: true, customers: customersWithStats });
  } catch (error) {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}