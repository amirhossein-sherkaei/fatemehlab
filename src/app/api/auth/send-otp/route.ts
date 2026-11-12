import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { sendOtpCode } from '@/lib/sms';
import { Redis } from '@upstash/redis';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';

function getRedis(): Redis | null {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    return new Redis({ url, token });
  } catch { return null; }
}

const IS_BYPASS = process.env.SMS_BYPASS_MODE === 'true';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const mobile = body?.mobile;

    if (!mobile || !/^09\d{9}$/.test(mobile)) {
      return NextResponse.json({ success: false, message: 'شماره موبایل معتبر نیست.' }, { status: 400 });
    }

    // 🛡️ محدودیت ارسال بر اساس شماره موبایل (جلوگیری از اسپم)
    try {
      const rl = await rateLimit('otp-send:' + mobile);
      if (!rl.success) {
        return NextResponse.json({ success: false, message: 'لطفاً ۱ دقیقه صبر کنید و دوباره تلاش کنید.' }, { status: 429 });
      }
    } catch (e) {}

    const existingUsers = await db.select({ id: customers.id, email: customers.email }).from(customers).where(eq(customers.phone, mobile)).limit(1);
    const isExistingUser = existingUsers.length > 0;
    const needsOnboarding = isExistingUser && existingUsers[0].email.endsWith('@temp.fatemehlab.ir');

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // ذخیره در Redis (اگر در دسترس باشد)
    const redis = getRedis();
    if (redis) {
      try { await redis.set(`otp:${mobile}`, code, { ex: 120 }); } catch (e) {}
    }

    // ارسال پیامک
    if (!IS_BYPASS) {
      try {
        const result = await Promise.race([
          sendOtpCode(mobile, code),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('SMS Timeout')), 15000))
        ]);
        
        if (!result.success) {
          console.error('[SMS ERROR]', result.error);
        }
      } catch (err: any) {
        console.error('[SMS TIMEOUT]', err.message);
      }
    } else {
      console.log(`[SMS BYPASS] Mobile: ${mobile} | Code: ${code}`);
    }

    const response = NextResponse.json({
      success: true,
      message: isExistingUser ? 'کد تایید ارسال شد.' : 'به فاطمه بیوتی لند خوش آمدید. کد تایید ارسال شد.',
      bypassCode: IS_BYPASS ? code : undefined,
      isExistingUser,
      needsOnboarding,
    });

    response.cookies.set(`otp_${mobile}`, code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 120,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('[send-otp fatal]', error);
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}