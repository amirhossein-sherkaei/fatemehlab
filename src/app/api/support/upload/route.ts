import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { verifyAdmin } from '@/lib/auth';
import { validateImageUploadContent, sanitizeFilename, validateOrigin, rejectCsrf, getClientIp } from '@/lib/security';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);

  try {
    let isAuthorized = false;
    try { await verifyAdmin(); isAuthorized = true; } catch {
      const customer = await getCurrentCustomer();
      if (customer) isAuthorized = true;
    }
    if (!isAuthorized) return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });

    const ip = getClientIp(req);
    const limit = await rateLimit('support-upload:' + ip);
    if (!limit.success) return NextResponse.json({ message: 'تعداد آپلودها بیش از حد مجاز است.' }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') return NextResponse.json({ message: 'فایلی ارسال نشد' }, { status: 400 });
    const validation = await validateImageUploadContent(file);
    if (!validation.valid) return NextResponse.json({ message: validation.message }, { status: 400 });

    const blob = await put(`support-${sanitizeFilename(file.name)}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('[support/upload]', error);
    return NextResponse.json({ message: 'خطا در آپلود' }, { status: 500 });
  }
}
