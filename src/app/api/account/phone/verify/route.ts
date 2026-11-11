import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

const schema = z.object({ newPhone: z.string(), code: z.string().length(6) });

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

    const { newPhone, code } = schema.parse(await req.json());
    const key = `phone_otp:${current.id}`;

    let stored = '';
    const redis = getRedis();
    if (redis) stored = await redis.get(key) || '';
    else stored = memoryStore.get(key) || '';

    const [storedPhone, storedCode] = stored.split(':');

    if (storedPhone !== newPhone || storedCode !== code) {
      return NextResponse.json({ message: 'کد نامعتبر یا منقضی شده' }, { status: 400 });
    }

    if (redis) await redis.del(key);
    else memoryStore.delete(key);

    const existing = await db.select({ id: customers.id }).from(customers).where(eq(customers.phone, newPhone)).limit(1);
    if (existing.length > 0 && existing[0].id !== current.id) {
      return NextResponse.json({ message: 'این شماره قبلاً توسط کاربر دیگری ثبت شده' }, { status: 400 });
    }

    await db.update(customers).set({ phone: newPhone }).where(eq(customers.id, current.id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ message: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}