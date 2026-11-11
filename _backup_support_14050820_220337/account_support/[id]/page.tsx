import { db } from '@/lib/db';
import { supportTickets, supportMessages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { notFound } from 'next/navigation';
import ChatClient from './chat-client';

export const instant = false;

export default async function TicketChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const current = await getCurrentCustomer();
  const [ticket] = await db.select().from(supportTickets).where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current!.id))).limit(1);
  if (!ticket) notFound();
  const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));
  if (ticket.unreadByCustomer > 0) {
    await db.update(supportMessages).set({ isRead: true }).where(and(eq(supportMessages.ticketId, id), eq(supportMessages.senderType, 'admin')));
    await db.update(supportTickets).set({ unreadByCustomer: 0 }).where(eq(supportTickets.id, id));
  }
  return <ChatClient ticket={ticket} initialMessages={messages} currentUserName={current!.name} />;
}