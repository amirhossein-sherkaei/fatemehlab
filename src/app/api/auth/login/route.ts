import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { SignJWT } from 'jose';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const secretValue = process.env.JWT_SECRET;
    if (!secretValue) {
      console.error('[admin-login] JWT_SECRET is missing. Configure it in the deployment environment.');
      return NextResponse.json({ message: 'تنظیمات امنیتی سرور کامل نیست.' }, { status: 500 });
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = await rateLimit('admin-login:' + ip);
    if (!rl.success) {
      return NextResponse.json({ message: 'تلاش‌های ناموفق زیاد است. لطفاً کمی بعد تلاش کنید.' }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!email || !password || email.length > 254 || password.length > 1024) {
      return NextResponse.json({ message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

    const user = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);
    if (user.length === 0) {
      return NextResponse.json({ message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

    const isValid = await argon2.verify(user[0].passwordHash, password);
    if (!isValid) {
      return NextResponse.json({ message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(secretValue);
    const token = await new SignJWT({ id: user[0].id, role: user[0].role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('[admin-login]', error);
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}
