import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { wishlist, products } from '@/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';

// GET: لیست علاقه‌مندی‌ها با اطلاعات محصولات
export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const items = await db
      .select({
        id: wishlist.id,
        productId: wishlist.productId,
        createdAt: wishlist.createdAt,
      })
      .from(wishlist)
      .where(eq(wishlist.customerId, customer.id))
      .orderBy(desc(wishlist.createdAt));

    if (items.length === 0) return NextResponse.json({ success: true, items: [] });

    const productIds = items.map(i => i.productId);
    const productList = await db.select().from(products).where(inArray(products.id, productIds));

    const merged = items.map(item => ({
      ...item,
      product: productList.find(p => p.id === item.productId),
    })).filter(item => item.product);

    return NextResponse.json({ success: true, items: merged });
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ success: false, message: 'خطا در دریافت علاقه‌مندی‌ها' }, { status: 500 });
  }
}

// POST: افزودن یا حذف از علاقه‌مندی‌ها (toggle)
export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ success: false, message: 'شناسه محصول الزامی است' }, { status: 400 });

    // بررسی وجود
    const existing = await db
      .select({ id: wishlist.id })
      .from(wishlist)
      .where(and(eq(wishlist.customerId, customer.id), eq(wishlist.productId, productId)))
      .limit(1);

    if (existing.length > 0) {
      // حذف
      await db.delete(wishlist).where(eq(wishlist.id, existing[0].id));
      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      // افزودن
      await db.insert(wishlist).values({ customerId: customer.id, productId });
      return NextResponse.json({ success: true, action: 'added' });
    }
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ success: false, message: 'خطا در عملیات' }, { status: 500 });
  }
}

// DELETE: حذف از علاقه‌مندی‌ها
export async function DELETE(req: Request) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 });

    await db.delete(wishlist).where(and(eq(wishlist.id, id), eq(wishlist.customerId, customer.id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا' }, { status: 500 });
  }
}