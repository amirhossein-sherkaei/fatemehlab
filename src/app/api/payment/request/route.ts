import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return NextResponse.json({ success: false, message: 'سفارش یافت نشد' }, { status: 404 });

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) return NextResponse.json({ success: false, message: 'مرچنت کد تنظیم نشده است' }, { status: 500 });

    const response = await fetch('https://payment.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: order.totalAmount,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/verify?orderId=${orderId}`,
        description: `پرداخت سفارش ${order.trackingCode}`,
        metadata: { mobile: order.phone }
      }),
    });

    const data = await response.json();

    if (data.data && data.data.code === 100) {
      await db.update(orders).set({ paymentAuthority: data.data.authority }).where(eq(orders.id, orderId));
      return NextResponse.json({ success: true, redirectUrl: `https://payment.zarinpal.com/pg/StartPay/${data.data.authority}` });
    } else {
      return NextResponse.json({ success: false, message: data.errors?.message || 'خطا در ایجاد تراکنش' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}