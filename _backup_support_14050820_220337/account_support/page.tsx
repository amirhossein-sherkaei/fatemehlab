import { Suspense } from 'react';
import { db } from '@/lib/db';
import { supportTickets } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import SupportClient from './support-client';

export const instant = false;

function SupportSkeleton() {
  return (
    <div className="p-8 text-center text-[#77717b]">
      در حال بارگذاری...
    </div>
  );
}

export default async function SupportPage() {
  const current = await getCurrentCustomer();
  const tickets = await db.select().from(supportTickets).where(eq(supportTickets.customerId, current!.id)).orderBy(desc(supportTickets.lastMessageAt));

  return (
    <Suspense fallback={<SupportSkeleton />}>
      <SupportClient tickets={tickets} customerName={current!.name} />
    </Suspense>
  );
}