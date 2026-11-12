import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages, customers } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

const replySchema = z.object({
  message: z.string().min(1).max(2000),
  attachmentUrl: z.string().optional().nullable(),
  status: z.enum(['open', 'answered', 'closed']).optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const result = await db.select({
      ticket: supportTickets,
      customerName: customers.name,
      customerEmail: customers.email,
    }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).where(eq(supportTickets.id, id)).limit(1);
    if (result.length === 0) return NextResponse.json({ message: 'not found' }, { status: 404 });
    
    const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));
    return NextResponse.json({ success: true, ticket: result[0].ticket, customer: { name: result[0].customerName, email: result[0].customerEmail }, messages });
  } catch { return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const body = await req.json();
    const validated = replySchema.parse(body);
    
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).limit(1);
    if (!ticket) return NextResponse.json({ message: 'not found' }, { status: 404 });
    
    await db.insert(supportMessages).values({
      ticketId: id,
      senderType: 'admin',
      senderName: 'تیم پشتیبانی',
      message: validated.message,
      attachmentUrl: validated.attachmentUrl || null,
    });
    
    await db.update(supportTickets).set({
      status: validated.status || 'answered',
      unreadByCustomer: (ticket.unreadByCustomer || 0) + 1,
      unreadByAdmin: 0,
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(supportTickets.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const { status } = await req.json();
    if (!['open', 'answered', 'closed'].includes(status)) return NextResponse.json({ message: 'invalid' }, { status: 400 });
    await db.update(supportTickets).set({ status, updatedAt: new Date() }).where(eq(supportTickets.id, id));
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}