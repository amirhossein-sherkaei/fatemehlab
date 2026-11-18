'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { toast } from 'sonner';
import {
  ArrowDown, ArrowUp, Check, Eye, EyeOff, ImagePlus, Link2, Loader2,
  Monitor, Plus, Save, Settings2, Smartphone, Trash2, UploadCloud,
} from 'lucide-react';

type BannerSlide = {
  id: string;
  title: string;
  image: string;
  mobileImage?: string;
  alt: string;
  href: string;
  active: boolean;
  order: number;
  objectPosition: string;
};

type BannerConfig = {
  slides: BannerSlide[];
  autoPlay: boolean;
  intervalMs: number;
};

const EMPTY_CONFIG: BannerConfig = { slides: [], autoPlay: true, intervalMs: 5600 };
const fieldClass = 'w-full rounded-xl border border-[#e9e5eb] bg-[#fbfafc] px-3.5 py-3 text-sm text-[#28242b] outline-none transition focus:border-[#d94b8d] focus:bg-white focus:ring-4 focus:ring-[#c61d70]/[0.07]';
const primaryButton = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#c61d70] px-4 py-2.5 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#a9155d] disabled:cursor-not-allowed disabled:opacity-50';

function makeId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `banner-${crypto.randomUUID()}`
    : `banner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function AdminBannersPage() {
  const [config, setConfig] = useState<BannerConfig>(EMPTY_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [dirty, setDirty] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/banners', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'دریافت بنرها ناموفق بود.');
      setConfig(data.config || EMPTY_CONFIG);
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در دریافت بنرها');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadConfig(); }, [loadConfig]);

  const updateConfig = (patch: Partial<BannerConfig>) => {
    setConfig((current) => ({ ...current, ...patch }));
    setDirty(true);
  };

  const updateSlide = (id: string, patch: Partial<BannerSlide>) => {
    setConfig((current) => ({
      ...current,
      slides: current.slides.map((slide) => slide.id === id ? { ...slide, ...patch } : slide),
    }));
    setDirty(true);
  };

  const addSlide = () => {
    if (config.slides.length >= 12) {
      toast.error('حداکثر ۱۲ بنر می‌توانی داشته باشی.');
      return;
    }
    const next: BannerSlide = {
      id: makeId(), title: `بنر جدید ${config.slides.length + 1}`,
      image: '', mobileImage: '', alt: 'پیشنهاد ویژه فاطمه بیوتی لند',
      href: '/products', active: true, order: config.slides.length,
      objectPosition: 'center center',
    };
    updateConfig({ slides: [...config.slides, next] });
  };

  const removeSlide = (id: string) => {
    if (!window.confirm('این بنر از اسلایدر حذف شود؟')) return;
    updateConfig({ slides: config.slides.filter((slide) => slide.id !== id).map((slide, index) => ({ ...slide, order: index })) });
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= config.slides.length) return;
    const next = [...config.slides];
    [next[index], next[target]] = [next[target], next[index]];
    updateConfig({ slides: next.map((slide, order) => ({ ...slide, order })) });
  };

  const uploadImage = async (id: string, field: 'image' | 'mobileImage', file: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('فقط JPG، PNG، WebP یا GIF مجاز است.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم هر تصویر حداکثر ۵ مگابایت باشد.');
      return;
    }
    const key = `${id}:${field}`;
    setUploading((current) => ({ ...current, [key]: true }));
    try {
      const form = new FormData();
      form.set('file', file);
      const response = await fetch('/api/admin/banners/upload', { method: 'POST', body: form });
      const data = await response.json();
      if (!response.ok || !data.success || typeof data.url !== 'string') {
        throw new Error(data.message || 'آپلود تصویر ناموفق بود.');
      }
      updateSlide(id, { [field]: data.url });
      toast.success(field === 'image' ? 'تصویر دسکتاپ بارگذاری شد.' : 'تصویر موبایل بارگذاری شد.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در آپلود تصویر');
    } finally {
      setUploading((current) => ({ ...current, [key]: false }));
    }
  };

  const handleFile = (id: string, field: 'image' | 'mobileImage') => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) void uploadImage(id, field, file);
  };

  const saveConfig = async () => {
    const incomplete = config.slides.find((slide) => !slide.image.trim() || !slide.alt.trim() || !slide.href.trim());
    if (incomplete) {
      toast.error('برای هر بنر تصویر دسکتاپ، متن جایگزین و لینک مقصد را کامل کن.');
      return;
    }
    if (Object.values(uploading).some(Boolean)) {
      toast.error('صبر کن تا آپلود تصاویر تمام شود.');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...config, slides: config.slides.map((slide, order) => ({ ...slide, order })) };
      const response = await fetch('/api/admin/banners', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'ذخیره تنظیمات ناموفق بود.');
      setConfig(data.config);
      setDirty(false);
      toast.success('تنظیمات اسلایدر ذخیره شد و در صفحه اصلی اعمال می‌شود.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در ذخیره تنظیمات');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex min-h-[45vh] items-center justify-center gap-3 text-sm font-bold text-[#77717b]"><Loader2 className="h-6 w-6 animate-spin text-[#c61d70]" />در حال دریافت تنظیمات اسلایدر…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-24 md:pb-8" dir="rtl">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#f2d7e5] bg-[#fff0f7] px-3 py-1 text-[11px] font-extrabold text-[#b21a64]"><ImagePlus size={14} /> مدیریت ویترین صفحه اصلی</div>
          <h1 className="text-2xl font-black tracking-tight text-[#28242b] md:text-3xl">مدیریت اسلایدر بنرها</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#77717b]">تصاویر تبلیغاتی، ترتیب نمایش، لینک مقصد و رفتار اسلایدر را بدون ویرایش کد مدیریت کن.</p>
        </div>
        <button onClick={() => void saveConfig()} disabled={saving || Object.values(uploading).some(Boolean)} className={primaryButton}>
          {saving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
          ذخیره و انتشار تنظیمات
        </button>
      </header>

      <section className="grid gap-4 rounded-3xl border border-[#eee7ed] bg-white p-5 shadow-[0_8px_30px_rgba(55,28,45,.045)] md:grid-cols-[1fr_220px] md:p-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-black text-[#28242b]"><Settings2 size={18} className="text-[#c61d70]" />رفتار اسلایدر</div>
          <p className="text-xs leading-6 text-[#8b8490]">این تنظیمات برای تمام بنرهای فعال صفحه اصلی اعمال می‌شود.</p>
          <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm font-bold text-[#4b4650]">
            <input type="checkbox" checked={config.autoPlay} onChange={(event) => updateConfig({ autoPlay: event.target.checked })} className="h-4 w-4 accent-[#c61d70]" />
            تغییر خودکار بنرها فعال باشد
          </label>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#4b4650]">فاصله تغییر اسلاید</label>
          <select value={config.intervalMs} onChange={(event) => updateConfig({ intervalMs: Number(event.target.value) })} className={fieldClass}>
            <option value={4000}>۴ ثانیه</option><option value={5600}>۵٫۶ ثانیه</option><option value={7000}>۷ ثانیه</option><option value={9000}>۹ ثانیه</option><option value={12000}>۱۲ ثانیه</option><option value={15000}>۱۵ ثانیه</option>
          </select>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h2 className="text-lg font-black text-[#28242b]">بنرهای صفحه اصلی <span className="mr-1 text-sm font-bold text-[#a49ba5]">({config.slides.length}/۱۲)</span></h2><p className="mt-1 text-xs text-[#8b8490]">ترتیب نمایش از بالا به پایین است.</p></div>
        <button onClick={addSlide} disabled={config.slides.length >= 12} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#f0c9dc] bg-[#fff7fb] px-4 py-2 text-xs font-extrabold text-[#b21a64] transition hover:bg-[#ffedf5] disabled:opacity-40"><Plus size={16} /> افزودن بنر</button>
      </div>

      {config.slides.length === 0 && (
        <div className="rounded-3xl border border-dashed border-[#e8cfde] bg-white px-6 py-14 text-center">
          <ImagePlus className="mx-auto mb-3 h-9 w-9 text-[#d28bad]" />
          <p className="font-black text-[#4b4650]">هنوز بنری تعریف نشده است.</p>
          <p className="mt-2 text-xs text-[#918a95]">اولین بنر را اضافه کن و تصویر دسکتاپ آن را بارگذاری کن.</p>
          <button onClick={addSlide} className={`${primaryButton} mt-5`}><Plus size={16} /> افزودن اولین بنر</button>
        </div>
      )}

      <div className="space-y-5">
        {config.slides.map((slide, index) => (
          <article key={slide.id} className={`overflow-hidden rounded-3xl border bg-white shadow-[0_8px_30px_rgba(55,28,45,.045)] ${slide.active ? 'border-[#eee7ed]' : 'border-dashed border-[#d9d2da] opacity-75'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0ebf0] bg-[#fdfbfd] px-4 py-3 md:px-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fff0f7] text-sm font-black text-[#c61d70]">{(index + 1).toLocaleString('fa-IR')}</span>
                <div><h3 className="text-sm font-black text-[#28242b]">{slide.title || `بنر ${index + 1}`}</h3><p className="text-[10px] text-[#918a95]">{slide.active ? 'در ویترین نمایش داده می‌شود' : 'فعلاً از ویترین مخفی است'}</p></div>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={() => moveSlide(index, -1)} disabled={index === 0} title="انتقال به بالا" className="grid h-9 w-9 place-items-center rounded-xl border border-[#eee7ed] bg-white text-[#77717b] hover:text-[#c61d70] disabled:opacity-30"><ArrowUp size={16} /></button>
                <button type="button" onClick={() => moveSlide(index, 1)} disabled={index === config.slides.length - 1} title="انتقال به پایین" className="grid h-9 w-9 place-items-center rounded-xl border border-[#eee7ed] bg-white text-[#77717b] hover:text-[#c61d70] disabled:opacity-30"><ArrowDown size={16} /></button>
                <button type="button" onClick={() => updateSlide(slide.id, { active: !slide.active })} title={slide.active ? 'مخفی کردن' : 'فعال کردن'} className="grid h-9 w-9 place-items-center rounded-xl border border-[#eee7ed] bg-white text-[#77717b] hover:text-[#c61d70]">{slide.active ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                <button type="button" onClick={() => removeSlide(slide.id)} title="حذف بنر" className="grid h-9 w-9 place-items-center rounded-xl border border-rose-100 bg-white text-rose-500 hover:bg-rose-50"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="grid gap-5 p-4 md:grid-cols-2 md:p-5">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-[#4b4650]"><Monitor size={15} className="text-[#c61d70]" /> تصویر دسکتاپ <span className="text-rose-500">* الزامی</span></div>
                <div className="relative aspect-[16/7] overflow-hidden rounded-2xl border border-[#eee7ed] bg-[#fbf6f9]">
                  {slide.image ? <Image src={slide.image} alt={slide.alt || slide.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /> : <div className="absolute inset-0 grid place-items-center text-xs font-bold text-[#a49ba5]">تصویر دسکتاپ انتخاب نشده</div>}
                </div>
                <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#e5b9d0] bg-[#fff8fb] px-3 text-xs font-extrabold text-[#b21a64] transition hover:bg-[#fff0f7]">
                  {uploading[`${slide.id}:image`] ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                  {uploading[`${slide.id}:image`] ? 'در حال بارگذاری…' : 'انتخاب / جایگزینی تصویر دسکتاپ'}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile(slide.id, 'image')} disabled={!!uploading[`${slide.id}:image`]} />
                </label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-black text-[#4b4650]"><Smartphone size={15} className="text-[#c61d70]" /> تصویر موبایل <span className="text-[10px] font-medium text-[#a49ba5]">اختیاری</span></div>
                <div className="relative mx-auto aspect-[16/7] w-full overflow-hidden rounded-2xl border border-[#eee7ed] bg-[#fbf6f9]">
                  {slide.mobileImage ? <Image src={slide.mobileImage} alt={`${slide.alt} موبایل`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /> : <div className="absolute inset-0 grid place-items-center text-xs font-bold text-[#a49ba5]">در موبایل از تصویر دسکتاپ استفاده می‌شود</div>}
                </div>
                <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#e5b9d0] bg-[#fff8fb] px-3 text-xs font-extrabold text-[#b21a64] transition hover:bg-[#fff0f7]">
                  {uploading[`${slide.id}:mobileImage`] ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                  {uploading[`${slide.id}:mobileImage`] ? 'در حال بارگذاری…' : 'انتخاب / جایگزینی تصویر موبایل'}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFile(slide.id, 'mobileImage')} disabled={!!uploading[`${slide.id}:mobileImage`]} />
                </label>
                {slide.mobileImage && <button type="button" onClick={() => updateSlide(slide.id, { mobileImage: '' })} className="text-[11px] font-bold text-rose-500 hover:underline">حذف تصویر موبایل</button>}
              </div>

              <div className="grid gap-3 md:col-span-2 md:grid-cols-2">
                <label className="space-y-1.5"><span className="text-xs font-bold text-[#4b4650]">نام داخلی بنر</span><input className={fieldClass} value={slide.title} maxLength={100} onChange={(event) => updateSlide(slide.id, { title: event.target.value })} placeholder="مثلاً تخفیف محصولات مراقبت مو" /></label>
                <label className="space-y-1.5"><span className="text-xs font-bold text-[#4b4650]">متن جایگزین تصویر (Alt)</span><input className={fieldClass} value={slide.alt} maxLength={160} onChange={(event) => updateSlide(slide.id, { alt: event.target.value })} placeholder="توضیح کوتاه و دقیق تصویر" /></label>
                <label className="space-y-1.5 md:col-span-2"><span className="flex items-center gap-1.5 text-xs font-bold text-[#4b4650]"><Link2 size={14} /> لینک مقصد بنر</span><input className={fieldClass} dir="ltr" value={slide.href} onChange={(event) => updateSlide(slide.id, { href: event.target.value })} placeholder="/products یا https://example.com/..." /></label>
                <label className="space-y-1.5"><span className="text-xs font-bold text-[#4b4650]">موقعیت نمایش تصویر</span><select className={fieldClass} value={slide.objectPosition} onChange={(event) => updateSlide(slide.id, { objectPosition: event.target.value })}><option value="center center">وسط</option><option value="center top">بالا</option><option value="center bottom">پایین</option><option value="left center">چپ</option><option value="right center">راست</option></select></label>
                <div className="flex items-end"><p className="text-[11px] leading-6 text-[#918a95]">فرمت‌های مجاز: JPG، PNG، WebP و GIF — حداکثر ۵ مگابایت برای هر تصویر.</p></div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <footer className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#eadde6] bg-white/95 p-3 shadow-[0_12px_35px_rgba(58,28,46,.12)] backdrop-blur-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-[#77717b]">{dirty ? <><span className="h-2 w-2 rounded-full bg-amber-500" /> تغییرات ذخیره‌نشده</> : <><Check size={15} className="text-emerald-600" /> همه تغییرات ذخیره شده‌اند</>}</div>
        <button onClick={() => void saveConfig()} disabled={saving || Object.values(uploading).some(Boolean)} className={primaryButton}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} ذخیره و انتشار</button>
      </footer>
    </div>
  );
}