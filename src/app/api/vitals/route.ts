import { getClientIp, validateOrigin, rejectCsrf } from '@/lib/security';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { NextResponse } from 'next/server';

// 🎯 دریافت معیارهای عملکرد از کلاینت
// در محیط پروداکشن می‌توانید این‌ها را به یک سرویس مانیتورینگ مثل Sentry یا LogRocket بفرستید
const metricSchema = z.object({
  name: z.enum(['CLS', 'FCP', 'INP', 'LCP', 'TTFB', 'FID']),
  value: z.number().finite().min(0).max(120000),
  rating: z.enum(['good', 'needs-improvement', 'poor']),
  delta: z.number().finite().min(-120000).max(120000),
  id: z.string().min(1).max(120),
});

export async function POST(req: Request) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    const ip = getClientIp(req);
    const limit = await rateLimit('web-vitals:' + ip);
    if (!limit.success) return NextResponse.json({ success: false }, { status: 429 });
    const parsed = metricSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false }, { status: 400 });
    const metric = parsed.data;
    console.log(`[Web Vital] ${metric.name}: ${metric.value} (${metric.rating})`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
