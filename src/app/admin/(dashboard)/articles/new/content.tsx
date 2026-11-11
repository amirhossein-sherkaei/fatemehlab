'use client';
import { useState } from 'react';
import { ArrowRight, Loader2, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import RichTextEditor from '@/components/admin/RichTextEditor';


export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  const [formData, setFormData] = useState({ 
    title: '', 
    slug: '', 
    excerpt: '', 
    content: '', 
    category: 'education',
    status: 'draft',
    readTime: '۵ دقیقه',
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: false,
    seoTitle: '',
    seoDescription: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (field: 'featured' | 'editorsPick') => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      if (res.ok) { setImageUrl(result.url); toast.success('تصویر آپلود شد'); }
      else toast.error(result.message);
    } catch { toast.error('خطا در آپلود'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { ...formData, coverImage: imageUrl };

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { toast.success('مقاله با موفقیت ساخته شد'); router.push('/admin/articles'); router.refresh(); }
      else toast.error(data.message);
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles" className="p-2 bg-white border border-line rounded-xl hover:bg-chalk transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-ink">مقاله جدید</h1>
          <p className="text-sm text-muted mt-1">اطلاعات کامل مقاله را وارد کنید</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* اطلاعات اصلی */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۱</span>
            اطلاعات اصلی
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">عنوان مقاله *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">شناسه (Slug) *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required dir="ltr" placeholder="article-slug" className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all font-mono text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">خلاصه مقاله</label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} placeholder="یک خلاصه یک یا دو جمله‌ای..." className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">دسته‌بندی</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 cursor-pointer">
                <option value="education">آموزش</option>
                <option value="buying-guide">راهنمای خرید</option>
                <option value="skincare">مراقبت پوست</option>
                <option value="haircare">مراقبت مو</option>
                <option value="makeup">آرایشی</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">زمان مطالعه</label>
              <input type="text" name="readTime" value={formData.readTime} onChange={handleChange} className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">نویسنده</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50" />
            </div>
          </div>
        </div>

        {/* تصویر کاور */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۲</span>
            تصویر کاور
          </h2>
          
          <div className="border-2 border-dashed border-line rounded-xl p-6 flex flex-col items-center justify-center bg-chalk relative min-h-[180px]">
            {imageUrl ? (
              <div className="relative w-full max-w-md">
                <div className="aspect-video rounded-xl overflow-hidden bg-white border border-line shadow-sm">
                  <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-rose text-white p-2 rounded-lg text-xs flex items-center gap-1 hover:bg-rose/90 transition-colors">
                  <X size={14} /> حذف تصویر
                </button>
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-muted mb-3" />
                <p className="text-sm text-muted mb-1">تصویری برای کاور انتخاب کنید</p>
                <p className="text-xs text-muted mb-4">JPG, PNG, WebP - حداکثر ۵ مگابایت</p>
                <label className="btn-primary cursor-pointer text-sm">
                  <UploadCloud size={16} />
                  انتخاب تصویر
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                </label>
              </>
            )}
            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-sage" /></div>}
          </div>
        </div>

        {/* محتوا */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۳</span>
            محتوای مقاله
          </h2>
          <RichTextEditor content={formData.content} onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} />
          <p className="text-xs text-muted">💡 هر پاراگراف با Enter از هم جدا می‌شود.</p>
        </div>

        {/* تنظیمات نمایش */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۴</span>
            تنظیمات نمایش
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">وضعیت انتشار</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg cursor-pointer">
                <option value="draft">پیش‌نویس</option>
                <option value="published">منتشر شده</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">مقاله شاخص</label>
              <button type="button" onClick={() => handleToggle('featured')} className={`w-full px-4 py-2.5 rounded-lg border font-medium text-sm transition-all ${formData.featured ? 'bg-sage text-white border-sage' : 'bg-chalk text-muted border-line'}`}>
                {formData.featured ? '✓ بله (شاخص)' : 'خیر'}
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">انتخاب سردبیر</label>
              <button type="button" onClick={() => handleToggle('editorsPick')} className={`w-full px-4 py-2.5 rounded-lg border font-medium text-sm transition-all ${formData.editorsPick ? 'bg-sage text-white border-sage' : 'bg-chalk text-muted border-line'}`}>
                {formData.editorsPick ? '✓ بله (پیشنهاد ویژه)' : 'خیر'}
              </button>
            </div>
          </div>
        </div>

        {/* سئو */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۵</span>
            تنظیمات سئو
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">عنوان سئو</label>
            <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="اگر خالی باشد، از عنوان مقاله استفاده می‌شود" className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">توضیحات سئو</label>
            <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={2} placeholder="اگر خالی باشد، از خلاصه مقاله استفاده می‌شود" className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50"></textarea>
          </div>
        </div>

        {/* دکمه‌های عملیات */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-4 flex justify-end gap-3 sticky bottom-4 z-10">
          <Link href="/admin/articles" className="px-6 py-2.5 text-sm font-medium hover:bg-chalk rounded-lg transition-colors">انصراف</Link>
          <button type="submit" disabled={loading || uploading} className="px-8 py-2.5 text-sm font-bold bg-sage text-white rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 hover:bg-sage/90 transition-colors">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> در حال ذخیره...</> : 'ذخیره مقاله'}
          </button>
        </div>
      </form>
    </div>
  );
}