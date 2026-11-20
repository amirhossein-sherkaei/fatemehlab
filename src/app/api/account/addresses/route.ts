import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';
import { db } from '@/lib/db';
import { addresses } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';

const addressSchema = z.object({
  title: z.string().min(2, 'عنوان آدرس الزامی است'),
  firstName: z.string().min(1, 'نام الزامی است'),
  lastName: z.string().min(1, 'نام خانوادگی الزامی است'),
  phone: z.string().regex(/^09\d{9}$/, 'شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود'),
  province: z.string().min(2, 'استان الزامی است'),
  city: z.string().min(2, 'شهر الزامی است'),
  address: z.string().min(10, 'آدرس کامل الزامی است'),
  postalCode: z.string().length(10, 'کد پستی باید دقیقاً ۱۰ رقم باشد').regex(/^\d{10}$/, 'کد پستی معتبر نیست'),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false }, { status: 401 });

    const list = await db.select().from(addresses).where(eq(addresses.customerId, customer.id)).orderBy(desc(addresses.isDefault), desc(addresses.createdAt));
    return NextResponse.json({ success: true, addresses: list });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);

  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });
    const limit = await rateLimit(`address-create:${customer.id}`);
    if (!limit.success) return NextResponse.json({ success: false, message: 'تعداد درخواست‌های ثبت آدرس زیاد است. کمی بعد تلاش کنید.' }, { status: 429 });

    const parsed = addressSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    const validated = parsed.data;

    const newAddress = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${customer.id})::bigint)`);
      const existing = await tx.select({ id: addresses.id }).from(addresses).where(eq(addresses.customerId, customer.id)).limit(1);
      const isFirst = existing.length === 0;
      const makeDefault = validated.isDefault === true || isFirst;
      if (makeDefault) await tx.update(addresses).set({ isDefault: false }).where(eq(addresses.customerId, customer.id));
      const [created] = await tx.insert(addresses).values({
        customerId: customer.id,
        ...validated,
        isDefault: makeDefault,
      }).returning();
      return created;
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    console.error('[addresses/create]', error);
    return NextResponse.json({ success: false, message: 'خطا در ثبت آدرس' }, { status: 500 });
  }
}