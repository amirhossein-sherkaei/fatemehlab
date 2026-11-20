import { NextResponse } from 'next/server';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { sendOtpCode } from '@/lib/sms';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq, and, ne } from 'drizzle-orm';
import { z } from 'zod';
import { randomInt, createHmac } from 'node:crypto';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf } from '@/lib/security';

const schema = z.object({ newPhone: z.string().regex(/^09\d{9}$/, 'شماره معتبر نیست') });
const COOKIE_NAME = 'phone_change_otp';
const COOKIE_PATH = '/api/account/phone';

function sign(payload: string) {
  const secret = process.env.CUSTOMER_JWT_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error('OTP signing secret is not configured');
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);

  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });

    const limit = await rateLimit(`phone-change-send:${current.id}`);
    if (!limit.success) return NextResponse.json({ message: 'درخواست ارسال کد بیش از حد مجاز است.' }, { status: 429 });

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    const { newPhone } = parsed.data;

    const [existing] = await db.select({ id: customers.id }).from(customers)
      .where(and(eq(customers.phone, newPhone), ne(customers.id, current.id))).limit(1);
    if (existing) return NextResponse.json({ message: 'این شماره قبلاً توسط کاربر دیگری ثبت شده است.' }, { status: 409 });

    const code = randomInt(100000, 1000000).toString();
    const sms = await sendOtpCode(newPhone, code);
    if (!sms.success) return NextResponse.json({ message: 'خطا در ارسال پیامک' }, { status: 502 });

    const payload = Buffer.from(JSON.stringify({ customerId: current.id, phone: newPhone, code, expiresAt: Date.now() + 120_000 })).toString('base64url');
    const cookieValue = `${payload}.${sign(payload)}`;
    const response = NextResponse.json({ success: true, expiresIn: 120 });
    response.cookies.set(COOKIE_NAME, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 120,
      path: COOKIE_PATH,
    });
    return response;
  } catch (error) {
    console.error('[phone/change/send]', error);
    return NextResponse.json({ message: 'خطای سرور در ارسال کد' }, { status: 500 });
  }
}
