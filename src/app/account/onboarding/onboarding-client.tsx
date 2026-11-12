'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Lock, Eye, EyeOff, Camera, Loader2,
  Check, AlertCircle, Sparkles, ShieldCheck,
  CheckCircle2, Phone, Heart, Package, MapPin, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

function normalizeDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

function evaluatePassword(pwd: string) {
  if (!pwd) return { score: 0, label: '', bar: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  else if (/[a-zA-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score: 1, label: 'ضعیف', bar: 'bg-rose-400' };
  if (score === 3) return { score: 2, label: 'متوسط', bar: 'bg-amber-400' };
  if (score === 4) return { score: 3, label: 'خوب', bar: 'bg-lime-500' };
  return { score: 4, label: 'قوی', bar: 'bg-emerald-500' };
}

const BENEFITS = [
  { icon: Package, text: 'پیگیری آسان سفارشات' },
  { icon: Heart, text: 'ذخیره محصولات مورد علاقه' },
  { icon: MapPin, text: 'مدیریت سریع آدرس‌ها' },
  { icon: TrendingUp, text: 'دسترسی به باشگاه مشتریان' },
];

export default function OnboardingClient({
  customer,
}: {
  customer: { name: string; phone: string | null };
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(customer.name.startsWith('کاربر ') ? '' : customer.name);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => evaluatePassword(password), [password]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameValid = name.trim().length >= 2;
  const passwordValid = password.length >= 6;
  const match = confirm.length > 0 && confirm === password;
  const canSubmit = nameValid && emailValid && passwordValid && match && !loading;

  const initial = name.trim().charAt(0) || '؟';

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('حجم عکس حداکثر ۲ مگابایت است'); return; }
    if (!file.type.startsWith('image/')) { toast.error('فقط فایل تصویری مجاز است'); return; }

    const reader = new FileReader();
    reader.onload = async () => {
      setAvatar(reader.result as string);
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/account/avatar', { method: 'POST', body: fd });
        const data = await res.json();
        if (res.ok) toast.success('عکس پروفایل آپلود شد');
        else { toast.error(data.message || 'خطا'); setAvatar(null); }
      } catch {
        toast.error('خطا در آپلود');
        setAvatar(null);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setEmailError('');

    setLoading(true);
    try {
      const res = await fetch('/api/account/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: customer.phone || '',
          password,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/account';
        }, 1500);
      } else {
        // 🛡️ مدیریت خطای تکراری بودن ایمیل
        if (data.message && data.message.includes('ایمیل')) {
          setEmailError(data.message);
        } else {
          toast.error(data.message || 'خطا در ذخیره اطلاعات');
        }
        setLoading(false);
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafc]" dir="rtl">
        <div className="text-center animate-in zoom-in duration-500">
          <div className="relative mx-auto mb-6 w-28 h-28">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#28242b] mb-2">حساب شما کامل شد!</h2>
          <p className="text-sm text-[#77717b]">در حال انتقال به داشبورد...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fafafc] overflow-hidden" dir="rtl">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#c61d70]/12 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#f4b7d5]/30 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#fff0f7] blur-[80px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        
        {/* ================= ستون فرم ================= */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 min-h-screen lg:min-h-0">
          <div className="w-full max-w-md py-8">
            <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(198,29,112,0.18)] border border-white/70 p-7 md:p-10">
              <div className="text-center mb-8">
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] rounded-2xl flex items-center justify-center mb-4 border border-[#f2d7e5] relative">
                  <Sparkles className="w-6 h-6 text-[#c61d70]" />
                </div>
                <h1 className="text-2xl font-black text-[#28242b] mb-1.5">تکمیل پروفایل</h1>
                <p className="text-sm text-[#77717b]">قدم نهایی برای ساخت حساب کاربری</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* عکس پروفایل */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
                      {avatar ? (
                        <Image src={avatar} alt="آواتار" width={96} height={96} className="h-full w-full object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-4xl font-black text-white">
                          {initial}
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#c61d70] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50">
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarSelect} disabled={uploading} className="hidden" />
                  </div>
                  <p className="mt-2 text-[10px] text-[#918a95]">عکس پروفایل (اختیاری)</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">نام و نام خانوادگی</label>
                  <div className="relative group">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً فاطمه محمدی" required className="w-full pr-11 pl-11 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all" />
                    {nameValid && <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">ایمیل</label>
                  <div className="relative group">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} placeholder="you@example.com" required dir="ltr" className={`w-full pr-11 pl-11 py-3.5 bg-[#f8f7fa] border rounded-xl focus:bg-white focus:ring-4 outline-none text-sm transition-all text-left ${emailError ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'border-[#e9e5eb] focus:border-[#c61d70] focus:ring-[#c61d70]/10'}`} />
                    {emailValid && !emailError && <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
                  </div>
                  {emailError && <p className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-rose-500"><AlertCircle size={11} /> {emailError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">شماره موبایل (تایید شده)</label>
                  <div className="relative group">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
                    <input type="tel" value={customer.phone || ''} disabled dir="ltr" className="w-full pr-11 pl-11 py-3.5 bg-[#e9e5eb]/50 border border-[#e9e5eb] rounded-xl text-sm text-[#77717b] cursor-not-allowed text-left" />
                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">تعیین رمز عبور</label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="حداقل ۶ حرف" required minLength={6} className="w-full pr-11 pl-12 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all" />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#918a95] hover:text-[#c61d70]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.bar : 'bg-[#e9e5eb]'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[#77717b]">{strength.label}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">تکرار رمز عبور</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required className={`w-full pr-11 pl-12 py-3.5 bg-[#f8f7fa] border rounded-xl focus:bg-white focus:ring-4 outline-none text-sm transition-all ${confirm.length > 0 ? match ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10' : 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'border-[#e9e5eb] focus:border-[#c61d70] focus:ring-[#c61d70]/10'}`} />
                    <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#918a95] hover:text-[#c61d70]">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirm.length > 0 && (
                    <p className={`mt-1.5 flex items-center gap-1 text-[10px] font-bold ${match ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {match ? <><Check size={11} /> رمزها یکسان هستند</> : <><AlertCircle size={11} /> رمزها یکسان نیستند</>}
                    </p>
                  )}
                </div>

                <button type="submit" disabled={!canSubmit} className="w-full py-4 bg-[#c61d70] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#c61d70]/25 hover:bg-[#a9155d] transition-all flex items-center justify-center gap-2 disabled:opacity-40 mt-2">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> در حال ذخیره...</> : <><CheckCircle2 size={18} /> تکمیل حساب و ورود</>}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ================= ستون کارت عضویت ================= */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-8 -right-6 text-[#c61d70]/30 animate-pulse" style={{ animationDuration: '3s' }}><Sparkles size={40} /></div>
            <div className="absolute -bottom-6 -left-6 text-[#c61d70]/20 animate-pulse" style={{ animationDuration: '4s' }}><Sparkles size={32} /></div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-[#fff8fc] to-[#fce5f0] p-8 shadow-[0_30px_80px_-20px_rgba(198,29,112,0.28)]">
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#c61d70]/25 to-transparent blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[#f4b7d5]/40 to-transparent blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.3em] text-[#c61d70]">FATEMEH BEAUTY LAND</p>
                    <p className="text-xs text-[#77717b] mt-1">کارت عضویت اختصاصی</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center shadow-lg">
                    <Heart size={20} className="text-white" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white text-3xl font-black shadow-lg ring-4 ring-white/70 transition-all duration-300">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-black text-[#28242b] truncate">{name || 'نام شما'}</p>
                    <p className="text-xs text-[#918a95] truncate" dir="ltr">{email || 'email@example.com'}</p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/80 border border-[#f2d7e5] px-2.5 py-0.5">
                      <Sparkles size={10} className="text-[#c61d70]" />
                      <span className="text-[10px] font-bold text-[#c61d70]">عضو جدید</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-[#c61d70]/25 pt-5 mb-6">
                  <div>
                    <p className="text-[10px] text-[#918a95] mb-1">تاریخ عضویت</p>
                    <p className="text-sm font-black text-[#28242b]">امروز</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-[#918a95] mb-1">سطح</p>
                    <p className="text-sm font-black text-[#c61d70]">تازه‌وارد</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-[11px] font-black text-[#28242b] mb-3">مزایای عضویت شما:</p>
                  {BENEFITS.map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-white border border-[#f2d7e5] text-[#c61d70] shadow-sm">
                          <Icon size={13} />
                        </div>
                        <span className="text-[11px] text-[#5a535e] font-medium">{b.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}