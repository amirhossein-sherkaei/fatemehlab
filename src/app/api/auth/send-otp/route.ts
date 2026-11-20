import { NextResponse } from 'next/server';
import { randomInt } from 'node:crypto';
import { rateLimit } from '@/lib/rate-limit';
import { sendOtpCode } from '@/lib/sms';
import { Redis } from '@upstash/redis';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';

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
    if (!/^09\d{9}$/.test(mobile)) {
      return NextResponse.json({ success: false, message: 'شماره موبایل معتبر نیست.' }, { status: 400 });
    }

    const ip = getClientIp(req);
    const [ipLimit, mobileLimit] = await Promise.all([
      rateLimit('otp-send-ip:' + ip),
      rateLimit('otp-send-mobile:' + mobile),
    ]);
    if (!ipLimit.success || !mobileLimit.success) {
      return NextResponse.json({ success: false, message: 'تعداد درخواست‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید.' }, { status: 429 });
    }

    const existingUsers = await db.select({ id: customers.id, email: customers.email })
      .from(customers).where(eq(customers.phone, mobile)).limit(1);
    const isExistingUser = existingUsers.length > 0;
    const needsOnboarding = isExistingUser && existingUsers[0].email.endsWith('@temp.fatemehlab.ir');
    const code = String(randomInt(100000, 1000000));

    const redis = getRedis();
    if (redis) {
      try { await redis.set('otp:' + mobile, code, { ex: 120 }); }
      catch (error) { console.error('[otp] Redis write failed; short-lived HTTP-only cookie fallback will be used.', error); }
    }

    if (!IS_BYPASS) {
      try {
        const result = await Promise.race([
          sendOtpCode(mobile, code),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('SMS Timeout')), 15000)),
        ]);
        if (!result || !result.success) {
          if (redis) { try { await redis.del('otp:' + mobile); } catch {} }
          return NextResponse.json({ success: false, message: 'ارسال پیامک انجام نشد. کمی بعد دوباره تلاش کنید.' }, { status: 502 });
        }
      } catch (error) {
        if (redis) { try { await redis.del('otp:' + mobile); } catch {} }
        console.error('[SMS OTP]', error);
        return NextResponse.json({ success: false, message: 'ارسال پیامک با مشکل مواجه شد. کمی بعد دوباره تلاش کنید.' }, { status: 502 });
      }
    } else {
      console.log('[SMS BYPASS] Mobile: ' + mobile + ' | Code: ' + code);
    }

    const response = NextResponse.json({
      success: true,
      message: isExistingUser ? 'کد تایید ارسال شد.' : 'به فاطمه بیوتی لند خوش آمدید. کد تایید ارسال شد.',
      bypassCode: IS_BYPASS ? code : undefined,
      isExistingUser,
      needsOnboarding,
    });

    response.cookies.set('otp_' + mobile, code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 120,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('[send-otp fatal]', error);
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}
