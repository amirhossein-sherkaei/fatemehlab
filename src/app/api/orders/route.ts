import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { orders, orderItems, products, coupons, customers } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { getCurrentCustomer } from '@/lib/customer-auth';

const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    phone: z.string().min(10).max(15),
    address: z.string().min(10).max(500),
    city: z.string().min(2).max(100),
    postalCode: z.string().min(10).max(10),
    notes: z.string().max(1000).optional().nullable(),
  }),
  cartItems: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().int().min(1).max(99),
    name: z.string().optional(),
  })).min(1),
  couponCode: z.string().optional().nullable(),
  usedPoints: z.number().min(0).optional().default(0),
});

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const currentCustomer = await getCurrentCustomer();
    if (!currentCustomer) return NextResponse.json({ message: 'برای ثبت سفارش ابتدا وارد شوید.' }, { status: 401 });

    const body = await req.json();
    const validated = orderSchema.parse(body);
    const { customer, cartItems, couponCode, usedPoints } = validated;

    // دریافت اطلاعات مشتری برای بررسی امتیازات
    const [customerData] = await db.select().from(customers).where(eq(customers.id, currentCustomer.id)).limit(1);
    if (!customerData) return NextResponse.json({ message: 'کاربر یافت نشد.' }, { status: 404 });

    if (usedPoints > customerData.loyaltyPoints) {
      return NextResponse.json({ message: 'امتیاز کافی برای استفاده ندارید.' }, { status: 400 });
    }

    const productIds = cartItems.map((item) => item.id);
    const dbProducts = await db.select().from(products).where(inArray(products.id, productIds));

    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of cartItems) {
      const dbProduct = dbProducts.find((p) => p.id === item.id);
      if (!dbProduct || dbProduct.status !== 'published') return NextResponse.json({ message: 'محصول یافت نشد.' }, { status: 400 });
      if (dbProduct.price <= 0) return NextResponse.json({ message: `قیمت ${dbProduct.name} ثبت نشده است.` }, { status: 400 });
      if (dbProduct.stock < item.quantity) return NextResponse.json({ message: `موجودی ${dbProduct.name} کافی نیست.` }, { status: 400 });

      subtotal += dbProduct.price * item.quantity;
      validatedItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
      });
    }

    let discountAmount = 0;
    let validCouponCode = null;

    if (couponCode) {
      const [coupon] = await db.select().from(coupons).where(eq(coupons.code, couponCode.trim().toUpperCase())).limit(1);
      if (coupon && coupon.isActive) {
        const now = new Date();
        const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < now;
        const isExhausted = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
        
        if (!isExpired && !isExhausted && subtotal >= coupon.minOrderAmount) {
          discountAmount = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
          if (coupon.type === 'percent' && coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
          if (discountAmount > subtotal) discountAmount = subtotal;
          validCouponCode = coupon.code;
        }
      }
    }

    // محاسبه تخفیف امتیاز (هر ۱ امتیاز = ۱۰,۰۰۰ ریال = ۱,۰۰۰ تومان)
    const pointsDiscount = usedPoints * 10000;
    const finalAmount = Math.max(0, subtotal - discountAmount - pointsDiscount);

    const orderId = crypto.randomUUID();
    const trackingCode = `FL-${orderId.slice(0, 6).toUpperCase()}`;

    const newOrder = await db.transaction(async (tx) => {
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
        usedPoints: usedPoints,
        couponCode: validCouponCode,
        status: 'pending',
        trackingCode,
      }).returning();

      await tx.insert(orderItems).values(validatedItems.map((item) => ({ ...item, orderId: orderId })));
      return order;
    });

    return NextResponse.json({ success: true, orderId: newOrder.id, trackingCode: newOrder.trackingCode });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ثبت سفارش' }, { status: 500 });
  }
}