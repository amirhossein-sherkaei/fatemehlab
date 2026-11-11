'use client';
import { Trash2, Edit, Search, Plus, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { formatTomanPlain } from '@/lib/currency';


export default function ProductsPage({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [productsList, setProductsList] = useState(initialProducts);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductsList(productsList.filter(p => p.id !== id));
        toast.success('محصول حذف شد');
        router.refresh();
      } else toast.error('خطا در حذف محصول');
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setIsDeleting(null); }
  };

  const filtered = productsList.filter(p => p.name.includes(searchTerm) || p.slug.includes(searchTerm));

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl">مدیریت محصولات</h1>
          <p className="mt-1 text-xs text-[#77717b] md:text-sm">{productsList.length} محصول در فروشگاه ثبت شده است</p>
        </div>
        <Link href="/admin/products/new" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#28242b] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 sm:w-auto">
          <Plus size={18} /> محصول جدید
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white shadow-sm">
        <div className="border-b border-[#e9e5eb] p-4">
          <div className="relative max-w-sm">
            <Search className="absolute right-3 top-3 h-4 w-4 text-[#918a95]" />
            <input type="text" placeholder="جستجوی محصول..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] py-2.5 pl-4 pr-9 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" />
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-[#e9e5eb] bg-[#fafafc] text-[#77717b]">
              <tr>
                <th className="px-6 py-4 font-medium">محصول</th>
                <th className="px-6 py-4 font-medium">قیمت (تومان)</th>
                <th className="px-6 py-4 font-medium">موجودی</th>
                <th className="px-6 py-4 font-medium">وضعیت</th>
                <th className="px-6 py-4 text-left font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e5eb]">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-[#77717b]">محصولی یافت نشد.</td></tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-[#fafafc]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#e9e5eb] bg-[#f8f7fa]">
                          {product.mainImage ? <Image src={product.mainImage} alt={product.name} fill className="object-cover" /> : <Package size={20} className="text-[#918a95]" />}
                        </div>
                        <div><span className="block font-bold text-[#28242b]">{product.name}</span><span className="text-[10px] text-[#77717b]" dir="ltr">{product.slug}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#77717b]" dir="auto">{product.price > 0 ? formatTomanPlain(product.price) : 'تعیین نشده'}</td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold ${product.stock > 0 ? 'text-[#28242b] bg-[#f8f7fa]' : 'text-rose-600 bg-rose-50'}`}>{product.stock.toLocaleString('fa-IR')}</span></td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${product.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{product.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`} className="rounded-lg bg-[#f8f7fa] p-2 text-[#28242b] transition-colors hover:bg-[#e9e5eb]" title="ویرایش"><Edit size={16} /></Link>
                        <button onClick={() => handleDelete(product.id)} disabled={isDeleting === product.id} className="rounded-lg bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50" title="حذف">{isDeleting === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {filtered.length === 0 ? (<p className="py-10 text-center text-sm text-[#77717b]">محصولی یافت نشد.</p>) : (
            filtered.map((product) => (
              <div key={product.id} className="rounded-2xl border border-[#e9e5eb] bg-white p-4 shadow-sm">
                <div className="mb-3 flex gap-3">
                  <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#e9e5eb] bg-[#f8f7fa]">
                    {product.mainImage ? <Image src={product.mainImage} alt={product.name} fill className="object-cover" /> : <Package size={20} className="text-[#918a95]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-[#28242b]">{product.name}</h3>
                    <span className={`mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold ${product.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{product.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}</span>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-[#f8f7fa] p-2 text-center text-xs">
                  <div><span className="mb-1 block text-[10px] text-[#77717b]">قیمت</span><span className="font-bold">{product.price > 0 ? formatTomanPlain(product.price) : 'تعیین نشده'}</span></div>
                  <div className="border-r border-[#e9e5eb]"><span className="mb-1 block text-[10px] text-[#77717b]">موجودی</span><span className={`font-bold ${product.stock > 0 ? 'text-[#28242b]' : 'text-rose-500'}`}>{product.stock}</span></div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/products/${product.id}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#f8f7fa] py-2.5 text-xs font-bold text-[#28242b] border border-[#e9e5eb]"><Edit size={14} /> ویرایش</Link>
                  <button onClick={() => handleDelete(product.id)} disabled={isDeleting === product.id} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-600 disabled:opacity-50">{isDeleting === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} حذف</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}