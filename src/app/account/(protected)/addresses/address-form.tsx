'use client';

import { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';


const PROVINCES = ['تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'البرز', 'آذربایجان شرقی', 'آذربایجان غربی', 'خوزستان', 'گیلان', 'مازندران', 'کرمان', 'یزد', 'قم', 'قزوین', 'مرکزی', 'همدان', 'کرمانشاه', 'گلستان', 'سیستان و بلوچستان', 'هرمزگان', 'بوشهر', 'اردبیل', 'زنجان', 'سمنان', 'کردستان', 'لرستان', 'چهارمحال و بختیاری', 'کهگیلویه و بویراحمد', 'ایلام', 'خراسان شمالی', 'خراسان جنوبی'];

export default function AddressForm({ initialData, onClose, onSuccess }: { initialData: any, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phone: initialData?.phone || '',
    province: initialData?.province || 'تهران',
    city: initialData?.city || '',
    address: initialData?.address || '',
    postalCode: initialData?.postalCode || '',
    isDefault: initialData?.isDefault || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData ? `/api/account/addresses/${initialData.id}` : '/api/account/addresses';
      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(initialData ? 'آدرس ویرایش شد' : 'آدرس افزوده شد');
        onSuccess();
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-[#e9e5eb]">
          <h3 className="font-black text-lg">{initialData ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}</h3>
          <button onClick={onClose} className="p-2 text-[#77717b] hover:bg-[#f8f7fa] rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#28242b] mb-1.5 block">عنوان آدرس (مثلاً خانه، محل کار) *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#28242b] mb-1.5 block">نام *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#28242b] mb-1.5 block">نام خانوادگی *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#28242b] mb-1.5 block">شماره موبایل *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required dir="ltr" className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm text-left" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#28242b] mb-1.5 block">استان *</label>
              <select name="province" value={formData.province} onChange={handleChange} className="w-full px-3 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm cursor-pointer">
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#28242b] mb-1.5 block">شهر *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#28242b] mb-1.5 block">آدرس کامل *</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required rows={3} className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm resize-none"></textarea>
          </div>
          <div>
            <label className="text-xs font-bold text-[#28242b] mb-1.5 block">کد پستی *</label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required dir="ltr" maxLength={10} className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm text-left" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} className="w-4 h-4 accent-[#c61d70]" />
            <span className="text-xs font-bold text-[#28242b]">این آدرس پیش‌فرض من باشد</span>
          </label>
          <div className="flex gap-2 pt-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-[#77717b] hover:bg-[#f8f7fa] rounded-xl">انصراف</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}