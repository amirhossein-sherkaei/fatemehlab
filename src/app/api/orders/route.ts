import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';
import { db } from '@/lib/db';
import { orders, orderItems, products, coupons, customers } from '@/db/schema';
import { eq, inArray, and, gte, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';
import { randomBytes } from 'node:crypto';

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

export async function POST(req: Request) {
  let requestOrderId: string | null = null;
  let requestCustomerId: string | null = null;
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const ip = getClientIp(req);
    const rl = await rateLimit('order-submit:' + ip);
    if (!rl.success) {
      return NextResponse.json({ message: 'تعداد درخواست‌ها زیاد است. لطفاً بعداً تلاش کنید.' }, { status: 429 });
    }

    const currentCustomer = await getCurrentCustomer();
    if (!currentCustomer) return NextResponse.json({ message: 'برای ثبت سفارش ابتدا وارد شوید.' }, { status: 401 });

    const parsed = orderSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || 'اطلاعات سفارش معتبر نیست.' }, { status: 400 });
    }

    const { customer, cartItems, couponCode, usedPoints, idempotencyKey } = parsed.data;
    requestOrderId = idempotencyKey;
    requestCustomerId = currentCustomer.id;

    // The client reuses this UUID when a network response is lost. Re-reading an
    // existing owned order prevents a duplicate order, stock reservation or coupon use.
    const [existingOrder] = await db.select({
      id: orders.id,
      trackingCode: orders.trackingCode,
      totalAmount: orders.totalAmount,
      status: orders.status,
    }).from(orders)
      .where(and(eq(orders.id, idempotencyKey), eq(orders.customerId, currentCustomer.id)))
      .limit(1);

    if (existingOrder) {
      const settled = ['paid', 'processing', 'shipped', 'delivered'].includes(existingOrder.status);
      if (existingOrder.status === 'cancelled') {
        return NextResponse.json({
          success: false,
          code: 'ORDER_ATTEMPT_EXPIRED',
          message: 'درخواست قبلی به سفارش لغوشده مربوط است. سبد خرید شما حفظ شده؛ دوباره ثبت سفارش را انجام دهید.',
        }, { status: 409 });
      }
      return NextResponse.json({
        success: true,
        orderId: existingOrder.id,
        trackingCode: existingOrder.trackingCode,
        paymentRequired: existingOrder.totalAmount > 0 && !settled,
        alreadyPaid: existingOrder.totalAmount > 0 && settled,
        status: existingOrder.status,
        reused: true,
      });
    }

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
    }

    const maxUsablePoints = Math.floor(Math.max(0, subtotal - discountAmount) / 10000);
    const actualUsedPoints = Math.min(usedPoints, maxUsablePoints);
    const pointsDiscount = actualUsedPoints * 10000;
    const finalAmount = Math.max(0, subtotal - discountAmount - pointsDiscount);

    const orderId = idempotencyKey;
    const trackingCode = 'FL-' + randomBytes(8).toString('hex').toUpperCase();

    const newOrder = await db.transaction(async (tx) => {
      if (couponIdToConsume) {
        const couponId = couponIdToConsume;
        const consumedCoupon = await tx.update(coupons)
          .set({ usedCount: sql`${coupons.usedCount} + 1` })
          .where(and(
            eq(coupons.id, couponId),
            eq(coupons.isActive, true),
            sql`(${coupons.startsAt} <= ${couponCheckTime})`,
            sql`(${coupons.expiresAt} IS NULL OR ${coupons.expiresAt} > ${couponCheckTime})`,
            sql`(${coupons.usageLimit} IS NULL OR ${coupons.usedCount} < ${coupons.usageLimit})`
          ))
          .returning({ id: coupons.id });
        if (consumedCoupon.length === 0) throw new Error('COUPON_UNAVAILABLE');
      }

      for (const item of validatedItems) {
        const stockUpdate = await tx.update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(and(eq(products.id, item.productId), gte(products.stock, item.quantity)))
          .returning({ id: products.id });
        if (stockUpdate.length === 0) throw new Error('STOCK_UNAVAILABLE:' + item.productName);
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
        notes: customer.notes || null,
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
          .returning({ id: customers.id });
        if (pointsUpdate.length === 0) throw new Error('POINTS_UNAVAILABLE');
      }

      return order;
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      trackingCode: newOrder.trackingCode,
      paymentRequired: newOrder.totalAmount > 0,
      alreadyPaid: false,
      status: newOrder.status,
    });
  } catch (error: any) {
    // A concurrent duplicate may hit stock/coupon/primary-key checks before the
    // first request returns. Once that transaction commits, return its order.
    if (requestOrderId && requestCustomerId) {
      try {
        const [existingOrder] = await db.select({
          id: orders.id,
          trackingCode: orders.trackingCode,
          totalAmount: orders.totalAmount,
          status: orders.status,
        }).from(orders)
          .where(and(eq(orders.id, requestOrderId), eq(orders.customerId, requestCustomerId)))
          .limit(1);
        if (existingOrder) {
          const settled = ['paid', 'processing', 'shipped', 'delivered'].includes(existingOrder.status);
          if (existingOrder.status === 'cancelled') {
            return NextResponse.json({
              success: false,
              code: 'ORDER_ATTEMPT_EXPIRED',
              message: 'درخواست قبلی به سفارش لغوشده مربوط است. سبد خرید شما حفظ شده؛ دوباره ثبت سفارش را انجام دهید.',
            }, { status: 409 });
          }
          return NextResponse.json({
            success: true,
            orderId: existingOrder.id,
            trackingCode: existingOrder.trackingCode,
            paymentRequired: existingOrder.totalAmount > 0 && !settled,
            alreadyPaid: existingOrder.totalAmount > 0 && settled,
            status: existingOrder.status,
            reused: true,
          });
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
