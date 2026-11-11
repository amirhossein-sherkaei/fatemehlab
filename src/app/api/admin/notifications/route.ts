import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, reviews } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();
    
    // سفارشاتی که در انتظار پردازش هستند
    const pendingOrders = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.status, 'processing'));

    // نظراتی که در انتظار تایید هستند
    const pendingReviews = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(eq(reviews.status, 'pending'));

    return NextResponse.json({
      success: true,
      orders: pendingOrders.length,
      reviews: pendingReviews.length,
    });
  } catch (error) {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}