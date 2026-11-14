'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { ShieldCheck, MapPin, User, Phone, Loader2, ArrowRight, Home, Check, Plus, TicketPercent, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', address: '', city: '', postalCode: '', notes: '',
  });

  useEffect(() => { 
    setIsMounted(true); 
    // 🛡️ پاکسازی state در صورت بازگشت به صفحه
    setAppliedCoupon(null);
    setCouponCode('');
    setUsePoints(false);
    setPointsToUse(0);
  }, []);
  // 🛡️ اعتبارسنجی مجدد کد تخفیف وقتی سبد خرید تغییر می‌کند
  useEffect(() => {
    if (!appliedCoupon) return;
    
    const revalidate = async () => {
      try {
        const res = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: appliedCoupon.code, orderAmount: getTotalPrice() }),
        });
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          setAppliedCoupon(null);
          setCouponCode('');
          setCouponError(data.message || 'کد تخفیف به دلیل تغییر سبد خرید حذف شد');
          toast.error('کد تخفیف به دلیل تغییر مبلغ سبد خرید حذف شد');
        } else {
          setAppliedCoupon({ code: data.coupon.code, discount: data.discount, description: data.coupon.description || '' });
        }
      } catch {
        // خطای شبکه را نادیده می‌گیریم
      }
    };

    revalidate();
  }, [getTotalPrice(), appliedCoupon?.code]); // فقط وقتی مبلغ یا کد تغییر کند

    useEffect(() => {
    fetch('/api/account/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.success) {
          router.replace('/account/login?redirect=/checkout');
        } else {
          setCheckingAuth(false);
          
          // ✅ پر کردن خودکار فرم با اطلاعات ثبت‌نام کاربر
          if (data.customer) {
            const nameParts = (data.customer.name || '').trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            setFormData(prev => ({
              ...prev,
              firstName: prev.firstName || firstName,
              lastName: prev.lastName || lastName,
              phone: prev.phone || data.customer.phone || '',
            }));

          if (typeof data.customer.loyaltyPoints === 'number' && data.customer.loyaltyPoints > 0) {
            setLoyaltyPoints(data.customer.loyaltyPoints);
          }
          }
        }
      })
      .catch(() => {
        router.replace('/account/login?redirect=/checkout');
      });
  }, [router]);

  // دریافت آدرس‌های ذخیره‌شده
  useEffect(() => {
    fetch('/api/account/addresses')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success && data.addresses.length > 0) {
          setSavedAddresses(data.addresses);
          const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
          setSelectedAddressId(defaultAddr.id);
          setUseNewAddress(false);
        }
      })
      .catch(() => {});
  }, []);

  // پر کردن فرم با آدرس انتخاب‌شده
  useEffect(() => {
    if (!useNewAddress && selectedAddressId) {
      const addr = savedAddresses.find(a => a.id === selectedAddressId);
      if (addr) {
        setFormData({
          firstName: addr.firstName,
          lastName: addr.lastName,
          phone: addr.phone,
          address: addr.address,
          city: addr.city,
          postalCode: addr.postalCode,
          notes: '',
        });
      }
    }
  }, [selectedAddressId, useNewAddress, savedAddresses]);

  useEffect(() => {
    if (isMounted && items.length === 0 && !isSubmitting) {
      router.replace('/cart');
    }
  }, [isMounted, items.length, router, isSubmitting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: getTotalPrice() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon({ code: data.coupon.code, discount: data.discount, description: data.coupon.description || '' });
        toast.success(`کد تخفیف اعمال شد: ${data.discount.toLocaleString('fa-IR')} ریال تخفیف`);
      } else {
        setCouponError(data.message || 'کد نامعتبر است');
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError('خطا در ارتباط با سرور');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null); setCouponCode(''); setCouponError('');
    toast.info('کد تخفیف حذف شد');
  };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    setIsSubmitting(true);
    const toastId = toast.loading('در حال ثبت سفارش و اتصال به درگاه...');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: formData, cartItems: items, couponCode: appliedCoupon?.code || null, usedPoints: usePoints ? pointsToUse : 0 }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'خطا در ثبت سفارش');

      const payRes = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderId }),
      });
      const payData = await payRes.json();

      if (!payRes.ok) throw new Error(payData.message || 'خطا در اتصال به درگاه');

      toast.success('در حال انتقال به درگاه پرداخت...', { id: toastId });
      clearCart();
        localStorage.removeItem('checkout-draft');
      window.location.href = payData.redirectUrl;

    } catch (err: any) {
      toast.error(err.message || 'خطا در ارتباط با سرور', { id: toastId });
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  if (!isMounted || checkingAuth) return null;
  if (items.length === 0 && !isSubmitting) return null;

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col">
      <Header />
      <main className="flex-1 container-custom py-6 md:py-10 pb-32 md:pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-[#28242b]">تسویه‌حساب</h1>
          <Link href="/cart" className="flex items-center gap-1 text-sm font-medium text-[#77717b] hover:text-[#c61d70] transition-colors">
            <ArrowRight size={16} /> بازگشت به سبد
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
          <div className="lg:col-span-3">
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#e9e5eb] p-5 md:p-8 space-y-6">
              
              {/* انتخاب آدرس ذخیره‌شده */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e9e5eb] pb-4">
                    <h2 className="text-lg font-black text-[#28242b] flex items-center gap-2">
                      <MapPin size={20} className="text-[#c61d70]" /> آدرس ارسال
                    </h2>
                  </div>
                  
                  <div className="grid gap-2">
                    {savedAddresses.map(addr => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => { setUseNewAddress(false); setSelectedAddressId(addr.id); }}
                        className={`text-right p-4 rounded-xl border-2 transition-all ${!useNewAddress && selectedAddressId === addr.id ? 'border-[#c61d70] bg-[#fff0f7]' : 'border-[#e9e5eb] bg-white hover:border-[#c61d70]/40'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-[#28242b]">{addr.title}</span>
                          {!useNewAddress && selectedAddressId === addr.id && <Check size={16} className="text-[#c61d70]" />}
                        </div>
                        <p className="text-xs text-[#77717b] line-clamp-1">{addr.firstName} {addr.lastName} - {addr.province}، {addr.city}</p>
                        <p className="text-[10px] text-[#918a95] line-clamp-1 mt-1">{addr.address}</p>
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => setUseNewAddress(true)}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all ${useNewAddress ? 'border-[#c61d70] bg-[#fff0f7] text-[#c61d70]' : 'border-[#e9e5eb] text-[#77717b] hover:border-[#c61d70]/40'}`}
                    >
                      <Plus size={16} /> ارسال به آدرس جدید
                    </button>
                  </div>
                </div>
              )}

              {/* فرم آدرس (وقتی آدرس جدید انتخاب شد) */}
              {useNewAddress && (
                <div className="space-y-4 pt-4 border-t border-[#e9e5eb]">
                  {savedAddresses.length > 0 && <h3 className="font-black text-sm text-[#28242b]">اطلاعات آدرس جدید</h3>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#28242b]">نام *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#28242b]">نام خانوادگی *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#28242b]">شماره تماس *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required dir="ltr" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base text-left" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#28242b]">کد پستی *</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required dir="ltr" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base text-left" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#28242b]">شهر *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#28242b]">آدرس کامل پستی *</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required rows={3} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base resize-none"></textarea>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t border-[#e9e5eb]">
                <label className="text-sm font-bold text-[#28242b]">توضیحات سفارش (اختیاری)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base resize-none"></textarea>
              </div>
            </form>
          </div>

          {/* خلاصه سفارش */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 md:p-6 sticky top-24">
              <h3 className="text-lg font-black text-[#28242b] mb-4 pb-4 border-b border-[#e9e5eb]">خلاصه سفارش</h3>

              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-[#f8f7fa] border border-[#e9e5eb] rounded-lg text-xs font-bold">{item.quantity.toLocaleString('fa-IR')}×</span>
                      <span className="text-[#77717b] font-medium truncate max-w-[150px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#28242b] whitespace-nowrap">{formatToman(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#e9e5eb] pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-[#77717b]">
                  <span>جمع کل کالاها</span>
                  <span>{formatToman(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-[#77717b]">
                  <span>هزینه ارسال</span>
                  <span className="text-[#c61d70] font-bold">در مرحله بعد</span>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="border-t border-[#e9e5eb] mt-4 pt-4 space-y-3">
                {appliedCoupon ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-700">کد اعمال شده:</span>
                        <span className="font-mono font-black text-sm text-emerald-700">{appliedCoupon.code}</span>
                      </div>
                      <p className="text-xs font-bold text-emerald-700">تخفیف: {appliedCoupon.discount.toLocaleString('fa-IR')} ریال</p>
                    </div>
                    <button onClick={removeCoupon} className="text-rose-500 text-xs font-bold hover:underline">حذف</button>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-[#28242b] mb-2 block">کد تخفیف دارید؟</label>
                    <div className="flex gap-2">
                      <input type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }} placeholder="کد تخفیف" className="flex-1 px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm font-mono outline-none focus:border-[#c61d70]" dir="ltr" />
                      <button type="button" onClick={applyCoupon} disabled={applyingCoupon || !couponCode.trim()} className="px-4 py-2.5 bg-[#28242b] text-white text-xs font-bold rounded-xl disabled:opacity-40 shrink-0">
                        {applyingCoupon ? '...' : 'اعمال'}
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-rose-500 mt-1.5">{couponError}</p>}
                  </div>
                )}
              </div>

                            {/* بخش استفاده از امتیاز */}
              {loyaltyPoints > 0 && (
                <div className="border-t border-[#e9e5eb] mt-4 pt-4 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={usePoints}
                        onChange={(e) => {
                          setUsePoints(e.target.checked);
                          setPointsToUse(e.target.checked ? Math.min(loyaltyPoints, Math.floor(getTotalPrice() / 10000)) : 0);
                        }}
                        className="w-4 h-4 accent-[#c61d70]"
                      />
                      <span className="text-xs font-bold text-[#28242b] group-hover:text-[#c61d70] transition-colors">استفاده از امتیازات باشگاه مشتریان</span>
                    </div>
                    <span className="text-[10px] font-black text-[#c61d70] bg-[#fff0f7] px-2 py-1 rounded-md">{loyaltyPoints.toLocaleString('fa-IR')} امتیاز</span>
                  </label>

                  {usePoints && (
                    <div className="bg-[#fff0f7] rounded-xl p-3 border border-[#f2d7e5] animate-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#28242b]">تعداد امتیاز برای استفاده:</span>
                        <span className="text-xs font-black text-[#c61d70]">{pointsToUse.toLocaleString('fa-IR')} امتیاز</span>
                      </div>
                      <input 
                        type="range" 
                        min={0} 
                        max={Math.min(loyaltyPoints, Math.floor(getTotalPrice() / 10000))}
                        value={pointsToUse}
                        onChange={(e) => setPointsToUse(parseInt(e.target.value))}
                        className="w-full accent-[#c61d70]"
                      />
                      <p className="text-[10px] text-[#77717b] mt-2">تخفیف اعمال شده: {((pointsToUse * 1000)).toLocaleString('fa-IR')} تومان</p>
                    </div>
                  )}
                </div>
              )}
              {appliedCoupon && (
                <div className="border-t border-[#e9e5eb] mt-3 pt-3 flex justify-between text-sm">
                  <span className="text-[#77717b]">جمع با تخفیف</span>
                  <span className="font-bold text-emerald-600">{formatToman(getTotalPrice() - appliedCoupon.discount)}</span>
                </div>
              )}

              <div className="border-t border-[#e9e5eb] mt-4 pt-4 flex justify-between items-center mb-6">
                <span className="font-bold text-[#28242b]">مبلغ قابل پرداخت</span>
                <span className="font-black text-xl text-[#c61d70]">
                  {formatToman(appliedCoupon ? getTotalPrice() - appliedCoupon.discount : getTotalPrice())}
                </span>
              </div>

              <button type="submit" form="checkout-form" disabled={loading} className="w-full min-h-[52px] bg-[#c61d70] text-white text-base font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#a9155d] transition-colors disabled:opacity-50 shadow-lg shadow-[#c61d70]/30">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {loading ? 'در حال ثبت...' : 'ثبت نهایی سفارش'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#77717b]">
                <ShieldCheck className="w-4 h-4 text-[#c61d70]" /> پرداخت امن و مطمئن
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e9e5eb] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-[#77717b] mb-0.5">مبلغ قابل پرداخت</p>
            <p className="text-base font-black text-[#28242b]">{formatToman(getTotalPrice())}</p>
          </div>
          <button type="submit" form="checkout-form" disabled={loading} className="flex-1 max-w-[200px] min-h-[48px] bg-[#c61d70] text-white text-sm font-bold rounded-xl disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ثبت نهایی'}
          </button>
        </div>
      </div>
      
      <div className="hidden md:block"><Footer /></div>
    </div>
  );
}