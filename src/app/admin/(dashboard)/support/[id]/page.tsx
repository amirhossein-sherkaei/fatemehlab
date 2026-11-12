import { Suspense } from 'react';
import { db } from '@/lib/db';
import { supportTickets, supportMessages, customers } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminChatClient from './admin-chat-client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#c61d70]">در حال بارگذاری چت...</div>;
}

async function ChatContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await db.select({
    ticket: supportTickets,
    customerName: customers.name,
    customerEmail: customers.email,
  }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).where(eq(supportTickets.id, id)).limit(1);

  if (result.length === 0) notFound();

  const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));

  return (
    <AdminChatClient
      ticket={result[0].ticket}
      customer={{ name: result[0].customerName || 'کاربر', email: result[0].customerEmail || '' }}
      initialMessages={messages}
    />
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <ChatContent params={params} />
    </Suspense>
  );
}