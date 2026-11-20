import { NextResponse } from "next/server";
import { validateOrigin, rejectCsrf } from "@/lib/security";
import { db } from "@/lib/db";
import { orders, orderItems, products, coupons, customers } from "@/db/schema";
import { and, eq, sql, isNull } from "drizzle-orm";
import { verifyAdmin } from "@/lib/auth";
import { sendOrderNotification } from "@/lib/sms";
import { z } from "zod";

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["cancelled"],
  paid: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};
const updateSchema = z.object({
  status: z.enum(["pending", "paid", "processing", "shipped", "delivered", "cancelled"]),
  refundConfirmed: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);

  try {
    await verifyAdmin();
    const { id } = await params;
    if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id)) {
      return NextResponse.json({ message: "شناسه سفارش معتبر نیست." }, { status: 400 });
    }
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: "اطلاعات تغییر وضعیت معتبر نیست." }, { status: 400 });
    const { status, refundConfirmed } = parsed.data;

    const result = await db.transaction(async (tx) => {
      // Serialize admin cancellation with gateway callbacks, retry requests and cleanup.
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${id}))`);
      const [existing] = await tx.select().from(orders).where(eq(orders.id, id)).limit(1);
      if (!existing) return { kind: "missing" as const };
      if (!(VALID_TRANSITIONS[existing.status] || []).includes(status)) {
        return { kind: "transition" as const, from: existing.status, to: status };
      }
      if (status === "cancelled" && existing.status === "pending" && existing.paymentAuthority) {
        return { kind: "active-authority" as const };
      }
      if (status === "cancelled" && ["paid", "processing"].includes(existing.status) && !refundConfirmed) {
        return { kind: "refund-required" as const };
      }

      const conditions = [eq(orders.id, id), eq(orders.status, existing.status)];
      if (status === "cancelled" && existing.status === "pending") conditions.push(isNull(orders.paymentAuthority));
      const [updated] = await tx.update(orders).set({ status }).where(and(...conditions)).returning({ id: orders.id });
      if (!updated) return { kind: "race" as const };

      if (status === "cancelled") {
        const items = await tx.select({ productId: orderItems.productId, quantity: orderItems.quantity })
          .from(orderItems).where(eq(orderItems.orderId, id));
        for (const item of items) {
          await tx.update(products)
            .set({ stock: sql`${products.stock} + ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }

        if (existing.customerId) {
          const earnedPoints = ["paid", "processing"].includes(existing.status) && existing.totalAmount > 0
            ? Math.floor(existing.totalAmount / 100000)
            : 0;
          const pointDelta = Math.max(0, existing.usedPoints || 0) - earnedPoints;
          if (pointDelta !== 0) {
            const [customer] = await tx.update(customers)
              .set({ loyaltyPoints: sql`GREATEST(0, ${customers.loyaltyPoints} + ${pointDelta})` })
              .where(eq(customers.id, existing.customerId))
              .returning({ loyaltyPoints: customers.loyaltyPoints });
            if (customer) {
              const tier = customer.loyaltyPoints >= 1500 ? "gold" : customer.loyaltyPoints >= 500 ? "silver" : "bronze";
              await tx.update(customers).set({ tier }).where(eq(customers.id, existing.customerId));
            }
          }
        }
        if (existing.couponCode) {
          await tx.update(coupons)
            .set({ usedCount: sql`GREATEST(0, ${coupons.usedCount} - 1)` })
            .where(eq(coupons.code, existing.couponCode));
        }
      }

      return { kind: "updated" as const, phone: existing.phone, trackingCode: existing.trackingCode };
    });

    if (result.kind === "missing") return NextResponse.json({ message: "سفارش یافت نشد." }, { status: 404 });
    if (result.kind === "transition") return NextResponse.json({ message: `تغییر وضعیت از «${result.from}» به «${result.to}» مجاز نیست.` }, { status: 400 });
    if (result.kind === "active-authority") return NextResponse.json({ message: "برای این سفارش شناسه درگاه صادر شده است. ابتدا تراکنش را از درگاه تعیین تکلیف کنید؛ لغو خودکار امن نیست." }, { status: 409 });
    if (result.kind === "refund-required") return NextResponse.json({ message: "قبل از لغو سفارش پرداخت‌شده، بازپرداخت واقعی را در پنل زرین‌پال انجام دهید و سپس تأیید کنید." }, { status: 409 });
    if (result.kind === "race") return NextResponse.json({ message: "وضعیت سفارش هم‌زمان تغییر کرده است. صفحه را تازه‌سازی کنید." }, { status: 409 });

    if (status === "shipped") {
      sendOrderNotification(result.phone, result.trackingCode)
        .catch((error) => console.error("[SMS shipping]", error));
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 401 });
    console.error("[admin/order/update]", error);
    return NextResponse.json({ message: "خطا در به‌روزرسانی سفارش" }, { status: 500 });
  }
}

// Financial and fulfilment history is immutable. Corrections are recorded as
// status transitions/refunds, never by deleting the order and its line items.
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { valid } = validateOrigin(req);
  if (!valid) return rejectCsrf(req);
  try {
    await verifyAdmin();
    const { id } = await params;
    const [order] = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, id)).limit(1);
    if (!order) return NextResponse.json({ message: "سفارش یافت نشد." }, { status: 404 });
    return NextResponse.json({
      success: false,
      code: "ORDER_AUDIT_RETENTION",
      message: "سوابق سفارش برای تطبیق مالی، موجودی و پیگیری مشتری قابل حذف نیست. از تغییر وضعیت و ثبت بازپرداخت استفاده کنید.",
    }, { status: 409 });
  } catch (error: any) {
    if (error?.message === "UNAUTHORIZED") return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 401 });
    console.error("[admin/order/delete]", error);
    return NextResponse.json({ message: "خطا در بررسی سفارش" }, { status: 500 });
  }
}
