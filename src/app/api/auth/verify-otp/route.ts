import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createCustomerToken } from '@/lib/customer-auth';
import { Redis } from '@upstash/redis';
import { cookies } from 'next/headers';

function getRedis(): Redis | null {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token || url.trim() === '' || token.trim() === '') return null;
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

const IS_BYPASS = process.env.SMS_BYPASS_MODE === 'true';

export async function POST(req: Request) {
  try {
    const { mobile, code } = await req.json();

    if (!mobile || !code) {
      return NextResponse.json({ message: 'اطلاعات ناقص است.' }, { status: 400 });
    }

    let isValid = false;

    if (IS_BYPASS) {
      isValid = true;
    } else {
      const redis = getRedis();
      let storedCode: string | null = null;

      // ۱. تلاش برای خواندن از Redis
      if (redis) {
        try { storedCode = await redis.get(`otp:${mobile}`); } catch (e) {}
      }

      // ۲. اگر در Redis نبود، از کوکی امن می‌خوانیم (پشتیبان Serverless)
      if (!storedCode) {
        const cookieStore = await cookies();
        storedCode = cookieStore.get(`otp_${mobile}`)?.value || null;
      }

      if (storedCode && storedCode === code) {
        isValid = true;
      }
    }

    if (!isValid) {
      return NextResponse.json({ message: 'کد تایید نامعتبر یا منقضی شده است.' }, { status: 400 });
    }

    // پاک کردن کدهای استفاده شده
    const redis = getRedis();
    if (redis) {
      try { await redis.del(`otp:${mobile}`); } catch (e) {}
    }

    // پیدا کردن یا ساخت کاربر
    const existingUsers = await db.select().from(customers).where(eq(customers.phone, mobile));
    let customer;
    let isNewUser = false;
    let needsOnboarding = false;

    if (existingUsers.length === 0) {
      const [newCustomer] = await db.insert(customers).values({
        name: `کاربر ${mobile.slice(-4)}`,
        email: `${mobile}@temp.fatemehlab.ir`,
        phone: mobile,
        passwordHash: '',
      }).returning();
      customer = newCustomer;
      isNewUser = true;
      needsOnboarding = true;
    } else {
      existingUsers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      customer = existingUsers[0];
      isNewUser = false;
      needsOnboarding = customer.email.endsWith('@temp.fatemehlab.ir');
    }

    const token = await createCustomerToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });

    const response = NextResponse.json({
      success: true,
      isNewUser,
      needsOnboarding,
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });

    // ست کردن کوکی لاگین
    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    // پاک کردن کوکی کد تایید
    response.cookies.set(`otp_${mobile}`, '', { maxAge: 0, path: '/' });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}