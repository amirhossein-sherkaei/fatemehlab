import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';

const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1, 'نام الزامی است').max(100),
    lastName: z.string().min(1, 'نام خانوادگی الزامی است').max(100),
    phone: z.string().min(10, 'شماره تماس معتبر نیست').max(15),
    address: z.string().min(10, 'آدرس کامل الزامی است').max(500),
    city: z.string().min(2, 'شهر الزامی است').max(100),
    postalCode: z.string().min(10, 'کد پستی الزامی است').max(10),
    notes: z.string().max(1000).optional().nullable(),
  }),
  cartItems: z
    .array(
      z.object({
        id: z.string().uuid('شناسه محصول معتبر نیست'),
        quantity: z.number().int().min(1, 'تعداد باید حداقل ۱ باشد').max(99),
        name: z.string().optional(),
      })
    )
    .min(1, 'سبد خرید خالی است'),
});

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const body = await req.json();
    const validated = orderSchema.parse(body);
    const { customer, cartItems } = validated;

    const productIds = cartItems.map((item) => item.id);
    const dbProducts = await db
      .select()
      .from(products)
      .where(inArray(products.id, productIds));

    let totalAmount = 0;
    const validatedItems: any[] = [];

    for (const item of cartItems) {
      const dbProduct = dbProducts.find((p) => p.id === item.id);

      if (!dbProduct || dbProduct.status !== 'published') {
        return NextResponse.json(
          { message: 'محصول یافت نشد یا منتشر نشده است.' },
          { status: 400 }
        );
      }

      if (dbProduct.price <= 0) {
        return NextResponse.json(
          { message: `قیمت محصول ${dbProduct.name} هنوز ثبت نشده و امکان سفارش وجود ندارد.` },
          { status: 400 }
        );
      }

      if (dbProduct.stock < item.quantity) {
        return NextResponse.json(
          { message: `موجودی ${dbProduct.name} کافی نیست.` },
          { status: 400 }
        );
      }

      totalAmount += dbProduct.price * item.quantity;
      validatedItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
      });
    }

    const orderId = crypto.randomUUID();
    const trackingCode = `FL-${orderId.slice(0, 6).toUpperCase()}`;

    const currentCustomer = await getCurrentCustomer();
    if (!currentCustomer) {
      return NextResponse.json(
        { message: 'برای ثبت سفارش ابتدا وارد حساب کاربری خود شوید.' },
        { status: 401 }
      );
    }
    const customerId = currentCustomer.id;

    const newOrder = await db.transaction(async (tx) => {
      const [order] = await tx
        .insert(orders)
        .values({
          id: orderId,
          customerId: customerId,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          address: customer.address,
          city: customer.city,
          postalCode: customer.postalCode,
          notes: customer.notes || null,
          totalAmount,
          status: 'pending',
          trackingCode,
        })
        .returning();

      await tx
        .insert(orderItems)
        .values(validatedItems.map((item) => ({ ...item, orderId: orderId })));

      for (const item of validatedItems) {
        const product = dbProducts.find((p) => p.id === item.productId)!;
        await tx
          .update(products)
          .set({ stock: product.stock - item.quantity })
          .where(eq(products.id, item.productId));
      }

      return order;
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      trackingCode: newOrder.trackingCode,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Order error:', error);
    return NextResponse.json({ message: 'خطا در ثبت سفارش' }, { status: 500 });
  }
}