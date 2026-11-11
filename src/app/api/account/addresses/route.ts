import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { addresses } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';

const addressSchema = z.object({
  title: z.string().min(2, 'عنوان آدرس الزامی است'),
  firstName: z.string().min(1, 'نام الزامی است'),
  lastName: z.string().min(1, 'نام خانوادگی الزامی است'),
  phone: z.string().min(10, 'شماره موبایل معتبر نیست'),
  province: z.string().min(2, 'استان الزامی است'),
  city: z.string().min(2, 'شهر الزامی است'),
  address: z.string().min(10, 'آدرس کامل الزامی است'),
  postalCode: z.string().min(10, 'کد پستی ۱۰ رقمی الزامی است'),
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
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const body = await req.json();
    const validated = addressSchema.parse(body);

    // اگر اولین آدرس است، به صورت خودکار پیش‌فرض شود
    const existing = await db.select({ id: addresses.id }).from(addresses).where(eq(addresses.customerId, customer.id));
    const isFirst = existing.length === 0;

    // اگر این آدرس به عنوان پیش‌فرض انتخاب شد، بقیه را غیر پیش‌فرض کنیم
    if (validated.isDefault || isFirst) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.customerId, customer.id));
    }

    const [newAddress] = await db.insert(addresses).values({
      customerId: customer.id,
      ...validated,
      isDefault: validated.isDefault || isFirst,
    }).returning();

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'خطا در ثبت آدرس' }, { status: 500 });
  }
}