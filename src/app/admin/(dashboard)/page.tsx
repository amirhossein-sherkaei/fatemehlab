import { Suspense } from 'react';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { ShoppingBag, AlertCircle, Plus, Activity, DollarSign, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatToman } from '@/lib/currency';
import { desc, eq, sql } from 'drizzle-orm';
import ChartsClientWrapper from '@/components/admin/ChartsClientWrapper';

export const instant = false;

function DashboardSkeleton() {
  return <div className="p-8 text-center text-[#77717b] animate-pulse">در حال بارگذاری داشبورد...</div>;
}

async function DashboardContent() {
  let allProducts: any[] = [];
  let recentOrders: any[] = [];
  let topItems: any[] = [];

  try { allProducts = await db.select().from(products); } catch (e) {}
  try { recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(50); } catch (e) {}
  
  // محاسبه KPI ها
  const validOrders = recentOrders.filter(o => o.status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
  const lowStockProducts = allProducts.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = allProducts.filter(p => p.stock === 0);

  // داده‌های نمودار
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
      fullDate: d.toISOString().split('T')[0],
      revenue: 0,
      orders: 0
    };
  });
  validOrders.forEach(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const dayData = last7Days.find(d => d.fullDate === orderDate);
    if (dayData) {
      dayData.revenue += order.totalAmount;
      dayData.orders += 1;
    }
  });

  // پرفروش‌ترین‌ها
  try {
    topItems = await db
      .select({
        productId: orderItems.productId,
        name: orderItems.productName,
        totalSold: sql<number>`sum(${orderItems.quantity})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(sql`${orders.status} != 'cancelled'`)
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(5);
  } catch (e) {}

  const stats = [
    { title: 'درآمد کل', value: formatToman(totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'میانگین سبد', value: formatToman(avgOrderValue), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'تعداد سفارشات', value: validOrders.length.toLocaleString('fa-IR'), icon: ShoppingBag, color: 'text-[#c61d70]', bg: 'bg-[#fff0f7]' },
    { title: 'هشدار موجودی', value: (lowStockProducts.length + outOfStockProducts.length).toLocaleString('fa-IR'), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#28242b] flex items-center gap-2">
            تحلیل داده‌های فروشگاه <Activity size={22} className="text-[#c61d70]" />
          </h1>
          <p className="mt-1 text-xs text-[#77717b]">نمای کلی از عملکرد مالی و سفارشات شما</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 rounded-xl bg-[#c61d70] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors">
          <Plus size={18} /> محصول جدید
        </Link>
      </div>

      {/* کارت‌های KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-3xl border border-[#e9e5eb] bg-white/70 backdrop-blur-md p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className={`grid h-10 w-10 md:h-12 md:w-12 place-items-center rounded-2xl ${stat.bg} ${stat.color} mb-3`}>
                <Icon size={22} className="md:w-6 md:h-6" />
              </div>
              <p className="text-[11px] md:text-xs font-bold text-[#77717b]">{stat.title}</p>
              <p className="mt-1 text-lg md:text-xl font-black text-[#28242b]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* نمودارها */}
      <ChartsClientWrapper data={last7Days} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* پرفروش‌ترین محصولات */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm">
          <h3 className="text-sm font-black text-[#28242b] mb-4 flex items-center gap-2">
            <ArrowUpRight size={16} className="text-emerald-500" /> ۵ محصول پرفروش
          </h3>
          <div className="space-y-3">
            {topItems.length === 0 ? (
              <p className="text-xs text-[#77717b] text-center py-4">داده‌ای موجود نیست.</p>
            ) : (
              topItems.map((item, i) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center bg-[#fafafc] border border-[#e9e5eb] rounded-md text-[10px] font-bold text-[#77717b]">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#28242b] truncate">{item.name}</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{item.totalSold} عدد</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* آخرین سفارشات */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e9e5eb] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-[#28242b] flex items-center gap-2">
              <Clock size={16} className="text-[#c61d70]" /> آخرین سفارشات
            </h3>
            <Link href="/admin/orders" className="text-[10px] font-bold text-[#c61d70] hover:underline">مشاهده همه</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="text-[#77717b] border-b border-[#e9e5eb]">
                <tr>
                  <th className="pb-3 font-medium">مشتری</th>
                  <th className="pb-3 font-medium">کد رهگیری</th>
                  <th className="pb-3 font-medium">مبلغ</th>
                  <th className="pb-3 font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f0f2]">
                {validOrders.slice(0, 4).map((order: any) => (
                  <tr key={order.id} className="hover:bg-[#fafafc]">
                    <td className="py-3 font-bold text-[#28242b]">{order.firstName} {order.lastName}</td>
                    <td className="py-3 font-mono text-[#77717b]" dir="ltr">{order.trackingCode}</td>
                    <td className="py-3 font-bold">{formatToman(order.totalAmount)}</td>
                    <td className="py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">پردازش</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
    </AdminGuard>
  );
}
