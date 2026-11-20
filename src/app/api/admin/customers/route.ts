import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers, orders } from '@/db/schema';
import { desc, sql, inArray } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

const SETTLED_STATUSES = ['paid', 'processing', 'shipped', 'delivered'];

export async function GET() {
  try {
    await verifyAdmin();
    const allCustomers = await db.select({
      id: customers.id,
      email: customers.email,
      name: customers.name,
      phone: customers.phone,
      avatar: customers.avatar,
      loyaltyPoints: customers.loyaltyPoints,
      tier: customers.tier,
      createdAt: customers.createdAt,
    }).from(customers).orderBy(desc(customers.createdAt));

    const orderStats = await db.select({
      customerId: orders.customerId,
      totalOrders: sql<number>`count(${orders.id})`.mapWith(Number),
      totalSpent: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`.mapWith(Number),
    }).from(orders)
      .where(inArray(orders.status, SETTLED_STATUSES))
      .groupBy(orders.customerId);

    const statsByCustomer = new Map(orderStats.map((item) => [item.customerId, item]));
    const customersWithStats = allCustomers.map((customer) => {
      const stats = statsByCustomer.get(customer.id);
      return { ...customer, totalOrders: stats?.totalOrders || 0, totalSpent: stats?.totalSpent || 0 };
    });

    return NextResponse.json({ success: true, customers: customersWithStats });
  } catch (error) {
    console.error('[admin/customers]', error);
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}
