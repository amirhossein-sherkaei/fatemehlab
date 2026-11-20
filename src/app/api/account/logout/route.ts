import { NextResponse } from 'next/server';
import { clearCustomerCookie } from '@/lib/customer-auth';
import { validateOrigin, rejectCsrf } from '@/lib/security';

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  await clearCustomerCookie();
  return NextResponse.json({ success: true });
}