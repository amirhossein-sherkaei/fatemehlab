import { Suspense } from 'react';
import { db } from '@/lib/db';
import { supportTickets, supportMessages, customers } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminChatClient from './admin-chat-client';

export const instant = false;

function TicketSkeleton() {
  return (
    <div className="p-8 text-center text-[#77717b]">
      در حال بارگذاری تیکت...
    </div>
  );
}

async function TicketContent({ id }: { id: string }) {
  const result = await db
    .select({
      ticket: supportTickets,
      customerName: customers.name,
      customerEmail: customers.email,
    })
    .from(supportTickets)
    .leftJoin(customers, eq(supportTickets.customerId, customers.id))
    .where(eq(supportTickets.id, id))
    .limit(1);

  if (result.length === 0) notFound();

  const messages = await db
    .select()
    .from(supportMessages)
    .where(eq(supportMessages.ticketId, id))
    .orderBy(asc(supportMessages.createdAt));

  const customer = {
    name: result[0].customerName || 'کاربر',
    email: result[0].customerEmail || '',
  };

  return (
    <AdminChatClient
      ticket={result[0].ticket}
      customer={customer}
      initialMessages={messages}
    />
  );
}

export default async function AdminTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<TicketSkeleton />}>
      <TicketContent id={id} />
    </Suspense>
  );
}