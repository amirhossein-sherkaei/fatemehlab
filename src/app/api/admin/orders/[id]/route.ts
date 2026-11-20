import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { orders, orderItems, products, coupons, customers } from '@/db/schema';
import { eq, and, sql, isNull } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { sendOrderNotification } from '@/lib/sms';
import { z } from 'zod';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['cancelled'],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};
const updateSchema = z.object({ status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']), refundConfirmed: z.boolean().optional() });

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const { id } = await params;
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: 'اطلاعات تغییر وضعیت معتبر نیست.' }, { status: 400 });
    const { status, refundConfirmed } = parsed.data;

    const [existing] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!existing) return NextResponse.json({ message: 'سفارش یافت نشد' }, { status: 404 });
    if (!(VALID_TRANSITIONS[existing.status] || []).includes(status)) {
      return NextResponse.json({ message: `تغییر وضعیت از «${existing.status}» به «${status}» مجاز نیست.` }, { status: 400 });
    }
    if (status === 'cancelled' && existing.status === 'pending' && existing.paymentAuthority) {
      return NextResponse.json({ message: 'برای این سفارش شناسه درگاه صادر شده است. ابتدا وضعیت تراکنش را از درگاه بررسی و تعیین تکلیف کنید؛ لغو خودکار امن نیست.' }, { status: 409 });
    }
    if (status === 'cancelled' && ['paid', 'processing'].includes(existing.status) && !refundConfirmed) {
      return NextResponse.json({ message: 'قبل از لغو سفارش پرداخت‌شده، بازپرداخت وجه را در پنل زرین‌پال انجام دهید و سپس تأیید کنید.' }, { status: 409 });
    }

    const changed = await db.transaction(async (tx) => {
      const conditions = [eq(orders.id, id), eq(orders.status, existing.status)];
      if (status === 'cancelled' && existing.status === 'pending') conditions.push(isNull(orders.paymentAuthority));
      const [updated] = await tx.update(orders).set({ status }).where(and(...conditions)).returning({ id: orders.id });
      if (!updated) return false;

      if (status === 'cancelled') {
        const items = await tx.select({ productId: orderItems.productId, quantity: orderItems.quantity })
          .from(orderItems).where(eq(orderItems.orderId, id));
        for (const item of items) {
          await tx.update(products).set({ stock: sql`${products.stock} + ${item.quantity}` }).where(eq(products.id, item.productId));
        }
        if (existing.usedPoints > 0 && existing.customerId) {
          await tx.update(customers).set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${existing.usedPoints}` }).where(eq(customers.id, existing.customerId));
        }
        if (['paid', 'processing'].includes(existing.status) && existing.customerId && existing.totalAmount > 0) {
          const earnedPoints = Math.floor(existing.totalAmount / 100000);
          if (earnedPoints > 0) {
            await tx.update(customers).set({ loyaltyPoints: sql`GREATEST(0, ${customers.loyaltyPoints} - ${earnedPoints})` }).where(eq(customers.id, existing.customerId));
          }
        }
        if (existing.couponCode) {
          await tx.update(coupons).set({ usedCount: sql`GREATEST(0, ${coupons.usedCount} - 1)` }).where(eq(coupons.code, existing.couponCode));
        }
      }
      return true;
    });

    if (!changed) return NextResponse.json({ message: 'وضعیت سفارش هم‌زمان تغییر کرده است. صفحه را تازه‌سازی کنید.' }, { status: 409 });
    if (status === 'shipped') sendOrderNotification(existing.phone, existing.trackingCode).catch((error) => console.error('[SMS shipping]', error));
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    console.error('[admin/order/update]', error);
    return NextResponse.json({ message: 'خطا در به‌روزرسانی سفارش' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const { id } = await params;
    const deleted = await db.transaction(async (tx) => {
      const [order] = await tx.select({ id: orders.id, status: orders.status }).from(orders).where(eq(orders.id, id)).limit(1);
      if (!order) return 'missing';
      if (order.status !== 'cancelled') return 'not-cancelled';
      await tx.delete(orderItems).where(eq(orderItems.orderId, id));
      await tx.delete(orders).where(and(eq(orders.id, id), eq(orders.status, 'cancelled')));
      return 'deleted';
    });
    if (deleted === 'missing') return NextResponse.json({ message: 'سفارش یافت نشد.' }, { status: 404 });
    if (deleted === 'not-cancelled') return NextResponse.json({ message: 'برای حفظ سوابق مالی و موجودی، فقط سفارش لغوشده قابل حذف است.' }, { status: 409 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    console.error('[admin/order/delete]', error);
    return NextResponse.json({ message: 'خطا در حذف سفارش' }, { status: 500 });
  }
}
