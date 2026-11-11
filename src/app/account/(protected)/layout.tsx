import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountBottomNav from '@/components/account/AccountBottomNav';
import AccountMobileHeader from '@/components/account/AccountMobileHeader';

export const instant = false;

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const current = await getCurrentCustomer();
  if (!current) redirect('/account/login');

  const [customer] = await db.select().from(customers).where(eq(customers.id, current.id)).limit(1);
  if (!customer) redirect('/account/login');

  return (
    <div className="min-h-screen bg-[#fafafc]">
      <Suspense fallback={null}>
        <AccountSidebar customer={{ name: customer.name, email: customer.email }} />
      </Suspense>

      <main className="md:mr-64 pb-24 md:pb-8">
        <Suspense fallback={null}>
          <AccountMobileHeader />
        </Suspense>

        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <Suspense fallback={<div className="p-8 text-center text-gray-500">در حال بارگذاری...</div>}>
            {children}
          </Suspense>
        </div>
      </main>

      <Suspense fallback={null}>
        <AccountBottomNav />
      </Suspense>
    </div>
  );
}