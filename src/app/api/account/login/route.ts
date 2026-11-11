import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { z } from 'zod';
import { createCustomerToken } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';

const loginSchema = z.object({
  email: z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rl = await rateLimit('customer-login:' + ip);
    if (!rl.success) {
      return NextResponse.json({ success: false, message: 'تعداد تلاش‌ها بیش از حد مجاز است.' }, { status: 429 });
    }

    const body = await req.json();
    const validated = loginSchema.parse(body);

    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.email, validated.email.toLowerCase()))
      .limit(1);

    if (!customer) {
      return NextResponse.json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

    const isValid = await argon2.verify(customer.passwordHash, validated.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

    const token = await createCustomerToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });

    const response = NextResponse.json({
      success: true,
      customer: { id: customer.id, name: customer.name, email: customer.email },
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
      return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'خطا در ورود' }, { status: 500 });
  }
}