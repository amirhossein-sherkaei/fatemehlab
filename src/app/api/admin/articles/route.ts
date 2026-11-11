import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

const articleSchema = z.object({
  title: z.string().min(3, 'عنوان حداقل ۳ حرف باشد'),
  slug: z.string().min(2, 'شناسه حداقل ۲ حرف باشد').regex(/^[a-z0-9-]+$/, 'شناسه نامعتبر است'),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10, 'محتوا حداقل ۱۰ حرف باشد'),
  category: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']),
  readTime: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  featured: z.boolean().optional().default(false),
  editorsPick: z.boolean().optional().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    await verifyAdmin();
    const body = await req.json();
    const validated = articleSchema.parse(body);

    const newArticle = await db.insert(articles).values(validated).returning();

    revalidatePath('/journal');
    revalidatePath('/admin/articles');

    return NextResponse.json({ success: true, article: newArticle[0] });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    if (error?.cause?.code === '23505') return NextResponse.json({ message: 'این شناسه قبلاً استفاده شده است.' }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ثبت مقاله' }, { status: 500 });
  }
}