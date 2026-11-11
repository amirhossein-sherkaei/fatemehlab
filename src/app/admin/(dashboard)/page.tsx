import { Suspense } from 'react';
import { db } from '@/lib/db';
import { products, orders, orderItems, supportTickets } from '@/db/schema';
import { ShoppingBag, AlertCircle, Plus, ArrowUpRight, Activity, MessageSquare, Sparkles, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { formatToman } from '@/lib/currency';
import { desc, sql } from 'drizzle-orm';

export const instant = false;

function DashboardSkeleton() {
  return <div className="p-8 text-center text-gray-500">در حال بارگذاری داشبورد...</div>;
}

async function DashboardContent() {
  // Safe queries with fallbacks
  let allProducts: any[] = [];
  let recentOrders: any[] = [];
  let allItems: any[] = [];
  let unreadTickets: any[] = [];

  try { allProducts = await db.select().from(products); } catch (e) { console.error('products query failed', e); }
  try { recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(50); } catch (e) { console.error('orders query failed', e); }
  try { allItems = await db.select().from(orderItems); } catch (e) { console.error('orderItems query failed', e); }
  try { unreadTickets = await db.select().from(supportTickets).where(sql`${supportTickets.unreadByAdmin} > 0`).limit(3); } catch (e) { console.error('supportTickets query failed', e); }

  const totalRevenue = recentOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = recentOrders.length;
  const lowStockProducts = allProducts.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = allProducts.filter(p => p.stock === 0);

  const stats = [
    { title: 'درآمد کل', value: formatToman(totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'تعداد سفارشات', value: totalOrders.toLocaleString('fa-IR'), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'کل محصولات', value: allProducts.length.toLocaleString('fa-IR'), icon: Activity, color: 'text-[#c61d70]', bg: 'bg-[#fff0f7]' },
    { title: 'هشدار موجودی', value: (lowStockProducts.length + outOfStockProducts.length).toLocaleString('fa-IR'), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-[#28242b] flex items-center gap-2">
            داشبورد مدیریت <Sparkles size={20} className="text-[#c61d70]" />
          </h1>
          <p className="mt-1 text-xs text-[#77717b]">آمار زنده فروشگاه</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 rounded-xl bg-[#c61d70] px-5 py-2.5 text-sm font-bold text-white">
          <Plus size={18} /> محصول جدید
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-3xl border border-[#e9e5eb] bg-white p-4 shadow-sm">
              <div className={`grid h-10 w-10 place-items-center rounded-2xl ${stat.bg} ${stat.color} mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-xs font-bold text-[#77717b]">{stat.title}</p>
              <p className="mt-1 text-xl font-black text-[#28242b]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {recentOrders.length > 0 && (
        <div className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm">
          <h2 className="text-base font-black text-[#28242b] mb-4">آخرین سفارشات</h2>
          <table className="w-full text-right text-sm">
            <thead className="border-b border-[#e9e5eb] text-[#77717b]">
              <tr>
                <th className="py-3 font-medium">کد رهگیری</th>
                <th className="py-3 font-medium">مشتری</th>
                <th className="py-3 font-medium">مبلغ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e5eb]">
              {recentOrders.slice(0, 5).map((order: any) => (
                <tr key={order.id}>
                  <td className="py-3 font-mono font-bold" dir="ltr">{order.trackingCode}</td>
                  <td className="py-3 font-bold">{order.firstName} {order.lastName}</td>
                  <td className="py-3 font-bold">{formatToman(order.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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