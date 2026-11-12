import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';

const messageSchema = z.object({
  message: z.string().min(1).max(2000),
  attachmentUrl: z.string().optional().nullable(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const { id } = await params;
    const [ticket] = await db.select().from(supportTickets).where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id))).limit(1);
    if (!ticket) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
    
    const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));
    
    if (ticket.unreadByCustomer > 0) {
      await db.update(supportMessages).set({ isRead: true }).where(and(eq(supportMessages.ticketId, id), eq(supportMessages.senderType, 'admin')));
      await db.update(supportTickets).set({ unreadByCustomer: 0 }).where(eq(supportTickets.id, id));
    }
    return NextResponse.json({ success: true, ticket, messages });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const validated = messageSchema.parse(body);
    
    const [ticket] = await db.select().from(supportTickets).where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id))).limit(1);
    if (!ticket) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
    if (ticket.status === 'closed') return NextResponse.json({ message: 'تیکت بسته شده' }, { status: 400 });
    
    const [msg] = await db.insert(supportMessages).values({
      ticketId: id,
      senderType: 'customer',
      senderName: current.name,
      message: validated.message,
      attachmentUrl: validated.attachmentUrl || null,
    }).returning();
    
    await db.update(supportTickets).set({
      status: 'open',
      unreadByAdmin: (ticket.unreadByAdmin || 0) + 1,
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(supportTickets.id, id));
    
    return NextResponse.json({ success: true, message: msg });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}