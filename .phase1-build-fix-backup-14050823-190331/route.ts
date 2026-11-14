import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const current = await getCurrentCustomer();
  if (!current) return NextResponse.json({ success: false }, { status: 401 });

  const [customer] = await db
    .select({
      id: customers.id,
      name: customers.name,
      email: customers.email,
      phone: customers.phone,
      avatar: customers.avatar,
      createdAt: customers.createdAt,
      loyaltyPoints: customers.loyaltyPoints,
      tier: customers.tier,
    })
    .from(customers)
    .where(eq(customers.id, current.id))
    .limit(1);

  if (!customer) return NextResponse.json({ success: false }, { status: 404 });

  return NextResponse.json({ success: true, customer });
}