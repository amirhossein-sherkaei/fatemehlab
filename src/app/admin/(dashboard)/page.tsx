import { Suspense } from 'react';
import { db } from '@/lib/db';
import { products, orders, orderItems, supportTickets } from '@/db/schema';
import { ShoppingBag, AlertCircle, Plus, ArrowUpRight, Activity, MessageSquare, Sparkles, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { formatToman } from '@/lib/currency';
import { desc, sql } from 'drizzle-orm';

export const instant = false;

function DashboardSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8 pb-8 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-3xl"></div>)}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const allProducts = await db.select().from(products);
  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(50);
  const allItems = await db.select().from(orderItems);
  const unreadTickets = await db.select().from(supportTickets).where(sql`${supportTickets.unreadByAdmin} > 0`).orderBy(desc(supportTickets.lastMessageAt)).limit(3);

  const totalRevenue = recentOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = recentOrders.length;
  const lowStockProducts = allProducts.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = allProducts.filter(p => p.stock === 0);

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  const chartData = last7Days.map(date => {
    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));
    const dayOrders = recentOrders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= dayStart && orderDate <= dayEnd && o.status !== 'cancelled';
    });
    const revenue = dayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    return { date: dayStart.toLocaleDateString('fa-IR', { weekday: 'short' }), revenue };
  });

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  const productSales: Record<string, { name: string; count: number }> = {};
  allItems.forEach(item => {
    if (!productSales[item.productId]) productSales[item.productId] = { name: item.productName, count: 0 };
    productSales[item.productId].count += item.quantity;
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.count - a.count).slice(0, 5);

  const stats = [
    { title: 'درآمد کل', value: formatToman(totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'تعداد سفارشات', value: totalOrders.toLocaleString('fa-IR'), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'کل محصولات', value: allProducts.length.toLocaleString('fa-IR'), icon: Activity, color: 'text-[#c61d70]', bg: 'bg-[#fff0f7]' },
    { title: 'هشدار موجودی', value: (lowStockProducts.length + outOfStockProducts.length).toLocaleString('fa-IR'), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl flex items-center gap-2">
            داشبورد مدیریت <Sparkles size={20} className="text-[#c61d70]" />
          </h1>
          <p className="mt-1 text-xs text-[#77717b] md:text-sm">آمار زنده و لحظه‌ای فروشگاه شما</p>
        </div>
        <Link href="/admin/products/new" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#c61d70] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/20 transition-transform hover:-translate-y-0.5">
          <Plus size={18} /> محصول جدید
        </Link>
      </div>

      {unreadTickets.length > 0 && (
        <div className="rounded-3xl border border-[#c61d70]/20 bg-gradient-to-br from-[#fff0f7] to-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-[#28242b] flex items-center gap-2">
              <MessageSquare size={18} className="text-[#c61d70]" /> پیام‌های پشتیبانی
            </h2>
            <Link href="/admin/support" className="text-xs font-bold text-[#c61d70] bg-white px-3 py-1.5 rounded-lg border border-[#f2d7e5] hover:bg-[#fff0f7]">مشاهده همه</Link>
          </div>
          <div className="space-y-2">
            {unreadTickets.map(t => (
              <Link key={t.id} href={`/admin/support/${t.id}`} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-[#f2d7e5] hover:border-[#c61d70]/40 transition-colors">
                <span className="text-xs font-bold text-[#28242b] truncate">{t.subject}</span>
                <span className="text-[10px] font-black text-white bg-[#c61d70] px-2 py-0.5 rounded-full shrink-0">
                  {t.unreadByAdmin.toLocaleString('fa-IR')} پیام
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="group relative overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white p-4 shadow-sm md:p-5 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="mb-4 flex items-center justify-between">
                <div className={`grid h-10 w-10 place-items-center rounded-2xl ${stat.bg} ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="text-[11px] font-bold text-[#77717b] md:text-xs">{stat.title}</p>
              <p className="mt-1 text-xl font-black text-[#28242b] md:text-2xl" dir="auto">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-[#e9e5eb] bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-[#28242b]">نمودار فروش ۷ روز اخیر</h2>
              <p className="text-xs text-[#77717b] mt-1">درآمد بر اساس روز (تومان)</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              <TrendingUp size={12} /> زنده
            </span>
          </div>
          <div className="flex items-end justify-between gap-2 h-48 pt-4">
            {chartData.map((day, idx) => {
              const heightPercent = (day.revenue / maxRevenue) * 100;
              return (
                <div key={idx} className="flex flex-col items-center flex-1 group">
                  <div className="relative w-full flex justify-center h-full items-end pb-2">
                    <div className="absolute -top-10 bg-[#28242b] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                      {day.revenue.toLocaleString('fa-IR')} تومان
                    </div>
                    <div className="w-full max-w-[40px] bg-gradient-to-t from-[#c61d70]/20 to-[#c61d70] rounded-t-lg transition-all duration-500 group-hover:from-[#c61d70]/40 group-hover:to-[#e84e9e]" style={{ height: `${Math.max(heightPercent, 2)}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-[#918a95] mt-2">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-[#e9e5eb] bg-white p-6 shadow-sm flex flex-col">
          <h2 className="text-base font-black text-[#28242b] mb-4 flex items-center gap-2">
            <Activity size={18} className="text-[#c61d70]" /> پرفروش‌ترین محصولات
          </h2>
          <div className="space-y-3 flex-1">
            {topProducts.length === 0 ? (
              <p className="text-xs text-[#77717b] text-center py-8">هنوز فروشی ثبت نشده</p>
            ) : (
              topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#f8f7fa] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#fff0f7] text-[#c61d70] flex items-center justify-center font-black text-xs shrink-0">{idx + 1}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#28242b] truncate">{p.name}</p>
                  </div>
                  <div className="text-[10px] font-black text-[#c61d70] bg-[#fff0f7] px-2 py-0.5 rounded-md shrink-0">{p.count.toLocaleString('fa-IR')} عدد</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <h2 className="text-sm font-black text-amber-800 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} /> هشدار موجودی انبار
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {outOfStockProducts.map(p => (
              <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-rose-200 hover:border-rose-300 transition-colors">
                <span className="text-xs font-bold text-[#28242b] truncate">{p.name}</span>
                <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded shrink-0">ناموجود</span>
              </Link>
            ))}
            {lowStockProducts.map(p => (
              <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-200 hover:border-amber-300 transition-colors">
                <span className="text-xs font-bold text-[#28242b] truncate">{p.name}</span>
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded shrink-0">{p.stock.toLocaleString('fa-IR')} عدد باقی‌مانده</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e9e5eb] p-5 md:p-6">
          <h2 className="text-base font-black text-[#28242b] md:text-lg">آخرین سفارشات</h2>
          <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-bold text-[#c61d70] hover:underline bg-[#fff0f7] px-3 py-1.5 rounded-lg">مشاهده همه <ArrowUpRight size={14} /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#fafafc] text-[#77717b] border-b border-[#e9e5eb]">
              <tr>
                <th className="px-6 py-4 font-medium">کد رهگیری</th>
                <th className="px-6 py-4 font-medium">مشتری</th>
                <th className="px-6 py-4 font-medium">مبلغ</th>
                <th className="px-6 py-4 font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e5eb]">
              {recentOrders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-[#fafafc] transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-[#28242b]" dir="ltr">{order.trackingCode}</td>
                  <td className="px-6 py-4 font-bold text-[#28242b]">{order.firstName} {order.lastName}</td>
                  <td className="px-6 py-4 font-bold text-[#28242b]" dir="auto">{formatToman(order.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border ${
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      order.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {order.status === 'delivered' ? 'تحویل شده' : order.status === 'shipped' ? 'ارسال شده' : order.status === 'processing' ? 'در حال پردازش' : order.status === 'cancelled' ? 'لغو شده' : 'در انتظار'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}