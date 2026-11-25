import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { orders, orderEvents, paymentAttempts } from '@/db/schema';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';
import { appendOrderEvent, finalizePaymentInTransaction, isSettledOrderStatus } from '@/lib/order-payment';
import {
  isZibalDefinitiveFailure,
  isZibalInProgress,
  isZibalPaymentVerified,
  requestZibalPayment,
  verifyZibalPayment,
  zibalStartUrl,
} from '@/lib/zibal';

const bodySchema = z.object({ orderId: z.string().uuid() });

function successUrl(orderId: string, trackingCode: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';
  const target = new URL('/order/success', baseUrl);
  target.searchParams.set('id', orderId);
  target.searchParams.set('code', trackingCode);
  return `${target.pathname}${target.search}`;
}

type Reservation =
  | { kind: 'paid'; orderId: string; trackingCode: string }
  | { kind: 'reconcile'; orderId: string; trackingCode: string; amount: number; authority: string; attemptId: string }
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
    if (!Number.isSafeInteger(order.totalAmount) || order.totalAmount < 0) return { kind: 'blocked', status: 409, uncertain: false, message: 'مبلغ سفارش معتبر نیست؛ با پشتیبانی تماس بگیرید.' };

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
      const [attempt] = await tx.select({
        id: paymentAttempts.id,
        provider: paymentAttempts.provider,
        status: paymentAttempts.status,
      }).from(paymentAttempts)
        .where(and(eq(paymentAttempts.orderId, order.id), eq(paymentAttempts.authority, order.paymentAuthority)))
        .limit(1);

      if (!attempt || attempt.provider !== 'zibal') {
        return {
          kind: 'blocked', status: 409, uncertain: true,
          message: 'این سفارش یک شناسه پرداخت قدیمی یا نامشخص دارد. برای جلوگیری از تأیید اشتباه یا پرداخت تکراری، ادامه خودکار متوقف شده است؛ پشتیبانی باید سابقه این سفارش را بررسی کند.',
        };
      }

      return {
        kind: 'reconcile', orderId: order.id, trackingCode: order.trackingCode,
        amount: order.totalAmount, authority: order.paymentAuthority, attemptId: attempt.id,
      };
    }

    const [latest] = await tx.select().from(paymentAttempts)
      .where(eq(paymentAttempts.orderId, order.id))
      .orderBy(desc(paymentAttempts.attemptNumber))
      .limit(1);

    if (latest?.status === 'verified' && latest.authority) {
      return {
        kind: 'blocked', status: 409, uncertain: true,
        message: 'دفتر پرداخت یک تلاش قبلی را تأییدشده نشان می‌دهد، اما پیوند آن با سفارش کامل نیست. برای جلوگیری از پرداخت مجدد، نیاز به بررسی پشتیبانی دارد.',
      };
    }

    if (latest && ['requesting', 'unknown', 'in_bank', 'awaiting_customer'].includes(latest.status)) {
      if (latest.provider !== 'zibal') {
        return {
          kind: 'blocked', status: 409, uncertain: true,
          message: 'یک تلاش پرداخت قدیمی از درگاه قبلی هنوز تعیین‌تکلیف نشده است. تلاش جدید تا بررسی سابقه ساخته نمی‌شود.',
        };
      }

      // Repair the order pointer if a Zibal trackId was committed to the ledger
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
          ? 'نتیجه درخواست قبلی زیبال نامشخص است. برای جلوگیری از پرداخت تکراری، درخواست تازه‌ای ساخته نمی‌شود؛ وضعیت سفارش باید تطبیق داده شود.'
          : 'درخواست پرداخت قبلی هنوز در حال ثبت است. چند لحظه بعد وضعیت را دوباره بررسی کنید.',
      };
    }

    const attemptNumber = (latest?.attemptNumber ?? 0) + 1;
    const [attempt] = await tx.insert(paymentAttempts).values({
      orderId: order.id,
      requestKey: randomUUID(),
      attemptNumber,
      provider: 'zibal',
      amount: order.totalAmount,
      status: 'requesting',
      requestedAt: new Date(),
      updatedAt: new Date(),
    }).returning({ id: paymentAttempts.id });

    await appendOrderEvent(tx, {
      orderId: order.id, actorType: 'customer', actorId: customerId,
      eventType: 'payment.request_started', summary: 'درخواست ایجاد تراکنش پرداخت زیبال ثبت شد.',
      metadata: { attemptNumber, amount: order.totalAmount, provider: 'zibal' },
    });

    return { kind: 'create', orderId: order.id, trackingCode: order.trackingCode, amount: order.totalAmount, attemptId: attempt.id };
  });
}

function paymentErrorDetails(error: unknown): Record<string, string> {
  const clean = (value: unknown): string | undefined => {
    if (typeof value !== 'string') return undefined;
    return value
      .replace(/https?:\/\/[^\s"'<>]+/gi, '[url]')
      .replace(/(authorization\s*[:=]\s*bearer\s+)[^\s"'<>]+/gi, '$1[redacted]')
      .replace(/((?:secret|signature|token|user_content_key)\s*[:=]\s*["']?)[^&\s"',}]+/gi, '$1[redacted]')
      .slice(0, 500);
  };

  const details: Record<string, string> = {};
  if (!(error instanceof Error)) {
    details.name = 'UnknownError';
    details.message = clean(String(error)) ?? 'Non-Error thrown';
    return details;
  }

  details.name = error.name.slice(0, 80);
  details.message = clean(error.message) ?? 'No error message';

  const cause = (error as Error & { cause?: unknown }).cause;
  if (cause && typeof cause === 'object') {
    const record = cause as Record<string, unknown>;
    if (typeof record.name === 'string') details.causeName = record.name.slice(0, 80);
    if (typeof record.message === 'string') details.causeMessage = clean(record.message) ?? 'No cause message';
    if (typeof record.code === 'string' || typeof record.code === 'number') details.causeCode = String(record.code).slice(0, 80);
    if (typeof record.syscall === 'string') details.causeSyscall = record.syscall.slice(0, 80);
    if (typeof record.hostname === 'string') details.causeHostname = record.hostname.slice(0, 120);
  }

  return details;
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

async function issueZibalPayment(
  reservation: Extract<Reservation, { kind: 'create' }>,
  merchantId: string,
  siteUrl: URL,
): Promise<NextResponse> {
  const callbackUrl = new URL('/api/payment/verify', siteUrl);
  callbackUrl.searchParams.set('orderId', reservation.orderId);

  let requested: Awaited<ReturnType<typeof requestZibalPayment>>;
  try {
    requested = await requestZibalPayment({
      merchant: merchantId,
      amount: reservation.amount,
      callbackUrl: callbackUrl.toString(),
      description: 'پرداخت سفارش ' + reservation.trackingCode,
      orderId: reservation.orderId,
    });
  } catch (error) {
    console.error('[Zibal Request Network Error]', paymentErrorDetails(error));
    await updateAttempt(reservation.attemptId, { status: 'unknown', gatewayMessage: 'Gateway request timed out or connection was interrupted.' });
    await db.insert(orderEvents).values({
      orderId: reservation.orderId, actorType: 'system', eventType: 'payment.request_unknown',
      summary: 'نتیجه درخواست ایجاد تراکنش زیبال دریافت نشد؛ درخواست جدید برای جلوگیری از پرداخت تکراری مسدود شد.',
      metadata: { attemptId: reservation.attemptId, provider: 'zibal' },
    });
    return NextResponse.json({ success: false, uncertain: true, message: 'ارتباط با زیبال قطع شد و نتیجه درخواست قبلی مشخص نیست. برای جلوگیری از پرداخت تکراری، تراکنش تازه‌ای ساخته نمی‌شود؛ کمی بعد وضعیت سفارش را دوباره بررسی کنید.' }, { status: 503 });
  }

  const { response, state } = requested;
  const trackId = state.trackId;
  // Zibal's structured result/trackId are authoritative; an intermediate HTTP
  // proxy status must not discard a valid transaction ID returned by Zibal.
  if (state.result !== 100 || !trackId) {
    const definitiveRejection = [102, 103, 104, 105, 106, 113].includes(state.result ?? -1);
    const attemptStatus = definitiveRejection ? 'failed' : 'unknown';
    const safeMessage = state.message || `Zibal did not return a usable trackId (result ${state.result ?? 'unknown'}, HTTP ${response.status}).`;
    await updateAttempt(reservation.attemptId, {
      status: attemptStatus,
      gatewayCode: state.result,
      gatewayMessage: safeMessage,
    });
    await db.insert(orderEvents).values({
      orderId: reservation.orderId, actorType: 'gateway',
      eventType: definitiveRejection ? 'payment.request_rejected' : 'payment.request_unknown',
      summary: definitiveRejection ? 'زیبال درخواست پرداخت را نپذیرفت؛ پس از رفع علت، تلاش جدید مجاز است.' : 'پاسخ ایجاد تراکنش زیبال قابل‌اعتماد نبود؛ تلاش جدید تا تطبیق نتیجه مسدود است.',
      metadata: { attemptId: reservation.attemptId, gatewayCode: state.result, provider: 'zibal' },
    });
    return NextResponse.json({ success: false, uncertain: !definitiveRejection, message: definitiveRejection
      ? (safeMessage || 'زیبال درخواست پرداخت را نپذیرفت. می‌توانید پس از رفع مشکل دوباره تلاش کنید.')
      : 'پاسخ زیبال ناقص یا نامشخص است. برای جلوگیری از پرداخت تکراری، درخواست تازه‌ای ساخته نخواهد شد؛ وضعیت سفارش را دوباره بررسی کنید.' }, { status: 502 });
  }

  const saved = await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${reservation.orderId}))`);
    const [order] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, reservation.orderId)).limit(1);
    const [attempt] = await tx.select({ status: paymentAttempts.status, provider: paymentAttempts.provider })
      .from(paymentAttempts).where(eq(paymentAttempts.id, reservation.attemptId)).limit(1);
    if (!order || !attempt || attempt.status !== 'requesting' || attempt.provider !== 'zibal') return false;
    if (order.status !== 'pending') return false;
    if (order.paymentAuthority && order.paymentAuthority !== trackId) return false;

    if (!order.paymentAuthority) {
      const [orderUpdate] = await tx.update(orders)
        .set({ paymentAuthority: trackId })
        .where(and(eq(orders.id, reservation.orderId), eq(orders.status, 'pending'), isNull(orders.paymentAuthority)))
        .returning({ id: orders.id });
      if (!orderUpdate) return false;
    }
    await tx.update(paymentAttempts)
      .set({ authority: trackId, status: 'awaiting_customer', gatewayCode: 100, gatewayMessage: null, updatedAt: new Date() })
      .where(and(eq(paymentAttempts.id, reservation.attemptId), eq(paymentAttempts.status, 'requesting')));
    await appendOrderEvent(tx, {
      orderId: reservation.orderId, actorType: 'gateway', eventType: 'payment.authority_created',
      summary: 'زیبال شناسه تراکنش صادر کرد و پیوند پرداخت آماده شد.',
      metadata: { attemptId: reservation.attemptId, amount: reservation.amount, provider: 'zibal' },
    });
    return true;
  });

  if (!saved) {
    // The external trackId exists but could not be safely attached to the order.
    // Keep the attempt unresolved; never create another trackId blindly.
    await updateAttempt(reservation.attemptId, { status: 'unknown', authority: trackId, gatewayCode: 100, gatewayMessage: 'TrackId issued but order binding did not complete.' });
    return NextResponse.json({ success: false, uncertain: true, message: 'زیبال شناسه پرداخت صادر کرده اما ثبت ارتباط آن با سفارش کامل نشد. برای جلوگیری از پرداخت تکراری، دوباره تلاش نکنید و وضعیت سفارش را بررسی کنید.' }, { status: 409 });
  }

  return NextResponse.json({ success: true, paid: false, redirectUrl: zibalStartUrl(trackId), attemptId: reservation.attemptId });
}

async function markDefinitiveFailure(
  reservation: Extract<Reservation, { kind: 'reconcile' }>,
  gatewayCode: number | null,
  message: string,
): Promise<boolean> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${reservation.orderId}))`);
    const [order] = await tx.select({ status: orders.status, paymentAuthority: orders.paymentAuthority })
      .from(orders).where(eq(orders.id, reservation.orderId)).limit(1);
    if (!order || order.status !== 'pending' || order.paymentAuthority !== reservation.authority) return false;

    const [attempt] = await tx.select({ id: paymentAttempts.id, provider: paymentAttempts.provider })
      .from(paymentAttempts)
      .where(and(eq(paymentAttempts.orderId, reservation.orderId), eq(paymentAttempts.authority, reservation.authority)))
      .limit(1);
    if (!attempt || attempt.provider !== 'zibal') return false;

    await tx.update(paymentAttempts).set({
      status: 'failed', gatewayCode, gatewayMessage: message.slice(0, 180),
      lastCheckedAt: new Date(), updatedAt: new Date(),
    }).where(eq(paymentAttempts.id, attempt.id));
    await tx.update(orders).set({ paymentAuthority: null })
      .where(and(eq(orders.id, reservation.orderId), eq(orders.status, 'pending'), eq(orders.paymentAuthority, reservation.authority)));
    await appendOrderEvent(tx, {
      orderId: reservation.orderId, actorType: 'gateway', eventType: 'payment.failed',
      summary: 'زیبال تراکنش را به‌طور قطعی ناموفق اعلام کرد؛ امکان تلاش مجدد فراهم شد.',
      metadata: { gatewayCode, attemptId: attempt.id, provider: 'zibal' },
    });
    return true;
  });
}

async function reconcileExistingTrackId(
  reservation: Extract<Reservation, { kind: 'reconcile' }>,
  merchantId: string,
): Promise<NextResponse | { retry: true }> {
  let verification: Awaited<ReturnType<typeof verifyZibalPayment>>;
  try {
    verification = await verifyZibalPayment(merchantId, reservation.authority);
  } catch (error) {
    console.error('[payment/request:zibal-verify-network]', paymentErrorDetails(error));
    await updateAttempt(reservation.attemptId, { status: 'unknown', gatewayMessage: 'Zibal verification network error.' });
    return NextResponse.json({ success: false, uncertain: true, message: 'وضعیت تراکنش قبلی از زیبال دریافت نشد. شناسه قبلی حفظ شده و پرداخت تازه‌ای ساخته نمی‌شود؛ کمی بعد دوباره بررسی کنید.' }, { status: 503 });
  }

  const { response, state } = verification;
  await updateAttempt(reservation.attemptId, { gatewayCode: state.result, gatewayMessage: state.message || 'Zibal verification returned no message.' });
  if (response.ok && isZibalPaymentVerified(state, reservation.amount)) {
    const finalized = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${reservation.orderId}))`);
      return finalizePaymentInTransaction(tx, reservation.orderId, reservation.authority, state.refNumber, 'system');
    });
    if (!finalized) return NextResponse.json({ success: false, uncertain: true, message: 'زیبال پرداخت را تأیید کرده اما ثبت نهایی سفارش نیازمند بررسی پشتیبانی است؛ پرداخت را تکرار نکنید.' }, { status: 409 });
    return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(reservation.orderId, reservation.trackingCode) });
  }

  if (response.ok && isZibalDefinitiveFailure(state)) {
    const released = await markDefinitiveFailure(reservation, state.result, state.message || 'Zibal reports that the payment was not completed.');
    if (!released) return NextResponse.json({ success: false, uncertain: true, message: 'وضعیت سفارش هم‌زمان تغییر کرده است. برای جلوگیری از پرداخت تکراری، صفحه را تازه‌سازی و وضعیت سفارش را بررسی کنید.' }, { status: 409 });
    return { retry: true };
  }

  if (response.ok && isZibalInProgress(state) && state.status === -1) {
    await updateAttempt(reservation.attemptId, { status: 'in_bank', gatewayCode: state.result, gatewayMessage: state.message || 'Payment is still pending at the bank.' });
    return NextResponse.json({ success: true, paid: false, inProgress: true, reused: true, redirectUrl: zibalStartUrl(reservation.authority), message: 'تراکنش قبلی هنوز در حال انجام است؛ همان درخواست قبلی باز می‌شود و پرداخت جدیدی ساخته نمی‌شود.' });
  }

  await updateAttempt(reservation.attemptId, { status: 'unknown', gatewayCode: state.result, gatewayMessage: state.message || 'Zibal verification is unresolved.' });
  console.error('[Zibal Verify Unresolved]', { result: state.result, status: state.status, amountMatches: state.amount === reservation.amount });
  return NextResponse.json({ success: false, uncertain: true, message: 'نتیجه تأیید تراکنش از زیبال هنوز قطعی نیست. شناسه پرداخت قبلی حفظ شده و برای جلوگیری از پرداخت تکراری، درخواست جدیدی ساخته نشده است.' }, { status: 409 });
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

    const merchantId = process.env.ZIBAL_MERCHANT_ID?.trim();
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir').trim();
    if (!merchantId || merchantId.length > 128) return NextResponse.json({ success: false, message: 'شناسه پذیرنده زیبال در تنظیمات سرور ثبت نشده است.' }, { status: 500 });
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
      const reconciled = await reconcileExistingTrackId(reservation, merchantId);
      if (reconciled instanceof NextResponse) return reconciled;
      reservation = await reserveOrInspectPayment(orderId, customer.id);
      if (reservation.kind === 'paid') return NextResponse.json({ success: true, paid: true, redirectUrl: successUrl(reservation.orderId, reservation.trackingCode) });
      if (reservation.kind === 'blocked') return NextResponse.json({ success: false, uncertain: reservation.uncertain, message: reservation.message }, { status: reservation.status });
      if (reservation.kind === 'reconcile') return NextResponse.json({ success: false, uncertain: true, message: 'وضعیت تراکنش هنوز در حال تطبیق است. کمی بعد دوباره بررسی کنید.' }, { status: 409 });
    }
    return issueZibalPayment(reservation as Extract<Reservation, { kind: 'create' }>, merchantId, siteUrl);
  } catch (error) {
    console.error('[payment/request]', error instanceof Error ? error.name : 'UnknownError');
    return NextResponse.json({ success: false, uncertain: true, message: 'ارتباط با زیبال یا پایگاه داده کامل نشد. برای جلوگیری از پرداخت تکراری، وضعیت سفارش را از حساب کاربری یا پشتیبانی بررسی کنید.' }, { status: 502 });
  }
}
