import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';
import { db } from '@/lib/db';
import { orders, orderItems, products, coupons, customers, orderEvents } from '@/db/schema';
import { eq, inArray, and, gte, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';
import { createHmac, randomBytes } from 'node:crypto';

const orderSchema = z.object({
  idempotencyKey: z.string().uuid(),
  customer: z.object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست'),
    address: z.string().trim().min(10).max(500),
    city: z.string().trim().min(2).max(100),
    postalCode: z.string().regex(/^\d{10}$/, 'کد پستی باید ۱۰ رقم باشد'),
    notes: z.string().max(1000).optional().nullable(),
  }),
  cartItems: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().int().min(1).max(99),
    name: z.string().optional(),
  })).min(1).max(100),
  couponCode: z.string().trim().max(100).optional().nullable(),
  usedPoints: z.number().int().min(0).optional().default(0),
});

const SETTLED_STATUSES = new Set(['paid', 'processing', 'shipped', 'delivered']);

function buildRequestFingerprint(input: {
  customer: z.infer<typeof orderSchema>['customer'];
  cartItems: Array<{ id: string; quantity: number }>;
  couponCode: string | null | undefined;
  usedPoints: number;
}): string {
  const canonical = {
    customer: {
      firstName: input.customer.firstName.trim(),
      lastName: input.customer.lastName.trim(),
      phone: input.customer.phone,
      address: input.customer.address.trim(),
      city: input.customer.city.trim(),
      postalCode: input.customer.postalCode,
      notes: input.customer.notes?.trim() || null,
    },
    cartItems: [...input.cartItems]
      .map((item) => ({ id: item.id.toLowerCase(), quantity: item.quantity }))
      .sort((a, b) => a.id.localeCompare(b.id)),
    couponCode: input.couponCode?.trim().toUpperCase() || null,
    usedPoints: input.usedPoints,
  };
  const fingerprintSecret = process.env.JWT_SECRET;
  if (!fingerprintSecret) throw new Error('IDEMPOTENCY_FINGERPRINT_SECRET_MISSING');
  return createHmac('sha256', fingerprintSecret).update(JSON.stringify(canonical)).digest('hex');
}

async function inspectIdempotentOrder(
  tx: any,
  orderId: string,
  customerId: string,
  requestHash: string,
  request: {
    customer: z.infer<typeof orderSchema>['customer'];
    cartItems: Array<{ id: string; quantity: number }>;
    couponCode: string | null;
    usedPoints: number;
  },
) {
  const [existing] = await tx.select().from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.customerId, customerId)))
    .limit(1);
  if (!existing) return { kind: 'missing' as const };

  const [createdEvent] = await tx.select({ metadata: orderEvents.metadata })
    .from(orderEvents)
    .where(and(eq(orderEvents.orderId, orderId), eq(orderEvents.eventType, 'order.created')))
    .orderBy(sql`${orderEvents.createdAt} ASC`)
    .limit(1);
  const storedHash = createdEvent?.metadata?.requestHash;
  if (typeof storedHash === 'string') {
    if (storedHash !== requestHash) return { kind: 'conflict' as const };
  } else {
    // Compatibility for orders created before request fingerprints existed.
    // Reuse only when every client-controlled, persisted field and line quantity matches.
    const [orderLines, customerFields] = await Promise.all([
      tx.select({ productId: orderItems.productId, quantity: orderItems.quantity })
        .from(orderItems).where(eq(orderItems.orderId, orderId)),
      Promise.resolve(existing),
    ]);
    const expectedLines = [...request.cartItems].map((item) => ({ productId: item.id, quantity: item.quantity }))
      .sort((a, b) => a.productId.localeCompare(b.productId));
    const actualLines = [...orderLines].sort((a, b) => a.productId.localeCompare(b.productId));
    const sameLines = expectedLines.length === actualLines.length && expectedLines.every((line, index) =>
      line.productId === actualLines[index]?.productId && line.quantity === actualLines[index]?.quantity);
    const sameCustomer = customerFields.firstName === request.customer.firstName
      && customerFields.lastName === request.customer.lastName
      && customerFields.phone === request.customer.phone
      && customerFields.address === request.customer.address
      && customerFields.city === request.customer.city
      && customerFields.postalCode === request.customer.postalCode
      && (customerFields.notes || null) === (request.customer.notes?.trim() || null)
      && (customerFields.couponCode || null) === request.couponCode
      && customerFields.usedPoints === request.usedPoints;
    if (!sameLines || !sameCustomer) return { kind: 'conflict' as const };
  }

  if (existing.status === 'cancelled') return { kind: 'expired' as const, order: existing };
  const settled = SETTLED_STATUSES.has(existing.status);
  return {
    kind: 'reused' as const,
    order: existing,
    paymentRequired: existing.totalAmount > 0 && !settled,
    alreadyPaid: existing.totalAmount > 0 && settled,
  };
}

function responseForReusedOrder(result: any) {
  if (result.kind === 'expired') {
    return NextResponse.json({
      success: false,
      code: 'ORDER_ATTEMPT_EXPIRED',
      message: 'درخواست قبلی به سفارش لغوشده مربوط است. سبد خرید شما حفظ شده؛ دوباره ثبت سفارش را انجام دهید.',
    }, { status: 409 });
  }
  if (result.kind === 'conflict') {
    return NextResponse.json({
      success: false,
      code: 'IDEMPOTENCY_KEY_REUSED',
      message: 'شناسه این تلاش قبلاً برای اطلاعات متفاوتی استفاده شده است. صفحه تسویه‌حساب را تازه‌سازی و دوباره تلاش کنید.',
    }, { status: 409 });
  }
  return NextResponse.json({
    success: true,
    orderId: result.order.id,
    trackingCode: result.order.trackingCode,
    paymentRequired: result.paymentRequired,
    alreadyPaid: result.alreadyPaid,
    status: result.order.status,
    reused: true,
  });
}

export async function POST(req: Request) {
  let requestOrderId: string | null = null;
  let requestCustomerId: string | null = null;
  let requestHashForRecovery: string | null = null;
  let recoveryRequest: { customer: z.infer<typeof orderSchema>['customer']; cartItems: Array<{ id: string; quantity: number }>; couponCode: string | null; usedPoints: number } | null = null;
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const ip = getClientIp(req);
    const rl = await rateLimit('order-submit:' + ip, { failClosedOnStoreError: true });
    if (rl.unavailable) return NextResponse.json({ message: 'سامانه کنترل درخواست‌ها موقتاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید.' }, { status: 503 });
    if (!rl.success) return NextResponse.json({ message: 'تعداد درخواست‌ها زیاد است. لطفاً بعداً تلاش کنید.' }, { status: 429 });

    const currentCustomer = await getCurrentCustomer();
    if (!currentCustomer) return NextResponse.json({ message: 'برای ثبت سفارش ابتدا وارد شوید.' }, { status: 401 });
    const customerLimit = await rateLimit('order-submit-customer:' + currentCustomer.id, { failClosedOnStoreError: true });
    if (customerLimit.unavailable) return NextResponse.json({ message: 'سامانه کنترل درخواست‌ها موقتاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید.' }, { status: 503 });
    if (!customerLimit.success) return NextResponse.json({ message: 'تعداد سفارش‌های ارسالی شما در این بازه زیاد است. کمی بعد دوباره تلاش کنید.' }, { status: 429 });

    const parsed = orderSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || 'اطلاعات سفارش معتبر نیست.' }, { status: 400 });
    }

    const { customer, cartItems: submittedCartItems, couponCode, usedPoints, idempotencyKey } = parsed.data;
    const mergedQuantities = new Map<string, number>();
    for (const item of submittedCartItems) {
      const combined = (mergedQuantities.get(item.id) ?? 0) + item.quantity;
      if (combined > 99) {
        return NextResponse.json({ message: 'تعداد یک محصول در سفارش نمی‌تواند بیشتر از ۹۹ عدد باشد.' }, { status: 400 });
      }
      mergedQuantities.set(item.id, combined);
    }
    const cartItems = [...mergedQuantities.entries()].map(([id, quantity]) => ({ id, quantity }));
    const requestHash = buildRequestFingerprint({ customer, cartItems, couponCode, usedPoints });
    const normalizedCouponCode = couponCode?.trim().toUpperCase() || null;
    requestHashForRecovery = requestHash;
    recoveryRequest = { customer, cartItems, couponCode: normalizedCouponCode, usedPoints };

    requestOrderId = idempotencyKey;
    requestCustomerId = currentCustomer.id;

    // Fast path; the transaction below repeats this check while holding an
    // advisory lock so two simultaneous submissions cannot pass together.
    const existingResult = await db.transaction(async (tx) =>
      inspectIdempotentOrder(tx, idempotencyKey, currentCustomer.id, requestHash, {
        customer, cartItems, couponCode: normalizedCouponCode, usedPoints,
      }),
    );
    if (existingResult.kind !== 'missing') return responseForReusedOrder(existingResult);

    const [customerData] = await db.select().from(customers).where(eq(customers.id, currentCustomer.id)).limit(1);
    if (!customerData) return NextResponse.json({ message: 'کاربر یافت نشد.' }, { status: 404 });
    if (usedPoints > customerData.loyaltyPoints) {
      return NextResponse.json({ message: 'امتیاز کافی برای استفاده ندارید.' }, { status: 400 });
    }

    const productIds = [...new Set(cartItems.map((item) => item.id))];
    const dbProducts = await db.select().from(products).where(inArray(products.id, productIds));
    const validatedItems: Array<{ productId: string; productName: string; price: number; quantity: number }> = [];
    let subtotal = 0;

    for (const item of cartItems) {
      const dbProduct = dbProducts.find((product) => product.id === item.id);
      if (!dbProduct || dbProduct.status !== 'published') {
        return NextResponse.json({ message: 'یکی از محصولات سبد خرید دیگر قابل سفارش نیست.' }, { status: 400 });
      }
      if (dbProduct.price <= 0) {
        return NextResponse.json({ message: 'قیمت ' + dbProduct.name + ' ثبت نشده است.' }, { status: 400 });
      }
      if (dbProduct.stock < item.quantity) {
        return NextResponse.json({ message: 'موجودی ' + dbProduct.name + ' کافی نیست.' }, { status: 400 });
      }
      subtotal += dbProduct.price * item.quantity;
      validatedItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
      });
    }
    if (!Number.isSafeInteger(subtotal) || subtotal > 2_147_483_647) {
      return NextResponse.json({ message: 'مبلغ سبد خرید از سقف مجاز سفارش بیشتر است.' }, { status: 400 });
    }

    let discountAmount = 0;
    let validCouponCode: string | null = null;
    let couponIdToConsume: string | null = null;
    let couponSnapshot: typeof coupons.$inferSelect | null = null;
    const couponCheckTime = new Date();

    if (couponCode) {
      const normalizedCode = couponCode.trim().toUpperCase();
      const [coupon] = await db.select().from(coupons).where(eq(coupons.code, normalizedCode)).limit(1);
      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ message: 'کد تخفیف معتبر یا فعال نیست.' }, { status: 400 });
      }
      if (coupon.startsAt && new Date(coupon.startsAt) > couponCheckTime) {
        return NextResponse.json({ message: 'زمان استفاده از این کد تخفیف هنوز شروع نشده است.' }, { status: 400 });
      }
      if (coupon.expiresAt && new Date(coupon.expiresAt) <= couponCheckTime) {
        return NextResponse.json({ message: 'کد تخفیف منقضی شده است.' }, { status: 400 });
      }
      if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
        return NextResponse.json({ message: 'ظرفیت استفاده از کد تخفیف تکمیل شده است.' }, { status: 400 });
      }
      if (subtotal < coupon.minOrderAmount) {
        return NextResponse.json({ message: 'حداقل مبلغ سفارش برای این کد تخفیف رعایت نشده است.' }, { status: 400 });
      }

      discountAmount = coupon.type === 'percent'
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value;
      if (coupon.type === 'percent' && coupon.maxDiscountAmount != null) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
      discountAmount = Math.min(Math.max(0, discountAmount), subtotal);
      validCouponCode = coupon.code;
      couponIdToConsume = coupon.id;
      couponSnapshot = coupon;
    }

    const maxUsablePoints = Math.floor(Math.max(0, subtotal - discountAmount) / 10000);
    const actualUsedPoints = Math.min(usedPoints, maxUsablePoints);
    const pointsDiscount = actualUsedPoints * 10000;
    const finalAmount = Math.max(0, subtotal - discountAmount - pointsDiscount);

    const orderId = idempotencyKey;
    const trackingCode = 'FL-' + randomBytes(8).toString('hex').toUpperCase();

    const transactionResult = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:checkout'), hashtext(${idempotencyKey}))`);
      const lockedExisting = await inspectIdempotentOrder(tx, idempotencyKey, currentCustomer.id, requestHash, {
        customer, cartItems, couponCode: normalizedCouponCode, usedPoints,
      });
      if (lockedExisting.kind !== 'missing') return lockedExisting;

      if (couponIdToConsume && couponSnapshot) {
        const couponId = couponIdToConsume;
        const consumedCoupon = await tx.update(coupons)
          .set({ usedCount: sql`${coupons.usedCount} + 1` })
          .where(and(
            eq(coupons.id, couponId),
            eq(coupons.code, couponSnapshot.code),
            eq(coupons.isActive, true),
            eq(coupons.type, couponSnapshot.type),
            eq(coupons.value, couponSnapshot.value),
            eq(coupons.minOrderAmount, couponSnapshot.minOrderAmount),
            sql`(${coupons.maxDiscountAmount} IS NOT DISTINCT FROM ${couponSnapshot.maxDiscountAmount})`,
            sql`(${coupons.startsAt} IS NOT DISTINCT FROM ${couponSnapshot.startsAt})`,
            sql`(${coupons.expiresAt} IS NOT DISTINCT FROM ${couponSnapshot.expiresAt})`,
            sql`(${coupons.startsAt} IS NULL OR ${coupons.startsAt} <= ${couponCheckTime})`,
            sql`(${coupons.expiresAt} IS NULL OR ${coupons.expiresAt} > ${couponCheckTime})`,
            sql`(${coupons.usageLimit} IS NULL OR ${coupons.usedCount} < ${coupons.usageLimit})`,
          ))
          .returning({ id: coupons.id });
        if (consumedCoupon.length === 0) throw new Error('COUPON_UNAVAILABLE');
      }

      for (const item of validatedItems) {
        const stockUpdate = await tx.update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(and(
            eq(products.id, item.productId),
            eq(products.status, 'published'),
            eq(products.price, item.price),
            gte(products.stock, item.quantity),
          ))
          .returning({ id: products.id });
        if (stockUpdate.length === 0) {
          const [currentProduct] = await tx.select({ status: products.status, price: products.price, stock: products.stock })
            .from(products).where(eq(products.id, item.productId)).limit(1);
          if (!currentProduct || currentProduct.status !== 'published' || currentProduct.price !== item.price) {
            throw new Error('PRODUCT_CHANGED:' + item.productName);
          }
          throw new Error('STOCK_UNAVAILABLE:' + item.productName);
        }
      }

      const [order] = await tx.insert(orders).values({
        id: orderId,
        customerId: currentCustomer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        notes: customer.notes?.trim() || null,
        totalAmount: finalAmount,
        discountAmount: discountAmount + pointsDiscount,
        usedPoints: actualUsedPoints,
        couponCode: validCouponCode,
        status: finalAmount === 0 ? 'paid' : 'pending',
        trackingCode,
      }).returning();

      await tx.insert(orderItems).values(validatedItems.map((item) => ({ ...item, orderId })));

      if (actualUsedPoints > 0) {
        const pointsUpdate = await tx.update(customers)
          .set({ loyaltyPoints: sql`${customers.loyaltyPoints} - ${actualUsedPoints}` })
          .where(and(eq(customers.id, currentCustomer.id), gte(customers.loyaltyPoints, actualUsedPoints)))
          .returning({ id: customers.id, loyaltyPoints: customers.loyaltyPoints });
        if (pointsUpdate.length === 0) throw new Error('POINTS_UNAVAILABLE');
        const remainingPoints = pointsUpdate[0].loyaltyPoints;
        const tier = remainingPoints >= 1500 ? 'gold' : remainingPoints >= 500 ? 'silver' : 'bronze';
        await tx.update(customers).set({ tier }).where(eq(customers.id, currentCustomer.id));
      }

      await tx.insert(orderEvents).values({
        orderId,
        actorType: 'customer',
        actorId: currentCustomer.id,
        eventType: 'order.created',
        fromStatus: null,
        toStatus: order.status,
        summary: 'سفارش با اطلاعات و قیمت‌های تأییدشده سرور ثبت شد.',
        metadata: {
          requestHash,
          lineCount: validatedItems.length,
          subtotal,
          couponDiscount: discountAmount,
          pointsDiscount,
          finalAmount,
        },
      });
      if (finalAmount === 0) {
        await tx.insert(orderEvents).values({
          orderId,
          actorType: 'system',
          eventType: 'order.zero_value_settled',
          fromStatus: null,
          toStatus: 'paid',
          summary: 'مبلغ نهایی سفارش صفر بود؛ پرداخت آنلاین لازم نیست.',
          metadata: { amount: 0 },
        });
      }

      return { kind: 'created' as const, order };
    });

    if (transactionResult.kind !== 'created') return responseForReusedOrder(transactionResult);
    const newOrder = transactionResult.order;

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      trackingCode: newOrder.trackingCode,
      paymentRequired: newOrder.totalAmount > 0 && !SETTLED_STATUSES.has(newOrder.status),
      alreadyPaid: newOrder.totalAmount > 0 && SETTLED_STATUSES.has(newOrder.status),
      status: newOrder.status,
    });
  } catch (error: any) {
    // A concurrent duplicate may hit stock/coupon/primary-key checks before the
    // first request returns. Once that transaction commits, return its order.
    if (requestOrderId && requestCustomerId) {
      try {
        if (requestHashForRecovery && recoveryRequest) {
          const recovered = await db.transaction(async (tx) => inspectIdempotentOrder(
            tx, requestOrderId!, requestCustomerId!, requestHashForRecovery!, recoveryRequest!,
          ));
          if (recovered.kind !== 'missing') return responseForReusedOrder(recovered);
        }
      } catch (lookupError) {
        console.error('[orders/idempotency-lookup]', lookupError);
      }
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.issues[0]?.message || 'اطلاعات سفارش معتبر نیست.' }, { status: 400 });
    }
    if (error?.message === 'COUPON_UNAVAILABLE') {
      return NextResponse.json({ message: 'این کد تخفیف هم‌اکنون قابل استفاده نیست. دوباره بررسی کنید.' }, { status: 400 });
    }
    if (String(error?.message || '').startsWith('PRODUCT_CHANGED:')) {
      return NextResponse.json({ message: 'قیمت یا وضعیت یکی از محصولات هنگام ثبت سفارش تغییر کرده است. سبد خرید را تازه‌سازی کنید و مبلغ جدید را بررسی کنید.' }, { status: 409 });
    }
    if (error?.message === 'POINTS_UNAVAILABLE') {
      return NextResponse.json({ message: 'موجودی امتیاز شما کافی نیست.' }, { status: 400 });
    }
    if (String(error?.message || '').startsWith('STOCK_UNAVAILABLE:')) {
      return NextResponse.json({ message: 'موجودی یکی از محصولات کافی نیست: ' + String(error.message).split(':').slice(1).join(':') }, { status: 400 });
    }
    console.error('[orders/create]', error);
    return NextResponse.json({ message: 'خطا در ثبت سفارش' }, { status: 500 });
  }
}
