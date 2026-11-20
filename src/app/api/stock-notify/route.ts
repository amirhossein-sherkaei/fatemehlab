import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { stockNotifications, products } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';

const schema = z.object({
  productId: z.string().uuid(),
  contact: z.string().trim().max(254).refine((value) => /^09\d{9}$/.test(value) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'ایمیل یا شماره موبایل معتبر نیست'),
});

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    const ip = getClientIp(req);
    const limit = await rateLimit('stock-notify:' + ip);
    if (!limit.success) return NextResponse.json({ message: 'تعداد درخواست‌ها زیاد است.' }, { status: 429 });
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    const { productId, contact } = parsed.data;

    const [product] = await db.select({ id: products.id, stock: products.stock, status: products.status })
      .from(products).where(eq(products.id, productId)).limit(1);
    if (!product || product.status !== 'published') return NextResponse.json({ message: 'محصول در دسترس نیست.' }, { status: 404 });
    if (product.stock > 0) return NextResponse.json({ message: 'این محصول در حال حاضر موجود است.' }, { status: 409 });

    const [existing] = await db.select({ id: stockNotifications.id }).from(stockNotifications)
      .where(and(eq(stockNotifications.productId, productId), eq(stockNotifications.phoneOrEmail, contact), eq(stockNotifications.status, 'pending'))).limit(1);
    if (existing) return NextResponse.json({ success: true, message: 'شما قبلاً ثبت‌نام کرده‌اید. به محض موجود شدن اطلاع می‌دهیم.' });

    await db.insert(stockNotifications).values({ productId, phoneOrEmail: contact });
    return NextResponse.json({ success: true, message: 'درخواست شما ثبت شد. به محض موجود شدن به شما اطلاع می‌دهیم.' });
  } catch (error) {
    console.error('[stock-notify]', error);
    return NextResponse.json({ message: 'خطا در ثبت درخواست' }, { status: 500 });
  }
}
