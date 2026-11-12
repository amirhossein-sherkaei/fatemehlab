import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { stockNotifications } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  productId: z.string().uuid(),
  contact: z.string().min(5, 'ایمیل یا شماره موبایل معتبر نیست'),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rl = await rateLimit('stock-notify:' + ip);
    if (!rl.success) return NextResponse.json({ message: 'تعداد درخواست‌ها زیاد است.' }, { status: 429 });

    const body = await req.json();
    const { productId, contact } = schema.parse(body);

    // بررسی اینکه آیا کاربر قبلاً درخواست داده است؟
    const existing = await db.select().from(stockNotifications)
      .where(and(eq(stockNotifications.productId, productId), eq(stockNotifications.phoneOrEmail, contact)))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: 'شما قبلاً ثبت‌نام کرده‌اید. به محض موجود شدن اطلاع می‌دهیم.' });
    }

    await db.insert(stockNotifications).values({
      productId,
      phoneOrEmail: contact,
    });

    return NextResponse.json({ success: true, message: 'درخواست شما ثبت شد. به محض موجود شدن به شما اطلاع می‌دهیم.' });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ثبت درخواست' }, { status: 500 });
  }
}