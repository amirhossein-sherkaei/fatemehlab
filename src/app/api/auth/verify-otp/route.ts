import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createCustomerToken } from '@/lib/customer-auth';
import { Redis } from '@upstash/redis';
import { cookies } from 'next/headers';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf } from '@/lib/security';

function getRedis(): Redis | null {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    return new Redis({ url, token });
  } catch {
    return null;
  }
}

const IS_BYPASS = process.env.SMS_BYPASS_MODE === 'true' && process.env.NODE_ENV !== 'production';

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const body = await req.json().catch(() => ({}));
    const mobile = typeof body?.mobile === 'string' ? body.mobile.trim() : '';
    const code = typeof body?.code === 'string' ? body.code.trim() : '';
    if (!/^09\d{9}$/.test(mobile) || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ success: false, message: 'شماره موبایل یا کد تایید معتبر نیست.' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const [ipLimit, mobileLimit] = await Promise.all([
      rateLimit('otp-verify-ip:' + ip),
      rateLimit('otp-verify-mobile:' + mobile),
    ]);
    if (!ipLimit.success || !mobileLimit.success) {
      return NextResponse.json({ success: false, message: 'تعداد تلاش‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید.' }, { status: 429 });
    }

    let isValid = false;
    if (IS_BYPASS) {
      isValid = true;
    } else {
      const redis = getRedis();
      let storedCode: string | null = null;
      if (redis) {
        try { storedCode = await redis.get('otp:' + mobile) as string | null; }
        catch (error) { console.error('[otp] Redis read failed; checking short-lived cookie fallback.', error); }
      }
      if (!storedCode) {
        const cookieStore = await cookies();
        storedCode = cookieStore.get('otp_' + mobile)?.value || null;
      }
      isValid = Boolean(storedCode && storedCode === code);
    }

    if (!isValid) {
      return NextResponse.json({ success: false, message: 'کد تایید نامعتبر یا منقضی شده است.' }, { status: 400 });
    }

    const redis = getRedis();
    if (redis) { try { await redis.del('otp:' + mobile); } catch {} }

    const existingUsers = await db.select().from(customers).where(eq(customers.phone, mobile));
    let customer;
    let isNewUser = false;
    let needsOnboarding = false;

    if (existingUsers.length === 0) {
      const [newCustomer] = await db.insert(customers).values({
        name: 'کاربر ' + mobile.slice(-4),
        email: mobile + '@temp.fatemehlab.ir',
        phone: mobile,
        passwordHash: '',
      }).returning();
      customer = newCustomer;
      isNewUser = true;
      needsOnboarding = true;
    } else {
      existingUsers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      customer = existingUsers[0];
      needsOnboarding = customer.email.endsWith('@temp.fatemehlab.ir');
    }

    const token = await createCustomerToken({ id: customer.id, email: customer.email, name: customer.name });
    const response = NextResponse.json({
      success: true,
      isNewUser,
      needsOnboarding,
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
    response.cookies.set('otp_' + mobile, '', { maxAge: 0, path: '/' });
    return response;
  } catch (error) {
    console.error('[verify-otp]', error);
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}
