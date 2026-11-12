'use client';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';

import { useState, useEffect } from 'react';
import { Search, Users, ShoppingBag, DollarSign, Loader2, Mail, Phone, Calendar } from 'lucide-react';
import { formatToman } from '@/lib/currency';
import Image from 'next/image';

export default function CustomersClient() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => res.json())
      .then(data => { if (data.success) setCustomers(data.customers); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  // محاسبه آمار کلی
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.totalOrders > 0).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  if (loading) return <div className="p-12 text-center text-[#c61d70]"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#28242b] flex items-center gap-2">
            <Users className="text-[#c61d70]" size={26} /> مدیریت مشتریان (CRM)
          </h1>
          <p className="text-sm text-[#77717b] mt-1">لیست تمام کاربران ثبت‌نام شده و آمار خرید آن‌ها</p>
        </div>
      </div>

      {/* کارت‌های آماری بالا */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Users size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">کل مشتریان</p>
            <p className="text-2xl font-black text-[#28242b]">{totalCustomers.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">مشتریان فعال (خریدار)</p>
            <p className="text-2xl font-black text-[#28242b]">{activeCustomers.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fff0f7] text-[#c61d70] flex items-center justify-center shrink-0"><DollarSign size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">ارزش کل مشتریان (LTV)</p>
            <p className="text-xl font-black text-[#28242b]">{formatToman(totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* نوار جستجو */}
      <div className="bg-white rounded-2xl border border-[#e9e5eb] p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="جستجو بر اساس نام، ایمیل یا شماره موبایل..." 
            className="w-full pr-11 pl-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70] focus:bg-white transition-all" 
          />
        </div>
      </div>

      {/* لیست مشتریان */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#fafafc] border-b border-[#e9e5eb] text-[#77717b]">
              <tr>
                <th className="px-6 py-4 font-bold">مشتری</th>
                <th className="px-6 py-4 font-bold">اطلاعات تماس</th>
                <th className="px-6 py-4 font-bold text-center">تعداد سفارش</th>
                <th className="px-6 py-4 font-bold">مجموع خرید</th>
                <th className="px-6 py-4 font-bold">تاریخ عضویت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e5eb]">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-[#77717b]">مشتری یافت نشد.</td></tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] text-[#c61d70] flex items-center justify-center font-black shrink-0 overflow-hidden">
                          {customer.avatar ? (
                            <Image src={customer.avatar} alt={customer.name} width={40} height={40} className="w-full h-full object-cover" />
                          ) : (
                            customer.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-[#28242b] block">{customer.name}</span>
                          {customer.email.endsWith('@temp.fatemehlab.ir') && (
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">OTP User</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#77717b] space-y-1">
                      <div className="flex items-center gap-1.5"><Mail size={12}/> <span dir="ltr">{customer.email}</span></div>
                      {customer.phone && <div className="flex items-center gap-1.5"><Phone size={12}/> <span dir="ltr">{customer.phone}</span></div>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${customer.totalOrders > 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-black ${customer.totalSpent > 0 ? 'text-emerald-600' : 'text-[#918a95]'}`}>
                        {customer.totalSpent > 0 ? formatToman(customer.totalSpent) : 'بدون خرید'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#77717b]">
                      <div className="flex items-center gap-1.5"><Calendar size={12}/> {formatPersianDate(customer.createdAt)}</div>
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