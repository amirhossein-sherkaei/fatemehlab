import { NextResponse } from 'next/server';
import { and, eq, gt, gte, ilike, inArray, lte, or, SQL } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, products } from '@/db/schema';
import { getProductSortOrder, PRODUCT_PAGE_SIZE, productCatalogSelection } from '@/lib/product-catalog';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const requestedPage = Number.parseInt(searchParams.get('page') || '1', 10);
    const page = Number.isFinite(requestedPage) ? Math.max(1, Math.min(requestedPage, 10000)) : 1;
    const offset = (page - 1) * PRODUCT_PAGE_SIZE;
    const q = (searchParams.get('q') || '').trim().slice(0, 120);
    const categorySlug = searchParams.get('category') || '';
    const brands = (searchParams.get('brands') || '').split(',').map((value) => value.trim()).filter(Boolean);
    const skinTypes = (searchParams.get('skinTypes') || '').split(',').map((value) => value.trim()).filter(Boolean);
    const minPriceRaw = searchParams.get('minPrice');
    const maxPriceRaw = searchParams.get('maxPrice');
    const minPrice = minPriceRaw !== null && Number.isFinite(Number(minPriceRaw)) ? Math.max(0, Math.floor(Number(minPriceRaw))) : null;
    const maxPrice = maxPriceRaw !== null && Number.isFinite(Number(maxPriceRaw)) ? Math.max(0, Math.floor(Number(maxPriceRaw))) : null;
    const inStock = searchParams.get('inStock') === 'true';
    const sort = searchParams.get('sort') || 'newest';

    const conditions: SQL[] = [eq(products.status, 'published')];
    if (q) {
      conditions.push(or(
        ilike(products.name, `%${q}%`),
        ilike(products.description, `%${q}%`),
        ilike(products.brand, `%${q}%`),
      )!);
    }
    if (categorySlug) {
      const [selectedCategory] = await db.select({ id: categories.id }).from(categories)
        .where(eq(categories.slug, categorySlug)).limit(1);
      if (!selectedCategory) {
        return NextResponse.json({ success: true, products: [], hasMore: false, page });
      }
      conditions.push(eq(products.categoryId, selectedCategory.id));
    }
    if (brands.length > 0) conditions.push(inArray(products.brand, brands));
    if (skinTypes.length > 0) conditions.push(inArray(products.skinType, skinTypes));
    if (minPrice !== null) conditions.push(gte(products.price, minPrice));
    if (maxPrice !== null) conditions.push(lte(products.price, maxPrice));
    if (inStock) conditions.push(gte(products.stock, 1), gt(products.price, 0));

    const rows = await db.select(productCatalogSelection)
      .from(products)
      .where(and(...conditions))
      .orderBy(...getProductSortOrder(sort))
      .limit(PRODUCT_PAGE_SIZE + 1)
      .offset(offset);

    const hasMore = rows.length > PRODUCT_PAGE_SIZE;
    const pageProducts = hasMore ? rows.slice(0, PRODUCT_PAGE_SIZE) : rows;
    return NextResponse.json({ success: true, products: pageProducts, hasMore, page });
  } catch (error) {
    console.error('API products error:', error);
    return NextResponse.json({ success: false, message: 'خطا در دریافت محصولات' }, { status: 500 });
  }
}
