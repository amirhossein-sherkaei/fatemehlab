import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { supportTickets, customers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

export async function GET() {
  try {
    await verifyAdmin();
    const tickets = await db.select({
      ticket: supportTickets,
      customerName: customers.name,
      customerEmail: customers.email,
    }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).orderBy(desc(supportTickets.lastMessageAt));
    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error('Admin support GET error:', error);
    return NextResponse.json({ message: 'Unauthorized', tickets: [] }, { status: 401 });
  }
}

export async function POST(req: Request) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const parsed = z.object({ ticketId: z.string().uuid() }).safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: 'شناسه تیکت معتبر نیست.' }, { status: 400 });
    await db.update(supportTickets).set({ unreadByAdmin: 0 }).where(eq(supportTickets.id, parsed.data.ticketId));
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}