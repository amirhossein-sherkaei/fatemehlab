import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentCustomer, createCustomerToken } from '@/lib/customer-auth';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'نام حداقل ۲ حرف باشد'),
  phone: z.string().optional().nullable(),
  email: z.string().email('ایمیل معتبر نیست').optional(),
});

export async function PUT(req: Request) {
  try {
    // 🛡️ سپر امنیتی
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const body = await req.json();
    const validated = profileSchema.parse(body);

    const updateData: any = { name: validated.name, phone: validated.phone || null };
    let emailChanged = false;
    let nameChanged = validated.name !== current.name;

    if (validated.email && validated.email.toLowerCase() !== current.email.toLowerCase()) {
      const existing = await db.select({ id: customers.id }).from(customers).where(eq(customers.email, validated.email.toLowerCase())).limit(1);
      if (existing.length > 0 && existing[0].id !== current.id) {
        return NextResponse.json({ success: false, message: 'این ایمیل قبلاً ثبت شده است' }, { status: 400 });
      }
      updateData.email = validated.email.toLowerCase();
      emailChanged = true;
    }

    await db.update(customers).set(updateData).where(eq(customers.id, current.id));

    const response = NextResponse.json({ success: true });

    if (emailChanged || nameChanged) {
      const newToken = await createCustomerToken({
        id: current.id,
        email: updateData.email,
        name: validated.name,
      });
      response.cookies.set('customer_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'خطا' }, { status: 500 });
  }
}