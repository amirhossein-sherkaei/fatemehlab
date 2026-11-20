import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { reviews, products } from '@/db/schema';
import { eq, desc, ilike, or, and } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

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
        id: reviews.id,
        productId: reviews.productId,
        name: reviews.name,
        email: reviews.email,
        rating: reviews.rating,
        comment: reviews.comment,
        images: reviews.images,
        verifiedPurchase: reviews.verifiedPurchase,
        helpfulCount: reviews.helpfulCount,
        notHelpfulCount: reviews.notHelpfulCount,
        adminReply: reviews.adminReply,
        adminReplyAt: reviews.adminReplyAt,
        status: reviews.status,
        createdAt: reviews.createdAt,
        productName: products.name,
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
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const parsed = z.object({ id: z.string().uuid(), action: z.enum(['approve', 'reject', 'delete', 'reply']), adminReply: z.string().trim().max(2000).optional() }).safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: 'درخواست مدیریت نظر معتبر نیست.' }, { status: 400 });
    const { id, action, adminReply } = parsed.data;
    
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