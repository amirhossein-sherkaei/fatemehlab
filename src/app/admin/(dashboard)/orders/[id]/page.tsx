import { Suspense } from 'react';
import { db } from '@/lib/db';
import { orders, orderItems, orderEvents, paymentAttempts } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import { formatToman } from '@/lib/currency';
import { ArrowRight, User, Phone, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import StatusUpdater from './status-updater';
import { Printer, History, CreditCard } from 'lucide-react';
import OrderActivityTimeline from '@/components/order/OrderActivityTimeline';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری سفارش...</div>;
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderData = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (orderData.length === 0) notFound();
  const order = orderData[0];
  const [items, events, attempts] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, id)),
    db.select({ id: orderEvents.id, eventType: orderEvents.eventType, summary: orderEvents.summary, fromStatus: orderEvents.fromStatus, toStatus: orderEvents.toStatus, createdAt: orderEvents.createdAt })
      .from(orderEvents).where(eq(orderEvents.orderId, id)).orderBy(desc(orderEvents.createdAt)).limit(60),
    db.select({ id: paymentAttempts.id, attemptNumber: paymentAttempts.attemptNumber, amount: paymentAttempts.amount, status: paymentAttempts.status, refId: paymentAttempts.refId, gatewayCode: paymentAttempts.gatewayCode, requestedAt: paymentAttempts.requestedAt })
      .from(paymentAttempts).where(eq(paymentAttempts.orderId, id)).orderBy(desc(paymentAttempts.attemptNumber)).limit(10),
  ]);
  const itemSubtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
  const totalDiscount = Math.max(0, Number(order.discountAmount) || 0);
  const pointsDiscount = Math.min(totalDiscount, Math.max(0, Number(order.usedPoints) || 0) * 10000);
  const couponDiscount = Math.max(0, totalDiscount - pointsDiscount);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/orders/${order.id}/print`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#a9155d]"><Printer size={16} /> {order.status === 'pending' ? 'چاپ پیش‌فاکتور' : 'چاپ سند سفارش'}</Link>
        <Link href="/admin/orders" prefetch={false} className="p-2 bg-white border border-border rounded-xl hover:bg-[#F8F9FA] transition-colors shadow-sm">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">جزئیات سفارش</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono" dir="ltr">{order.trackingCode}</p>
        </div>
      </div>

      <div className={`rounded-2xl border p-4 ${order.status === 'pending' ? 'border-amber-200 bg-amber-50' : ['paid', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'border-emerald-200 bg-emerald-50' : 'border-[#e9e5eb] bg-white'}`}>
        <p className="text-sm font-black text-[#28242b]">{order.status === 'pending' ? 'پرداخت این سفارش هنوز تأیید نشده است' : order.totalAmount === 0 && ['paid', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'این سفارش با مبلغ صفر و بدون پرداخت آنلاین تکمیل شده است' : ['paid', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'پرداخت این سفارش در سامانه تأیید شده است' : order.status === 'cancelled' ? 'این سفارش لغو شده است' : 'وضعیت مالی سفارش نیازمند بررسی است'}</p>
        {order.paymentRefId && ['paid', 'processing', 'shipped', 'delivered'].includes(order.status) && <p className="mt-2 text-xs text-[#77717b]">شناسه مرجع زرین‌پال: <span className="font-mono font-bold" dir="ltr">{order.paymentRefId}</span></p>}
        {order.status === 'pending' && <p className="mt-1 text-xs leading-6 text-amber-800">تا دریافت تأیید سروری درگاه، سفارش را پرداخت‌شده یا آماده ارسال در نظر نگیرید.</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold border-b border-border pb-3 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-sage" /> مشتری</h2>
          <div className="space-y-3 text-sm">
            <p className="flex justify-between"><span className="text-muted-foreground">نام:</span> <span className="font-medium">{order.firstName} {order.lastName}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">تلفن:</span> <span className="font-medium font-mono" dir="ltr">{order.phone}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">شهر:</span> <span className="font-medium">{order.city}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">کد پستی:</span> <span className="font-medium font-mono" dir="ltr">{order.postalCode}</span></p>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> آدرس:</p>
            <p className="text-sm bg-[#F8F9FA] p-3 rounded-lg border border-border leading-relaxed">{order.address}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold border-b border-border pb-3 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-sage" /> محصولات سفارش</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-[#F8F9FA] border border-border rounded-lg text-xs font-bold">{item.quantity}</span>
                    <span className="font-medium text-foreground">{item.productName}</span>
                  </div>
                  <span className="font-bold">{formatToman(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-border pt-4 text-xs">
              <div className="flex justify-between gap-3 text-muted-foreground"><span>جمع کالاها</span><strong>{formatToman(itemSubtotal)}</strong></div>
              {couponDiscount > 0 && <div className="flex justify-between gap-3 text-rose-600"><span>تخفیف {order.couponCode ? `(${order.couponCode})` : 'کد تخفیف'}</span><strong>{formatToman(couponDiscount)}</strong></div>}
              {pointsDiscount > 0 && <div className="flex justify-between gap-3 text-rose-600"><span>تخفیف امتیاز باشگاه ({Number(order.usedPoints).toLocaleString('fa-IR')} امتیاز)</span><strong>{formatToman(pointsDiscount)}</strong></div>}
              <div className="flex justify-between items-center gap-3 border-t border-border pt-3 text-sm">
                <span className="font-bold text-foreground">{order.status === 'pending' ? 'مبلغ قابل پرداخت' : 'مبلغ نهایی سفارش'}</span>
                <span className="font-black text-xl text-sage">{formatToman(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {attempts.length > 0 && (
            <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-base font-black text-foreground"><CreditCard className="h-5 w-5 text-sage" /> تلاش‌های پرداخت</h2>
              <div className="space-y-3">
                {attempts.map((attempt) => {
                  const labels: Record<string, string> = { requesting: 'در حال ایجاد', unknown: 'نیازمند تطبیق', awaiting_customer: 'منتظر ورود مشتری به درگاه', in_bank: 'در حال انجام در بانک', verified: 'تأییدشده', failed: 'ناموفق', reversed: 'برگشت‌خورده' };
                  return (
                    <div key={attempt.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-[#fbfafb] p-3 text-xs">
                      <div><p className="font-bold text-foreground">تلاش {attempt.attemptNumber.toLocaleString('fa-IR')}</p><p className="mt-1 text-muted-foreground">{labels[attempt.status] || 'نامشخص'} · {formatToman(attempt.amount)}</p></div>
                      <div className="text-left"><p className="font-mono text-muted-foreground" dir="ltr">{attempt.refId || (attempt.gatewayCode != null ? `Code ${attempt.gatewayCode}` : '—')}</p><p className="mt-1 text-[10px] text-muted-foreground">{new Date(attempt.requestedAt).toLocaleString('fa-IR')}</p></div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-base font-black text-foreground"><History className="h-5 w-5 text-sage" /> تاریخچه تغییرات سفارش</h2>
            <OrderActivityTimeline events={events} />
          </section>
          <StatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <AdminGuard>
        <Content params={params} />
      </AdminGuard>
    </Suspense>
  );
}