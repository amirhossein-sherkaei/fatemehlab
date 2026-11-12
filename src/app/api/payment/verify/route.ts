import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products, coupons } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    const orderId = searchParams.get('orderId');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';

    if (!authority || !orderId) return NextResponse.redirect(`${baseUrl}/checkout?error=missing_params`);
    if (status !== 'OK') return NextResponse.redirect(`${baseUrl}/checkout?error=cancelled`);

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return NextResponse.redirect(`${baseUrl}/checkout?error=order_not_found`);

    // جلوگیری از تایید مجدد
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
      // ✅ پرداخت موفق: حالا موجودی انبار و کد تخفیف را آپدیت می‌کنیم
      await db.transaction(async (tx) => {
        // 1. کسر موجودی
        const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, orderId));
        for (const item of items) {
          await tx.update(products)
            .set({ stock: sql`${products.stock} - ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
        
        // 2. افزایش تعداد استفاده از کد تخفیف
        if (order.couponCode) {
          await tx.update(coupons)
            .set({ usedCount: sql`${coupons.usedCount} + 1` })
            .where(eq(coupons.code, order.couponCode));
        }

        // 3. تغییر وضعیت سفارش
        await tx.update(orders)
          .set({ status: 'paid', paymentRefId: data.data.ref_id.toString() })
          .where(eq(orders.id, orderId));
      });

      return NextResponse.redirect(`${baseUrl}/order/success?id=${orderId}&code=${order.trackingCode}`);
    } else {
      return NextResponse.redirect(`${baseUrl}/checkout?error=verify_failed`);
    }
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout?error=server_error`);
  }
}