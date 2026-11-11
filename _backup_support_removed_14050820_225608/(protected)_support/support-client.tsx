'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, Plus, Search, Clock, CheckCircle2, X, Loader2, ChevronLeft, Send } from 'lucide-react';
import { toast } from 'sonner';


const CATEGORIES: Record<string, string> = { order: 'سفارش', product: 'محصول', payment: 'پرداخت', other: 'سایر' };
const STATUS: Record<string, { label: string; cls: string; icon: any }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200', icon: X },
};

function timeAgo(date: Date | string) {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'همین الان';
  if (mins < 60) return `${mins} دقیقه پیش`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ساعت پیش`;
  return `${Math.floor(hours / 24)} روز پیش`;
}

export default function SupportClient({ tickets, customerName }: { tickets: any[]; customerName: string }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('order');
  const [newMessage, setNewMessage] = useState('');
  const [creating, setCreating] = useState(false);

  const filtered = tickets.filter((t) => t.subject.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async () => {
    if (newSubject.length < 5) { toast.error('موضوع حداقل ۵ حرف'); return; }
    if (newMessage.length < 10) { toast.error('پیام حداقل ۱۰ حرف'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: newSubject, category: newCategory, message: newMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('تیکت ایجاد شد');
        router.push(`/account/support/${data.ticket.id}`);
      } else toast.error(data.message || 'خطا');
    } catch { toast.error('خطا'); }
    finally { setCreating(false); }
  };

  return (
    <div className="space-y-5 pb-8">
      <div className="relative overflow-hidden rounded-3xl border border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-[#f8f7fa] p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-black text-[#28242b] md:text-2xl">
              <MessageCircle className="text-[#c61d70]" size={26} /> پشتیبانی
            </h1>
            <p className="text-xs text-[#77717b] md:text-sm mt-2">سلام {customerName}! چطور می‌توانیم کمکتان کنیم؟</p>
          </div>
          <button onClick={() => setShowNew(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c61d70] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors w-full md:w-auto">
            <Plus size={18} /> تیکت جدید
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو در تیکت‌ها..." className="w-full pr-11 pl-4 py-3.5 bg-white border border-[#e9e5eb] rounded-2xl text-sm outline-none focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 transition-all" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#e9e5eb] bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f7]">
            <MessageCircle size={36} className="text-[#c61d70]/50" />
          </div>
          <h3 className="text-lg font-black text-[#28242b] mb-2">{tickets.length === 0 ? 'هنوز تیکتی ندارید' : 'تیکتی یافت نشد'}</h3>
          <p className="text-sm text-[#77717b] mb-6">{tickets.length === 0 ? 'سوالی دارید؟ روی «تیکت جدید» کلیک کنید.' : 'عبارت جستجو را تغییر دهید.'}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((ticket) => {
            const status = STATUS[ticket.status] || STATUS.open;
            const StatusIcon = status.icon;
            return (
              <Link key={ticket.id} href={`/account/support/${ticket.id}`} className="group rounded-2xl border border-[#e9e5eb] bg-white p-4 hover:border-[#c61d70]/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-black text-sm md:text-base text-[#28242b] truncate">{ticket.subject}</h3>
                      {ticket.unreadByCustomer > 0 && (
                        <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-[#c61d70] text-white text-[10px] font-black">{ticket.unreadByCustomer.toLocaleString('fa-IR')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${status.cls}`}><StatusIcon size={10} /> {status.label}</span>
                      <span className="inline-flex items-center rounded-full bg-[#f8f7fa] border border-[#e9e5eb] px-2 py-0.5 text-[10px] font-bold text-[#77717b]">{CATEGORIES[ticket.category] || ticket.category}</span>
                    </div>
                  </div>
                  <ChevronLeft size={18} className="shrink-0 text-[#c61d70] opacity-50 group-hover:opacity-100" />
                </div>
                <div className="text-[10px] text-[#918a95] flex items-center gap-2"><Clock size={11} /> آخرین پیام: {timeAgo(ticket.lastMessageAt)}</div>
              </Link>
            );
          })}
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowNew(false)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#e9e5eb]">
              <h3 className="text-lg font-black text-[#28242b]">تیکت جدید</h3>
              <button onClick={() => setShowNew(false)} className="p-1.5 rounded-lg text-[#77717b] hover:bg-[#f8f7fa]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#28242b] mb-2">موضوع</label>
                <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="مثلاً: پیگیری سفارش FL-A1B2C3" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70] focus:bg-white transition-all" maxLength={200} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#28242b] mb-2">دسته‌بندی</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CATEGORIES).map(([key, val]) => (
                    <button key={key} type="button" onClick={() => setNewCategory(key)} className={`py-2.5 rounded-xl text-xs font-bold transition-all ${newCategory === key ? 'bg-[#c61d70] text-white shadow-lg shadow-[#c61d70]/20' : 'bg-[#f8f7fa] text-[#77717b] border border-[#e9e5eb]'}`}>{val}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#28242b] mb-2">توضیحات</label>
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="جزئیات مشکل یا سوال خود را بنویسید..." rows={5} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70] focus:bg-white resize-none transition-all" maxLength={2000} />
              </div>
              <button onClick={handleCreate} disabled={creating} className="w-full py-3.5 bg-[#c61d70] text-white text-sm font-black rounded-xl shadow-lg shadow-[#c61d70]/25 hover:bg-[#a9155d] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {creating ? <><Loader2 size={16} className="animate-spin" /> در حال ارسال...</> : <><Send size={16} /> ارسال تیکت</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}