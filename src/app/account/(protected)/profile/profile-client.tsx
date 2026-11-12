import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
'use client';

import { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Camera, User, Mail, Phone, Loader2, Save, ShieldCheck,
  Package, Heart, MapPin, Calendar, Lock, Eye, EyeOff, Check,
  ArrowLeft, Sparkles, Award, Clock, LogOut, AlertCircle,
  KeyRound, Crown, ChevronLeft, X, CheckCircle2, Truck, ListChecks
} from 'lucide-react';
import { toast } from 'sonner';
import { formatToman } from '@/lib/currency';

function normalizeDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

interface ProfileClientProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    createdAt: Date;
  };
  stats: {
    orders: number;
    wishlist: number;
    addresses: number;
    memberSince: Date;
    loyaltyPoints: number;
    tier: string;
  };
  recentOrders: Array<{
    id: string;
    trackingCode: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
  }>;
  isOtpUser?: boolean;
}

const ORDER_STATUS: Record<string, { label: string; cls: string; icon: any }> = {
  pending: { label: 'در انتظار', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  paid: { label: 'پرداخت شده', cls: 'bg-sky-50 text-sky-700 border-sky-200', icon: CheckCircle2 },
  processing: { label: 'در حال پردازش', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: Package },
  shipped: { label: 'ارسال شده', cls: 'bg-purple-50 text-purple-700 border-purple-200', icon: Truck },
  delivered: { label: 'تحویل شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  cancelled: { label: 'لغو شده', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: X },
};

function computeMembership(points: number, currentTier: string) {
  const tiers = {
    bronze: { title: 'برنزی', next: 'نقره‌ای', min: 0, max: 500, color: 'orange', bg: 'from-orange-400 to-amber-600' },
    silver: { title: 'نقره‌ای', next: 'طلایی', min: 500, max: 1500, color: 'slate', bg: 'from-slate-400 to-gray-500' },
    gold: { title: 'طلایی', next: null, min: 1500, max: Infinity, color: 'amber', bg: 'from-amber-400 to-yellow-600' },
  };

  const current = tiers[currentTier as keyof typeof tiers] || tiers.bronze;
  
  if (points >= current.max) {
    return { points, title: 'کاربر طلایی', next: null, progress: 100, remaining: 0, bg: tiers.gold.bg, icon: Crown };
  }

  const nextTier = tiers[current.next === 'نقره‌ای' ? 'silver' : 'gold' as keyof typeof tiers];
  const progress = ((points - current.min) / (current.max - current.min)) * 100;
  const remaining = current.max - points;

  return { 
    points, 
    title: `کاربر ${current.title}`, 
    next: `کاربر ${current.next}`, 
    progress: Math.min(100, Math.max(0, progress)), 
    remaining, 
    bg: current.bg, 
    icon: currentTier === 'gold' ? Crown : Award
  };
}

function evaluatePassword(pwd: string) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  else if (/[a-zA-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score: 1, label: 'ضعیف', color: 'rose' };
  if (score === 3) return { score: 2, label: 'متوسط', color: 'amber' };
  if (score === 4) return { score: 3, label: 'خوب', color: 'lime' };
  return { score: 4, label: 'قوی', color: 'emerald' };
}

export default function ProfileClient({ customer, stats, recentOrders, isOtpUser = false }: ProfileClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState(customer.avatar);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: customer.name,
    phone: customer.phone || '',
    email: isOtpUser ? '' : customer.email,
  });
  const [saving, setSaving] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, newPass: false, confirm: false });

  const membership = useMemo(() => computeMembership(stats.loyaltyPoints, stats.tier), [stats.loyaltyPoints, stats.tier]);
  const pwdStrength = useMemo(() => evaluatePassword(passwordData.newPass), [passwordData.newPass]);
  const passwordsMatch = passwordData.confirm.length > 0 && passwordData.confirm === passwordData.newPass;

  const isDirty =
    formData.name !== customer.name ||
    (formData.phone || '') !== (customer.phone || '') ||
    (isOtpUser && formData.email !== '');

  const resetForm = () => {
    setFormData({ name: customer.name, phone: customer.phone || '', email: isOtpUser ? '' : customer.email });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('حجم عکس حداکثر ۲ مگابایت است'); return; }
    if (!file.type.startsWith('image/')) { toast.error('فقط فایل تصویری مجاز است'); return; }
    const reader = new FileReader();
    reader.onload = () => { setAvatarPreview(reader.result as string); setPendingFile(file); };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelPreview = () => { setAvatarPreview(null); setPendingFile(null); };

  const confirmAvatarUpload = async () => {
    if (!pendingFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', pendingFile);
    try {
      const res = await fetch('/api/account/avatar', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setAvatar(data.avatar);
        cancelPreview();
        toast.success('عکس پروفایل به‌روزرسانی شد');
        router.refresh();
      } else {
        toast.error(data.message || 'خطا در آپلود');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    setPhoneError('');
    let normalizedPhone = formData.phone;
    if (formData.phone && formData.phone.trim() !== '') {
      normalizedPhone = normalizeDigits(formData.phone).replace(/\s+/g, '');
      if (!/^0\d{10}$/.test(normalizedPhone)) {
        setPhoneError('شماره تماس باید ۱۱ رقم و با ۰ شروع شود');
        return;
      }
    }

    if (normalizedPhone !== (customer.phone || '')) {
      setSaving(true);
      try {
        const res = await fetch('/api/account/phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPhone: normalizedPhone }),
        });
        if (res.ok) {
          toast.success('کد تایید به شماره جدید ارسال شد');
          setPhoneModalOpen(true);
        } else {
          const data = await res.json();
          toast.error(data.message || 'خطا در ارسال کد');
        }
      } catch {
        toast.error('خطا در ارتباط با سرور');
      } finally {
        setSaving(false);
      }
      return;
    }
    
    setSaving(true);
    try {
      const payload: any = { name: formData.name, phone: formData.phone };
      if (isOtpUser && formData.email) payload.email = formData.email;

      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('اطلاعات شما ذخیره شد');
        router.refresh();
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (phoneOtp.length < 6) return;
    setVerifyingPhone(true);
    try {
      const res = await fetch('/api/account/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPhone: normalizeDigits(formData.phone).replace(/\s+/g, ''), code: phoneOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (formData.name !== customer.name || (isOtpUser && formData.email)) {
        await fetch('/api/account/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: isOtpUser ? formData.email : undefined, phone: formData.phone }),
        });
      }

      toast.success('اطلاعات با موفقیت به‌روزرسانی شد');
      setPhoneModalOpen(false);
      setPhoneOtp('');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) { toast.error('رمز جدید با تکرار آن یکسان نیست'); return; }
    if (passwordData.newPass.length < 6) { toast.error('رمز جدید باید حداقل ۶ حرف باشد'); return; }
    setChangingPassword(true);
    try {
      const payload: any = { newPassword: passwordData.newPass };
      if (!isOtpUser) payload.currentPassword = passwordData.current;

      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('رمز عبور با موفقیت تنظیم شد');
        setPasswordData({ current: '', newPass: '', confirm: '' });
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('آیا از حساب کاربری خود خارج می‌شوید؟')) return;
    try {
      await fetch('/api/account/logout', { method: 'POST' });
      toast.success('با موفقیت خارج شدید');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('خطا در خروج');
    }
  };

  const statCards = [
    { label: 'سفارشات', value: stats.orders, icon: Package, gradient: 'from-blue-500 to-blue-600', href: '/account/orders' },
    { label: 'علاقه‌مندی', value: stats.wishlist, icon: Heart, gradient: 'from-rose-500 to-pink-600', href: '/account/wishlist' },
    { label: 'آدرس‌ها', value: stats.addresses, icon: MapPin, gradient: 'from-amber-500 to-orange-600', href: '/account/addresses' },
    { label: 'امتیاز من', value: membership.points, icon: Award, gradient: 'from-emerald-500 to-teal-600', href: null },
  ];

  const passwordFields: Array<{ key: 'current' | 'newPass' | 'confirm'; label: string }> = [
    ...(isOtpUser ? [] : [{ key: 'current' as const, label: 'رمز عبور فعلی' }]),
    { key: 'newPass', label: isOtpUser ? 'تعیین رمز عبور جدید' : 'رمز عبور جدید' },
    { key: 'confirm', label: 'تکرار رمز جدید' },
  ];

  return (
    <div className="space-y-5 md:space-y-6 pb-8">
      <div className="relative overflow-hidden rounded-3xl border border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-[#f8f7fa] p-5 md:p-10">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#c61d70]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#c61d70]/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-5 md:flex-row md:items-end md:gap-7">
          <div className="relative">
            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl md:h-36 md:w-36">
              {avatar ? (
                <Image src={avatar} alt={customer.name} width={144} height={144} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-5xl font-black text-white">
                  {customer.name.charAt(0)}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="تغییر عکس پروفایل"
              className="absolute bottom-1 right-1 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#c61d70] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} disabled={uploading} className="hidden" />
          </div>

          <div className="flex-1 text-center md:text-right">
            <h1 className="mb-1 text-xl font-black text-[#28242b] md:text-3xl">{customer.name}</h1>
            <p className="mb-3 text-xs text-[#77717b] md:text-sm" dir="ltr">{customer.email}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#f2d7e5] bg-white px-3 py-1 text-[10px] font-bold text-[#c61d70] md:text-xs">
                <Crown size={12} /> {membership.title}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10px] font-bold text-emerald-600 md:text-xs">
                <ShieldCheck size={12} /> حساب فعال
              </span>
              {customer.phone && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#e9e5eb] bg-white px-3 py-1 text-[10px] font-bold text-[#77717b] md:text-xs" dir="ltr">
                  <Phone size={12} /> {customer.phone}
                </span>
              )}
            </div>
          </div>

          <Link href="/" className="hidden items-center gap-2 rounded-xl border border-[#e9e5eb] bg-white/80 px-4 py-2 text-xs font-bold text-[#28242b] transition-colors hover:bg-white md:inline-flex">
            <ArrowLeft size={14} /> بازگشت به فروشگاه
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {statCards.map((s) => {
          const Icon = s.icon;
          const content = (
            <div className="flex h-full flex-col items-center justify-center p-3 text-center md:p-4">
              <div className={`mb-2 grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-md md:h-10 md:w-10`}>
                <Icon size={16} className="md:h-[18px] md:w-[18px]" />
              </div>
              <p className="text-lg font-black text-[#28242b] md:text-xl">{s.value.toLocaleString('fa-IR')}</p>
              <p className="mt-0.5 text-[10px] font-medium text-[#77717b]">{s.label}</p>
            </div>
          );
          if (s.href) {
            return (
              <Link key={s.label} href={s.href} className="rounded-2xl border border-[#e9e5eb] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#c61d70]/40 hover:shadow-md">
                {content}
              </Link>
            );
          }
          return (
            <div key={s.label} className="rounded-2xl border border-[#e9e5eb] bg-white shadow-sm">
              {content}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-3 border-b border-[#e9e5eb] pb-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0f7]">
              <User size={20} className="text-[#c61d70]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#28242b] md:text-lg">اطلاعات شخصی</h2>
              <p className="text-[11px] text-[#77717b] md:text-xs">{isOtpUser ? 'ایمیل خود را تکمیل کنید' : 'نام و شماره تماس خود را ویرایش کنید'}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="mb-2 block text-xs font-bold text-[#28242b] md:text-sm">نام و نام خانوادگی</label>
              <div className="relative">
                <User className="absolute right-4 top-3.5 h-5 w-5 text-[#918a95]" />
                <input id="profile-name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] py-3 pr-12 pl-4 text-sm outline-none transition-all focus:border-[#c61d70] focus:bg-white focus:ring-2 focus:ring-[#c61d70]/20 md:py-3.5 md:text-base" />
              </div>
            </div>

            <div>
              <label htmlFor="profile-email" className="mb-2 block text-xs font-bold text-[#28242b] md:text-sm">{isOtpUser ? 'ایمیل واقعی خود را وارد کنید' : 'ایمیل (غیرقابل تغییر)'}</label>
              <div className="relative">
                <Mail className="absolute right-4 top-3.5 h-5 w-5 text-[#918a95]" />
                <input
                  id="profile-email"
                  type="email"
                  value={isOtpUser ? formData.email : customer.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isOtpUser}
                  required={isOtpUser}
                  dir="ltr"
                  placeholder={isOtpUser ? 'you@example.com' : ''}
                  className={`w-full rounded-xl border py-3 pr-12 pl-4 text-left text-sm outline-none transition-all md:py-3.5 md:text-base ${
                    isOtpUser
                      ? 'border-[#c61d70] bg-white focus:ring-2 focus:ring-[#c61d70]/20'
                      : 'cursor-not-allowed border-[#e9e5eb] bg-[#f8f7fa] text-[#918a95]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-phone" className="mb-2 block text-xs font-bold text-[#28242b] md:text-sm">شماره موبایل</label>
              <div className="relative">
                <Phone className="absolute right-4 top-3.5 h-5 w-5 text-[#918a95]" />
                <input id="profile-phone" type="tel" value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: e.target.value.replace(/[^\d۰-۹]/g, "").slice(0, 11) }); setPhoneError(""); }} dir="ltr" placeholder="09xxxxxxxxx" className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] py-3 pr-12 pl-4 text-left text-sm outline-none transition-all focus:border-[#c61d70] focus:bg-white focus:ring-2 focus:ring-[#c61d70]/20 md:py-3.5 md:text-base" />
              </div>
            </div>

            <button type="submit" disabled={saving || !isDirty} className="hidden w-full items-center justify-center gap-2 rounded-xl bg-[#c61d70] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/30 transition-colors hover:bg-[#a9155d] disabled:opacity-40 md:flex">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-3 border-b border-[#e9e5eb] pb-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0f7]">
              <KeyRound size={20} className="text-[#c61d70]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#28242b] md:text-lg">{isOtpUser ? 'تعیین رمز عبور' : 'تغییر رمز عبور'}</h2>
              <p className="text-[11px] text-[#77717b] md:text-xs">{isOtpUser ? 'برای ورود بعدی با ایمیل، یک رمز تنظیم کنید' : 'رمز جدید باید حداقل ۶ حرف باشد'}</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordFields.map((field) => (
              <div key={field.key}>
                <label htmlFor={`pwd-${field.key}`} className="mb-2 block text-xs font-bold text-[#28242b] md:text-sm">{field.label}</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-3.5 h-5 w-5 text-[#918a95]" />
                  <input
                    id={`pwd-${field.key}`}
                    type={showPasswords[field.key] ? 'text' : 'password'}
                    value={passwordData[field.key]}
                    onChange={(e) => setPasswordData({ ...passwordData, [field.key]: e.target.value })}
                    required
                    dir="ltr"
                    placeholder="••••••••"
                    minLength={field.key === 'newPass' ? 6 : undefined}
                    className={`w-full rounded-xl border bg-[#f8f7fa] py-3 pr-12 pl-12 text-left text-sm outline-none transition-all focus:bg-white focus:ring-2 md:py-3.5 md:text-base ${
                      field.key === 'confirm' && passwordsMatch
                        ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20'
                        : 'border-[#e9e5eb] focus:border-[#c61d70] focus:ring-[#c61d70]/20'
                    }`}
                  />
                  <button type="button" onClick={() => setShowPasswords({ ...showPasswords, [field.key]: !showPasswords[field.key] })} className="absolute left-4 top-3.5 text-[#918a95] transition-colors hover:text-[#c61d70]" aria-label={showPasswords[field.key] ? 'مخفی کردن رمز' : 'نمایش رمز'}>
                    {showPasswords[field.key] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {field.key === 'newPass' && passwordData.newPass.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= pwdStrength.score
                            ? pwdStrength.color === 'rose' ? 'bg-rose-400'
                            : pwdStrength.color === 'amber' ? 'bg-amber-400'
                            : pwdStrength.color === 'lime' ? 'bg-lime-400'
                            : 'bg-emerald-400'
                            : 'bg-[#e9e5eb]'
                        }`} />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold ${
                      pwdStrength.color === 'rose' ? 'text-rose-500'
                      : pwdStrength.color === 'amber' ? 'text-amber-500'
                      : pwdStrength.color === 'lime' ? 'text-lime-600'
                      : 'text-emerald-600'
                    }`}>{pwdStrength.label}</span>
                  </div>
                )}

                {field.key === 'confirm' && passwordData.confirm.length > 0 && (
                  <p className={`mt-1.5 flex items-center gap-1 text-[10px] font-bold ${passwordsMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {passwordsMatch ? <><Check size={12} /> رمزها یکسان هستند</> : <><AlertCircle size={12} /> رمزها یکسان نیستند</>}
                  </p>
                )}
              </div>
            ))}

            <button type="submit" disabled={changingPassword} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#28242b] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3a333f] disabled:opacity-50">
              {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {changingPassword ? 'در حال ذخیره...' : isOtpUser ? 'تنظیم رمز عبور' : 'تغییر رمز عبور'}
            </button>
          </form>
        </section>
      </div>

      <section className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-[#e9e5eb] pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0f7]">
              <ListChecks size={20} className="text-[#c61d70]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#28242b] md:text-lg">سفارشات اخیر</h2>
              <p className="text-[11px] text-[#77717b] md:text-xs">آخرین سفارش‌های ثبت‌شده شما</p>
            </div>
          </div>
          <Link href="/account/orders" className="text-xs font-bold text-[#c61d70] hover:underline">مشاهده همه</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center">
            <Package size={36} className="mx-auto mb-3 text-[#c61d70]/30" />
            <p className="mb-3 text-xs text-[#77717b]">هنوز سفارشی ثبت نکرده‌اید</p>
            <Link href="/products" className="inline-flex items-center gap-1 rounded-xl bg-[#fff0f7] px-4 py-2 text-xs font-bold text-[#c61d70]">
              شروع خرید <ArrowLeft size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => {
              const st = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
              const Icon = st.icon;
              return (
                <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-[#e9e5eb] bg-white p-3 transition-all hover:border-[#c61d70]/40 hover:bg-[#fffafd] md:p-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#28242b] md:text-sm" dir="ltr">{order.trackingCode}</span>
                      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${st.cls}`}>
                        <Icon size={10} /> {st.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#918a95]">
                      <span>{formatPersianDate(order.createdAt)}</span>
                      <span>·</span>
                      <span className="font-bold text-[#28242b]">{formatToman(order.totalAmount)}</span>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="shrink-0 text-[#c61d70]" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#28242b] to-[#3a333f] p-5 text-white md:p-8">
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#c61d70]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-[#f4b7d5]" />
            <h3 className="text-base font-black md:text-lg">باشگاه مشتریان فاطمه بیوتی لند</h3>
          </div>
          <p className="mb-6 text-xs leading-relaxed text-white/70 md:text-sm">
            به عنوان عضو فعال، به تخفیف‌های ویژه، پیشنهادهای اختصاصی و اطلاع‌رسانی زودتر محصولات جدید دسترسی دارید.
          </p>
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <membership.icon size={16} className="text-[#f4b7d5]" />
                <span className="text-xs font-bold text-white/80">سطح فعلی: <span className="text-[#f4b7d5]">{membership.title}</span></span>
              </div>
              <span className="text-xs font-black text-[#f4b7d5] bg-white/10 px-2 py-1 rounded-md">{membership.points.toLocaleString('fa-IR')} امتیاز</span>
            </div>
            
            {membership.next ? (
              <>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-l from-[#c61d70] to-[#f4b7d5] transition-all duration-1000" style={{ width: `${membership.progress}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-white/60">
                  <span>{membership.progress.toFixed(0)}٪</span>
                  <span>تا {membership.next}: {membership.remaining.toLocaleString('fa-IR')} امتیاز دیگر</span>
                </div>
              </>
            ) : (
              <div className="text-center py-2 text-xs font-bold text-amber-300 bg-amber-500/10 rounded-lg border border-amber-500/20">
                🎉 شما در بالاترین سطح وفاداری هستید!
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
              <Clock size={16} className="mb-2 text-[#f4b7d5]" />
              <p className="mb-1 text-[10px] text-white/60">عضویت شما</p>
              <p className="text-sm font-black">{formatPersianDate(stats.memberSince)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
              <Award size={16} className="mb-2 text-[#f4b7d5]" />
              <p className="mb-1 text-[10px] text-white/60">سطح فعلی</p>
              <p className="text-sm font-black">{membership.title}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
              <Calendar size={16} className="mb-2 text-[#f4b7d5]" />
              <p className="mb-1 text-[10px] text-white/60">امتیاز فعلی</p>
              <p className="text-sm font-black">{membership.points.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-50">
            <LogOut size={20} className="text-rose-500" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#28242b] md:text-lg">خروج از حساب</h2>
            <p className="text-[11px] text-[#77717b] md:text-xs">با خروج، دسترسی به این بخش قطع می‌شود</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100 md:w-auto md:px-6">
          <LogOut size={16} /> خروج از حساب کاربری
        </button>
      </section>

      <Link href="/" className="flex items-center justify-center gap-2 rounded-xl border border-[#e9e5eb] bg-white py-3 text-sm font-bold text-[#28242b] transition-transform active:scale-[0.98] md:hidden">
        <ArrowLeft size={16} /> بازگشت به فروشگاه
      </Link>

      {isDirty && !saving && (
        <div className="fixed bottom-[90px] left-3 right-3 z-40 flex gap-2 rounded-2xl border border-[#e9e5eb] bg-white p-2 shadow-2xl md:hidden">
          <button type="button" onClick={resetForm} className="flex-1 rounded-xl py-2.5 text-sm font-bold text-[#77717b] transition-colors hover:bg-[#f8f7fa]">انصراف</button>
          <button type="button" onClick={() => handleSaveProfile()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c61d70] py-2.5 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/30">
            <Save size={16} /> ذخیره
          </button>
        </div>
      )}

      {phoneModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setPhoneModalOpen(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-black text-[#28242b] text-center mb-2">تایید شماره جدید</h3>
            <p className="text-xs text-[#77717b] text-center mb-6">
              کد ۶ رقمی ارسال شده به <span className="font-bold text-[#28242b]" dir="ltr">{formData.phone}</span> را وارد کنید.
            </p>
            
            <input
              type="text"
              value={phoneOtp}
              onChange={e => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:border-[#c61d70] outline-none"
              placeholder="------"
              maxLength={6}
              dir="ltr"
            />
            
            <div className="flex gap-2 mt-6">
              <button onClick={() => setPhoneModalOpen(false)} className="flex-1 rounded-xl bg-[#f8f7fa] py-3 text-sm font-bold text-[#77717b]">
                انصراف
              </button>
              <button
                onClick={handleVerifyPhoneOtp}
                disabled={verifyingPhone || phoneOtp.length < 6}
                className="flex-1 rounded-xl bg-[#c61d70] py-3 text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center"
              >
                {verifyingPhone ? <Loader2 className="animate-spin" size={18} /> : 'تایید کد'}
              </button>
            </div>
          </div>
        </div>
      )}

      {avatarPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={cancelPreview}>
          <div className="w-full max-w-sm rounded-3xl border border-[#e9e5eb] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-center text-base font-black text-[#28242b]">پیش‌نمایش عکس پروفایل</h3>
            <div className="mx-auto mb-5 h-40 w-40 overflow-hidden rounded-full border-4 border-[#fff0f7]">
              <Image src={avatarPreview} alt="پیش‌نمایش" width={160} height={160} className="h-full w-full object-cover" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={cancelPreview} className="flex-1 rounded-xl bg-[#f8f7fa] py-3 text-sm font-bold text-[#28242b] transition-colors hover:bg-[#e9e5eb]">انصراف</button>
              <button type="button" onClick={confirmAvatarUpload} disabled={uploading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c61d70] py-3 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/30 disabled:opacity-50">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {uploading ? 'در حال آپلود...' : 'تایید و آپلود'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}