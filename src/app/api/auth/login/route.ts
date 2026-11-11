import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { SignJWT } from 'jose';
import { rateLimit } from '@/lib/rate-limit';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me-in-env');

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

    if (user.length === 0) {
      return NextResponse.json({ message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

    const isValid = await argon2.verify(user[0].passwordHash, password);
    if (!isValid) {
      return NextResponse.json({ message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

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
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}