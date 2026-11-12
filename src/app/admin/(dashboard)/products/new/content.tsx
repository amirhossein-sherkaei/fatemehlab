import { formatNumberInput, parseNumberInput } from '@/lib/format';
'use client';
import { useState } from 'react';
import { ArrowRight, Loader2, UploadCloud, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


const normalizeDigits = (str: string) => {
  return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
};

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  const [mainImage, setMainImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  
  const [formData, setFormData] = useState({ 
    name: '', slug: '', description: '', price: '', stock: '', status: 'draft', ingredients: '', usage: '' 
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
      stock: Number(normalizeDigits(formData.stock.toString())) || 0,
      mainImage: mainImage,
      gallery,
      specifications: specs.filter(s => s.key.trim() && s.value.trim()),
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { toast.success('محصول ذخیره شد'); router.push('/admin/products'); router.refresh(); }
      else toast.error(data.message);
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-white border border-border rounded-xl hover:bg-[#F8F9FA]"><ArrowRight className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold">افزودن محصول</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
        
        {/* تصویر کاور */}
        <div className="space-y-2">
          <label className="text-sm font-medium">تصویر کاور (اصلی)</label>
          <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center bg-[#F8F9FA] relative min-h-[150px]">
            {mainImage ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-sm">
                <img src={mainImage} alt="Cover" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setMainImage('')} className="absolute top-1 right-1 bg-rose text-white p-1 rounded-md text-xs">حذف</button>
              </div>
            ) : (
              <><UploadCloud className="w-8 h-8 text-muted-foreground mb-2" /><span className="text-sm text-muted-foreground">کلیک کنید</span><input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" /></>
            )}
            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-sage" /></div>}
          </div>
        </div>

        {/* گالری تصاویر */}
        <div className="space-y-2">
          <label className="text-sm font-medium">گالری تصاویر (چند عکس)</label>
          <div className="border-2 border-dashed border-border rounded-xl p-4 bg-[#F8F9FA] relative">
            <div className="flex flex-wrap gap-2 mb-4">
              {gallery.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-sm font-medium">نام محصول *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">شناسه (Slug) *</label><input type="text" name="slug" value={formData.slug} onChange={handleChange} required dir="ltr" placeholder="toner-vitabla" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50 font-mono text-sm" /></div>
        </div>

        <div className="space-y-2"><label className="text-sm font-medium">توضیحات کوتاه</label><textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-sm font-medium">قیمت (تومان)</label><input type="text" name="price" value={formatNumberInput(formData.price)} onChange={(e) => setFormData({ ...formData, price: parseNumberInput(e.target.value) as any })} dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">موجودی</label><input type="text" name="stock" value={formatNumberInput(formData.stock)} onChange={(e) => setFormData({ ...formData, stock: parseNumberInput(e.target.value) as any })} dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" /></div>
        </div>

        <div className="space-y-2"><label className="text-sm font-medium">وضعیت انتشار</label><select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl cursor-pointer"><option value="draft">پیش‌نویس</option><option value="published">منتشر شده</option></select></div>

        <hr className="border-border" />

        {/* مشخصات فنی */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">مشخصات فنی</label>
            <button type="button" onClick={handleAddSpec} className="text-sm text-sage flex items-center gap-1 hover:text-sage/80"><Plus className="w-4 h-4" /> افزودن</button>
          </div>
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input type="text" placeholder="عنوان (مثلاً حجم)" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} className="w-1/2 px-4 py-2 bg-[#F8F9FA] border border-border rounded-xl text-sm" />
              <input type="text" placeholder="مقدار (مثلاً ۲۰۰ml)" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="w-1/2 px-4 py-2 bg-[#F8F9FA] border border-border rounded-xl text-sm" />
              <button type="button" onClick={() => handleRemoveSpec(index)} className="p-2 text-rose hover:bg-rose/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-sm font-medium">مواد تشکیل‌دهنده</label><textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea></div>
          <div className="space-y-2"><label className="text-sm font-medium">روش استفاده</label><textarea name="usage" value={formData.usage} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea></div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end gap-3">
          <Link href="/admin/products" className="px-6 py-2.5 text-sm font-medium hover:bg-background-secondary rounded-lg">انصراف</Link>
          <button type="submit" disabled={loading || uploading || uploadingGallery} className="px-6 py-2.5 text-sm font-medium bg-sage text-white rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ذخیره محصول'}</button>
        </div>
      </form>
    </div>
  );
}