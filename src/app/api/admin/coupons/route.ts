import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

const couponSchema = z.object({
  code: z.string().min(2).max(50).regex(/^[A-Za-z0-9_-]+$/),
  description: z.string().max(500).optional().nullable(),
  type: z.enum(['percent', 'fixed']),
  value: z.coerce.number().int().min(1).max(2147483647),
  minOrderAmount: z.coerce.number().int().min(0).max(2147483647).default(0),
  maxDiscountAmount: z.coerce.number().int().min(1).max(2147483647).optional().nullable(),
  usageLimit: z.coerce.number().int().min(1).max(100000000).optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
}).refine((value) => value.type !== 'percent' || value.value <= 100, {
  message: 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.',
  path: ['value'],
});

export async function GET() {
  try {
    await verifyAdmin();
    const all = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    return NextResponse.json({ success: true, coupons: all });
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const body = await req.json();
    const v = couponSchema.parse(body);
    if (v.expiresAt && Number.isNaN(new Date(v.expiresAt).getTime())) return NextResponse.json({ message: 'تاریخ انقضای کد تخفیف معتبر نیست.' }, { status: 400 });
    const [existing] = await db.select().from(coupons).where(eq(coupons.code, v.code.toUpperCase())).limit(1);
    if (existing) return NextResponse.json({ message: 'این کد قبلاً وجود دارد' }, { status: 400 });
    const [newCoupon] = await db.insert(coupons).values({
      code: v.code.toUpperCase(),
      description: v.description || null,
      type: v.type,
      value: v.value,
      minOrderAmount: v.minOrderAmount || 0,
      maxDiscountAmount: v.maxDiscountAmount || null,
      usageLimit: v.usageLimit || null,
      expiresAt: v.expiresAt ? new Date(v.expiresAt) : null,
      isActive: v.isActive,
    }).returning();
    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (e: any) {
    if (e instanceof z.ZodError) return NextResponse.json({ message: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}