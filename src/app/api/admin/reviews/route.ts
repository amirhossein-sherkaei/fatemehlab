import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews, products } from '@/db/schema';
import { eq, desc, ilike, or, and } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await verifyAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const conditions: any[] = [];
    if (status && status !== 'all') conditions.push(eq(reviews.status, status));
    if (search) conditions.push(or(ilike(reviews.name, `%${search}%`), ilike(reviews.comment, `%${search}%`)));

    const allReviews = await db
      .select({
        review: reviews,
        productName: products.name,
        productSlug: products.slug,
        productImage: products.mainImage,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ success: true, reviews: allReviews });
  } catch {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await verifyAdmin();
    const { id, action, adminReply } = await req.json();
    
    if (action === 'approve') {
      await db.update(reviews).set({ status: 'approved' }).where(eq(reviews.id, id));
    } else if (action === 'reject') {
      await db.update(reviews).set({ status: 'rejected' }).where(eq(reviews.id, id));
    } else if (action === 'delete') {
      await db.delete(reviews).where(eq(reviews.id, id));
    } else if (action === 'reply') {
      await db.update(reviews).set({ adminReply, adminReplyAt: new Date(), status: 'approved' }).where(eq(reviews.id, id));
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}