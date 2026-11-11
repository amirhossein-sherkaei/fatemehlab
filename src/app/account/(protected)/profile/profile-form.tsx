'use client';

import { useState } from 'react';
import { User, Mail, Phone, Loader2, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export default function ProfileForm({ customer }: { customer: any }) {
  const [formData, setFormData] = useState({ name: customer.name, phone: customer.phone || '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('اطلاعات با موفقیت ذخیره شد');
        router.refresh();
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-[#28242b] flex items-center gap-2">
          <User className="text-[#c61d70]" /> پروفایل من
        </h1>
        <p className="text-sm text-[#77717b] mt-1">اطلاعات شخصی خود را ویرایش کنید</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#e9e5eb]">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-[#28242b]">{customer.name}</h2>
            <p className="text-sm text-[#77717b]" dir="ltr">{customer.email}</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold mt-2">
              <ShieldCheck size={10} /> حساب تایید شده
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-[#28242b] mb-2 block">نام و نام خانوادگی</label>
            <div className="relative">
              <User className="absolute right-4 top-3.5 w-5 h-5 text-[#918a95]" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full pr-12 pl-4 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-[#28242b] mb-2 block">ایمیل (غیرقابل تغییر)</label>
            <div className="relative">
              <Mail className="absolute right-4 top-3.5 w-5 h-5 text-[#918a95]" />
              <input
                type="email"
                value={customer.email}
                disabled
                dir="ltr"
                className="w-full pr-12 pl-4 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-base text-left text-[#918a95] cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-[#918a95] mt-1">برای تغییر ایمیل با پشتیبانی تماس بگیرید</p>
          </div>

          <div>
            <label className="text-sm font-bold text-[#28242b] mb-2 block">شماره موبایل</label>
            <div className="relative">
              <Phone className="absolute right-4 top-3.5 w-5 h-5 text-[#918a95]" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                dir="ltr"
                placeholder="09xxxxxxxxx"
                className="w-full pr-12 pl-4 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base transition-all text-left"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/30 hover:bg-[#a9155d] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </form>
      </div>
    </div>
  );
}