import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const createSchema = z.object({
  subject: z.string().min(5).max(200),
  category: z.enum(['order', 'product', 'payment', 'other']),
  message: z.string().min(10).max(2000),
  attachmentUrl: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const tickets = await db.select().from(supportTickets).where(eq(supportTickets.customerId, current.id)).orderBy(desc(supportTickets.lastMessageAt));
    return NextResponse.json({ success: true, tickets });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rl = await rateLimit('ticket-create:' + ip);
    if (!rl.success) {
      return NextResponse.json({ message: 'تعداد تیکت‌های اخیر زیاد است. لطفاً کمی صبر کنید.' }, { status: 429 });
    }
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const body = await req.json();
    const validated = createSchema.parse(body);
    
    const [ticket] = await db.insert(supportTickets).values({
      customerId: current.id,
      subject: validated.subject,
      category: validated.category,
      status: 'open',
      unreadByAdmin: 1,
    }).returning();
    
    await db.insert(supportMessages).values({
      ticketId: ticket.id,
      senderType: 'customer',
      senderName: current.name,
      message: validated.message,
      attachmentUrl: validated.attachmentUrl || null,
    });
    
    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}