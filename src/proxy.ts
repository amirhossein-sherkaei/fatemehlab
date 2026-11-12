import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const adminSecretRaw = process.env.JWT_SECRET;
const customerSecretRaw = process.env.CUSTOMER_JWT_SECRET || process.env.JWT_SECRET;

if (!adminSecretRaw) console.error('[proxy] FATAL: JWT_SECRET missing');

const adminSecret = new TextEncoder().encode(adminSecretRaw || '');
const customerSecret = new TextEncoder().encode(customerSecretRaw || '');

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/36668862.txt') return NextResponse.next();

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    if (pathname !== '/admin/login') {
      if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));
      try { await jwtVerify(token, adminSecret); }
      catch { return NextResponse.redirect(new URL('/admin/login', request.url)); }
    } else if (token) {
      try {
        await jwtVerify(token, adminSecret);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch {}
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/account')) {
    const isAuthRoute = pathname === '/account/login' || pathname === '/account/register';
    const token = request.cookies.get('customer_token')?.value;
    if (isAuthRoute) {
      if (token) {
        try {
          const { payload } = await jwtVerify(token, customerSecret);
          const isTemp = (payload.email as string)?.endsWith('@temp.fatemehlab.ir');
          return NextResponse.redirect(new URL(isTemp ? '/account/onboarding' : '/account', request.url));
        } catch {}
      }
      return NextResponse.next();
    }
    if (!token) return NextResponse.redirect(new URL(`/account/login?redirect=${encodeURIComponent(pathname)}`, request.url));
    try {
      const { payload } = await jwtVerify(token, customerSecret);
      const email = (payload.email as string) || '';
      const isTemp = email.endsWith('@temp.fatemehlab.ir');
      const onb = pathname === '/account/onboarding';
      if (isTemp && !onb) return NextResponse.redirect(new URL('/account/onboarding', request.url));
      if (!isTemp && onb) return NextResponse.redirect(new URL('/account', request.url));
    } catch {
      const res = NextResponse.redirect(new URL('/account/login', request.url));
      res.cookies.delete('customer_token');
      return res;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|36668862\\.txt|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)',
  ],
};