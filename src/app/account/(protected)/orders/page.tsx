import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import Link from 'next/link';
import { Package, ArrowLeft, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { formatToman } from '@/lib/currency';


export const instant = false;

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'در انتظار پرداخت', color: 'bg-amber-50 text-amber-700', icon: Clock },
  processing: { label: 'در حال پردازش', color: 'bg-blue-50 text-blue-700', icon: Package },
  shipped: { label: 'ارسال شده', color: 'bg-purple-50 text-purple-700', icon: Truck },
  delivered: { label: 'تحویل شده', color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  cancelled: { label: 'لغو شده', color: 'bg-rose-50 text-rose-700', icon: XCircle },
};

export default async function CustomerOrdersPage() {
  const customer = await getCurrentCustomer();
  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customer!.id))
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
            const status = statusMap[order.status] || { label: order.status, color: 'bg-gray-50 text-gray-700', icon: Package };
            const StatusIcon = status.icon;
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="group bg-white rounded-2xl border border-[#e9e5eb] p-5 hover:shadow-lg hover:border-[#c61d70]/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm md:text-base font-black text-[#28242b]" dir="ltr">
                        {order.trackingCode}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-bold ${status.color}`}>
                        <StatusIcon size={11} /> {status.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#77717b]">
                      <span>تاریخ: {new Date(order.createdAt).toLocaleDateString('fa-IR')}</span>
                      <span>مبلغ: {formatToman(order.totalAmount)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#c61d70] font-bold text-sm group-hover:translate-x-1 transition-transform">
                    مشاهده جزئیات <ArrowLeft size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}