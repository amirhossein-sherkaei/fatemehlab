import { NextResponse } from 'next/server';

// 🎯 دریافت معیارهای عملکرد از کلاینت
// در محیط پروداکشن می‌توانید این‌ها را به یک سرویس مانیتورینگ مثل Sentry یا LogRocket بفرستید
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, value, rating, delta, id } = body;

    // لاگ کردن برای دیباگ (در محیط پروداکشن به سرویس مانیتورینگ ارسال شود)
    console.log(`[Web Vital] ${name}: ${value} (${rating})`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}