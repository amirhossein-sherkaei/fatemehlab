import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Package, MapPin, User, Phone, CheckCircle2, Truck, Clock, XCircle, CreditCard } from 'lucide-react';
import { formatToman } from '@/lib/currency';
import { Printer } from 'lucide-react';


const steps = [
  { id: 'processing', title: 'در حال پردازش', icon: Package },
  { id: 'shipped', title: 'ارسال شده', icon: Truck },
  { id: 'delivered', title: 'تحویل شده', icon: CheckCircle2 },
];

export const instant = false;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCurrentCustomer();
  
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.customerId, customer!.id)))
    .limit(1);

  if (!order) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex((s) => s.id === status);
  };

  const currentStep = getStepIndex(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={/account/orders//print} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl shadow-sm hover:bg-[#f8f7fa]"><Printer size={16} /> پرینت فاکتور</Link>
        <Link href="/account/orders" className="p-2 bg-white border border-[#e9e5eb] rounded-xl hover:bg-[#f8f7fa] transition-colors">
          <ArrowRight size={18} />
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#28242b]">جزئیات سفارش</h1>
          <p className="text-sm text-[#77717b] font-mono" dir="ltr">{order.trackingCode}</p>
        </div>
      </div>

      {/* وضعیت و تایم‌لاین */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#e9e5eb]">
          <div>
            <p className="text-xs text-[#77717b] mb-1">تاریخ ثبت</p>
            <p className="font-bold text-sm">{formatPersianDate(order.createdAt)}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-[#77717b] mb-1">مبلغ کل</p>
            <p className="font-black text-lg text-[#c61d70]">{formatToman(order.totalAmount)}</p>
          </div>
        </div>

        {order.status === 'cancelled' ? (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
            <XCircle size={20} />
            <span className="font-bold text-sm">این سفارش لغو شده است</span>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-5 right-0 left-0 h-1 bg-[#f5f0f2] rounded-full -z-10"></div>
            <div
              className="absolute top-5 right-0 h-1 bg-[#c61d70] rounded-full transition-all duration-1000 -z-10"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = currentStep >= index;
                const isActive = currentStep === index;
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2 w-1/3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-all ${isCompleted ? 'border-[#c61d70] text-[#c61d70] shadow-lg shadow-[#c61d70]/20' : 'border-[#e9e5eb] text-[#918a95]'}`}>
                      <step.icon size={18} />
                    </div>
                    <span className={`text-[10px] md:text-xs font-bold text-center ${isActive ? 'text-[#c61d70]' : isCompleted ? 'text-[#28242b]' : 'text-[#918a95]'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* محصولات */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-8 shadow-sm">
        <h2 className="font-black text-lg text-[#28242b] mb-4 flex items-center gap-2"><Package size={20} className="text-[#c61d70]" /> محصولات سفارش</h2>
        <div className="divide-y divide-[#e9e5eb]">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
        <Link href={/account/orders//print} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl shadow-sm hover:bg-[#f8f7fa]"><Printer size={16} /> پرینت فاکتور</Link>
                <span className="w-10 h-10 rounded-lg bg-[#f8f7fa] border border-[#e9e5eb] flex items-center justify-center text-sm font-black">{item.quantity.toLocaleString('fa-IR')}×</span>
                <span className="font-bold text-sm text-[#28242b]">{item.productName}</span>
              </div>
              <span className="font-bold text-sm text-[#28242b]">{formatToman(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* اطلاعات گیرنده */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-8 shadow-sm">
        <h2 className="font-black text-lg text-[#28242b] mb-4 flex items-center gap-2"><MapPin size={20} className="text-[#c61d70]" /> اطلاعات ارسال</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><User size={16} className="text-[#918a95]" /> {order.firstName} {order.lastName}</div>
          <div className="flex items-center gap-2"><Phone size={16} className="text-[#918a95]" /> <span dir="ltr">{order.phone}</span></div>
          <div className="md:col-span-2 flex items-start gap-2 text-[#77717b] leading-relaxed">
            <MapPin size={16} className="text-[#918a95] mt-0.5 shrink-0" />
            <span>{order.city}، {order.address} (کد پستی: {order.postalCode})</span>
          </div>
        </div>
      </div>
    </div>
  );
}