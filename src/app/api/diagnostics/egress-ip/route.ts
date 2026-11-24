import { timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function hasValidToken(request: Request): boolean {
  const expected = process.env.ZIBAL_EGRESS_DIAGNOSTIC_TOKEN;
  const authorization = request.headers.get('authorization') ?? '';
  if (!expected || expected.length < 32 || !authorization.startsWith('Bearer ')) return false;

  const supplied = authorization.slice(7);
  const expectedBytes = Buffer.from(expected, 'utf8');
  const suppliedBytes = Buffer.from(supplied, 'utf8');
  return expectedBytes.length === suppliedBytes.length
    && timingSafeEqual(expectedBytes, suppliedBytes);
}

export async function GET(request: Request) {
  // This diagnostic must never be available on Production or local deployments.
  if (process.env.VERCEL_ENV !== 'preview') {
    return new NextResponse(null, { status: 404 });
  }

  if (!hasValidToken(request)) {
    return NextResponse.json({ error: 'not_found' }, {
      status: 404,
      headers: { 'Cache-Control': 'no-store, private' },
    });
  }

  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(7000),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'ip_lookup_failed' }, {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      });
    }

    const payload: unknown = await response.json();
    const ip = payload && typeof payload === 'object' && 'ip' in payload
      ? (payload as { ip?: unknown }).ip
      : null;

    if (typeof ip !== 'string' || isIP(ip) !== 4) {
      return NextResponse.json({ error: 'no_public_ipv4_returned' }, {
        status: 502,
        headers: { 'Cache-Control': 'no-store, private' },
      });
    }

    return NextResponse.json({
      ip,
      region: process.env.VERCEL_REGION ?? null,
      environment: 'preview',
      observedAt: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'no-store, private, max-age=0',
        Pragma: 'no-cache',
        Vary: 'Authorization',
      },
    });
  } catch {
    return NextResponse.json({ error: 'egress_lookup_unavailable' }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store, private' },
    });
  }
}