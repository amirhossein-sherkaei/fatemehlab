import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { reviews, orders, orderItems } from '@/db/schema';
import { and, eq, desc, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { validateOrigin, rejectCsrf, isAllowedVercelBlobUrl, getClientIp } from '@/lib/security';

const reviewSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().trim().min(2).max(100),
  email: z.union([z.string().email().max(254), z.literal('')]).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(10).max(3000),
  images: z.array(z.string().url().max(2048)).max(5).optional().default([]),
});

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    const ip = getClientIp(req);
    const limit = await rateLimit('review-submit:' + ip);
    if (!limit.success) return NextResponse.json({ success: false, message: 'شما اخیراً نظر ثبت کرده‌اید. لطفاً کمی صبر کنید.' }, { status: 429 });

    const parsed = reviewSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: parsed.error.issues[0]?.message || 'اطلاعات نظر معتبر نیست.' }, { status: 400 });
    const validated = parsed.data;
    if (validated.images.some((url) => !isAllowedVercelBlobUrl(url))) {
      return NextResponse.json({ success: false, message: 'آدرس یکی از تصاویر معتبر نیست.' }, { status: 400 });
    }

    let verifiedPurchase = false;
    const currentCustomer = await getCurrentCustomer();
    if (currentCustomer) {
      const [purchased] = await db.select({ id: orderItems.id }).from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(and(eq(orderItems.productId, validated.productId), eq(orders.status, 'delivered'), eq(orders.customerId, currentCustomer.id)))
        .limit(1);
      verifiedPurchase = Boolean(purchased);
    }

    await db.insert(reviews).values({
      productId: validated.productId,
      name: currentCustomer?.name || validated.name,
      email: currentCustomer?.email || validated.email || null,
      rating: validated.rating,
      comment: validated.comment,
      images: validated.images,
      verifiedPurchase,
      status: 'pending',
    });
    return NextResponse.json({ success: true, message: 'نظر شما ثبت شد و پس از تأیید نمایش داده می‌شود.' });
  } catch (error) {
    console.error('[reviews/create]', error);
    return NextResponse.json({ success: false, message: 'خطا در ثبت نظر' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const sort = searchParams.get('sort') || 'newest';
    const ratingFilter = searchParams.get('rating');
    if (!productId || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(productId)) {
      return NextResponse.json({ success: false, message: 'شناسه محصول معتبر نیست' }, { status: 400 });
    }

    const conditions = [eq(reviews.productId, productId), eq(reviews.status, 'approved')];
    if (ratingFilter && ratingFilter !== 'all') {
      const rating = Number(ratingFilter);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ success: false, message: 'فیلتر امتیاز معتبر نیست.' }, { status: 400 });
      conditions.push(eq(reviews.rating, rating));
    }

    let orderBy = desc(reviews.createdAt);
    if (sort === 'helpful') orderBy = desc(reviews.helpfulCount);
    if (sort === 'highest') orderBy = desc(reviews.rating);
    if (sort === 'lowest') orderBy = sql`${reviews.rating} asc`;

    const approvedReviews = await db.select({
      id: reviews.id,
      name: reviews.name,
      rating: reviews.rating,
      comment: reviews.comment,
      images: reviews.images,
      verifiedPurchase: reviews.verifiedPurchase,
      helpfulCount: reviews.helpfulCount,
      notHelpfulCount: reviews.notHelpfulCount,
      adminReply: reviews.adminReply,
      adminReplyAt: reviews.adminReplyAt,
      createdAt: reviews.createdAt,
    }).from(reviews).where(and(...conditions)).orderBy(orderBy).limit(100);
    const allApproved = await db.select({ rating: reviews.rating }).from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.status, 'approved')));
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    allApproved.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) { distribution[review.rating as keyof typeof distribution]++; sum += review.rating; }
    });
    return NextResponse.json({ success: true, reviews: approvedReviews, stats: {
      total: allApproved.length,
      average: allApproved.length > 0 ? (sum / allApproved.length).toFixed(1) : null,
      distribution,
    } });
  } catch (error) {
    console.error('[reviews/list]', error);
    return NextResponse.json({ success: false, message: 'خطا در دریافت نظرات' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    const ip = getClientIp(req);
    const limit = await rateLimit('review-vote:' + ip);
    if (!limit.success) return NextResponse.json({ success: false, message: 'تعداد درخواست‌ها زیاد است' }, { status: 429 });
    const schema = z.object({ id: z.string().uuid(), action: z.enum(['helpful', 'not-helpful']) });
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: 'درخواست رأی معتبر نیست.' }, { status: 400 });
    const { id, action } = parsed.data;
    const [updated] = await db.update(reviews)
      .set(action === 'helpful'
        ? { helpfulCount: sql`${reviews.helpfulCount} + 1` }
        : { notHelpfulCount: sql`${reviews.notHelpfulCount} + 1` })
      .where(and(eq(reviews.id, id), eq(reviews.status, 'approved')))
      .returning({ id: reviews.id });
    if (!updated) return NextResponse.json({ success: false, message: 'نظر موردنظر یافت نشد.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[reviews/vote]', error);
    return NextResponse.json({ success: false, message: 'خطا در ثبت رأی' }, { status: 500 });
  }
}
