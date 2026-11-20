import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  const response = NextResponse.json({ success: true });
  // پاک کردن کوکی HttpOnly در سمت سرور
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}