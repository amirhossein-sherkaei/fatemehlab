'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Search, Clock, CheckCircle2, ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';
import { formatPersianDate } from '@/lib/format';

const CATEGORIES: Record<string, string> = { order: 'سفارش', product: 'محصول', payment: 'پرداخت', other: 'سایر' };
const STATUS: Record<string, { label: string; cls: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200' },
};

export default function AdminSupportClient() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'answered' | 'closed'>('all');

  useEffect(() => {
    fetch('/api/admin/support')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => { 
        if (data.success) setTickets(data.tickets); 
        else setError(data.message || 'خطا');
      })
      .catch((err) => setError(err.message || 'دسترسی غیرمجاز'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter((t) => {
    if (filter !== 'all' && t.ticket.status !== filter) return false;
    if (search && !t.ticket.subject.toLowerCase().includes(search.toLowerCase()) && !t.customerName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.ticket.status === 'open').length,
    answered: tickets.filter((t) => t.ticket.status === 'answered').length,
    unread: tickets.filter((t) => t.ticket.unreadByAdmin > 0).length,
  };

  if (loading) return <div className="p-12 text-center text-[#c61d70]"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" /><p className="text-sm">در حال بارگذاری تیکت‌ها...</p></div>;

  if (error) return (
    <div className="p-12 text-center">
      <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
      <p className="text-sm text-rose-600">{error}</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-black text-[#28242b] md:text-2xl">
          <MessageCircle className="text-[#c61d70]" size={26} /> مدیریت پشتیبانی
        </h1>
        <p className="mt-1 text-xs text-[#77717b] md:text-sm">تیکت‌های کاربران را ببینید و پاسخ دهید.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[#e9e5eb] bg-white p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-[#77717b]">کل تیکت‌ها</span><MessageCircle size={16} className="text-[#c61d70]" /></div>
          <p className="text-xl font-black text-[#28242b]">{stats.total.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-blue-700">باز</span><Clock size={16} className="text-blue-600" /></div>
          <p className="text-xl font-black text-blue-800">{stats.open.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-emerald-700">پاسخ داده شده</span><CheckCircle2 size={16} className="text-emerald-600" /></div>
          <p className="text-xl font-black text-emerald-800">{stats.answered.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-amber-700">پیام جدید</span><AlertCircle size={16} className="text-amber-600" /></div>
          <p className="text-xl font-black text-amber-800">{stats.unread.toLocaleString('fa-IR')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو..." className="w-full pr-11 pl-4 py-3 bg-white border border-[#e9e5eb] rounded-2xl text-sm outline-none focus:border-[#c61d70] transition-all" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {[{ k: 'all' as const, label: 'همه' }, { k: 'open' as const, label: 'باز' }, { k: 'answered' as const, label: 'پاسخ داده' }, { k: 'closed' as const, label: 'بسته' }].map((f) => (
            <button key={f.k} onClick={() => setFilter(f.k)} className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === f.k ? 'bg-[#c61d70] text-white shadow-lg shadow-[#c61d70]/20' : 'bg-white text-[#77717b] border border-[#e9e5eb]'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#e9e5eb] bg-white p-12 text-center">
          <MessageCircle size={48} className="mx-auto mb-4 text-[#c61d70]/30" />
          <h3 className="text-lg font-black text-[#28242b] mb-2">تیکتی یافت نشد</h3>
          <p className="text-sm text-[#77717b]">هنوز هیچ تیکتی ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map(({ ticket, customerName, customerEmail }) => {
            const status = STATUS[ticket.status] || STATUS.open;
            return (
              <Link key={ticket.id} href={`/admin/support/${ticket.id}`} className="group rounded-2xl border border-[#e9e5eb] bg-white p-4 hover:border-[#c61d70]/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-black text-sm text-[#28242b] truncate">{ticket.subject}</h3>
                      {ticket.unreadByAdmin > 0 && (
                        <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-[#c61d70] text-white text-[10px] font-black animate-pulse">{ticket.unreadByAdmin.toLocaleString('fa-IR')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#77717b]">
                      <span className="font-bold">{customerName || 'کاربر'}</span>
                      {customerEmail && <><span>·</span><span className="truncate" dir="ltr">{customerEmail}</span></>}
                    </div>
                  </div>
                  <ChevronLeft size={18} className="shrink-0 text-[#c61d70] opacity-50 group-hover:opacity-100" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold ${status.cls}`}>{status.label}</span>
                  <span className="inline-flex items-center rounded-full bg-[#f8f7fa] border border-[#e9e5eb] px-2 py-0.5 text-[9px] font-bold text-[#77717b]">{CATEGORIES[ticket.category] || ticket.category}</span>
                  <span className="text-[9px] text-[#918a95]">{formatPersianDate(ticket.lastMessageAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}