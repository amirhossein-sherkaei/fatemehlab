import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    const orderId = searchParams.get('orderId');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';

    if (!authority || !orderId) {
      return NextResponse.redirect(`${baseUrl}/order/failure?reason=missing_params`);
    }

    if (status !== 'OK') {
      return NextResponse.redirect(`${baseUrl}/order/failure?reason=cancelled`);
    }

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) {
      return NextResponse.redirect(`${baseUrl}/order/failure?reason=order_not_found`);
    }

    // جلوگیری از تایید مجدد
    if (order.status === 'paid' || order.status === 'processing') {
      return NextResponse.redirect(`${baseUrl}/order/success?id=${orderId}`);
    }

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;

    const response = await fetch('https://payment.zarinpal.com/pg/v4/payment/verify.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: order.totalAmount,
        authority: authority
      }),
    });

    const data = await response.json();

    if (data.data && (data.data.code === 100 || data.data.code === 101)) {
      // پرداخت موفق
      await db.update(orders)
        .set({ 
          status: 'paid', 
          paymentRefId: data.data.ref_id.toString() 
        })
        .where(eq(orders.id, orderId));

      return NextResponse.redirect(`${baseUrl}/order/success?id=${orderId}&code=${order.trackingCode}`);
    } else {
      // پرداخت ناموفق
      console.error('Zarinpal Verify Error:', data);
      return NextResponse.redirect(`${baseUrl}/order/failure?reason=verify_failed`);
    }

  } catch (error) {
    console.error('Payment Verify Error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/failure?reason=server_error`);
  }
}