import { db } from '@/lib/db';
import { supportTickets, customers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import AdminSupportClient from './admin-support-client';

export const instant = false;

export default async function AdminSupportPage() {
  const tickets = await db.select({
    ticket: supportTickets,
    customerName: customers.name,
    customerEmail: customers.email,
  }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).orderBy(desc(supportTickets.lastMessageAt));
  return <AdminSupportClient tickets={tickets} />;
}