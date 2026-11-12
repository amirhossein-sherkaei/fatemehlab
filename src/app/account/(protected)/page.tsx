import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { db } from '@/lib/db';
import { orders, wishlist, addresses, customers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import Link from 'next/link';
import { Package, Heart, MapPin, ArrowLeft, Clock, Truck, ShoppingBag, Sparkles, CheckCircle2, ChevronLeft, X, ShieldAlert, Award, Calendar, Crown } from 'lucide-react';
import { formatToman } from '@/lib/currency';

export const instant = false;

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'در انتظار پرداخت', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  paid: { label: 'پرداخت شده', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: CheckCircle2 },
  processing: { label: 'در حال پردازش', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Package },
  shipped: { label: 'ارسال شده', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Truck },
  delivered: { label: 'تحویل شده', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  cancelled: { label: 'لغو شده', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: X },
};

export default async function AccountDashboard() {
  const current = await getCurrentCustomer();
  const customerId = current!.id;

  const [customerData] = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
  const isOtpUser = customerData?.email?.endsWith('@temp.fatemehlab.ir') || false;

  const myOrders = await db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  const myWishlist = await db.select({ id: wishlist.id }).from(wishlist).where(eq(wishlist.customerId, customerId));
  const myAddresses = await db.select({ id: addresses.id }).from(addresses).where(eq(addresses.customerId, customerId));

  const recentOrders = myOrders.slice(0, 3);

  // محاسبه سابقه عضویت (روز)
  const daysSinceJoin = Math.max(0, Math.floor((Date.now() - new Date(customerData?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)));

  const stats = [
    { title: 'سفارشات', value: myOrders.length, icon: Package, href: '/account/orders', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { title: 'علاقه‌مندی', value: myWishlist.length, icon: Heart, href: '/account/wishlist', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50' },
    { title: 'آدرس‌ها', value: myAddresses.length, icon: MapPin, href: '/account/addresses', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* هشدار تکمیل پروفایل */}
      {isOtpUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="font-bold text-amber-800 text-sm">پروفایل خود را تکمیل کنید</p>
              <p className="text-xs text-amber-600 mt-1">برای امنیت بیشتر، یک ایمیل و رمز عبور تنظیم کنید.</p>
            </div>
          </div>
          <Link href="/account/profile" className="whitespace-nowrap bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm">
            تکمیل پروفایل
          </Link>
        </div>
      )}

      {/* کارت خوش‌آمدگویی لوکس */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-[#f8f7fa] p-6 md:p-10 shadow-sm">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#c61d70]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#c61d70]/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-black text-[#28242b] md:text-3xl">
              سلام {current!.name.split(' ')[0]} <Sparkles className="text-[#c61d70]" size={28} />
            </h1>
            <p className="text-sm leading-relaxed text-[#77717b]">
              به داشبورد اختصاصی خود خوش آمدید. از اینجا می‌توانید سفارشات، علاقه‌مندی‌ها و اطلاعات خود را مدیریت کنید.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/50 shadow-sm shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md">
              <Crown size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[#77717b] font-bold">سطح عضویت شما</p>
              <p className="text-sm font-black text-[#28242b]">کاربر ویژه</p>
            </div>
          </div>
        </div>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        {stats.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group flex flex-col items-center justify-center rounded-3xl border border-[#e9e5eb] bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-[#c61d70]/30 hover:shadow-lg hover:shadow-[#c61d70]/5 md:p-6"
          >
            <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-md transition-transform group-hover:scale-110 md:h-14 md:w-14`}>
              <s.icon size={24} className="md:w-7 md:h-7" />
            </div>
            <p className="text-2xl font-black text-[#28242b] md:text-3xl">{s.value.toLocaleString('fa-IR')}</p>
            <p className="mt-1.5 text-xs font-bold text-[#77717b] md:text-sm">{s.title}</p>
          </Link>
        ))}
      </div>

      {/* دکمه‌های عملیات سریع */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/track" className="flex items-center justify-center gap-2 rounded-2xl border border-[#e9e5eb] bg-white p-4 text-sm font-bold text-[#28242b] shadow-sm transition-all hover:border-[#c61d70]/30 hover:shadow-md">
          <Truck size={18} className="text-[#c61d70]" /> رهگیری سفارش
        </Link>
        <Link href="/products" className="flex items-center justify-center gap-2 rounded-2xl border border-[#e9e5eb] bg-white p-4 text-sm font-bold text-[#28242b] shadow-sm transition-all hover:border-[#c61d70]/30 hover:shadow-md">
          <ShoppingBag size={18} className="text-[#c61d70]" /> ادامه خرید
        </Link>
      </div>

      {/* لیست آخرین سفارشات */}
      <div className="overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e9e5eb] p-5 md:p-6 bg-[#fafafc]">
          <h2 className="flex items-center gap-2 text-base font-black text-[#28242b] md:text-lg">
            <Clock size={20} className="text-[#c61d70]" /> آخرین سفارشات
          </h2>
          <Link href="/account/orders" className="text-xs font-bold text-[#c61d70] hover:underline bg-[#fff0f7] px-3 py-1.5 rounded-lg transition-colors hover:bg-[#fce5f0]">
            مشاهده همه
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f7]">
              <Package size={36} className="text-[#c61d70]/50" />
            </div>
            <p className="mb-4 text-sm font-bold text-[#77717b]">هنوز سفارشی ثبت نکرده‌اید</p>
            <Link href="/products" className="inline-flex items-center gap-2 rounded-xl bg-[#c61d70] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#c61d70]/20 transition-colors hover:bg-[#a9155d]">
              شروع خرید <ArrowLeft size={14} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#e9e5eb]">
            {recentOrders.map((order) => {
              const status = statusMap[order.status] || { label: order.status, color: 'bg-gray-50 text-gray-700 border-gray-200', icon: Package };
              const StatusIcon = status.icon;
              return (
                <Link key={order.id} href={`/account/orders/${order.id}`} className="group flex items-center justify-between p-4 md:p-5 transition-colors hover:bg-[#fafafc]">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs font-bold text-[#28242b] md:text-sm bg-[#f8f7fa] px-2 py-0.5 rounded border border-[#e9e5eb]" dir="ltr">{order.trackingCode}</p>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.color}`}>
                        <StatusIcon size={12} /> {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#918a95] md:text-xs">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {formatPersianDate(order.createdAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-[#e9e5eb]"></span>
                      <span className="font-black text-[#28242b]">{formatToman(order.totalAmount)}</span>
                    </div>
                  </div>
                  <ChevronLeft size={20} className="shrink-0 text-[#c61d70] opacity-50 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}