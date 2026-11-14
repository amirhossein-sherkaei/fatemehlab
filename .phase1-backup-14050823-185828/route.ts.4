import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(1),
  orderAmount: z.number().min(0),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, orderAmount } = schema.parse(body);
    const normalizedCode = code.trim().toUpperCase();
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, normalizedCode)).limit(1);

    if (!coupon) return NextResponse.json({ success: false, message: 'کد تخفیف یافت نشد' }, { status: 404 });
    if (!coupon.isActive) return NextResponse.json({ success: false, message: 'کد غیرفعال است' }, { status: 400 });

    const now = new Date();
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) return NextResponse.json({ success: false, message: 'کد منقضی شده' }, { status: 400 });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return NextResponse.json({ success: false, message: 'ظرفیت تکمیل شده' }, { status: 400 });
    if (orderAmount < coupon.minOrderAmount) return NextResponse.json({ success: false, message: `حداقل مبلغ ${coupon.minOrderAmount.toLocaleString('fa-IR')} ریال` }, { status: 400 });

    let discount = coupon.type === 'percent'
      ? Math.round((orderAmount * coupon.value) / 100)
      : coupon.value;

    if (coupon.type === 'percent' && coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
    if (discount > orderAmount) discount = orderAmount;

    return NextResponse.json({ success: true, coupon: { code: coupon.code, description: coupon.description, type: coupon.type, value: coupon.value }, discount });
  } catch {
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}