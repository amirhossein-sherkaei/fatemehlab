import { getClientIp, validateOrigin, rejectCsrf } from '@/lib/security';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';

const schema = z.object({
  trackingCode: z.string().trim().min(3).max(40),
  phone: z.string().trim().min(10).max(15),
});

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    const ip = getClientIp(req);
    const limit = await rateLimit('track-order:' + ip);
    if (!limit.success) return NextResponse.json({ message: 'تعداد تلاش‌های شما برای رهگیری زیاد بوده است. لطفاً یک دقیقه دیگر تلاش کنید.' }, { status: 429 });

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: 'کد رهگیری یا شماره تماس معتبر نیست.' }, { status: 400 });
    const trackingCode = parsed.data.trackingCode.toUpperCase();
    const phone = parsed.data.phone;

    let order = await db.select({
      id: orders.id,
      trackingCode: orders.trackingCode,
      status: orders.status,
      totalAmount: orders.totalAmount,
      createdAt: orders.createdAt,
    }).from(orders).where(and(eq(orders.trackingCode, trackingCode), eq(orders.phone, phone))).limit(1).then((rows) => rows[0]);

    if (!order) {
      const recentOrders = await db.select({
        id: orders.id,
        trackingCode: orders.trackingCode,
        status: orders.status,
        totalAmount: orders.totalAmount,
        createdAt: orders.createdAt,
      }).from(orders).where(eq(orders.phone, phone)).orderBy(desc(orders.createdAt)).limit(100);
      const matchedOrder = recentOrders.find((candidate) => `FL-${candidate.id.slice(0, 6).toUpperCase()}` === trackingCode || candidate.trackingCode === trackingCode);
      if (matchedOrder) order = matchedOrder;
    }

    if (!order) return NextResponse.json({ message: 'سفارشی با این مشخصات یافت نشد.' }, { status: 404 });

    const items = await db.select({
      id: orderItems.id,
      productName: orderItems.productName,
      price: orderItems.price,
      quantity: orderItems.quantity,
    }).from(orderItems).where(eq(orderItems.orderId, order.id));

    return NextResponse.json({ success: true, order, items });
  } catch (error) {
    console.error('[track/order]', error);
    return NextResponse.json({ message: 'خطا در سیستم رهگیری' }, { status: 500 });
  }
}
