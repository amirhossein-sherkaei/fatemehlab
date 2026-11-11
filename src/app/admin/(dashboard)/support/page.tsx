import { Suspense } from 'react';
import { db } from '@/lib/db';
import { supportTickets, customers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import AdminSupportClient from './admin-support-client';

export const instant = false;

function SupportSkeleton() {
  return (
    <div className="p-8 text-center text-[#77717b]">
      در حال بارگذاری تیکت‌ها...
    </div>
  );
}

export default async function AdminSupportPage() {
  const tickets = await db.select({
    ticket: supportTickets,
    customerName: customers.name,
    customerEmail: customers.email,
  }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).orderBy(desc(supportTickets.lastMessageAt));

  return (
    <Suspense fallback={<SupportSkeleton />}>
      <AdminSupportClient tickets={tickets} />
    </Suspense>
  );
}