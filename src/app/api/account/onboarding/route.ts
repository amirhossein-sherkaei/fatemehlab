import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { z } from 'zod';
import { getCurrentCustomer, createCustomerToken } from '@/lib/customer-auth';

function normalizeDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

const onboardingSchema = z.object({
  name: z.string().min(2, 'نام حداقل ۲ حرف باشد').max(100),
  email: z.string().email('ایمیل معتبر نیست'),
  phone: z.string().refine((val) => {
    const normalized = normalizeDigits(val).replace(/\s+/g, '');
    return /^0\d{10}$/.test(normalized);
  }, 'شماره تماس باید ۱۱ رقم و با ۰ شروع شود'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ حرف باشد'),
});

export async function POST(req: Request) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

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

    await db.update(customers).set({
      name: validated.name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
    }).where(eq(customers.id, current.id));

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