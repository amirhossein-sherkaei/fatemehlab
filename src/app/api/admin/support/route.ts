import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages, customers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();
    const tickets = await db.select({
      ticket: supportTickets,
      customerName: customers.name,
      customerEmail: customers.email,
    }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).orderBy(desc(supportTickets.lastMessageAt));
    return NextResponse.json({ success: true, tickets });
  } catch { return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); }
}

export async function POST(req: Request) {
  try {
    await verifyAdmin();
    const { ticketId } = await req.json();
    await db.update(supportTickets).set({ unreadByAdmin: 0 }).where(eq(supportTickets.id, ticketId));
    await db.update(supportMessages).set({ isRead: true }).where(eq(supportMessages.ticketId, ticketId));
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}