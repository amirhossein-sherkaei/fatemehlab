import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addresses } from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';
import { validateOrigin, rejectCsrf } from '@/lib/security';

const addressSchema = z.object({
  title: z.string().trim().min(1).max(80),
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  phone: z.string().regex(/^09\d{9}$/),
  province: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().min(10).max(500),
  postalCode: z.string().regex(/^\d{10}$/),
  isDefault: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });
    const { id } = await params;
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id)) return NextResponse.json({ success: false, message: 'شناسه آدرس معتبر نیست.' }, { status: 400 });
    const parsed = addressSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ success: false, message: parsed.error.issues[0].message }, { status: 400 });
    const { isDefault, ...data } = parsed.data;

    const updated = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${customer.id})::bigint)`);
      const [existing] = await tx.select({ id: addresses.id }).from(addresses)
        .where(and(eq(addresses.id, id), eq(addresses.customerId, customer.id))).limit(1);
      if (!existing) return false;
      if (isDefault === true) await tx.update(addresses).set({ isDefault: false }).where(eq(addresses.customerId, customer.id));
      const [row] = await tx.update(addresses).set({ ...data, ...(isDefault !== undefined ? { isDefault } : {}) })
        .where(and(eq(addresses.id, id), eq(addresses.customerId, customer.id))).returning({ id: addresses.id });
      return Boolean(row);
    });
    if (!updated) return NextResponse.json({ success: false, message: 'آدرس یافت نشد' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[account/address/update]', error);
    return NextResponse.json({ success: false, message: 'خطا در ویرایش آدرس' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });
    const { id } = await params;
    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext(${customer.id})::bigint)`);
      const [existing] = await tx.select({ id: addresses.id, isDefault: addresses.isDefault })
        .from(addresses).where(and(eq(addresses.id, id), eq(addresses.customerId, customer.id))).limit(1);
      if (!existing) return 'missing';
      await tx.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.customerId, customer.id)));
      if (existing.isDefault) {
        const [nextAddress] = await tx.select({ id: addresses.id }).from(addresses)
          .where(eq(addresses.customerId, customer.id)).orderBy(desc(addresses.createdAt)).limit(1);
        if (nextAddress) await tx.update(addresses).set({ isDefault: true }).where(eq(addresses.id, nextAddress.id));
      }
      return 'deleted';
    });
    if (result === 'missing') return NextResponse.json({ success: false, message: 'آدرس یافت نشد' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[account/address/delete]', error);
    return NextResponse.json({ success: false, message: 'خطا در حذف آدرس' }, { status: 500 });
  }
}
