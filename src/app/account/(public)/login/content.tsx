'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Phone, ArrowLeft, Loader2, ShieldCheck, KeyRound,
  CheckCircle2, ShieldAlert, Sparkles, RotateCcw, ChevronLeft,
  LockKeyhole, Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';


export default function CustomerLoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'password' | 'otp'>('password');
  
  // Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState('');
  const [codeArray, setCodeArray] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  // OTP Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (step === 2 && method === 'otp') {
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [step, method]);

  // ===== PASSWORD LOGIN =====
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const redirectTo = urlParams.get('redirect') || '/account';
          window.location.href = redirectTo;
        }, 1000);
      } else {
        toast.error(data.message || 'ایمیل یا رمز عبور اشتباه است');
        setErrorShake(true);
        setTimeout(() => setErrorShake(false), 500);
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // ===== OTP LOGIN =====
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!/^09\d{9}$/.test(mobile)) {
      toast.error('شماره موبایل معتبر نیست');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.bypassCode) {
          const codeDigits = String(data.bypassCode).split('').slice(0, 6);
          setCodeArray(codeDigits);
          toast.info(
            data.isExistingUser
              ? `خوش برگشتی! کد ${data.bypassCode} وارد شد.`
              : `حالت تست: کد ${data.bypassCode} وارد شد.`,
            { duration: 5000 }
          );
        } else {
          toast.success(data.message || 'کد تأیید ارسال شد.');
        }
        setStep(2);
        setTimer(120);
      } else {
        toast.error(data.message || 'خطا در ارسال پیامک');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || codeArray.join('');
    if (code.length < 6) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, code }),
      });
      const data = await res.json();
      if (res.ok) {
        // Use server-provided routing hint
        const isNew = data.isNewUser === true;
        const needsOnboarding = data.needsOnboarding === true;
        
        if (!isNew) {
          toast.success(`خوش برگشتی ${data.customer?.name || ''}!`.trim());
        } else {
          toast.success('به فاطمه بیوتی لند خوش آمدید!');
        }
        
        setSuccess(true);
        setTimeout(() => {
          if (needsOnboarding) {
            window.location.href = '/account/onboarding';
          } else {
            const urlParams = new URLSearchParams(window.location.search);
            const redirectTo = urlParams.get('redirect') || '/account';
            window.location.href = redirectTo;
          }
        }, 1000);
      } else {
        toast.error(data.message || 'کد وارد شده صحیح نیست');
        setErrorShake(true);
        setTimeout(() => setErrorShake(false), 500);
        setCodeArray(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const code = codeArray.join('');
    if (code.length === 6 && step === 2 && method === 'otp' && !loading) {
      handleVerifyOtp(code);
    }
  }, [codeArray, step, method]);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...codeArray];
    newCode[index] = value;
    setCodeArray(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newCode = [...codeArray];
      for (let i = 0; i < pastedData.length; i++) newCode[i] = pastedData[i];
      setCodeArray(newCode);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timerProgress = (timer / 120) * 100;

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
          <h2 className="text-3xl font-black text-[#28242b] mb-2">خوش آمدید!</h2>
          <p className="text-sm text-[#77717b]">در حال انتقال...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#fafafc] px-4 py-12 overflow-hidden" dir="rtl">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] rounded-full blur-[100px] opacity-70 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-[#f4b7d5]/40 to-transparent rounded-full blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(#c61d70 1px, transparent 1px), linear-gradient(90deg, #c61d70 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] mb-6 hover:underline transition-all">
          <ArrowLeft size={14} /> بازگشت به فروشگاه
        </Link>

        <div className="bg-white/85 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(198,29,112,0.2)] border border-white p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#c61d70]/10 to-transparent rounded-bl-[3rem] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#c61d70]/10 to-transparent rounded-tr-[3rem] pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-[#f2d7e5] relative group transition-transform hover:scale-105">
                <LockKeyhole className="w-7 h-7 text-[#c61d70]" />
                <Sparkles className="absolute -top-2 -right-2 text-[#c61d70]/50 w-5 h-5 animate-pulse" />
              </div>
              <h1 className="text-2xl font-black text-[#28242b] mb-2">ورود به حساب</h1>
              <p className="text-sm text-[#77717b]">روش ورود خود را انتخاب کنید</p>
            </div>

            {/* Tabs */}
            <div className="flex rounded-2xl bg-[#f8f7fa] p-1 mb-6">
              <button
                onClick={() => setMethod('password')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${method === 'password' ? 'bg-white text-[#c61d70] shadow-sm' : 'text-[#77717b] hover:text-[#28242b]'}`}
              >
                ورود با رمز عبور
              </button>
              <button
                onClick={() => setMethod('otp')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${method === 'otp' ? 'bg-white text-[#c61d70] shadow-sm' : 'text-[#77717b] hover:text-[#28242b]'}`}
              >
                ورود با کد یکبار مصرف
              </button>
            </div>

            {/* ===== PASSWORD LOGIN FORM ===== */}
            {method === 'password' && (
              <form onSubmit={handlePasswordLogin} className={`space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 ${errorShake ? 'animate-shake' : ''}`}>
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
                      className="w-full pr-11 pl-4 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all text-left"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">رمز عبور</label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pr-11 pl-12 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#918a95] hover:text-[#c61d70] transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full py-4 bg-[#28242b] text-white font-bold rounded-2xl shadow-xl shadow-[#28242b]/20 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 mt-2"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                  {loading ? 'در حال ورود...' : 'ورود به حساب'}
                </button>
              </form>
            )}

            {/* ===== OTP LOGIN FORM ===== */}
            {method === 'otp' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                {step === 1 ? (
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-[#28242b] mb-2">شماره موبایل</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <span className="text-sm font-bold text-[#918a95] border-l border-[#e9e5eb] pl-3 ml-1 group-focus-within:text-[#c61d70] transition-colors" dir="ltr">+98</span>
                        </div>
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 11))}
                          required
                          dir="ltr"
                          placeholder="912 345 6789"
                          className="w-full pr-20 pl-4 py-4 bg-[#f8f7fa] border border-[#e9e5eb] rounded-2xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-left font-mono text-lg tracking-wider transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || mobile.length < 11}
                      className="w-full py-4 bg-[#28242b] text-white font-bold rounded-2xl shadow-xl shadow-[#28242b]/20 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                      {loading ? 'در حال ارسال...' : 'دریافت کد ورود'}
                    </button>
                  </form>
                ) : (
                  <div className={`space-y-6 ${errorShake ? 'animate-shake' : ''}`}>
                    <div dir="ltr" className="flex justify-center gap-2 sm:gap-3">
                      {codeArray.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { inputRefs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-black rounded-xl border outline-none transition-all shadow-sm ${
                            digit 
                              ? 'bg-white border-[#c61d70] text-[#c61d70] ring-2 ring-[#c61d70]/20 scale-105' 
                              : 'bg-[#f8f7fa] border-[#e9e5eb] text-[#28242b] focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between bg-[#f8f7fa] rounded-2xl p-2 border border-[#e9e5eb]">
                      <button
                        type="button"
                        onClick={() => { setStep(1); setCodeArray(['', '', '', '', '', '']); }}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#77717b] hover:text-[#28242b] px-3 py-2 rounded-xl transition-colors hover:bg-white"
                      >
                        <ChevronLeft size={14} /> ویرایش شماره
                      </button>
                      <div className="flex items-center gap-3 px-2">
                        {timer > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#c61d70]" dir="ltr">{formatTime(timer)}</span>
                            <div className="w-16 h-1.5 bg-[#e9e5eb] rounded-full overflow-hidden">
                              <div className="h-full bg-[#c61d70] transition-all duration-1000 ease-linear" style={{ width: `${timerProgress}%` }} />
                            </div>
                          </div>
                        ) : (
                          <button type="button" onClick={handleSendOtp} className="flex items-center gap-1.5 text-xs font-bold text-[#c61d70] bg-[#fff0f7] px-3 py-2 rounded-xl hover:bg-[#fce5f0] transition-colors animate-pulse">
                            <RotateCcw size={13} /> ارسال مجدد
                          </button>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVerifyOtp()}
                      disabled={loading || codeArray.join('').length < 6}
                      className="w-full py-4 bg-[#c61d70] text-white font-bold rounded-2xl shadow-xl shadow-[#c61d70]/30 hover:bg-[#a9155d] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                      {loading ? 'در حال بررسی...' : 'تایید و ورود'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-[#e9e5eb] text-center">
              <p className="text-xs text-[#77717b]">
                حساب کاربری ندارید؟{' '}
                <Link href="/account/register" className="font-black text-[#c61d70] hover:underline">
                  ثبت‌نام کنید
                </Link>
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-[#918a95] mt-8 flex items-center justify-center gap-1.5">
          <ShieldAlert size={13} /> اطلاعات شما نزد ما کاملاً محفوظ است.
        </p>
      </div>
    </div>
  );
}