import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';
import { z } from 'zod';

const bodySchema = z.object({ orderId: z.string().uuid() });
const startPayUrl = (authority: string) => `https://payment.zarinpal.com/pg/StartPay/${encodeURIComponent(authority)}`;

export async function POST(req: Request) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);

  try {
    const ip = getClientIp(req);
    const limit = await rateLimit('payment-request:' + ip);
    if (!limit.success) return NextResponse.json({ success: false, message: 'تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید.' }, { status: 429 });

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'برای پرداخت ابتدا وارد شوید.' }, { status: 401 });

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: 'شناسه سفارش معتبر نیست.' }, { status: 400 });
    const { orderId } = parsed.data;

    const [order] = await db.select().from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.customerId, customer.id))).limit(1);
    if (!order) return NextResponse.json({ success: false, message: 'سفارش یافت نشد.' }, { status: 404 });
    if (order.status !== 'pending') return NextResponse.json({ success: false, message: 'وضعیت این سفارش اجازه پرداخت نمی‌دهد.' }, { status: 409 });
    if (order.totalAmount <= 0) return NextResponse.json({ success: false, message: 'این سفارش نیازی به پرداخت آنلاین ندارد.' }, { status: 400 });

    // A previously persisted authority is the only authority we expose to the customer.
    if (order.paymentAuthority) {
      return NextResponse.json({ success: true, redirectUrl: startPayUrl(order.paymentAuthority), reused: true });
    }

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!merchantId || !baseUrl) return NextResponse.json({ success: false, message: 'تنظیمات درگاه یا آدرس سایت کامل نیست.' }, { status: 500 });

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
    const authority = data?.data?.authority;
    if (data?.data?.code !== 100 || typeof authority !== 'string' || authority.length < 8) {
      console.error('[Zarinpal Request Error]', data);
      return NextResponse.json({ success: false, message: data?.errors?.message || 'در ایجاد تراکنش خطایی رخ داد. می‌توانید دوباره تلاش کنید.' }, { status: 502 });
    }

    const [saved] = await db.update(orders)
      .set({ paymentAuthority: authority })
      .where(and(eq(orders.id, orderId), eq(orders.status, 'pending'), isNull(orders.paymentAuthority)))
      .returning({ id: orders.id });

    if (saved) return NextResponse.json({ success: true, redirectUrl: startPayUrl(authority), reused: false });

    // Another concurrent request may have won. Only return the persisted authority.
    const [latest] = await db.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, orderId)).limit(1);
    if (latest?.status === 'pending' && latest.paymentAuthority) {
      return NextResponse.json({ success: true, redirectUrl: startPayUrl(latest.paymentAuthority), reused: true });
    }
    return NextResponse.json({ success: false, message: 'وضعیت سفارش تغییر کرده است؛ صفحه را تازه‌سازی کنید.' }, { status: 409 });
  } catch (error) {
    console.error('[payment/request]', error);
    return NextResponse.json({ success: false, message: 'ارتباط با درگاه پرداخت برقرار نشد.' }, { status: 502 });
  }
}
