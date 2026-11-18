import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  code: z.string().trim().min(1).max(100),
  orderAmount: z.number().finite().min(0),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = await rateLimit('coupon-validate:' + ip);
    if (!rl.success) {
      return NextResponse.json({ success: false, message: 'تعداد تلاش‌ها زیاد است. لطفاً کمی بعد تلاش کنید.' }, { status: 429 });
    }

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'اطلاعات کد تخفیف معتبر نیست.' }, { status: 400 });
    }

    const code = parsed.data.code.toUpperCase();
    const orderAmount = parsed.data.orderAmount;
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
    if (!coupon) return NextResponse.json({ success: false, message: 'کد تخفیف یافت نشد' }, { status: 404 });
    if (!coupon.isActive) return NextResponse.json({ success: false, message: 'کد غیرفعال است' }, { status: 400 });

    const now = new Date();
    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return NextResponse.json({ success: false, message: 'زمان استفاده از این کد تخفیف هنوز شروع نشده است.' }, { status: 400 });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) <= now) {
      return NextResponse.json({ success: false, message: 'کد منقضی شده' }, { status: 400 });
    }
    if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, message: 'ظرفیت استفاده از کد تکمیل شده است.' }, { status: 400 });
    }
    if (orderAmount < coupon.minOrderAmount) {
      return NextResponse.json({ success: false, message: 'حداقل مبلغ سفارش ' + coupon.minOrderAmount.toLocaleString('fa-IR') + ' ریال است.' }, { status: 400 });
    }

    let discount = coupon.type === 'percent'
      ? Math.round((orderAmount * coupon.value) / 100)
      : coupon.value;

    if (coupon.type === 'percent' && coupon.maxDiscountAmount != null && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
    discount = Math.min(Math.max(0, discount), orderAmount);

    return NextResponse.json({
      success: true,
      coupon: { code: coupon.code, description: coupon.description, type: coupon.type, value: coupon.value },
      discount,
    });
  } catch (error) {
    console.error('[coupon/validate]', error);
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}
