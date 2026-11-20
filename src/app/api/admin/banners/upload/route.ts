import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyAdmin } from '@/lib/auth';
import { rejectCsrf, sanitizeFilename, validateImageUploadContent, validateOrigin } from '@/lib/security';

export async function POST(req: Request) {
  const origin = validateOrigin(req);
  if (!origin.valid) return rejectCsrf(req);

  try {
    await verifyAdmin();
    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, message: 'فایل تصویر ارسال نشده است.' }, { status: 400 });
    }

    const validation = await validateImageUploadContent(file);
    if (!validation.valid) {
      return NextResponse.json({ success: false, message: validation.message || 'تصویر نامعتبر است.' }, { status: 400 });
    }

    const safeName = sanitizeFilename(file.name);
    const blob = await put(`home-banners/${Date.now()}-${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    if (error instanceof Error && ['UNAUTHORIZED', 'FORBIDDEN'].includes(error.message)) {
      return NextResponse.json({ success: false, message: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    console.error('[ADMIN_BANNERS_UPLOAD]', error);
    return NextResponse.json({ success: false, message: 'آپلود تصویر انجام نشد. اتصال Vercel Blob را بررسی کن.' }, { status: 500 });
  }
}