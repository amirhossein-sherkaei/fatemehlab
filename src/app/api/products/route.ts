import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 12;
    const offset = (page - 1) * limit;

    const results = await db
      .select()
      .from(products)
      .where(eq(products.status, 'published'))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ success: true, products: results });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در دریافت محصولات' }, { status: 500 });
  }
}