import { Suspense } from 'react';
import { db } from '@/lib/db';
import { supportTickets } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import SupportClient from './support-client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b] text-sm">در حال بارگذاری...</div>;
}

async function Content() {
  const current = await getCurrentCustomer();
  if (!current) return null;
  const tickets = await db
    .select()
    .from(supportTickets)
    .where(eq(supportTickets.customerId, current.id))
    .orderBy(desc(supportTickets.lastMessageAt));
  return <SupportClient tickets={tickets} customerName={current.name} />;
}

export default function Page() {
  return <Suspense fallback={<Skeleton />}><Content /></Suspense>;
}