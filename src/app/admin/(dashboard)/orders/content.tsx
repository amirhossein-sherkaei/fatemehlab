import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Loader2, Filter, Download } from 'lucide-react';
import { formatToman } from '@/lib/currency';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


const statusMap: Record<string, { label: string, color: string, dot: string }> = {
  pending: { label: 'در انتظار', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  processing: { label: 'در حال پردازش', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  shipped: { label: 'ارسال شده', color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  delivered: { label: 'تحویل شده', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'لغو شده', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOrders = () => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => { if (data.success) setOrders(data.orders); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این سفارش مطمئن هستید؟ این عمل قابل بازگشت نیست.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('سفارش حذف شد');
        setOrders(orders.filter(o => o.id !== id));
        router.refresh();
      } else toast.error('خطا در حذف سفارش');
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setDeletingId(null); }
  };

  const filteredOrders = orders.filter(o =>
    o.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.phone.includes(searchTerm) ||
    o.firstName.includes(searchTerm)
  );

  if (loading) return <div className="p-12 text-center text-[#77717b] flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin text-[#c61d70] mb-4" /><span>در حال بارگذاری...</span></div>;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl">مدیریت سفارشات</h1>
          <p className="mt-1 text-xs text-[#77717b] md:text-sm">همه سفارشات فروشگاه را در یک نگاه ببینید و مدیریت کنید.</p>
        </div>
        <a 
          href="/api/admin/orders/export" 
          download
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Download size={16} /> دانلود اکسل (CSV)
        </a>
        <div className="px-4 py-2 bg-white rounded-xl border border-[#e9e5eb] shadow-sm flex items-center gap-2">
          <span className="text-xs text-[#77717b]">کل سفارشات:</span>
          <span className="font-black text-[#28242b]">{orders.length.toLocaleString('fa-IR')}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white shadow-sm">
        <div className="border-b border-[#e9e5eb] p-4 flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-3 h-4 w-4 text-[#918a95]" />
            <input type="text" placeholder="جستجوی کد رهگیری، نام یا موبایل..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] py-2.5 pl-4 pr-9 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" />
          </div>
          <button className="flex items-center gap-2 px-4 rounded-xl border border-[#e9e5eb] bg-white text-xs font-bold text-[#28242b] hover:bg-[#f8f7fa]">
            <Filter size={16} /> فیلتر
          </button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-[#e9e5eb] bg-[#fafafc] text-[#77717b]">
              <tr>
                <th className="px-6 py-4 font-medium">کد رهگیری</th>
                <th className="px-6 py-4 font-medium">مشتری</th>
                <th className="px-6 py-4 font-medium">تاریخ</th>
                <th className="px-6 py-4 font-medium">مبلغ</th>
                <th className="px-6 py-4 font-medium">وضعیت</th>
                <th className="px-6 py-4 text-left font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e5eb]">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-[#77717b]">سفارشی یافت نشد.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[#fafafc]">
                    <td className="px-6 py-4 font-mono font-bold text-[#28242b]" dir="ltr">{order.trackingCode}</td>
                    <td className="px-6 py-4"><span className="font-bold text-[#28242b] block">{order.firstName} {order.lastName}</span><span className="text-[10px] text-[#77717b]" dir="ltr">{order.phone}</span></td>
                    <td className="px-6 py-4 text-xs text-[#77717b]">{formatPersianDate(order.createdAt)}</td>
                    <td className="px-6 py-4 font-bold text-[#28242b]" dir="auto">{formatToman(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusMap[order.status]?.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusMap[order.status]?.dot}`} />
                        {statusMap[order.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/orders/${order.id}`} className="rounded-lg bg-[#f8f7fa] p-2 text-[#28242b] transition-colors hover:bg-[#e9e5eb]" title="مشاهده">
                          <Eye size={16} />
                        </Link>
                        <button onClick={() => handleDelete(order.id)} disabled={deletingId === order.id} className="rounded-lg bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50" title="حذف">
                          {deletingId === order.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {filteredOrders.length === 0 ? (<p className="py-10 text-center text-sm text-[#77717b]">سفارشی یافت نشد.</p>) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-[#e9e5eb] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between border-b border-[#e9e5eb] pb-3">
                  <span className="font-mono text-xs font-bold text-[#28242b]" dir="ltr">{order.trackingCode}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusMap[order.status]?.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusMap[order.status]?.dot}`} />
                    {statusMap[order.status]?.label}
                  </span>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="mb-1 block text-[10px] text-[#77717b]">مشتری</span><span className="font-bold">{order.firstName} {order.lastName}</span></div>
                  <div><span className="mb-1 block text-[10px] text-[#77717b]">مبلغ</span><span className="font-bold">{formatToman(order.totalAmount)}</span></div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/orders/${order.id}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#f8f7fa] py-2.5 text-xs font-bold text-[#28242b] border border-[#e9e5eb]"><Eye size={14} /> جزئیات</Link>
                  <button onClick={() => handleDelete(order.id)} disabled={deletingId === order.id} className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 disabled:opacity-50">{deletingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}