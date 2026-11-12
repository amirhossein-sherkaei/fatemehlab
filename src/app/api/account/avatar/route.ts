import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { put, del } from '@vercel/blob';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    // 🛡️ بررسی وجود توکن Blob
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is missing');
      return NextResponse.json({ success: false, message: 'سیستم آپلود موقتاً در دسترس نیست' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ success: false, message: 'فایلی ارسال نشد' }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ success: false, message: 'حجم عکس حداکثر ۲ مگابایت است' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ success: false, message: 'فقط JPG, PNG یا WebP مجاز است' }, { status: 400 });

    const [current] = await db.select({ avatar: customers.avatar }).from(customers).where(eq(customers.id, customer.id)).limit(1);
    if (current?.avatar) {
      try { await del(current.avatar, { token: process.env.BLOB_READ_WRITE_TOKEN }); } catch {}
    }

    const blob = await put(`avatar-${customer.id}-${Date.now()}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    await db.update(customers).set({ avatar: blob.url }).where(eq(customers.id, customer.id));

    return NextResponse.json({ success: true, avatar: blob.url });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ success: false, message: 'خطا در آپلود عکس' }, { status: 500 });
  }
}