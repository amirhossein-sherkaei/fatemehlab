import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf, isAllowedVercelBlobUrl } from '@/lib/security';
import { db } from '@/lib/db';
import { supportTickets, supportMessages, customers } from '@/db/schema';
import { eq, asc, sql } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

const replySchema = z.object({
  message: z.string().min(1).max(2000),
  attachmentUrl: z.string().url().max(2048).optional().nullable(),
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
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const { id } = await params;
    const body = await req.json();
    const validated = replySchema.parse(body);
    if (validated.attachmentUrl && !isAllowedVercelBlobUrl(validated.attachmentUrl)) return NextResponse.json({ message: 'فایل پیوست معتبر نیست.' }, { status: 400 });
    
    const posted = await db.transaction(async (tx) => {
      const [ticket] = await tx.select({ id: supportTickets.id }).from(supportTickets)
        .where(eq(supportTickets.id, id)).limit(1);
      if (!ticket) return false;
      await tx.insert(supportMessages).values({
        ticketId: id,
        senderType: 'admin',
        senderName: 'تیم پشتیبانی',
        message: validated.message,
        attachmentUrl: validated.attachmentUrl || null,
      });
      await tx.update(supportTickets).set({
        status: validated.status || 'answered',
        unreadByCustomer: sql`${supportTickets.unreadByCustomer} + 1`,
        unreadByAdmin: 0,
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(supportTickets.id, id));
      return true;
    });
    if (!posted) return NextResponse.json({ message: 'not found' }, { status: 404 });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const { id } = await params;
    const parsed = z.object({ status: z.enum(['open', 'answered', 'closed']) }).safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: 'وضعیت تیکت معتبر نیست.' }, { status: 400 });
    const { status } = parsed.data;
    await db.update(supportTickets).set({ status, updatedAt: new Date() }).where(eq(supportTickets.id, id));
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}