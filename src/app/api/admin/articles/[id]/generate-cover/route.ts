import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateArticleCover } from '@/lib/ai-image';
import { verifyAdmin } from '@/lib/auth';
import { validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid: originValid } = validateOrigin(request);
  if (!originValid) return rejectCsrf(request);

  try {
    await verifyAdmin();
  } catch {
    return NextResponse.json({ success: false, message: 'دسترسی غیرمجاز' }, { status: 401 });
  }

  const ip = getClientIp(request);
  const limit = await rateLimit(`article-cover:${ip}`);
  if (!limit.success) return NextResponse.json({ success: false, message: 'تعداد درخواست‌های تولید تصویر زیاد است.' }, { status: 429 });

  try {
    const { id } = await params;
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id)) {
      return NextResponse.json({ success: false, message: 'شناسه مقاله معتبر نیست.' }, { status: 400 });
    }
    const [article] = await db.select({ id: articles.id, title: articles.title, category: articles.category })
      .from(articles).where(eq(articles.id, id)).limit(1);
    if (!article) return NextResponse.json({ success: false, message: 'مقاله یافت نشد' }, { status: 404 });

    const coverImage = await generateArticleCover(article.title, article.category);
    await db.update(articles).set({ coverImage, updatedAt: new Date() }).where(eq(articles.id, id));
    return NextResponse.json({ success: true, coverImage, message: 'تصویر با موفقیت تولید شد' });
  } catch (error) {
    console.error('[admin/article-cover]', error);
    return NextResponse.json({ success: false, message: 'خطا در تولید تصویر' }, { status: 500 });
  }
}
