import { formatPersianDate } from '@/lib/format';
import { db } from '@/lib/db';
import { orders, orderItems, orderEvents } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight, Package, MapPin, User, Phone, CheckCircle2, Truck,
  Clock, XCircle, CreditCard, Printer,
} from 'lucide-react';
import { formatToman } from '@/lib/currency';
import PaymentActionButton from '@/components/account/PaymentActionButton';
import OrderActivityTimeline from '@/components/order/OrderActivityTimeline';

const steps = [
  { id: 'paid', title: 'پرداخت تأیید شد', icon: CreditCard },
  { id: 'processing', title: 'در حال پردازش', icon: Package },
  { id: 'shipped', title: 'ارسال شده', icon: Truck },
  { id: 'delivered', title: 'تحویل شده', icon: CheckCircle2 },
];

export const instant = false;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCurrentCustomer();
  if (!customer) notFound();

  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.customerId, customer.id)))
    .limit(1);

  if (!order) notFound();

  const [items, events] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, id)),
    db.select({ id: orderEvents.id, eventType: orderEvents.eventType, summary: orderEvents.summary, fromStatus: orderEvents.fromStatus, toStatus: orderEvents.toStatus, createdAt: orderEvents.createdAt })
      .from(orderEvents).where(eq(orderEvents.orderId, id)).orderBy(desc(orderEvents.createdAt)).limit(40),
  ]);
  const currentStep = steps.findIndex((step) => step.id === order.status);
  const isPending = order.status === 'pending';
  const isCancelled = order.status === 'cancelled';
  const isZeroAmountOrder = order.totalAmount === 0 && ['paid', 'processing', 'shipped', 'delivered'].includes(order.status);
  const totalDiscount = Math.max(0, Number(order.discountAmount) || 0);
  const pointsDiscount = Math.min(totalDiscount, Math.max(0, Number(order.usedPoints) || 0) * 10000);
  const couponDiscount = Math.max(0, totalDiscount - pointsDiscount);
  const itemSubtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/account/orders/${order.id}/print`}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl border border-[#e9e5eb] bg-white px-4 py-2 text-sm font-bold text-[#28242b] shadow-sm hover:bg-[#f8f7fa]"
        >
          <Printer size={16} /> {isPending ? 'پیش‌فاکتور سفارش' : 'چاپ سند سفارش'}
        </Link>
        <Link href="/account/orders" className="rounded-xl border border-[#e9e5eb] bg-white p-2 transition-colors hover:bg-[#f8f7fa]">
          <ArrowRight size={18} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl">جزئیات سفارش</h1>
          <p className="font-mono text-sm text-[#77717b]" dir="ltr">{order.trackingCode}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-[#e9e5eb] bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#e9e5eb] pb-6">
          <div>
            <p className="mb-1 text-xs text-[#77717b]">تاریخ ثبت</p>
            <p className="text-sm font-bold">{formatPersianDate(order.createdAt)}</p>
          </div>
          <div className="text-left">
            <p className="mb-1 text-xs text-[#77717b]">{isZeroAmountOrder ? 'مبلغ نهایی (بدون پرداخت آنلاین)' : 'مبلغ سفارش'}</p>
            <p className="text-lg font-black text-[#c61d70]">{formatToman(order.totalAmount)}</p>
          </div>
        </div>

        {isPending ? (
          <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <Clock size={22} className="mt-0.5 shrink-0 text-amber-700" />
              <div>
                <h2 className="font-black text-amber-900">سفارش ثبت شده؛ پرداخت هنوز تأیید نشده است</h2>
                <p className="mt-1 text-xs leading-6 text-amber-800">
                  موجودی و جزئیات سفارش برای شما نگه داشته شده‌اند. با ادامه پرداخت، ابتدا وضعیت تراکنش قبلی از زیبال استعلام می‌شود؛ اگر پرداخت قبلاً انجام شده باشد، از پرداخت دوباره جلوگیری خواهد شد.
                </p>
              </div>
            </div>
            <PaymentActionButton orderId={order.id} />
          </div>
        ) : isCancelled ? (
          <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            <XCircle size={20} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold">این سفارش لغو شده است.</p>
              <p className="mt-1 text-xs leading-6">برای پرسش درباره وضعیت مالی یا بازپرداخت احتمالی، با پشتیبانی فروشگاه تماس بگیرید.</p>
            </div>
          </div>
        ) : currentStep >= 0 ? (
          <div>
            <p className="mb-5 text-sm font-bold text-[#28242b]">وضعیت پرداخت و پردازش سفارش</p>
            <div className="relative">
              <div className="absolute right-0 left-0 top-5 -z-10 h-1 rounded-full bg-[#f5f0f2]" />
              <div
                className="absolute right-0 top-5 -z-10 h-1 rounded-full bg-[#c61d70] transition-all duration-1000"
                style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%` }}
              />
              <div className="flex justify-between">
                {steps.map((step, index) => {
                  const isCompleted = currentStep >= index;
                  const isActive = currentStep === index;
                  return (
                    <div key={step.id} className="flex w-1/4 flex-col items-center gap-2">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white transition-all ${isCompleted ? 'border-[#c61d70] text-[#c61d70] shadow-lg shadow-[#c61d70]/20' : 'border-[#e9e5eb] text-[#918a95]'}`}>
                        <step.icon size={18} />
                      </div>
                      <span className={`text-center text-[10px] font-bold md:text-xs ${isActive ? 'text-[#c61d70]' : isCompleted ? 'text-[#28242b]' : 'text-[#918a95]'}`}>
                        {index === 0 && isZeroAmountOrder ? 'بدون نیاز به پرداخت' : step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {order.paymentRefId && (
              <p className="mt-6 border-t border-[#e9e5eb] pt-4 text-xs text-[#77717b]">
                شناسه مرجع پرداخت: <span className="font-mono font-bold text-[#28242b]" dir="ltr">{order.paymentRefId}</span>
              </p>
            )}
          </div>
        ) : (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">وضعیت سفارش نیازمند بررسی پشتیبانی است.</p>
        )}
      </div>

      <div className="rounded-3xl border border-[#e9e5eb] bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-[#28242b]"><Clock size={19} className="text-[#c61d70]" /> تاریخچه سفارش</h2>
        <OrderActivityTimeline events={events} />
      </div>

      <div className="rounded-3xl border border-[#e9e5eb] bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-[#28242b]"><Package size={20} className="text-[#c61d70]" /> محصولات سفارش</h2>
        <div className="divide-y divide-[#e9e5eb]">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e9e5eb] bg-[#f8f7fa] text-sm font-black">{item.quantity.toLocaleString('fa-IR')}×</span>
                <span className="text-sm font-bold text-[#28242b]">{item.productName}</span>
              </div>
              <span className="shrink-0 text-sm font-bold text-[#28242b]">{formatToman(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-[#e9e5eb] pt-4 text-xs">
          <div className="flex justify-between gap-3 text-[#77717b]"><span>جمع کالاها</span><strong>{formatToman(itemSubtotal)}</strong></div>
          {couponDiscount > 0 && <div className="flex justify-between gap-3 text-rose-600"><span>تخفیف {order.couponCode ? `(${order.couponCode})` : 'کد تخفیف'}</span><strong>{formatToman(couponDiscount)}</strong></div>}
          {pointsDiscount > 0 && <div className="flex justify-between gap-3 text-rose-600"><span>تخفیف امتیاز باشگاه</span><strong>{formatToman(pointsDiscount)}</strong></div>}
          <div className="flex justify-between gap-3 border-t border-[#e9e5eb] pt-3 text-sm font-black text-[#28242b]"><span>{isPending ? 'مبلغ قابل پرداخت' : 'مبلغ نهایی سفارش'}</span><strong className="text-[#c61d70]">{formatToman(order.totalAmount)}</strong></div>
          {isPending && <p className="rounded-lg bg-amber-50 px-3 py-2 text-[10px] leading-5 text-amber-800">این سفارش هنوز رسید پرداخت ندارد. پس از تأیید درگاه، وضعیت و سند سفارش به‌روزرسانی می‌شود.</p>}
        </div>
      </div>

      <div className="rounded-3xl border border-[#e9e5eb] bg-white p-6 shadow-sm md:p-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-[#28242b]"><MapPin size={20} className="text-[#c61d70]" /> اطلاعات گیرنده و ارسال</h2>
        <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
          <div className="flex items-center gap-2"><User size={16} className="text-[#918a95]" /> {order.firstName} {order.lastName}</div>
          <div className="flex items-center gap-2"><Phone size={16} className="text-[#918a95]" /> <span dir="ltr">{order.phone}</span></div>
          <div className="flex items-start gap-2 leading-relaxed text-[#77717b] md:col-span-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[#918a95]" />
            <span>{order.city}، {order.address} (کد پستی: {order.postalCode})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
