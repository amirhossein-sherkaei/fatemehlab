'use client';

import { useState } from 'react';
import { Search, Loader2, Package, CheckCircle2, Clock, XCircle, Truck, CreditCard } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { formatToman } from '@/lib/currency';
import { toast } from 'sonner';

const steps = [
  { id: 'processing', title: 'در حال آماده‌سازی', icon: Package },
  { id: 'shipped', title: 'ارسال شده', icon: Truck },
  { id: 'delivered', title: 'تحویل شده', icon: CheckCircle2 },
];

export default function TrackPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [formData, setFormData] = useState({ trackingCode: '', phone: '' });

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setData(null);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (res.ok) setData(result);
      else toast.error(result.message);
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex((s) => s.id === status);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container-custom py-8 md:py-14 max-w-3xl mx-auto pb-24 md:pb-14">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink mb-2">رهگیری سفارش</h1>
          <p className="text-sm text-muted">برای مشاهده وضعیت سفارش، کد رهگیری و شماره تماس خود را وارد کنید.</p>
        </div>

        <form onSubmit={handleTrack} className="glass-panel p-6 md:p-8 space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">کد رهگیری</label>
              <input
                type="text"
                placeholder="FL-XXXXXX"
                required
                dir="ltr"
                value={formData.trackingCode}
                onChange={(e) => setFormData({ ...formData, trackingCode: e.target.value })}
                className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-line rounded-xl focus:bg-white focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all outline-none text-base text-left font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">شماره تماس</label>
              <input
                type="tel"
                placeholder="شماره ثبت‌شده در سفارش"
                required
                dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-line rounded-xl focus:bg-white focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all outline-none text-base text-left"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full min-h-[48px]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            جستجوی سفارش
          </button>
        </form>

        {data && (
          <div className="glass-panel p-5 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-5 mb-6">
              <div>
                <p className="text-xs text-muted mb-1">کد رهگیری</p>
                <p className="font-mono text-lg md:text-xl font-bold text-ink" dir="ltr">{data.order.trackingCode}</p>
              </div>
              {data.order.status === 'cancelled' ? (
                <span className="px-4 py-2 rounded-lg text-sm font-bold bg-rose/10 text-rose flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> لغو شده
                </span>
              ) : (
                <span className="px-4 py-2 rounded-lg text-sm font-bold bg-sage/10 text-sage flex items-center gap-2">
                  <Package className="w-4 h-4" /> در حال پیگیری
                </span>
              )}
            </div>

            {/* تایم‌لاین موبایل */}
            {data.order.status !== 'cancelled' && (
              <div className="relative mb-10 mt-4">
                <div className="absolute top-5 right-0 left-0 h-1 bg-line rounded-full -z-10"></div>
                <div
                  className="absolute top-5 right-0 h-1 bg-sage rounded-full transition-all duration-1000 ease-out -z-10"
                  style={{ width: `${(getStepIndex(data.order.status) / (steps.length - 1)) * 100}%` }}
                ></div>

                <div className="flex justify-between relative">
                  {steps.map((step, index) => {
                    const isCompleted = getStepIndex(data.order.status) >= index;
                    const isActive = getStepIndex(data.order.status) === index;
                    return (
                      <div key={step.id} className="flex flex-col items-center gap-2 w-1/3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white ${isCompleted ? 'border-sage text-sage shadow-[0_0_15px_rgba(198,29,112,0.3)]' : 'border-line text-muted'}`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] md:text-xs font-bold text-center ${isActive ? 'text-sage' : isCompleted ? 'text-ink' : 'text-muted'}`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6 bg-chalk p-4 rounded-xl border border-line">
              {data.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-white border border-line rounded-lg text-xs font-bold">{item.quantity.toLocaleString('fa-IR')}</span>
                    <span className="font-medium text-ink truncate max-w-[150px] md:max-w-none">{item.productName}</span>
                  </div>
                  <span className="font-bold text-ink whitespace-nowrap">{formatToman(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-4 flex justify-between items-center">
              <span className="font-bold text-ink">مبلغ کل</span>
              <span className="font-black text-xl text-sage">{formatToman(data.order.totalAmount)}</span>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}