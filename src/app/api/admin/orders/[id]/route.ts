import { NextResponse } from 'next/server';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { z } from 'zod';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { coupons, customers, orderEvents, orderItems, orders, paymentAttempts, products } from '@/db/schema';
import { verifyAdmin } from '@/lib/auth';
import { sendOrderNotification } from '@/lib/sms';
import { appendOrderEvent, cancelPendingOrderInTransaction, isUnresolvedPaymentAttempt } from '@/lib/order-payment';

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['cancelled'],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};
const updateSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']),
  refundReference: z.string().trim().min(4).max(120).regex(/^[\p{L}\p{N}._/-]+$/u, 'شناسه بازپرداخت فقط می‌تواند شامل حروف، عدد و خط تیره باشد.').optional(),
  refundReason: z.string().trim().min(8).max(400).optional(),
});

async function recalculateTier(tx: any, customerId: string) {
  const [customer] = await tx.select({ loyaltyPoints: customers.loyaltyPoints }).from(customers).where(eq(customers.id, customerId)).limit(1);
  if (!customer) return;
  const tier = customer.loyaltyPoints >= 1500 ? 'gold' : customer.loyaltyPoints >= 500 ? 'silver' : 'bronze';
  await tx.update(customers).set({ tier }).where(eq(customers.id, customerId));
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);

  try {
    const admin = await verifyAdmin();
    const { id } = await params;
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id)) return NextResponse.json({ message: 'شناسه سفارش معتبر نیست.' }, { status: 400 });
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || 'اطلاعات تغییر وضعیت معتبر نیست.' }, { status: 400 });
    const { status, refundReference, refundReason } = parsed.data;

    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${id}))`);
      const [existing] = await tx.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!existing) return { kind: 'missing' as const };
      if (!(VALID_TRANSITIONS[existing.status] || []).includes(status)) {
        return { kind: 'transition' as const, from: existing.status, to: status };
      }

      if (status === 'cancelled' && existing.status === 'pending') {
        const [latestAttempt] = await tx.select({ status: paymentAttempts.status, authority: paymentAttempts.authority })
          .from(paymentAttempts).where(eq(paymentAttempts.orderId, id))
          .orderBy(desc(paymentAttempts.attemptNumber)).limit(1);
        if (existing.paymentAuthority || (latestAttempt && isUnresolvedPaymentAttempt(latestAttempt.status))) {
          return { kind: 'active-authority' as const };
        }
        const cancelled = await cancelPendingOrderInTransaction(tx, id, {
          actorType: 'admin', actorId: typeof admin?.id === 'string' ? admin.id : null,
          summary: 'مدیر سفارش پرداخت‌نشده را لغو کرد و موجودی، کوپن و امتیازهای رزروشده آزاد شدند.',
        });
        if (!cancelled) return { kind: 'race' as const };
        return { kind: 'updated' as const, phone: existing.phone, trackingCode: existing.trackingCode };
      }

      if (status === 'cancelled' && ['paid', 'processing'].includes(existing.status)) {
        if (!refundReference || !refundReason) return { kind: 'refund-required' as const };
        const [customer] = existing.customerId
          ? await tx.select({ loyaltyPoints: customers.loyaltyPoints }).from(customers).where(eq(customers.id, existing.customerId)).limit(1)
          : [undefined];
        const earnedPoints = existing.totalAmount > 0 ? Math.floor(existing.totalAmount / 100000) : 0;
        const restoredBalance = (customer?.loyaltyPoints ?? 0) + Math.max(0, existing.usedPoints || 0) - earnedPoints;
        if (existing.customerId && restoredBalance < 0) return { kind: 'loyalty-adjustment-required' as const };

        const [updated] = await tx.update(orders).set({ status: 'cancelled' })
          .where(and(eq(orders.id, id), eq(orders.status, existing.status)))
          .returning({ id: orders.id });
        if (!updated) return { kind: 'race' as const };

        const items = await tx.select({ productId: orderItems.productId, quantity: orderItems.quantity })
          .from(orderItems).where(eq(orderItems.orderId, id));
        for (const item of items) {
          await tx.update(products).set({ stock: sql`${products.stock} + ${item.quantity}` }).where(eq(products.id, item.productId));
        }
        if (existing.customerId) {
          const pointDelta = Math.max(0, existing.usedPoints || 0) - earnedPoints;
          if (pointDelta !== 0) {
            await tx.update(customers).set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${pointDelta}` }).where(eq(customers.id, existing.customerId));
            await recalculateTier(tx, existing.customerId);
          }
        }
        if (existing.couponCode) {
          await tx.update(coupons).set({ usedCount: sql`GREATEST(0, ${coupons.usedCount} - 1)` }).where(eq(coupons.code, existing.couponCode));
        }
        await appendOrderEvent(tx, {
          orderId: id, actorType: 'admin', actorId: typeof admin?.id === 'string' ? admin.id : null,
          eventType: 'order.refund_recorded_and_cancelled', fromStatus: existing.status, toStatus: 'cancelled',
          summary: 'مدیر بازپرداخت دستی را ثبت و سفارش را لغو کرد.',
          metadata: { refundReference, refundReason, refundAmount: existing.totalAmount, restoredPoints: existing.usedPoints, reversedEarnedPoints: earnedPoints },
        });
        return { kind: 'updated' as const, phone: existing.phone, trackingCode: existing.trackingCode };
      }

      const [updated] = await tx.update(orders).set({ status })
        .where(and(eq(orders.id, id), eq(orders.status, existing.status)))
        .returning({ id: orders.id });
      if (!updated) return { kind: 'race' as const };
      await appendOrderEvent(tx, {
        orderId: id, actorType: 'admin', actorId: typeof admin?.id === 'string' ? admin.id : null,
        eventType: 'order.status_changed', fromStatus: existing.status, toStatus: status,
        summary: `وضعیت سفارش از ${existing.status} به ${status} تغییر کرد.`,
      });
      return { kind: 'updated' as const, phone: existing.phone, trackingCode: existing.trackingCode };
    });

    if (result.kind === 'missing') return NextResponse.json({ message: 'سفارش یافت نشد.' }, { status: 404 });
    if (result.kind === 'transition') return NextResponse.json({ message: `تغییر وضعیت از «${result.from}» به «${result.to}» مجاز نیست.` }, { status: 400 });
    if (result.kind === 'active-authority') return NextResponse.json({ message: 'برای این سفارش درخواست یا تراکنش پرداخت فعال/نامشخص وجود دارد. ابتدا وضعیت آن را از درگاه پرداخت تطبیق دهید؛ لغو در این مرحله امن نیست.' }, { status: 409 });
    if (result.kind === 'refund-required') return NextResponse.json({ message: 'برای لغو سفارش پرداخت‌شده، شناسه واقعی بازپرداخت و علت آن را که پس از بازپرداخت دستی از پنل درگاه پرداخت دریافت شده وارد کنید.' }, { status: 400 });
    if (result.kind === 'loyalty-adjustment-required') return NextResponse.json({ message: 'موجودی امتیاز مشتری برای برگشت امتیاز کسب‌شده کافی نیست. ابتدا مانده امتیاز را با سوابق تطبیق دهید؛ لغو خودکار انجام نشد.' }, { status: 409 });
    if (result.kind === 'race') return NextResponse.json({ message: 'وضعیت سفارش هم‌زمان تغییر کرده است. صفحه را تازه‌سازی کنید.' }, { status: 409 });

    if (status === 'shipped') {
      sendOrderNotification(result.phone, result.trackingCode)
        .catch((error) => console.error('[SMS shipping]', error));
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    if (error?.code === '23505' || error?.cause?.code === '23505') return NextResponse.json({ message: 'این شناسه بازپرداخت قبلاً برای سفارش دیگری ثبت شده است.' }, { status: 409 });
    console.error('[admin/order/update]', error);
    return NextResponse.json({ message: 'خطا در به‌روزرسانی سفارش' }, { status: 500 });
  }
}

// Financial and fulfilment history is immutable. Corrections are recorded as status transitions/refunds, never by deleting the order.
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const { id } = await params;
    const [order] = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, id)).limit(1);
    if (!order) return NextResponse.json({ message: 'سفارش یافت نشد.' }, { status: 404 });
    return NextResponse.json({ success: false, code: 'ORDER_AUDIT_RETENTION', message: 'سوابق مالی سفارش قابل حذف نیست. از مسیر تغییر وضعیت و ثبت بازپرداخت استفاده کنید.' }, { status: 409 });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    console.error('[admin/order/delete]', error);
    return NextResponse.json({ message: 'خطا در بررسی سفارش' }, { status: 500 });
  }
}
