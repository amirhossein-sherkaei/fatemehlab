import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    await db.delete(articles).where(eq(articles.id, id));
    revalidatePath('/journal');
    revalidatePath('/admin/articles');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    return NextResponse.json({ message: 'خطا در حذف مقاله' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const body = await req.json();
    const { title, slug, excerpt, content, category, coverImage, status, readTime, author, featured, editorsPick, seoTitle, seoDescription } = body;

    await db.update(articles)
      .set({ 
        title, slug, excerpt, content, category, coverImage, status, readTime, author,
        featured: featured ?? false,
        editorsPick: editorsPick ?? false,
        seoTitle, seoDescription,
        updatedAt: new Date() 
      })
      .where(eq(articles.id, id));

    revalidatePath('/journal');
    revalidatePath('/admin/articles');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    if (error?.cause?.code === '23505') return NextResponse.json({ message: 'این شناسه قبلاً استفاده شده است.' }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ویرایش مقاله' }, { status: 500 });
  }
}