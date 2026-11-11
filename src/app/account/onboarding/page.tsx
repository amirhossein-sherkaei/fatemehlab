import { getCurrentCustomer } from '@/lib/customer-auth';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import OnboardingClient from './onboarding-client';

export const instant = false;

export default async function OnboardingPage() {
  const current = await getCurrentCustomer();
  if (!current) redirect('/account/login');

  const [customer] = await db.select().from(customers).where(eq(customers.id, current.id)).limit(1);
  if (!customer) redirect('/account/login');

  // If DB says user is complete, but they are on onboarding,
  // it means JWT is outdated. Force logout to clear the old token.
  if (!customer.email.endsWith('@temp.fatemehlab.ir')) {
    redirect('/api/auth/force-logout');
  }

  return <OnboardingClient customer={{ name: customer.name, phone: customer.phone }} />;
}