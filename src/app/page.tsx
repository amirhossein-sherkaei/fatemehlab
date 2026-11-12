import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpLeft, BadgeCheck, BookOpenText, PackageCheck, Search, Sparkles, Droplets, Flame, Heart, Wind, Star, ShoppingBag } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import RecentlyViewed from '@/components/storefront/RecentlyViewed';
import { getCachedPublishedProducts } from '@/lib/products';
import { formatToman } from '@/lib/currency';
import { getPublicProductDescription, getPublicProductImage } from '@/lib/product-content';
import { db } from '@/lib/db';
import { categories } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const instant = false;

// Map categories to elegant Lucide icons
const getCategoryIcon = (slug: string) => {
  const s = slug.toLowerCase();
  if (s.includes('skin') || s.includes('care') || s.includes('پوست')) return Droplets;
  if (s.includes('makeup') || s.includes('آرایش')) return Sparkles;
  if (s.includes('hair') || s.includes('مو')) return Wind;
  if (s.includes('perfume') || s.includes('عطر')) return Flame;
  if (s.includes('body') || s.includes('بدن')) return Heart;
  return Star;
};

export default async function Home() {
  const dbProducts = await getCachedPublishedProducts();
  const newProducts = dbProducts.slice(0, 4);
  const featuredProducts = dbProducts.filter(p => p.isFeatured).slice(0, 4);

  // Fetch top 6 categories
  const dbCategories = await db.select().from(categories).orderBy(desc(categories.createdAt)).limit(6);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ✨ افکت‌های نوری پس‌زمینه (Aurora Glow) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#fff0f7]/60 blur-[120px] animate-float-slow" />
        <div className="absolute top-[20%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#fce5f0]/50 blur-[100px] animate-float-slower" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#f8f7fa]/80 blur-[150px]" />
      </div>

      <Header />
      <main className="flex-1">
        {/* ===== HERO ===== */}
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
                <Image src="/logo.png" alt="نشان" width={174} height={174} priority />
              </div>
              <div className="fl-hero-art-caption">
                <div><strong>فاطمه بیوتی لند</strong><br /><span>زیبایی در جزئیات انتخاب</span></div>
                <Sparkles size={19} color="#c61d70" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURE STRIP ===== */}
        <section className="container-custom">
          <div className="fl-feature-strip">
            <div className="fl-feature"><span className="fl-feature-icon"><BookOpenText size={16} /></span><span>اطلاعات ثبت‌شده محصول</span></div>
            <div className="fl-feature"><span className="fl-feature-icon"><Search size={16} /></span><span>بررسی و مقایسه آسان</span></div>
            <div className="fl-feature"><span className="fl-feature-icon"><PackageCheck size={16} /></span><span>دسترسی به رهگیری سفارش</span></div>
          </div>
        </section>

        {/* ===== CATEGORIES ===== */}
        {dbCategories.length > 0 && (
          <section className="container-custom fl-section">
            <div className="fl-section-head">
              <div>
                <span className="fl-section-kicker">SHOP BY CATEGORY</span>
                <h2 className="fl-section-title">دسته‌بندی‌های محصولات</h2>
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
              {dbCategories.map((cat) => {
                const Icon = getCategoryIcon(cat.slug);
                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-[#e9e5eb] bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-[#c61d70]/30 hover:shadow-md"
                  >
                    <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#fff0f7] text-[#c61d70] transition-transform group-hover:scale-110">
                      <Icon size={24} strokeWidth={1.5} />
                    </div>
                    <span className="text-center text-xs font-bold text-[#28242b] md:text-sm">{cat.name}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ===== NEW ARRIVALS ===== */}
        <section className="container-custom fl-section">
          <div className="fl-section-head">
            <div>
              <span className="fl-section-kicker">NEW ARRIVALS</span>
              <h2 className="fl-section-title">تازه‌رسیده‌ها</h2>
              <p className="fl-section-note">جدیدترین محصولات اضافه شده به فروشگاه</p>
            </div>
            <Link href="/products" className="fl-text-link">همه محصولات <ArrowUpLeft size={16} /></Link>
          </div>

          {newProducts.length > 0 ? (
            <div className="fl-product-grid">
              {newProducts.map((product) => {
                const hasPrice = product.price > 0;
                const isAvailable = product.stock > 0 && hasPrice;
                const productImage = getPublicProductImage(product.mainImage);
                const productDescription = getPublicProductDescription(product.description);
                return (
                  <Link href={`/products/${product.slug}`} key={product.id} className="fl-product-card group">
                    <div className="fl-product-media">
                      {productImage ? (
                        <Image src={productImage} alt={`تصویر ${product.name}`} fill sizes="(max-width: 680px) 46vw, (max-width: 1024px) 30vw, 280px" />
                      ) : (
                        <div className="fl-product-placeholder" aria-hidden="true"><span className="absolute text-[10px] font-bold tracking-[.16em] text-[#b77b9a]">FATEMEHLAB</span></div>
                      )}
                      {!isAvailable && (
                        <span className="absolute right-3 top-3 rounded-lg border border-white/70 bg-white/90 px-2.5 py-1 text-[9px] font-bold text-[#8a6478]">{hasPrice ? 'ناموجود' : 'قیمت ثبت نشده'}</span>
                      )}
                    </div>
                    <div className="fl-product-info">
                      <h3 className="fl-product-name">{product.name}</h3>
                      <p className="fl-product-desc">{productDescription || 'مشاهده مشخصات و اطلاعات ثبت‌شده'}</p>
                      <div className="fl-product-bottom">
                        <span className="fl-product-price">{hasPrice ? formatToman(product.price) : 'قیمت ثبت نشده'}</span>
                        <span className={`fl-product-status ${isAvailable ? '' : 'is-out'}`}>{isAvailable ? 'موجود' : hasPrice ? 'ناموجود' : 'در انتظار قیمت'}</span>
                      </div>
                      <span className="fl-product-view">مشاهده جزئیات <ArrowLeft size={13} /></span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="fl-empty-state">
              <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f7] text-[#c61d70]"><PackageCheck size={22} /></div>
              <h3 className="text-sm font-bold text-[#28242b]">محصولی برای نمایش ثبت نشده است</h3>
              <p className="mt-2 text-xs text-[#77717b]">پس از انتشار محصولات از پنل مدیریت، آن‌ها در این بخش نمایش داده می‌شوند.</p>
            </div>
          )}
        </section>

        {/* ===== FEATURED PRODUCTS (IF ANY) ===== */}
        {featuredProducts.length > 0 && (
          <section className="container-custom fl-section pt-0">
            <div className="rounded-3xl border border-[#f0d8e5] bg-gradient-to-br from-[#fff8fc] to-[#fff] p-6 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#c61d70]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="relative z-10">
                <div className="fl-section-head mb-6">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0f7] px-3 py-1 text-[10px] font-bold text-[#c61d70] mb-2"><Sparkles size={12}/> انتخاب سردبیر</span>
                    <h2 className="fl-section-title">پیشنهاد ویژه فاطمه بیوتی لند</h2>
                  </div>
                </div>
                <div className="fl-product-grid">
                  {featuredProducts.map((product) => {
                    const hasPrice = product.price > 0;
                    const isAvailable = product.stock > 0 && hasPrice;
                    const productImage = getPublicProductImage(product.mainImage);
                    return (
                      <Link href={`/products/${product.slug}`} key={product.id} className="fl-product-card group">
                        <div className="fl-product-media !border-[#f2d7e5]">
                          {productImage ? (
                            <Image src={productImage} alt={`تصویر ${product.name}`} fill sizes="(max-width: 680px) 46vw, (max-width: 1024px) 30vw, 280px" />
                          ) : (
                            <div className="fl-product-placeholder" aria-hidden="true"><span className="absolute text-[10px] font-bold tracking-[.16em] text-[#b77b9a]">FATEMEHLAB</span></div>
                          )}
                        </div>
                        <div className="fl-product-info">
                          <h3 className="fl-product-name">{product.name}</h3>
                          <div className="fl-product-bottom mt-2">
                            <span className="fl-product-price text-[#c61d70]">{hasPrice ? formatToman(product.price) : 'قیمت ثبت نشده'}</span>
                            <span className={`fl-product-status ${isAvailable ? '' : 'is-out'}`}>{isAvailable ? 'موجود' : hasPrice ? 'ناموجود' : 'در انتظار قیمت'}</span>
                          </div>
                          <span className="fl-product-view mt-3">مشاهده محصول <ArrowLeft size={13} /></span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===== EDITORIAL ===== */}
        <section className="container-custom pb-10">
          <div className="fl-editorial-panel">
            <div className="fl-editorial-visual" aria-hidden="true" />
            <div className="fl-editorial-copy">
              <span className="fl-section-kicker">A BETTER WAY TO CHOOSE</span>
              <h2>قبل از انتخاب، جزئیات را ببینید.</h2>
              <p>نام محصول، توضیحات ثبت‌شده، تصاویر، مشخصات و وضعیت موجودی را در یک صفحه بررسی کنید. فاطمه بیوتی لند تلاش می‌کند مسیر آشنایی با محصول و ثبت سفارش را روشن و قابل فهم نگه دارد.</p>
              <Link href="/products" className="btn-primary mt-5 w-fit">بررسی محصولات <ArrowLeft size={15} /></Link>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="container-custom fl-section pt-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-5 text-center">
              <span className="fl-section-kicker">HELP / FAQ</span>
              <h2 className="fl-section-title">پاسخ چند سؤال کاربردی</h2>
            </div>
            <div className="fl-faq-list">
              <details className="fl-faq-item"><summary>چطور از قیمت و موجودی محصول مطلع شوم؟</summary><div className="fl-faq-answer">قیمت و وضعیت موجودی در صفحه اختصاصی محصول نمایش داده می‌شود. اگر قیمت محصول ثبت نشده باشد، امکان افزودن آن به سبد خرید فعال نخواهد بود.</div></details>
              <details className="fl-faq-item"><summary>چطور سفارش خود را ثبت کنم؟</summary><div className="fl-faq-answer">محصول دارای قیمت و موجودی را انتخاب کنید، به سبد خرید اضافه کنید و مراحل تسویه‌حساب را تکمیل کنید.</div></details>
              <details className="fl-faq-item"><summary>چطور وضعیت سفارش را پیگیری کنم؟</summary><div className="fl-faq-answer">پس از ثبت سفارش، از صفحه رهگیری سفارش و با اطلاعات درخواستی، وضعیت سفارش خود را بررسی کنید.</div></details>
            </div>
            <div className="mt-5 text-center"><Link href="/faq" className="fl-text-link">مشاهده راهنمای خرید <ArrowUpLeft size={15} /></Link></div>
          </div>
        </section>
      </main>
      <RecentlyViewed />
      <Footer />
    </div>
  );
}