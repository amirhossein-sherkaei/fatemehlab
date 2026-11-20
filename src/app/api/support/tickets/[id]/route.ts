import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf, isAllowedVercelBlobUrl } from '@/lib/security';

const messageSchema = z.object({ message: z.string().trim().min(1).max(2000), attachmentUrl: z.string().url().max(2048).optional().nullable() });

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const { id } = await params;
    const [ticket] = await db.select().from(supportTickets)
      .where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id))).limit(1);
    if (!ticket) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
    const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt)).limit(500);
    if (ticket.unreadByCustomer > 0) {
      await db.update(supportMessages).set({ isRead: true }).where(and(eq(supportMessages.ticketId, id), eq(supportMessages.senderType, 'admin')));
      await db.update(supportTickets).set({ unreadByCustomer: 0 }).where(eq(supportTickets.id, id));
    }
    return NextResponse.json({ success: true, ticket, messages });
  } catch (error) {
    console.error('[support/ticket/read]', error);
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const limit = await rateLimit('ticket-message:' + current.id);
    if (!limit.success) return NextResponse.json({ message: 'تعداد پیام‌های شما زیاد است. کمی بعد تلاش کنید.' }, { status: 429 });
    const { id } = await params;
    const parsed = messageSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    const validated = parsed.data;
    if (validated.attachmentUrl && !isAllowedVercelBlobUrl(validated.attachmentUrl)) return NextResponse.json({ message: 'فایل پیوست معتبر نیست.' }, { status: 400 });

    const [ticket] = await db.select().from(supportTickets)
      .where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id))).limit(1);
    if (!ticket) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
    if (ticket.status === 'closed') return NextResponse.json({ message: 'تیکت بسته شده' }, { status: 400 });

    const message = await db.transaction(async (tx) => {
      const [created] = await tx.insert(supportMessages).values({
        ticketId: id,
        senderType: 'customer',
        senderName: current.name,
        message: validated.message,
        attachmentUrl: validated.attachmentUrl || null,
      }).returning();
      await tx.update(supportTickets).set({
        status: 'open',
        unreadByAdmin: (ticket.unreadByAdmin || 0) + 1,
        lastMessageAt: new Date(),
        updatedAt: new Date(),
      }).where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id)));
      return created;
    });
    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('[support/ticket/message]', error);
    return NextResponse.json({ message: 'خطا در ثبت پیام' }, { status: 500 });
  }
}
