import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { z } from 'zod';
import { createCustomerToken } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';

const registerSchema = z.object({
  name: z.string().trim().min(2, 'نام باید حداقل ۲ حرف باشد').max(100),
  email: z.string().email('ایمیل معتبر نیست').max(254),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ حرف باشد').max(128),
});

export async function POST(req: Request) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);
  try {
    const ip = getClientIp(req);
    const rl = await rateLimit('customer-register:' + ip);
    if (!rl.success) {
      return NextResponse.json({ success: false, message: 'تعداد درخواست‌ها بیش از حد مجاز است.' }, { status: 429 });
    }

    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existing = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, validated.email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'این ایمیل قبلاً ثبت شده است' },
        { status: 400 }
      );
    }

    const passwordHash = await argon2.hash(validated.password);

    let newCustomer: typeof customers.$inferSelect | undefined;
    try {
      [newCustomer] = await db
        .insert(customers)
        .values({ name: validated.name, email: validated.email.toLowerCase(), passwordHash })
        .returning();
    } catch (insertError: any) {
      if (insertError?.cause?.code === '23505' || insertError?.code === '23505') {
        return NextResponse.json({ success: false, message: 'این ایمیل قبلاً ثبت شده است' }, { status: 409 });
      }
      throw insertError;
    }

    if (!newCustomer) return NextResponse.json({ success: false, message: 'ثبت‌نام کامل نشد.' }, { status: 500 });

    const token = await createCustomerToken({
      id: newCustomer.id,
      email: newCustomer.email,
      name: newCustomer.name,
    });

    // Set cookie explicitly on the response (most reliable method)
    const response = NextResponse.json({
      success: true,
      customer: { id: newCustomer.id, name: newCustomer.name, email: newCustomer.email },
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Register error:', error);
    return NextResponse.json({ success: false, message: 'خطا در ثبت‌نام' }, { status: 500 });
  }
}