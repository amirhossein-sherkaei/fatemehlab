'use client';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, UploadCloud, Image as ImageIcon, X, Save, Eye, Sparkles, Settings, FileText, Globe, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false, loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl" /> });


export default function EditForm({ article }: { article: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(article.coverImage || '');
  
  const [formData, setFormData] = useState({ 
    title: article.title || '',
    slug: article.slug || '',
    excerpt: article.excerpt || '',
    content: article.content || '',
    category: article.category || 'education',
    status: article.status || 'draft',
    readTime: article.readTime || '۵ دقیقه',
    author: article.author || 'تیم فاطمه بیوتی لند',
    featured: article.featured || false,
    editorsPick: article.editorsPick || false,
    seoTitle: article.seoTitle || '',
    seoDescription: article.seoDescription || '',
  });

  // محاسبه خودکار زمان مطالعه
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).length;
    if (words > 10) {
      const minutes = Math.ceil(words / 200);
      setFormData(prev => ({ ...prev, readTime: `${minutes.toLocaleString('fa-IR')} دقیقه` }));
    }
  }, [formData.content]);

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

  const handleGenerateAI = async () => {
    setGenerating(true);
    const toastId = toast.loading('هوش مصنوعی در حال خلق تصویر است...');
    try {
      const res = await fetch(`/api/admin/articles/${article.id}/generate-cover`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.coverImage);
        toast.success('تصویر با موفقیت خلق شد', { id: toastId });
      } else {
        toast.error(data.message || 'خطا در تولید تصویر', { id: toastId });
      }
    } catch {
      toast.error('خطا در ارتباط با سرور', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, coverImage: imageUrl };

    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { toast.success('مقاله ذخیره شد'); router.push('/admin/articles'); router.refresh(); }
      else toast.error(data.message);
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto pb-20">
      <div className="sticky top-0 z-30 bg-white border-b border-line py-3 px-4 md:px-6 flex items-center justify-between -mx-4 md:-mx-8 lg:-mx-10 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="p-2 hover:bg-chalk rounded-lg transition-colors">
            <ArrowRight className="w-5 h-5 text-ink" />
          </Link>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-ink line-clamp-1">{formData.title || 'ویرایش مقاله'}</h1>
            <p className="text-xs text-muted">آخرین به‌روزرسانی: {formatPersianDate(article.updatedAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/journal/${article.slug}`} target="_blank" className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-chalk text-ink text-xs font-bold rounded-lg border border-line hover:bg-white transition-colors">
            <Eye size={14} /> پیش‌نمایش
          </Link>
          <button type="submit" disabled={loading || uploading || generating} className="flex items-center gap-2 px-5 py-2 bg-ink text-white text-xs md:text-sm font-bold rounded-lg shadow-sm disabled:opacity-50 hover:bg-ink/90 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
            ذخیره مقاله
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 md:p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-ink flex items-center gap-2"><FileText size={16} className="text-sage"/> عنوان مقاله *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-chalk border border-line rounded-xl focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all text-lg font-bold text-ink" placeholder="عنوان جذاب مقاله را وارد کنید..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-ink">شناسه (Slug) *</label>
              <div className="flex items-center">
                <span className="bg-chalk border border-line border-l-0 rounded-r-xl px-3 py-2.5 text-sm text-muted font-mono" dir="ltr">/journal/</span>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required dir="ltr" className="flex-1 px-4 py-2.5 bg-chalk border border-line rounded-l-xl focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all font-mono text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 md:p-6 space-y-3">
            <label className="text-sm font-bold text-ink flex items-center gap-2"><Sparkles size={16} className="text-sage"/> خلاصه مقاله</label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} placeholder="یک خلاصه جذاب که در کارت مجله نمایش داده می‌شود..." className="w-full px-4 py-3 bg-chalk border border-line rounded-xl focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all text-sm leading-relaxed"></textarea>
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 md:p-6 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-ink flex items-center gap-2"><FileText size={16} className="text-sage"/> محتوای اصلی *</label>
              <span className="text-xs text-muted">{formData.content.split(/\s+/).length.toLocaleString('fa-IR')} کلمه</span>
            </div>
            <RichTextEditor content={formData.content} onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} />
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-line pb-3"><Globe size={16} className="text-sage"/> تنظیمات سئو (SEO)</h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted">عنوان سئو (Meta Title)</label>
              <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="اگر خالی باشد، از عنوان مقاله استفاده می‌شود" className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted">توضیحات سئو (Meta Description)</label>
              <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={2} placeholder="اگر خالی باشد، از خلاصه مقاله استفاده می‌شود" className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 text-sm"></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-line pb-3"><Settings size={16} className="text-sage"/> انتشار</h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted">وضعیت</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-chalk border border-line rounded-lg cursor-pointer text-sm font-medium">
                <option value="draft">پیش‌نویس</option>
                <option value="published">منتشر شده</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted">دسته‌بندی</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 bg-chalk border border-line rounded-lg cursor-pointer text-sm">
                <option value="education">آموزش</option>
                <option value="buying-guide">راهنمای خرید</option>
                <option value="skincare">مراقبت پوست</option>
                <option value="haircare">مراقبت مو</option>
                <option value="makeup">آرایشی</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted">نویسنده</label>
                <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-3 py-2 bg-chalk border border-line rounded-lg text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted">زمان مطالعه</label>
                <input type="text" name="readTime" value={formData.readTime} onChange={handleChange} className="w-full px-3 py-2 bg-chalk border border-line rounded-lg text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2"><ImageIcon size={16} className="text-sage"/> تصویر کاور</h3>
              <button type="button" onClick={handleGenerateAI} disabled={generating || uploading} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {generating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                {generating ? 'در حال خلق...' : 'تولید با AI'}
              </button>
            </div>
            
            <div className="border-2 border-dashed border-line rounded-xl p-3 flex flex-col items-center justify-center bg-chalk relative min-h-[140px]">
              {imageUrl ? (
                <div className="relative w-full">
                  <div className="aspect-video rounded-lg overflow-hidden bg-white border border-line">
                    <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-rose text-white p-1.5 rounded-md text-xs hover:bg-rose/90">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-muted mb-2" />
                  <p className="text-xs text-muted mb-3 text-center">تصویر کاور را آپلود کنید یا از AI بگیرید</p>
                  <label className="px-4 py-2 bg-white border border-line rounded-lg text-xs font-bold text-ink cursor-pointer hover:bg-chalk transition-colors">
                    <UploadCloud size={14} className="inline mr-1" /> انتخاب دستی
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                  </label>
                </>
              )}
              {(uploading || generating) && <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-sage" /></div>}
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-line pb-3"><Sparkles size={16} className="text-sage"/> تنظیمات ویژه</h3>
            <button type="button" onClick={() => handleToggle('featured')} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${formData.featured ? 'bg-sage/10 border-sage text-sage' : 'bg-chalk border-line text-muted'}`}>
              <span className="text-sm font-medium">مقاله شاخص</span>
              <div className={`w-9 h-5 rounded-full relative transition-colors ${formData.featured ? 'bg-sage' : 'bg-line'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.featured ? 'left-0.5' : 'left-4.5'}`}></div>
              </div>
            </button>
            <button type="button" onClick={() => handleToggle('editorsPick')} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${formData.editorsPick ? 'bg-amber-500/10 border-amber-500 text-amber-600' : 'bg-chalk border-line text-muted'}`}>
              <span className="text-sm font-medium">انتخاب سردبیر</span>
              <div className={`w-9 h-5 rounded-full relative transition-colors ${formData.editorsPick ? 'bg-amber-500' : 'bg-line'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.editorsPick ? 'left-0.5' : 'left-4.5'}`}></div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}