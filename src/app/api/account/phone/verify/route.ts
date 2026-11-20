import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq, and, ne, sql } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf } from '@/lib/security';

const schema = z.object({ newPhone: z.string().regex(/^09\d{9}$/), code: z.string().regex(/^\d{6}$/) });
const COOKIE_NAME = 'phone_change_otp';
const COOKIE_PATH = '/api/account/phone';

function expectedSignature(payload: string) {
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
    const limit = await rateLimit(`phone-change-verify:${current.id}`);
    if (!limit.success) return NextResponse.json({ message: 'تعداد تلاش‌های تأیید بیش از حد مجاز است.' }, { status: 429 });

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    const { newPhone, code } = parsed.data;

    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ message: 'کد نامعتبر یا منقضی شده است.' }, { status: 400 });
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return NextResponse.json({ message: 'کد نامعتبر یا منقضی شده است.' }, { status: 400 });

    const expected = Buffer.from(expectedSignature(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      return NextResponse.json({ message: 'کد نامعتبر یا منقضی شده است.' }, { status: 400 });
    }

    let stored: { customerId: string; phone: string; code: string; expiresAt: number };
    try { stored = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')); }
    catch { return NextResponse.json({ message: 'کد نامعتبر یا منقضی شده است.' }, { status: 400 }); }

    if (stored.customerId !== current.id || stored.phone !== newPhone || stored.code !== code || stored.expiresAt < Date.now()) {
      return NextResponse.json({ message: 'کد نامعتبر یا منقضی شده است.' }, { status: 400 });
    }

    const phoneUpdate = await db.transaction(async (tx) => {
      // Serialize competing attempts to claim the same phone number.
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${newPhone})::bigint)`);
      const [existing] = await tx.select({ id: customers.id }).from(customers)
        .where(and(eq(customers.phone, newPhone), ne(customers.id, current.id))).limit(1);
      if (existing) return 'taken';
      const [updated] = await tx.update(customers).set({ phone: newPhone })
        .where(eq(customers.id, current.id)).returning({ id: customers.id });
      return updated ? 'updated' : 'missing';
    });
    if (phoneUpdate === 'taken') return NextResponse.json({ message: 'این شماره قبلاً توسط کاربر دیگری ثبت شده است.' }, { status: 409 });
    if (phoneUpdate === 'missing') return NextResponse.json({ message: 'حساب کاربری یافت نشد.' }, { status: 404 });

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 0, path: COOKIE_PATH });
    return response;
  } catch (error) {
    console.error('[phone/change/verify]', error);
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}
