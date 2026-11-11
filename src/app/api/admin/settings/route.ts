import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();
    const settings = await db.select().from(siteSettings);
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED' || error?.message === 'FORBIDDEN') {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    return NextResponse.json({ message: 'خطا در دریافت تنظیمات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    await verifyAdmin();
    const body = await req.json();
    const entries = Object.entries(body);

    for (const [key, value] of entries) {
      await db.insert(siteSettings)
        .values({ key, value })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value, updatedAt: new Date() },
        });
    }

    revalidatePath('/admin/settings');
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED' || error?.message === 'FORBIDDEN') {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    return NextResponse.json({ message: 'خطا در ذخیره تنظیمات' }, { status: 500 });
  }
}