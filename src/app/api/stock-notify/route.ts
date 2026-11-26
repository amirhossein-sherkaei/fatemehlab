import { NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { addresses, customers, orders, products, stockNotifications } from '@/db/schema';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';

function normalizeIranMobile(value: unknown): string {
  const digits = String(value || '')
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/\D/g, '');

  if (/^09\d{9}$/.test(digits)) return digits;
  if (/^989\d{9}$/.test(digits)) return '0' + digits.slice(2);
  if (/^9\d{9}$/.test(digits)) return '0' + digits;
  return '';
}

const contactSchema = z.string().trim().max(32)
  .transform(normalizeIranMobile)
  .refine((value) => /^09\d{9}$/.test(value), 'شماره موبایل ۱۱ رقمی معتبر نیست');

const schema = z.object({
  productId: z.string().uuid(),
  contact: contactSchema.optional(),
});

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);

  try {
    const ip = getClientIp(req);
    const limit = await rateLimit('stock-notify:' + ip);
    if (!limit.success) {
      return NextResponse.json({ message: 'تعداد درخواست‌ها زیاد است. کمی بعد دوباره تلاش کنید.' }, { status: 429 });
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || 'اطلاعات درخواست معتبر نیست.' }, { status: 400 });
    }

    const { productId, contact: guestContact } = parsed.data;
    const currentCustomer = await getCurrentCustomer();
    let contact: string;

    if (currentCustomer) {
      // Never trust contact details supplied by an authenticated browser.
      // Use the signed-in customer's saved phone, then address or previous order phone.
      const [customer] = await db.select({ email: customers.email, phone: customers.phone })
        .from(customers)
        .where(eq(customers.id, currentCustomer.id))
        .limit(1);

      if (!customer?.email) {
        return NextResponse.json({ message: 'اطلاعات حساب شما در دسترس نیست. دوباره وارد حساب شوید.' }, { status: 401 });
      }

      // Reuse the best trusted phone already attached to the customer's account.
      let savedPhone = normalizeIranMobile(customer.phone);
      if (!savedPhone) {
        const [savedAddress] = await db.select({ phone: addresses.phone })
          .from(addresses)
          .where(eq(addresses.customerId, currentCustomer.id))
          .orderBy(desc(addresses.isDefault), desc(addresses.createdAt))
          .limit(1);
        savedPhone = normalizeIranMobile(savedAddress?.phone);
      }
      if (!savedPhone) {
        const [latestOrder] = await db.select({ phone: orders.phone })
          .from(orders)
          .where(eq(orders.customerId, currentCustomer.id))
          .orderBy(desc(orders.createdAt))
          .limit(1);
        savedPhone = normalizeIranMobile(latestOrder?.phone);
      }

      // Back-in-stock delivery currently uses SMS. Do not save an email that
      // the existing restock worker cannot deliver; direct the signed-in user
      // to complete the phone once in their profile instead of asking here.
      if (!/^09\d{9}$/.test(savedPhone)) {
        return NextResponse.json({
          message: 'برای دریافت پیامک، یک شماره موبایل در پروفایل حساب خود ثبت کنید. در این پنجره نیازی به واردکردن شماره نیست.',
          requiresPhone: true,
        }, { status: 409 });
      }

      contact = savedPhone;
    } else {
      if (!guestContact) {
        return NextResponse.json({ message: 'برای ثبت درخواست به‌عنوان مهمان، شماره موبایل لازم است.' }, { status: 400 });
      }
      contact = guestContact;
    }

    const [product] = await db.select({ id: products.id, stock: products.stock, status: products.status })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product || product.status !== 'published') {
      return NextResponse.json({ message: 'محصول در دسترس نیست.' }, { status: 404 });
    }
    if (product.stock > 0) {
      return NextResponse.json({ message: 'این محصول در حال حاضر موجود است.' }, { status: 409 });
    }

    const [existing] = await db.select({ id: stockNotifications.id })
      .from(stockNotifications)
      .where(and(
        eq(stockNotifications.productId, productId),
        eq(stockNotifications.phoneOrEmail, contact),
        eq(stockNotifications.status, 'pending'),
      ))
      .limit(1);

    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'درخواست قبلی شما برای این محصول ثبت شده است؛ نیازی به ثبت دوباره نیست.',
      });
    }

    await db.insert(stockNotifications).values({ productId, phoneOrEmail: contact });
    return NextResponse.json({
      success: true,
      message: 'درخواست اطلاع‌رسانی شما با موفقیت ثبت شد.',
    });
  } catch (error) {
    console.error('[stock-notify]', error instanceof Error ? error.message : 'unknown_error');
    return NextResponse.json({ message: 'در ثبت درخواست مشکلی پیش آمد. دوباره تلاش کنید.' }, { status: 500 });
  }
}
