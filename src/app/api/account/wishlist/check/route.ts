import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wishlist } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';

export async function GET(req: Request) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, isWishlisted: false });

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    if (!productId) return NextResponse.json({ success: false, isWishlisted: false });

    const existing = await db
      .select({ id: wishlist.id })
      .from(wishlist)
      .where(and(eq(wishlist.customerId, customer.id), eq(wishlist.productId, productId)))
      .limit(1);

    return NextResponse.json({ success: true, isWishlisted: existing.length > 0 });
  } catch {
    return NextResponse.json({ success: false, isWishlisted: false });
  }
}