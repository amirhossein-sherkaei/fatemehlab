import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { categories, products } from '@/db/schema';
import { and, desc, eq, ilike, SQL, gte, asc } from 'drizzle-orm';
import Link from 'next/link';
import SafeImage from '@/components/product/SafeImage';
import { ArrowLeft, Search, PackageSearch, Eye } from 'lucide-react';
import { formatToman } from '@/lib/currency';
import { getPublicProductDescription, getPublicProductImage } from '@/lib/product-content';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import ProductFilters from '@/components/storefront/ProductFilters';
import WishlistButton from '@/components/storefront/WishlistButton';
import QuickViewButton from '@/components/storefront/QuickViewButton';
import LoadMoreProducts from '@/components/storefront/LoadMoreProducts';

export const metadata: Metadata = {
  title: 'محصولات',
  description: 'محصولات آرایشی و مراقبتی فاطمه بیوتی لند را بررسی کنید و مشخصات، قیمت و وضعیت موجودی هر محصول را ببینید.',
};


export const instant = false;

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; category?: string; skinType?: string; brand?: string; sort?: string }> 
}) {
  const params = await searchParams;
  const { q = '', category = '', skinType = '', brand = '', sort = 'newest' } = params;
  const searchTerm = q.trim();

  // دریافت برندهای منحصر به فرد برای فیلتر
  const allPublished = await db.select({ brand: products.brand }).from(products).where(eq(products.status, 'published'));
  const uniqueBrands = Array.from(new Set(allPublished.map(p => p.brand).filter(Boolean))) as string[];

  const categoryRows = await db.select().from(categories).orderBy(categories.name);
  const selectedCategory = categoryRows.find((item) => item.slug === category);
  const invalidCategory = Boolean(category && !selectedCategory);

  const conditions: SQL[] = [eq(products.status, 'published')];
  if (searchTerm) conditions.push(ilike(products.name, `%${searchTerm}%`));
  if (selectedCategory) conditions.push(eq(products.categoryId, selectedCategory.id));
  if (skinType) conditions.push(eq(products.skinType, skinType));
  if (brand) conditions.push(eq(products.brand, brand));

  // مرتب‌سازی
  let orderBy = desc(products.createdAt);
  if (sort === 'cheapest') orderBy = asc(products.price);
  if (sort === 'expensive') orderBy = desc(products.price);

  const dbProducts = invalidCategory ? [] : await db.select().from(products).where(and(...conditions)).orderBy(orderBy).limit(12);

  const buildCategoryHref = (slug?: string) => {
    const p = new URLSearchParams();
    if (searchTerm) p.set('q', searchTerm);
    if (slug) p.set('category', slug);
    if (skinType) p.set('skinType', skinType);
    if (brand) p.set('brand', brand);
    if (sort !== 'newest') p.set('sort', sort);
    const query = p.toString();
    return query ? `/products?${query}` : '/products';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc]">
      <Header />
      <main className="flex-1 pb-32 md:pb-12">
        <section className="bg-white border-b border-[#e9e5eb] pt-10 pb-8 px-4 md:px-6">
          <div className="container-custom">
            <span className="fl-eyebrow"><span className="fl-eyebrow-dot" />FATEMEH BEAUTY LAND / PRODUCT CATALOG</span>
            <h1 className="text-2xl md:text-4xl font-black text-[#28242b] mt-3 mb-2">محصولات فاطمه بیوتی لند</h1>
            <p className="text-[#77717b] text-sm md:text-base max-w-2xl leading-relaxed">
              محصول موردنظرتان را پیدا کنید و برای مشاهده تصاویر، مشخصات ثبت‌شده، قیمت و وضعیت موجودی وارد صفحه آن شوید.
            </p>
          </div>
        </section>

        <section className="container-custom py-6 px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* فیلترهای دسکتاپ (سایدبار) */}
            <div className="hidden lg:block w-64 shrink-0 space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-[#e9e5eb] shadow-sm sticky top-24">
                <h3 className="font-black text-[#28242b] mb-4">دسته‌بندی‌ها</h3>
                <div className="flex flex-col gap-2 mb-6">
                  <Link href={buildCategoryHref()} className={`text-sm font-bold px-3 py-2 rounded-lg transition-colors ${!category ? 'bg-[#fff0f7] text-[#c61d70]' : 'text-[#77717b] hover:bg-[#fafafc]'}`}>همه محصولات</Link>
                  {categoryRows.map(item => (
                    <Link key={item.id} href={buildCategoryHref(item.slug)} className={`text-sm font-bold px-3 py-2 rounded-lg transition-colors ${category === item.slug ? 'bg-[#fff0f7] text-[#c61d70]' : 'text-[#77717b] hover:bg-[#fafafc]'}`}>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* محصولات و فیلترهای موبایل */}
            <div className="flex-1 min-w-0">
              
              {/* جستجو */}
              <form action="/products" method="get" className="relative w-full mb-6">
                <Search className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#99919d]" size={18} />
                <input 
                  type="search" 
                  name="q" 
                  defaultValue={searchTerm} 
                  placeholder="نام محصول را جست‌وجو کنید..." 
                  className="w-full h-12 pr-12 pl-4 bg-white border border-[#e9e5eb] rounded-xl focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-sm transition-all" 
                />
                {category && <input type="hidden" name="category" value={category} />}
              </form>

              {/* کامپوننت فیلترها و مرتب‌سازی */}
              <ProductFilters brands={uniqueBrands} />

              {/* تعداد نتایج */}
              <div className="mb-4 text-xs font-bold text-[#77717b]">
                {dbProducts.length.toLocaleString('fa-IR')} محصول یافت شد
              </div>

              {dbProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#e9e5eb]">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-[#fff0f7] text-[#c61d70]"><PackageSearch size={32} /></div>
                  <h2 className="text-lg font-black text-[#28242b] mb-2">محصولی پیدا نشد</h2>
                  <p className="text-sm text-[#77717b] mb-6">عبارت جست‌وجو یا فیلترها را تغییر دهید تا محصولات مرتبط را ببینید.</p>
                  <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20">
                    حذف همه فیلترها <ArrowLeft size={16} />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                  {dbProducts.map((product) => {
                    const hasPrice = product.price > 0;
                    const isAvailable = product.stock > 0 && hasPrice;
                    const productImage = getPublicProductImage(product.mainImage);
                    const productDescription = getPublicProductDescription(product.description);
                    
                    return (
                      <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col bg-white rounded-2xl border border-[#e9e5eb] overflow-hidden hover:shadow-xl hover:shadow-[#c61d70]/5 hover:-translate-y-1 transition-all duration-300">
                        <div className="relative aspect-square bg-[#fafafc] p-4">
                          {productImage ? (
                            <SafeImage src={productImage} alt={product.name} fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#c61d70]/20"><PackageSearch size={32} /></div>
                          )}
                          {!isAvailable && (
                            <span className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[9px] font-bold text-rose-500 shadow-sm">
                              {hasPrice ? 'ناموجود' : 'در انتظار قیمت'}
                            </span>
                          )}
                          <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                            <WishlistButton productId={product.id} />
                            <QuickViewButton product={product} />
                          </div>

                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          {product.brand && <span className="text-[10px] font-bold text-[#c61d70] mb-1">{product.brand}</span>}
                          <h2 className="text-sm md:text-base font-black text-[#28242b] mb-1 line-clamp-1 group-hover:text-[#c61d70] transition-colors">{product.name}</h2>
                          <p className="text-[10px] md:text-xs text-[#77717b] line-clamp-2 mb-3 flex-1">{productDescription || 'مشاهده مشخصات'}</p>
                          <div className="flex items-center justify-between border-t border-[#f5f0f2] pt-3 mt-auto">
                            <span className="text-xs md:text-sm font-black text-[#28242b]">{hasPrice ? formatToman(product.price) : '---'}</span>
                            <span className="w-7 h-7 rounded-full bg-[#fff0f7] text-[#c61d70] flex items-center justify-center group-hover:bg-[#c61d70] group-hover:text-white transition-colors">
                              <ArrowLeft size={14} />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}