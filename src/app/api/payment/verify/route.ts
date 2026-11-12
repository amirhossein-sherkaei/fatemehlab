import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, coupons, customers } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    const orderId = searchParams.get('orderId');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';

    if (!authority || !orderId) return NextResponse.redirect(`${baseUrl}/checkout?error=missing_params`);
    if (status !== 'OK') return NextResponse.redirect(`${baseUrl}/order/failure?reason=cancelled`);

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return NextResponse.redirect(`${baseUrl}/order/failure?reason=order_not_found`);

    if (order.status === 'paid' || order.status === 'processing') {
      return NextResponse.redirect(`${baseUrl}/order/success?id=${orderId}&code=${order.trackingCode}`);
    }

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const response = await fetch('https://payment.zarinpal.com/pg/v4/payment/verify.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ merchant_id: merchantId, amount: order.totalAmount, authority }),
    });

    const data = await response.json();

    if (data.data && (data.data.code === 100 || data.data.code === 101)) {
      // ✅ پرداخت موفق: آپدیت انبار، تخفیف و باشگاه مشتریان
      await db.transaction(async (tx) => {
        // 1. افزایش تعداد استفاده از کد تخفیف
        if (order.couponCode) {
          await tx.update(coupons)
            .set({ usedCount: sql`${coupons.usedCount} + 1` })
            .where(eq(coupons.code, order.couponCode));
        }

        // 3. تغییر وضعیت سفارش
        await tx.update(orders)
          .set({ status: 'paid', paymentRefId: data.data.ref_id.toString() })
          .where(eq(orders.id, orderId));

        // 4. 🏆 کسر امتیاز استفاده شده و اعطای امتیاز جدید
        if (order.customerId) {
          const [customer] = await tx.select().from(customers).where(eq(customers.id, order.customerId)).limit(1);
          if (customer) {
            const earnedPoints = Math.floor(order.totalAmount / 100000);
            const newPoints = Math.max(0, customer.loyaltyPoints - order.usedPoints + earnedPoints);
            
            let newTier = 'bronze';
            if (newPoints >= 1500) newTier = 'gold';
            else if (newPoints >= 500) newTier = 'silver';

            await tx.update(customers)
              .set({ 
                loyaltyPoints: newPoints,
                tier: newTier
              })
              .where(eq(customers.id, order.customerId));
          }
        }
        if (order.customerId) {
          const [customer] = await tx.select().from(customers).where(eq(customers.id, order.customerId)).limit(1);
          if (customer) {
            // هر ۱۰,۰۰۰ تومان = ۱ امتیاز (مبلغ در دیتابیس به ریال است، پس تقسیم بر ۱۰۰,۰۰۰ می‌کنیم)
            const earnedPoints = Math.floor(order.totalAmount / 100000);
            const newPoints = customer.loyaltyPoints + earnedPoints;
            
            // تعیین سطح جدید
            let newTier = 'bronze';
            if (newPoints >= 1500) newTier = 'gold';
            else if (newPoints >= 500) newTier = 'silver';

            await tx.update(customers)
              .set({ 
                loyaltyPoints: newPoints,
                tier: newTier
              })
              .where(eq(customers.id, order.customerId));
          }
        }
      });

      return NextResponse.redirect(`${baseUrl}/order/success?id=${orderId}&code=${order.trackingCode}`);
    } else {
      return NextResponse.redirect(`${baseUrl}/order/failure?reason=verify_failed`);
    }
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/failure?reason=server_error`);
  }
}