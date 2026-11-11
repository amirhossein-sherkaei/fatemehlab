'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Edit, Plus, Search, BookOpen, Sparkles, Eye } from 'lucide-react';
import { toast } from 'sonner';


const categoryLabels: Record<string, string> = {
  education: 'آموزش',
  'buying-guide': 'راهنمای خرید',
  skincare: 'مراقبت پوست',
  haircare: 'مراقبت مو',
  makeup: 'آرایشی',
};

export default function ArticlesClient({ initialArticles }: { initialArticles: any[] }) {
  const router = useRouter();
  const [articlesList, setArticlesList] = useState(initialArticles);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این مقاله مطمئن هستید؟')) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticlesList(articlesList.filter(a => a.id !== id));
        toast.success('مقاله حذف شد');
        router.refresh();
      } else toast.error('خطا در حذف مقاله');
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setIsDeleting(null); }
  };

  const filtered = articlesList.filter(a => a.title.includes(searchTerm) || a.slug.includes(searchTerm));

  const stats = {
    total: articlesList.length,
    published: articlesList.filter(a => a.status === 'published').length,
    featured: articlesList.filter(a => a.featured).length,
    drafts: articlesList.filter(a => a.status === 'draft').length,
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">مدیریت مجله</h1>
          <p className="text-sm text-muted mt-1">مدیریت کامل مقالات و محتوای مجله</p>
        </div>
        <Link href="/admin/articles/new" className="flex items-center gap-2 px-5 py-2.5 bg-ink text-white rounded-lg text-sm font-medium hover:bg-ink/90 transition-colors shadow-sm w-full sm:w-auto justify-center">
          <Plus size={18} />
          مقاله جدید
        </Link>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} className="text-blue-500" />
            <span className="text-xs text-muted">کل مقالات</span>
          </div>
          <p className="text-2xl font-black text-ink">{stats.total}</p>
        </div>
        <div className="bg-white border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} className="text-emerald-500" />
            <span className="text-xs text-muted">منتشر شده</span>
          </div>
          <p className="text-2xl font-black text-ink">{stats.published}</p>
        </div>
        <div className="bg-white border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-rose-500" />
            <span className="text-xs text-muted">شاخص</span>
          </div>
          <p className="text-2xl font-black text-ink">{stats.featured}</p>
        </div>
        <div className="bg-white border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Edit size={16} className="text-amber-500" />
            <span className="text-xs text-muted">پیش‌نویس</span>
          </div>
          <p className="text-2xl font-black text-ink">{stats.drafts}</p>
        </div>
      </div>

      {/* جستجو */}
      <div className="bg-white border border-line rounded-xl p-4">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted" />
          <input type="text" placeholder="جستجو در مقالات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-9 pl-4 py-2 bg-chalk border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage/50" />
        </div>
      </div>

      {/* لیست مقالات */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-line rounded-2xl p-12 text-center">
          <BookOpen size={48} className="mx-auto text-muted/40 mb-4" />
          <h3 className="font-bold text-ink mb-2">مقاله‌ای یافت نشد</h3>
          <p className="text-sm text-muted mb-6">اولین مقاله مجله را بسازید و تجربه‌ای زیبا برای مخاطبان خود ایجاد کنید.</p>
          <Link href="/admin/articles/new" className="btn-primary inline-flex">
            <Plus size={16} />
            ساخت اولین مقاله
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article) => (
            <div key={article.id} className="bg-white border border-line rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
              {/* کاور */}
              <div className="aspect-video relative bg-gradient-to-br from-pink-50 to-purple-50">
                {article.coverImage ? (
                  <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen size={32} className="text-sage/30" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  {article.featured && (
                    <span className="bg-rose text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={9} /> شاخص
                    </span>
                  )}
                  {article.editorsPick && (
                    <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">سردبیر</span>
                  )}
                </div>
                <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${article.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {article.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                </span>
              </div>

              {/* محتوا */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-sage bg-sage/10 px-2 py-0.5 rounded">
                    {categoryLabels[article.category] || article.category}
                  </span>
                  <span className="text-[10px] text-muted">{new Date(article.createdAt).toLocaleDateString('fa-IR')}</span>
                </div>
                <h3 className="font-bold text-sm text-ink mb-1 line-clamp-2">{article.title}</h3>
                {article.excerpt && <p className="text-xs text-muted line-clamp-2 mb-3">{article.excerpt}</p>}
                
                <div className="flex gap-2 pt-3 border-t border-line">
                  <Link href={`/admin/articles/${article.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-chalk text-ink text-xs font-bold rounded-lg border border-line hover:bg-white hover:border-sage transition-colors">
                    <Edit size={13} /> ویرایش
                  </Link>
                  <Link href={`/journal/${article.slug}`} target="_blank" className="p-2 bg-chalk text-ink rounded-lg border border-line hover:bg-white hover:border-sage transition-colors" title="مشاهده در سایت">
                    <Eye size={13} />
                  </Link>
                  <button onClick={() => handleDelete(article.id)} disabled={isDeleting === article.id} className="p-2 bg-rose/5 text-rose rounded-lg border border-rose/20 hover:bg-rose/10 transition-colors disabled:opacity-50" title="حذف">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}