'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, CheckCircle2, Clock, Loader2, Package, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { formatPersianDate } from '@/lib/format';

export default function StockNotifyClient() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/stock-notify')
      .then(res => res.json())
      .then(data => { if (data.success) setNotifications(data.notifications); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = notifications.filter(n => 
    n.contact?.includes(search) || 
    n.productName?.includes(search)
  );

  const stats = {
    total: notifications.length,
    pending: notifications.filter(n => n.status === 'pending').length,
    notified: notifications.filter(n => n.status === 'notified').length,
  };

  if (loading) return <div className="p-12 text-center text-[#c61d70]"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-[#28242b] flex items-center gap-2">
          <Bell className="text-[#c61d70]" size={26} /> اعلان‌های موجودی
        </h1>
        <p className="text-sm text-[#77717b] mt-1">لیست درخواست‌های اطلاع‌رسانی برای محصولات ناموجود</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Bell size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">کل درخواست‌ها</p>
            <p className="text-2xl font-black text-[#28242b]">{stats.total.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Clock size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">در انتظار</p>
            <p className="text-2xl font-black text-[#28242b]">{stats.pending.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">اطلاع داده شده</p>
            <p className="text-2xl font-black text-[#28242b]">{stats.notified.toLocaleString('fa-IR')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو در شماره یا نام محصول..." className="w-full pr-11 pl-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70] transition-all" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e9e5eb] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#fafafc] border-b border-[#e9e5eb] text-[#77717b]">
              <tr>
                <th className="px-6 py-4 font-bold">محصول</th>
                <th className="px-6 py-4 font-bold">اطلاعات تماس</th>
                <th className="px-6 py-4 font-bold">تاریخ درخواست</th>
                <th className="px-6 py-4 font-bold">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e5eb]">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-[#77717b]">درخواستی یافت نشد.</td></tr>
              ) : (
                filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f8f7fa] border border-[#e9e5eb] flex items-center justify-center shrink-0 overflow-hidden relative">
                          {n.productImage ? (
                            <Image src={n.productImage} alt={n.productName} fill className="object-contain p-1" />
                          ) : (
                            <Package size={16} className="text-[#918a95]" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-[#28242b] block">{n.productName || 'محصول حذف شده'}</span>
                          <span className="text-[10px] text-[#77717b]">موجودی فعلی: {n.productStock}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#28242b]" dir="ltr">
                      {n.contact.startsWith('09') ? <span className="flex items-center gap-1.5 justify-end"><Phone size={12}/> {n.contact}</span> : <span className="flex items-center gap-1.5 justify-end"><Mail size={12}/> {n.contact}</span>}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#77717b]">{formatPersianDate(n.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${n.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {n.status === 'pending' ? <><Clock size={10}/> در انتظار</> : <><CheckCircle2 size={10}/> اطلاع داده شد</>}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}