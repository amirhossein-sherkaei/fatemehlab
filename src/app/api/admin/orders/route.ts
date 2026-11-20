import { NextResponse } from 'next/server';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { verifyAdmin } from '@/lib/auth';

const PAGE_SIZE = 40;
const ALLOWED_STATUSES = new Set(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']);

function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

export async function GET(req: Request) {
  try {
    await verifyAdmin();
    const url = new URL(req.url);
    const pageRaw = Number.parseInt(url.searchParams.get('page') || '1', 10);
    const page = Number.isFinite(pageRaw) ? Math.max(1, Math.min(100_000, pageRaw)) : 1;
    const search = (url.searchParams.get('search') || '').trim().slice(0, 80);
    const requestedStatus = url.searchParams.get('status') || 'all';
    const status = ALLOWED_STATUSES.has(requestedStatus) ? requestedStatus : 'all';

    const filters = [];
    if (status !== 'all') filters.push(eq(orders.status, status));
    if (search) {
      const pattern = `%${escapeLike(search)}%`;
      filters.push(or(
        ilike(orders.trackingCode, pattern),
        ilike(orders.phone, pattern),
        ilike(orders.firstName, pattern),
        ilike(orders.lastName, pattern),
        sql`(${orders.firstName} || ' ' || ${orders.lastName}) ILIKE ${pattern}`,
      ));
    }
    const whereClause = filters.length ? and(...filters) : undefined;

    const [countResult] = await db.select({ total: sql<number>`count(*)`.mapWith(Number) })
      .from(orders).where(whereClause);
    const total = countResult?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const effectivePage = Math.min(page, totalPages);
    const pageOrders = await db.select({
      id: orders.id,
      trackingCode: orders.trackingCode,
      firstName: orders.firstName,
      lastName: orders.lastName,
      phone: orders.phone,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
    }).from(orders)
      .where(whereClause)
      .orderBy(desc(orders.createdAt), desc(orders.id))
      .limit(PAGE_SIZE)
      .offset((effectivePage - 1) * PAGE_SIZE);

    return NextResponse.json({
      success: true,
      orders: pageOrders,
      pagination: { page: effectivePage, pageSize: PAGE_SIZE, total, totalPages },
    }, { headers: { 'Cache-Control': 'private, no-store, max-age=0' } });
  } catch (error) {
    if (error instanceof Error && error.message !== 'UNAUTHORIZED') {
      console.error('[admin/orders:list]', error);
    }
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: error instanceof Error && error.message === 'UNAUTHORIZED' ? 401 : 500 });
  }
}
