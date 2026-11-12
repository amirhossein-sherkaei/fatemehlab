import { formatNumberInput, parseNumberInput } from '@/lib/format';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit, Search, Loader2, X, Check, Percent, Tag, TicketPercent, Power } from 'lucide-react';
import { toast } from 'sonner';


type Coupon = {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: Date;
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
};

export default function CouponsClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const router = useRouter();
  const [list, setList] = useState(initialCoupons);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setCode(''); setDescription(''); setType('percent'); setValue('');
    setMinOrderAmount(''); setMaxDiscountAmount(''); setUsageLimit('');
    setExpiresAt(''); setIsActive(true); setEditing(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setCode(coupon.code);
    setDescription(coupon.description || '');
    setType(coupon.type as 'percent' | 'fixed');
    setValue(String(coupon.value));
    setMinOrderAmount(String(coupon.minOrderAmount));
    setMaxDiscountAmount(coupon.maxDiscountAmount ? String(coupon.maxDiscountAmount) : '');
    setUsageLimit(coupon.usageLimit ? String(coupon.usageLimit) : '');
    setExpiresAt(coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '');
    setIsActive(coupon.isActive);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) { toast.error('کد و مقدار تخفیف الزامی است'); return; }
    setSaving(true);
    try {
      const payload = {
        code,
        description: description || null,
        type,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiresAt: expiresAt || null,
        isActive,
      };

      const url = editing ? `/api/admin/coupons/${editing.id}` : '/api/admin/coupons';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(editing ? 'کد تخفیف ویرایش شد' : 'کد تخفیف ساخته شد');
        setShowForm(false);
        resetForm();
        router.refresh();
        const listRes = await fetch('/api/admin/coupons');
        const listData = await listRes.json();
        if (listData.success) setList(listData.coupons);
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('این کد تخفیف حذف شود؟')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('کد تخفیف حذف شد');
        setList(list.filter((c) => c.id !== id));
        router.refresh();
      } else toast.error('خطا در حذف');
    } catch {
      toast.error('خطا در ارتباط');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...coupon, isActive: !coupon.isActive }),
      });
      if (res.ok) {
        setList(list.map((c) => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c));
        toast.success(coupon.isActive ? 'کد غیرفعال شد' : 'کد فعال شد');
      }
    } catch {}
  };

  const filtered = list.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: list.length,
    active: list.filter((c) => c.isActive).length,
    used: list.reduce((sum, c) => sum + c.usedCount, 0),
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl flex items-center gap-2">
            <TicketPercent className="text-[#c61d70]" size={26} />
            کدهای تخفیف
          </h1>
          <p className="text-xs text-[#77717b] md:text-sm mt-1">کمپین‌های تخفیف خود را مدیریت کنید.</p>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 rounded-xl bg-[#c61d70] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors w-full md:w-auto">
          <Plus size={18} /> کد تخفیف جدید
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#e9e5eb] bg-white p-4">
          <p className="text-[10px] font-bold text-[#77717b] mb-1">کل کدها</p>
          <p className="text-xl font-black text-[#28242b]">{stats.total.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[10px] font-bold text-emerald-700 mb-1">فعال</p>
          <p className="text-xl font-black text-emerald-800">{stats.active.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-[10px] font-bold text-blue-700 mb-1">تعداد استفاده</p>
          <p className="text-xl font-black text-blue-800">{stats.used.toLocaleString('fa-IR')}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو در کدها..." className="w-full pr-11 pl-4 py-3 bg-white border border-[#e9e5eb] rounded-2xl text-sm outline-none focus:border-[#c61d70]" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#e9e5eb] bg-white p-12 text-center">
          <TicketPercent size={48} className="mx-auto mb-4 text-[#c61d70]/30" />
          <h3 className="text-lg font-black text-[#28242b] mb-2">هنوز کد تخفیفی ندارید</h3>
          <p className="text-sm text-[#77717b] mb-6">اولین کمپین تخفیف خود را بسازید.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#c61d70] px-6 py-3 text-sm font-bold text-white hover:bg-[#a9155d]">
            <Plus size={16} /> کد تخفیف جدید
          </button>
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map((coupon) => {
            const expired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
            const exhausted = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
            return (
              <div key={coupon.id} className={`rounded-2xl border bg-white p-4 transition-all ${coupon.isActive && !expired && !exhausted ? 'border-[#e9e5eb] hover:border-[#c61d70]/30' : 'border-gray-200 opacity-70'}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono font-black text-base text-[#28242b] tracking-wider">{coupon.code}</span>
                      {!coupon.isActive && <span className="text-[9px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-bold">غیرفعال</span>}
                      {expired && <span className="text-[9px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">منقضی</span>}
                      {exhausted && <span className="text-[9px] px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">تکمیل ظرفیت</span>}
                    </div>
                    {coupon.description && <p className="text-xs text-[#77717b]">{coupon.description}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleActive(coupon)} className={`p-2 rounded-lg transition-colors ${coupon.isActive ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`} title={coupon.isActive ? 'غیرفعال کردن' : 'فعال کردن'}>
                      <Power size={14} />
                    </button>
                    <button onClick={() => openEdit(coupon)} className="p-2 rounded-lg bg-[#f8f7fa] text-[#28242b] hover:bg-[#e9e5eb]" title="ویرایش">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(coupon.id)} disabled={deletingId === coupon.id} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50" title="حذف">
                      {deletingId === coupon.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#e9e5eb]">
                  <div>
                    <p className="text-[10px] text-[#918a95] mb-1">مقدار تخفیف</p>
                    <p className="text-xs font-bold text-[#c61d70]">
                      {coupon.type === 'percent' ? `${coupon.value}٪` : `${coupon.value.toLocaleString('fa-IR')} ریال`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#918a95] mb-1">حداقل سفارش</p>
                    <p className="text-xs font-bold text-[#28242b]">{coupon.minOrderAmount > 0 ? `${coupon.minOrderAmount.toLocaleString('fa-IR')} ریال` : 'ندارد'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#918a95] mb-1">استفاده</p>
                    <p className="text-xs font-bold text-[#28242b]">{coupon.usedCount.toLocaleString('fa-IR')} {coupon.usageLimit ? `/ ${coupon.usageLimit.toLocaleString('fa-IR')}` : ''}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#918a95] mb-1">انقضا</p>
                    <p className="text-xs font-bold text-[#28242b]">{coupon.expiresAt ? formatPersianDate(coupon.expiresAt) : 'ندارد'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#e9e5eb]">
              <h3 className="text-lg font-black text-[#28242b]">{editing ? 'ویرایش کد تخفیف' : 'کد تخفیف جدید'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-[#77717b] hover:bg-[#f8f7fa]"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">کد تخفیف *</label>
                  <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))} placeholder="مثلاً SALE20" disabled={!!editing} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm font-mono outline-none focus:border-[#c61d70] disabled:opacity-60" dir="ltr" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">توضیحات</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="مثلاً تخفیف آخر هفته" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setType('percent')} className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${type === 'percent' ? 'bg-[#c61d70] text-white shadow-lg shadow-[#c61d70]/20' : 'bg-[#f8f7fa] text-[#77717b] border border-[#e9e5eb]'}`}>
                  <Percent size={16} /> تخفیف درصدی
                </button>
                <button type="button" onClick={() => setType('fixed')} className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${type === 'fixed' ? 'bg-[#c61d70] text-white shadow-lg shadow-[#c61d70]/20' : 'bg-[#f8f7fa] text-[#77717b] border border-[#e9e5eb]'}`}>
                  <Tag size={16} /> تخفیف مبلغ ثابت
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">{type === 'percent' ? 'درصد تخفیف *' : 'مبلغ تخفیف (ریال) *'}</label>
                  <input type="text" value={formatNumberInput(value)} onChange={(e) => setValue(parseNumberInput(e.target.value).toString())} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" dir="ltr" required />
                </div>
                {type === 'percent' && (
                  <div>
                    <label className="block text-xs font-bold text-[#28242b] mb-2">سقف تخفیف (ریال) - اختیاری</label>
                    <input type="text" value={formatNumberInput(maxDiscountAmount)} onChange={(e) => setMaxDiscountAmount(parseNumberInput(e.target.value).toString())} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" dir="ltr" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">حداقل مبلغ سفارش (ریال)</label>
                  <input type="text" value={formatNumberInput(minOrderAmount)} onChange={(e) => setMinOrderAmount(parseNumberInput(e.target.value).toString())} placeholder="0" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">سقف تعداد استفاده</label>
                  <input type="text" value={formatNumberInput(usageLimit)} onChange={(e) => setUsageLimit(parseNumberInput(e.target.value).toString())} placeholder="نامحدود" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" dir="ltr" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#28242b] mb-2">تاریخ انقضا - اختیاری</label>
                <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" dir="ltr" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#c61d70]" />
                <span className="text-sm font-bold text-[#28242b]">این کد از همان ابتدا فعال باشد</span>
              </label>

              <div className="flex gap-2 pt-4 border-t border-[#e9e5eb]">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-[#f8f7fa] text-[#28242b] text-sm font-bold rounded-xl">انصراف</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {saving ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}