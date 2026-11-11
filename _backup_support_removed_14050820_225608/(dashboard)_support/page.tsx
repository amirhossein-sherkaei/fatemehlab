import { Suspense } from 'react';
import { db } from '@/lib/db';
import { supportTickets, customers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import AdminSupportClient from './admin-support-client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b] text-sm">در حال بارگذاری تیکت‌ها...</div>;
}

async function Content() {
  const tickets = await db
    .select({
      ticket: supportTickets,
      customerName: customers.name,
      customerEmail: customers.email,
    })
    .from(supportTickets)
    .leftJoin(customers, eq(supportTickets.customerId, customers.id))
    .orderBy(desc(supportTickets.lastMessageAt));
  return <AdminSupportClient tickets={tickets} />;
}

export default function Page() {
  return <Suspense fallback={<Skeleton />}><Content /></Suspense>;
}