import type { Metadata } from 'next';
import Link from 'next/link';
import { and, asc, count, eq, gt, gte, ilike, inArray, lte, max, or, SQL } from 'drizzle-orm';
import { db } from '@/lib/db';
import { categories, products } from '@/db/schema';
import { getProductSortOrder, PRODUCT_PAGE_SIZE, productCatalogSelection } from '@/lib/product-catalog';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import AdvancedFilters from '@/components/storefront/AdvancedFilters';
import LoadMoreProducts from '@/components/storefront/LoadMoreProducts';
import { ArrowLeft, ArrowUpLeft, Search, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'محصولات | فاطمه بیوتی لند',
  description: 'کالکشن محصولات آرایشی و مراقبتی فاطمه بیوتی لند؛ جست‌وجو، مقایسه و انتخاب آگاهانه محصولات.',
  alternates: { canonical: '/products' },
};

export const instant = false;

type ProductSearchParams = {
  q?: string;
  category?: string;
  skinTypes?: string;
  brands?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: string;
  sort?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductSearchParams>;
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
    sort = 'newest',
  } = params;

  const searchTerm = q.trim().slice(0, 120);
  const [brandRows, skinTypeRows, priceRows, categoryRows] = await Promise.all([
    db.select({ brand: products.brand }).from(products)
      .where(and(eq(products.status, 'published'), gt(products.price, 0)))
      .groupBy(products.brand).orderBy(asc(products.brand)),
    db.select({ skinType: products.skinType }).from(products)
      .where(and(eq(products.status, 'published'), gt(products.price, 0)))
      .groupBy(products.skinType).orderBy(asc(products.skinType)),
    db.select({ maxPrice: max(products.price) }).from(products)
      .where(and(eq(products.status, 'published'), gt(products.price, 0))),
    db.select().from(categories).orderBy(asc(categories.name)),
  ]);

  const uniqueBrands = brandRows.map((row) => row.brand).filter((value): value is string => Boolean(value?.trim()));
  const uniqueSkinTypes = skinTypeRows.map((row) => row.skinType).filter((value): value is string => Boolean(value?.trim()));
  const highestPrice = Math.max(Number(priceRows[0]?.maxPrice ?? 0), 5_000_000);
  const selectedCategory = categoryRows.find((item) => item.slug === category);
  const invalidCategory = Boolean(category && !selectedCategory);

  const conditions: SQL[] = [eq(products.status, 'published')];
  if (searchTerm) {
    conditions.push(or(
      ilike(products.name, `%${searchTerm}%`),
      ilike(products.description, `%${searchTerm}%`),
      ilike(products.brand, `%${searchTerm}%`),
    )!);
  }
  if (selectedCategory) conditions.push(eq(products.categoryId, selectedCategory.id));

  const brandList = brands.split(',').map((value) => value.trim()).filter(Boolean);
  if (brandList.length > 0) conditions.push(inArray(products.brand, brandList));

  const skinTypeList = skinTypes.split(',').map((value) => value.trim()).filter(Boolean);
  if (skinTypeList.length > 0) conditions.push(inArray(products.skinType, skinTypeList));

  const minPriceValue = minPrice && Number.isFinite(Number(minPrice)) ? Math.max(0, Math.floor(Number(minPrice))) : null;
  const maxPriceValue = maxPrice && Number.isFinite(Number(maxPrice)) ? Math.max(0, Math.floor(Number(maxPrice))) : null;
  if (minPriceValue !== null) conditions.push(gte(products.price, minPriceValue));
  if (maxPriceValue !== null) conditions.push(lte(products.price, maxPriceValue));
  if (inStock === 'true') {
    conditions.push(gte(products.stock, 1), gt(products.price, 0));
  }

  let dbProducts: any[] = [];
  let totalResults = 0;
  if (!invalidCategory) {
    const [countRows, productRows] = await Promise.all([
      db.select({ total: count() }).from(products).where(and(...conditions)),
      db.select(productCatalogSelection).from(products).where(and(...conditions))
        .orderBy(...getProductSortOrder(sort)).limit(PRODUCT_PAGE_SIZE),
    ]);
    totalResults = Number(countRows[0]?.total ?? 0);
    dbProducts = productRows;
  }

  const filterData = {
    categories: categoryRows,
    brands: uniqueBrands,
    skinTypes: uniqueSkinTypes,
    maxPrice: highestPrice,
  };

  const initialQueryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === 'string' && value.trim()) initialQueryParams.set(key, value);
  });
  const initialQuery = initialQueryParams.toString();

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir').replace(/\/+$/, '');
  const jsonLdCollection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'محصولات فاطمه بیوتی لند',
    description: 'کالکشن محصولات آرایشی و مراقبتی فاطمه بیوتی لند',
    url: `${baseUrl}/products`,
    numberOfItems: totalResults,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalResults,
      itemListElement: dbProducts.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/products/${product.slug}`,
        name: product.name,
      })),
    },
  };

  return (
    <div className="fbl-catalog-page min-h-screen flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollection) }} />
      <Header />
      <main className="flex-1 pb-24 md:pb-16">
        <section className="fbl-catalog-hero">
          <div className="fbl-catalog-hero__ornament" aria-hidden="true" />
          <div className="container-custom fbl-catalog-hero__inner">
            <nav className="fbl-catalog-breadcrumb" aria-label="مسیر صفحه">
              <Link href="/">خانه</Link>
              <ArrowLeft size={13} aria-hidden="true" />
              <span aria-current="page">محصولات</span>
            </nav>
            <div className="fbl-catalog-hero__copy">
              <span className="fbl-catalog-eyebrow"><i aria-hidden="true" /> FATEMEH BEAUTY LAND <b>/</b> THE COLLECTION</span>
              <h1>زیبایی، با انتخابی آگاهانه.</h1>
              <p>محصولات را با آرامش ببینید، جزئیات را مقایسه کنید و انتخابی متناسب با نیاز خود داشته باشید.</p>
              <div className="fbl-catalog-hero__footnote">
                <span>کالکشن محصولات</span>
                <span aria-hidden="true" />
                <span>{totalResults.toLocaleString('fa-IR')} محصول</span>
              </div>
            </div>
            <div className="fbl-catalog-hero__seal" aria-hidden="true">
              <span className="fbl-catalog-hero__seal-ring" />
              <Sparkles size={28} strokeWidth={1.1} />
              <small>CARE · BEAUTY · YOU</small>
            </div>
          </div>
        </section>

        <section className="container-custom fbl-catalog-main px-4 md:px-6" aria-labelledby="fbl-catalog-section-title">
          <div className="fbl-catalog-overview">
            <div className="fbl-catalog-overview__copy">
              <span className="fbl-catalog-overline">DISCOVER YOUR ROUTINE</span>
              <h2 id="fbl-catalog-section-title">کالکشن فاطمه بیوتی لند</h2>
              <p>برای پیدا کردن محصول مناسب، از جست‌وجو و فیلترهای تخصصی استفاده کنید.</p>
            </div>
            <form action="/products" method="get" role="search" className="fbl-catalog-search">
              <label className="sr-only" htmlFor="fbl-product-search">جست‌وجوی محصولات</label>
              <Search size={19} aria-hidden="true" />
              <input id="fbl-product-search" type="search" name="q" defaultValue={searchTerm}
                placeholder="نام محصول، برند یا عبارت موردنظر..." autoComplete="off" />
              {category && <input type="hidden" name="category" value={category} />}
              {brands && <input type="hidden" name="brands" value={brands} />}
              {skinTypes && <input type="hidden" name="skinTypes" value={skinTypes} />}
              {minPrice && <input type="hidden" name="minPrice" value={minPrice} />}
              {maxPrice && <input type="hidden" name="maxPrice" value={maxPrice} />}
              {inStock && <input type="hidden" name="inStock" value={inStock} />}
              {sort && <input type="hidden" name="sort" value={sort} />}
              <button type="submit" aria-label="جست‌وجو"><ArrowUpLeft size={18} aria-hidden="true" /></button>
            </form>
          </div>

          {categoryRows.length > 0 && (
            <nav className="fbl-catalog-category-rail" aria-label="دسته‌بندی سریع محصولات">
              <Link href="/products" className={!category ? 'is-active' : ''}>همه محصولات</Link>
              {categoryRows.slice(0, 6).map((item) => {
                const nextParams = new URLSearchParams(initialQuery);
                nextParams.set('category', item.slug);
                return <Link key={item.id} href={`/products?${nextParams.toString()}`} className={category === item.slug ? 'is-active' : ''}>{item.name}</Link>;
              })}
            </nav>
          )}

          <div className="fbl-catalog-results-layout">
            <AdvancedFilters data={filterData} totalResults={totalResults} />
            {dbProducts.length === 0 ? (
              <div className="fbl-catalog-empty" role="status" aria-live="polite">
                <span className="fbl-catalog-empty__icon"><Search size={25} aria-hidden="true" /></span>
                <span className="fbl-catalog-overline">NO MATCHING PRODUCTS</span>
                <h2>محصولی با این مشخصات پیدا نشد.</h2>
                <p>می‌توانید عبارت جست‌وجو یا فیلترهای انتخاب‌شده را تغییر دهید.</p>
                <Link href="/products">مشاهده همه محصولات <ArrowLeft size={15} aria-hidden="true" /></Link>
              </div>
            ) : (
              <LoadMoreProducts
                key={JSON.stringify(params)}
                initialProducts={dbProducts as any[]}
                queryString={initialQuery}
                initialHasMore={totalResults > dbProducts.length}
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
