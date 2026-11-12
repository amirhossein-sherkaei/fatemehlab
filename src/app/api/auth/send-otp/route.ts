import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { sendOtpCode } from '@/lib/sms';
import { Redis } from '@upstash/redis';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';

const memoryStore = new Map<string, { code: string; expiresAt: number }>();

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
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    try {
      const rl = await rateLimit('otp-send:' + ip);
      if (!rl.success) {
        return NextResponse.json(
          { success: false, message: 'تعداد درخواست‌ها زیاد است. لطفاً یک دقیقه صبر کنید.' },
          { status: 429 }
        );
      }
    } catch (e) {
      console.warn('[rate-limit crashed, ignoring]', e);
    }

    const body = await req.json().catch(() => ({}));
    const mobile = body?.mobile;

    if (!mobile || !/^09\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { success: false, message: 'شماره موبایل معتبر نیست.' },
        { status: 400 }
      );
    }

    // Check if this is an existing user (for better UX message)
    const existingUsers = await db
      .select({ id: customers.id, email: customers.email })
      .from(customers)
      .where(eq(customers.phone, mobile))
      .limit(1);

    const isExistingUser = existingUsers.length > 0;
    const needsOnboarding = isExistingUser && existingUsers[0].email.endsWith('@temp.fatemehlab.ir');

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    const redis = getRedis();
    try {
      if (redis) {
        await redis.set(`otp:${mobile}`, code, { ex: 120 });
      } else {
        memoryStore.set(mobile, { code, expiresAt: Date.now() + 120_000 });
      }
    } catch (e) {
      console.error('[OTP store failed, using memory]', e);
      memoryStore.set(mobile, { code, expiresAt: Date.now() + 120_000 });
    }

    // ===== BYPASS MODE =====
    if (IS_BYPASS) {
      console.log(`[SMS BYPASS] Mobile: ${mobile} | Code: ${code}`);
      return NextResponse.json({
        success: true,
        message: isExistingUser ? 'خوش برگشتی! کد تست تولید شد.' : 'کد تست تولید شد.',
        bypassCode: code,
        isExistingUser,
        needsOnboarding,
      });
    }

        // ===== NORMAL MODE (Optimized) =====
    // 🚀 با استفاده از Promise.race، اگر ارسال پیامک بیشتر از ۱.۵ ثانیه طول بکشد،
    // به کاربر پیام موفقیت می‌دهیم و ارسال در پس‌زمینه ادامه پیدا می‌کند.
    const smsPromise = sendOtpCode(mobile, code);
    
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        console.log('[OTP] SMS API took too long. Returning success to user in background.');
        resolve({ success: true, timeout: true });
      }, 1500); // ۱.۵ ثانیه مکث
    });

    const result = await Promise.race([smsPromise, timeoutPromise]) as any;

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: isExistingUser
          ? 'خوش برگشتی! کد تایید ارسال شد.'
          : 'کد تایید ارسال شد. به فاطمه بیوتی لند خوش آمدید.',
        isExistingUser,
        needsOnboarding,
      });
    }

    return NextResponse.json(
      { success: false, message: 'خطا در ارسال پیامک. لطفاً دقایقی دیگر تلاش کنید.' },
      { status: 500 }
    );
  } catch (error: any) {
    console.error('[send-otp fatal]', error);
    return NextResponse.json(
      { success: false, message: 'خطای سرور. لطفاً بعداً تلاش کنید.' },
      { status: 500 }
    );
  }
}