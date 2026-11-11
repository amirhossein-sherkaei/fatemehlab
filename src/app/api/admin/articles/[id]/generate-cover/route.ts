import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateArticleCover } from '@/lib/ai-image';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: 'مقاله یافت نشد' },
        { status: 404 }
      );
    }

    console.log(`🎨 تولید کاور برای: ${article.title}`);
    
    const coverImage = await generateArticleCover(article.title, article.category);
    
    await db
      .update(articles)
      .set({ coverImage, updatedAt: new Date() })
      .where(eq(articles.id, id));

    return NextResponse.json({
      success: true,
      coverImage,
      message: 'تصویر با موفقیت تولید شد',
    });
  } catch (error: any) {
    console.error('❌ Error generating cover:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'خطا در تولید تصویر' },
      { status: 500 }
    );
  }
}