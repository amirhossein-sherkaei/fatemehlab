import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secretValue = process.env.JWT_SECRET;
if (!secretValue) throw new Error('FATAL: JWT_SECRET is missing in environment variables.');
const secret = new TextEncoder().encode(secretValue);

export async function verifyAdmin() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) throw new Error('UNAUTHORIZED');
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== 'super_admin' && payload.role !== 'admin') throw new Error('FORBIDDEN');
    return payload;
  } catch {
    throw new Error('UNAUTHORIZED');
  }
}