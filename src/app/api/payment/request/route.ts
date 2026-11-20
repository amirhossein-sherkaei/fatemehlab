import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { customers, orders, orderEvents, paymentAttempts } from '@/db/schema';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';
import { appendOrderEvent, finalizePaymentInTransaction, isSettledOrderStatus } from '@/lib/order-payment';
import { inquireZarinpalAuthority, verifyZarinpalAuthority } from '@/lib/zarinpal';

const bodySchema = z.object({ orderId: z.string().uuid() });
const AUTHORITY_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;
const startPayUrl = (authority: string) => `https://payment.zarinpal.com/pg/StartPay/${encodeURIComponent(authority)}`;

function successUrl(orderId: string, trackingCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';
  const target = new URL('/order/success', baseUrl);
  target.searchParams.set('id', orderId);
  target.searchParams.set('code', trackingCode);
  return `${target.pathname}${target.search}`;
}

type Reservation =
  | { kind: 'paid'; orderId: string; trackingCode: string }
  | { kind: 'reconcile'; orderId: string; trackingCode: string; amount: number; authority: string; attemptId: string | null }
  | { kind: 'create'; orderId: string; trackingCode: string; amount: number; attemptId: string }
  | { kind: 'blocked'; status: number; uncertain: boolean; message: string };

async function reserveOrInspectPayment(orderId: string, customerId: string): Promise<Reservation> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);
    const [order] = await tx.select({
      id: orders.id,
      customerId: orders.customerId,
      status: orders.status,
      totalAmount: orders.totalAmount,
      trackingCode: orders.trackingCode,
      paymentAuthority: orders.paymentAuthority,
    }).from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.customerId, customerId)))
      .limit(1);

    if (!order) return { kind: 'blocked', status: 404, uncertain: false, message: 'سفارش یافت نشد.' };
    if (isSettledOrderStatus(order.status)) return { kind: 'paid', orderId: order.id, trackingCode: order.trackingCode };
    if (order.status !== 'pending') return { kind: 'blocked', status: 409, uncertain: false, message: 'وضعیت سفارش اجازه پرداخت نمی‌دهد.' };
    if (order.totalAmount < 0) return { kind: 'blocked', status: 409, uncertain: false, message: 'مبلغ سفارش معتبر نیست؛ با پشتیبانی تماس بگیرید.' };

    if (order.totalAmount === 0 && !order.paymentAuthority) {
      const [updated] = await tx.update(orders)
        .set({ status: 'paid' })
        .where(and(eq(orders.id, order.id), eq(orders.status, 'pending'), eq(orders.totalAmount, 0), isNull(orders.paymentAuthority)))
        .returning({ id: orders.id });
      if (!updated) return { kind: 'blocked', status: 409, uncertain: true, message: 'وضعیت سفارش هم‌زمان تغییر کرده است؛ صفحه را تازه‌سازی کنید.' };
      await appendOrderEvent(tx, {
        orderId: order.id, actorType: 'system', eventType: 'order.zero_value_settled',
        fromStatus: 'pending', toStatus: 'paid', summary: 'مبلغ نهایی سفارش صفر بود و پرداخت آنلاین نیاز نداشت.',
      });
      return { kind: 'paid', orderId: order.id, trackingCode: order.trackingCode };
    }

    if (order.paymentAuthority) {
      const [attempt] = await tx.select({ id: paymentAttempts.id })
        .from(paymentAttempts)
        .where(and(eq(paymentAttempts.orderId, order.id), eq(paymentAttempts.authority, order.paymentAuthority)))
        .limit(1);
      return {
        kind: 'reconcile', orderId: order.id, trackingCode: order.trackingCode,
        amount: order.totalAmount, authority: order.paymentAuthority, attemptId: attempt?.id ?? null,
      };
    }

    const [latest] = await tx.select().from(paymentAttempts)
      .where(eq(paymentAttempts.orderId, order.id))
      .orderBy(desc(paymentAttempts.attemptNumber))
      .limit(1);

    if (latest?.status === 'verified' && latest.authority) {
      const finalized = await finalizePaymentInTransaction(tx, order.id, latest.authority, latest.refId, 'system');
      if (finalized) return { kind: 'paid', orderId: order.id, trackingCode: order.trackingCode };
      return { kind: 'blocked', status: 409, uncertain: true, message: 'دفتر پرداخت، تراکنش تأییدشده‌ای برای این سفارش ثبت کرده اما وضعیت سفارش نیازمند تطبیق است؛ پرداخت جدید ساخته نشد.' };
    }

    if (latest && ['requesting', 'unknown', 'in_bank', 'awaiting_customer'].includes(latest.status)) {
      // Repair the order pointer if a prior authority was committed to the ledger
      // but not to orders due to a partial legacy deployment.
      if (latest.authority && ['awaiting_customer', 'in_bank', 'unknown'].includes(latest.status)) {
        await tx.update(orders).set({ paymentAuthority: latest.authority })
          .where(and(eq(orders.id, order.id), eq(orders.status, 'pending'), isNull(orders.paymentAuthority)));
        return {
          kind: 'reconcile', orderId: order.id, trackingCode: order.trackingCode,
          amount: order.totalAmount, authority: latest.authority, attemptId: latest.id,
        };
      }
      const staleRequest = latest.status === 'requesting' && Date.now() - latest.createdAt.getTime() > 120_000;
      if (staleRequest) {
        await tx.update(paymentAttempts)
          .set({ status: 'unknown', updatedAt: new Date(), lastCheckedAt: new Date(), gatewayMessage: 'Request outcome not persisted before timeout.' })
          .where(and(eq(paymentAttempts.id, latest.id), eq(paymentAttempts.status, 'requesting')));
      }
      return {
        kind: 'blocked', status: 409, uncertain: true,
        message: staleRequest || latest.status === 'unknown'
          ? 'نتیجه درخواست قبلی درگاه نامشخص است. برای جلوگیری از پرداخت تکراری، درخواست تازه‌ای ساخته نمی‌شود؛ پشتیبانی باید تراکنش را تطبیق دهد.'
          : 'درخواست پرداخت قبلی هنوز در حال ثبت است. چند لحظه بعد وضعیت را دوباره بررسی کنید.',
      };
    }

    const attemptNumber = (latest?.attemptNumber ?? 0) + 1;
    const [attempt] = await tx.insert(paymentAttempts).values({
      orderId: order.id,
      requestKey: randomUUID(),
      attemptNumber,
      amount: order.totalAmount,
      status: 'requesting',
      requestedAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: paymentAttempts.id });

    await appendOrderEvent(tx, {
      orderId: order.id, actorType: 'customer', actorId: customerId,
      eventType: 'payment.request_started', summary: 'درخواست ایجاد تراکنش پرداخت ثبت شد.',
      metadata: { attemptNumber, amount: order.totalAmount },
    });

    return { kind: 'create', orderId: order.id, trackingCode: order.trackingCode, amount: order.totalAmount, attemptId: attempt.id };
  });
}

async function updateAttempt(
  attemptId: string | null,
  values: { status?: string; authority?: string | null; refId?: string | null; gatewayCode?: number | null; gatewayMessage?: string | null; verifiedAt?: Date | null },
): Promise<void> {
  if (!attemptId) return;
  await db.update(paymentAttempts).set({
    ...values,
    lastCheckedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(paymentAttempts.id, attemptId));
}

async function issueGatewayAuthority(
  reservation: Extract<Reservation, { kind: 'create' }>,
  merchantId: string,
  siteUrl: URL,
): Promise<NextResponse> {
  const callbackUrl = new URL('/api/payment/verify', siteUrl);
  callbackUrl.searchParams.set('orderId', reservation.orderId);

  let response: Response;
  try {
    response = await fetch('https://payment.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: reservation.amount,
        callback_url: callbackUrl.toString(),
        description: 'پرداخت سفارش ' + reservation.trackingCode,
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    console.error('[Zarinpal Request Network Error]', error);
    await updateAttempt(reservation.attemptId, { status: 'unknown', gatewayMessage: 'Gateway request timed out or connection was interrupted.' });
    await db.insert(orderEvents).values({
      orderId: reservation.orderId, actorType: 'system', eventType: 'payment.request_unknown',
      summary: 'نتیجه درخواست ایجاد تراکنش از درگاه دریافت نشد؛ درخواست جدید مسدود شد.',
      metadata: { attemptId: reservation.attemptId },
    });
    return NextResponse.json({ success: false, uncertain: true, message: 'ارتباط با درگاه قطع شد و نتیجه درخواست قبلی مشخص نیست. برای جلوگیری از پرداخت تکراری، تراکنش تازه‌ای ساخته نمی‌شود؛ لطفاً وضعیت سفارش را از پشتیبانی پیگیری کنید.' }, { status: 503 });
  }

  const data = await response.json().catch(() => null);
  const authority = data?.data?.authority;
  const gatewayCode = Number(data?.data?.code ?? data?.errors?.code);
  if (!response.ok || gatewayCode !== 100 || typeof authority !== 'string' || !/^[A-Za-z0-9_-]{8,128}$/.test(authority)) {
    const definitiveRejection = response.ok && Number.isFinite(gatewayCode) && gatewayCode !== 100 && data && typeof data === 'object';
    const attemptStatus = definitiveRejection ? 'failed' : 'unknown';
    const safeMessage = typeof data?.errors?.message === 'string' ? data.errors.message.slice(0, 180) : 'Gateway did not return a usable authority.';
    await updateAttempt(reservation.attemptId, { status: attemptStatus, gatewayCode: Number.isFinite(gatewayCode) ? gatewayCode : null, gatewayMessage: safeMessage });
    await db.insert(orderEvents).values({
      orderId: reservation.orderId, actorType: 'gateway',
      eventType: definitiveRejection ? 'payment.request_rejected' : 'payment.request_unknown',
      summary: definitiveRejection ? 'درگاه درخواست پرداخت را رد کرد؛ تلاش بعدی پس از ثبت نتیجه مجاز است.' : 'پاسخ ایجاد تراکنش قابل‌اعتماد نبود؛ تلاش جدید مسدود شد.',
      metadata: { attemptId: reservation.attemptId, gatewayCode: Number.isFinite(gatewayCode) ? gatewayCode : null },
    });
    return NextResponse.json({ success: false, uncertain: !definitiveRejection, message: definitiveRejection
      ? (safeMessage || 'درگاه درخواست پرداخت را نپذیرفت. می‌توانید دوباره تلاش کنید.')
      : 'پاسخ درگاه ناقص یا نامشخص است. برای جلوگیری از پرداخت تکراری، درخواست تازه‌ای ساخته نخواهد شد؛ وضعیت را با پشتیبانی بررسی کنید.' }, { status: 502 });
  }

  const saved = await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${reservation.orderId}))`);
    const [order] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, reservation.orderId)).limit(1);
    const [attempt] = await tx.select({ status: paymentAttempts.status })
      .from(paymentAttempts).where(eq(paymentAttempts.id, reservation.attemptId)).limit(1);
    if (!order || !attempt || attempt.status !== 'requesting') return false;
    if (order.status !== 'pending') return false;
    if (order.paymentAuthority && order.paymentAuthority !== authority) return false;

    if (!order.paymentAuthority) {
      const [orderUpdate] = await tx.update(orders)
        .set({ paymentAuthority: authority })
        .where(and(eq(orders.id, reservation.orderId), eq(orders.status, 'pending'), isNull(orders.paymentAuthority)))
        .returning({ id: orders.id });
      if (!orderUpdate) return false;
    }
    await tx.update(paymentAttempts)
      .set({ authority, status: 'awaiting_customer', gatewayCode: 100, gatewayMessage: null, updatedAt: new Date() })
      .where(and(eq(paymentAttempts.id, reservation.attemptId), eq(paymentAttempts.status, 'requesting')));
    await appendOrderEvent(tx, {
      orderId: reservation.orderId, actorType: 'gateway', eventType: 'payment.authority_created',
      summary: 'درگاه شناسه پرداخت صادر کرد و پیوند پرداخت آماده شد.',
      metadata: { attemptId: reservation.attemptId, amount: reservation.amount },
    });
    return true;
  });

  if (!saved) {
    // The external authority exists but could not be safely attached. Keep the
    // precommitted attempt unresolved; never create a second authority blindly.
    await updateAttempt(reservation.attemptId, { status: 'unknown', authority, gatewayCode: 100, gatewayMessage: 'Authority issued but order binding did not complete.' });
    return NextResponse.json({ success: false, uncertain: true, message: 'شناسه پرداخت صادر شده اما ثبت ارتباط آن با سفارش کامل نشد. برای جلوگیری از پرداخت تکراری، دوباره تلاش نکنید و با پشتیبانی تماس بگیرید.' }, { status: 409 });
  }

  return NextResponse.json({ success: true, paid: false, redirectUrl: startPayUrl(authority), attemptId: reservation.attemptId });
}

async function reconcileExistingAuthority(
  reservation: Extract<Reservation, { kind: 'reconcile' }>,
  merchantId: string,
): Promise<NextResponse | { retry: true }> {
  let inquiry;
  try {
    inquiry = await inquireZarinpalAuthority(merchantId, reservation.authority);
  } catch (error) {
    console.error('[payment/request:inquiry]', error);
    await updateAttempt(reservation.attemptId, { gatewayMessage: 'Gateway inquiry network error.' });
    return NextResponse.json({ success: false, uncertain: true, message: 'وضعیت تراکنش قبلی از زرین‌پال دریافت نشد. شناسه قبلی حفظ شد و پرداخت تازه‌ای ساخته نشد؛ کمی بعد دوباره بررسی کنید.' }, { status: 503 });
  }

  const { code, status, refId } = inquiry.result;
  await updateAttempt(reservation.attemptId, { gatewayCode: code, gatewayMessage: status || 'Inquiry returned no status.' });
  if (!inquiry.response.ok || code !== 100 || !status) {
    console.error('[Zarinpal Inquiry Error]', inquiry.data);
    return NextResponse.json({ success: false, uncertain: true, message: 'نتیجه استعلام تراکنش قطعی نیست. شناسه پرداخت قبلی حفظ شد و پرداخت جدیدی ساخته نشد.' }, { status: 409 });
  }

  if (status === 'VERIFIED') {
    const finalized = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${reservation.orderId}))`);
      return finalizePaymentInTransaction(tx, reservation.orderId, reservation.authority, refId, 'system');
    });
    if (!finalized) return NextResponse.json({ success: false, uncertain: true, message: 'درگاه پرداخت را تأیید کرده اما وضعیت سفارش نیازمند بررسی پشتیبانی است؛ پرداخت را تکرار نکنید.' }, { status: 409 });
    return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(reservation.orderId, reservation.trackingCode) });
  }

  if (status === 'PAID') {
    let verification;
    try {
      verification = await verifyZarinpalAuthority(merchantId, reservation.amount, reservation.authority);
    } catch (error) {
      console.error('[payment/request:verify-after-inquiry]', error);
      await updateAttempt(reservation.attemptId, { status: 'unknown', gatewayMessage: 'Inquiry reported PAID but verify request failed.' });
      return NextResponse.json({ success: false, uncertain: true, message: 'پرداخت در درگاه ثبت شده اما تأیید نهایی دریافت نشده است. از پرداخت مجدد خودداری کنید و دوباره وضعیت را بررسی کنید.' }, { status: 503 });
    }
    if (verification.response.ok && [100, 101].includes(verification.result.code)) {
      const finalRef = verification.result.refId ?? refId;
      const finalized = await db.transaction(async (tx) => {
        await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${reservation.orderId}))`);
        return finalizePaymentInTransaction(tx, reservation.orderId, reservation.authority, finalRef, 'system');
      });
      if (!finalized) return NextResponse.json({ success: false, uncertain: true, message: 'درگاه پرداخت را تأیید کرده اما ثبت نهایی سفارش نیازمند بررسی است؛ لطفاً پرداخت را تکرار نکنید.' }, { status: 409 });
      return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(reservation.orderId, reservation.trackingCode) });
    }
    await updateAttempt(reservation.attemptId, { status: 'unknown', gatewayCode: verification.result.code, gatewayMessage: 'Gateway reports PAID but final verification is unresolved.' });
    return NextResponse.json({ success: false, uncertain: true, message: 'درگاه پرداخت را انجام‌شده اعلام کرده، اما تأیید نهایی هنوز قطعی نیست. شناسه قبلی حفظ شده است؛ از پرداخت دوباره خودداری کنید.' }, { status: 409 });
  }

  if (status === 'IN_BANK') {
    await updateAttempt(reservation.attemptId, { status: 'in_bank', gatewayCode: code, gatewayMessage: status });
    return NextResponse.json({ success: true, paid: false, inProgress: true, reused: true, redirectUrl: startPayUrl(reservation.authority), message: 'تراکنش قبلی هنوز در درگاه در حال انجام است؛ همان درخواست قبلی باز می‌شود.' });
  }

  if (status === 'FAILED' || status === 'REVERSED') {
    const released = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${reservation.orderId}))`);
      const [current] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
        .from(orders).where(eq(orders.id, reservation.orderId)).limit(1);
      if (!current || current.status !== 'pending' || current.paymentAuthority !== reservation.authority) return false;
      await tx.update(paymentAttempts)
        .set({ status: status === 'FAILED' ? 'failed' : 'reversed', gatewayCode: code, gatewayMessage: status, lastCheckedAt: new Date(), updatedAt: new Date() })
        .where(eq(paymentAttempts.authority, reservation.authority));
      await tx.update(orders).set({ paymentAuthority: null })
        .where(and(eq(orders.id, reservation.orderId), eq(orders.status, 'pending'), eq(orders.paymentAuthority, reservation.authority)));
      await appendOrderEvent(tx, {
        orderId: reservation.orderId, actorType: 'gateway', eventType: status === 'FAILED' ? 'payment.failed' : 'payment.reversed',
        summary: status === 'FAILED' ? 'درگاه تراکنش را ناموفق اعلام کرد؛ تلاش جدید مجاز است.' : 'درگاه تراکنش را برگشت‌خورده اعلام کرد؛ تلاش جدید مجاز است.',
        metadata: { attemptId: reservation.attemptId, gatewayCode: code },
      });
      return true;
    });
    if (!released) return NextResponse.json({ success: false, uncertain: true, message: 'وضعیت سفارش هم‌زمان تغییر کرده است. صفحه را تازه‌سازی کنید.' }, { status: 409 });
    return { retry: true };
  }

  await updateAttempt(reservation.attemptId, { status: 'unknown', gatewayMessage: `Unrecognized inquiry status: ${status}` });
  return NextResponse.json({ success: false, uncertain: true, message: 'وضعیت تراکنش از درگاه قابل تفسیر نیست؛ شناسه قبلی حفظ شده و پرداخت جدیدی ساخته نشده است.' }, { status: 409 });
}

export async function POST(req: Request) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);

  try {
    const ip = getClientIp(req);
    const limit = await rateLimit('payment-request:' + ip, { failClosedOnStoreError: true });
    if (limit.unavailable) return NextResponse.json({ success: false, message: 'سامانه کنترل درخواست‌های پرداخت موقتاً در دسترس نیست.' }, { status: 503 });
    if (!limit.success) return NextResponse.json({ success: false, message: 'تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.' }, { status: 429 });

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'برای پرداخت ابتدا وارد شوید.' }, { status: 401 });
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: 'شناسه سفارش معتبر نیست.' }, { status: 400 });
    const { orderId } = parsed.data;

    const customerLimit = await rateLimit('payment-request-customer:' + customer.id, { failClosedOnStoreError: true });
    if (customerLimit.unavailable) return NextResponse.json({ success: false, message: 'سامانه کنترل درخواست‌های پرداخت موقتاً در دسترس نیست.' }, { status: 503 });
    if (!customerLimit.success) return NextResponse.json({ success: false, message: 'تعداد درخواست‌های پرداخت شما زیاد است.' }, { status: 429 });
    const orderLimit = await rateLimit('payment-request-order:' + customer.id + ':' + orderId, { failClosedOnStoreError: true });
    if (orderLimit.unavailable) return NextResponse.json({ success: false, uncertain: true, message: 'کنترل امنیتی پرداخت موقتاً در دسترس نیست؛ هیچ درخواست جدیدی ساخته نشد.' }, { status: 503 });
    if (!orderLimit.success) return NextResponse.json({ success: false, message: 'برای این سفارش درخواست‌های زیادی ثبت شده است.' }, { status: 429 });

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!merchantId || !baseUrl) return NextResponse.json({ success: false, message: 'تنظیمات درگاه یا آدرس سایت کامل نیست.' }, { status: 500 });
    const siteUrl = new URL(baseUrl);
    if (process.env.NODE_ENV === 'production' && siteUrl.protocol !== 'https:') {
      return NextResponse.json({ success: false, message: 'آدرس امن سایت تنظیم نشده است.' }, { status: 500 });
    }

    let reservation = await reserveOrInspectPayment(orderId, customer.id);
    if (reservation.kind === 'paid') {
      return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(reservation.orderId, reservation.trackingCode) });
    }
    if (reservation.kind === 'blocked') {
      return NextResponse.json({ success: false, uncertain: reservation.uncertain, message: reservation.message }, { status: reservation.status });
    }
    if (reservation.kind === 'reconcile') {
      const reconciled = await reconcileExistingAuthority(reservation, merchantId);
      if (reconciled instanceof NextResponse) return reconciled;
      reservation = await reserveOrInspectPayment(orderId, customer.id);
      if (reservation.kind === 'paid') return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(reservation.orderId, reservation.trackingCode) });
      if (reservation.kind === 'blocked') return NextResponse.json({ success: false, uncertain: reservation.uncertain, message: reservation.message }, { status: reservation.status });
      if (reservation.kind === 'reconcile') return NextResponse.json({ success: false, uncertain: true, message: 'وضعیت تراکنش هنوز در حال تطبیق است. کمی بعد دوباره بررسی کنید.' }, { status: 409 });
    }
    return issueGatewayAuthority(reservation as Extract<Reservation, { kind: 'create' }>, merchantId, siteUrl);
  } catch (error) {
    console.error('[payment/request]', error);
    return NextResponse.json({ success: false, uncertain: true, message: 'ارتباط با درگاه یا پایگاه داده کامل نشد. برای جلوگیری از پرداخت تکراری، وضعیت سفارش را از حساب کاربری یا پشتیبانی بررسی کنید.' }, { status: 502 });
  }
}
