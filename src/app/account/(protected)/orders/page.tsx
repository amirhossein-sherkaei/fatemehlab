import { formatPersianDate } from '@/lib/format';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, ArrowLeft, Clock, CheckCircle2, Truck, XCircle, CreditCard } from 'lucide-react';
import PaymentActionButton from '@/components/account/PaymentActionButton';
import { formatToman } from '@/lib/currency';


export const instant = false;

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'در انتظار پرداخت', color: 'bg-amber-50 text-amber-700', icon: Clock },
  paid: { label: 'پرداخت تأیید شد', color: 'bg-sky-50 text-sky-700', icon: CreditCard },
  processing: { label: 'در حال پردازش', color: 'bg-blue-50 text-blue-700', icon: Package },
  shipped: { label: 'ارسال شده', color: 'bg-purple-50 text-purple-700', icon: Truck },
  delivered: { label: 'تحویل شده', color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  cancelled: { label: 'لغو شده', color: 'bg-rose-50 text-rose-700', icon: XCircle },
};

export default async function CustomerOrdersPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect('/account/login');
  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customer.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-[#28242b] flex items-center gap-2">
          <Package className="text-[#c61d70]" /> سفارشات من
        </h1>
        <p className="text-sm text-[#77717b] mt-1">{myOrders.length.toLocaleString('fa-IR')} سفارش ثبت شده</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-12 text-center">
          <div className="w-20 h-20 bg-[#fff0f7] rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-[#c61d70]/40" />
          </div>
          <h3 className="text-lg font-black text-[#28242b] mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
          <p className="text-sm text-[#77717b] mb-6">با مرور محصولات، اولین سفارش خود را ثبت کنید.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl hover:bg-[#a9155d] transition-colors">
            شروع خرید <ArrowLeft size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {myOrders.map((order) => {
            const baseStatus = statusMap[order.status] || { label: order.status, color: 'bg-gray-50 text-gray-700', icon: Package };
            const status = order.status === 'paid' && order.totalAmount === 0
              ? { ...baseStatus, label: 'تکمیل‌شده؛ بدون نیاز به پرداخت' }
              : baseStatus;
            const StatusIcon = status.icon;
            return (
              <div
                key={order.id}
                className="group rounded-2xl border border-[#e9e5eb] bg-white p-5 transition-all hover:border-[#c61d70]/30 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <Link href={`/account/orders/${order.id}`} className="min-w-0 flex-1 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c61d70]">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <span className="font-mono text-sm font-black text-[#28242b] md:text-base" dir="ltr">
                        {order.trackingCode}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${status.color}`}>
                        <StatusIcon size={11} /> {status.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#77717b]">
                      <span>تاریخ: {formatPersianDate(order.createdAt)}</span>
                      <span>مبلغ سفارش: {formatToman(order.totalAmount)}</span>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] transition-transform group-hover:translate-x-0.5">
                      مشاهده جزئیات <ArrowLeft size={14} />
                    </div>
                  </Link>
                  {order.status === 'pending' && (
                    <PaymentActionButton orderId={order.id} compact className="shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}