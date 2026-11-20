import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validateImageUploadContent, sanitizeFilename, validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);

  try {
    const ip = getClientIp(req);
    const limit = await rateLimit('review-upload:' + ip);
    if (!limit.success) return NextResponse.json({ message: 'تعداد آپلودها بیش از حد مجاز است.' }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') return NextResponse.json({ message: 'فایلی ارسال نشد' }, { status: 400 });

    const validation = await validateImageUploadContent(file);
    if (!validation.valid) return NextResponse.json({ message: validation.message }, { status: 400 });

    const safeName = sanitizeFilename(file.name);
    const blob = await put(`review-${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('[review/upload]', error);
    return NextResponse.json({ message: 'خطا در آپلود' }, { status: 500 });
  }
}
