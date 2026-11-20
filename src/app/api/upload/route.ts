import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyAdmin } from '@/lib/auth';
import { validateImageUploadContent, sanitizeFilename, validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);

  try {
    await verifyAdmin();
    const ip = getClientIp(req);
    const limit = await rateLimit('admin-image-upload:' + ip);
    if (!limit.success) return NextResponse.json({ message: 'تعداد آپلودها بیش از حد مجاز است.' }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') return NextResponse.json({ message: 'فایلی ارسال نشد' }, { status: 400 });
    const validation = await validateImageUploadContent(file);
    if (!validation.valid) return NextResponse.json({ message: validation.message }, { status: 400 });

    const blob = await put(sanitizeFilename(file.name), file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    console.error('[admin/upload]', error);
    return NextResponse.json({ message: 'خطا در آپلود تصویر' }, { status: 500 });
  }
}
