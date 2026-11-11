import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyAdmin } from '@/lib/auth';
import { validateImageUpload, sanitizeFilename } from '@/lib/security';

export async function POST(req: Request) {
  try {
    await verifyAdmin();

    const formData = await req.formData();
    const file = formData.get('file') as File;

    // 1. Validate file type & size (blocks SVG, HTML, etc.)
    const validation = validateImageUpload(file);
    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    // 2. Sanitize filename to prevent path traversal & dangerous extensions
    const safeName = sanitizeFilename(file.name);

    // 3. Upload to Vercel Blob with strict content type
    const blob = await put(safeName, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'خطا در آپلود تصویر' }, { status: 500 });
  }
}