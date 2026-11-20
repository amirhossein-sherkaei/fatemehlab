import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const { id } = await params;
    const schema = z.object({
      description: z.string().max(500).optional().nullable(),
      type: z.enum(['percent', 'fixed']),
      value: z.coerce.number().int().min(1).max(1000000000),
      minOrderAmount: z.coerce.number().int().min(0).max(2147483647).default(0),
      maxDiscountAmount: z.coerce.number().int().min(1).max(2147483647).optional().nullable(),
      usageLimit: z.coerce.number().int().min(1).max(100000000).optional().nullable(),
      expiresAt: z.string().optional().nullable(),
      isActive: z.boolean(),
    }).refine((value) => value.type !== 'percent' || value.value <= 100, {
      message: 'درصد تخفیف نمی‌تواند بیشتر از ۱۰۰ باشد.',
      path: ['value'],
    });
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || 'اطلاعات کد تخفیف معتبر نیست.' }, { status: 400 });
    const body = parsed.data;
    if (body.expiresAt && Number.isNaN(new Date(body.expiresAt).getTime())) {
      return NextResponse.json({ message: 'تاریخ انقضای کد تخفیف معتبر نیست.' }, { status: 400 });
    }
    const [updated] = await db.update(coupons).set({
      description: body.description || null,
      type: body.type,
      value: body.value,
      minOrderAmount: body.minOrderAmount,
      maxDiscountAmount: body.maxDiscountAmount || null,
      usageLimit: body.usageLimit || null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      isActive: body.isActive,
    }).where(eq(coupons.id, id)).returning({ id: coupons.id });
    if (!updated) return NextResponse.json({ message: 'کد تخفیف یافت نشد.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const { id } = await params;
    await db.delete(coupons).where(eq(coupons.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}