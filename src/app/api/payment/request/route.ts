import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers, orders } from '@/db/schema';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';
import { isSettledOrderStatus } from '@/lib/order-payment';
import { inquireZarinpalAuthority, verifyZarinpalAuthority } from '@/lib/zarinpal';
import { z } from 'zod';

const bodySchema = z.object({ orderId: z.string().uuid() });
const startPayUrl = (authority: string) => `https://payment.zarinpal.com/pg/StartPay/${encodeURIComponent(authority)}`;

function successUrl(orderId: string, trackingCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';
  const target = new URL('/order/success', baseUrl);
  target.searchParams.set('id', orderId);
  target.searchParams.set('code', trackingCode);
  return `${target.pathname}${target.search}`;
}

export async function POST(req: Request) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);

  try {
    const ip = getClientIp(req);
    const limit = await rateLimit('payment-request:' + ip, { failClosedOnStoreError: true });
    if (limit.unavailable) return NextResponse.json({ success: false, message: 'سامانه کنترل درخواست‌های پرداخت موقتاً در دسترس نیست. هیچ پرداخت تازه‌ای آغاز نشد؛ کمی بعد دوباره تلاش کنید.' }, { status: 503 });
    if (!limit.success) return NextResponse.json({ success: false, message: 'تعداد درخواست‌ها زیاد است. لطفاً کمی صبر کنید.' }, { status: 429 });

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'برای پرداخت ابتدا وارد شوید.' }, { status: 401 });

    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: 'شناسه سفارش معتبر نیست.' }, { status: 400 });
    const { orderId } = parsed.data;
    const orderLimit = await rateLimit('payment-request-order:' + customer.id + ':' + orderId, { failClosedOnStoreError: true });
    if (orderLimit.unavailable) return NextResponse.json({ success: false, message: 'سامانه کنترل درخواست‌های پرداخت موقتاً در دسترس نیست. وضعیت تراکنش حفظ شده و پرداخت تازه‌ای آغاز نشد.' }, { status: 503 });
    if (!orderLimit.success) return NextResponse.json({ success: false, message: 'برای این سفارش درخواست‌های زیادی ثبت شده است. لطفاً کمی بعد دوباره تلاش کنید.' }, { status: 429 });

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!merchantId || !baseUrl) {
      return NextResponse.json({ success: false, message: 'تنظیمات درگاه یا آدرس سایت کامل نیست.' }, { status: 500 });
    }

    const siteUrl = new URL(baseUrl);
    if (process.env.NODE_ENV === 'production' && siteUrl.protocol !== 'https:') {
      return NextResponse.json({ success: false, message: 'آدرس امن سایت تنظیم نشده است.' }, { status: 500 });
    }

    // Hold the same transaction-scoped lock used by cleanup while verifying or
    // creating an authority. This prevents simultaneous retries and expiry races.
    return await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);

      const [order] = await tx.select({
        id: orders.id,
        customerId: orders.customerId,
        status: orders.status,
        totalAmount: orders.totalAmount,
        trackingCode: orders.trackingCode,
        paymentAuthority: orders.paymentAuthority,
      }).from(orders)
        .where(and(eq(orders.id, orderId), eq(orders.customerId, customer.id)))
        .limit(1);

      if (!order) return NextResponse.json({ success: false, message: 'سفارش یافت نشد.' }, { status: 404 });

      // Do not charge a previously confirmed order again.
      if (isSettledOrderStatus(order.status)) {
        return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(order.id, order.trackingCode) });
      }
      if (order.status !== 'pending') {
        return NextResponse.json({ success: false, message: 'وضعیت این سفارش اجازه پرداخت نمی‌دهد.' }, { status: 409 });
      }
      if (order.totalAmount === 0 && !order.paymentAuthority) {
        const [settledZeroOrder] = await tx.update(orders)
          .set({ status: 'paid' })
          .where(and(eq(orders.id, order.id), eq(orders.status, 'pending'), eq(orders.totalAmount, 0), isNull(orders.paymentAuthority)))
          .returning({ id: orders.id });
        if (settledZeroOrder) {
          return NextResponse.json({ success: true, paid: true, noPaymentRequired: true, redirectUrl: successUrl(order.id, order.trackingCode) });
        }
        return NextResponse.json({ success: false, message: 'وضعیت سفارش تغییر کرده است. دوباره بررسی کنید.' }, { status: 409 });
      }
      if (order.totalAmount < 0 || order.totalAmount === 0) {
        return NextResponse.json({ success: false, message: 'مبلغ سفارش معتبر نیست؛ برای بررسی با پشتیبانی تماس بگیرید.' }, { status: 409 });
      }

      const finalizeInsideTransaction = async (authority: string, refId: string | null): Promise<boolean> => {
        const [current] = await tx.select({
          status: orders.status,
          paymentAuthority: orders.paymentAuthority,
          customerId: orders.customerId,
          totalAmount: orders.totalAmount,
        }).from(orders).where(eq(orders.id, orderId)).limit(1);

        if (!current) return false;
        if (isSettledOrderStatus(current.status)) return true;
        if (current.status !== 'pending' || current.paymentAuthority !== authority) return false;

        const [updated] = await tx.update(orders)
          .set({ status: 'paid', ...(refId ? { paymentRefId: refId } : {}) })
          .where(and(eq(orders.id, orderId), eq(orders.status, 'pending'), eq(orders.paymentAuthority, authority)))
          .returning({ id: orders.id });

        if (!updated) {
          const [latest] = await tx.select({ status: orders.status }).from(orders).where(eq(orders.id, orderId)).limit(1);
          return isSettledOrderStatus(latest?.status);
        }

        if (current.customerId && current.totalAmount > 0) {
          const earnedPoints = Math.floor(current.totalAmount / 100000);
          if (earnedPoints > 0) {
            const [updatedCustomer] = await tx.update(customers)
              .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${earnedPoints}` })
              .where(eq(customers.id, current.customerId))
              .returning({ loyaltyPoints: customers.loyaltyPoints });
            if (updatedCustomer) {
              const tier = updatedCustomer.loyaltyPoints >= 1500 ? 'gold' : updatedCustomer.loyaltyPoints >= 500 ? 'silver' : 'bronze';
              await tx.update(customers).set({ tier }).where(eq(customers.id, current.customerId));
            }
          }
        }
        return true;
      };

      // Inquiry is the non-destructive way to inspect an existing authority.
      // Verify is deliberately called only after the gateway reports PAID (or
      // after a callback), never merely because the customer opened this page.
      if (order.paymentAuthority) {
        let inquiry;
        try {
          inquiry = await inquireZarinpalAuthority(merchantId, order.paymentAuthority);
        } catch (error) {
          console.error('[payment/request:inquiry]', error);
          return NextResponse.json({
            success: false,
            uncertain: true,
            message: 'وضعیت تراکنش قبلی از زرین‌پال دریافت نشد. برای جلوگیری از پرداخت تکراری، درخواست تازه‌ای ساخته نشد؛ کمی بعد دوباره بررسی کنید.',
          }, { status: 503 });
        }

        const { code, status, refId } = inquiry.result;
        if (!inquiry.response.ok || code !== 100 || !status) {
          console.error('[Zarinpal Inquiry Error]', inquiry.data);
          return NextResponse.json({
            success: false,
            uncertain: true,
            message: 'نتیجه استعلام تراکنش قطعی نیست. شناسه پرداخت قبلی حفظ شد و پرداخت جدیدی ساخته نشد.',
          }, { status: 409 });
        }

        if (status === 'VERIFIED') {
          if (!await finalizeInsideTransaction(order.paymentAuthority, refId)) {
            return NextResponse.json({ success: false, uncertain: true, message: 'زرین‌پال تراکنش را تأییدشده اعلام کرده اما ثبت نهایی سفارش نیازمند بررسی است؛ لطفاً پرداخت را تکرار نکنید.' }, { status: 409 });
          }
          return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(order.id, order.trackingCode) });
        }

        if (status === 'PAID') {
          // PAID means the bank payment exists but has not yet been verified.
          // Verify it with the amount loaded from our own database before settling.
          let verification;
          try {
            verification = await verifyZarinpalAuthority(merchantId, order.totalAmount, order.paymentAuthority);
          } catch (error) {
            console.error('[payment/request:verify-after-inquiry]', error);
            return NextResponse.json({ success: false, uncertain: true, message: 'پرداخت انجام شده اما تأیید نهایی درگاه هنوز دریافت نشده است. از پرداخت مجدد خودداری کنید و دوباره وضعیت را بررسی کنید.' }, { status: 503 });
          }
          if (verification.response.ok && (verification.result.code === 100 || verification.result.code === 101)) {
            if (!await finalizeInsideTransaction(order.paymentAuthority, verification.result.refId ?? refId)) {
              return NextResponse.json({ success: false, uncertain: true, message: 'درگاه پرداخت را تأیید کرده اما ثبت نهایی سفارش نیازمند بررسی است؛ لطفاً پرداخت را تکرار نکنید.' }, { status: 409 });
            }
            return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(order.id, order.trackingCode) });
          }
          console.error('[Zarinpal Verify After Inquiry Error]', verification.data);
          return NextResponse.json({ success: false, uncertain: true, message: 'پرداخت در درگاه ثبت شده اما تأیید نهایی هنوز کامل نشده است. تراکنش قبلی حفظ شد و پرداخت تازه‌ای ساخته نشد.' }, { status: 409 });
        }

        if (status === 'IN_BANK') {
          // Reuse the exact existing authority. Never create a second transaction
          // while the gateway reports that the first one is still in progress.
          return NextResponse.json({
            success: true,
            paid: false,
            inProgress: true,
            reused: true,
            redirectUrl: startPayUrl(order.paymentAuthority),
            message: 'تراکنش قبلی هنوز در درگاه در حال انجام است؛ همان درخواست قبلی باز می‌شود.',
          });
        }

        if (status === 'FAILED' || status === 'REVERSED') {
          // Only a terminal state from the dedicated inquiry endpoint allows a
          // fresh authority. A pending/in-bank/unknown state is never discarded.
          await tx.update(orders)
            .set({ paymentAuthority: null })
            .where(and(eq(orders.id, order.id), eq(orders.status, 'pending'), eq(orders.paymentAuthority, order.paymentAuthority)));

          const [afterInquiry] = await tx.select({
            status: orders.status,
            paymentAuthority: orders.paymentAuthority,
            trackingCode: orders.trackingCode,
          }).from(orders).where(eq(orders.id, order.id)).limit(1);

          if (isSettledOrderStatus(afterInquiry?.status)) {
            return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(order.id, afterInquiry!.trackingCode) });
          }
          if (afterInquiry?.status !== 'pending') {
            return NextResponse.json({ success: false, message: 'وضعیت سفارش هم‌زمان تغییر کرده است. صفحه را تازه‌سازی کنید.' }, { status: 409 });
          }
          if (afterInquiry.paymentAuthority) {
            return NextResponse.json({ success: false, uncertain: true, message: 'تراکنش دیگری برای این سفارش در حال بررسی است.' }, { status: 409 });
          }
        } else {
          return NextResponse.json({
            success: false,
            uncertain: true,
            message: 'وضعیت اعلام‌شده توسط درگاه قابل‌تفسیر نیست؛ برای جلوگیری از پرداخت تکراری، شناسه قبلی حفظ شد.',
          }, { status: 409 });
        }
      }

      const callbackUrl = new URL('/api/payment/verify', siteUrl);
      callbackUrl.searchParams.set('orderId', order.id);
      let response: Response;
      try {
        response = await fetch('https://payment.zarinpal.com/pg/v4/payment/request.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            merchant_id: merchantId,
            amount: order.totalAmount,
            callback_url: callbackUrl.toString(),
            description: 'پرداخت سفارش ' + order.trackingCode,
          }),
          cache: 'no-store',
          signal: AbortSignal.timeout(15000),
        });
      } catch (error) {
        console.error('[Zarinpal Request Network Error]', error);
        return NextResponse.json({ success: false, uncertain: true, message: 'ارتباط با درگاه قطع شد. هیچ پیوند پرداختی دریافت نشد؛ سفارش در حساب شما باقی است و می‌توانید وضعیت آن را دوباره بررسی کنید.' }, { status: 502 });
      }

      const data = await response.json().catch(() => null);
      const authority = data?.data?.authority;
      if (!response.ok || Number(data?.data?.code) !== 100 || typeof authority !== 'string' || !/^[A-Za-z0-9_-]{8,128}$/.test(authority)) {
        console.error('[Zarinpal Request Error]', data);
        return NextResponse.json({ success: false, message: data?.errors?.message || 'در ایجاد تراکنش خطایی رخ داد. سفارش شما حذف نشده و می‌توانید دوباره تلاش کنید.' }, { status: 502 });
      }

      const [saved] = await tx.update(orders)
        .set({ paymentAuthority: authority })
        .where(and(eq(orders.id, order.id), eq(orders.status, 'pending'), isNull(orders.paymentAuthority)))
        .returning({ id: orders.id });

      if (saved) return NextResponse.json({ success: true, paid: false, redirectUrl: startPayUrl(authority), reused: false });

      const [latest] = await tx.select({
        status: orders.status,
        paymentAuthority: orders.paymentAuthority,
        trackingCode: orders.trackingCode,
      }).from(orders).where(eq(orders.id, order.id)).limit(1);

      if (isSettledOrderStatus(latest?.status)) {
        return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(order.id, latest!.trackingCode) });
      }
      if (latest?.status === 'pending' && latest.paymentAuthority) {
        return NextResponse.json({ success: true, paid: false, redirectUrl: startPayUrl(latest.paymentAuthority), reused: true });
      }

      return NextResponse.json({ success: false, message: 'وضعیت سفارش تغییر کرده است؛ صفحه را تازه‌سازی کنید.' }, { status: 409 });
    });
  } catch (error) {
    console.error('[payment/request]', error);
    return NextResponse.json({ success: false, message: 'ارتباط با درگاه پرداخت برقرار نشد. سفارش شما در حساب کاربری باقی می‌ماند و از همان‌جا می‌توانید ادامه دهید.' }, { status: 502 });
  }
}
