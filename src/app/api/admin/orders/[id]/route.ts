import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { orders, orderItems, products, coupons, customers } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { sendOrderNotification } from '@/lib/sms';

// 🛡️ ماشین حالت: تعریف مسیرهای مجاز برای تغییر وضعیت
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    await verifyAdmin();
    const { id } = await params;
    const { status } = await req.json();
    
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: 'وضعیت نامعتبر است' }, { status: 400 });
    }

    const [existingOrder] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!existingOrder) return NextResponse.json({ message: 'سفارش یافت نشد' }, { status: 404 });

    const allowedNextStatuses = VALID_TRANSITIONS[existingOrder.status] || [];
    if (!allowedNextStatuses.includes(status)) {
      return NextResponse.json({ 
        message: `تغییر وضعیت از «${existingOrder.status}» به «${status}» مجاز نیست.` 
      }, { status: 400 });
    }

    // اگر لغو سفارش pending است: بازگرداندن موجودی، کد تخفیف و امتیازات
    if (status === 'cancelled' && existingOrder.status === 'pending') {
      await db.transaction(async (tx) => {
        const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, id));
        for (const item of items) {
          await tx.update(products)
            .set({ stock: sql`${products.stock} + ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
        if (existingOrder.couponCode) {
          await tx.update(coupons)
            .set({ usedCount: sql`${coupons.usedCount} - 1` })
            .where(eq(coupons.code, existingOrder.couponCode));
        }
        if (existingOrder.usedPoints > 0 && existingOrder.customerId) {
          await tx.update(customers)
            .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${existingOrder.usedPoints}` })
            .where(eq(customers.id, existingOrder.customerId));
        }
        await tx.update(orders).set({ status }).where(eq(orders.id, id));
      });
    } else if (status === 'cancelled' && (existingOrder.status === 'paid' || existingOrder.status === 'processing')) {
      // اگر سفارش پرداخت شده لغو شود: موجودی برگردد، اما امتیاز و کد تخفیف مصرف‌شده باقی می‌مانند
      await db.transaction(async (tx) => {
        const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, id));
        for (const item of items) {
          await tx.update(products)
            .set({ stock: sql`${products.stock} + ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
        await tx.update(orders).set({ status }).where(eq(orders.id, id));
      });
    } else {
      await db.update(orders).set({ status }).where(eq(orders.id, id));
    }

    if (status === 'shipped') {
      sendOrderNotification(existingOrder.phone, existingOrder.trackingCode).catch(e => console.error('[SMS Shipping]', e));
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    await db.delete(orders).where(eq(orders.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}