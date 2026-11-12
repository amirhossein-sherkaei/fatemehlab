import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { and, eq, ilike, or } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const searchTerm = `%${q.trim()}%`;

    const results = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        mainImage: products.mainImage,
      })
      .from(products)
      .where(
        and(
          eq(products.status, 'published'),
          or(
            ilike(products.name, searchTerm),
            ilike(products.description, searchTerm),
            ilike(products.brand, searchTerm)
          )
        )
      )
      .limit(5); // فقط ۵ نتیجه برتر برای نمایش در منوی شیشه‌ای

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, results: [] }, { status: 500 });
  }
}