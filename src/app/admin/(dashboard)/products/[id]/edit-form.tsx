import { formatNumberInput, parseNumberInput } from '@/lib/format';
'use client';
import { useState } from 'react';
import { ArrowRight, Loader2, UploadCloud, Plus, Trash2, AlertCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { rialToToman } from '@/lib/currency';


const normalizeDigits = (str: string) => {
  return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
};

const SKIN_TYPES = ['همه انواع پوست', 'پوست خشک', 'پوست چرب', 'پوست مختلط', 'پوست حساس', 'پوست نرمال', 'موی خشک', 'موی چرب', 'موی معمولی'];

export default function EditForm({ product }: { product: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  const [mainImage, setMainImage] = useState(product.mainImage || '');
  const [gallery, setGallery] = useState<string[]>(product.gallery || []);
  const [specs, setSpecs] = useState<{key: string, value: string}[]>(
    product.specifications && product.specifications.length > 0 ? product.specifications : [{ key: '', value: '' }]
  );
  
  const [formData, setFormData] = useState({ 
    name: product.name, 
    slug: product.slug, 
    brand: product.brand || '',
    countryOfOrigin: product.countryOfOrigin || '',
    description: product.description || '', 
    price: rialToToman(product.price), 
    compareAtPrice: product.compareAtPrice ? rialToToman(product.compareAtPrice) : '',
    stock: product.stock, 
    status: product.status,
    skinType: product.skinType || '',
    expiryDate: product.expiryDate || '',
    warnings: product.warnings || '',
    ingredients: product.ingredients || '',
    usage: product.usage || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFile = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: data });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result.url;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setMainImage(url);
      toast.success('تصویر کاور آپلود شد');
    } catch (err: any) { toast.error(err.message); }
    finally { setUploading(false); }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      setGallery([...gallery, ...urls]);
      toast.success('تصاویر گالری آپلود شدند');
    } catch (err: any) { toast.error(err.message); }
    finally { setUploadingGallery(false); }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const handleRemoveSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      price: Number(normalizeDigits(formData.price.toString())) || 0,
      compareAtPrice: formData.compareAtPrice ? Number(normalizeDigits(formData.compareAtPrice.toString())) : null,
      stock: Number(normalizeDigits(formData.stock.toString())) || 0,
      mainImage: mainImage,
      gallery,
      specifications: specs.filter(s => s.key.trim() && s.value.trim()),
    };

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { toast.success('تغییرات ذخیره شد'); router.push('/admin/products'); router.refresh(); }
      else toast.error(data.message);
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-white border border-border rounded-xl hover:bg-[#F8F9FA]"><ArrowRight className="w-5 h-5" /></Link>
        <h1 className="text-xl md:text-2xl font-bold">ویرایش محصول</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl shadow-sm p-5 md:p-8 space-y-8">
        
        {/* ====== اطلاعات اصلی ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۱</span>
            اطلاعات اصلی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">نام محصول *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">شناسه (Slug) *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50 font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">برند (Brand)</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="مثلاً Vitabla" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">کشور سازنده</label>
              <input type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} placeholder="مثلاً کره جنوبی" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">توضیحات کوتاه</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea>
          </div>
        </section>

        {/* ====== قیمت و موجودی ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۲</span>
            قیمت و موجودی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">قیمت فروش (تومان)</label>
              <input type="text" name="price" value={formatNumberInput(formData.price)} onChange={(e) => setFormData({ ...formData, price: parseNumberInput(e.target.value) as any })} dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">قیمت قبل از تخفیف (اختیاری)</label>
              <input type="text" name="compareAtPrice" value={formatNumberInput(formData.compareAtPrice)} onChange={(e) => setFormData({ ...formData, compareAtPrice: parseNumberInput(e.target.value) as any })} dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">موجودی انبار</label>
              <input type="text" name="stock" value={formatNumberInput(formData.stock)} onChange={(e) => setFormData({ ...formData, stock: parseNumberInput(e.target.value) as any })} dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
          </div>
        </section>

        {/* ====== اطلاعات تخصصی ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۳</span>
            اطلاعات تخصصی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">نوع پوست / مو</label>
              <select name="skinType" value={formData.skinType} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl cursor-pointer">
                <option value="">انتخاب کنید...</option>
                {SKIN_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">تاریخ انقضا</label>
              <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="مثلاً 1405/06/15" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2"><AlertCircle size={16} className="text-amber-500"/> هشدارهای ایمنی (در صفحه محصول با رنگ زرد نمایش داده می‌شود)</label>
            <textarea name="warnings" value={formData.warnings} onChange={handleChange} rows={3} placeholder="مثلاً: در صورت داشتن پوست حساس، ابتدا تست حساسیت انجام دهید." className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400/50"></textarea>
          </div>
        </section>

        {/* ====== ترکیبات و روش استفاده ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۴</span>
            ترکیبات و روش استفاده
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">ترکیبات کامل (مطابق بسته‌بندی)</label>
            <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows={3} placeholder="لیست کامل ترکیبات..." className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">روش استفاده</label>
            <textarea name="usage" value={formData.usage} onChange={handleChange} rows={3} placeholder="روش استفاده توصیه‌شده توسط سازنده..." className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea>
          </div>
        </section>

        {/* ====== تصاویر ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۵</span>
            تصاویر محصول
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">تصویر اصلی</label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center bg-[#F8F9FA] relative min-h-[150px]">
              {mainImage ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-sm">
                  <img src={mainImage} alt="Cover" className="w-full h-full object-contain bg-white" />
                  <button type="button" onClick={() => setMainImage('')} className="absolute top-1 right-1 bg-rose text-white p-1 rounded-md text-xs">حذف</button>
                </div>
              ) : (
                <><UploadCloud className="w-8 h-8 text-muted-foreground mb-2" /><span className="text-sm text-muted-foreground">کلیک کنید</span><input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" /></>
              )}
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-sage" /></div>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">گالری تصاویر</label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 bg-[#F8F9FA] relative">
              <div className="flex flex-wrap gap-2 mb-4">
                {gallery.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-white">
                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-contain p-1" />
                    <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-0 right-0 bg-rose text-white p-0.5 rounded-bl-md"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
              <div className="relative flex items-center justify-center h-12">
                <span className="text-sm text-muted-foreground">برای آپلود چند عکس کلیک کنید</span>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploadingGallery} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              {uploadingGallery && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-sage" /></div>}
            </div>
          </div>
        </section>

        {/* ====== مشخصات فنی ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۶</span>
            مشخصات فنی
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">مثل حجم، وزن، ابعاد و...</p>
            <button type="button" onClick={handleAddSpec} className="text-sm text-sage flex items-center gap-1 hover:text-sage/80"><Plus className="w-4 h-4" /> افزودن ردیف</button>
          </div>
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input type="text" placeholder="عنوان (مثلاً حجم)" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} className="w-1/2 px-4 py-2 bg-[#F8F9FA] border border-border rounded-xl text-sm" />
              <input type="text" placeholder="مقدار (مثلاً ۲۰۰ml)" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="w-1/2 px-4 py-2 bg-[#F8F9FA] border border-border rounded-xl text-sm" />
              <button type="button" onClick={() => handleRemoveSpec(index)} className="p-2 text-rose hover:bg-rose/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </section>

        {/* ====== وضعیت انتشار ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۷</span>
            انتشار
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">وضعیت</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl cursor-pointer">
              <option value="draft">پیش‌نویس (در سایت دیده نمی‌شود)</option>
              <option value="published">منتشر شده (در سایت دیده می‌شود)</option>
            </select>
          </div>
        </section>

        <div className="pt-6 border-t border-border flex justify-end gap-3">
          <Link href="/admin/products" className="px-6 py-2.5 text-sm font-medium hover:bg-background-secondary rounded-lg">انصراف</Link>
          <button type="submit" disabled={loading || uploading || uploadingGallery} className="px-6 py-2.5 text-sm font-medium bg-sage text-white rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ذخیره تغییرات'}</button>
        </div>
      </form>
    </div>
  );
}