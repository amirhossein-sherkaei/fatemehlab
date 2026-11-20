import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq, and, ne, sql } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { z } from 'zod';
import { getCurrentCustomer, createCustomerToken } from '@/lib/customer-auth';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

function normalizeDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

const onboardingSchema = z.object({
  name: z.string().min(2, 'نام حداقل ۲ حرف باشد').max(100),
  email: z.string().email('ایمیل معتبر نیست').max(254),
  phone: z.string().refine((val) => {
    const normalized = normalizeDigits(val).replace(/\s+/g, '');
    return /^0\d{10}$/.test(normalized);
  }, 'شماره تماس باید ۱۱ رقم و با ۰ شروع شود'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ حرف باشد').max(128),
});

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });
    const limit = await rateLimit('account-onboarding:' + current.id);
    if (!limit.success) return NextResponse.json({ success: false, message: 'تعداد تلاش‌ها زیاد است. کمی بعد تلاش کنید.' }, { status: 429 });

    const body = await req.json();
    const validated = onboardingSchema.parse(body);

    const normalizedEmail = validated.email.toLowerCase().trim();
    const normalizedPhone = normalizeDigits(validated.phone).replace(/\s+/g, '');

    const existing = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0 && existing[0].id !== current.id) {
      return NextResponse.json({ success: false, message: 'این ایمیل قبلاً ثبت شده است' }, { status: 400 });
    }

    const passwordHash = await argon2.hash(validated.password);
    const updateResult = await db.transaction(async (tx) => {
      // Use the same phone lock as the phone-change endpoint to prevent concurrent duplicate claims.
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${normalizedPhone})::bigint)`);
      const [phoneOwner] = await tx.select({ id: customers.id }).from(customers)
        .where(and(eq(customers.phone, normalizedPhone), ne(customers.id, current.id))).limit(1);
      if (phoneOwner) return 'phone-taken';
      const [updated] = await tx.update(customers).set({
        name: validated.name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash,
      }).where(eq(customers.id, current.id)).returning({ id: customers.id });
      return updated ? 'updated' : 'missing';
    });
    if (updateResult === 'phone-taken') return NextResponse.json({ success: false, message: 'این شماره تماس قبلاً برای حساب دیگری ثبت شده است.' }, { status: 409 });
    if (updateResult === 'missing') return NextResponse.json({ success: false, message: 'حساب کاربری یافت نشد.' }, { status: 404 });

    // Update JWT token to reflect the new email
    const newToken = await createCustomerToken({
      id: current.id,
      email: normalizedEmail,
      name: validated.name.trim(),
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('customer_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'خطا در ذخیره اطلاعات' }, { status: 500 });
  }
}