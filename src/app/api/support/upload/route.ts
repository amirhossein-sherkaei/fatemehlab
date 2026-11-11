import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { verifyAdmin } from '@/lib/auth';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: Request) {
  try {
    // Check if user is admin OR customer
    let isAuthorized = false;
    try {
      await verifyAdmin();
      isAuthorized = true;
    } catch {
      const customer = await getCurrentCustomer();
      if (customer) isAuthorized = true;
    }

    if (!isAuthorized) {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ message: 'فایلی ارسال نشد' }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ message: 'حجم فایل بیش از ۵ مگابایت است' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ message: 'فقط تصویر (JPG, PNG, WebP) مجاز است' }, { status: 400 });

    const blob = await put(`support-${Date.now()}-${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Support Upload Error:', error);
    return NextResponse.json({ message: 'خطا در آپلود' }, { status: 500 });
  }
}