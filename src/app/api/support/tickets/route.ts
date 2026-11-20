import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { validateOrigin, rejectCsrf, isAllowedVercelBlobUrl } from '@/lib/security';

const createSchema = z.object({
  subject: z.string().trim().min(5).max(200),
  category: z.enum(['order', 'product', 'payment', 'other']),
  message: z.string().trim().min(10).max(2000),
  attachmentUrl: z.string().url().max(2048).optional().nullable(),
});

export async function GET() {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const tickets = await db.select().from(supportTickets).where(eq(supportTickets.customerId, current.id)).orderBy(desc(supportTickets.lastMessageAt)).limit(100);
    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error('[support/tickets/list]', error);
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const limit = await rateLimit('ticket-create:' + current.id);
    if (!limit.success) return NextResponse.json({ message: 'تعداد تیکت‌های اخیر زیاد است. لطفاً کمی صبر کنید.' }, { status: 429 });

    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    const validated = parsed.data;
    if (validated.attachmentUrl && !isAllowedVercelBlobUrl(validated.attachmentUrl)) {
      return NextResponse.json({ message: 'فایل پیوست معتبر نیست.' }, { status: 400 });
    }

    const ticket = await db.transaction(async (tx) => {
      const [created] = await tx.insert(supportTickets).values({
        customerId: current.id,
        subject: validated.subject,
        category: validated.category,
        status: 'open',
        unreadByAdmin: 1,
      }).returning();
      await tx.insert(supportMessages).values({
        ticketId: created.id,
        senderType: 'customer',
        senderName: current.name,
        message: validated.message,
        attachmentUrl: validated.attachmentUrl || null,
      });
      return created;
    });
    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error('[support/tickets/create]', error);
    return NextResponse.json({ message: 'خطا در ثبت تیکت' }, { status: 500 });
  }
}
