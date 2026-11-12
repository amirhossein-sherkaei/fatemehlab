'use client';

import { useState } from 'react';
import { Bell, X, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function StockNotifyButton({ productId }: { productId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.length < 5) { toast.error('لطفاً ایمیل یا شماره موبایل معتبر وارد کنید'); return; }
    setLoading(true);

    try {
      const res = await fetch('/api/stock-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, contact }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        toast.success(data.message);
        setTimeout(() => { setIsOpen(false); setSuccess(false); setContact(''); }, 3000);
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full h-12 bg-[#f8f7fa] border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:border-[#c61d70] transition-all"
      >
        <Bell size={18} className="text-[#c61d70]" />
        به من اطلاع بده (موجود شد)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsOpen(false)} className="absolute top-4 left-4 p-1.5 text-[#77717b] hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors">
              <X size={18} />
            </button>

            {success ? (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-lg font-black text-[#28242b]">ثبت شد!</h3>
                <p className="text-xs text-[#77717b] mt-2">به محض موجود شدن این محصول، به شما اطلاع می‌دهیم.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-[#fff0f7] text-[#c61d70] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Mail size={24} />
                  </div>
                  <h3 className="text-lg font-black text-[#28242b]">اطلاع‌رسانی موجودی</h3>
                  <p className="text-xs text-[#77717b] mt-2 leading-relaxed">ایمیل یا شماره موبایل خود را وارد کنید تا به محض شارژ موجودی، به شما خبر دهیم.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    type="text" 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)} 
                    placeholder="ایمیل یا 09123456789"
                    className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm text-center outline-none focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 transition-all"
                    dir="ltr"
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Bell size={16} />}
                    {loading ? 'در حال ثبت...' : 'ثبت درخواست'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}