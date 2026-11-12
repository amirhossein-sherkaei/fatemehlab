'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Loader2, Store, ShieldCheck, CreditCard, Info, Sparkles } from 'lucide-react';
import PersianDatePicker from '@/components/shared/PersianDatePicker';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [promoText, setPromoText] = useState('');
  const [promoExpiresAt, setPromoExpiresAt] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const map: Record<string, any> = {};
          data.settings.forEach((s: any) => { map[s.key] = s.value; });
          setSettings(map);
          setPromoText(map.promoBarText || '');
          if (map.promoBarExpiresAt) {
            setPromoExpiresAt(new Date(map.promoBarExpiresAt));
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...settings, 
          promoBarText: promoText, 
          promoBarExpiresAt: promoExpiresAt ? promoExpiresAt.toISOString() : null 
        }),
      });
      if (res.ok) toast.success('تنظیمات با موفقیت ذخیره شد');
      else toast.error('خطا در ذخیره تنظیمات');
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-[#77717b] flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin text-[#c61d70] mb-4" /><span>در حال بارگذاری...</span></div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24 md:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl">تنظیمات فروشگاه</h1>
          <p className="mt-1 text-xs text-[#77717b] md:text-sm">اطلاعات پایه، تجارت، امنیت و بازاریابی را اینجا مدیریت کنید.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="hidden items-center gap-2 rounded-xl bg-[#28242b] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50 md:flex">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          ذخیره تغییرات
        </button>
      </div>

      <div className="grid gap-5 md:gap-6">
        {/* General Settings */}
        <div className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-5 flex items-center gap-2 border-b border-[#e9e5eb] pb-4 text-sm font-black text-[#28242b]"><Store size={18} className="text-[#c61d70]"/> اطلاعات عمومی</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b]">نام فروشگاه</label>
              <input type="text" value={settings.siteName || ''} onChange={e => handleChange('siteName', e.target.value)} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" placeholder="مثلاً فاطمه بیوتی لند" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b]">شماره تماس</label>
              <input type="text" value={settings.phone || ''} onChange={e => handleChange('phone', e.target.value)} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-left text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" dir="ltr" placeholder="0990..." />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#28242b]">آدرس فیزیکی</label>
              <input type="text" value={settings.address || ''} onChange={e => handleChange('address', e.target.value)} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" placeholder="تهران، ..." />
            </div>
          </div>
        </div>

        {/* Commerce Settings */}
        <div className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-5 flex items-center gap-2 border-b border-[#e9e5eb] pb-4 text-sm font-black text-[#28242b]"><CreditCard size={18} className="text-[#c61d70]"/> تنظیمات تجارت</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b]">واحد پول</label>
              <select value={settings.currency || 'IRR'} onChange={e => handleChange('currency', e.target.value)} className="w-full cursor-pointer rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-sm outline-none focus:border-[#c61d70] focus:bg-white">
                <option value="IRR">ریال</option>
                <option value="IRT">تومان</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b] flex items-center gap-1">مالیات (٪) <Info size={12} className="text-[#918a95]"/></label>
              <input type="number" value={settings.taxRate || 0} onChange={e => handleChange('taxRate', Number(e.target.value))} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-left text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-5 flex items-center gap-2 border-b border-[#e9e5eb] pb-4 text-sm font-black text-[#28242b]"><ShieldCheck size={18} className="text-[#c61d70]"/> امنیت و دسترسی</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b]">وضعیت فروشگاه</label>
              <select value={settings.storeStatus || 'open'} onChange={e => handleChange('storeStatus', e.target.value)} className="w-full cursor-pointer rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-sm outline-none focus:border-[#c61d70] focus:bg-white">
                <option value="open">باز (فعال)</option>
                <option value="closed">بسته (تعمیرات)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b]">حداقل مبلغ سفارش (تومان)</label>
              <input type="number" value={settings.minOrderAmount || 0} onChange={e => handleChange('minOrderAmount', Number(e.target.value))} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-left text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Promotion Settings */}
        <div className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-5 flex items-center gap-2 border-b border-[#e9e5eb] pb-4 text-sm font-black text-[#28242b]">
            <Sparkles size={18} className="text-[#c61d70]"/> نوار تبلیغاتی بالای سایت
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#28242b]">متن نوار تبلیغاتی</label>
              <input 
                type="text" 
                value={promoText} 
                onChange={e => setPromoText(e.target.value)} 
                className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" 
                placeholder="مثلاً: ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان" 
              />
              <p className="text-[10px] text-[#77717b]">اگر خالی باشد، نوار تبلیغاتی نمایش داده نمی‌شود.</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#28242b]">تاریخ و ساعت پایان کمپین (اختیاری)</label>
              <PersianDatePicker
                value={promoExpiresAt}
                onChange={setPromoExpiresAt}
                withTime={true}
                placeholder="انتخاب تاریخ و ساعت..."
              />
              <p className="text-[10px] text-[#77717b]">اگر تنظیم شود، یک تایمر شمارش معکوس در نوار نمایش داده می‌شود و پس از آن به طور خودکار حذف می‌شود.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Save Bar */}
      <div className="fixed bottom-24 left-3 right-3 z-40 md:hidden">
        <button onClick={handleSave} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#28242b] py-3.5 text-sm font-bold text-white shadow-2xl transition-transform active:scale-[0.98] disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}