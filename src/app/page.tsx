import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  title: 'فروشگاه آنلاین محصولات آرایشی و بهداشتی',
  description: 'خرید آنلاین محصولات آرایشی و مراقبت پوست با تضمین اصالت، ارسال سریع و پرداخت امن. فاطمه بیوتی لند، همراه زیبایی شما.',
  openGraph: {
    title: 'فاطمه بیوتی لند',
    description: 'فروشگاه لوکس محصولات آرایشی و بهداشتی',
    type: 'website',
  },
};
import Link from 'next/link';
import { ArrowLeft, ArrowUpLeft, BadgeCheck, BookOpenText, PackageCheck, Search, Sparkles, Droplets, Flame, Heart, Wind, Star } from 'lucide-react';
import Header from '@/components/storefront/Header';
import HomeBannerCarousel from '@/components/storefront/HomeBannerCarousel';
import homeBanners from '@/data/home-banners.json';
import Footer from '@/components/storefront/Footer';
import RecentlyViewed from '@/components/storefront/RecentlyViewed';
import HomeProductShelf from '@/components/storefront/HomeProductShelf';
import SafeImage from '@/components/product/SafeImage';
import { getCachedPublishedProducts } from '@/lib/products';
import { formatToman } from '@/lib/currency';
import { getPublicProductDescription, getPublicProductImage } from '@/lib/product-content';
import { db } from '@/lib/db';
import { categories, siteSettings, orderItems, orders } from '@/db/schema';
import { desc, eq, inArray, sql } from 'drizzle-orm';
export const instant = false;

const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes('skin') || s.includes('care') || s.includes('پوست')) return Droplets;
  if (s.includes('makeup') || s.includes('آرایش')) return Sparkles;
  if (s.includes('hair') || s.includes('مو')) return Wind;
  if (s.includes('perfume') || s.includes('عطر')) return Flame;
  if (s.includes('body') || s.includes('بدن')) return Heart;
  return Star;
};

const jsonLdHomeFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "چطور از قیمت و موجودی محصول مطلع شوم؟", acceptedAnswer: { "@type": "Answer", text: "قیمت و وضعیت موجودی در صفحه اختصاصی محصول نمایش داده می‌شود." } },
    { "@type": "Question", name: "چطور سفارش خود را ثبت کنم؟", acceptedAnswer: { "@type": "Answer", text: "محصول را انتخاب کنید، به سبد خرید اضافه کنید و مراحل تسویه‌حساب را تکمیل کنید." } },
    { "@type": "Question", name: "چطور وضعیت سفارش را پیگیری کنم؟", acceptedAnswer: { "@type": "Answer", text: "از صفحه رهگیری سفارش و با اطلاعات درخواستی، وضعیت سفارش خود را بررسی کنید." } }
  ]
};

export default async function Home() {
  const dbProducts = await getCachedPublishedProducts();
  const newProducts = dbProducts.filter((product) => product.price > 0).slice(0, 8);
  const featuredProducts = dbProducts.filter((product) => product.isFeatured && product.price > 0).slice(0, 8);
  const discountedProducts = dbProducts
    .filter((product) =>
      product.price > 0 &&
      product.stock > 0 &&
      typeof product.compareAtPrice === 'number' &&
      product.compareAtPrice > product.price
    )
    .sort((a, b) => {
      const aDiscount = (a.compareAtPrice! - a.price) / a.compareAtPrice!;
      const bDiscount = (b.compareAtPrice! - b.price) / b.compareAtPrice!;
      return bDiscount - aDiscount;
    })
    .slice(0, 8);

  const dbCategories = await db.select().from(categories).orderBy(desc(categories.createdAt)).limit(24);
  const categoryCounts = new Map<string, number>();
  for (const product of dbProducts) {
    if (product.categoryId) {
      categoryCounts.set(product.categoryId, (categoryCounts.get(product.categoryId) ?? 0) + 1);
    }
  }
  const categoriesWithProducts = dbCategories
    .map((category) => ({ ...category, productCount: categoryCounts.get(category.id) ?? 0 }))
    .filter((category) => category.productCount > 0)
    .slice(0, 6);

  // رتبه‌بندی پرفروش‌ها فقط بر اساس سفارش‌هایی که پرداختشان تأیید شده است.
  let bestSellerRows: Array<{ productId: string; totalSold: number }> = [];
  try {
    bestSellerRows = await db
      .select({
        productId: orderItems.productId,
        totalSold: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`.mapWith(Number),
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(inArray(orders.status, ['paid', 'processing', 'shipped', 'delivered']))
      .groupBy(orderItems.productId)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(12);
  } catch (error) {
    console.error('[homepage] Unable to calculate best sellers:', error);
  }

  const publishedProductsById = new Map<string, (typeof dbProducts)[number]>(
    dbProducts.map((product) => [product.id, product] as const)
  );
  const bestSellerProducts = bestSellerRows
    .map((row) => publishedProductsById.get(row.productId))
    .filter((product): product is (typeof dbProducts)[number] =>
      Boolean(product && product.price > 0 && product.stock > 0)
    )
    .slice(0, 8);

  const toShelfProduct = (product: (typeof dbProducts)[number]) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    description: getPublicProductDescription(product.description),
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.stock,
    mainImage: getPublicProductImage(product.mainImage),
  });
  const [homeBannerSetting] = await db.select({ value: siteSettings.value })
    .from(siteSettings)
    .where(eq(siteSettings.key, 'homeBannerConfig'))
    .limit(1);
  type ManagedBanner = { id: string; image: string; mobileImage?: string; alt: string; href?: string; active?: boolean; order?: number; objectPosition?: string };
  type ManagedBannerConfig = { slides?: ManagedBanner[]; autoPlay?: boolean; intervalMs?: number };
  const managedBannerConfig = homeBannerSetting?.value as ManagedBannerConfig | null | undefined;
  const homeBannerSlides: ManagedBanner[] = Array.isArray(managedBannerConfig?.slides)
    ? managedBannerConfig.slides
        .filter((slide) => slide && slide.active !== false && typeof slide.image === 'string' && typeof slide.id === 'string')
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : (homeBanners as ManagedBanner[]);
  const homeBannerInterval = typeof managedBannerConfig?.intervalMs === 'number' ? managedBannerConfig.intervalMs : 5600;
  const homeBannerAutoPlay = managedBannerConfig?.autoPlay !== false;
  // هر محصول فقط در یک ویترین صفحه اصلی نمایش داده شود.
  // اولویت نمایش: تخفیف‌دار، پرفروش، تازه‌رسیده و سپس منتخب فروشگاه.
  const usedHomepageProductIds = new Set<string>();
  const takeUniqueHomepageProducts = (products: typeof dbProducts) => {
    const selected = products
      .filter((product) => !usedHomepageProductIds.has(product.id))
      .slice(0, 8);
    for (const product of selected) usedHomepageProductIds.add(product.id);
    return selected;
  };
  const homepageDiscountedProducts = takeUniqueHomepageProducts(discountedProducts);
  const homepageBestSellerProducts = takeUniqueHomepageProducts(bestSellerProducts);
  const homepageNewProducts = takeUniqueHomepageProducts(newProducts);
  const homepageFeaturedProducts = takeUniqueHomepageProducts(featuredProducts);

  return (
    <div className="min-h-screen flex flex-col relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHomeFaq) }} />
      <Header />
      <main className="flex-1 relative z-10">
        
        {homeBannerSlides.length > 0 ? (
          <>
            <HomeBannerCarousel slides={homeBannerSlides} interval={homeBannerInterval} autoPlay={homeBannerAutoPlay} />
            <section className="container-custom px-4 pt-7 pb-2 md:pt-9">
              <h1 className="text-xl md:text-2xl font-black text-[#28242b] tracking-tight">
                فروشگاه آنلاین محصولات آرایشی و بهداشتی
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-8 text-[#77717b]">
                در فاطمه بیوتی لند می‌توانید محصولات آرایشی و مراقبت پوست و مو را بررسی کنید و با مشاهده مشخصات و قیمت، انتخاب آگاهانه‌تری داشته باشید.
              </p>
            </section>
          </>
      ) : (
<section className="fl-home-hero">
          <div className="container-custom fl-hero-grid">
            <div className="fl-hero-copy-wrap">
              <span className="fl-eyebrow"><span className="fl-eyebrow-dot" />FATEMEH BEAUTY LAND / BEAUTY & CARE</span>
              <h1 className="fl-hero-title">زیبایی، با <span>انتخابی آگاهانه.</span></h1>
              <p className="fl-hero-copy">محصولات آرایشی و مراقبتی را با آرامش بررسی کنید؛ مشخصات، تصاویر، قیمت و وضعیت موجودی هر محصول در صفحه اختصاصی آن قرار می‌گیرد.</p>
              <div className="fl-hero-actions">
                <Link href="/products" className="btn-primary">مشاهده محصولات <ArrowLeft size={16} /></Link>
                <Link href="/about" className="btn-secondary">آشنایی با ما</Link>
              </div>
              <div className="fl-hero-meta">
                <span><BadgeCheck size={14} /> مشخصات محصول</span>
                <span><Search size={14} /> جست‌وجوی آسان</span>
                <span><PackageCheck size={14} /> رهگیری سفارش</span>
              </div>
            </div>
            <div className="fl-hero-art" aria-label="هویت بصری">
              <div className="fl-hero-art-top"><span>FATEMEH BEAUTY LAND</span><span>BEAUTY · CARE</span></div>
              <div className="fl-orbit" aria-hidden="true" />
              <div className="fl-hero-art-mark">
                <SafeImage src="/logo.png" alt="نشان" width={174} height={174} priority />
              </div>
              <div className="fl-hero-art-caption">
                <div><strong>فاطمه بیوتی لند</strong><br /><span>زیبایی در جزئیات انتخاب</span></div>
                <Sparkles size={19} color="#c61d70" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </section>
        )}

        <section className="container-custom">
          <div className="fl-feature-strip">
            <div className="fl-feature"><span className="fl-feature-icon"><BookOpenText size={16} /></span><span>اطلاعات ثبت‌شده محصول</span></div>
            <div className="fl-feature"><span className="fl-feature-icon"><Search size={16} /></span><span>بررسی و مقایسه آسان</span></div>
            <div className="fl-feature"><span className="fl-feature-icon"><PackageCheck size={16} /></span><span>دسترسی به رهگیری سفارش</span></div>
          </div>
        </section>

        {categoriesWithProducts.length > 0 && (
          <section className="container-custom fl-section fl-home-categories" aria-labelledby="home-categories-title">
            <div className="fl-section-head">
              <div>
                <span className="fl-section-kicker">SHOP BY CATEGORY</span>
                <h2 className="fl-section-title" id="home-categories-title">از کجا شروع کنیم؟</h2>
                <p className="fl-section-note">دسته‌بندی موردنظرتان را انتخاب کنید و محصولات مرتبط را ببینید.</p>
              </div>
              <Link href="/products" className="fl-text-link">
                همه دسته‌ها
                <ArrowUpLeft size={15} aria-hidden="true" />
              </Link>
            </div>

            <div className="fl-home-category-grid">
              {categoriesWithProducts.map((category, index) => {
                const Icon = getCategoryIcon(category.slug);
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    className="fl-home-category-card"
                  >
                    <span className="fl-home-category-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="fl-home-category-icon"><Icon size={23} strokeWidth={1.65} /></span>
                    <span className="fl-home-category-title">{category.name}</span>
                    <span className="fl-home-category-bottom">
                      <span>{category.productCount.toLocaleString('fa-IR')} محصول</span>
                      <ArrowLeft size={14} aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {homepageDiscountedProducts.length > 0 && (
          <HomeProductShelf
            eyebrow="SPECIAL OFFERS"
            title="پیشنهادهای تخفیف‌دار"
            description="محصولاتی که قیمت قبلی و قیمت فروش آن‌ها در فروشگاه ثبت شده است."
            products={homepageDiscountedProducts.map(toShelfProduct)}
            variant="sale"
            actionLabel="مشاهده همه تخفیف‌ها"
            actionHref="/products"
          />
        )}

        {homepageBestSellerProducts.length > 0 && (
          <HomeProductShelf
            eyebrow="CUSTOMER FAVORITES"
            title="پرفروش‌های فروشگاه"
            description="مرتب‌شده بر اساس تعداد اقلام ثبت‌شده در سفارش‌های پرداخت‌شده و در حال انجام."
            products={homepageBestSellerProducts.map(toShelfProduct)}
            variant="bestseller"
            actionLabel="مشاهده همه محصولات"
          />
        )}

        {homepageNewProducts.length > 0 ? (
          <HomeProductShelf
            eyebrow="NEW ARRIVALS"
            title="تازه‌رسیده‌ها"
            description="جدیدترین محصولات منتشرشده در فاطمه بیوتی لند."
            products={homepageNewProducts.map(toShelfProduct)}
            variant="new"
            actionLabel="مشاهده همه محصولات"
          />
        ) : (
          <section className="container-custom fl-section">
            <div className="fl-empty-state">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f7] text-[#c61d70]">
                <PackageCheck size={22} />
              </div>
              <h2 className="text-sm font-bold text-[#28242b]">محصولی برای نمایش ثبت نشده است</h2>
              <p className="mt-2 text-xs text-[#77717b]">پس از انتشار محصولات قیمت‌گذاری‌شده از پنل مدیریت، آن‌ها در این بخش نمایش داده می‌شوند.</p>
            </div>
          </section>
        )}

        {homepageFeaturedProducts.length > 0 && (
          <HomeProductShelf
            eyebrow="STORE EDIT"
            title="انتخاب فاطمه بیوتی لند"
            description="محصولاتی که در پنل مدیریت به‌عنوان پیشنهاد منتخب مشخص شده‌اند."
            products={homepageFeaturedProducts.map(toShelfProduct)}
            variant="featured"
            actionLabel="مشاهده محصولات منتخب"
          />
        )}
        <section className="container-custom pb-10">
          <div className="fl-editorial-panel bg-white/60 backdrop-blur-md">
            <div className="fl-editorial-visual" aria-hidden="true" />
            <div className="fl-editorial-copy">
              <span className="fl-section-kicker">A BETTER WAY TO CHOOSE</span>
              <h2>قبل از انتخاب، جزئیات را ببینید.</h2>
              <p>نام محصول، توضیحات ثبت‌شده، تصاویر، مشخصات و وضعیت موجودی را در یک صفحه بررسی کنید. فاطمه بیوتی لند تلاش می‌کند مسیر آشنایی با محصول و ثبت سفارش را روشن و قابل فهم نگه دارد.</p>
              <Link href="/products" className="btn-primary mt-5 w-fit">بررسی محصولات <ArrowLeft size={15} /></Link>
            </div>
          </div>
        </section>

        <section className="container-custom fl-section pt-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-5 text-center">
              <span className="fl-section-kicker">HELP / FAQ</span>
              <h2 className="fl-section-title">پاسخ چند سؤال کاربردی</h2>
            </div>
            <div className="fl-faq-list">
              <details className="fl-faq-item bg-white/60 backdrop-blur-md"><summary>چطور از قیمت و موجودی محصول مطلع شوم؟</summary><div className="fl-faq-answer">قیمت و وضعیت موجودی در صفحه اختصاصی محصول نمایش داده می‌شود. اگر قیمت محصول ثبت نشده باشد، امکان افزودن آن به سبد خرید فعال نخواهد بود.</div></details>
              <details className="fl-faq-item bg-white/60 backdrop-blur-md"><summary>چطور سفارش خود را ثبت کنم؟</summary><div className="fl-faq-answer">محصول دارای قیمت و موجودی را انتخاب کنید، به سبد خرید اضافه کنید و مراحل تسویه‌حساب را تکمیل کنید.</div></details>
              <details className="fl-faq-item bg-white/60 backdrop-blur-md"><summary>چطور وضعیت سفارش را پیگیری کنم؟</summary><div className="fl-faq-answer">پس از ثبت سفارش، از صفحه رهگیری سفارش و با اطلاعات درخواستی، وضعیت سفارش خود را بررسی کنید.</div></details>
            </div>
            <div className="mt-5 text-center"><Link href="/faq" className="fl-text-link">مشاهده راهنمای خرید <ArrowUpLeft size={15} /></Link></div>
          </div>
        </section>

        <RecentlyViewed />

      </main>
      <Footer />
    </div>
  );
}