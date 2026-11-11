'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  User, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft,
  Check, ShieldCheck, Sparkles, Heart, Package,
  MapPin, TrendingUp, AlertCircle, CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';


function evaluatePassword(pwd: string) {
  if (!pwd) return { score: 0, label: '', color: '', bar: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  else if (/[a-zA-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score: 1, label: 'ضعیف', color: 'text-rose-500', bar: 'bg-rose-400' };
  if (score === 3) return { score: 2, label: 'متوسط', color: 'text-amber-500', bar: 'bg-amber-400' };
  if (score === 4) return { score: 3, label: 'خوب', color: 'text-lime-600', bar: 'bg-lime-500' };
  return { score: 4, label: 'قوی', color: 'text-emerald-600', bar: 'bg-emerald-500' };
}

const BENEFITS = [
  { icon: Package, text: 'پیگیری آسان سفارشات' },
  { icon: Heart, text: 'ذخیره محصولات مورد علاقه' },
  { icon: MapPin, text: 'مدیریت سریع آدرس‌ها' },
  { icon: TrendingUp, text: 'دسترسی به باشگاه مشتریان' },
];

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Auto-redirect if user is already logged in
  useEffect(() => {
    fetch('/api/account/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success) {
          window.location.href = '/account';
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => setCheckingAuth(false));
  }, []);

  const strength = useMemo(() => evaluatePassword(password), [password]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameValid = name.trim().length >= 2;
  const passwordValid = password.length >= 6;
  const match = confirm.length > 0 && confirm === password;
  const canSubmit = nameValid && emailValid && passwordValid && match && terms && !loading;

  const progress = [nameValid, emailValid, passwordValid].filter(Boolean).length;
  const initial = name.trim().charAt(0) || '؟';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('به فاطمه بیوتی لند خوش آمدید');
        setSuccess(true);
        // Hard navigation ensures cookie is sent with fresh server state
        setTimeout(() => {
          window.location.href = '/account';
        }, 900);
      } else {
        toast.error(data.message || 'خطا در ثبت‌نام');
        setLoading(false);
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafc]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#c61d70]" />
          <p className="text-sm text-[#77717b]">در حال بارگذاری...</p>
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
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(#c61d70 1px, transparent 1px), linear-gradient(90deg, #c61d70 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Success Overlay */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="text-center">
            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black text-[#28242b] mb-2">خوش آمدید!</h2>
            <p className="text-sm text-[#77717b]">حساب شما با موفقیت ساخته شد. در حال انتقال به پنل...</p>
          </div>
        </div>
      )}

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Form Side */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 min-h-screen lg:min-h-0">
          <div className="w-full max-w-md py-8">
            <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] mb-6 hover:underline transition-all">
              <ArrowLeft size={14} /> بازگشت به فروشگاه
            </Link>

            <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(198,29,112,0.18)] border border-white/70 p-7 md:p-10">
              <div className="text-center mb-8">
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] rounded-2xl flex items-center justify-center mb-4 border border-[#f2d7e5] relative">
                  <Sparkles className="w-6 h-6 text-[#c61d70]" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#c61d70] ring-2 ring-white" />
                </div>
                <h1 className="text-2xl font-black text-[#28242b] mb-1.5">ساخت حساب کاربری</h1>
                <p className="text-sm text-[#77717b]">در چند ثانیه به جمع ما بپیوندید</p>
              </div>

              <div className="flex items-center justify-center gap-2 mb-7">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      progress >= n ? 'w-12 bg-[#c61d70]' : 'w-8 bg-[#e9e5eb]'
                    }`}
                  />
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">نام و نام خانوادگی</label>
                  <div className="relative group">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثلاً فاطمه محمدی"
                      required
                      className="w-full pr-11 pl-11 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all"
                    />
                    {nameValid && (
                      <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-in zoom-in duration-300" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">ایمیل</label>
                  <div className="relative group">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      dir="ltr"
                      className="w-full pr-11 pl-11 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all text-left"
                    />
                    {emailValid && (
                      <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 animate-in zoom-in duration-300" />
                    )}
                  </div>
                  {email.length > 0 && !emailValid && (
                    <p className="mt-1.5 flex items-center gap-1 text-[10px] text-rose-500">
                      <AlertCircle size={11} /> فرمت ایمیل معتبر نیست
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">رمز عبور</label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="حداقل ۶ حرف"
                      required
                      minLength={6}
                      className="w-full pr-11 pl-12 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#918a95] hover:text-[#c61d70] transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.score ? strength.bar : 'bg-[#e9e5eb]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-[10px] font-bold ${strength.color}`}>{strength.label}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">تکرار رمز عبور</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      required
                      className={`w-full pr-11 pl-12 py-3.5 bg-[#f8f7fa] border rounded-xl focus:bg-white focus:ring-4 outline-none text-sm transition-all ${
                        confirm.length > 0
                          ? match
                            ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10'
                            : 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10'
                          : 'border-[#e9e5eb] focus:border-[#c61d70] focus:ring-[#c61d70]/10'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#918a95] hover:text-[#c61d70] transition-colors"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirm.length > 0 && (
                    <p className={`mt-1.5 flex items-center gap-1 text-[10px] font-bold ${match ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {match ? (
                        <><Check size={11} /> رمزها یکسان هستند</>
                      ) : (
                        <><AlertCircle size={11} /> رمزها یکسان نیستند</>
                      )}
                    </p>
                  )}
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => setTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 accent-[#c61d70] cursor-pointer"
                  />
                  <span className="text-[11px] leading-relaxed text-[#77717b]">
                    <Link href="/policies/privacy" className="text-[#c61d70] font-bold hover:underline">قوانین حریم خصوصی</Link> و{' '}
                    <Link href="/policies/shipping" className="text-[#c61d70] font-bold hover:underline">شرایط استفاده</Link> را می‌پذیرم.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-4 bg-[#c61d70] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#c61d70]/25 hover:bg-[#a9155d] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> در حال ساخت حساب...</>
                  ) : (
                    <><Sparkles size={18} /> ساخت حساب کاربری</>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-[#e9e5eb] text-center">
                <p className="text-xs text-[#77717b]">
                  قبلاً حساب دارید؟{' '}
                  <Link href="/account/login" className="font-black text-[#c61d70] hover:underline">
                    وارد شوید
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Side (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-8 -right-6 text-[#c61d70]/30 animate-pulse" style={{ animationDuration: '3s' }}>
              <Sparkles size={40} />
            </div>
            <div className="absolute -bottom-6 -left-6 text-[#c61d70]/20 animate-pulse" style={{ animationDuration: '4s' }}>
              <Sparkles size={32} />
            </div>

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
                    <p className="text-lg font-black text-[#28242b] truncate">
                      {name || 'نام شما'}
                    </p>
                    <p className="text-xs text-[#918a95] truncate" dir="ltr">
                      {email || 'email@example.com'}
                    </p>
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

            <p className="text-center text-[10px] text-[#918a95] mt-6">
              این کارت پس از ثبت‌نام شما فعال می‌شود
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}