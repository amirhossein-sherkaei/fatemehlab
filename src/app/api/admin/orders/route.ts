import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { verifyAdmin } from '@/lib/auth';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    await verifyAdmin();
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json({ success: true, orders: allOrders });
  } catch (error) {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}