import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);
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
  const { valid: originValid } = validateOrigin(req);
  if (!originValid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const { id } = await params;
    const schema = z.object({
      title: z.string().min(3).max(200),
      slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
      excerpt: z.string().max(600).optional().nullable(),
      content: z.string().min(10),
      category: z.string().min(1).max(80),
      coverImage: z.string().max(2048).optional().nullable(),
      status: z.enum(['draft', 'published']),
      readTime: z.string().max(40).optional().nullable(),
      author: z.string().max(100).optional().nullable(),
      featured: z.boolean().optional(),
      editorsPick: z.boolean().optional(),
      seoTitle: z.string().max(200).optional().nullable(),
      seoDescription: z.string().max(320).optional().nullable(),
    });
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    const body = parsed.data;
    await db.update(articles)
      .set({ ...body, featured: body.featured ?? false, editorsPick: body.editorsPick ?? false, updatedAt: new Date() })
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