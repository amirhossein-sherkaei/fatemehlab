import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import ClientRedirect from './ClientRedirect';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me-in-env');

export default async function AdminGuard({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('admin_token')?.value;

  // If no token, render ClientRedirect instead of calling redirect() on the server
  if (!token) {
    return <ClientRedirect to="/admin/login" />;
  }

  try {
    await jwtVerify(token, secret);
  } catch (err) {
    // If token is invalid, also redirect on the client
    return <ClientRedirect to="/admin/login" />;
  }

  return <>{children}</>;
}