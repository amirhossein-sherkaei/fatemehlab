import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validateImageUpload, sanitizeFilename } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    const validation = validateImageUpload(file);
    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const safeName = sanitizeFilename(file.name);

    const blob = await put(`review-${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error('Review upload error:', error);
    return NextResponse.json({ message: 'خطا در آپلود' }, { status: 500 });
  }
}