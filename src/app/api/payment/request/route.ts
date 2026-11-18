import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = await rateLimit('payment-request:' + ip);
    if (!rl.success) {
      return NextResponse.json({ success: false, message: 'تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید.' }, { status: 429 });
    }

    const customer = await getCurrentCustomer();
    if (!customer) {
      return NextResponse.json({ success: false, message: 'برای پرداخت ابتدا وارد شوید.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const orderId = typeof body?.orderId === 'string' ? body.orderId : '';
    if (!orderId) {
      return NextResponse.json({ success: false, message: 'شناسه سفارش الزامی است.' }, { status: 400 });
    }

    const [order] = await db.select().from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.customerId, customer.id)))
      .limit(1);
    if (!order) return NextResponse.json({ success: false, message: 'سفارش یافت نشد.' }, { status: 404 });
    if (order.status !== 'pending') {
      return NextResponse.json({ success: false, message: 'وضعیت این سفارش اجازه پرداخت نمی‌دهد.' }, { status: 400 });
    }
    if (order.totalAmount <= 0) {
      return NextResponse.json({ success: false, message: 'مبلغ سفارش برای پرداخت آنلاین معتبر نیست.' }, { status: 400 });
    }

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!merchantId || !baseUrl) {
      return NextResponse.json({ success: false, message: 'تنظیمات درگاه یا آدرس سایت کامل نیست.' }, { status: 500 });
    }

    const siteUrl = new URL(baseUrl);
    if (process.env.NODE_ENV === 'production' && siteUrl.protocol !== 'https:') {
      return NextResponse.json({ success: false, message: 'آدرس امن سایت تنظیم نشده است.' }, { status: 500 });
    }
    const callbackUrl = new URL('/api/payment/verify', siteUrl);
    callbackUrl.searchParams.set('orderId', orderId);

    const response = await fetch('https://payment.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: order.totalAmount,
        callback_url: callbackUrl.toString(),
        description: 'پرداخت سفارش ' + order.trackingCode,
        metadata: { mobile: order.phone },
      }),
      cache: 'no-store',
    });

    const data = await response.json();
    if (data?.data?.code === 100 && data?.data?.authority) {
      const updated = await db.update(orders)
        .set({ paymentAuthority: data.data.authority })
        .where(and(eq(orders.id, orderId), eq(orders.status, 'pending')))
        .returning({ id: orders.id });
      if (updated.length === 0) {
        return NextResponse.json({ success: false, message: 'وضعیت سفارش تغییر کرده است؛ صفحه را تازه‌سازی کنید.' }, { status: 409 });
      }
      return NextResponse.json({
        success: true,
        redirectUrl: 'https://payment.zarinpal.com/pg/StartPay/' + data.data.authority,
      });
    }

    console.error('[Zarinpal Request Error]', data);
    return NextResponse.json({
      success: false,
      message: data?.errors?.message || 'در ایجاد تراکنش خطایی رخ داد. می‌توانید دوباره تلاش کنید.',
    }, { status: 502 });
  } catch (error) {
    console.error('[payment/request]', error);
    return NextResponse.json({ success: false, message: 'ارتباط با درگاه پرداخت برقرار نشد.' }, { status: 502 });
  }
}
