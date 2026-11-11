import { db } from '@/lib/db';
import { supportTickets } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import SupportClient from './support-client';

export const instant = false;

export default async function SupportPage() {
  const current = await getCurrentCustomer();
  const tickets = await db.select().from(supportTickets).where(eq(supportTickets.customerId, current!.id)).orderBy(desc(supportTickets.lastMessageAt));
  return <SupportClient tickets={tickets} customerName={current!.name} />;
}