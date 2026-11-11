import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const CUSTOMER_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || process.env.JWT_SECRET || 'customer-fallback-secret-change-me'
);

const COOKIE_NAME = 'customer_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export interface CustomerPayload {
  id: string;
  email: string;
  name: string;
}

export async function createCustomerToken(payload: CustomerPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(CUSTOMER_SECRET);
}

export async function setCustomerCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearCustomerCookie() {
  (await cookies()).set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function getCurrentCustomer(): Promise<CustomerPayload | null> {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, CUSTOMER_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function requireCustomer(): Promise<CustomerPayload> {
  const customer = await getCurrentCustomer();
  if (!customer) throw new Error('UNAUTHORIZED');
  return customer;
}