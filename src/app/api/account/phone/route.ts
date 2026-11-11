import { NextResponse } from 'next/server';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { sendOtpCode } from '@/lib/sms';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

const schema = z.object({ newPhone: z.string().regex(/^0\d{10}$/, 'شماره معتبر نیست') });

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}
const memoryStore = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });

    const { newPhone } = schema.parse(await req.json());
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `phone_otp:${current.id}`;

    const redis = getRedis();
    if (redis) await redis.set(key, `${newPhone}:${code}`, { ex: 120 });
    else { memoryStore.set(key, `${newPhone}:${code}`); setTimeout(() => memoryStore.delete(key), 120000); }

    const result = await sendOtpCode(newPhone, code);
    if (result.success) return NextResponse.json({ success: true });
    return NextResponse.json({ message: 'خطا در ارسال پیامک' }, { status: 500 });
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ message: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}