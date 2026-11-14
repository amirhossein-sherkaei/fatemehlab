import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { categories, products } from '@/db/schema';
import { and, eq, ilike, SQL, gte, lte, inArray, or, desc, asc, max } from 'drizzle-orm';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import AdvancedFilters from '@/components/storefront/AdvancedFilters';
import LoadMoreProducts from '@/components/storefront/LoadMoreProducts';

export const metadata: Metadata = {
  title: 'محصولات | فاطمه بیوتی لند',
  description: 'فروشگاه محصولات آرایشی و بهداشتی فاطمه بیوتی لند',
};

export const instant = false;

export default async function ProductsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    q?: string; 
    category?: string; 
    skinTypes?: string; 
    brands?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
  }> 
}) {
  const params = await searchParams;
  const { 
    q = '', 
    category = '', 
    skinTypes = '', 
    brands = '',
    minPrice,
    maxPrice,
    inStock,
    sort = 'newest' 
  } = params;
  const searchTerm = q.trim();

  // دریافت داده‌های فیلتر
  const allPublished = await db.select({ brand: products.brand, skinType: products.skinType, price: products.price }).from(products).where(eq(products.status, 'published'));
  const uniqueBrands = Array.from(new Set(allPublished.map(p => p.brand).filter(Boolean))) as string[];
  const uniqueSkinTypes = Array.from(new Set(allPublished.map(p => p.skinType).filter(Boolean))) as string[];
  const highestPrice = Math.max(...allPublished.map(p => p.price), 5000000);

  const categoryRows = await db.select().from(categories).orderBy(categories.name);
  const selectedCategory = categoryRows.find((item) => item.slug === category);
  const invalidCategory = Boolean(category && !selectedCategory);

  // ساخت شرایط کوئری
  const conditions: SQL[] = [eq(products.status, 'published')];
  if (searchTerm) conditions.push(or(ilike(products.name, `%${searchTerm}%`), ilike(products.description, `%${searchTerm}%`))!);
  if (selectedCategory) conditions.push(eq(products.categoryId, selectedCategory.id));
  
  const brandList = brands.split(',').filter(Boolean);
  if (brandList.length > 0) conditions.push(inArray(products.brand, brandList));
  
  const skinTypeList = skinTypes.split(',').filter(Boolean);
  if (skinTypeList.length > 0) conditions.push(inArray(products.skinType, skinTypeList));
  
  if (minPrice) conditions.push(gte(products.price, parseInt(minPrice, 10)));
  if (maxPrice) conditions.push(lte(products.price, parseInt(maxPrice, 10)));
  if (inStock === 'true') conditions.push(gte(products.stock, 1));

  let orderBy: any = desc(products.createdAt);
  if (sort === 'cheapest') orderBy = asc(products.price);
  if (sort === 'expensive') orderBy = desc(products.price);

  const dbProducts = invalidCategory ? [] : await db.select().from(products).where(and(...conditions)).orderBy(orderBy).limit(12);

  const filterData = {
    categories: categoryRows,
    brands: uniqueBrands,
    skinTypes: uniqueSkinTypes,
    maxPrice: highestPrice,
  };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';
  const jsonLdCollection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "محصولات فاطمه بیوتی لند",
    description: "لیست کامل محصولات آرایشی و بهداشتی",
    url: `${baseUrl}/products`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: dbProducts.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/products/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollection) }} />
      <Header />
      <main className="flex-1 pb-32 md:pb-12 relative z-10">
        <section className="bg-white/70 backdrop-blur-md border-b border-[#e9e5eb] pt-10 pb-8 px-4 md:px-6">
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
            
            {/* سایدبار فیلتر */}
            <AdvancedFilters data={filterData} totalResults={dbProducts.length} />

            {/* محتوای اصلی */}
            <div className="flex-1 min-w-0">
              
              {/* جستجو */}
              <form action="/products" method="get" className="relative w-full mb-6">
                <input 
                  type="search" 
                  name="q" 
                  defaultValue={searchTerm} 
                  placeholder="نام محصول را جستجو کنید..." 
                  className="w-full h-12 pr-4 pl-4 bg-white/70 backdrop-blur-md border border-[#e9e5eb] rounded-xl focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-sm transition-all" 
                />
              </form>

              {/* تعداد نتایج */}
              <div className="mb-4 text-xs font-bold text-[#77717b] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c61d70]"></span>
                {dbProducts.length.toLocaleString('fa-IR')} محصول یافت شد
              </div>

              {dbProducts.length === 0 ? (
                <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-3xl border border-dashed border-[#e9e5eb]">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-[#fff0f7] text-[#c61d70]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                  <h2 className="text-lg font-black text-[#28242b] mb-2">محصولی پیدا نشد</h2>
                  <p className="text-sm text-[#77717b] mb-6">عبارت جستجو یا فیلترها را تغییر دهید.</p>
                </div>
              ) : (
                <LoadMoreProducts key={JSON.stringify(params)} initialProducts={dbProducts} />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}