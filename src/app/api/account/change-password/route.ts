import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { z } from 'zod';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { validateOrigin, rejectCsrf } from '@/lib/security';

const schema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'رمز جدید باید حداقل ۶ حرف باشد'),
});

export async function POST(req: Request) {
  try {
    // 🛡️ سپر امنیتی
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const body = await req.json();
    const { currentPassword, newPassword } = schema.parse(body);

    const [cust] = await db.select().from(customers).where(eq(customers.id, customer.id)).limit(1);
    if (!cust) return NextResponse.json({ success: false, message: 'کاربر یافت نشد' }, { status: 404 });

    if (cust.passwordHash && cust.passwordHash !== '') {
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: 'رمز عبور فعلی الزامی است' }, { status: 400 });
      }
      const isValid = await argon2.verify(cust.passwordHash, currentPassword);
      if (!isValid) return NextResponse.json({ success: false, message: 'رمز عبور فعلی اشتباه است' }, { status: 400 });
    }

    const newHash = await argon2.hash(newPassword);
    await db.update(customers).set({ passwordHash: newHash }).where(eq(customers.id, customer.id));

    return NextResponse.json({ success: true, message: 'رمز عبور با موفقیت تنظیم شد' });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'خطا در تغییر رمز' }, { status: 500 });
  }
}