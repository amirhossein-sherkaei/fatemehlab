import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addresses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { isDefault, ...data } = body;

    // بررسی تعلق آدرس به مشتری
    const existing = await db.select({ id: addresses.id }).from(addresses).where(and(eq(addresses.id, id), eq(addresses.customerId, customer.id))).limit(1);
    if (existing.length === 0) return NextResponse.json({ success: false, message: 'آدرس یافت نشد' }, { status: 404 });

    // اگر این آدرس به عنوان پیش‌فرض انتخاب شد، بقیه را غیر پیش‌فرض کنیم
    if (isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.customerId, customer.id));
    }

    await db.update(addresses).set({ ...data, isDefault }).where(eq(addresses.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در ویرایش' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const { id } = await params;
    await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.customerId, customer.id)));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'خطا در حذف' }, { status: 500 });
  }
}