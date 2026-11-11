import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { trackingCode, phone } = await req.json();
    
    // تلاش اول: جستجو با کد دقیق
    let orderData = await db.select().from(orders).where(
      and(eq(orders.trackingCode, trackingCode), eq(orders.phone, phone))
    ).limit(1);
    
    // تلاش دوم: اگر پیدا نشد، با شماره تماس پیدا کن و از روی id بساز
    if (orderData.length === 0) {
      const allOrders = await db.select().from(orders).where(eq(orders.phone, phone));
      const matched = allOrders.find(o => {
        const derivedCode = `FL-${o.id.slice(0, 6).toUpperCase()}`;
        return derivedCode === trackingCode.toUpperCase() || o.trackingCode === trackingCode;
      });
      if (matched) orderData = [matched];
    }

    if (orderData.length === 0) {
      return NextResponse.json({ message: 'سفارشی با این مشخصات یافت نشد.' }, { status: 404 });
    }

    const order = orderData[0];
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    
    return NextResponse.json({ success: true, order, items });
  } catch (error) {
    return NextResponse.json({ message: 'خطا در سیستم رهگیری' }, { status: 500 });
  }
}