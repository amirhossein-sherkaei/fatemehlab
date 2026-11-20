'use client';
import { formatPersianDate } from '@/lib/format';

import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, Loader2, Download, ChevronDown, RefreshCw } from 'lucide-react';
import { formatToman } from '@/lib/currency';
import Link from 'next/link';
import { toast } from 'sonner';


const statusMap: Record<string, { label: string, color: string, dot: string }> = {
  pending: { label: 'در انتظار پرداخت', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  paid: { label: 'پرداخت شده', color: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  processing: { label: 'در حال پردازش', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  shipped: { label: 'ارسال شده', color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  delivered: { label: 'تحویل شده', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'لغو شده', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 40, total: 0, totalPages: 1 });

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), search: searchTerm.trim(), status: statusFilter });
    fetch(`/api/admin/orders?${params.toString()}`, { cache: 'no-store', credentials: 'same-origin' })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.success) throw new Error(data.message || 'دریافت سفارش‌ها ناموفق بود.');
        setOrders(Array.isArray(data.orders) ? data.orders : []);
        if (data.pagination) setPagination(data.pagination);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : 'خطا در دریافت سفارش‌ها'))
      .finally(() => setLoading(false));
  }, [page, searchTerm, statusFilter]);

  useEffect(() => {
    const timer = window.setTimeout(fetchOrders, 220);
    return () => window.clearTimeout(timer);
  }, [fetchOrders]);

  const filteredOrders = orders;

  if (loading) return <div className="p-12 text-center text-[#77717b] flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin text-[#c61d70] mb-4" /><span>در حال بارگذاری...</span></div>;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl">مدیریت سفارشات</h1>
          <p className="mt-1 text-xs text-[#77717b] md:text-sm">وضعیت مالی و عملیاتی سفارش‌ها را بررسی کنید؛ سوابق مالی از این صفحه حذف نمی‌شوند.</p>
        </div>
        <a
          href="/api/admin/orders/export"
          download
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Download size={16} /> دانلود اکسل (CSV)
        </a>
        <div className="px-4 py-2 bg-white rounded-xl border border-[#e9e5eb] shadow-sm flex items-center gap-2">
          <span className="text-xs text-[#77717b]">نتایج:</span>
          <span className="font-black text-[#28242b]">{pagination.total.toLocaleString('fa-IR')}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white shadow-sm">
        <div className="border-b border-[#e9e5eb] p-4 flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-3 h-4 w-4 text-[#918a95]" />
            <input type="text" placeholder="جستجوی کد رهگیری، نام یا موبایل..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] py-2.5 pl-4 pr-9 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" />
          </div>
          <label className="relative flex min-w-40 items-center gap-2 rounded-xl border border-[#e9e5eb] bg-white px-3 text-xs font-bold text-[#28242b]">
            <span className="sr-only">فیلتر وضعیت سفارش</span>
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }} className="min-h-10 w-full appearance-none bg-transparent pl-5 outline-none">
              <option value="all">همه وضعیت‌ها</option>
              <option value="pending">در انتظار پرداخت</option>
              <option value="paid">پرداخت تأیید شده</option>
              <option value="processing">در حال پردازش</option>
              <option value="shipped">ارسال شده</option>
              <option value="delivered">تحویل شده</option>
              <option value="cancelled">لغو شده</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute left-3 text-[#918a95]" />
          </label>
          <button type="button" onClick={fetchOrders} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#e9e5eb] bg-white px-3 text-xs font-bold text-[#28242b] hover:bg-[#f8f7fa]" title="به‌روزرسانی فهرست">
            <RefreshCw size={15} /> <span className="hidden sm:inline">به‌روزرسانی</span>
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
                        {order.status === 'paid' && order.totalAmount === 0 ? 'تکمیل‌شده بدون پرداخت آنلاین' : statusMap[order.status]?.label || 'وضعیت نامشخص'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/orders/${order.id}`} className="rounded-lg bg-[#f8f7fa] p-2 text-[#28242b] transition-colors hover:bg-[#e9e5eb]" title="مشاهده">
                          <Eye size={16} />
                        </Link>

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
                    {order.status === 'paid' && order.totalAmount === 0 ? 'تکمیل‌شده بدون پرداخت آنلاین' : statusMap[order.status]?.label || 'وضعیت نامشخص'}
                  </span>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="mb-1 block text-[10px] text-[#77717b]">مشتری</span><span className="font-bold">{order.firstName} {order.lastName}</span></div>
                  <div><span className="mb-1 block text-[10px] text-[#77717b]">مبلغ</span><span className="font-bold">{formatToman(order.totalAmount)}</span></div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/orders/${order.id}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#f8f7fa] py-2.5 text-xs font-bold text-[#28242b] border border-[#e9e5eb]"><Eye size={14} /> جزئیات</Link>

                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex flex-col gap-3 border-t border-[#e9e5eb] bg-[#fcfbfc] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-[#77717b]">صفحه {pagination.page.toLocaleString('fa-IR')} از {pagination.totalPages.toLocaleString('fa-IR')} · {pagination.total.toLocaleString('fa-IR')} سفارش</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1 || loading} className="min-h-9 rounded-lg border border-[#e9e5eb] bg-white px-4 text-xs font-bold text-[#4b414b] disabled:cursor-not-allowed disabled:opacity-40">قبلی</button>
            <button type="button" onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))} disabled={page >= pagination.totalPages || loading} className="min-h-9 rounded-lg border border-[#e9e5eb] bg-white px-4 text-xs font-bold text-[#4b414b] disabled:cursor-not-allowed disabled:opacity-40">بعدی</button>
          </div>
        </div>
      </div>
    </div>
  );
}