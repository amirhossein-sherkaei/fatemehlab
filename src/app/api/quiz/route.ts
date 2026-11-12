import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { and, eq, or, ilike, desc, SQL } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skinType = searchParams.get('skinType');
    const concern = searchParams.get('concern');
    const routine = searchParams.get('routine');

    const conditions: SQL[] = [eq(products.status, 'published')];

    // جستجوی هوشمند در فیلدها
    if (skinType) {
      conditions.push(or(eq(products.skinType, skinType), ilike(products.description, `%${skinType}%`))!);
    }
    if (concern) {
      conditions.push(or(
        ilike(products.name, `%${concern}%`),
        ilike(products.description, `%${concern}%`),
        ilike(products.ingredients, `%${concern}%`)
      )!);
    }
    if (routine === 'آرایشی') {
      conditions.push(ilike(products.name, '%آرایش%'));
    }

    // دریافت محصولات (حداکثر ۴ عدد برای نمایش در نتایج)
    let matchedProducts = await db.select().from(products).where(and(...conditions)).limit(4);

    // اگر نتیجه‌ای پیدا نشد، محصولات پرفروش یا شاخص را نشان بده
    if (matchedProducts.length === 0) {
      matchedProducts = await db.select().from(products).where(eq(products.status, 'published')).orderBy(desc(products.isFeatured)).limit(4);
    }

    return NextResponse.json({ success: true, products: matchedProducts });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در جستجو' }, { status: 500 });
  }
}