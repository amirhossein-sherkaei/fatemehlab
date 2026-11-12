import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { and, eq, gte, lte, inArray, ilike, or, desc, asc, SQL } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 12;
    const offset = (page - 1) * limit;

    const q = searchParams.get('q')?.trim() || '';
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const skinTypes = searchParams.get('skinTypes')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock') === 'true';
    const sort = searchParams.get('sort') || 'newest';

    const conditions: SQL[] = [eq(products.status, 'published')];

    if (q) {
      conditions.push(or(ilike(products.name, `%${q}%`), ilike(products.description, `%${q}%`))!);
    }
    if (brands.length > 0) {
      conditions.push(inArray(products.brand, brands));
    }
    if (skinTypes.length > 0) {
      conditions.push(inArray(products.skinType, skinTypes));
    }
    if (minPrice) {
      conditions.push(gte(products.price, parseInt(minPrice, 10)));
    }
    if (maxPrice) {
      conditions.push(lte(products.price, parseInt(maxPrice, 10)));
    }
    if (inStock) {
      conditions.push(gte(products.stock, 1));
    }

    let orderBy: any = desc(products.createdAt);
    if (sort === 'cheapest') orderBy = asc(products.price);
    if (sort === 'expensive') orderBy = desc(products.price);

    const results = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ success: true, products: results });
  } catch (error) {
    console.error('API products error:', error);
    return NextResponse.json({ success: false, message: 'خطا در دریافت محصولات' }, { status: 500 });
  }
}