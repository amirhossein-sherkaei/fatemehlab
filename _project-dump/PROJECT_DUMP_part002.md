# PROJECT DUMP
Generated : 1405-08-23 18:36:20
Root      : C:\Users\AmirHossien\Desktop\fatemehlab
Mode      : source
Files     : 255

==========================================================================================
FILE [152/255] src\app\layout.tsx
SIZE 5432 bytes
==========================================================================================
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "sonner";
import BottomNav from "@/components/storefront/BottomNav";
import CartDrawer from "@/components/storefront/CartDrawer";
import AuroraBackground from "@/components/storefront/AuroraBackground";
import PwaInstallPrompt from "@/components/storefront/PwaInstallPrompt";
import FloatingSupportButton from "@/components/storefront/FloatingSupportButton";
import PromoBarWrapper from "@/components/storefront/PromoBarWrapper";
import WebVitals from "@/components/shared/WebVitals";
import RouteProgress from "@/components/shared/RouteProgress";
import ScrollToTop from "@/components/shared/ScrollToTop";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
  adjustFontFallback: true,
  preload: true,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://fatemehbeautyland.ir";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "فاطمه بیوتی لند | فروشگاه لوکس محصولات آرایشی و بهداشتی",
    template: "%s | فاطمه بیوتی لند",
  },
  description: "خرید آنلاین محصولات آرایشی و مراقبت پوست با تضمین اصالت، ارسال سریع و پرداخت امن. فاطمه بیوتی لند، همراه زیبایی شما.",
  keywords: ["فروشگاه آرایشی", "محصولات بهداشتی", "مراقبت پوست", "فاطمه بیوتی لند", "خرید آنلاین لوازم آرایشی"],
  authors: [{ name: "فاطمه بیوتی لند", url: baseUrl }],
  creator: "فاطمه بیوتی لند",
  publisher: "فاطمه بیوتی لند",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: baseUrl,
    siteName: "فاطمه بیوتی لند",
    title: "فاطمه بیوتی لند | فروشگاه لوکس محصولات آرایشی و بهداشتی",
    description: "خرید آنلاین محصولات آرایشی و مراقبت پوست با تضمین اصالت و ارسال سریع.",
    images: [{ url: `${baseUrl}/logo.png`, width: 512, height: 512, alt: "فاطمه بیوتی لند" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "فاطمه بیوتی لند",
    description: "فروشگاه لوکس محصولات آرایشی و بهداشتی",
    images: [`${baseUrl}/logo.png`],
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "فاطمه بیوتی لند",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+989905316327",
        contactType: "customer service",
        areaServed: "IR",
        availableLanguage: "Persian",
      },
      sameAs: ["https://instagram.com/fatemehlab.ir"],
    },
    {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      url: baseUrl,
      name: "فاطمه بیوتی لند",
      publisher: { "@id": `${baseUrl}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${baseUrl}/products?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Store",
      "@id": `${baseUrl}/#store`,
      name: "فاطمه بیوتی لند",
      image: `${baseUrl}/logo.png`,
      url: baseUrl,
      telephone: "+989905316327",
      address: {
        "@type": "PostalAddress",
        addressLocality: "تهران",
        addressCountry: "IR",
      },
      priceRange: "$$",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa-IR" dir="rtl" className={vazirmatn.variable}>
      <head>
        <link rel="preconnect" href="https://public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://payment.zarinpal.com" />
        <link rel="dns-prefetch" href="https://payment.zarinpal.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }} />
      </head>
      <body className="min-h-[100dvh] font-sans text-foreground overflow-x-hidden">
        <RouteProgress />
        <Suspense fallback={null}><PromoBarWrapper /></Suspense>
        <Toaster position="top-center" richColors theme="light" closeButton />
        <AuroraBackground />
        <WebVitals />
        <CartDrawer />
        <FloatingSupportButton />
        <PwaInstallPrompt />
        {children}
        <Suspense fallback={null}><BottomNav /></Suspense>
              <ScrollToTop />
      </body>
    </html>
  );
}


==========================================================================================
FILE [153/255] src\app\manifest.ts
SIZE 805 bytes
==========================================================================================
import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'فاطمه بیوتی لند | فروشگاه آرایشی و بهداشتی',
    short_name: 'فاطمه بیوتی لند',
    description: 'فروشگاه آنلاین محصولات آرایشی، بهداشتی و مراقبتی فاطمه بیوتی لند',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#c61d70',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable', // اصلاح شد (حذف any)
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}


==========================================================================================
FILE [154/255] src\app\order\failure\page.tsx
SIZE 3375 bytes
==========================================================================================
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowRight, RefreshCcw, ShieldAlert, HeadphonesIcon } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

function FailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const errorMessages: Record<string, string> = {
    'cancelled': 'شما از پرداخت انصراف دادید یا تراکنش توسط بانک لغو شد.',
    'verify_failed': 'تایید پرداخت با خطا مواجه شد. اگر مبلغ از حساب شما کسر شده، تا ۷۲ ساعت آینده بازگردانده می‌شود.',
    'missing_params': 'اطلاعات پرداخت ناقص است.',
    'order_not_found': 'سفارش مورد نظر در سیستم یافت نشد.',
    'server_error': 'خطای ارتباط با سرور رخ داده است.'
  };

  const message = errorMessages[reason || ''] || 'متأسفانه در فرآیند پرداخت مشکلی پیش آمد.';

  return (
    <div className="glass-panel p-8 md:p-12 max-w-lg w-full text-center bg-white/80 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
        <XCircle className="w-12 h-12 text-rose-500" />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-black text-[#28242b] mb-3">پرداخت ناموفق</h1>
      <p className="text-sm text-[#77717b] leading-loose mb-8">{message}</p>
      
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-right mb-8">
        <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <p className="text-xs text-amber-800 leading-relaxed">
          اگر مبلغی از حساب شما کسر شده است، نگران نباشید. این مبلغ طبق قوانین بانکی حداکثر تا ۷۲ ساعت کاری به صورت خودکار به حساب شما بازگردانده می‌شود.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/checkout" className="btn-primary w-full justify-center">
          <RefreshCcw size={16} /> تلاش مجدد برای پرداخت
        </Link>
        <Link href="/cart" className="btn-secondary w-full justify-center">
          بازگشت به سبد خرید
        </Link>
        <Link href="/contact" className="flex items-center justify-center gap-2 text-xs font-bold text-[#77717b] hover:text-[#c61d70] mt-2 transition-colors">
          <HeadphonesIcon size={14} /> نیاز به کمک دارید؟ با پشتیبانی تماس بگیرید
        </Link>
      </div>
    </div>
  );
}

export default function OrderFailurePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 pb-24 md:pb-20">
        <Suspense fallback={<div className="text-center p-8 text-[#c61d70]">در حال بارگذاری...</div>}>
          <FailureContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [155/255] src\app\order\success\copy-button.tsx
SIZE 917 bytes
==========================================================================================
'use client';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('کد رهگیری کپی شد');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('خطا در کپی کردن');
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-2 bg-white rounded-lg shadow-sm border border-border hover:bg-sage/10 hover:text-sage transition-all text-muted-foreground"
      title="کپی کد رهگیری"
    >
      {copied ? <Check className="w-5 h-5 text-sage" /> : <Copy className="w-5 h-5" />}
    </button>
  );
}


==========================================================================================
FILE [156/255] src\app\order\success\page.tsx
SIZE 2864 bytes
==========================================================================================
import { CheckCircle2, ArrowRight, Copy } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import CopyButton from './copy-button';


export const instant = false;

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string; code?: string }> }) {
  const { id, code } = await searchParams;
  
  let trackingCode = 'در حال دریافت...';
  let isValid = false;
  
  if (code && code.length >= 3 && code !== 'undefined' && code !== 'null') {
    trackingCode = code;
    isValid = true;
  } else if (id && id.length >= 6 && id !== 'undefined') {
    trackingCode = `FL-${id.slice(0, 6).toUpperCase()}`;
    isValid = true;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 pb-24 md:pb-20">
        <div className="glass-panel p-8 md:p-12 max-w-lg w-full text-center bg-white/80">
          <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-sage" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink mb-3">سفارش شما با موفقیت ثبت شد!</h1>
          <p className="text-sm text-muted leading-relaxed mb-8">از خرید شما سپاسگزاریم. کد رهگیری زیر را نزد خود نگه دارید تا در هر زمان بتوانید وضعیت سفارش خود را پیگیری کنید.</p>
          
          <div className="bg-chalk rounded-2xl p-6 mb-8 border border-line relative group">
            <p className="text-xs text-muted mb-2">کد رهگیری اختصاصی شما</p>
            <div className="flex items-center justify-center gap-3">
              <p className="font-mono text-2xl md:text-3xl font-black text-sage tracking-widest" dir="ltr">{trackingCode}</p>
              {isValid && <CopyButton text={trackingCode} />}
            </div>
            <p className="text-[10px] text-muted mt-4">با این کد و شماره تماس خود می‌توانید وضعیت را در صفحه «رهگیری سفارش» مشاهده کنید.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/track" className="btn-primary w-full justify-center">
              پیگیری سفارش <ArrowRight size={16} />
            </Link>
            <Link href="/" className="btn-secondary w-full justify-center">
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [157/255] src\app\page.tsx
SIZE 15881 bytes
==========================================================================================
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'فاطمه بیوتی لند | فروشگاه لوکس محصولات آرایشی و بهداشتی',
  description: 'خرید آنلاین محصولات آرایشی و مراقبت پوست با تضمین اصالت، ارسال سریع و پرداخت امن. فاطمه بیوتی لند، همراه زیبایی شما.',
  openGraph: {
    title: 'فاطمه بیوتی لند',
    description: 'فروشگاه لوکس محصولات آرایشی و بهداشتی',
    type: 'website',
  },
};
import Link from 'next/link';
import { ArrowLeft, ArrowUpLeft, BadgeCheck, BookOpenText, PackageCheck, Search, Sparkles, Droplets, Flame, Heart, Wind, Star, ShoppingBag } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import RecentlyViewed from '@/components/storefront/RecentlyViewed';
import SafeImage from '@/components/product/SafeImage';
import { getCachedPublishedProducts } from '@/lib/products';
import { formatToman } from '@/lib/currency';
import { getPublicProductDescription, getPublicProductImage } from '@/lib/product-content';
import { db } from '@/lib/db';
import { categories } from '@/db/schema';
import { desc } from 'drizzle-orm';

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
  const newProducts = dbProducts.slice(0, 4);
  const featuredProducts = dbProducts.filter(p => p.isFeatured).slice(0, 4);
  const dbCategories = await db.select().from(categories).orderBy(desc(categories.createdAt)).limit(6);

  return (
    <div className="min-h-screen flex flex-col relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHomeFaq) }} />
      <Header />
      <main className="flex-1 relative z-10">
        
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

        <section className="container-custom">
          <div className="fl-feature-strip">
            <div className="fl-feature"><span className="fl-feature-icon"><BookOpenText size={16} /></span><span>اطلاعات ثبت‌شده محصول</span></div>
            <div className="fl-feature"><span className="fl-feature-icon"><Search size={16} /></span><span>بررسی و مقایسه آسان</span></div>
            <div className="fl-feature"><span className="fl-feature-icon"><PackageCheck size={16} /></span><span>دسترسی به رهگیری سفارش</span></div>
          </div>
        </section>

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
                  <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group flex flex-col items-center justify-center rounded-2xl border border-[#e9e5eb] bg-white/70 backdrop-blur-md p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-[#c61d70]/30 hover:shadow-md hover:bg-white">
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
                    <div className="fl-product-media bg-white/50 backdrop-blur-sm relative overflow-hidden">
                      <SafeImage src={productImage} alt={`تصویر ${product.name}`} fill sizes="(max-width: 680px) 46vw, (max-width: 1024px) 30vw, 280px" />
                      {!isAvailable && (
                        <span className="absolute right-3 top-3 rounded-lg border border-white/70 bg-white/90 px-2.5 py-1 text-[9px] font-bold text-[#8a6478] z-10">{hasPrice ? 'ناموجود' : 'قیمت ثبت نشده'}</span>
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

        {featuredProducts.length > 0 && (
          <section className="container-custom fl-section pt-0">
            <div className="rounded-3xl border border-[#f0d8e5] bg-gradient-to-br from-[#fff8fc]/80 to-[#fff]/80 backdrop-blur-md p-6 md:p-10 relative overflow-hidden shadow-sm">
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
                        <div className="fl-product-media !border-[#f2d7e5] bg-white/60 relative overflow-hidden">
                          <SafeImage src={productImage} alt={`تصویر ${product.name}`} fill sizes="(max-width: 680px) 46vw, (max-width: 1024px) 30vw, 280px" />
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


==========================================================================================
FILE [158/255] src\app\policies\privacy\page.tsx
SIZE 2564 bytes
==========================================================================================
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'حریم خصوصی | فاطمه بیوتی لند',
  description: 'اطلاعات مربوط به حریم خصوصی در فروشگاه فاطمه بیوتی لند',
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-1 container-custom max-w-3xl py-12 px-4 md:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] bg-white shadow-sm border border-[#f2d7e5] px-4 py-2 rounded-full mb-8 hover:bg-[#fff0f7] transition-colors">
          <ArrowRight size={14} /> بازگشت به صفحه اصلی
        </Link>
        
        <h1 className="text-2xl md:text-4xl font-black text-[#28242b] mb-8">حریم خصوصی</h1>
        
        <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 md:p-10 shadow-sm prose prose-sm md:prose-base max-w-none">
          <h2 className="text-lg font-bold text-[#28242b] mb-4">حریم خصوصی کاربران</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">فاطمه بیوتی لند به حریم خصوصی کاربران خود احترام می‌گذارد. اطلاعات شخصی شما (مانند نام، شماره تماس و آدرس) تنها برای پردازش سفارش، ارسال کالا و بهبود تجربه خرید استفاده می‌شود.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">امنیت اطلاعات</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">تمامی اطلاعات مشتریان به صورت رمزنگاری شده ذخیره می‌شود و در اختیار هیچ شخص یا سازمان ثالثی قرار نمی‌گیرد. پرداخت‌ها از طریق درگاه‌های امن انجام می‌شود.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">کوکی‌ها</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">ما از کوکی‌ها برای بهبود عملکرد سایت (مانند حفظ سبد خرید) استفاده می‌کنیم. با ادامه استفاده از سایت، شما موافقت خود را با این سیاست اعلام می‌کنید.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [159/255] src\app\policies\returns\page.tsx
SIZE 2602 bytes
==========================================================================================
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'مرجوعی و تعویض | فاطمه بیوتی لند',
  description: 'اطلاعات مربوط به مرجوعی و تعویض در فروشگاه فاطمه بیوتی لند',
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-1 container-custom max-w-3xl py-12 px-4 md:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] bg-white shadow-sm border border-[#f2d7e5] px-4 py-2 rounded-full mb-8 hover:bg-[#fff0f7] transition-colors">
          <ArrowRight size={14} /> بازگشت به صفحه اصلی
        </Link>
        
        <h1 className="text-2xl md:text-4xl font-black text-[#28242b] mb-8">مرجوعی و تعویض</h1>
        
        <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 md:p-10 shadow-sm prose prose-sm md:prose-base max-w-none">
          <h2 className="text-lg font-bold text-[#28242b] mb-4">شرایط مرجوعی کالا</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">با توجه به ماهیت بهداشتی محصولات آرایشی و مراقبتی، امکان بازگشت کالا تنها در صورتی پذیرفته می‌شود که پلمب محصول باز نشده باشد و بسته‌بندی آن آسیب ندیده باشد.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">فرآیند درخواست مرجوعی</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">در صورت وجود مشکل در سفارش (مغایرت کالا، آسیب‌دیدگی در حین حمل)، لطفاً حداکثر تا ۴۸ ساعت پس از دریافت، با پشتیبانی تماس بگیرید. پس از بررسی، در صورت تایید، هزینه به حساب شما بازگردانده می‌شود.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">کالاهای غیرقابل مرجوعی</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">محصولاتی که پلمب آن‌ها باز شده باشد، یا به دلایل بهداشتی قابل استفاده مجدد نباشند، به هیچ عنوان قابل مرجوعی نیستند.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [160/255] src\app\policies\shipping\page.tsx
SIZE 2633 bytes
==========================================================================================
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'شرایط ارسال | فاطمه بیوتی لند',
  description: 'اطلاعات مربوط به شرایط ارسال در فروشگاه فاطمه بیوتی لند',
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-1 container-custom max-w-3xl py-12 px-4 md:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] bg-white shadow-sm border border-[#f2d7e5] px-4 py-2 rounded-full mb-8 hover:bg-[#fff0f7] transition-colors">
          <ArrowRight size={14} /> بازگشت به صفحه اصلی
        </Link>
        
        <h1 className="text-2xl md:text-4xl font-black text-[#28242b] mb-8">شرایط ارسال</h1>
        
        <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 md:p-10 shadow-sm prose prose-sm md:prose-base max-w-none">
          <h2 className="text-lg font-bold text-[#28242b] mb-4">زمان و نحوه ارسال</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">سفارشات شما پس از تایید و آماده‌سازی، معمولاً در بازه زمانی ۱ تا ۳ روز کاری به دست شما خواهد رسید. ارسال سفارشات از طریق پست پیشتاز یا پیک موتوری (در تهران) انجام می‌شود.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">هزینه ارسال</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">هزینه ارسال بر اساس تعرفه‌های پست جمهوری اسلامی ایران و وزن مرسوله محاسبه می‌شود. در برخی از کمپین‌ها، ارسال به صورت رایگان خواهد بود که در صفحه محصول و سبد خرید اطلاع‌رسانی می‌شود.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">پیگیری سفارش</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">پس از تحویل مرسوله به پست، کد رهگیری از طریق پیامک برای شما ارسال می‌شود و همچنین می‌توانید از صفحه «رهگیری سفارش» در سایت، وضعیت دقیق سفارش خود را مشاهده کنید.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [161/255] src\app\products\[slug]\add-to-cart.tsx
SIZE 3276 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { ShoppingBag, Loader2, Check, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

type CartProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  mainImage: string | null;
};

export default function AddToCartButton({ product }: { product: CartProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  
  const hasPrice = product.price > 0;
  const hasStock = product.stock > 0;
  const canPurchase = hasPrice && hasStock;

  const handleAdd = () => {
    if (!canPurchase) return;
    setLoading(true);
    
    setTimeout(() => {
      for (let i = 0; i < quantity; i++) {
        addItem({ 
          id: product.id, 
          name: product.name, 
          slug: product.slug, 
          price: product.price, 
          mainImage: product.mainImage
        });
      }
      
      setLoading(false);
      setAdded(true);
      toast.success(`${quantity} عدد به سبد خرید اضافه شد`, {
        action: {
          label: 'مشاهده سبد',
          onClick: () => openCart(),
        },
        duration: 3000,
      });
      openCart();
      
      setTimeout(() => setAdded(false), 2000);
    }, 500);
  };

  return (
    <div className="flex items-center gap-3 w-full">
      {/* انتخاب تعداد */}
      {canPurchase && (
        <div className="flex items-center bg-[#f8f7fa] rounded-xl border border-[#e9e5eb] p-1 shrink-0 h-12">
          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full flex items-center justify-center text-[#77717b] hover:text-[#c61d70] hover:bg-white rounded-lg transition-colors">
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-black text-[#28242b]">{quantity}</span>
          <button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-8 h-full flex items-center justify-center text-[#77717b] hover:text-[#c61d70] hover:bg-white rounded-lg transition-colors">
            <Plus size={16} />
          </button>
        </div>
      )}

      {/* دکمه خرید */}
      <button 
        type="button" 
        onClick={handleAdd} 
        disabled={!canPurchase || loading || added} 
        className={`flex-1 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
          added ? 'bg-emerald-500 text-white' : 
          canPurchase ? 'bg-[#c61d70] text-white hover:bg-[#a9155d] shadow-lg shadow-[#c61d70]/20' : 
          'bg-[#e9e5eb] text-[#918a95] cursor-not-allowed'
        }`}
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : 
         added ? <><Check size={20} /> با موفقیت اضافه شد</> : 
         canPurchase ? <><ShoppingBag size={20} /> افزودن به سبد خرید</> : 
         !hasPrice ? 'در انتظار قیمت' : 'ناموجود'}
      </button>
    </div>
  );
}


==========================================================================================
FILE [162/255] src\app\products\[slug]\loading.tsx
SIZE 1921 bytes
==========================================================================================
export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-[#fafafc]">
      <div className="h-[74px] border-b border-[#e9e5eb] bg-white/80 backdrop-blur-md" />
      <div className="container-custom py-6 animate-pulse">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-6">
          <div className="w-16 h-3 bg-gray-200 rounded" />
          <div className="w-2 h-3 bg-gray-200 rounded" />
          <div className="w-24 h-3 bg-gray-200 rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery */}
          <div>
            <div className="aspect-square md:aspect-[4/5] rounded-3xl bg-white border border-[#e9e5eb]" />
            <div className="flex gap-2 mt-3">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-200" />)}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="w-24 h-4 bg-gray-200 rounded" />
            <div className="w-3/4 h-10 bg-gray-200 rounded-lg" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-2/3 h-4 bg-gray-200 rounded" />
            <div className="h-32 bg-white border border-[#e9e5eb] rounded-2xl mt-6" />
            <div className="flex gap-3 mt-6">
              <div className="flex-1 h-12 bg-gray-200 rounded-xl" />
              <div className="w-32 h-12 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-16 max-w-4xl mx-auto space-y-6">
          <div className="h-40 bg-white border border-[#e9e5eb] rounded-2xl" />
          <div className="h-32 bg-white border border-[#e9e5eb] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [163/255] src\app\products\[slug]\opengraph-image.tsx
SIZE 3156 bytes
==========================================================================================
import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const alt = 'محصول فاطمه بیوتی لند';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // دریافت اطلاعات محصول از دیتابیس
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);

  if (!product) {
    return new ImageResponse(
      (
        <div style={{ background: '#fafafc', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 60, color: '#c61d70', fontWeight: 'bold' }}>محصول یافت نشد</span>
        </div>
      ),
      { ...size }
    );
  }

  const priceStr = product.price > 0 ? (product.price / 10).toLocaleString('fa-IR') + ' تومان' : 'به زودی';
  const imageUrl = product.mainImage || '';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #fafafc 0%, #fff0f7 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row-reverse', // راست‌چین
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* بخش متن */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingLeft: '40px' }}>
          <div style={{ fontSize: 24, color: '#c61d70', fontWeight: 'bold', marginBottom: 20, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#c61d70', display: 'inline-block' }}></span>
            FATEMEH BEAUTY LAND
          </div>
          <div style={{ fontSize: 60, fontWeight: '900', color: '#28242b', lineHeight: 1.4, marginBottom: 30 }}>
            {product.name}
          </div>
          <div style={{ fontSize: 40, fontWeight: 'bold', color: '#c61d70', marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
            {priceStr}
          </div>
        </div>

        {/* بخش تصویر محصول */}
        <div style={{ display: 'flex', width: '420px', height: '420px', background: '#fff', borderRadius: '40px', boxShadow: '0 20px 40px rgba(198,29,112,0.15)', overflow: 'hidden', border: '4px solid #f2d7e5', alignItems: 'center', justifyContent: 'center' }}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 40, color: '#c61d70' }}>بدون عکس</div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}


==========================================================================================
FILE [164/255] src\app\products\[slug]\page.tsx
SIZE 15012 bytes
==========================================================================================
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { and, eq, ne, inArray, sql, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ChevronLeft, ShieldAlert, Sparkles, Droplets, Package, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/db';
import { products, orderItems } from '@/db/schema';
import { formatToman } from '@/lib/currency';
import { getPublicProductDescription, getPublicProductImage } from '@/lib/product-content';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import AddToCartButton from './add-to-cart';
import StockNotifyButton from '@/components/product/StockNotifyButton';
import WishlistButton from '@/components/storefront/WishlistButton';
import ProductReviews from '@/components/storefront/ProductReviews';
import FrequentlyBoughtTogether from '@/components/product/FrequentlyBoughtTogether';
import ShareButton from '@/components/storefront/ShareButton';
import RecentlyViewedTracker from '@/components/storefront/RecentlyViewedTracker';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product || product.status !== 'published') return { title: 'محصول یافت نشد' };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const title = `${product.name} | فاطمه بیوتی لند`;
  const description = product.description || `خرید ${product.name} از فاطمه بیوتی لند با تضمین اصالت.`;

  return {
    title,
    description,
    alternates: { canonical: productUrl },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: 'فاطمه بیوتی لند',
      locale: 'fa_IR',
      type: 'website',
      images: product.mainImage ? [{ url: product.mainImage, width: 800, height: 800, alt: product.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.mainImage ? [product.mainImage] : [],
    },
  };
}

export const instant = false;

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);

  if (!product || product.status !== 'published') notFound();

  const isPriced = product.price > 0;
  const isAvailable = product.stock > 0 && isPriced; 
  const publicDescription = getPublicProductDescription(product.description);
  const publicMainImage = getPublicProductImage(product.mainImage);
  const publicGallery = (product.gallery || []).map((img) => getPublicProductImage(img)).filter((img): img is string => Boolean(img));

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';
  const jsonLdProduct = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: publicMainImage ? [publicMainImage] : [],
    description: publicDescription || product.name,
    sku: product.sku || product.id,
    brand: { "@type": "Brand", name: product.brand || "فاطمه بیوتی لند" },
    offers: {
      "@type": "Offer",
      url: `${baseUrl}/products/${product.slug}`,
      priceCurrency: "IRR",
      price: product.price,
      availability: isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "فاطمه بیوتی لند" },
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "محصولات", item: `${baseUrl}/products` },
      { "@type": "ListItem", position: 3, name: product.name, item: `${baseUrl}/products/${product.slug}` },
    ],
  };

  const relatedProducts = await db.select().from(products).where(and(eq(products.status, 'published'), ne(products.id, product.id))).limit(4);
  const specs = Array.isArray(product.specifications) ? product.specifications : [];

  // محاسبه هوشمند محصولات خریداری‌شده با هم
  let fbtProducts: any[] = [];
  try {
    const ordersWithProduct = await db.select({ orderId: orderItems.orderId }).from(orderItems).where(eq(orderItems.productId, product.id)).limit(50);
    const orderIds = ordersWithProduct.map(o => o.orderId);

    if (orderIds.length > 0) {
      const otherItems = await db.select({ productId: orderItems.productId })
        .from(orderItems)
        .where(and(inArray(orderItems.orderId, orderIds), ne(orderItems.productId, product.id)))
        .groupBy(orderItems.productId)
        .orderBy(desc(sql`count(*)`))
        .limit(2);
      
      const fbtIds = otherItems.map(i => i.productId);
      if (fbtIds.length > 0) {
        fbtProducts = await db.select().from(products).where(and(inArray(products.id, fbtIds), eq(products.status, 'published')));
      }
    }

    if (fbtProducts.length === 0) {
      fbtProducts = await db.select().from(products).where(and(eq(products.status, 'published'), ne(products.id, product.id))).limit(2);
    }
  } catch (e) {
    console.error('FBT Error:', e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc]">
      <RecentlyViewedTracker product={product} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdProduct) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <Header />
      <main className="flex-1 pb-32 md:pb-12">
        <div className="container-custom px-4 md:px-6 py-6">
          
          <nav className="flex items-center gap-2 text-[11px] text-[#918a95] mb-6 whitespace-nowrap overflow-x-auto">
            <Link href="/" className="hover:text-[#c61d70]">خانه</Link>
            <ChevronLeft size={12} />
            <Link href="/products" className="hover:text-[#c61d70]">محصولات</Link>
            <ChevronLeft size={12} />
            <span className="text-[#28242b] font-bold truncate">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            {/* گالری تصاویر */}
            <div className="space-y-3">
              <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#e9e5eb] shadow-sm flex items-center justify-center p-6 md:p-10">
                {publicMainImage ? (
                  <Image src={publicMainImage} alt={product.name} fill className="object-contain" priority />
                ) : (
                  <Package size={80} className="text-[#c61d70]/20" />
                )}
              </div>
              {publicGallery.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {publicGallery.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden border border-[#e9e5eb] bg-white">
                       <Image src={img} alt={`${product.name} - ${i}`} fill className="object-contain p-1.5" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* اطلاعات و خرید */}
            <div className="flex flex-col">
              {product.brand && (
                <span className="text-[11px] font-bold text-[#c61d70] mb-2">{product.brand}</span>
              )}
              <h1 className="text-2xl md:text-4xl font-black text-[#28242b] leading-[1.4] mb-3">{product.name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-md flex items-center gap-1 ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {isAvailable ? <><CheckCircle2 size={12} /> موجود در انبار</> : 'ناموجود'}
                </span>
                {product.sku && <span className="text-[10px] text-[#918a95]" dir="ltr">SKU: {product.sku}</span>}
              </div>

              {publicDescription && <p className="text-[#77717b] text-sm leading-loose mb-6">{publicDescription}</p>}

              <div className="bg-white rounded-2xl border border-[#e9e5eb] p-5 md:p-6 mb-6 shadow-sm">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <span className="block text-xs text-[#918a95] mb-1">قیمت</span>
                    <span className="text-2xl md:text-3xl font-black text-[#28242b]">
                      {isPriced ? formatToman(product.price) : 'به زودی'}
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex gap-3 items-stretch">
                  <div className="flex-1">
                    <AddToCartButton product={product} />
                  </div>
                  <WishlistButton productId={product.id} variant="button" className="min-w-[140px]" />
                  <ShareButton title={product.name} />
                </div>
              </div>

              {/* هشدارها و نوع پوست */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.skinType && (
                  <div className="flex items-center gap-2 rounded-xl border border-[#f2d7e5] bg-[#fff0f7] p-3 text-xs text-[#c61d70] font-bold">
                    <Sparkles size={16} /> مناسب برای: {product.skinType}
                  </div>
                )}
                {product.countryOfOrigin && (
                  <div className="flex items-center gap-2 rounded-xl border border-[#e9e5eb] bg-white p-3 text-xs text-[#77717b] font-bold">
                    <Package size={16} /> کشور سازنده: {product.countryOfOrigin}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-12 md:mt-20 max-w-4xl mx-auto space-y-8">
            {specs.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e9e5eb] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#e9e5eb] bg-[#fafafc]">
                  <h3 className="text-sm font-black text-[#28242b]">مشخصات محصول</h3>
                </div>
                <div className="divide-y divide-[#e9e5eb]">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex justify-between p-4 text-xs">
                      <span className="text-[#77717b]">{spec.key}</span>
                      <span className="font-bold text-[#28242b]" dir="auto">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.ingredients && (
              <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 shadow-sm">
                <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2"><Droplets size={16} className="text-[#c61d70]" /> ترکیبات</h3>
                <p className="text-xs leading-loose text-[#77717b]">{product.ingredients}</p>
              </div>
            )}

            {product.usage && (
              <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 shadow-sm">
                <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2"><Sparkles size={16} className="text-[#c61d70]" /> روش استفاده</h3>
                <p className="text-xs leading-loose text-[#77717b]">{product.usage}</p>
              </div>
            )}

            {product.warnings && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
                <h3 className="text-sm font-black text-amber-800 mb-3 flex items-center gap-2"><ShieldAlert size={16} /> هشدارهای ایمنی</h3>
                <p className="text-xs leading-loose text-amber-900/80">{product.warnings}</p>
              </div>
            )}
          </div>

          <FrequentlyBoughtTogether currentProduct={product} fbtProducts={fbtProducts} />

          <ProductReviews productId={product.id} />

          {relatedProducts.length > 0 && (
            <section className="mt-16 md:mt-24 border-t border-[#e9e5eb] pt-10">
              <h2 className="text-xl font-black text-[#28242b] mb-6 text-center">محصولات مشابه</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map(p => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="group bg-white rounded-xl border border-[#e9e5eb] overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative aspect-square bg-[#fafafc]">
                      {getPublicProductImage(p.mainImage) ? (
                        <Image src={getPublicProductImage(p.mainImage)!} alt={p.name} fill className="object-contain p-3" />
                      ) : (
                        <Package size={32} className="absolute inset-0 m-auto text-[#c61d70]/20" />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-[#28242b] group-hover:text-[#c61d70] truncate">{p.name}</h3>
                      <span className="text-[11px] font-black text-[#c61d70] mt-1 block">{p.price > 0 ? formatToman(p.price) : 'به زودی'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {isPriced && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#e9e5eb] p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="block text-[10px] text-[#918a95]">قیمت</span>
              <span className="text-base font-black text-[#28242b]">{formatToman(product.price)}</span>
            </div>
            <div className="flex-1 max-w-[220px]">
              {isAvailable ? (
                <AddToCartButton product={product} />
              ) : (
                <StockNotifyButton productId={product.id} />
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


==========================================================================================
FILE [165/255] src\app\products\error.tsx
SIZE 1455 bytes
==========================================================================================
'use client';
import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ProductsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100 p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-rose-500 w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#28242b] mb-2">خطا در بارگذاری محصولات</h2>
        <p className="text-sm text-[#77717b] mb-6">لطفاً دوباره تلاش کنید یا به صفحه اصلی بازگردید.</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => reset()} className="w-full py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2"><RotateCcw size={16} /> تلاش مجدد</button>
          <Link href="/" className="w-full py-3 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl flex items-center justify-center gap-2"><Home size={16} /> صفحه اصلی</Link>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [166/255] src\app\products\loading.tsx
SIZE 2164 bytes
==========================================================================================
export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[#fafafc]">
      {/* هدر اسکلت */}
      <div className="h-[74px] border-b border-[#e9e5eb] bg-white/80 backdrop-blur-md" />
      
      {/* بنر بالای صفحه */}
      <div className="bg-white border-b border-[#e9e5eb] pt-10 pb-8 px-4 md:px-6">
        <div className="container-custom max-w-7xl">
          <div className="w-32 h-4 bg-[#e9e5eb] rounded-full mb-4 animate-pulse" />
          <div className="w-64 h-8 bg-[#e9e5eb] rounded-lg mb-3 animate-pulse" />
          <div className="w-full max-w-2xl h-4 bg-[#e9e5eb] rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="container-custom max-w-7xl py-8 px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* سایدبار فیلتر */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-[#e9e5eb] p-5 h-[400px] animate-pulse" />
          </div>

          {/* گرید محصولات */}
          <div className="flex-1">
            <div className="w-full h-12 bg-white rounded-xl border border-[#e9e5eb] mb-6 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-[#e9e5eb] p-4 flex flex-col h-[350px]">
                  <div className="w-full aspect-square bg-[#f8f7fa] rounded-xl mb-4 animate-pulse" />
                  <div className="w-3/4 h-4 bg-[#e9e5eb] rounded mb-2 animate-pulse" />
                  <div className="w-1/2 h-3 bg-[#e9e5eb] rounded mb-4 animate-pulse" />
                  <div className="mt-auto flex justify-between items-center">
                    <div className="w-16 h-4 bg-[#e9e5eb] rounded animate-pulse" />
                    <div className="w-8 h-8 bg-[#e9e5eb] rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [167/255] src\app\products\page.tsx
SIZE 7193 bytes
==========================================================================================
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
                <LoadMoreProducts initialProducts={dbProducts} />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [168/255] src\app\robots.ts
SIZE 657 bytes
==========================================================================================
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/account/', '/api/', '/cart', '/checkout', '/_next/'],
      },
      // 🤖 اجازه به ربات‌های AI برای درک بهتر محتوا
      {
        userAgent: ['GPTBot', 'Claude-Web', 'ClaudeBot', 'anthropic-ai', 'OAI-SearchBot', 'PerplexityBot'],
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}


==========================================================================================
FILE [169/255] src\app\sitemap.ts
SIZE 2403 bytes
==========================================================================================
import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { products, articles, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';

  const staticRoutes: MetadataRoute.Sitemap = [
    '', '/about', '/products', '/journal', '/contact', '/faq', '/track',
    '/policies/privacy', '/policies/returns', '/policies/shipping',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const allProducts = await db
      .select({ slug: products.slug, updatedAt: products.updatedAt, mainImage: products.mainImage })
      .from(products)
      .where(eq(products.status, 'published'));

    productRoutes = allProducts.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
      // 🖼️ Image Sitemap
      images: p.mainImage ? [p.mainImage] : [],
    }));
  } catch (e) {
    console.error('Sitemap products error:', e);
  }

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const allArticles = await db
      .select({ slug: articles.slug, updatedAt: articles.updatedAt, coverImage: articles.coverImage })
      .from(articles)
      .where(eq(articles.status, 'published'));

    articleRoutes = allArticles.map((a) => ({
      url: `${baseUrl}/journal/${a.slug}`,
      lastModified: a.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      images: a.coverImage ? [a.coverImage] : [],
    }));
  } catch (e) {
    console.error('Sitemap articles error:', e);
  }

  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const allCategories = await db.select({ slug: categories.slug }).from(categories);
    categoryRoutes = allCategories.map((c) => ({
      url: `${baseUrl}/products?category=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error('Sitemap categories error:', e);
  }

  return [...staticRoutes, ...productRoutes, ...articleRoutes, ...categoryRoutes];
}


==========================================================================================
FILE [170/255] src\app\track\layout.tsx
SIZE 381 bytes
==========================================================================================
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'رهگیری سفارش | فاطمه بیوتی لند',
  description: 'با کد رهگیری و شماره تماس، وضعیت دقیق سفارش خود را پیگیری کنید.',
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}


==========================================================================================
FILE [171/255] src\app\track\page.tsx
SIZE 7753 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import { Search, Loader2, Package, CheckCircle2, Clock, XCircle, Truck, CreditCard } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { formatToman } from '@/lib/currency';
import { toast } from 'sonner';

const steps = [
  { id: 'processing', title: 'در حال آماده‌سازی', icon: Package },
  { id: 'shipped', title: 'ارسال شده', icon: Truck },
  { id: 'delivered', title: 'تحویل شده', icon: CheckCircle2 },
];

export default function TrackPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [formData, setFormData] = useState({ trackingCode: '', phone: '' });

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setData(null);

    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await res.json();

      if (res.ok) setData(result);
      else toast.error(result.message);
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex((s) => s.id === status);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container-custom py-8 md:py-14 max-w-3xl mx-auto pb-24 md:pb-14">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink mb-2">رهگیری سفارش</h1>
          <p className="text-sm text-muted">برای مشاهده وضعیت سفارش، کد رهگیری و شماره تماس خود را وارد کنید.</p>
        </div>

        <form onSubmit={handleTrack} className="glass-panel p-6 md:p-8 space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">کد رهگیری</label>
              <input
                type="text"
                placeholder="FL-XXXXXX"
                required
                dir="ltr"
                value={formData.trackingCode}
                onChange={(e) => setFormData({ ...formData, trackingCode: e.target.value })}
                className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-line rounded-xl focus:bg-white focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all outline-none text-base text-left font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-ink">شماره تماس</label>
              <input
                type="tel"
                placeholder="شماره ثبت‌شده در سفارش"
                required
                dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3.5 bg-[#F8F9FA] border border-line rounded-xl focus:bg-white focus:border-sage focus:ring-2 focus:ring-sage/20 transition-all outline-none text-base text-left"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full min-h-[48px]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            جستجوی سفارش
          </button>
        </form>

        {data && (
          <div className="glass-panel p-5 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-line pb-5 mb-6">
              <div>
                <p className="text-xs text-muted mb-1">کد رهگیری</p>
                <p className="font-mono text-lg md:text-xl font-bold text-ink" dir="ltr">{data.order.trackingCode}</p>
              </div>
              {data.order.status === 'cancelled' ? (
                <span className="px-4 py-2 rounded-lg text-sm font-bold bg-rose/10 text-rose flex items-center gap-2">
                  <XCircle className="w-4 h-4" /> لغو شده
                </span>
              ) : (
                <span className="px-4 py-2 rounded-lg text-sm font-bold bg-sage/10 text-sage flex items-center gap-2">
                  <Package className="w-4 h-4" /> در حال پیگیری
                </span>
              )}
            </div>

            {/* تایم‌لاین موبایل */}
            {data.order.status !== 'cancelled' && (
              <div className="relative mb-10 mt-4">
                <div className="absolute top-5 right-0 left-0 h-1 bg-line rounded-full -z-10"></div>
                <div
                  className="absolute top-5 right-0 h-1 bg-sage rounded-full transition-all duration-1000 ease-out -z-10"
                  style={{ width: `${(getStepIndex(data.order.status) / (steps.length - 1)) * 100}%` }}
                ></div>

                <div className="flex justify-between relative">
                  {steps.map((step, index) => {
                    const isCompleted = getStepIndex(data.order.status) >= index;
                    const isActive = getStepIndex(data.order.status) === index;
                    return (
                      <div key={step.id} className="flex flex-col items-center gap-2 w-1/3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white ${isCompleted ? 'border-sage text-sage shadow-[0_0_15px_rgba(198,29,112,0.3)]' : 'border-line text-muted'}`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] md:text-xs font-bold text-center ${isActive ? 'text-sage' : isCompleted ? 'text-ink' : 'text-muted'}`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6 bg-chalk p-4 rounded-xl border border-line">
              {data.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-white border border-line rounded-lg text-xs font-bold">{item.quantity.toLocaleString('fa-IR')}</span>
                    <span className="font-medium text-ink truncate max-w-[150px] md:max-w-none">{item.productName}</span>
                  </div>
                  <span className="font-bold text-ink whitespace-nowrap">{formatToman(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-line pt-4 flex justify-between items-center">
              <span className="font-bold text-ink">مبلغ کل</span>
              <span className="font-black text-xl text-sage">{formatToman(data.order.totalAmount)}</span>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [172/255] src\components\account\AccountBottomNav.tsx
SIZE 1749 bytes
==========================================================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Heart, MapPin, User } from 'lucide-react';

const items = [
  { href: '/account', label: 'داشبورد', icon: LayoutDashboard, exact: true },
  { href: '/account/orders', label: 'سفارشات', icon: Package },
  { href: '/account/wishlist', label: 'علاقه‌مندی', icon: Heart },
  { href: '/account/addresses', label: 'آدرس‌ها', icon: MapPin },
  { href: '/account/profile', label: 'پروفایل', icon: User },
];

export default function AccountBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-4 left-3 right-3 z-40">
      <div className="flex items-stretch h-16 bg-white/90 backdrop-blur-xl border border-[#e9e5eb] rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
        {items.map((item) => {
          // Logic to strictly match paths
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
                isActive ? 'text-[#c61d70] bg-[#fff0f7]' : 'text-[#77717b] hover:bg-[#f8f7fa]'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className="text-[9px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


==========================================================================================
FILE [173/255] src\components\account\AccountMobileHeader.tsx
SIZE 2651 bytes
==========================================================================================
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const pageTitles: Record<string, string> = {
  '/account': 'حساب کاربری',
  '/account/orders': 'سفارشات من',
  '/account/wishlist': 'علاقه‌مندی‌ها',
  '/account/addresses': 'آدرس‌های من',
  '/account/support': 'پشتیبانی',
  '/account/profile': 'پروفایل من',
};

export default function AccountMobileHeader() {
  const pathname = usePathname();
  const router = useRouter();

  let title = 'حساب کاربری';
  for (const [path, t] of Object.entries(pageTitles)) {
    if (pathname === path || pathname.startsWith(path + '/')) {
      title = t;
      break;
    }
  }

  const handleLogout = async () => {
    if (!confirm('آیا از حساب کاربری خود خارج می‌شوید؟')) return;
    try {
      await fetch('/api/account/logout', { method: 'POST' });
      toast.success('با موفقیت خارج شدید');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('خطا در خروج');
    }
  };

  return (
    <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-[#e9e5eb]">
      <div className="flex items-center justify-between h-14 px-3 gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-2 bg-[#fff0f7] border border-[#f2d7e5] rounded-xl text-[#c61d70] text-xs font-black shrink-0 active:scale-95 transition-transform"
          aria-label="بازگشت به فروشگاه"
        >
          <ArrowRight size={16} />
          فروشگاه
        </Link>

        <h1 className="font-black text-sm text-[#28242b] truncate flex-1 text-center">
          {title}
        </h1>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleLogout}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg active:scale-95 transition-transform"
            aria-label="خروج از حساب"
          >
            <LogOut size={18} />
          </button>
          <Link href="/" aria-label="فاطمه بیوتی لند">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="rounded-full border border-[#e9e5eb]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [174/255] src\components\account\AccountSidebar.tsx
SIZE 3586 bytes
==========================================================================================
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Heart, MapPin, User, LogOut, ArrowRight, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

const menuItems = [
  { name: 'داشبورد', href: '/account', icon: LayoutDashboard },
  { name: 'سفارشات من', href: '/account/orders', icon: Package },
  { name: 'علاقه‌مندی‌ها', href: '/account/wishlist', icon: Heart },
  { name: 'آدرس‌ها', href: '/account/addresses', icon: MapPin },
  { name: 'پشتیبانی', href: '/account/support', icon: MessageCircle },
  { name: 'پروفایل', href: '/account/profile', icon: User },
];

export default function AccountSidebar({ customer }: { customer: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/account/logout', { method: 'POST' });
      toast.success('خارج شدید');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('خطا در خروج');
    }
  };

  return (
    <aside className="hidden md:flex fixed right-0 top-0 bottom-0 w-64 bg-white border-l border-[#e9e5eb] flex-col z-30">
      <div className="p-5 border-b border-[#e9e5eb] shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <Image src="/logo.png" alt="فاطمه بیوتی لند" width={32} height={32} className="rounded-full border border-[#e9e5eb]" />
          <span className="font-black text-[#28242b]">فاطمه بیوتی لند</span>
        </Link>
        <div className="flex items-center gap-3 bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] p-3 rounded-xl border border-[#f2d7e5]">
          <div className="w-10 h-10 rounded-full bg-[#c61d70] text-white flex items-center justify-center font-black shrink-0">
            {customer.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[#28242b] truncate">{customer.name}</p>
            <p className="text-[10px] text-[#77717b] truncate" dir="ltr">{customer.email}</p>
          </div>
        </div>
      </div>

      <nav className="p-3 flex-1 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                isActive ? 'bg-[#c61d70] text-white shadow-md shadow-[#c61d70]/20' : 'text-[#77717b] hover:bg-[#f8f7fa] hover:text-[#28242b]'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#e9e5eb] shrink-0 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#77717b] hover:bg-[#f8f7fa] hover:text-[#28242b]">
          <ArrowRight size={18} /> بازگشت به فروشگاه
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut size={18} /> خروج از حساب
        </button>
      </div>
    </aside>
  );
}


==========================================================================================
FILE [175/255] src\components\admin\AdminBottomNav.tsx
SIZE 2625 bytes
==========================================================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Menu } from 'lucide-react';

export default function AdminBottomNav({
  pendingCount = 0,
  onOpenMenu
}: {
  pendingCount?: number;
  onOpenMenu: () => void;
}) {
  const pathname = usePathname();

  const primaryItems = [
    { href: '/admin', label: 'داشبورد', icon: LayoutDashboard, exact: true },
    { href: '/admin/orders', label: 'سفارشات', icon: Package, badge: pendingCount },
    { href: '/admin/products', label: 'محصولات', icon: ShoppingBag },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-3 right-3 z-50">
      <div className="flex h-[68px] items-center justify-around rounded-3xl border border-[#e9e5eb] bg-white/95 px-2 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-2xl overflow-hidden">
        
        {primaryItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 h-full rounded-2xl transition-all ${
                isActive ? 'text-[#c61d70]' : 'text-[#918a95]'
              }`}
            >
              {isActive && <div className="absolute inset-0.5 rounded-2xl bg-[#fff0f7] -z-10" />}
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className={isActive ? 'drop-shadow-sm' : ''} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -right-2.5 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#c61d70] px-1 text-[9px] font-black text-white ring-2 ring-white">
                    {item.badge.toLocaleString('fa-IR')}
                  </span>
                ) : null}
              </div>
              <span className={`text-[9px] ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
            </Link>
          );
        })}

        <button
          onClick={onOpenMenu}
          className="relative flex flex-1 flex-col items-center justify-center gap-1 h-full rounded-2xl text-[#918a95] hover:text-[#c61d70] transition-all"
        >
          <div className="relative">
            <Menu size={20} strokeWidth={1.8} />
          </div>
          <span className="text-[9px] font-bold">منو</span>
        </button>

      </div>
    </nav>
  );
}


==========================================================================================
FILE [176/255] src\components\admin\AdminGuard.tsx
SIZE 751 bytes
==========================================================================================
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import ClientRedirect from './ClientRedirect';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me-in-env');

export default async function AdminGuard({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('admin_token')?.value;

  // If no token, render ClientRedirect instead of calling redirect() on the server
  if (!token) {
    return <ClientRedirect to="/admin/login" />;
  }

  try {
    await jwtVerify(token, secret);
  } catch (err) {
    // If token is invalid, also redirect on the client
    return <ClientRedirect to="/admin/login" />;
  }

  return <>{children}</>;
}


==========================================================================================
FILE [177/255] src\components\admin\ChartsClientWrapper.tsx
SIZE 341 bytes
==========================================================================================
'use client';

import dynamic from 'next/dynamic';

const DashboardCharts = dynamic(() => import('./DashboardCharts'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-100 animate-pulse rounded-3xl" />
});

export default function ChartsClientWrapper({ data }: { data: any[] }) {
  return <DashboardCharts data={data} />;
}


==========================================================================================
FILE [178/255] src\components\admin\ClientRedirect.tsx
SIZE 640 bytes
==========================================================================================
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientRedirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c61d70] border-t-transparent" />
        <p className="text-sm font-bold text-[#77717b]">در حال انتقال...</p>
      </div>
    </div>
  );
}


==========================================================================================
FILE [179/255] src\components\admin\DashboardCharts.tsx
SIZE 3533 bytes
==========================================================================================
'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { formatToman } from '@/lib/currency';

export default function DashboardCharts({ data }: { data: any[] }) {
  // فرمت اعداد در Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-[#e9e5eb] p-3 rounded-xl shadow-xl text-xs" dir="rtl">
          <p className="font-bold text-[#28242b] mb-2">{label}</p>
          <p className="text-[#c61d70] font-black">درآمد: {formatToman(payload[0].value)}</p>
          <p className="text-[#77717b] font-bold mt-1">سفارشات: {payload[1]?.value} عدد</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* نمودار فروش (Area) */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm">
        <h3 className="text-sm font-black text-[#28242b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c61d70]"></span> روند درآمد ۷ روز اخیر
        </h3>
        <div className="h-[250px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c61d70" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#c61d70" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#77717b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#77717b' }} axisLine={false} tickLine={false} tickFormatter={(val) => val.toLocaleString()} width={60} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0edf1" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#c61d70" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* نمودار سفارشات (Bar) */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm">
        <h3 className="text-sm font-black text-[#28242b] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> تعداد سفارشات ۷ روز اخیر
        </h3>
        <div className="h-[250px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#77717b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#77717b' }} axisLine={false} tickLine={false} width={30} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0edf1" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#fafafc' }} />
              <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [180/255] src\components\admin\RichTextEditor.tsx
SIZE 9461 bytes
==========================================================================================
'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, Image as ImageIcon, AlignRight, AlignCenter, AlignLeft, Heading1, Heading2, Loader2, Link as LinkIcon, Highlighter, Quote, Undo, Redo, Eraser, Palette } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const TooltipBtn = ({ onClick, isActive, title, disabled, children }: any) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`relative group p-2.5 md:p-2 rounded-lg transition-all duration-200 flex items-center justify-center shrink-0
      ${isActive ? 'bg-[#c61d70] text-white shadow-md' : 'text-[#77717b] hover:bg-[#f8f7fa] hover:text-[#28242b] active:bg-[#f8f7fa]'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
  >
    {children}
    <span className="hidden md:block absolute -bottom-8 right-1/2 translate-x-1/2 bg-[#28242b] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-lg">
      {title}
    </span>
  </button>
);

const MenuBar = ({ editor }: { editor: any }) => {
  const [uploading, setUploading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const addImage = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) {
          editor.chain().focus().setImage({ src: data.url }).run();
          toast.success('عکس با موفقیت درج شد');
        } else toast.error(data.message || 'خطا در آپلود');
      } catch { toast.error('خطای شبکه'); } finally { setUploading(false); }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('لینک را وارد کنید:', previousUrl);
    if (url === null) return;
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-[#e9e5eb] shadow-sm rounded-t-xl">
      <div className="flex items-center gap-1 p-2 overflow-x-auto md:overflow-visible md:flex-wrap scrollbar-hide">
        
        <div className="flex items-center gap-0.5 md:gap-1 pl-2 border-l border-[#e9e5eb] shrink-0">
          <TooltipBtn onClick={() => editor.chain().focus().undo().run()} title="واگرد"><Undo size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().redo().run()} title="ازنو"><Redo size={18} /></TooltipBtn>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 pl-2 border-l border-[#e9e5eb] shrink-0">
          <TooltipBtn onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="ضخیم"><Bold size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="مورب"><Italic size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="زیرخط"><UnderlineIcon size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="خط‌خورده"><Strikethrough size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="هایلایت"><Highlighter size={18} /></TooltipBtn>
          
          <div className="relative shrink-0">
            <TooltipBtn onClick={() => setShowColorPicker(!showColorPicker)} title="رنگ متن"><Palette size={18} /></TooltipBtn>
            {showColorPicker && (
              <div className="absolute top-full right-0 mt-2 bg-white p-2 rounded-lg shadow-xl border border-[#e9e5eb] z-50 flex gap-1.5 flex-wrap w-32">
                {['#28242b', '#c61d70', '#2563eb', '#16a34a', '#d97706', '#dc2626'].map(c => (
                  <button key={c} type="button" onClick={() => { editor.chain().focus().setColor(c).run(); setShowColorPicker(false); }} className="w-7 h-7 rounded-md border border-gray-200" style={{ backgroundColor: c }} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 pl-2 border-l border-[#e9e5eb] shrink-0">
          <TooltipBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="تیتر اصلی"><Heading1 size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="تیتر فرعی"><Heading2 size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="نقل قول"><Quote size={18} /></TooltipBtn>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 pl-2 border-l border-[#e9e5eb] shrink-0">
          <TooltipBtn onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="لیست نقطه‌ای"><List size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="لیست شماره‌دار"><ListOrdered size={18} /></TooltipBtn>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 pl-2 border-l border-[#e9e5eb] shrink-0">
          <TooltipBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="راست‌چین"><AlignRight size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="وسط‌چین"><AlignCenter size={18} /></TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="چپ‌چین"><AlignLeft size={18} /></TooltipBtn>
        </div>

        <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
          <TooltipBtn onClick={setLink} isActive={editor.isActive('link')} title="درج لینک"><LinkIcon size={18} /></TooltipBtn>
          <TooltipBtn onClick={addImage} disabled={uploading} title="درج عکس">
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
          </TooltipBtn>
          <TooltipBtn onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="پاک کردن فرمت"><Eraser size={18} className="text-rose-500" /></TooltipBtn>
        </div>
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: { content: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image.configure({ inline: true, allowBase64: true }),
      TextStyle,
      Color,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-[#c61d70] underline underline-offset-4' } }),
      Underline,
      Highlight.configure({ multicolor: true }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base max-w-full focus:outline-none min-h-[350px] md:min-h-[500px] p-3 md:p-8 text-[#28242b] leading-loose overflow-x-hidden',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  return (
    <div className="border border-[#e9e5eb] rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#c61d70]/20 focus-within:border-[#c61d70]/50 transition-all flex flex-col shadow-sm">
      <MenuBar editor={editor} />
      <div className="flex-1 overflow-y-auto max-h-[65vh] md:max-h-[600px] bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}


==========================================================================================
FILE [181/255] src\components\icons\SocialIcons.tsx
SIZE 3557 bytes
==========================================================================================
type IconProps = {
  size?: number;
  className?: string;
};

export function InstagramIcon({ size = 14, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C8.74 0 8.333.015 7.053.072 2.695.272.273 2.69.073 7.052.015 8.333 0 8.74 0 12c0 3.26.015 3.667.072 4.947.2 4.358 2.618 6.78 6.98 6.98C8.333 23.985 8.74 24 12 24c3.26 0 3.667-.015 4.947-.072 4.358-.2 6.78-2.618 6.98-6.98.057-1.28.072-1.687.072-4.947 0-3.26-.015-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98C15.667.015 15.26 0 12 0zm0 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export function TelegramIcon({ size = 14, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

export function WhatsAppIcon({ size = 14, className = '' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}


==========================================================================================
FILE [182/255] src\components\journal\CategoryFilter.tsx
SIZE 904 bytes
==========================================================================================
import Link from 'next/link';

type Category = { slug: string; label: string };

export default function CategoryFilter({
  categories,
  activeCategory,
  basePath = '/journal',
}: {
  categories: Category[];
  activeCategory: string;
  basePath?: string;
}) {
  return (
    <div className="journal-category-filter" role="tablist" aria-label="فیلتر دسته‌بندی">
      {categories.map((cat) => {
        const isActive = cat.slug === activeCategory;
        const href = cat.slug === 'all' ? basePath : `${basePath}?category=${cat.slug}`;
        return (
          <Link
            key={cat.slug}
            href={href}
            className={`journal-category-pill ${isActive ? 'is-active' : ''}`}
            role="tab"
            aria-selected={isActive}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}


==========================================================================================
FILE [183/255] src\components\journal\JournalCard.tsx
SIZE 5306 bytes
==========================================================================================
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

type Article = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  categorySlug: string;
  readTime: string;
  publishedAt: string;
  coverImage?: string | null;
};

const categoryGradients: Record<string, string> = {
  education: 'from-[#FFF0F7] to-[#FCE5F0]',
  'buying-guide': 'from-[#EAF2E5] to-[#D5E2D0]',
  skincare: 'from-[#FCF0EB] to-[#F5DCCF]',
  haircare: 'from-[#F5EDE0] to-[#EBDCC4]',
  makeup: 'from-[#F5E8EC] to-[#EBD4DC]',
};

const categoryIcon: Record<string, string> = {
  education: '✦',
  'buying-guide': '◈',
  skincare: '❋',
  haircare: '❊',
  makeup: '✧',
};

/* ---------- Featured Article ---------- */
export function FeaturedCard({ article }: { article: Article }) {
  const gradient = categoryGradients[article.categorySlug] || 'from-[#FFF0F7] to-[#FCE5F0]';
  const icon = categoryIcon[article.categorySlug] || '✦';
  return (
    <Link href={`/journal/${article.slug}`} className="journal-featured group" aria-label={`مطالعه مقاله ${article.title}`}>
      <div className="journal-featured-visual">
        {article.coverImage ? (
          <div className="relative w-full h-full min-h-[300px] md:min-h-[480px] rounded-[24px] overflow-hidden">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        ) : (
          <div className={`journal-featured-art bg-gradient-to-br ${gradient}`}>
            <span className="journal-featured-icon" aria-hidden="true">{icon}</span>
            <span className="journal-featured-brand">FATEMEH BEAUTY LAND</span>
          </div>
        )}
      </div>
      <div className="journal-featured-content">
        <span className="journal-category-tag">{article.category}</span>
        <h2 className="journal-featured-title">{article.title}</h2>
        <p className="journal-featured-excerpt">{article.excerpt}</p>
        <div className="journal-meta">
          <span>{article.publishedAt}</span>
          <span className="journal-meta-dot">•</span>
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
        </div>
        <span className="journal-cta">مطالعه مقاله <ArrowLeft size={15} className="journal-cta-arrow" /></span>
      </div>
    </Link>
  );
}

/* ---------- Editor's Pick ---------- */
export function EditorsPickCard({ article }: { article: Article }) {
  const gradient = categoryGradients[article.categorySlug] || 'from-[#FFF0F7] to-[#FCE5F0]';
  const icon = categoryIcon[article.categorySlug] || '✦';
  return (
    <Link href={`/journal/${article.slug}`} className="journal-pick group" aria-label={`مطالعه مقاله ${article.title}`}>
      <div className="journal-pick-art relative overflow-hidden">
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="journal-pick-icon">{icon}</span>
          </div>
        )}
      </div>
      <div className="journal-pick-content">
        <span className="journal-category-tag">{article.category}</span>
        <h3 className="journal-pick-title">{article.title}</h3>
        <p className="journal-pick-excerpt">{article.excerpt}</p>
        <div className="journal-meta">
          <span>{article.publishedAt}</span>
          <span className="journal-meta-dot">•</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Standard Card ---------- */
export function StandardCard({ article }: { article: Article }) {
  const gradient = categoryGradients[article.categorySlug] || 'from-[#FFF0F7] to-[#FCE5F0]';
  const icon = categoryIcon[article.categorySlug] || '✦';
  return (
    <Link href={`/journal/${article.slug}`} className="journal-card group" aria-label={`مطالعه مقاله ${article.title}`}>
      <div className="journal-card-art relative overflow-hidden">
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="journal-card-icon">{icon}</span>
          </div>
        )}
      </div>
      <div className="journal-card-content">
        <span className="journal-category-tag">{article.category}</span>
        <h3 className="journal-card-title">{article.title}</h3>
        <p className="journal-card-excerpt">{article.excerpt}</p>
        <div className="journal-meta">
          <span>{article.publishedAt}</span>
          <span className="journal-meta-dot">•</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </Link>
  );
}


==========================================================================================
FILE [184/255] src\components\journal\ReadingProgress.tsx
SIZE 801 bytes
==========================================================================================
'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="journal-progress" aria-hidden="true">
      <div className="journal-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}


==========================================================================================
FILE [185/255] src\components\product\FrequentlyBoughtTogether.tsx
SIZE 5770 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import SafeImage from '@/components/product/SafeImage';
import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mainImage: string | null;
};

export default function FrequentlyBoughtTogether({ currentProduct, fbtProducts }: { currentProduct: Product, fbtProducts: Product[] }) {
  const { addBundle, openCart } = useCartStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([currentProduct.id, ...fbtProducts.map(p => p.id)]);
  
  const allProducts = [currentProduct, ...fbtProducts];

  const toggleSelection = (id: string) => {
    if (id === currentProduct.id) return; // محصول اصلی همیشه انتخاب است
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedProducts = allProducts.filter(p => selectedIds.includes(p.id));
  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddBundle = () => {
    if (selectedProducts.length === 0) return;
    
    // تبدیل به فرمت سبد خرید
    const cartItems = selectedProducts.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      mainImage: p.mainImage,
    }));

    addBundle(cartItems);
    toast.success('محصولات انتخابی به سبد خرید اضافه شدند');
    openCart();
  };

  if (fbtProducts.length === 0) return null;

  return (
    <div className="mt-12 bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-8 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fff0f7] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-xl font-black text-[#28242b] mb-6 flex items-center gap-2">
          <Sparkles className="text-[#c61d70]" size={24} />
          مشتریان دیگر این محصولات را با هم می‌خرند
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          {/* نمایش محصولات */}
          <div className="flex-1 flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4">
            {allProducts.map((product, index) => {
              const isSelected = selectedIds.includes(product.id);
              const isMain = index === 0;

              return (
                <div key={product.id} className="flex items-center gap-3 md:gap-4">
                  <div 
                    className={`relative w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 transition-all duration-300 p-2 flex flex-col items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#c61d70] bg-[#fffafc] shadow-md' : 'border-[#e9e5eb] bg-white opacity-60 grayscale'
                    } ${!isMain ? 'cursor-pointer hover:border-[#c61d70]/50' : ''}`}
                    onClick={() => toggleSelection(product.id)}
                  >
                    {/* چک‌باکس */}
                    {!isMain && (
                      <div className={`absolute top-2 right-2 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#c61d70] border-[#c61d70]' : 'bg-white border-[#e9e5eb]'}`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    )}
                    {isMain && (
                      <span className="absolute -top-3 bg-[#c61d70] text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 whitespace-nowrap">این محصول</span>
                    )}

                    <div className="relative w-full h-full">
                      {product.mainImage ? (
                        <SafeImage src={product.mainImage} alt={product.name} fill className="object-contain p-1" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 m-auto text-[#c61d70]/20" />
                      )}
                    </div>
                    <p className="text-[10px] md:text-xs font-bold text-[#28242b] mt-1 line-clamp-1 text-center">{product.name}</p>
                  </div>
                  
                  {index < allProducts.length - 1 && (
                    <div className="w-8 h-8 rounded-full bg-[#f8f7fa] border border-[#e9e5eb] flex items-center justify-center text-[#77717b] shrink-0">
                      <Plus size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* بخش پرداخت */}
          <div className="w-full lg:w-72 shrink-0 bg-[#fafafc] rounded-2xl p-5 border border-[#e9e5eb]">
            <div className="mb-4">
              <p className="text-xs text-[#77717b] mb-1">قیمت {selectedProducts.length} محصول انتخابی:</p>
              <p className="text-xl md:text-2xl font-black text-[#28242b]">{formatToman(totalPrice)}</p>
            </div>
            <button
              onClick={handleAddBundle}
              disabled={selectedProducts.length === 0}
              className="w-full h-12 bg-[#c61d70] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all disabled:opacity-50"
            >
              <ShoppingBag size={18} />
              افزودن همه به سبد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [186/255] src\components\product\ProductGallery.tsx
SIZE 3823 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff, X, ZoomIn } from 'lucide-react';

type ProductGalleryProps = {
  mainImage: string | null;
  gallery: string[] | null;
  name: string;
};

export default function ProductGallery({ mainImage, gallery, name }: ProductGalleryProps) {
  const allImages = Array.from(new Set([mainImage, ...(gallery || [])].filter((value): value is string => Boolean(value))));
  const [activeImage, setActiveImage] = useState(allImages[0] || null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!activeImage) {
    return (
      <div className="fl-gallery-main grid place-items-center" role="img" aria-label={`تصویر ${name} هنوز ثبت نشده است`}>
        <div className="flex flex-col items-center gap-3 text-[#c18aa7]">
          <span className="grid h-16 w-16 place-items-center rounded-2xl border border-[#f0dce7] bg-white"><ImageOff size={25} strokeWidth={1.5} /></span>
          <span className="text-[11px]">تصویر این محصول هنوز ثبت نشده است</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* تصویر اصلی */}
        <div 
          className="fl-gallery-main relative cursor-zoom-in group overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image 
            key={activeImage} 
            src={activeImage} 
            alt={`تصویر ${name}`} 
            fill 
            unoptimized={activeImage.startsWith('http')} 
            priority 
            sizes="(max-width: 900px) 100vw, 50vw" 
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 drop-shadow-lg transition-all duration-300 scale-50 group-hover:scale-100" size={32} />
          </div>
        </div>

        {/* تصاویر کوچک */}
        {allImages.length > 1 && (
          <div className="fl-gallery-thumbs" aria-label="تصاویر دیگر محصول">
            {allImages.map((image, index) => (
              <button 
                key={image} 
                type="button" 
                onClick={() => setActiveImage(image)} 
                className={`fl-gallery-thumb relative ${activeImage === image ? 'is-active' : ''}`} 
                aria-label={`نمایش تصویر شماره ${index + 1}`} 
                aria-pressed={activeImage === image}
              >
                <Image src={image} alt="" fill unoptimized={image.startsWith('http')} sizes="70px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* لایت‌باکس (نمایش تمام‌صفحه) */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsLightboxOpen(false)} 
            className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all z-10"
          >
            <X size={24} />
          </button>
          <div className="relative w-full max-w-4xl aspect-square md:aspect-video">
            <Image 
              src={activeImage} 
              alt={name} 
              fill 
              className="object-contain" 
              unoptimized={activeImage.startsWith('http')}
            />
          </div>
        </div>
      )}
    </>
  );
}


==========================================================================================
FILE [187/255] src\components\product\SafeImage.tsx
SIZE 1964 bytes
==========================================================================================
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  title?: string;
}

export default function SafeImage({ src, alt, fill, width, height, className, sizes, priority, title }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || src.trim() === '' || error) {
    if (fill) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#fcfafc] to-[#f7f2f7] text-[#d28aac]">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-[#c61d70]/20 shadow-[0_0_0_16px_rgba(255,255,255,.36),0_0_0_34px_rgba(255,255,255,.22)] flex items-center justify-center mb-2 md:mb-4">
            <Sparkles size={24} className="md:w-8 md:h-8" />
          </div>
          <span className="text-[8px] md:text-[10px] font-bold tracking-[.16em]">FATEMEHLAB</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-[#f8f7fa] text-[#d28aac] rounded-xl">
        <Sparkles size={24} />
      </div>
    );
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      fill={fill} 
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes} 
      priority={priority}
      className={className}
      onError={() => setError(true)}
      title={title || alt}
      itemProp="image"
      {...(src.startsWith('/') ? {
        placeholder: "blur" as const,
        blurDataURL: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2Y3ZjJmNyIvPjwvc3ZnPg==",
      } : {})}
    />
  );
}


==========================================================================================
FILE [188/255] src\components\product\StockNotifyButton.tsx
SIZE 4622 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import { Bell, X, Loader2, CheckCircle2, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function StockNotifyButton({ productId }: { productId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contact.length < 5) { toast.error('لطفاً ایمیل یا شماره موبایل معتبر وارد کنید'); return; }
    setLoading(true);

    try {
      const res = await fetch('/api/stock-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, contact }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        toast.success(data.message);
        setTimeout(() => { setIsOpen(false); setSuccess(false); setContact(''); }, 3000);
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full h-12 bg-[#f8f7fa] border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white hover:border-[#c61d70] transition-all"
      >
        <Bell size={18} className="text-[#c61d70]" />
        به من اطلاع بده (موجود شد)
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsOpen(false)} className="absolute top-4 left-4 p-1.5 text-[#77717b] hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors">
              <X size={18} />
            </button>

            {success ? (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-lg font-black text-[#28242b]">ثبت شد!</h3>
                <p className="text-xs text-[#77717b] mt-2">به محض موجود شدن این محصول، به شما اطلاع می‌دهیم.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-[#fff0f7] text-[#c61d70] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Mail size={24} />
                  </div>
                  <h3 className="text-lg font-black text-[#28242b]">اطلاع‌رسانی موجودی</h3>
                  <p className="text-xs text-[#77717b] mt-2 leading-relaxed">ایمیل یا شماره موبایل خود را وارد کنید تا به محض شارژ موجودی، به شما خبر دهیم.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input 
                    type="text" 
                    value={contact} 
                    onChange={(e) => setContact(e.target.value)} 
                    placeholder="ایمیل یا 09123456789"
                    className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm text-center outline-none focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 transition-all"
                    dir="ltr"
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Bell size={16} />}
                    {loading ? 'در حال ثبت...' : 'ثبت درخواست'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}


==========================================================================================
FILE [189/255] src\components\shared\EmptyState.tsx
SIZE 2766 bytes
==========================================================================================
import Link from 'next/link';
import { LucideIcon, ArrowLeft } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  variant?: 'default' | 'cart' | 'wishlist' | 'orders' | 'search';
}

const VARIANT_STYLES: Record<string, { iconBg: string; iconColor: string; borderColor: string }> = {
  default: { iconBg: 'bg-[#fff0f7]', iconColor: 'text-[#c61d70]', borderColor: 'border-[#e9e5eb]' },
  cart: { iconBg: 'bg-[#fff0f7]', iconColor: 'text-[#c61d70]', borderColor: 'border-[#f2d7e5]' },
  wishlist: { iconBg: 'bg-rose-50', iconColor: 'text-rose-400', borderColor: 'border-rose-100' },
  orders: { iconBg: 'bg-blue-50', iconColor: 'text-blue-400', borderColor: 'border-blue-100' },
  search: { iconBg: 'bg-amber-50', iconColor: 'text-amber-500', borderColor: 'border-amber-100' },
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  variant = 'default',
}: EmptyStateProps) {
  const styles = VARIANT_STYLES[variant];

  const ActionButton = actionHref ? (
    <Link
      href={actionHref}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all duration-300 hover:-translate-y-0.5"
    >
      {actionLabel}
      <ArrowLeft size={16} />
    </Link>
  ) : onAction ? (
    <button
      onClick={onAction}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all duration-300 hover:-translate-y-0.5"
    >
      {actionLabel}
    </button>
  ) : null;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border-2 border-dashed ${styles.borderColor} bg-gradient-to-br from-white via-[#fafafc] to-[#f8f7fa] p-10 md:p-14 text-center`}
    >
      <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#c61d70]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-[#c61d70]/5 blur-3xl" />

      <div className="relative">
        <div
          className={`mx-auto w-24 h-24 rounded-full ${styles.iconBg} ${styles.iconColor} flex items-center justify-center mb-6 shadow-inner ring-8 ring-white/50`}
        >
          <Icon size={44} strokeWidth={1.5} />
        </div>

        <h3 className="text-xl md:text-2xl font-black text-[#28242b] mb-3">{title}</h3>
        <p className="text-sm text-[#77717b] leading-loose max-w-md mx-auto mb-8">{description}</p>

        {ActionButton}
      </div>
    </div>
  );
}


==========================================================================================
FILE [190/255] src\components\shared\InvoiceTemplate.tsx
SIZE 6769 bytes
==========================================================================================
'use client';

import dynamic from 'next/dynamic';

// بارگذاری بارکد فقط در سمت کلاینت برای جلوگیری از کرش SSR
const Barcode = dynamic(() => import('react-barcode'), { ssr: false });
import { formatToman } from '@/lib/currency';
import { CheckCircle2 } from 'lucide-react';

export default function InvoiceTemplate({ order, items, isAdmin = false }: { order: any; items: any[]; isAdmin?: boolean }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('fa-IR');
  
  return (
    <div id="print-area" className="bg-white p-8 md:p-12 max-w-4xl mx-auto text-[#28242b] border border-gray-100 shadow-sm print:shadow-none print:border-none print:p-0">
      
      {/* هدر فاکتور */}
      <div className="flex justify-between items-start border-b-2 border-[#c61d70]/20 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#c61d70] mb-2">فاطمه بیوتی لند</h1>
          <p className="text-xs text-gray-500">فروشگاه محصولات آرایشی و بهداشتی</p>
          <p className="text-xs text-gray-500 mt-1">تلفن: ۰۹۹۰۵۳۱۶۳۲۷</p>
          <p className="text-xs text-gray-500">آدرس: تهران</p>
        </div>
        <div className="text-left">
          <div className="inline-block bg-[#fff0f7] border border-[#f2d7e5] rounded-lg px-4 py-2 text-center">
            <p className="text-[10px] text-[#c61d70] font-bold mb-1">{isAdmin ? 'لیبل پستی / فاکتور' : 'فاکتور رسمی فروش'}</p>
            <p className="text-lg font-black font-mono" dir="ltr">{order.trackingCode}</p>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">تاریخ صدور: {orderDate}</p>
          <p className="text-xs text-gray-500 text-right">وضعیت پرداخت: <span className="font-bold text-emerald-600">پرداخت شده</span></p>
        </div>
      </div>

      {/* اطلاعات مشتری */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3 border-b border-gray-200 pb-2">اطلاعات خریدار</h2>
          <p className="text-xs mb-1"><span className="text-gray-500 w-16 inline-block">نام:</span> <span className="font-bold">{order.firstName} {order.lastName}</span></p>
          <p className="text-xs mb-1"><span className="text-gray-500 w-16 inline-block">تلفن:</span> <span className="font-mono" dir="ltr">{order.phone}</span></p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <h2 className="text-sm font-bold mb-3 border-b border-gray-200 pb-2">اطلاعات ارسال</h2>
          <p className="text-xs mb-1"><span className="text-gray-500 w-16 inline-block">استان/شهر:</span> <span className="font-bold">{order.city}</span></p>
          <p className="text-xs mb-1"><span className="text-gray-500 w-16 inline-block">کد پستی:</span> <span className="font-mono" dir="ltr">{order.postalCode}</span></p>
          <p className="text-xs leading-relaxed mt-2"><span className="text-gray-500 block mb-1">آدرس:</span> {order.address}</p>
        </div>
      </div>

      {/* جدول محصولات */}
      <table className="w-full text-right mb-8">
        <thead>
          <tr className="bg-[#28242b] text-white text-xs">
            <th className="py-3 px-4 rounded-r-xl font-medium">ردیف</th>
            <th className="py-3 px-4 font-medium">شرح کالا</th>
            <th className="py-3 px-4 font-medium text-center">تعداد</th>
            <th className="py-3 px-4 font-medium text-left">قیمت واحد</th>
            <th className="py-3 px-4 rounded-l-xl font-medium text-left">مبلغ کل</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <tr key={item.id} className="text-xs hover:bg-gray-50">
              <td className="py-3 px-4 text-gray-500">{(index + 1).toLocaleString('fa-IR')}</td>
              <td className="py-3 px-4 font-bold">{item.productName}</td>
              <td className="py-3 px-4 text-center font-bold">{item.quantity.toLocaleString('fa-IR')}</td>
              <td className="py-3 px-4 text-left">{formatToman(item.price)}</td>
              <td className="py-3 px-4 text-left font-bold">{formatToman(item.price * item.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* اطلاعات مالی */}
      <div className="flex justify-between items-end border-t-2 border-gray-200 pt-6">
        <div className="w-1/2">
          {order.notes && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100 text-xs">
              <span className="font-bold text-amber-800 block mb-1">یادداشت:</span>
              <span className="text-amber-700">{order.notes}</span>
            </div>
          )}
        </div>
        <div className="w-1/2 max-w-xs space-y-2 text-xs">
          <div className="flex justify-between text-gray-500">
            <span>جمع کل کالاها:</span>
            <span>{formatToman(order.totalAmount + order.discountAmount)}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-rose-500">
              <span>تخفیف {order.couponCode ? `(${order.couponCode})` : ''}:</span>
              <span>{formatToman(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-[#c61d70] border-t border-gray-200 pt-2 mt-2">
            <span>مبلغ نهایی پرداخت شده:</span>
            <span>{formatToman(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* بارکد و مهر */}
      <div className="mt-12 pt-6 border-t border-dashed border-gray-300 flex justify-between items-end">
        <div className="text-center">
          <p className="text-[10px] text-gray-500 mb-2">کد رهگیری پستی</p>
          <Barcode value={order.trackingCode} width={1.5} height={50} fontSize={12} background="#ffffff" />
        </div>
        <div className="text-center opacity-70">
          <p className="text-[10px] text-gray-500 mb-2">مهر و امضای فروشنده</p>
          <div className="w-24 h-24 border-2 border-[#c61d70] border-dashed rounded-full flex items-center justify-center transform -rotate-12">
             <span className="text-[10px] font-black text-[#c61d70] leading-tight text-center">فاطمه<br/>بیوتی لند</span>
          </div>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [191/255] src\components\shared\PageTransition.tsx
SIZE 685 bytes
==========================================================================================
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fade out
    setIsVisible(false);
    // Fade in after path change
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ minHeight: '100dvh' }}
    >
      {children}
    </div>
  );
}


==========================================================================================
FILE [192/255] src\components\shared\PersianDatePicker.tsx
SIZE 1432 bytes
==========================================================================================
'use client';

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Calendar as CalendarIcon } from "lucide-react";

interface PersianDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  withTime?: boolean;
  placeholder?: string;
}

export default function PersianDatePicker({ 
  value, 
  onChange, 
  withTime = false, 
  placeholder = "انتخاب تاریخ..." 
}: PersianDatePickerProps) {
  return (
    <div className="relative w-full">
      <DatePicker
        value={value}
        onChange={(date) => onChange(date ? date.toDate() : null)}
        calendar={persian}
        locale={persian_fa}
        format={withTime ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD"}
        placeholder={placeholder}
        calendarPosition="bottom-right"
        plugins={withTime ? [<TimePicker position="bottom" hideSeconds />] : []}
        inputClass="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] pr-11 pl-4 py-3 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white"
        containerClassName="w-full"
      />
      <CalendarIcon 
        size={18} 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c61d70] pointer-events-none" 
      />
    </div>
  );
}


==========================================================================================
FILE [193/255] src\components\shared\PrintButton.tsx
SIZE 381 bytes
==========================================================================================
'use client';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-bold text-white bg-[#c61d70] px-6 py-2 rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d]">
      <Printer size={16} /> چاپ / دانلود فاکتور
    </button>
  );
}


==========================================================================================
FILE [194/255] src\components\shared\RouteProgress.tsx
SIZE 1311 bytes
==========================================================================================
'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteProgress() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;
    
    setVisible(true);
    setProgress(20);
    
    const t1 = setTimeout(() => setProgress(50), 80);
    const t2 = setTimeout(() => setProgress(85), 200);
    const t3 = setTimeout(() => setProgress(100), 350);
    const t4 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 550);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-[#c61d70] via-[#e84e9e] to-[#c61d70] shadow-[0_0_10px_rgba(198,29,112,0.6)] transition-all duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />
    </div>
  );
}


==========================================================================================
FILE [195/255] src\components\shared\ScrollToTop.tsx
SIZE 1922 bytes
==========================================================================================
'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const percent = height > 0 ? (scrolled / height) * 100 : 0;
      setProgress(percent);
      setVisible(scrolled > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const circumference = 2 * Math.PI * 22;

  return (
    <button
      onClick={scrollUp}
      className={`fixed bottom-24 left-4 md:bottom-6 md:left-6 z-30 w-12 h-12 rounded-full bg-white/95 backdrop-blur-xl border border-[#e9e5eb] shadow-xl flex items-center justify-center text-[#c61d70] transition-all duration-300 hover:scale-110 hover:border-[#c61d70] hover:shadow-2xl ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="بازگشت به بالای صفحه"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="none" stroke="#f0edf1" strokeWidth="2" />
        <circle
          cx="24" cy="24" r="22"
          fill="none" stroke="#c61d70" strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress / 100)}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>
      <ArrowUp size={18} className="relative z-10" strokeWidth={2.5} />
    </button>
  );
}


==========================================================================================
FILE [196/255] src\components\shared\ThemeToggle.tsx
SIZE 982 bytes
==========================================================================================
'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fl-icon-button relative overflow-hidden group"
      aria-label="تغییر تم"
    >
      <div className="relative w-5 h-5">
        <Sun className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${theme === 'dark' ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
        <Moon className={`absolute inset-0 h-5 w-5 transition-all duration-500 ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} />
      </div>
    </button>
  );
}


==========================================================================================
FILE [197/255] src\components\shared\WebVitals.tsx
SIZE 452 bytes
==========================================================================================
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    // ارسال به API ما (فقط در production)
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      }).catch(() => {});
    }
  });

  return null;
}


==========================================================================================
FILE [198/255] src\components\storefront\AdvancedFilters.tsx
SIZE 14727 bytes
==========================================================================================
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Check, Package, DollarSign } from 'lucide-react';

type FilterData = {
  categories: { id: string; name: string; slug: string }[];
  brands: string[];
  skinTypes: string[];
  maxPrice: number;
};

const SKIN_TYPES_LIST = ['پوست خشک', 'پوست چرب', 'پوست مختلط', 'پوست حساس', 'موی خشک', 'موی چرب', 'همه انواع پوست'];

const SORT_OPTIONS = [
  { label: 'جدیدترین', value: 'newest' },
  { label: 'ارزان‌ترین', value: 'cheapest' },
  { label: 'گران‌ترین', value: 'expensive' },
];

export default function AdvancedFilters({ data, totalResults }: { data: FilterData; totalResults: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // خواندن فیلترهای فعال از URL
  const currentBrands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
  const currentSkinTypes = searchParams.get('skinTypes')?.split(',').filter(Boolean) || [];
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  // استیت اسلایدر قیمت
  const [priceRange, setPriceRange] = useState({
    min: currentMinPrice ? parseInt(currentMinPrice) : 0,
    max: currentMaxPrice ? parseInt(currentMaxPrice) : data.maxPrice,
  });

  // آپدیت URL
  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    updateURL({ brands: newBrands.length > 0 ? newBrands.join(',') : null });
  };

  const toggleSkinType = (type: string) => {
    const newTypes = currentSkinTypes.includes(type)
      ? currentSkinTypes.filter(t => t !== type)
      : [...currentSkinTypes, type];
    updateURL({ skinTypes: newTypes.length > 0 ? newTypes.join(',') : null });
  };

  const setCategory = (slug: string | null) => {
    updateURL({ category: slug });
  };

  const setSort = (sort: string) => {
    updateURL({ sort });
  };

  const applyPriceRange = () => {
    updateURL({
      minPrice: priceRange.min > 0 ? priceRange.min.toString() : null,
      maxPrice: priceRange.max < data.maxPrice ? priceRange.max.toString() : null,
    });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  // شمارش فیلترهای فعال
  const activeFiltersCount = 
    currentBrands.length + 
    currentSkinTypes.length + 
    (currentCategory ? 1 : 0) + 
    (currentInStock ? 1 : 0) + 
    (currentMinPrice ? 1 : 0) + 
    (currentMaxPrice ? 1 : 0);

  // چیپ‌های فیلتر فعال
  const activeChips = [
    ...currentBrands.map(b => ({ label: `برند: ${b}`, onRemove: () => toggleBrand(b) })),
    ...currentSkinTypes.map(t => ({ label: t, onRemove: () => toggleSkinType(t) })),
    ...(currentCategory ? [{ label: `دسته: ${data.categories.find(c => c.slug === currentCategory)?.name || currentCategory}`, onRemove: () => setCategory(null) }] : []),
    ...(currentInStock ? [{ label: 'فقط موجود', onRemove: () => updateURL({ inStock: null }) }] : []),
    ...(currentMinPrice || currentMaxPrice ? [{ 
      label: `قیمت: ${currentMinPrice ? parseInt(currentMinPrice).toLocaleString('fa-IR') : '۰'} - ${currentMaxPrice ? parseInt(currentMaxPrice).toLocaleString('fa-IR') : data.maxPrice.toLocaleString('fa-IR')}`, 
      onRemove: () => updateURL({ minPrice: null, maxPrice: null }) 
    }] : []),
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      {/* دسته‌بندی */}
      <div>
        <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#c61d70] rounded-full"></span>
          دسته‌بندی
        </h3>
        <div className="space-y-1.5">
          <button onClick={() => setCategory(null)} className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold transition-colors ${!currentCategory ? 'bg-[#fff0f7] text-[#c61d70]' : 'text-[#77717b] hover:bg-[#f8f7fa]'}`}>
            همه محصولات
          </button>
          {data.categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setCategory(cat.slug)} 
              className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold transition-colors ${currentCategory === cat.slug ? 'bg-[#fff0f7] text-[#c61d70]' : 'text-[#77717b] hover:bg-[#f8f7fa]'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* برند */}
      {data.brands.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#c61d70] rounded-full"></span>
            برند
          </h3>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pl-1">
            {data.brands.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group py-1">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${currentBrands.includes(brand) ? 'bg-[#c61d70] border-[#c61d70]' : 'border-[#e9e5eb] group-hover:border-[#c61d70]/40'}`}>
                  {currentBrands.includes(brand) && <Check size={10} className="text-white" />}
                </div>
                <span className="text-xs font-medium text-[#28242b] group-hover:text-[#c61d70] transition-colors">{brand}</span>
                <input type="checkbox" checked={currentBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="hidden" />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* نوع پوست/مو */}
      {data.skinTypes.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#c61d70] rounded-full"></span>
            نوع پوست / مو
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skinTypes.map(type => (
              <button
                key={type}
                onClick={() => toggleSkinType(type)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentSkinTypes.includes(type) ? 'bg-[#c61d70] text-white border-[#c61d70]' : 'bg-white text-[#77717b] border-[#e9e5eb] hover:border-[#c61d70]/40'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* محدوده قیمت */}
      <div>
        <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#c61d70] rounded-full"></span>
          محدوده قیمت (تومان)
        </h3>
        <div className="bg-[#f8f7fa] rounded-xl p-3 border border-[#e9e5eb]">
          <div className="flex justify-between text-xs font-bold text-[#28242b] mb-3">
            <span>از: {(priceRange.min / 10).toLocaleString('fa-IR')}</span>
            <span>تا: {(priceRange.max / 10).toLocaleString('fa-IR')}</span>
          </div>
          <input 
            type="range" 
            min={0} 
            max={data.maxPrice} 
            step={10000}
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
            className="w-full accent-[#c61d70]"
          />
          <button 
            onClick={applyPriceRange} 
            className="w-full mt-3 py-2 bg-[#c61d70] text-white text-xs font-bold rounded-lg hover:bg-[#a9155d] transition-colors"
          >
            اعمال محدوده قیمت
          </button>
        </div>
      </div>

      {/* موجودی */}
      <div>
        <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#c61d70] rounded-full"></span>
          موجودی
        </h3>
        <button
          onClick={() => updateURL({ inStock: currentInStock ? null : 'true' })}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${currentInStock ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-[#e9e5eb] text-[#77717b] hover:border-emerald-200'}`}
        >
          <span className="flex items-center gap-2"><Package size={14} /> فقط محصولات موجود</span>
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${currentInStock ? 'bg-emerald-500 border-emerald-500' : 'border-[#e9e5eb]'}`}>
            {currentInStock && <Check size={10} className="text-white" />}
          </div>
        </button>
      </div>

      {activeFiltersCount > 0 && (
        <button onClick={clearAllFilters} className="w-full py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
          حذف همه فیلترها ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* سایدبار دسکتاپ */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="bg-white rounded-2xl border border-[#e9e5eb] shadow-sm sticky top-24 p-5">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#e9e5eb]">
            <h2 className="font-black text-sm text-[#28242b] flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#c61d70]" />
              فیلترها
            </h2>
            {activeFiltersCount > 0 && (
              <span className="text-[10px] bg-[#c61d70] text-white px-2 py-0.5 rounded-full font-bold">
                {activeFiltersCount.toLocaleString('fa-IR')} فعال
              </span>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* موبایل: دکمه باز کردن فیلتر + مرتب‌سازی */}
      <div className="lg:hidden flex items-center gap-2 mb-4">
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e9e5eb] rounded-xl text-xs font-bold text-[#28242b] shadow-sm relative">
          <SlidersHorizontal size={14} className="text-[#c61d70]" />
          فیلترها
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-[#c61d70] text-white text-[9px] rounded-full absolute -top-2 -right-2">
              {activeFiltersCount.toLocaleString('fa-IR')}
            </span>
          )}
        </button>
        
        <div className="flex-1"></div>
        
        <select 
          value={currentSort} 
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 bg-white border border-[#e9e5eb] rounded-xl text-xs font-bold text-[#28242b] cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* سایدبار دسکتاپ: مرتب‌سازی */}
      <div className="hidden lg:flex items-center justify-end gap-2 mb-4">
        <span className="text-xs text-[#77717b] font-bold">مرتب‌سازی:</span>
        <div className="flex bg-white border border-[#e9e5eb] rounded-xl p-1 shadow-sm">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${currentSort === opt.value ? 'bg-[#28242b] text-white' : 'text-[#77717b] hover:text-[#28242b]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* چیپ‌های فیلتر فعال */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-[#77717b]">فیلترهای فعال:</span>
          {activeChips.map((chip, i) => (
            <button
              key={i}
              onClick={chip.onRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff0f7] border border-[#f2d7e5] text-[#c61d70] text-[10px] font-bold rounded-lg hover:bg-[#fce5f0] transition-colors"
            >
              {chip.label}
              <X size={10} />
            </button>
          ))}
        </div>
      )}

      {/* کشوی موبایل */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-[85vw] max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[#e9e5eb] bg-[#fafafc]">
              <h2 className="font-black text-sm text-[#28242b]">فیلترهای پیشرفته</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white border border-[#e9e5eb] rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterContent />
            </div>
            <div className="p-4 border-t border-[#e9e5eb] bg-white">
              <button onClick={() => setIsOpen(false)} className="w-full py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20">
                مشاهده {totalResults.toLocaleString('fa-IR')} محصول
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


==========================================================================================
FILE [199/255] src\components\storefront\AuroraBackground.tsx
SIZE 292 bytes
==========================================================================================
export default function AuroraBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      <div className="aurora-orb orb-pink" />
      <div className="aurora-orb orb-purple" />
      <div className="aurora-orb orb-peach" />
    </div>
  );
}


==========================================================================================
FILE [200/255] src\components\storefront\BottomNav.tsx
SIZE 3908 bytes
==========================================================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, BookOpen, ShoppingBag, User, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useEffect, useState, useRef } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, show: false });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsMounted(true); }, []);

  const cartCount = isMounted ? items.reduce((total, item) => total + item.quantity, 0) : 0;
  const isCartPage = pathname === '/cart' || pathname === '/checkout';

  const isHidden =
    pathname.startsWith('/admin') ||
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname.startsWith('/account') ||
    (pathname.startsWith('/products/') && pathname !== '/products');

  const navItems = [
    { href: '/', label: 'خانه', icon: Home, match: 'exact' as const },
    { href: '/products', label: 'محصولات', icon: LayoutGrid, match: 'prefix' as const },
    { href: '/journal', label: 'مجله', icon: BookOpen, match: 'prefix' as const },
    { href: '/track', label: 'رهگیری', icon: Truck, match: 'prefix' as const },
    { href: '/account', label: 'حساب', icon: User, match: 'prefix' as const },
    { href: '/cart', label: 'سبد', icon: ShoppingBag, match: 'prefix' as const, badge: cartCount },
  ];

  const activeIndex = isHidden ? -1 : navItems.findIndex((item) => {
    if (item.match === 'exact') return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  });

  useEffect(() => {
    if (activeIndex < 0 || !navRef.current) {
      setIndicator((prev) => ({ ...prev, show: false }));
      return;
    }
    const nav = navRef.current;
    const allItems = nav.querySelectorAll('.fl-bottom-nav-item');
    const activeEl = allItems[activeIndex] as HTMLElement;
    if (activeEl) {
      const navRect = nav.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      setIndicator({
        left: activeRect.left - navRect.left,
        width: activeRect.width,
        show: true,
      });
    }
  }, [activeIndex, pathname, cartCount]);

  if (isHidden) return null;

  return (
    <nav className="fl-bottom-nav md:hidden" aria-label="ناوبری موبایل">
      <div className="fl-bottom-nav-inner" ref={navRef}>
        {indicator.show && (
          <div
            className="fl-bottom-nav-pill"
            style={{
              width: `${indicator.width}px`,
              transform: `translateX(${indicator.left}px)`,
            }}
            aria-hidden="true"
          />
        )}

        {navItems.map((item, idx) => {
          const isActive = idx === activeIndex;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`fl-bottom-nav-item ${isActive ? 'is-active' : ''}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="fl-bottom-nav-icon-wrap">
                <Icon size={22} strokeWidth={isActive ? 2.4 : 1.7} />
                {(item.badge && item.badge > 0 && !isCartPage) ? (
                  <span className="fl-bottom-nav-badge">
                    {item.badge.toLocaleString('fa-IR')}
                  </span>
                ) : null}
              </div>
              <span className="fl-bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}


==========================================================================================
FILE [201/255] src\components\storefront\CartDrawer.tsx
SIZE 7251 bytes
==========================================================================================
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/product/SafeImage';
import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isMounted || !isCartOpen) return null;

  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={closeCart} 
      />

      <div className="relative w-full max-w-md h-full bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        
        <div className="flex items-center justify-between p-5 border-b border-[#e9e5eb] bg-gradient-to-r from-[#fff0f7] to-white">
          <h2 className="text-lg font-black text-[#28242b] flex items-center gap-2">
            <ShoppingBag className="text-[#c61d70]" size={20} />
            سبد خرید شما
            <span className="bg-[#c61d70] text-white text-[10px] px-2 py-0.5 rounded-full">
              {items.reduce((t, i) => t + i.quantity, 0).toLocaleString('fa-IR')} کالا
            </span>
          </h2>
          <button onClick={closeCart} className="p-2 bg-white rounded-xl border border-[#e9e5eb] text-[#77717b] hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-24 h-24 bg-[#fff0f7] rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-[#c61d70]/40" />
              </div>
              <h3 className="font-black text-lg text-[#28242b]">سبد خرید شما خالی است</h3>
              <p className="text-sm text-[#77717b] max-w-[250px]">محصولات مورد علاقه خود را پیدا کنید و به سبد خرید اضافه کنید.</p>
              <button onClick={closeCart} className="mt-4 px-6 py-2.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors">
                مشاهده محصولات
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white p-3 rounded-2xl border border-[#e9e5eb] shadow-sm group">
                <div className="relative w-20 h-20 shrink-0 bg-[#fafafc] rounded-xl overflow-hidden border border-[#f5f0f2]">
                  <SafeImage src={item.mainImage} alt={item.name} fill className="object-contain p-2" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <Link href={`/products/${item.slug}`} onClick={closeCart} className="text-sm font-bold text-[#28242b] hover:text-[#c61d70] transition-colors line-clamp-2 leading-relaxed">
                      {item.name}
                    </Link>
                    <button onClick={() => removeItem(item.id)} className="p-1.5 text-[#918a95] hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-[#fafafc] border border-[#e9e5eb] rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-white hover:text-[#c61d70] text-[#77717b] transition-colors">
                        <Plus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-[#28242b]">{item.quantity.toLocaleString('fa-IR')}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1.5 hover:bg-white hover:text-[#c61d70] text-[#77717b] transition-colors disabled:opacity-30">
                        <Minus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-black text-[#28242b]">{formatToman(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-[#e9e5eb] bg-white space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#77717b]">جمع کل</span>
              <span className="font-bold text-[#28242b]">{formatToman(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#77717b]">هزینه ارسال</span>
              <span className="text-[#c61d70] font-bold text-xs">در مرحله بعد</span>
            </div>
            <div className="border-t border-dashed border-[#e9e5eb] pt-4 flex justify-between items-center">
              <span className="font-black text-[#28242b]">مبلغ قابل پرداخت</span>
              <span className="font-black text-xl text-[#c61d70]">{formatToman(totalPrice)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center gap-1.5 bg-[#c61d70] text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all">
                تسویه حساب <ArrowLeft size={16} />
              </Link>
              <Link href="/cart" onClick={closeCart} className="flex items-center justify-center gap-1.5 bg-[#fafafc] text-[#28242b] border border-[#e9e5eb] text-sm font-bold py-3 rounded-xl hover:bg-white transition-all">
                مشاهده سبد
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#77717b]">
              <ShieldCheck size={12} className="text-emerald-500" />
              پرداخت امن و رمزنگاری شده
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


==========================================================================================
FILE [202/255] src\components\storefront\FloatingSupportButton.tsx
SIZE 3040 bytes
==========================================================================================
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Headphones, ArrowLeft } from 'lucide-react';

export default function FloatingSupportButton() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/account/me')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setLoggedIn(Boolean(data?.success)))
      .catch(() => setLoggedIn(false));
  }, []);

  // 🛡️ مخفی کردن در صفحات خاص (ادمین، حساب، سبد، تسویه، لاگین)
  const hidden =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/cart') ||
    pathname === '/login' ||
    pathname === '/register';

  if (!isMounted || hidden || loggedIn === null) return null;

  return (
    <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40">
      {expanded && (
        <div className="mb-3 w-72 rounded-2xl border border-[#e9e5eb] bg-white/95 backdrop-blur-xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-start gap-3 mb-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center shadow-md">
              <Headphones size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-[#28242b]">چطور می‌تونیم کمکتون کنیم؟</p>
              <p className="text-xs text-[#77717b] mt-1 leading-relaxed">
                سوال یا مشکلی دارید؟ تیم پشتیبانی همیشه آماده کمک است.
              </p>
            </div>
          </div>
          <Link
            href={loggedIn ? '/account/support' : '/account/login?redirect=/account/support'}
            onClick={() => setExpanded(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#c61d70] text-white text-xs font-black shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors"
          >
            {loggedIn ? 'ورود به پشتیبانی' : 'ورود برای پشتیبانی'}
            <ArrowLeft size={14} />
          </Link>
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white shadow-2xl shadow-[#c61d70]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-glow-pulse"
        aria-label="پشتیبانی"
      >
        {expanded ? <X size={22} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}


==========================================================================================
FILE [203/255] src\components\storefront\Footer.tsx
SIZE 5025 bytes
==========================================================================================
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowUpLeft, Mail, Phone, MapPin } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/SocialIcons';

export default function Footer() {
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear().toLocaleString('fa-IR', { useGrouping: false }));
  }, []);

  return (
    <footer className="fl-footer">
      <div className="container-custom fl-footer-main">
        <div className="fl-footer-brand">
          <Link href="/" className="fl-brand w-fit">
            <span className="fl-brand-mark">
              <Image src="/logo.png" alt="نشان فاطمه بیوتی لند" fill sizes="39px" />
            </span>
            <span className="flex flex-col">
              <span className="fl-brand-name">فاطمه بیوتی لند</span>
              <span className="fl-brand-latin">FATEMEH BEAUTY LAND</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-[12px] leading-[2.1] text-[#77717b]">
            فاطمه بیوتی لند؛ جایی که زیبایی، با آگاهی آغاز می‌شود.
          </p>
          <Link href="/products" className="fl-text-link mt-4">
            مرور محصولات <ArrowUpLeft size={15} />
          </Link>

          <div className="mt-5 space-y-2">
            <a href="tel:09905316327" className="flex items-center gap-2 text-[11px] text-[#77717b] hover:text-[#c61d70] transition-colors group">
              <Phone size={13} className="shrink-0" />
              <span dir="ltr">۰۹۹۰۵۳۱۶۳۲۷</span>
            </a>
            <a href="mailto:mirzaeico255@gmail.com" className="flex items-center gap-2 text-[11px] text-[#77717b] hover:text-[#c61d70] transition-colors group">
              <Mail size={13} className="shrink-0" />
              <span dir="ltr">mirzaeico255@gmail.com</span>
            </a>
            <a
              href="https://instagram.com/fatemehlab.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-[#77717b] hover:text-[#c61d70] transition-all duration-300 group"
            >
              <InstagramIcon size={14} className="shrink-0 transition-transform duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(198,29,112,0.4)]" />
              <span dir="ltr">@fatemehlab.ir</span>
            </a>
            <span className="flex items-center gap-2 text-[11px] text-[#77717b]">
              <MapPin size={13} className="shrink-0" />
              تهران
            </span>
          </div>
        </div>

        <div>
          <h2 className="fl-footer-title">فروشگاه</h2>
          <ul className="grid gap-3">
            <li><Link className="fl-footer-link" href="/products">همه محصولات</Link></li>
            <li><Link className="fl-footer-link" href="/cart">سبد خرید</Link></li>
            <li><Link className="fl-footer-link" href="/track">رهگیری سفارش</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="fl-footer-title">راهنما و اطلاعات</h2>
          <ul className="grid gap-3">
            <li><Link className="fl-footer-link" href="/about">درباره فاطمه بیوتی لند</Link></li>
            <li><Link className="fl-footer-link" href="/journal">مجله فاطمه بیوتی لند</Link></li>
            <li><Link className="fl-footer-link" href="/faq">سؤالات متداول</Link></li>
            <li><Link className="fl-footer-link" href="/contact">تماس با ما</Link></li>
          </ul>
        </div>
      </div>

      <div className="container-custom fl-footer-bottom">
        <div className="flex flex-col items-start md:flex-row md:items-center gap-3 md:gap-6">
          <p>© {year} فاطمه بیوتی لند. تمامی حقوق محفوظ است.</p>
          <p className="hidden md:flex items-center gap-2 opacity-70 text-[10px]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#c61d70]" />
            مراقبت، با انتخابی آگاهانه
          </p>
        </div>
        
        {/* لوگوی اینماد */}
        <div className="mt-4 md:mt-0 flex items-center justify-center bg-white rounded-lg p-1">
          <a 
            referrerPolicy="origin" 
            target="_blank" 
            href="https://trustseal.enamad.ir/?id=8646028&Code=0k8tNe8JU0wOu1wOUF3YVI3faqSFyznQ"
          >
            <img 
              referrerPolicy="origin" 
              src="https://trustseal.enamad.ir/logo.aspx?id=8646028&Code=0k8tNe8JU0wOu1wOUF3YVI3faqSFyznQ" 
              alt="نماد اعتماد الکترونیکی" 
              style={{ cursor: 'pointer', height: '85px', width: 'auto' }} 
            />
          </a>
        </div>
      </div>
    </footer>
  );
}


==========================================================================================
FILE [204/255] src\components\storefront\Header.tsx
SIZE 6130 bytes
==========================================================================================
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Search, ShoppingBag, X, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import UserMenuButton from './UserMenuButton';
import InstantSearch from './InstantSearch';

const navigation = [
  { href: '/products', label: 'محصولات' },
  { href: '/about', label: 'درباره فاطمه بیوتی لند' },
  { href: '/journal', label: 'مجله' },
  { href: '/track', label: 'رهگیری سفارش' },
  { href: '/faq', label: 'راهنمای خرید' },
];

export default function Header() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const cartCount = isMounted
    ? items.reduce((total, item) => total + item.quantity, 0)
    : 0;
  const isCartPage = pathname === '/cart' || pathname === '/checkout';

  const closeOverlays = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#e9e5eb] bg-white/90 backdrop-blur-xl">
        <div className="container-custom flex h-16 items-center justify-between gap-2 md:h-[74px]">
          
          {/* لوگو */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="صفحه اصلی فاطمه بیوتی لند">
            <span className="relative w-9 h-9 overflow-hidden rounded-full border border-[#f1dce7] bg-white shrink-0">
              <Image src="/logo.png" alt="نشان فاطمه بیوتی لند" fill sizes="36px" priority />
            </span>
            <span className="flex flex-col whitespace-nowrap hidden xs:flex">
              <span className="text-sm font-black text-[#28242b] leading-tight">فاطمه بیوتی لند</span>
              <span className="text-[8px] font-bold tracking-widest text-[#a49ba5]" dir="ltr">FATEMEH BEAUTY LAND</span>
            </span>
          </Link>

          {/* ناوبری دسکتاپ */}
          <nav className="hidden md:flex items-center gap-6" aria-label="ناوبری اصلی">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-bold text-[#625c66] hover:text-[#c61d70] transition-colors"
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* آیکون‌ها */}
          <div className="flex items-center gap-1 md:gap-2">
            <div className="hidden md:block"><InstantSearch /></div>
            <UserMenuButton />
            
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl text-[#625c66] hover:bg-[#fff0f7] hover:text-[#c61d70] transition-colors"
              aria-label="سبد خرید"
            >
              <ShoppingBag size={20} strokeWidth={2} />
              {cartCount > 0 && !isCartPage && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#c61d70] px-1 text-[9px] font-black text-white ring-2 ring-white">
                  {cartCount.toLocaleString('fa-IR')}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-[#625c66] hover:bg-[#fff0f7] hover:text-[#c61d70] transition-colors md:hidden"
              aria-label="باز کردن منو"
            >
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* منوی موبایل */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeOverlays} />
          <div className="relative flex h-full w-[280px] max-w-[80vw] flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300 ml-auto">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#e9e5eb] px-4">
              <span className="text-sm font-black text-[#28242b]">منوی سایت</span>
              <button onClick={closeOverlays} className="p-2 bg-[#f8f7fa] rounded-xl text-[#77717b]" aria-label="بستن منو">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-4 space-y-1" aria-label="ناوبری موبایل">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} onClick={closeOverlays} className="block px-4 py-3 text-sm font-bold text-[#28242b] hover:bg-[#f8f7fa] rounded-xl transition-colors">
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-[#e9e5eb] my-2" />
              <Link href="/account" onClick={closeOverlays} className="block px-4 py-3 text-sm font-bold text-[#28242b] hover:bg-[#f8f7fa] rounded-xl transition-colors">حساب کاربری</Link>
              <button onClick={() => { closeOverlays(); openCart(); }} className="w-full text-right px-4 py-3 text-sm font-bold text-[#28242b] hover:bg-[#f8f7fa] rounded-xl transition-colors">سبد خرید</button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}


==========================================================================================
FILE [205/255] src\components\storefront\InstantSearch.tsx
SIZE 5998 bytes
==========================================================================================
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { formatToman } from '@/lib/currency';

export default function InstantSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // بستن منو با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // جستجوی زنده با تاخیر (Debounce)
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.results);
          // 📝 ذخیره در تاریخچه
          const trimmed = query.trim();
          if (trimmed.length >= 2) {
            setSearchHistory(prev => {
              const filtered = prev.filter(h => h !== trimmed);
              const updated = [trimmed, ...filtered].slice(0, 5);
              localStorage.setItem('search-history', JSON.stringify(updated));
              return updated;
            });
          }
        }
      } catch (err) {
        console.error('Search error');
      } finally {
        setLoading(false);
      }
    }, 400); // ۴۰۰ میلی‌ثانیه صبر می‌کند تا تایپ کاربر تمام شود

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative">
      {/* دکمه آیکون جستجو (در موبایل و دسکتاپ) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fl-icon-button"
        aria-label="جستجوی محصولات"
      >
        <Search size={18} strokeWidth={1.8} />
      </button>

      {/* کادر شیشه‌ای جستجو */}
      {isOpen && (
        <div className="absolute top-full left-0 md:-left-20 mt-3 w-[320px] md:w-[450px] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
          <div className="p-4 border-b border-[#e9e5eb]/50 flex items-center gap-3 bg-white/50">
            <Search size={18} className="text-[#c61d70]" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام محصول، برند یا کلمات کلیدی..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[#28242b] placeholder:text-[#918a95]"
              dir="rtl"
            />
            {loading && <Loader2 size={16} className="text-[#c61d70] animate-spin" />}
          </div>

          <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
            {query.length > 0 && query.length < 2 && (
              <p className="text-center text-xs text-[#77717b] py-6">حداقل ۲ حرف وارد کنید...</p>
            )}

            {query.length >= 2 && results.length === 0 && !loading && (
              <div className="text-center py-8">
                <Sparkles size={24} className="mx-auto text-[#c61d70]/30 mb-2" />
                <p className="text-xs text-[#77717b]">محصولی با این مشخصات پیدا نشد.</p>
              </div>
            )}

            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={() => { setIsOpen(false); setQuery(''); }}
                className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#fff0f7] transition-all group"
              >
                <div className="relative w-14 h-14 bg-white rounded-xl border border-[#e9e5eb] overflow-hidden shrink-0">
                  {product.mainImage ? (
                    <Image src={product.mainImage} alt={product.name} fill className="object-contain p-1" />
                  ) : (
                    <Sparkles className="w-5 h-5 m-auto text-[#c61d70]/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#28242b] truncate group-hover:text-[#c61d70] transition-colors">{product.name}</h4>
                  <p className="text-xs font-black text-[#c61d70] mt-1">{product.price > 0 ? formatToman(product.price) : 'به زودی'}</p>
                </div>
                <ArrowLeft size={16} className="text-[#918a95] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>

          {results.length > 0 && (
            <div className="p-3 border-t border-[#e9e5eb]/50 bg-[#fafafc]">
              <Link
                href={`/products?q=${query}`}
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-xs font-bold text-[#c61d70] py-2 hover:bg-[#fff0f7] rounded-xl transition-colors"
              >
                مشاهده همه نتایج برای "{query}"
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [206/255] src\components\storefront\LoadMoreProducts.tsx
SIZE 5249 bytes
==========================================================================================
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, PackageSearch } from 'lucide-react';
import SafeImage from '@/components/product/SafeImage';
import WishlistButton from '@/components/storefront/WishlistButton';
import QuickViewButton from '@/components/storefront/QuickViewButton';
import { formatToman } from '@/lib/currency';
import { getPublicProductDescription, getPublicProductImage } from '@/lib/product-content';

export default function LoadMoreProducts({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === 12);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${page}`);
      const data = await res.json();
      if (data.success && data.products.length > 0) {
        setProducts((prev) => [...prev, ...data.products]);
        setHasMore(data.products.length === 12);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Failed to load more');
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // اسکرول بی‌نهایت با IntersectionObserver
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, hasMore]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {products.map((product) => {
          const hasPrice = product.price > 0;
          const isAvailable = product.stock > 0 && hasPrice;
          const productImage = getPublicProductImage(product.mainImage);
          const productDescription = getPublicProductDescription(product.description);

          return (
            <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col bg-white/70 backdrop-blur-md rounded-2xl border border-[#e9e5eb] overflow-hidden hover:shadow-xl hover:shadow-[#c61d70]/5 hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-square bg-[#fafafc] p-4">
                <SafeImage src={productImage} alt={product.name} fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                {!isAvailable && (
                  <span className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[9px] font-bold text-rose-500 shadow-sm z-10">
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

      {/* نشانگر اسکرول بی‌نهایت */}
      <div ref={observerRef} className="flex justify-center pt-6">
        {loading && <Loader2 size={24} className="animate-spin text-[#c61d70]" />}
        {!hasMore && products.length > 0 && (
          <p className="text-xs text-[#77717b] font-bold">شما به پایان لیست محصولات رسیدید.</p>
        )}
      </div>

      {!hasMore && products.length === 0 && (
        <div className="text-center py-20">
          <PackageSearch size={48} className="mx-auto text-[#c61d70]/30 mb-4" />
          <h2 className="text-lg font-black text-[#28242b] mb-2">محصولی پیدا نشد</h2>
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [207/255] src\components\storefront\ProductFilters.tsx
SIZE 7108 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, X, Check } from 'lucide-react';

const SKIN_TYPES = ['پوست خشک', 'پوست چرب', 'پوست مختلط', 'پوست حساس', 'موی خشک', 'موی چرب'];
const SORT_OPTIONS = [
  { label: 'جدیدترین', value: 'newest' },
  { label: 'ارزان‌ترین', value: 'cheapest' },
  { label: 'گران‌ترین', value: 'expensive' },
];

export default function ProductFilters({ brands }: { brands: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentSkinType = searchParams.get('skinType');
  const currentBrand = searchParams.get('brand');
  const currentSort = searchParams.get('sort') || 'newest';

  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const handleFilter = (name: string, value: string) => {
    const current = searchParams.get(name);
    const newValue = current === value ? null : value;
    router.push(`${pathname}?${createQueryString(name, newValue)}`, { scroll: false });
  };

  const activeFiltersCount = Array.from(searchParams.keys()).filter(k => ['skinType', 'brand'].includes(k)).length;

  return (
    <>
      {/* نوار مرتب‌سازی و دکمه فیلتر موبایل */}
      <div className="flex items-center justify-between gap-3 mb-6 w-full overflow-x-auto pb-2">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e9e5eb] rounded-xl text-sm font-bold text-[#28242b] shadow-sm shrink-0 hover:border-[#c61d70] transition-colors"
        >
          <SlidersHorizontal size={16} /> 
          فیلترها
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-[#c61d70] text-white text-[10px] rounded-full">
              {activeFiltersCount.toLocaleString('fa-IR')}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#77717b] font-medium hidden md:inline">مرتب‌سازی:</span>
          <div className="flex bg-white border border-[#e9e5eb] rounded-xl p-1 shadow-sm">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => router.push(`${pathname}?${createQueryString('sort', opt.value)}`, { scroll: false })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${currentSort === opt.value ? 'bg-[#28242b] text-white' : 'text-[#77717b] hover:text-[#28242b]'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* پنل فیلتر (Drawer) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-start md:justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-[85vw] max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left md:slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[#e9e5eb] bg-[#fafafc]">
              <h3 className="font-black text-lg flex items-center gap-2"><SlidersHorizontal size={18} /> فیلترهای محصولات</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white border border-[#e9e5eb] rounded-lg hover:text-rose-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-8">
              {/* نوع پوست/مو */}
              <div>
                <h4 className="text-sm font-bold text-[#28242b] mb-4">نوع پوست / مو</h4>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TYPES.map(type => {
                    const isActive = currentSkinType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => handleFilter('skinType', type)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          isActive ? 'bg-[#fff0f7] border-[#c61d70] text-[#c61d70]' : 'bg-white border-[#e9e5eb] text-[#77717b] hover:border-[#c61d70]'
                        }`}
                      >
                        {isActive && <Check size={12} />} {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* برند */}
              {brands.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#28242b] mb-4">برند</h4>
                  <div className="flex flex-col gap-2">
                    {brands.map(brand => {
                      const isActive = currentBrand === brand;
                      return (
                        <button
                          key={brand}
                          onClick={() => handleFilter('brand', brand)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm border transition-all ${
                            isActive ? 'bg-[#fff0f7] border-[#c61d70] text-[#c61d70] font-bold' : 'bg-white border-[#e9e5eb] text-[#77717b] hover:border-[#c61d70]'
                          }`}
                        >
                          <span>{brand}</span>
                          {isActive && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-[#e9e5eb] bg-white flex gap-3">
              <button 
                onClick={() => router.push(pathname, { scroll: false })}
                className="flex-1 py-3 bg-[#f8f7fa] text-[#28242b] text-sm font-bold rounded-xl border border-[#e9e5eb]"
              >
                حذف همه فیلترها
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20"
              >
                مشاهده نتایج
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


==========================================================================================
FILE [208/255] src\components\storefront\ProductReviews.tsx
SIZE 20510 bytes
==========================================================================================
'use client';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';

import { useState, useEffect } from 'react';
import { Star, Send, Loader2, User, UploadCloud, X, ThumbsUp, ThumbsDown, ShieldCheck, MessageCircle, Camera, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ReviewStats {
  total: number;
  average: string | null;
  distribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [stats, setStats] = useState<ReviewStats>({ total: 0, average: null, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sort, setSort] = useState('newest');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [votedReviews, setVotedReviews] = useState<Set<string>>(new Set());
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const fetchReviews = () => {
    const params = new URLSearchParams({ productId, sort, rating: ratingFilter });
    fetch(`/api/reviews?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
          setStats(data.stats);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    fetchReviews(); 
    
    // دریافت اطلاعات کاربر لاگین شده
    fetch('/api/account/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success && data.customer) {
          setCurrentUser({ name: data.customer.name, email: data.customer.email });
          setFormData(prev => ({ ...prev, name: data.customer.name, email: data.customer.email }));
        }
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, [productId, sort, ratingFilter]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (uploadedImages.length + files.length > 3) {
      toast.error('حداکثر ۳ عکس مجاز است');
      return;
    }
    setUploadingImage(true);
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/reviews/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.url;
      }));
      setUploadedImages([...uploadedImages, ...urls]);
      toast.success('عکس اضافه شد');
    } catch (err: any) {
      toast.error(err.message || 'خطا در آپلود');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, productId, images: uploadedImages }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setShowForm(false);
        setFormData({ name: '', email: '', rating: 5, comment: '' });
        setUploadedImages([]);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (id: string, action: 'helpful' | 'not-helpful') => {
    if (votedReviews.has(id)) {
      toast.error('شما قبلاً به این نظر رأی داده‌اید');
      return;
    }
    try {
      await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      setVotedReviews(new Set([...votedReviews, id]));
      fetchReviews();
      toast.success('ممنون از بازخورد شما');
    } catch {
      toast.error('خطا در ثبت رأی');
    }
  };

  const displayReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  return (
    <>
      <div className="mt-12 md:mt-16 bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-[#e9e5eb] pb-6">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-black text-[#28242b] mb-4 flex items-center gap-2">
              <MessageCircle size={24} className="text-[#c61d70]" />
              نظرات و امتیازهای خریداران
            </h2>
            {stats.average && (
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                <div className="text-center md:text-right">
                  <div className="text-4xl md:text-5xl font-black text-[#28242b] mb-1">{stats.average}</div>
                  <div className="flex justify-center md:justify-start text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill={i < Math.round(Number(stats.average)) ? 'currentColor' : 'none'} className={i < Math.round(Number(stats.average)) ? '' : 'text-gray-300'} />
                    ))}
                  </div>
                  <span className="text-xs text-[#77717b]">از {stats.total} نظر</span>
                </div>
                <div className="flex-1 space-y-1">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = stats.distribution[star as keyof typeof stats.distribution];
                    const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-10 text-[#77717b]">{star} ★</span>
                        <div className="flex-1 h-2 bg-[#f8f7fa] rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="w-8 text-left text-[#77717b]">{count.toLocaleString('fa-IR')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all w-full md:w-auto flex items-center justify-center gap-2"
          >
            <Star size={16} />
            {showForm ? 'بستن فرم' : 'ثبت نظر و امتیاز'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-10 bg-gradient-to-br from-[#fafafc] to-[#fff0f7] p-5 md:p-8 rounded-2xl border border-[#f2d7e5] space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[#28242b] mb-1.5 block">نام شما *</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#e9e5eb] rounded-xl focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#28242b] mb-1.5 block">ایمیل (اختیاری)</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-white border border-[#e9e5eb] rounded-xl focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#28242b] mb-2 block">امتیاز شما به این محصول *</label>
              <div className="flex gap-2 items-center">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="transition-transform hover:scale-110">
                    <Star size={32} fill={star <= formData.rating ? '#fbbf24' : 'none'} className={star <= formData.rating ? 'text-amber-400' : 'text-gray-300'} />
                  </button>
                ))}
                <span className="text-sm font-bold text-[#28242b] mr-2">{formData.rating} از ۵</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#28242b] mb-1.5 block">تجربه خود را بنویسید *</label>
              <textarea required rows={4} maxLength={1000} value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} placeholder="کیفیت، بسته‌بندی، تأثیر محصول روی پوست شما..." className="w-full px-4 py-3 bg-white border border-[#e9e5eb] rounded-xl focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-sm resize-none"></textarea>
              <span className="text-[10px] text-[#918a95] mt-1 block">{formData.comment.length} / ۱۰۰۰ کاراکتر</span>
            </div>

            <div>
              <label className="text-xs font-bold text-[#28242b] mb-2 block flex items-center gap-1.5">
                <Camera size={14} /> افزودن عکس (اختیاری، حداکثر ۳ عکس)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {uploadedImages.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e9e5eb] bg-white">
                    <Image src={url} alt={`عکس ${i}`} fill className="object-cover" />
                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-md hover:bg-rose-600">
                      <X size={10} />
                    </button>
                  </div>
                ))}
                {uploadedImages.length < 3 && (
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[#e9e5eb] bg-white flex flex-col items-center justify-center cursor-pointer hover:border-[#c61d70] transition-colors">
                    {uploadingImage ? <Loader2 size={18} className="animate-spin text-[#c61d70]" /> : (
                      <>
                        <UploadCloud size={20} className="text-[#c61d70] mb-1" />
                        <span className="text-[9px] text-[#77717b] font-bold">آپلود</span>
                      </>
                    )}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <button type="submit" disabled={submitting} className="flex items-center justify-center gap-2 px-8 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 disabled:opacity-50 hover:bg-[#a9155d] transition-colors">
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              ارسال نظر برای بررسی
            </button>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[#c61d70]" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 text-[#77717b] text-sm bg-[#fafafc] rounded-2xl border border-dashed border-[#e9e5eb]">
            <Star size={40} className="mx-auto mb-3 text-[#c61d70]/30" />
            هنوز نظری برای این محصول ثبت نشده. اولین نفر باشید!
          </div>
        ) : (
          <>
            {/* نوار مرتب‌سازی و فیلتر */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 bg-[#fafafc] p-3 rounded-xl border border-[#e9e5eb]">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs font-bold text-[#77717b] whitespace-nowrap">مرتب‌سازی:</span>
                <select value={sort} onChange={e => setSort(e.target.value)} className="flex-1 bg-white border border-[#e9e5eb] rounded-lg px-3 py-2 text-xs font-bold text-[#28242b] cursor-pointer">
                  <option value="newest">جدیدترین</option>
                  <option value="helpful">مفیدترین</option>
                  <option value="highest">بالاترین امتیاز</option>
                  <option value="lowest">پایین‌ترین امتیاز</option>
                </select>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs font-bold text-[#77717b] whitespace-nowrap">فیلتر:</span>
                <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="flex-1 bg-white border border-[#e9e5eb] rounded-lg px-3 py-2 text-xs font-bold text-[#28242b] cursor-pointer">
                  <option value="all">همه امتیازها</option>
                  <option value="5">۵ ستاره</option>
                  <option value="4">۴ ستاره</option>
                  <option value="3">۳ ستاره</option>
                  <option value="2">۲ ستاره</option>
                  <option value="1">۱ ستاره</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {displayReviews.map(review => (
                <div key={review.id} className="p-5 border border-[#e9e5eb] rounded-2xl bg-white hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] text-[#c61d70] flex items-center justify-center font-black">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#28242b]">{review.name}</span>
                          {review.verifiedPurchase && (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                              <ShieldCheck size={10} /> خریدار تأیید شده
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-[#918a95]">{formatPersianDate(review.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-[#3a333f] leading-loose mb-4">{review.comment}</p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {review.images.map((img: string, i: number) => (
                        <button key={i} onClick={() => setLightboxImage(img)} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#e9e5eb] hover:scale-105 transition-transform">
                          <Image src={img} alt={`عکس نظر ${i}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {review.adminReply && (
                    <div className="mb-4 bg-[#fff0f7] border-r-4 border-[#c61d70] p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={14} className="text-[#c61d70]" />
                        <span className="text-xs font-black text-[#c61d70]">پاسخ فاطمه بیوتی لند</span>
                        <span className="text-[10px] text-[#918a95]">{formatPersianDate(review.adminReplyAt)}</span>
                      </div>
                      <p className="text-xs text-[#5a1038] leading-loose">{review.adminReply}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-3 border-t border-[#f5f0f2]">
                    <button onClick={() => handleVote(review.id, 'helpful')} disabled={votedReviews.has(review.id)} className="flex items-center gap-1.5 text-xs text-[#77717b] hover:text-emerald-600 transition-colors disabled:opacity-50 font-medium">
                      <ThumbsUp size={14} /> مفید ({review.helpfulCount.toLocaleString('fa-IR')})
                    </button>
                    <button onClick={() => handleVote(review.id, 'not-helpful')} disabled={votedReviews.has(review.id)} className="flex items-center gap-1.5 text-xs text-[#77717b] hover:text-rose-600 transition-colors disabled:opacity-50 font-medium">
                      <ThumbsDown size={14} /> غیرمفید ({review.notHelpfulCount.toLocaleString('fa-IR')})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {reviews.length > 3 && (
              <button onClick={() => setShowAllReviews(!showAllReviews)} className="mt-6 mx-auto flex items-center gap-2 px-6 py-3 bg-[#f8f7fa] text-[#28242b] text-sm font-bold rounded-xl hover:bg-[#fff0f7] hover:text-[#c61d70] transition-colors">
                {showAllReviews ? 'نمایش کمتر' : `نمایش همه ${reviews.length} نظر`}
                <ChevronDown size={16} className={`transition-transform ${showAllReviews ? 'rotate-180' : ''}`} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
          <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full hover:bg-white/20">
            <X size={24} />
          </button>
          <div className="relative w-full max-w-2xl aspect-square" onClick={(e) => e.stopPropagation()}>
            <Image src={lightboxImage} alt="عکس نظر" fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}


==========================================================================================
FILE [209/255] src\components\storefront\PromoBar.tsx
SIZE 3406 bytes
==========================================================================================
'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

interface PromoBarProps {
  text: string;
  expiresAt: string | null;
  link?: string;
}

export default function PromoBar({ text, expiresAt, link = '/products' }: PromoBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    // بررسی اینکه آیا کاربر این "متن خاص" را قبلاً بسته است یا نه
    const dismissedText = localStorage.getItem('promo-bar-dismissed-text');
    if (dismissedText === text) return;

    if (expiresAt) {
      const expireTime = new Date(expiresAt).getTime();
      if (expireTime < Date.now()) return;

      const timer = setInterval(() => {
        const now = Date.now();
        const distance = expireTime - now;

        if (distance < 0) {
          clearInterval(timer);
          setIsVisible(false);
          return;
        }

        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }, 1000);

      setIsVisible(true);
      return () => clearInterval(timer);
    } else {
      setIsVisible(true);
    }
  }, [expiresAt, text]);

  const handleDismiss = () => {
    setIsVisible(false);
    // ذخیره متن فعلی برای اینکه اگر متن عوض شد، دوباره نمایش داده شود
    localStorage.setItem('promo-bar-dismissed-text', text);
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#c61d70] via-[#e84e9e] to-[#c61d70] text-white shadow-md overflow-hidden z-[60]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50 pointer-events-none animate-pulse" />
      
      <div className="container-custom flex items-center justify-between gap-4 py-2.5 relative z-10">
        <Link href={link} className="flex-1 flex items-center justify-center gap-2 group text-xs md:text-sm font-bold hover:underline">
          <Sparkles size={16} className="text-yellow-300 animate-bounce shrink-0" />
          <span className="truncate text-center">{text}</span>
        </Link>

        {timeLeft && (
          <div className="hidden md:flex items-center gap-2 text-xs font-mono font-black bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10" dir="ltr">
            <Clock size={12} />
            {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
            <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        )}

        <button 
          onClick={handleDismiss} 
          className="p-1.5 hover:bg-white/20 rounded-full transition-colors shrink-0 flex items-center justify-center"
          aria-label="بستن نوار تبلیغاتی"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}


==========================================================================================
FILE [210/255] src\components\storefront\PromoBarWrapper.tsx
SIZE 1039 bytes
==========================================================================================
import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import PromoBar from './PromoBar';

export default async function PromoBarWrapper() {
  try {
    const settings = await db.select().from(siteSettings);
    const textSetting = settings.find(s => s.key === 'promoBarText');
    const expiresSetting = settings.find(s => s.key === 'promoBarExpiresAt');
    const activeSetting = settings.find(s => s.key === 'promoBarActive');

    const promoText = textSetting?.value as string | null;
    const promoExpiresAt = expiresSetting?.value as string | null;
    // پیش‌فرض: اگر تنظیمی وجود نداشت، فعال در نظر گرفته می‌شود
    const isActive = activeSetting ? Boolean(activeSetting.value) : true;

    // اگر غیرفعال است یا متنی وجود ندارد، هیچ چیزی نمایش داده نشود
    if (!promoText || !isActive) return null;

    return <PromoBar text={promoText} expiresAt={promoExpiresAt} />;
  } catch (error) {
    return null;
  }
}


==========================================================================================
FILE [211/255] src\components\storefront\PwaInstallPrompt.tsx
SIZE 4018 bytes
==========================================================================================
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Smartphone, Download } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const pathname = usePathname();

  // 🛡️ مخفی کردن اعلان در پنل ادمین و صفحات حساب کاربری
  const shouldHide = 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/account') || 
    pathname === '/checkout' || 
    pathname === '/cart';

  useEffect(() => {
    // اگر کاربر قبلاً بسته یا نصب کرده، نمایش نده
    if (localStorage.getItem('pwa-dismissed') || localStorage.getItem('pwa-installed')) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // فقط اگر در صفحات مخفی نبودیم، بعد از ۱۰ ثانیه نشان بده
      if (!shouldHide) {
        setTimeout(() => setShowPrompt(true), 10000); 
      }
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [shouldHide]);

  // اگر کاربر در حین نمایش اعلان، به صفحه ادمین رفت، آن را ببند
  useEffect(() => {
    if (shouldHide) {
      setShowPrompt(false);
    }
  }, [shouldHide]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  // اگر در صفحه ممنوعه هستیم یا قرار نیست نمایش داده شود، هیچی رندر نکن
  if (!showPrompt || shouldHide) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 z-[90] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-[#f2d7e5] shadow-2xl shadow-[#c61d70]/20 p-4 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#c61d70]/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="w-12 h-12 bg-gradient-to-br from-[#c61d70] to-[#e84e9e] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
          <Smartphone className="text-white" size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-black text-[#28242b]">نصب اپلیکیشن فاطمه بیوتی لند</h3>
          <p className="text-[10px] text-[#77717b] mt-1">دسترسی سریع‌تر و تجربه‌ای عالی‌تر بدون نیاز به مرورگر</p>
        </div>
        
        <button onClick={handleInstall} className="px-4 py-2 bg-[#c61d70] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#a9155d] transition-colors shrink-0 flex items-center gap-1">
          <Download size={14} /> نصب
        </button>
        
        <button onClick={handleDismiss} className="absolute top-2 left-2 p-1.5 text-[#918a95] hover:text-rose-500 bg-white rounded-full transition-colors" aria-label="بستن">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}


==========================================================================================
FILE [212/255] src\components\storefront\QuickViewButton.tsx
SIZE 836 bytes
==========================================================================================
'use client';

import { useCartStore } from '@/store/cart';
import { Eye } from 'lucide-react';

export default function QuickViewButton({ product }: { product: any }) {
  const openQuickView = useCartStore((state) => state.openQuickView);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          mainImage: product.mainImage,
        });
      }}
      className="w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-[#77717b] hover:text-[#c61d70] hover:scale-110 shadow-md border border-[#e9e5eb] transition-all"
      aria-label="نمایش سریع"
    >
      <Eye size={16} />
    </button>
  );
}


==========================================================================================
FILE [213/255] src\components\storefront\QuickViewModal.tsx
SIZE 3545 bytes
==========================================================================================
'use client';

import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { X, ShoppingBag, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addItem, openCart } = useCartStore();

  useEffect(() => {
    if (quickViewProduct) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addItem(quickViewProduct);
    toast.success('محصول به سبد خرید اضافه شد');
    closeQuickView();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={closeQuickView} />
      
      <div className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        <button onClick={closeQuickView} className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-[#77717b] hover:text-rose-500 shadow-sm transition-all">
          <X size={20} />
        </button>

        {/* تصویر */}
        <div className="md:w-1/2 bg-[#fafafc] p-8 flex items-center justify-center relative min-h-[300px]">
          {quickViewProduct.mainImage ? (
            <Image src={quickViewProduct.mainImage} alt={quickViewProduct.name} fill className="object-contain p-6 drop-shadow-xl hover:scale-105 transition-transform duration-500" />
          ) : (
            <Sparkles size={64} className="text-[#c61d70]/20" />
          )}
        </div>

        {/* اطلاعات */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-black text-[#28242b] leading-relaxed mb-2">{quickViewProduct.name}</h2>
          <p className="text-2xl font-black text-[#c61d70] mb-6">
            {quickViewProduct.price > 0 ? formatToman(quickViewProduct.price) : 'به زودی'}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-[#77717b] mb-8 bg-[#f8f7fa] p-3 rounded-xl border border-[#e9e5eb]">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            ارسال از انبار فاطمه بیوتی لند با ضمانت اصالت کالا
          </div>

          <div className="space-y-3 mt-auto">
            <button onClick={handleAddToCart} disabled={quickViewProduct.price <= 0} className="w-full h-12 bg-[#c61d70] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all disabled:opacity-50">
              <ShoppingBag size={18} /> افزودن به سبد خرید
            </button>
            <Link href={`/products/${quickViewProduct.slug}`} onClick={closeQuickView} className="w-full h-12 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#f8f7fa] transition-all">
              مشاهده جزئیات کامل <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [214/255] src\components\storefront\RecentlyViewed.tsx
SIZE 2187 bytes
==========================================================================================
'use client';

import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { Clock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RecentlyViewed() {
  const { recentlyViewed } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted || recentlyViewed.length === 0) return null;

  return (
    <section className="container-custom py-12 border-t border-[#e9e5eb]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#28242b] flex items-center gap-2">
          <Clock size={20} className="text-[#c61d70]" /> بازدیدهای اخیر شما
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recentlyViewed.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group bg-white rounded-2xl border border-[#e9e5eb] p-3 hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-square bg-[#fafafc] rounded-xl overflow-hidden mb-3">
              {product.mainImage ? (
                <Image src={product.mainImage} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#c61d70]/20">بدون عکس</div>
              )}
            </div>
            <h3 className="text-xs font-bold text-[#28242b] line-clamp-1 group-hover:text-[#c61d70] transition-colors">{product.name}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] font-black text-[#77717b]">{product.price > 0 ? formatToman(product.price) : 'به زودی'}</span>
              <ArrowLeft size={12} className="text-[#c61d70] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}


==========================================================================================
FILE [215/255] src\components\storefront\RecentlyViewedTracker.tsx
SIZE 536 bytes
==========================================================================================
'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';

export default function RecentlyViewedTracker({ product }: { product: any }) {
  const addRecentlyViewed = useCartStore((state) => state.addRecentlyViewed);

  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        mainImage: product.mainImage,
      });
    }
  }, [product, addRecentlyViewed]);

  return null;
}


==========================================================================================
FILE [216/255] src\components\storefront\ShareButton.tsx
SIZE 1449 bytes
==========================================================================================
'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `مشاهده ${title} در فاطمه بیوتی لند`,
          url: url,
        });
      } catch (err) {
        // کاربر انصراف داده است
      }
    } else {
      // کپی کردن لینک
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('لینک محصول کپی شد');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('خطا در کپی کردن لینک');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 border-[#e9e5eb] bg-white text-[#77717b] text-sm font-bold transition-all hover:border-[#c61d70] hover:text-[#c61d70] min-w-[140px]"
      aria-label="اشتراک‌گذاری محصول"
    >
      {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
      {copied ? 'کپی شد' : 'اشتراک‌گذاری'}
    </button>
  );
}


==========================================================================================
FILE [217/255] src\components\storefront\UserMenuButton.tsx
SIZE 1488 bytes
==========================================================================================
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function UserMenuButton() {
  const [customer, setCustomer] = useState<{ name: string; avatar?: string | null } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch('/api/account/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success) setCustomer(data.customer);
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return <div className="w-10 h-10" />;

  if (customer) {
    return (
      <Link
        href="/account"
        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white font-black text-sm shadow-md hover:scale-105 transition-transform ring-2 ring-white"
        aria-label={`حساب ${customer.name}`}
        title={customer.name}
      >
        {customer.avatar ? (
          <Image src={customer.avatar} alt={customer.name} width={40} height={40} className="w-full h-full object-cover" />
        ) : (
          customer.name.charAt(0)
        )}
      </Link>
    );
  }

  return (
    <Link href="/account" className="fl-icon-button" aria-label="حساب کاربری">
      <User size={18} strokeWidth={1.8} />
    </Link>
  );
}


==========================================================================================
FILE [218/255] src\components\storefront\WishlistButton.tsx
SIZE 3978 bytes
==========================================================================================
'use client';

import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';

interface WishlistButtonProps {
  productId: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export default function WishlistButton({ productId, variant = 'icon', className = '' }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch(`/api/account/wishlist/check?productId=${productId}`)
      .then(r => r.json())
      .then(data => {
        setIsWishlisted(data.isWishlisted || false);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [productId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/account/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.status === 401) {
        toast.error('برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید');
        router.push(`/account/login?redirect=${pathname}`);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setIsWishlisted(data.action === 'added');
        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);
        toast.success(data.action === 'added' ? 'به علاقه‌مندی‌ها اضافه شد ❤️' : 'از علاقه‌مندی‌ها حذف شد');
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  if (!checked) return <div className={className} />;

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${
          isWishlisted
            ? 'bg-rose-50 border-rose-400 text-rose-600'
            : 'bg-white border-[#e9e5eb] text-[#77717b] hover:border-rose-300 hover:text-rose-500'
        } ${className}`}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Heart
            size={18}
            fill={isWishlisted ? 'currentColor' : 'none'}
            className={animating ? 'animate-ping-once' : ''}
          />
        )}
        {isWishlisted ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-md border transition-all hover:scale-110 ${
        isWishlisted
          ? 'border-rose-400 text-rose-600'
          : 'border-[#e9e5eb] text-[#77717b] hover:border-rose-300 hover:text-rose-500'
      } ${className}`}
      aria-label={isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Heart
          size={16}
          fill={isWishlisted ? 'currentColor' : 'none'}
          className={animating ? 'scale-125 transition-transform' : 'transition-transform'}
        />
      )}
    </button>
  );
}


==========================================================================================
FILE [219/255] src\db\add-phone-index.ts
SIZE 937 bytes
==========================================================================================
import 'dotenv/config';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Checking for duplicate phones...');
  const dupes = await db.execute(sql`
    SELECT phone, COUNT(*) as count
    FROM customers
    WHERE phone IS NOT NULL AND phone != ''
    GROUP BY phone
    HAVING COUNT(*) > 1
  `);

  if (dupes.length > 0) {
    console.warn(`Found ${dupes.length} duplicate phone(s). Please resolve manually:`);
    console.table(dupes);
    process.exit(1);
  }

  console.log('No duplicates found. Creating index...');
  try {
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)
    `);
    console.log('Index created successfully.');
  } catch (e: any) {
    console.error('Index creation failed:', e.message);
  }

  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });


==========================================================================================
FILE [220/255] src\db\check-coupons.ts
SIZE 600 bytes
==========================================================================================
import 'dotenv/config';
import { db } from '../lib/db';
import { coupons } from './schema';

async function main() {
  const all = await db.select().from(coupons);
  console.log(`Total coupons in DB: ${all.length}`);
  if (all.length > 0) {
    console.log('Existing coupons:');
    all.forEach((c) => {
      console.log(`  - ${c.code} | type: ${c.type} | value: ${c.value} | active: ${c.isActive} | used: ${c.usedCount}`);
    });
  } else {
    console.log('  No coupons found (clean state).');
  }
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });


==========================================================================================
FILE [221/255] src\db\create-admin.ts
SIZE 869 bytes
==========================================================================================
import 'dotenv/config';
import { db } from '../lib/db';
import { adminUsers } from './schema';
import * as argon2 from 'argon2';

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.log('❌ لطفاً ایمیل و رمز عبور را وارد کنید.');
    process.exit(1);
  }

  try {
    console.log('🔒 در حال هش کردن رمز عبور...');
    const passwordHash = await argon2.hash(password);

    await db.insert(adminUsers).values({
      email,
      passwordHash,
      role: 'super_admin',
    });

    console.log('✅ ادمین با موفقیت ساخته شد!');
    process.exit(0);
  } catch (error) {
    console.error('❌ خطا در ساخت ادمین:', error);
    process.exit(1);
  }
}
createAdmin();



==========================================================================================
FILE [222/255] src\db\generate-covers.ts
SIZE 1646 bytes
==========================================================================================
import { db } from '../lib/db';
import { articles } from './schema';
import { isNull, eq } from 'drizzle-orm';
import { generateArticleCover } from '../lib/ai-image';

async function generateAllCovers() {
  console.log('🎨 در حال تولید عکس برای مقالات بدون کاور...');
  
  // پیدا کردن مقالاتی که کاور ندارند
  const articlesWithoutCover = await db.select().from(articles).where(isNull(articles.coverImage));
  
  if (articlesWithoutCover.length === 0) {
    console.log('ℹ️ همه مقالات کاور دارند.');
    process.exit(0);
  }

  console.log(`📊 تعداد مقالات بدون کاور: ${articlesWithoutCover.length}`);

  for (const article of articlesWithoutCover) {
    try {
      console.log(`⏳ در حال ساخت عکس برای: ${article.title}`);
      const imageUrl = await generateArticleCover(article.title, article.category);
      
      // آپدیت دیتابیس
      await db.update(articles)
        .set({ coverImage: imageUrl, updatedAt: new Date() })
        .where(eq(articles.id, article.id));
        
      console.log(`✅ عکس ساخته شد: ${imageUrl}`);
      
      // کمی صبر بین درخواست‌ها برای جلوگیری از Rate Limit
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`❌ خطا در تولید عکس برای ${article.title}:`, error);
    }
  }

  console.log('🎉 تولید عکس برای همه مقالات تمام شد!');
  process.exit(0);
}
generateAllCovers();


==========================================================================================
FILE [223/255] src\db\migrate-coupons.ts
SIZE 1244 bytes
==========================================================================================
import 'dotenv/config';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS coupons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT NOT NULL UNIQUE,
        description TEXT,
        type TEXT NOT NULL DEFAULT 'percent',
        value INTEGER NOT NULL,
        min_order_amount INTEGER NOT NULL DEFAULT 0,
        max_discount_amount INTEGER,
        usage_limit INTEGER,
        used_count INTEGER NOT NULL DEFAULT 0,
        starts_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await db.execute(sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT`);
    await db.execute(sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount INTEGER NOT NULL DEFAULT 0`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code)`);
    console.log('Migration complete.');
  } catch (e: any) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
  process.exit(0);
}
main();


==========================================================================================
FILE [224/255] src\db\schema.ts
SIZE 9938 bytes
==========================================================================================
import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, index } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sku: text("sku").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  categoryId: uuid("category_id").references(() => categories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sku: text("sku").unique(),
  brand: text("brand"),
  countryOfOrigin: text("country_of_origin"),
  description: text("description"),
  price: integer("price").notNull().default(0),
  compareAtPrice: integer("compare_at_price"),
  stock: integer("stock").notNull().default(0),
  status: text("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  mainImage: text("main_image"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  specifications: jsonb("specifications").$type<{ key: string; value: string }[]>().default([]),
  ingredients: text("ingredients"),
  usage: text("usage"),
  skinType: text("skin_type"),
  warnings: text("warnings"),
  expiryDate: text("expiry_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  brandIdx: index("products_brand_idx").on(table.brand),
  statusIdx: index("products_status_idx").on(table.status),
  categoryIdx: index("products_category_idx").on(table.categoryId),
}));

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  avatar: text("avatar"),
  loyaltyPoints: integer("loyalty_points").notNull().default(0),
  tier: text("tier").notNull().default("bronze"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  phoneIdx: index("customers_phone_idx").on(table.phone),
}));

export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  title: text("title").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  province: text("province").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  postalCode: text("postal_code").notNull(),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  customerIdx: index("addresses_customer_idx").on(table.customerId),
}));

export const wishlist = pgTable("wishlist", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  customerIdx: index("wishlist_customer_idx").on(table.customerId),
}));

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  notes: text("notes"),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  trackingCode: text("tracking_code").notNull().unique().default("FL-PENDING"),
  paymentAuthority: text("payment_authority"),
  paymentRefId: text("payment_ref_id"),
  couponCode: text("coupon_code"),
  discountAmount: integer("discount_amount").notNull().default(0),
  usedPoints: integer("used_points").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  customerIdx: index("orders_customer_idx").on(table.customerId),
  statusIdx: index("orders_status_idx").on(table.status),
  trackingCodeIdx: index("orders_tracking_idx").on(table.trackingCode),
}));

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id).notNull(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  productName: text("product_name").notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
}, (table) => ({
  orderIdx: index("order_items_order_idx").on(table.orderId),
  productIdx: index("order_items_product_idx").on(table.productId),
}));

export const articles = pgTable("articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: text("category").notNull().default("education"),
  coverImage: text("cover_image"),
  status: text("status").notNull().default("draft"),
  readTime: text("read_time").default("۵ دقیقه"),
  author: text("author").default("تیم فاطمه بیوتی لند"),
  featured: boolean("featured").notNull().default(false),
  editorsPick: boolean("editors_pick").notNull().default(false),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  statusIdx: index("articles_status_idx").on(table.status),
  categoryIdx: index("articles_category_idx").on(table.category),
}));

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  verifiedPurchase: boolean("verified_purchase").notNull().default(false),
  helpfulCount: integer("helpful_count").notNull().default(0),
  notHelpfulCount: integer("not_helpful_count").notNull().default(0),
  adminReply: text("admin_reply"),
  adminReplyAt: timestamp("admin_reply_at"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("reviews_product_idx").on(table.productId),
  statusIdx: index("reviews_status_idx").on(table.status),
}));

export const supportTickets = pgTable("support_tickets", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  subject: text("subject").notNull(),
  category: text("category").notNull().default("other"),
  status: text("status").notNull().default("open"),
  unreadByCustomer: integer("unread_by_customer").notNull().default(0),
  unreadByAdmin: integer("unread_by_admin").notNull().default(1),
  lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  customerIdx: index("tickets_customer_idx").on(table.customerId),
  statusIdx: index("tickets_status_idx").on(table.status),
}));

export const supportMessages = pgTable("support_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id").references(() => supportTickets.id, { onDelete: 'cascade' }).notNull(),
  senderType: text("sender_type").notNull(),
  senderName: text("sender_name").notNull(),
  message: text("message").notNull(),
  attachmentUrl: text("attachment_url"),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  ticketIdx: index("messages_ticket_idx").on(table.ticketId),
}));

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  type: text("type").notNull().default("percent"),
  value: integer("value").notNull(),
  minOrderAmount: integer("min_order_amount").notNull().default(0),
  maxDiscountAmount: integer("max_discount_amount"),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  startsAt: timestamp("starts_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stockNotifications = pgTable("stock_notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: 'cascade' }).notNull(),
  phoneOrEmail: text("phone_or_email").notNull(),
  status: text("status").notNull().default("pending"), // pending | notified
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  productIdx: index("stock_notify_product_idx").on(table.productId),
  statusIdx: index("stock_notify_status_idx").on(table.status),
}));


==========================================================================================
FILE [225/255] src\db\seed_real.ts
SIZE 4968 bytes
==========================================================================================
import { db } from '../lib/db';
import { products } from './schema';
import { notInArray } from 'drizzle-orm';

async function seed() {
  console.log('🌱 در حال پاکسازی محصولات قبلی و تزریق اطلاعات واقعی...');
  
  // پاک کردن محصولات قبلی برای جلوگیری از تداخل
  await db.delete(products);
  
  await db.insert(products).values([
    {
      name: 'تونر روشن‌کننده ویتابلا',
      slug: 'toner-vitabla',
      description: 'روشن و شفاف‌کننده پوست صورت و کاهش لک‌های قهوه‌ای رنگ پوست (حاوی آلفا آربوتین و نیاسینامید)',
      price: 0, 
      stock: 10,
      status: 'published',
      categoryId: null, 
      isFeatured: true,
      ingredients: 'Aqua, PEG 6 Caprylic Capric Glycerides, PEG 40 Hydrogenated Castor Oil, Glycerin, Na PCA, Cranberry extract, Alpha Arbutin, Disodium EDTA, Sodium Benzoate, Potassium Sorbate, Glycolic Acid, Niacinamide, Allantoin, Fragrance.',
      usage: 'آرایش خود را با استفاده از یک پد پنبه‌ای آغشته به تونر پاک کنید. برای بهترین نتیجه دوبار در روز صبح و عصر از تونر استفاده کنید.',
      specifications: [
        { key: 'برند', value: 'ویتابلا (Vitabella)' },
        { key: 'حجم', value: '۲۲۰ میلی‌لیتر' },
        { key: 'کشور سازنده', value: 'ایران (PSEZ)' },
        { key: 'کد GTIN', value: '6269572204429' }
      ]
    },
    {
      name: 'شامپو مورینگا اکسونیک',
      slug: 'shampoo-moringa',
      description: 'شامپو تقویت‌کننده موی سر حاوی روغن مورینگا',
      price: 0,
      stock: 5,
      status: 'published',
      categoryId: null,
      isFeatured: false,
      ingredients: 'آب دیونیزه، آمونیوم لوریل سولفات، کوکامیدوپروپیل بتائین، روغن مورینگا و...',
      usage: 'موها را خیس نموده، مقدار کافی از شامپو را به مدت دو تا سه دقیقه بر روی موها ماساژ داده سپس آبکشی نمایید.',
      specifications: [
        { key: 'برند', value: 'اکسونیک (Exonic)' },
        { key: 'حجم', value: '۳۰۰ میلی‌لیتر (۱۰ FL.OZ)' },
        { key: 'کاربرد', value: 'تقویت‌کننده و ضخیم‌کننده مو' }
      ]
    },
    {
      name: 'صابون روشن‌کننده و لایه‌بردار بیز',
      slug: 'exfoliating-soap',
      description: 'صابون لایه‌بردار و روشن‌کننده مناسب برای دست و صورت',
      price: 0,
      stock: 0,
      status: 'published',
      categoryId: null,
      isFeatured: false,
      ingredients: 'Tallow oil, Sodium hydroxide, Coconut acid, Soy fatty acid, Glycerin, Cetyl alcohol, Paraffin, Sodium phosphate, Beat berry glycolic extract, Glycerin, Beeswax, Petrolatum, Fragrance, Castor oil, Apricot kernel powder, Ascorbic acid, BHT, Deionized water.',
      usage: 'پوست خود را شسته و قالب صابون را به آرامی روی آن بمالید و پس از آن کمی آن را بشویید. شرایط نگهداری: در دمای محیط و در جای خشک نگهداری شود.',
      specifications: [
        { key: 'برند', value: 'بیز (BIZ)' },
        { key: 'وزن', value: '۱۰۰ گرم' },
        { key: 'کشور سازنده', value: 'ایران' },
        { key: 'کد IRC', value: '5619427734280689' },
        { key: 'ویژگی', value: 'حاوی پودر هسته زردآلو و اسید گلیکولیک' }
      ]
    },
    {
      name: 'پنکیک ۱۰۱ (لوکسری کویین)',
      slug: 'pancake-101',
      description: 'کامپکت پودر با پوشش‌دهی عالی و محافظت در برابر آفتاب (SPF-25)',
      price: 0,
      stock: 2,
      status: 'published',
      categoryId: null,
      isFeatured: false,
      ingredients: 'Talc, Calamine, Processed Starch, Zinc Oxide, Kaolin, Titanium oxide, Aloe Vera Extract, Pigments, Vitamin E, Methyl Paraben.',
      usage: 'با استفاده از اسفنج مخصوص، مقدار مناسب از پودر را روی پوست صورت بزنید.',
      specifications: [
        { key: 'برند', value: 'بیز (BIZ)' },
        { key: 'وزن', value: '۱۴ گرم' },
        { key: 'کشور سازنده', value: 'AFZ' },
        { key: 'ضد آفتاب', value: 'SPF-25' },
        { key: 'تاریخ تولید', value: '۰۶ آگوست ۲۰۲۵' }
      ]
    }
  ]);

  console.log('✅ ۴ محصول با اطلاعات واقعی و مشخصات کامل جایگزین شدند!');
  process.exit(0);
}
seed();


==========================================================================================
FILE [226/255] src\db\seed-articles.ts
SIZE 16405 bytes
==========================================================================================
import { db } from '../lib/db';
import { articles } from './schema';

async function seedArticles() {
  console.log('🌱 در حال تزریق ۱۰ مقاله جدید...');
  
  const articlesData = [
    {
      title: 'چگونه برچسب محصولات مراقبت پوست را بخوانیم؟',
      slug: 'read-skincare-label',
      excerpt: 'برچسب هر محصول، کلیدی برای شناخت ترکیبات و کاربرد آن است. با اصول خواندن برچسب آشنا شوید.',
      content: 'برچسب محصولات مراقبتی، منبع اصلی اطلاعات درباره ترکیبات، کاربرد و شرایط نگهداری محصول است. اما خواندن این برچسب‌ها گاهی پیچیده به نظر می‌رسد.\n\nترتیب ترکیبات روی برچسب بر اساس مقدارشان مرتب می‌شوند؛ از بیشترین به کمترین. یعنی ترکیب اول بیشترین درصد و ترکیب آخر کمترین درصد را دارد. این قاعده به شما کمک می‌کند تشخیص دهید یک ترکیب مؤثر واقعاً در محصول وجود دارد یا فقط برای نام‌گذاری استفاده شده است.\n\nبخش‌های مهم برچسب شامل نام تجاری، فهرست کامل ترکیبات، حجم یا وزن خالص، کاربرد و روش استفاده، هشدارها و تاریخ تولید و انقضا است.\n\nاولین قدم، بررسی وجود ترکیباتی است که به آن‌ها حساسیت دارید. اگر پوست حساسی دارید، محصولات بدون عطر و رنگ را ترجیح دهید. همچنین به تاریخ انقضا و شرایط نگهداری توجه کنید.',
      category: 'education',
      status: 'published',
      readTime: '۶ دقیقه',
      author: 'تیم فاطمه بیوتی لند',
      featured: false,
      editorsPick: true,
    },
    {
      title: 'ترتیب استفاده از محصولات مراقبت پوست (لایه‌بندی)',
      slug: 'how-to-layer-skincare',
      excerpt: 'ترتیب درست استفاده از محصولات، تأثیر آن‌ها را چند برابر می‌کند. با اصول لایه‌بندی آشنا شوید.',
      content: 'استفاده از محصولات مراقبتی به ترتیب درست، یکی از مهم‌ترین اصول در روتین پوستی است. محصولاتی که سبک‌تر هستند اول و محصولات سنگین‌تر در انتها استفاده می‌شوند.\n\nقاعده طلایی این است: از سبک‌ترین به سنگین‌ترین. یعنی هر محصولی که بافت رقیق‌تری دارد، اول استفاده می‌شود تا جذب شود. محصولات سنگین‌تر در انتها استفاده می‌شوند تا رطوبت را قفل کنند.\n\nترتیب پیشنهادی: پاک‌کننده، تونر، سرم، کرم دور چشم، مرطوب‌کننده، روغن یا محصولات سنگین و در نهایت ضد آفتاب (صبح‌ها).\n\nبین استفاده از هر محصول، چند ثانیه صبر کنید تا جذب شود. اگر از محصولات لایه‌بردار مثل AHA یا BHA استفاده می‌کنید، آن‌ها را در مرحله سرم استفاده کنید و از ترکیب با رتینول پرهیز کنید.',
      category: 'education',
      status: 'published',
      readTime: '۷ دقیقه',
      author: 'تیم فاطمه بیوتی لند',
      featured: false,
      editorsPick: false,
    },
    {
      title: 'پیش از خرید تونر به چه نکاتی توجه کنیم؟',
      slug: 'before-buying-toner',
      excerpt: 'تونر یکی از محصولات پرکاربرد در روتین پوستی است. اما انتخاب تونر مناسب نیازمند بررسی چند نکته است.',
      content: 'تونر معمولاً به عنوان دومین مرحله روتین پوستی، پس از پاک‌کننده استفاده می‌شود. اما تونرها با کاربردهای مختلف، انتخاب را پیچیده می‌کنند.\n\nتونرها معمولاً سه کاربرد اصلی دارند: آبرسانی، تعادل pH پوست پس از پاک‌سازی، و آماده‌سازی پوست برای جذب محصولات بعدی. برخی تونرها نیز حاوی ترکیبات لایه‌بردار یا کنترل‌کننده چربی هستند.\n\nپیش از خرید تونر، به ترکیبات، نوع پوست و کاربرد مورد نظر توجه کنید. اگر پوست حساسی دارید، از تونرهای حاوی الکل بالا و عطر پرهیز کنید. اگر پوست چرب دارید، تونرهای حاوی نیاسینامید می‌توانند مفید باشند.\n\nتونر را می‌توانید با پنبه روی صورت بزنید یا در دست کف کرده و روی پوست بمالید. روش دوم برای پوست‌های حساس ملایم‌تر است.',
      category: 'buying-guide',
      status: 'published',
      readTime: '۵ دقیقه',
      author: 'تیم فاطمه بیوتی لند',
      featured: false,
      editorsPick: true,
    },
    {
      title: 'آلفا آربوتین و نیاسینامید؛ دو قهرمان روشن‌کننده پوست',
      slug: 'arbutin-niacinamide-benefits',
      excerpt: 'این دو ترکیب معجزه‌آسا نیستند، اما در کاهش لک و روشن‌سازی پوست نقش مؤثری دارند. با آن‌ها آشنا شوید.',
      content: 'آلفا آربوتین یک ترکیب روشن‌کننده است که به کاهش تولید ملانین کمک می‌کند و برای درمان لک‌های قهوه‌ای و هایپرپیگمانتاسیون استفاده می‌شود.\n\nنیاسینامید (ویتامین B3) یک ترکیب همه‌کاره است که به تقویت سد دفاعی پوست، کاهش التهاب، کنترل چربی و همچنین روشن‌سازی پوست کمک می‌کند.\n\nترکیب این دو ماده در یک محصول (مانند تونر روشن‌کننده ویتابلا) می‌تواند تأثیر هم‌افزایی داشته باشد و نتایج بهتری در یکنواختی رنگ پوست ایجاد کند.\n\nنکته مهم: استفاده از این ترکیبات نیازمند صبر و استمرار است. نتایج معمولاً پس از چند هفته استفاده منظم قابل مشاهده هستند. همچنین استفاده از ضد آفتاب در طول روز برای جلوگیری از بازگشت لک‌ها ضروری است.',
      category: 'skincare',
      status: 'published',
      readTime: '۴ دقیقه',
      author: 'تیم فاطمه بیوتی لند',
      featured: false,
      editorsPick: false,
    },
    {
      title: 'روغن مورینگا برای مو؛ خواص و نحوه استفاده',
      slug: 'moringa-oil-hair-benefits',
      excerpt: 'روغن مورینگا سرشار از مواد مغذی است و به تقویت و ضخیم‌شدن مو کمک می‌کند. با خواص آن آشنا شوید.',
      content: 'روغن مورینگا از دانه‌های درخت مورینگا استخراج می‌شود و سرشار از اسیدهای چرب، ویتامین‌ها و مواد معدنی است.\n\nاین روغن به دلیل خواص آنتی‌اکسیدانی و آبرسانی، به تقویت فولیکول‌های مو، کاهش خشکی و شکنندگی مو و بهبود ظاهر کلی مو کمک می‌کند.\n\nاستفاده از شامپوهای حاوی روغن مورینگا (مانند شامپو مورینگا اکسونیک) راهی ساده برای بهره‌مندی از این خواص در روتین روزانه است.\n\nنکته: برای بهترین نتیجه، شامپو را به مدت ۲ تا ۳ دقیقه روی پوست سر ماساژ دهید و سپس آبکشی کنید. استفاده از نرم‌کننده پس از شامپو نیز توصیه می‌شود.',
      category: 'haircare',
      status: 'published',
      readTime: '۵ دقیقه',
      author: 'تیم فاطمه بیوتی لند',
      featured: false,
      editorsPick: false,
    },
    {
      title: 'لایه‌برداری پوست؛ هر چند وقت یک‌بار و چگونه؟',
      slug: 'exfoliation-guide',
      excerpt: 'لایه‌برداری منظم به شفافیت و صافی پوست کمک می‌کند، اما زیاده‌روی در آن می‌تواند آسیب‌زا باشد.',
      content: 'لایه‌برداری (Exfoliation) فرآیند حذف سلول‌های مرده از سطح پوست است که به شفافیت، صافی و بهبود جذب محصولات کمک می‌کند.\n\nدو نوع اصلی لایه‌برداری وجود دارد: فیزیکی (مثل صابون‌های حاوی ذرات ساینده) و شیمیایی (مثل AHA و BHA).\n\nفراوانی لایه‌برداری به نوع پوست بستگی دارد. برای پوست‌های معمولی تا چرب، ۲ تا ۳ بار در هفته کافی است. برای پوست‌های حساس، یک بار در هفته یا حتی کمتر توصیه می‌شود.\n\nنکته مهم: پس از لایه‌برداری، حتماً از مرطوب‌کننده و ضد آفتاب استفاده کنید. زیاده‌روی در لایه‌برداری می‌تواند منجر به تحریک، قرمزی و آسیب به سد دفاعی پوست شود.',
      category: 'skincare',
      status: 'published',
      readTime: '۶ دقیقه',
      author: 'تیم فاطمه بیوتی لند',
      featured: false,
      editorsPick: true,
    },
    {
      title: 'راهنمای انتخاب پنکیک و پودر فشرده مناسب',
      slug: 'choose-compact-powder',
      excerpt: 'پنکیک مناسب می‌تواند ظاهر پوست را یکدست کند. با معیارهای انتخاب آشنا شوید.',
      content: 'پنکیک یا پودر فشرده (Compact Powder) برای مات‌کردن پوست، یکدست‌کردن رنگ و تثبیت آرایش استفاده می‌شود.\n\nهنگام انتخاب پنکیک، به نوع پوست خود توجه کنید. برای پوست‌های چرب، پنکیک‌های مات‌کننده با پوشش متوسط تا بالا مناسب‌تر هستند. برای پوست‌های خشک، پنکیک‌های حاوی ترکیبات آبرسان مانند ویتامین E ترجیح داده می‌شوند.\n\nوجود SPF در پنکیک (مانند SPF-25 در پنکیک ۱۰۱) یک مزیت اضافی است، اما جایگزین کرم ضد آفتاب نمی‌شود.\n\nنکته: برای جلوگیری از ظاهر کیک‌شده، پنکیک را با یک براش نرم و به مقدار کم روی پوست بزنید. استفاده از پرایمر قبل از پنکیک نیز ماندگاری آن را افزایش می‌دهد.',
      category: 'makeup',
      status: 'published',
      readTime: '۴ دقیقه',
      author: 'تیم فاطمه بیوتی لند',
      featured: false,
      editorsPick: false,
    },
    {
      title: 'روتین پوستی زمستان و تابستان چه تفاوتی دارد؟',
      slug: 'winter-summer-skincare',
      excerpt: 'شرایط آب‌وهوایی بر نیاز پوست اثر می‌گذارد. روتین خود را با فصل هماهنگ کنید.',
      content: 'پوست در فصل‌های مختلف سال نیازهای متفاوتی دارد. در تابستان، تعریق و چربی بیشتر است و در زمستان، خشکی و حساسیت شایع‌تر است.\n\nروتین تابستان: پاک‌کننده ملایم، تونر کنترل‌کننده چربی، سرم سبک، مرطوب‌کننده ژل‌مانند و ضد آفتاب با SPF بالا.\n\nروتین زمستان: پاک‌کننده آبرسان، تونر آبرسان، سرم حاوی هیالورونیک اسید، مرطوب‌کننده غنی‌تر و ضد آفتاب (حتی در روزهای ابری).\n\nنکته: در هر دو فصل، استفاده از ضد آفتاب ضروری است. در زمستان، اشعه UVA همچنان به پوست نفوذ می‌کند و باعث پیری زودرس می‌شود.',
      category: 'education',
      status: 'published',
      readTime: '۵ دقیقه',
      author: 'تیم فاطمه بیوتی لند',
      featured: false,
      editorsPick: false,
    },
    {
      title: 'پارابن و سولفات؛ آیا واقعاً خطرناک هستند؟',
      slug: 'paraben-sulfate-safety',
      excerpt: 'این دو ماده در محصولات مراقبتی بسیار رایج هستند. نگاهی علمی به ایمنی آن‌ها بیندازیم.',
      content: 'پارابن‌ها نگهدارنده‌هایی هستند که از رشد باکتری و قارچ در محصولات جلوگیری می‌کنند. سولفات‌ها مواد کف‌کننده‌ای هستند که در شامپوها و پاک‌کننده‌ها استفاده می‌شوند.\n\nنگرانی‌هایی درباره اثرات بالقوه این مواد بر سلامت مطرح شده است، اما در مقادیر مجاز موجود در محصولات، اکثر سازمان‌های نظارتی آن‌ها را بی‌خطر می‌دانند.\n\nبا این حال، برخی افراد ممکن است به سولفات‌ها یا پارابن‌ها حساسیت داشته باشند. در این صورت، انتخاب محصولات بدون سولفات یا بدون پارابن توصیه می‌شود.\n\nنکته: اگر پوست حساس یا موهای خشک دارید، محصولات ملایم‌تر را امتحان کنید. در غیر این صورت، استفاده از محصولات استاندارد معمولاً مشکلی ایجاد نمی‌کند.',
      category: 'education',
      status: 'published',
      readTime: '۵ دقیقه',
      author: 'تیم فاطمه بیوتی لند',
      featured: false,
      editorsPick: false,
    },
    {
      title: '۵ اشتباه رایج در مراقبت از پوست',
      slug: 'common-skincare-mistakes',
      excerpt: 'گاهی عادت‌های ساده می‌توانند به پوست آسیب بزنند. با این ۵ اشتباه آشنا شوید.',
      content: '۱. عدم استفاده از ضد آفتاب در روزهای ابری: اشعه UVA از ابرها عبور می‌کند و به پوست آسیب می‌زند.\n\n۲. زیاده‌روی در لایه‌برداری: این کار می‌تواند سد دفاعی پوست را تخریب کند و منجر به حساسیت شود.\n\n۳. استفاده از محصولات نامناسب با نوع پوست: محصولات سنگین برای پوست چرب می‌توانند منافذ را مسدود کنند.\n\n۴. عدم پاک‌سازی آرایش قبل از خواب: این کار باعث مسدود شدن منافذ و ایجاد جوش می‌شود.\n\n۵. انتظار نتیجه فوری: محصولات مراقبتی معمولاً نیاز به چند هفته استفاده منظم دارند تا نتایج قابل مشاهده شوند.',
      category: 'education',
      status: 'published',
      readTime: '۴ دقیقه',
      author: 'تیم فاطمه بیوتی لند',
      featured: false,
      editorsPick: false,
    },
  ];

  await db.insert(articles).values(articlesData);
  
  console.log('✅ ۱۰ مقاله با موفقیت به دیتابیس اضافه شدند!');
  process.exit(0);
}
seedArticles();


==========================================================================================
FILE [227/255] src\db\seed-full-articles.ts
SIZE 39642 bytes
==========================================================================================
import { db } from '../lib/db';
import { articles } from './schema';
import { eq } from 'drizzle-orm';
import { generateArticleCover } from '../lib/ai-image';

const fullArticles = [
  {
    title: 'چگونه برچسب محصولات مراقبت پوست را بخوانیم؟',
    slug: 'read-skincare-label',
    excerpt: 'برچسب هر محصول، کلیدی برای شناخت ترکیبات و کاربرد آن است. در این راهنما با اصول خواندن برچسب، ترتیب ترکیبات، بخش‌های مهم و نکات کلیدی خرید آشنا می‌شوید.',
    category: 'education',
    readTime: '۸ دقیقه',
    content: `برچسب محصولات مراقبتی، منبع اصلی اطلاعات درباره ترکیبات، کاربرد، شرایط نگهداری و هشدارهای ایمنی محصول است. اما خواندن این برچسب‌ها برای بسیاری از خریداران پیچیده به نظر می‌رسد. در این راهنما یاد می‌گیرید چطور برچسب یک محصول را مثل یک متخصص بخوانید.

اولین نکته‌ای که باید بدانید، ترتیب ترکیبات روی برچسب است. ترکیبات بر اساس مقدارشان مرتب می‌شوند؛ از بیشترین به کمترین. یعنی ترکیب اول بیشترین درصد را در محصول دارد و ترکیب آخر کمترین درصد. این قاعده به شما کمک می‌کند تشخیص دهید یک ترکیب مؤثر واقعاً در محصول وجود دارد یا فقط برای نام‌گذاری روی بسته استفاده شده است.

به عنوان مثال، اگر یک محصول ادعا می‌کند حاوی نیاسینامید است اما نیاسینامید در انتهای لیست ترکیبات آمده، یعنی مقدار آن بسیار کم است و احتمالاً تأثیر محسوسی نخواهد داشت. در مقابل، اگر نیاسینامید در میانه‌ی لیست یا ابتدای آن باشد، یعنی محصول مقدار قابل توجهی از آن را دارد.

بخش‌های مهم برچسب شامل نام تجاری و نام کامل محصول، فهرست کامل ترکیبات، حجم یا وزن خالص، کاربرد و روش استفاده، هشدارها و محدودیت‌ها، تاریخ تولید و انقضا، و کشور سازنده است. هر کدام از این بخش‌ها اطلاعات مهمی برای انتخاب محصول مناسب در اختیار شما می‌گذارند.

ترکیبات مؤثر را بشناسید. برای محصولات مراقبت پوست، ترکیباتی مثل هیالورونیک اسید (آبرسان)، نیاسینامید (روشن‌کننده و متعادل‌کننده چربی)، آلفا آربوتین (روشن‌کننده)، رتینول (ضدپیری)، ویتامین C (آنتی‌اکسیدان)، و اسیدهای AHA و BHA (لایه‌بردار) از مهم‌ترین ترکیبات مؤثر هستند.

ترکیباتی که باید از آن‌ها دوری کنید. اگر پوست حساسی دارید، از محصولات حاوی الکل خشک‌کننده (Alcohol Denat)، عطر مصنوعی، و رنگ‌های مصنوعی پرهیز کنید. برای پوست‌های چرب و مستعد جوش، از محصولات حاوی روغن‌های سنگین (مثل Mineral Oil) و سیلیکون‌های مسدودکننده (مثل Dimethicone در برخی فرمول‌ها) دوری کنید.

هشدارها و محدودیت‌ها را جدی بگیرید. بخش هشدارها معمولاً شامل نکات مهمی درباره استفاده صحیح، پرهیز از تماس با چشم، یا توصیه به تست حساسیت پیش از استفاده کامل است. این بخش را هرگز نادیده نگیرید، زیرا برخی ترکیبات در صورت استفاده نادرست می‌توانند باعث تحریک یا حساسیت شوند.

تاریخ تولید و انقضا از اهمیت بالایی برخوردار است. هر محصولی که تاریخ انقضای آن گذشته یا نزدیک به اتمام است، نباید استفاده شود. همچنین به شرایط نگهداری توجه کنید؛ برخی محصولات پس از باز شدن باید در یخچال نگهداری شوند یا از نور مستقیم خورشید دور بمانند.

در نهایت، به یاد داشته باشید که خواندن برچسب فقط یکی از ابزارهای انتخاب محصول است. برای تصمیم‌گیری نهایی، به نیاز پوست خود، نظر متخصص پوست، و تجربه‌های واقعی دیگر کاربران نیز توجه کنید.`,
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: true,
    status: 'published',
  },
  {
    title: 'ترتیب استفاده از محصولات مراقبت پوست (لایه‌بندی)',
    slug: 'how-to-layer-skincare',
    excerpt: 'ترتیب درست استفاده از محصولات، تأثیر آن‌ها را چند برابر می‌کند. در این راهنما، ترتیب صحیح لایه‌بندی محصولات صبح و شب را می‌آموزید.',
    category: 'education',
    readTime: '۷ دقیقه',
    content: `استفاده از محصولات مراقبتی به ترتیب درست، یکی از مهم‌ترین اصول در روتین پوستی است. محصولاتی که سبک‌تر هستند اول و محصولات سنگین‌تر در انتها استفاده می‌شوند. اگر این ترتیب رعایت نشود، حتی بهترین محصولات هم نمی‌توانند به درستی جذب شوند.

قاعده طلایی این است: از سبک‌ترین به سنگین‌ترین. یعنی هر محصولی که بافت رقیق‌تری دارد، اول استفاده می‌شود تا جذب شود. محصولات سنگین‌تر در انتها استفاده می‌شوند تا رطوبت را در پوست قفل کنند. این ترتیب به پوست امکان می‌دهد از همه محصولات بهره ببرد و از بار سنگین روی پوست جلوگیری می‌کند.

ترتیب پیشنهادی لایه‌بندی برای روتین صبح:
۱. پاک‌کننده (Cleanser)
۲. تونر (Toner)
۳. سرم ویتامین C یا هیالورونیک اسید (Serum)
۴. کرم دور چشم (Eye Cream)
۵. مرطوب‌کننده سبک (Moisturizer)
۶. ضد آفتاب با SPF ۳۰ یا بالاتر (Sunscreen)

ترتیب پیشنهادی لایه‌بندی برای روتین شب:
۱. پاک‌کننده (برای حذف آرایش و آلودگی)
۲. تونر (برای بازگرداندن pH پوست)
۳. سرم رتینول یا پپتید (برای ترمیم شبانه)
۴. کرم دور چشم
۵. مرطوب‌کننده غنی‌تر (برای آبرسانی عمیق)
۶. روغن یا بالم (برای قفل‌کردن رطوبت)

بین استفاده از هر محصول، چند ثانیه صبر کنید تا جذب شود. این کار به محصول بعدی اجازه می‌دهد به درستی روی پوست بنشیند. اگر از محصولات لایه‌بردار مثل AHA یا BHA استفاده می‌کنید، آن‌ها را در مرحله سرم استفاده کنید و از ترکیب با رتینول در همان روتین پرهیز کنید، زیرا ممکن است باعث تحریک پوست شوند.

اشتباهات رایج در لایه‌بندی: استفاده از محصولات سنگین قبل از سبک، ترکیب همزمان محصولات ناسازگار (مثل رتینول و ویتامین C در یک روتین)، استفاده از تعداد زیاد محصولات بدون نیاز واقعی، نادیده گرفتن ضد آفتاب در روتین صبح، و استفاده از محصولات لایه‌بردار روی پوست تحریک‌شده.

نکته پایانی: لایه‌بندی درست، مهم‌تر از استفاده از محصولات متعدد است. اگر فقط یک پاک‌کننده، یک مرطوب‌کننده و یک ضد آفتاب استفاده می‌کنید اما ترتیب را رعایت می‌کنید، نتیجه بهتر از استفاده از ده محصول بدون ترتیب درست خواهد بود.`,
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: false,
    status: 'published',
  },
  {
    title: 'پیش از خرید تونر به چه نکاتی توجه کنیم؟',
    slug: 'before-buying-toner',
    excerpt: 'تونر یکی از محصولات پرکاربرد در روتین پوستی است. در این راهنما با انواع تونر، کاربردها و نکات مهم پیش از خرید آشنا می‌شوید.',
    category: 'buying-guide',
    readTime: '۶ دقیقه',
    content: `تونر معمولاً به عنوان دومین مرحله روتین پوستی، پس از پاک‌کننده استفاده می‌شود. اما تونرها با کاربردهای مختلف، انتخاب را پیچیده می‌کنند. در این راهنما یاد می‌گیرید چطور تونر مناسب پوست خود را انتخاب کنید.

تونرها معمولاً سه کاربرد اصلی دارند: آبرسانی، تعادل pH پوست پس از پاک‌سازی، و آماده‌سازی پوست برای جذب محصولات بعدی. برخی تونرها نیز حاوی ترکیبات لایه‌بردار یا کنترل‌کننده چربی هستند. بنابراین، پیش از خرید باید بدانید به چه نوع تونری نیاز دارید.

تونرهای آبرسان: برای پوست‌های خشک و کم‌آب مناسب هستند. این تونرها معمولاً حاوی هیالورونیک اسید، گلیسیرین، پانتنول و عصاره‌های گیاهی مرطوب‌کننده هستند. استفاده از این تونرها به حفظ رطوبت پوست و کاهش حس کشیدگی کمک می‌کند.

تونرهای متعادل‌کننده pH: برای همه انواع پوست مناسب هستند. این تونرها پس از پاک‌سازی، pH طبیعی پوست را بازمی‌گردانند و به آماده‌سازی پوست برای جذب سرم و مرطوب‌کننده کمک می‌کنند. ترکیبات رایج شامل گلیسیرین، پانتنول و عصاره‌های گیاهی ملایم است.

تونرهای لایه‌بردار: برای پوست‌های چرب و مستعد جوش مناسب هستند. این تونرها حاوی AHA (مثل گلیکولیک اسید) یا BHA (مثل سالیسیلیک اسید) هستند و به پاک‌سازی عمیق منافذ و کاهش جوش کمک می‌کنند. استفاده از این تونرها باید با احتیاط و طبق دستور محصول باشد، زیرا ممکن است باعث تحریک شوند.

تونرهای کنترل‌کننده چربی: برای پوست‌های چرب مناسب هستند. این تونرها حاوی نیاسینامید، روی (Zinc) یا عصاره‌های قابض هستند و به کاهش تولید سبوم و کوچک‌کردن ظاهر منافذ کمک می‌کنند.

پیش از خرید تونر، به ترکیبات، نوع پوست و کاربرد مورد نظر توجه کنید. اگر پوست حساسی دارید، از تونرهای حاوی الکل بالا و عطر پرهیز کنید. اگر پوست چرب دارید، تونرهای حاوی نیاسینامید می‌توانند مفید باشند. برای پوست‌های خشک، تونرهای آبرسان بهترین انتخاب هستند.

روش استفاده صحیح: تونر را می‌توانید با پنبه روی صورت بزنید یا در دست کف کرده و روی پوست بمالید. روش دوم برای پوست‌های حساس ملایم‌تر است. پس از جذب، محصولات بعدی مثل سرم و مرطوب‌کننده را استفاده کنید.

نکته پایانی: تونر خوب، تونری است که نیاز پوست شما را برطرف کند، نه چیزی که فقط نامش جذاب باشد. همیشه پیش از خرید، تست حساسیت روی ناحیه‌ای کوچک از پوست انجام دهید.`,
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: true,
    status: 'published',
  },
  {
    title: 'آلفا آربوتین و نیاسینامید؛ دو قهرمان روشن‌کننده پوست',
    slug: 'arbutin-niacinamide-benefits',
    excerpt: 'آلفا آربوتین و نیاسینامید دو ترکیب محبوب برای روشن‌سازی پوست هستند. با خواص، نحوه استفاده و نکات مهم درباره این دو ترکیب آشنا شوید.',
    category: 'skincare',
    readTime: '۷ دقیقه',
    content: `آلفا آربوتین و نیاسینامید دو ترکیب محبوب در محصولات روشن‌کننده پوست هستند. هر دو در کاهش لک و یکنواخت‌سازی رنگ پوست مؤثرند، اما مکانیزم اثرشان متفاوت است. در این راهنما با خواص، نحوه استفاده و نکات مهم درباره این دو ترکیب آشنا می‌شوید.

آلفا آربوتین یک ترکیب طبیعی است که از گیاهانی مثل زغال‌اخته و توت استخراج می‌شود. این ترکیب با مهار آنزیم تیروزیناز، به کاهش تولید ملانین (رنگدانه پوست) کمک می‌کند و در نتیجه باعث روشن‌شدن لک‌های قهوه‌ای و هایپرپیگمانتاسیون می‌شود. آلفا آربوتین به عنوان جایگزین ایمن‌تر هیدروکینون (که در برخی کشورها محدود شده) شناخته می‌شود.

نیاسینامید (ویتامین B3) یک ترکیب همه‌کاره است که خواص متعددی برای پوست دارد. این ترکیب به تقویت سد دفاعی پوست، کاهش التهاب، کنترل چربی، کوچک‌کردن ظاهر منافذ، و همچنین روشن‌سازی پوست کمک می‌کند. نیاسینامید با کاهش انتقال ملانین به سلول‌های سطحی پوست، باعث یکنواخت‌شدن رنگ پوست می‌شود.

ترکیب آلفا آربوتین و نیاسینامید در یک محصول (مانند تونر روشن‌کننده ویتابلا) می‌تواند تأثیر هم‌افزایی داشته باشد و نتایج بهتری در یکنواختی رنگ پوست ایجاد کند. آلفا آربوتین تولید ملانین را کاهش می‌دهد و نیاسینامید از انتقال آن به سطح پوست جلوگیری می‌کند.

نحوه استفاده: محصولات حاوی آلفا آربوتین و نیاسینامید معمولاً در روتین صبح و شب قابل استفاده هستند. با این حال، استفاده از ضد آفتاب در طول روز برای جلوگیری از بازگشت لک‌ها ضروری است. اگر پوست حساسی دارید، ابتدا تست حساسیت انجام دهید و سپس محصول را به طور کامل استفاده کنید.

نکات مهم: استفاده از این ترکیبات نیازمند صبر و استمرار است. نتایج معمولاً پس از چند هفته استفاده منظم (حداقل ۴ تا ۸ هفته) قابل مشاهده هستند. همچنین، مصرف همزمان این ترکیبات با رتینول توصیه نمی‌شود، زیرا ممکن است باعث تحریک پوست شوند.

نکته پایانی: هیچ محصولی معجزه‌آسا نیست. آلفا آربوتین و نیاسینامید ترکیبات مؤثری هستند، اما نتایج آن‌ها به استفاده منظم، محافظت در برابر آفتاب، و رعایت روتین مناسب بستگی دارد. برای انتخاب محصول مناسب، با متخصص پوست مشورت کنید.`,
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: false,
    status: 'published',
  },
  {
    title: 'روغن مورینگا برای مو؛ خواص و نحوه استفاده',
    slug: 'moringa-oil-hair-benefits',
    excerpt: 'روغن مورینگا سرشار از مواد مغذی است و به تقویت و ضخیم‌شدن مو کمک می‌کند. با خواص، نحوه استفاده و نکات مهم درباره این روغن آشنا شوید.',
    category: 'haircare',
    readTime: '۶ دقیقه',
    content: `روغن مورینگا از دانه‌های درخت مورینگا استخراج می‌شود و سرشار از اسیدهای چرب، ویتامین‌ها و مواد معدنی است. این روغن به دلیل خواص آنتی‌اکسیدانی و آبرسانی، در محصولات مراقبت از مو بسیار مورد استفاده قرار می‌گیرد.

خواص روغن مورینگا برای مو: این روغن به تقویت فولیکول‌های مو، کاهش خشکی و شکنندگی مو، بهبود ظاهر کلی مو، و کاهش ریزش مو کمک می‌کند. اسیدهای چرب موجود در آن (مثل اولئیک اسید و لینولئیک اسید) به تغذیه پوست سر و تقویت ساقه مو کمک می‌کنند.

استفاده از شامپوهای حاوی روغن مورینگا (مانند شامپو مورینگا اکسونیک) راهی ساده برای بهره‌مندی از این خواص در روتین روزانه است. این شامپوها به تقویت مو و کاهش خشکی کمک می‌کنند و در عین حال، مو را تمیز و سبک نگه می‌دارند.

نحوه استفاده صحیح: برای بهترین نتیجه، موها را خیس کنید و مقدار کافی از شامپو را روی پوست سر و ساقه مو ماساژ دهید. حداقل ۲ تا ۳ دقیقه صبر کنید تا ترکیبات فعال جذب شوند، سپس آبکشی کنید. استفاده از نرم‌کننده پس از شامپو نیز توصیه می‌شود تا موها نرم‌تر و قابل مدیریت‌تر شوند.

نکات مهم: اگر موهای چرب دارید، استفاده از شامپوهای حاوی روغن مورینگا به تنهایی ممکن است کافی نباشد و بهتر است از شامپوهای مخصوص موی چرب استفاده کنید. برای موهای خشک و آسیب‌دیده، ترکیب شامپو با ماسک موی حاوی روغن مورینگا توصیه می‌شود.

نکته پایانی: روغن مورینگا یک ترکیب طبیعی و مؤثر برای مراقبت از مو است، اما نتایج آن به استفاده منظم و رعایت سایر اصول مراقبت از مو (مثل تغذیه مناسب، کاهش استرس، و پرهیز از حرارت زیاد) بستگی دارد.`,
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: false,
    status: 'published',
  },
  {
    title: 'لایه‌برداری پوست؛ هر چند وقت یک‌بار و چگونه؟',
    slug: 'exfoliation-guide',
    excerpt: 'لایه‌برداری منظم به شفافیت و صافی پوست کمک می‌کند، اما زیاده‌روی در آن می‌تواند آسیب‌زا باشد. با اصول لایه‌برداری صحیح آشنا شوید.',
    category: 'skincare',
    readTime: '۷ دقیقه',
    content: `لایه‌برداری (Exfoliation) فرآیند حذف سلول‌های مرده از سطح پوست است که به شفافیت، صافی و بهبود جذب محصولات کمک می‌کند. اما زیاده‌روی در آن می‌تواند به سد دفاعی پوست آسیب بزند و منجر به تحریک و حساسیت شود.

دو نوع اصلی لایه‌برداری وجود دارد: فیزیکی و شیمیایی. لایه‌برداری فیزیکی شامل استفاده از ذرات ساینده (مثل صابون‌های حاوی ذرات زردآلو یا شکر) است. لایه‌برداری شیمیایی شامل استفاده از اسیدهای AHA (مثل گلیکولیک اسید و لاکتیک اسید) یا BHA (سالیسیلیک اسید) است که سلول‌های مرده را حل می‌کنند.

فراوانی لایه‌برداری به نوع پوست بستگی دارد. برای پوست‌های معمولی تا چرب، ۲ تا ۳ بار در هفته کافی است. برای پوست‌های حساس، یک بار در هفته یا حتی کمتر توصیه می‌شود. برای پوست‌های بالغ و ضخیم، می‌توان از ۳ بار در هفته استفاده کرد، اما همیشه باید به واکنش پوست توجه کرد.

نحوه لایه‌برداری صحیح: ابتدا صورت را با پاک‌کننده ملایم بشویید. سپس مقدار مناسبی از محصول لایه‌بردار را روی پوست خشک یا نمناک (بسته به دستور محصول) بمالید. با حرکات دورانی ملایم ماساژ دهید و سپس با آب ولرم بشویید. پس از لایه‌برداری، حتماً از مرطوب‌کننده و ضد آفتاب استفاده کنید.

نکات مهم: پس از لایه‌برداری، پوست حساس‌تر می‌شود و بیشتر در معرض آسیب آفتاب قرار می‌گیرد. بنابراین، استفاده از ضد آفتاب با SPF بالا در طول روز ضروری است. همچنین، از ترکیب لایه‌بردار با رتینول یا سایر محصولات قوی در همان روز خودداری کنید.

علائم هشدار: اگر پس از لایه‌برداری، پوست شما قرمز، سوزان یا پوسته‌پوسته شد، یعنی زیاده‌روی کرده‌اید. در این صورت، لایه‌برداری را متوقف کنید و به پوست استراحت دهید. پوست شما به زمان نیاز دارد تا سد دفاعی خود را بازسازی کند.

نکته پایانی: لایه‌برداری یکی از مهم‌ترین مراحل روتین پوستی است، اما باید با احتیاط و متناسب با نوع پوست انجام شود. اگر مطمئن نیستید، با متخصص پوست مشورت کنید تا بهترین برنامه لایه‌برداری برای پوست شما تعیین شود.`,
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: true,
    status: 'published',
  },
  {
    title: 'راهنمای انتخاب پنکیک و پودر فشرده مناسب',
    slug: 'choose-compact-powder',
    excerpt: 'پنکیک مناسب می‌تواند ظاهر پوست را یکدست کند. با معیارهای انتخاب پنکیک مناسب پوست خود آشنا شوید.',
    category: 'makeup',
    readTime: '۵ دقیقه',
    content: `پنکیک یا پودر فشرده (Compact Powder) برای مات‌کردن پوست، یکدست‌کردن رنگ و تثبیت آرایش استفاده می‌شود. اما انتخاب پنکیک مناسب نیازمند توجه به چند نکته کلیدی است.

اولین نکته، نوع پوست است. برای پوست‌های چرب، پنکیک‌های مات‌کننده با پوشش متوسط تا بالا مناسب‌تر هستند. این پنکیک‌ها به کنترل چربی و کاهش درخشندگی پوست کمک می‌کنند. برای پوست‌های خشک، پنکیک‌های حاوی ترکیبات آبرسان مانند ویتامین E ترجیح داده می‌شوند تا از خشکی بیشتر پوست جلوگیری کنند.

دومین نکته، پوشش‌دهی است. پنکیک‌ها در سه سطح پوشش عرضه می‌شوند: سبک (برای ظاهر طبیعی)، متوسط (برای پوشش روزانه)، و بالا (برای پوشش کامل). انتخاب سطح پوشش به نیاز و سلیقه شما بستگی دارد.

سومین نکته، رنگ و شید است. پنکیک باید با رنگ پوست شما هماهنگ باشد. برای انتخاب شید مناسب، تست روی خط فک در نور طبیعی توصیه می‌شود. اگر رنگ پنکیک با پوست شما هماهنگ نباشد، ظاهر آرایش غیرطبیعی خواهد شد.

چهارمین نکته، وجود SPF است. برخی پنکیک‌ها حاوی SPF هستند (مانند پنکیک ۱۰۱ با SPF-25). این یک مزیت اضافی است، اما جایگزین کرم ضد آفتاب نمی‌شود. استفاده از ضد آفتاب به عنوان پایه آرایش همچنان ضروری است.

نحوه استفاده صحیح: برای جلوگیری از ظاهر کیک‌شده، پنکیک را با یک براش نرم و به مقدار کم روی پوست بزنید. ابتدا در نواحی پرچرب (پیشانی، بینی، چانه) و سپس در سایر نواحی استفاده کنید. استفاده از پرایمر قبل از پنکیک نیز ماندگاری آن را افزایش می‌دهد.

نکته پایانی: پنکیک مناسب، پنکیکی است که با نوع پوست، رنگ و نیاز شما هماهنگ باشد. اگر مطمئن نیستید، تست روی ناحیه‌ای کوچک از پوست و مقایسه با نور طبیعی توصیه می‌شود.`,
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: false,
    status: 'published',
  },
  {
    title: 'روتین پوستی زمستان و تابستان چه تفاوتی دارد؟',
    slug: 'winter-summer-skincare',
    excerpt: 'شرایط آب‌وهوایی بر نیاز پوست اثر می‌گذارد. روتین پوستی خود را با فصل هماهنگ کنید تا بهترین نتیجه را بگیرید.',
    category: 'education',
    readTime: '۶ دقیقه',
    content: `پوست در فصل‌های مختلف سال نیازهای متفاوتی دارد. در تابستان، تعریق و چربی بیشتر است و در زمستان، خشکی و حساسیت شایع‌تر است. بنابراین، روتین پوستی شما باید با تغییرات فصل هماهنگ شود.

روتین تابستان: در تابستان، پوست بیشتر در معرض آفتاب، تعریق و آلودگی است. روتین تابستان باید شامل پاک‌کننده ملایم (برای حذف تعریق و چربی)، تونر کنترل‌کننده چربی (برای کاهش درخشندگی)، سرم سبک (مثل هیالورونیک اسید یا نیاسینامید)، مرطوب‌کننده ژل‌مانند (برای آبرسانی بدون سنگینی)، و ضد آفتاب با SPF بالا (۳۰ یا بالاتر) باشد.

روتین زمستان: در زمستان، پوست بیشتر در معرض خشکی، باد سرد و گرمای خشک وسایل گرمایشی است. روتین زمستان باید شامل پاک‌کننده آبرسان (برای جلوگیری از خشکی بیشتر)، تونر آبرسان (برای حفظ رطوبت)، سرم حاوی هیالورونیک اسید (برای آبرسانی عمیق)، مرطوب‌کننده غنی‌تر (حاوی سرامید، شیا باتر یا روغن‌های طبیعی)، و ضد آفتاب (حتی در روزهای ابری) باشد.

نکات مهم برای هر دو فصل: استفاده از ضد آفتاب در هر دو فصل ضروری است. در زمستان، اشعه UVA همچنان به پوست نفوذ می‌کند و باعث پیری زودرس می‌شود. همچنین، در هر دو فصل، استفاده از محصولات حاوی آنتی‌اکسیدان (مثل ویتامین C و E) به محافظت از پوست در برابر آسیب‌های محیطی کمک می‌کند.

تغییرات تدریجی: بهتر است تغییرات روتین را به تدریج انجام دهید تا پوست فرصت سازگاری داشته باشد. اگر محصول جدیدی را شروع می‌کنید، ابتدا تست حساسیت انجام دهید و سپس به طور کامل استفاده کنید.

نکته پایانی: هیچ روتین ثابتی برای همه فصل‌ها وجود ندارد. با توجه به شرایط آب‌وهوایی، نیاز پوست خود، و توصیه‌های متخصص پوست، روتین مناسب را انتخاب کنید و در صورت نیاز آن را تنظیم کنید.`,
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: false,
    status: 'published',
  },
  {
    title: 'پارابن و سولفات؛ آیا واقعاً خطرناک هستند؟',
    slug: 'paraben-sulfate-safety',
    excerpt: 'این دو ماده در محصولات مراقبتی بسیار رایج هستند. نگاهی علمی و بی‌طرف به ایمنی آن‌ها بیندازیم.',
    category: 'education',
    readTime: '۶ دقیقه',
    content: `پارابن‌ها و سولفات‌ها دو گروه از مواد هستند که در محصولات مراقبتی بسیار رایج‌اند، اما درباره ایمنی آن‌ها بحث‌های زیادی وجود دارد. در این راهنما نگاهی علمی و بی‌طرف به این دو ماده می‌اندازیم.

پارابن‌ها نگهدارنده‌هایی هستند که از رشد باکتری، قارچ و کپک در محصولات جلوگیری می‌کنند. این مواد در بسیاری از محصولات (از کرم‌ها تا شامپوها) استفاده می‌شوند تا ماندگاری محصول افزایش یابد و از فساد آن جلوگیری شود.

نگرانی‌ها درباره پارابن‌ها: برخی مطالعات نشان داده‌اند که پارابن‌ها ممکن است اثرات استروژنی ضعیفی داشته باشند. با این حال، سازمان‌های نظارتی مثل FDA و اتحادیه اروپا، پارابن‌ها را در مقادیر مجاز موجود در محصولات، بی‌خطر می‌دانند. مقدار پارابن در محصولات معمولاً بسیار کمتر از سطحی است که ممکن است اثر منفی داشته باشد.

سولفات‌ها مواد کف‌کننده‌ای هستند که در شامپوها، پاک‌کننده‌ها و خمیر دندان‌ها استفاده می‌شوند. رایج‌ترین آن‌ها سدیم لوریل سولفات (SLS) و سدیم لوریل اتر سولفات (SLES) هستند. این مواد به حذف چربی و آلودگی از پوست و مو کمک می‌کنند.

نگرانی‌ها درباره سولفات‌ها: سولفات‌ها ممکن است برای پوست‌های حساس یا موهای خشک تحریک‌کننده باشند. این مواد می‌توانند چربی طبیعی پوست و مو را بیش از حد حذف کنند و منجر به خشکی و حساسیت شوند. با این حال، در محصولات استاندارد، مقدار سولفات طوری تنظیم شده که معمولاً مشکلی ایجاد نکند.

گزینه‌های بدون پارابن و بدون سولفات: اگر پوست حساس یا موهای خشک دارید، محصولات بدون سولفات یا بدون پارابن می‌توانند گزینه‌های بهتری باشند. این محصولات معمولاً از مواد ملایم‌تر (مثل سدیم کوکوئیل ایزوتیونات یا سدیم کوکامفو استات برای سولفات، و فنوکسی‌اتانول یا سوربات پتاسیم برای نگهداری) استفاده می‌کنند.

نکته پایانی: نه پارابن‌ها و نه سولفات‌ها در مقادیر مجاز، برای اکثر افراد خطرناک نیستند. با این حال، اگر پوست یا موی حساسی دارید، محصولات ملایم‌تر را امتحان کنید. همیشه پیش از خرید، ترکیبات محصول را بررسی کنید و در صورت نگرانی، با متخصص پوست مشورت کنید.`,
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: false,
    status: 'published',
  },
  {
    title: '۵ اشتباه رایج در مراقبت از پوست',
    slug: 'common-skincare-mistakes',
    excerpt: 'گاهی عادت‌های ساده می‌توانند به پوست آسیب بزنند. با ۵ اشتباه رایج در مراقبت از پوست و راه‌حل هرکدام آشنا شوید.',
    category: 'education',
    readTime: '۵ دقیقه',
    content: `مراقبت از پوست یک فرآیند مداوم است و گاهی عادت‌های ساده می‌توانند به پوست آسیب بزنند. در این راهنما با ۵ اشتباه رایج در مراقبت از پوست و راه‌حل هرکدام آشنا می‌شوید.

اشتباه اول: عدم استفاده از ضد آفتاب در روزهای ابری. اشعه UVA از ابرها عبور می‌کند و به پوست آسیب می‌زند. استفاده از ضد آفتاب با SPF ۳۰ یا بالاتر در هر روز (حتی روزهای ابری) ضروری است. ضد آفتاب باید هر ۲ تا ۳ ساعت تمدید شود.

اشتباه دوم: زیاده‌روی در لایه‌برداری. لایه‌برداری بیش از حد می‌تواند سد دفاعی پوست را تخریب کند و منجر به حساسیت، قرمزی و خشکی شود. تعداد دفعات لایه‌برداری باید متناسب با نوع پوست باشد (۲ تا ۳ بار در هفته برای پوست معمولی، یک بار در هفته برای پوست حساس).

اشتباه سوم: استفاده از محصولات نامناسب با نوع پوست. محصولات سنگین برای پوست چرب می‌توانند منافذ را مسدود کنند و باعث جوش شوند. محصولات سبک برای پوست خشک کافی نیستند و باعث خشکی بیشتر می‌شوند. شناخت نوع پوست و انتخاب محصولات مناسب آن، اولین قدم در روتین پوستی است.

اشتباه چهارم: عدم پاک‌سازی آرایش قبل از خواب. این کار باعث مسدود شدن منافذ، ایجاد جوش، و پیری زودرس پوست می‌شود. حتی اگر خسته هستید، حتماً صورت خود را با پاک‌کننده مناسب بشویید و آرایش را پاک کنید.

اشتباه پنجم: انتظار نتیجه فوری. محصولات مراقبتی معمولاً نیاز به چند هفته استفاده منظم (حداقل ۴ تا ۸ هفته) دارند تا نتایج قابل مشاهده شوند. صبر و استمرار، کلید موفقیت در مراقبت از پوست است.

نکته پایانی: مراقبت از پوست یک سفر است، نه یک مقصد. با رعایت اصول ساده (پاک‌سازی، آبرسانی، محافظت در برابر آفتاب) و پرهیز از اشتباهات رایج، می‌توانید پوستی سالم و شاداب داشته باشید. اگر مشکل پوستی خاصی دارید، با متخصص پوست مشورت کنید.`,
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: false,
    status: 'published',
  },
];

async function seedAndGenerate() {
  console.log('🌱 در حال بازنویسی محتوای ۱۰ مقاله...');
  
  for (const article of fullArticles) {
    // بررسی اینکه مقاله از قبل وجود دارد یا نه
    const existing = await db.select().from(articles).where(eq(articles.slug, article.slug)).limit(1);
    
    if (existing.length > 0) {
      // آپدیت محتوای مقاله موجود
      await db.update(articles)
        .set({ 
          content: article.content,
          excerpt: article.excerpt,
          readTime: article.readTime,
          featured: article.featured,
          editorsPick: article.editorsPick,
          updatedAt: new Date(),
        })
        .where(eq(articles.slug, article.slug));
      console.log(`✅ محتوای مقاله به‌روزرسانی شد: ${article.title}`);
    } else {
      // ایجاد مقاله جدید
      await db.insert(articles).values(article);
      console.log(`✅ مقاله جدید ساخته شد: ${article.title}`);
    }
  }

  console.log('');
  console.log('🎨 در حال تولید عکس برای مقالات...');
  
  // پیدا کردن همه مقالات
  const allArticles = await db.select().from(articles);
  
  for (const article of allArticles) {
    if (!article.coverImage) {
      try {
        console.log(`⏳ تولید عکس برای: ${article.title}`);
        const imageUrl = await generateArticleCover(article.title, article.category);
        await db.update(articles)
          .set({ coverImage: imageUrl, updatedAt: new Date() })
          .where(eq(articles.id, article.id));
        console.log(`✅ عکس ساخته شد`);
        // صبر بین درخواست‌ها
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error: any) {
        console.error(`❌ خطا در تولید عکس برای ${article.title}:`, error.message);
      }
    } else {
      console.log(`ℹ️ عکس از قبل موجود است: ${article.title}`);
    }
  }

  console.log('');
  console.log('🎉 همه کارها با موفقیت انجام شد!');
  process.exit(0);
}

seedAndGenerate();


==========================================================================================
FILE [228/255] src\db\seed-products-v2.ts
SIZE 6543 bytes
==========================================================================================
import 'dotenv/config';
import { db } from '../lib/db';
import { products } from './schema';
import { eq } from 'drizzle-orm';

type Spec = { key: string; value: string };

type ProductUpdate = {
  slug: string;
  data: {
    name?: string;
    brand?: string;
    countryOfOrigin?: string;
    skinType?: string;
    warnings?: string;
    description?: string;
    ingredients?: string;
    usage?: string;
    specifications?: Spec[];
  };
};

const updates: ProductUpdate[] = [
  {
    slug: 'toner-vitabla',
    data: {
      name: 'تونر روشن‌کننده ویتابلا',
      brand: 'ویتابلا (Vitabella)',
      countryOfOrigin: 'ایران',
      skinType: 'همه انواع پوست',
      warnings: 'قبل از استفاده تست حساسیت روی ناحیه‌ای کوچک از پوست انجام دهید. از تماس با چشم خودداری کنید.',
      description: 'روشن و شفاف‌کننده پوست صورت و کاهش لک‌های قهوه‌ای؛ حاوی آلفا آربوتین و نیاسینامید.',
      ingredients: 'Aqua, PEG 6 Caprylic Capric Glycerides, PEG 40 Hydrogenated Castor Oil, Glycerin, Na PCA, Cranberry extract, Alpha Arbutin, Disodium EDTA, Sodium Benzoate, Potassium Sorbate, Glycolic Acid, Niacinamide, Allantoin, Fragrance.',
      usage: 'آرایش خود را با استفاده از یک پد پنبه‌ای آغشته به تونر پاک کنید. برای بهترین نتیجه دوبار در روز صبح و عصر از تونر استفاده کنید.',
      specifications: [
        { key: 'برند', value: 'ویتابلا (Vitabella)' },
        { key: 'حجم', value: '۲۲۰ میلی‌لیتر' },
        { key: 'کشور سازنده', value: 'ایران (PSEZ)' },
        { key: 'کد GTIN', value: '6269572204429' }
      ]
    }
  },
  {
    slug: 'shampoo-moringa',
    data: {
      name: 'شامپو مورینگا اکسونیک',
      brand: 'اکسونیک (Exonic)',
      countryOfOrigin: 'ایران',
      skinType: 'موی معمولی',
      warnings: 'از تماس مستقیم با چشم خودداری کنید. در صورت تماس با آب فراوان بشویید.',
      description: 'شامپو تقویت‌کننده موی سر حاوی روغن مورینگا؛ مناسب برای تقویت و ضخیم‌ترشدن مو.',
      ingredients: 'آب دیونیزه، آمونیوم لوریل سولفات، کوکامیدوپروپیل بتائین، روغن مورینگا، سدیم کلراید، گلیسرین، اسانس.',
      usage: 'موها را خیس نمایید، مقدار کافی از شامپو را به مدت دو تا سه دقیقه روی موها ماساژ دهید و سپس آبکشی کنید.',
      specifications: [
        { key: 'برند', value: 'اکسونیک (Exonic)' },
        { key: 'حجم', value: '۳۰۰ میلی‌لیتر (۱۰ FL.OZ)' },
        { key: 'کاربرد', value: 'تقویت‌کننده و ضخیم‌کننده مو' }
      ]
    }
  },
  {
    slug: 'exfoliating-soap',
    data: {
      name: 'صابون روشن‌کننده و لایه‌بردار بیز',
      brand: 'بیز (BIZ)',
      countryOfOrigin: 'ایران',
      skinType: 'پوست چرب',
      warnings: 'حاوی اسید گلیکولیک و پودر هسته زردآلو است. پس از استفاده از ضد آفتاب استفاده کنید. از تماس با چشم خودداری کنید.',
      description: 'صابون لایه‌بردار و روشن‌کننده مناسب برای دست و صورت؛ حاوی پودر هسته زردآلو و اسید گلیکولیک.',
      ingredients: 'Tallow oil, Sodium hydroxide, Coconut acid, Soy fatty acid, Glycerin, Cetyl alcohol, Paraffin, Sodium phosphate, Beat berry glycolic extract, Glycerin, Beeswax, Petrolatum, Fragrance, Castor oil, Apricot kernel powder, Ascorbic acid, BHT, Deionized water.',
      usage: 'پوست خود را شسته و قالب صابون را به آرامی روی آن بمالید، سپس کمی بشویید. در دمای محیط و در جای خشک نگهداری شود.',
      specifications: [
        { key: 'برند', value: 'بیز (BIZ)' },
        { key: 'وزن', value: '۱۰۰ گرم' },
        { key: 'کشور سازنده', value: 'ایران' },
        { key: 'کد IRC', value: '5619427734280689' },
        { key: 'ویژگی', value: 'حاوی پودر هسته زردآلو و اسید گلیکولیک' }
      ]
    }
  },
  {
    slug: 'pancake-101',
    data: {
      name: 'پنکیک مات ۱۰۱ بیز',
      brand: 'بیز (BIZ)',
      countryOfOrigin: 'ایران',
      skinType: 'همه انواع پوست',
      warnings: 'در جای خشک و خنک نگهداری شود. از قرار گرفتن در معرض نور مستقیم خورشید پرهیز کنید.',
      description: 'پنکیک مات با پوشش‌دهی عالی و SPF-25؛ مناسب برای یکدست‌کردن رنگ پوست و تثبیت آرایش.',
      ingredients: 'Talc, Calamine, Processed Starch, Zinc Oxide, Kaolin, Titanium oxide, Aloe Vera Extract, Pigments, Vitamin E, Methyl Paraben.',
      usage: 'با استفاده از اسفنج مخصوص، مقدار مناسبی از پودر را روی پوست صورت بزنید. برای نتیجه بهتر، از پرایمر قبل از پنکیک استفاده کنید.',
      specifications: [
        { key: 'برند', value: 'بیز (BIZ)' },
        { key: 'وزن', value: '۱۴ گرم' },
        { key: 'کشور سازنده', value: 'ایران' },
        { key: 'ضد آفتاب', value: 'SPF-25' },
        { key: 'تاریخ تولید', value: '۰۶ آگوست ۲۰۲۵' }
      ]
    }
  }
];

async function main() {
  console.log('Updating 4 products with verified data...\n');
  for (const { slug, data } of updates) {
    const existing = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1);
    if (existing.length === 0) {
      console.log('  skip (not found): ' + slug);
      continue;
    }
    await db.update(products).set(data).where(eq(products.slug, slug));
    console.log('  updated: ' + slug);
  }
  console.log('\nDone.');
  process.exit(0);
}

main().catch((err) => {
  console.error('FAILED:', err);
  process.exit(1);
});


==========================================================================================
FILE [229/255] src\db\seed.ts
SIZE 1090 bytes
==========================================================================================
import 'dotenv/config';
import { db } from '../lib/db';
import { products } from './schema';

async function seed() {
  console.log('🌱 در حال تزریق محصولات به دیتابیس...');
  await db.insert(products).values([
    { name: 'تونر ویتابلا', slug: 'toner-vitabla', status: 'published', price: 0, stock: 10, description: 'آبرسان و شفاف‌کننده پوست', isFeatured: true },
    { name: 'شامپو مورینگا', slug: 'shampoo-moringa', status: 'published', price: 0, stock: 5, description: 'تقویت‌کننده و ضخیم‌کننده مو', isFeatured: true },
    { name: 'صابون لایه‌بردار', slug: 'exfoliating-soap', status: 'published', price: 0, stock: 0, description: 'پاک‌سازی عمیق پوست' },
    { name: 'پنکیک ۱۰۱', slug: 'pancake-101', status: 'published', price: 0, stock: 2, description: 'پوشش طبیعی و ماندگار' },
  ]);
  console.log('✅ محصولات با موفقیت به دیتابیس اضافه شدند!');
  process.exit(0);
}
seed();



==========================================================================================
FILE [230/255] src\db\test-ai.ts
SIZE 1148 bytes
==========================================================================================
import { generateArticleCover } from '../lib/ai-image';

async function testAI() {
  console.log('🧪 شروع تست تولید عکس با Cloudflare...');
  console.log('🔑 Account ID:', process.env.CLOUDFLARE_ACCOUNT_ID ? 'موجود ✅' : 'ناموجود ❌');
  console.log('🔑 API Token:', process.env.CLOUDFLARE_API_TOKEN ? 'موجود ✅' : 'ناموجود ❌');
  
  if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_TOKEN) {
    console.error('❌ متغیرهای محیطی تنظیم نشده‌اند.');
    process.exit(1);
  }

  try {
    const imageUrl = await generateArticleCover('تست تولید عکس', 'education');
    console.log('');
    console.log('🎉🎉🎉 موفقیت! 🎉🎉🎉');
    console.log('📸 لینک عکس:', imageUrl);
    console.log('حالا می‌توانید این لینک را در مرورگر باز کنید تا عکس را ببینید.');
  } catch (error: any) {
    console.error('');
    console.error('❌❌❌ خطا! ❌❌❌');
    console.error('پیام:', error.message);
  }
  process.exit(0);
}
testAI();


==========================================================================================
FILE [231/255] src\db\test-models.ts
SIZE 3140 bytes
==========================================================================================
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

if (!ACCOUNT_ID || !API_TOKEN) {
  console.error('❌ متغیرهای محیطی تنظیم نشده‌اند.');
  process.exit(1);
}

console.log('🔑 Account ID:', ACCOUNT_ID);
console.log('🔑 Token length:', API_TOKEN.length);
console.log('');

// لیست مدل‌ها و مسیرهای مختلف برای تست
const modelsToTest = [
  { name: 'FLUX Schnell (با عدد 1)', path: '@cf/black-forest-labs/flux-1-schnell' },
  { name: 'FLUX Schnell (بدون عدد 1)', path: '@cf/black-forest-labs/flux-schnell' },
  { name: 'Stable Diffusion XL', path: '@cf/stabilityai/stable-diffusion-xl-base-1.0' },
  { name: 'Stable Diffusion XL Lightning', path: '@cf/bytedance/stable-diffusion-xl-lightning' },
  { name: 'FLUX.1 Dev', path: '@cf/black-forest-labs/flux-1-dev' },
];

async function testAll() {
  for (const model of modelsToTest) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/${model.path}`;
    console.log(`🧪 تست: ${model.name}`);
    console.log(`   URL: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'A minimalist editorial magazine cover, soft pink and cream tones, elegant, no text, 8k',
        }),
      });
      
      console.log(`   📡 وضعیت: ${response.status}`);
      
      if (response.ok) {
        console.log(`   ✅✅✅ این مدل کار می‌کند! ✅✅✅`);
        const contentType = response.headers.get('content-type');
        console.log(`   📋 نوع پاسخ: ${contentType}`);
        
        if (contentType?.includes('application/json')) {
          const data = await response.json();
          console.log(`   📦 success: ${data.success}`);
          if (data.result?.image) {
            console.log(`   🖼️ تصویر Base64 دریافت شد (طول: ${data.result.image.length})`);
          }
        } else {
          const buffer = await response.arrayBuffer();
          console.log(`   🖼️ تصویر مستقیم دریافت شد (${buffer.byteLength} بایت)`);
        }
        return model; // اولین مدل موفق را برگردان
      } else {
        const errText = await response.text();
        console.log(`   ❌ خطا: ${errText.substring(0, 200)}`);
      }
    } catch (error: any) {
      console.log(`   ❌ خطای شبکه: ${error.message}`);
    }
    console.log('');
  }
  
  console.error('❌ هیچ مدلی کار نکرد. لطفاً مستندات Cloudflare را بررسی کنید.');
  return null;
}

testAll().then((result) => {
  if (result) {
    console.log('');
    console.log('🎯 مدل پیشنهادی:');
    console.log(`   نام: ${result.name}`);
    console.log(`   مسیر: ${result.path}`);
  }
  process.exit(0);
});


==========================================================================================
FILE [232/255] src\hooks\useAdminNotifications.ts
SIZE 3083 bytes
==========================================================================================
import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

export function useAdminNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [hasNew, setHasNew] = useState(false);
  const initialLoad = useRef(true);

  // 1. Safe check for browser environment
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    // 2. Guard against server-side execution
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('مرورگر شما از اعلان‌ها پشتیبانی نمی‌کند');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === 'granted') {
        toast.success('اعلان‌ها با موفقیت فعال شدند');
        new Notification('فاطمه بیوتی لند', {
          body: 'سیستم اعلان‌ها با موفقیت فعال شد.',
          icon: '/logo.png',
        });
      } else if (perm === 'denied') {
        toast.error('شما دسترسی به اعلان‌ها را رد کردید.');
      }
    } catch (error) {
      toast.error('خطا در درخواست دسترسی');
    }
  };

  // 3. Safe polling
  useEffect(() => {
    if (permission !== 'granted') return;
    if (typeof window === 'undefined') return; // Extra guard

    const checkNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notifications');
        if (!res.ok) return;
        
        const data = await res.json();
        if (!data.success) return;

        const lastOrders = Number(localStorage.getItem('lastPendingOrders') || data.orders);
        const lastReviews = Number(localStorage.getItem('lastPendingReviews') || data.reviews);

        if (data.orders > lastOrders && !initialLoad.current) {
          new Notification('سفارش جدید ثبت شد', {
            body: `شما ${data.orders - lastOrders} سفارش جدید دارید.`,
            icon: '/logo.png',
          });
          setHasNew(true);
        }

        if (data.reviews > lastReviews && !initialLoad.current) {
          new Notification('نظر جدید در انتظار تایید', {
            body: `شما ${data.reviews - lastReviews} نظر جدید دارید.`,
            icon: '/logo.png',
          });
          setHasNew(true);
        }

        localStorage.setItem('lastPendingOrders', data.orders);
        localStorage.setItem('lastPendingReviews', data.reviews);
        initialLoad.current = false;
      } catch (error) {
        // Silent fail
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, [permission]);

  return { permission, requestPermission, hasNew };
}


==========================================================================================
FILE [233/255] src\lib\ai-image.ts
SIZE 3817 bytes
==========================================================================================
import { put } from '@vercel/blob';

const CLOUDFLARE_API_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`;

// Prompts ساده‌تر و ایمن‌تر — کلمات NSFW-trigger حذف شدند
const promptTemplates: Record<string, string> = {
  education: 'A minimalist magazine illustration, soft cream and dusty pink palette, gentle organic shapes, elegant composition, plain white background, no text, no people, no faces, 4:5 aspect ratio, 8k',
  'buying-guide': 'A clean magazine illustration, warm beige and muted sage palette, minimalist geometric composition, gentle abstract lines, plain background, no text, no people, no faces, 4:5 aspect ratio, 8k',
  skincare: 'An elegant beauty magazine illustration, soft rose and cream gradient, gentle abstract shapes, minimalist aesthetic, no text, no people, no faces, 4:5 aspect ratio, 8k',
  haircare: 'A premium magazine illustration, warm gold and cream tones, gentle flowing abstract lines, minimalist composition, no text, no people, no faces, 4:5 aspect ratio, 8k',
  makeup: 'A high-fashion magazine illustration, soft pink and beige tones, elegant abstract shapes, minimalist composition, no text, no people, no faces, 4:5 aspect ratio, 8k',
};

async function attemptGenerate(prompt: string): Promise<Buffer> {
  const response = await fetch(CLOUDFLARE_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, steps: 4 }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const err: any = new Error(`CF ${response.status}: ${errText.substring(0, 200)}`);
    err.status = response.status;
    err.nsfw = errText.includes('NSFW') || errText.includes('8007');
    throw err;
  }

  const ct = response.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const data = await response.json();
    if (!data.success || !data.result?.image) {
      throw new Error('Invalid CF response');
    }
    return Buffer.from(data.result.image, 'base64');
  }
  const ab = await response.arrayBuffer();
  return Buffer.from(ab);
}

export async function generateArticleCover(title: string, category: string): Promise<string> {
  const basePrompt = promptTemplates[category] || promptTemplates.education;
  
  // سه نسخه مختلف — اگر اولی NSFW داد، دومی و سومی ساده‌ترند
  const variations = [
    basePrompt,
    'Minimalist soft pastel abstract art, elegant geometric shapes, plain white background, no text, no people, no faces, 4:5 aspect ratio, 8k',
    'Clean modern magazine design, muted cream and blush colors, abstract pattern, no text, no people, no faces, 4:5 aspect ratio, 8k',
  ];

  let lastError: any = null;
  for (let i = 0; i < variations.length; i++) {
    try {
      console.log(`  🎨 تلاش ${i + 1}/${variations.length} برای: ${title}`);
      const buf = await attemptGenerate(variations[i]);
      
      const filename = `ai-cover-${Date.now()}.jpg`;
      const blob = await put(filename, buf, {
        access: 'public',
        contentType: 'image/jpeg',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      
      console.log(`  ✅ آپلود شد: ${blob.url}`);
      return blob.url;
    } catch (e: any) {
      lastError = e;
      if (e.nsfw) {
        console.log(`  ⚠️ NSFW — تلاش دوباره با prompt ساده‌تر`);
        await new Promise(r => setTimeout(r, 800));
        continue;
      }
      throw e;
    }
  }
  
  throw lastError || new Error('All attempts failed');
}


==========================================================================================
FILE [234/255] src\lib\ai-text.ts
SIZE 11456 bytes
==========================================================================================
// سرویس اصلی: LLM7.io
const LLM7_ENDPOINT = 'https://api.llm7.io/v1/chat/completions';
const LLM7_MODEL = 'default';
const LLM7_TOKEN = process.env.LLM7_API_KEY || 'unused';

// سرویس پشتیبان: Cloudflare
const CF_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-70b-instruct-fp8-fast`;
const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';

interface ChatOpts {
  temperature?: number;
  maxTokens?: number;
  retries?: number;
}

function cleanPersianText(text: string): string {
  return text.replace(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af\u0100-\u024f\u1ea0-\u1ef9]/g, '');
}

async function makeLLM7Request(system: string, user: string, opts: ChatOpts): Promise<string> {
  const { temperature = 0.7, maxTokens = 2000 } = opts;
  const response = await fetch(LLM7_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LLM7_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: LLM7_MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) throw new Error(`LLM7 ${response.status}`);
  const data: any = await response.json();
  if (!data.choices?.[0]?.message?.content) throw new Error('Invalid LLM7 response');
  return data.choices[0].message.content;
}

async function makeCFRequest(system: string, user: string, opts: ChatOpts): Promise<string> {
  const { temperature = 0.7, maxTokens = 2000 } = opts;
  const response = await fetch(CF_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CF_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) throw new Error(`Cloudflare ${response.status}`);
  const data: any = await response.json();
  const resp = data.result?.response ?? data.result ?? data.response;
  if (!resp) throw new Error('Invalid CF response');
  return typeof resp === 'string' ? resp : JSON.stringify(resp);
}

async function aiChat(system: string, user: string, opts: ChatOpts = {}): Promise<string> {
  const { retries = 1 } = opts;

  // تلاش اول: LLM7.io
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await makeLLM7Request(system, user, opts);
    } catch (e: any) {
      console.warn(`  [LLM7] تلاش ${attempt + 1} ناموفق: ${String(e.message).substring(0, 80)}`);
      if (attempt < retries) await new Promise(r => setTimeout(r, 1000));
    }
  }

  // تلاش دوم: Cloudflare
  console.warn(`  [هشدار] LLM7 وصل نشد. تلاش با Cloudflare...`);
  for (let attempt = 0; attempt <= 1; attempt++) {
    try {
      let text = await makeCFRequest(system, user, opts);
      return cleanPersianText(text);
    } catch (e: any) {
      console.warn(`  [Cloudflare] تلاش ${attempt + 1} ناموفق: ${String(e.message).substring(0, 80)}`);
      if (attempt < 1) await new Promise(r => setTimeout(r, 1500));
    }
  }

  throw new Error('اتصال به همه سرویس‌ها ناموفق بود.');
}

function extractJSON(raw: any): any {
  if (raw !== null && typeof raw === 'object') return raw;
  if (typeof raw !== 'string') throw new Error('Expected string/object');
  try { return JSON.parse(raw.trim()); } catch {}
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) { try { return JSON.parse(fenced[1].trim()); } catch {} }
  const start = raw.search(/[{[]/);
  if (start === -1) throw new Error('No JSON in response');
  const openChar = raw[start];
  const closeChar = openChar === '{' ? '}' : ']';
  let depth = 0, inString = false, escape = false;
  for (let i = start; i < raw.length; i++) {
    const c = raw[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === openChar) depth++;
    if (c === closeChar) {
      depth--;
      if (depth === 0) {
        try { return JSON.parse(raw.substring(start, i + 1)); } 
        catch (e: any) { throw new Error(`JSON parse failed: ${e.message}`); }
      }
    }
  }
  throw new Error('Unbalanced JSON');
}

async function aiJSON<T>(system: string, user: string, opts: ChatOpts = {}): Promise<T> {
  const raw = await aiChat(
    system + '\n\nCRITICAL: Respond with VALID JSON ONLY. No markdown, no code blocks, no explanations.',
    user,
    { ...opts, temperature: opts.temperature ?? 0.4 }
  );
  return extractJSON(raw);
}

const STYLE_GUIDE = `You are a senior Persian content writer for "فاطمه بیوتی لند" (Fatemeh Beauty Land), a premium Iranian beauty shop.

CRITICAL LANGUAGE RULES:
- WRITE ONLY IN PERSIAN (FARSI). Absolutely NO English, Spanish, Vietnamese, Turkish, Chinese, or any other language mixed in.
- Do NOT use machine-translated or formal government style. Write like a popular Persian lifestyle blogger.
- Use: "می‌شود", "دقت کنید", "احتمالاً", "در واقع", "باید بدانید", "ممکن است".
- Avoid: "می‌باشد", "لذا", "علی‌رغم", "در ادامه مطلب", "قبل از هر چیز".

QUALITY RULES:
- Provide specific facts, numbers, and actionable advice. No vague claims.
- Never make medical claims without qualification.
- Paragraphs should be 3-5 sentences, varied in length.

FORMAT — ONLY these HTML tags:
<p>, <h2>, <h3>, <ul>, <ol>, <li>, <strong>, <em>`;

export interface ArticleMetadata {
  title: string; slug: string; excerpt: string; seoTitle: string; seoDescription: string; keywords: string[]; sections: string[];
}
export interface FAQ { q: string; a: string; }
const CATEGORY_LABELS: Record<string, string> = {
  education: 'آموزش', 'buying-guide': 'راهنمای خرید', skincare: 'مراقبت پوست', haircare: 'مراقبت مو', makeup: 'آرایشی',
};

export async function generateMetadata(topic: string, category: string, targetKeywords: string[] = []): Promise<ArticleMetadata> {
  const catLabel = CATEGORY_LABELS[category] || category;
  const system = `${STYLE_GUIDE}\n\nYour job: create an SEO-optimized article outline. Return ONLY valid JSON.`;
  const keywordsHint = targetKeywords.length > 0 ? targetKeywords.join('، ') : '(خودت ۴-۶ کلمه کلیدی مرتبط پیشنهاد بده)';
  const user = `موضوع: "${topic}"\nدسته‌بندی: ${catLabel}\nکلمات کلیدی: ${keywordsHint}\n\nJSON:\n{\n  "title": "...",\n  "slug": "...",\n  "excerpt": "...",\n  "seoTitle": "...",\n  "seoDescription": "...",\n  "keywords": ["..."],\n  "sections": ["...", "...", "...", "...", "...", "..."]\n}`;
  const meta = await aiJSON<ArticleMetadata>(system, user, { temperature: 0.4, maxTokens: 1200 });
  
  // فیلتر ایمنی: پاک کردن هرگونه تگ HTML از عنوان بخش‌ها
  if (meta.sections && Array.isArray(meta.sections)) {
    meta.sections = meta.sections.map(s => s.replace(/<[^>]+>/g, '').trim());
  }
  return meta;
}

export async function writeIntro(title: string, category: string, excerpt: string): Promise<string> {
  const catLabel = CATEGORY_LABELS[category] || category;
  const system = `${STYLE_GUIDE}\n\nYour job: write the OPENING of a Persian article. 2-3 paragraphs. Start with a HOOK. NEVER start with "در این مقاله". Return ONLY <p>...</p> tags.`;
  const user = `عنوان: "${title}"\nدسته: ${catLabel}\nخلاصه: ${excerpt}\n\nمقدمه را بنویس.`;
  return aiChat(system, user, { temperature: 0.8, maxTokens: 500 });
}

export async function writeSection(title: string, sectionTitle: string, previousContent: string, category: string, sectionIndex: number, totalSections: number): Promise<string> {
  const catLabel = CATEGORY_LABELS[category] || category;
  const system = `${STYLE_GUIDE}\n\nYour job: write ONE section. 200-350 words. Use <h3>, <ul>, <strong>. DO NOT output the section title in <h2> tags. Return ONLY HTML.`;
  const context = previousContent ? `محتوای قبلی (تکرار نکن):\n${previousContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 300)}...` : '';
  const user = `مقاله: "${title}"\nدسته: ${catLabel}\nبخش ${sectionIndex}/${totalSections}: "${sectionTitle}"\n\n${context}\n\nمحتوای این بخش را بنویس.`;
  
  let text = await aiChat(system, user, { temperature: 0.7, maxTokens: 1200 });
  text = text.replace(/<h2>.*?<\/h2>/gi, '');
  return text.trim();
}

export async function writeConclusion(title: string, category: string, fullContent: string): Promise<string> {
  const catLabel = CATEGORY_LABELS[category] || category;
  const system = `${STYLE_GUIDE}\n\nYour job: write the conclusion. 2-3 paragraphs. Return ONLY <p>...</p> tags.`;
  const user = `مقاله: "${title}"\nدسته: ${catLabel}\n\nخلاصه محتوا:\n${fullContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 500)}...\n\nنتیجه‌گیری را بنویس.`;
  return aiChat(system, user, { temperature: 0.6, maxTokens: 500 });
}

export async function generateFAQ(title: string, content: string): Promise<FAQ[]> {
  const system = `${STYLE_GUIDE}\n\nYour job: generate 3-5 FAQ questions. Return valid JSON.`;
  const user = `مقاله: "${title}"\n\nمحتوا:\n${content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 1500)}\n\nJSON:\n{\n  "faqs": [\n    { "q": "...", "a": "..." }\n  ]\n}`;
  const result = await aiJSON<{ faqs: FAQ[] }>(system, user, { temperature: 0.5, maxTokens: 1000 });
  return result.faqs || [];
}

export function assembleArticle(intro: string, sections: { title: string; content: string }[], conclusion: string, faqs: FAQ[]): string {
  let html = intro.trim();
  for (const sec of sections) html += `\n\n<h2>${sec.title}</h2>\n${sec.content.trim()}`;
  html += `\n\n<h2>نتیجه‌گیری</h2>\n${conclusion.trim()}`;
  if (faqs.length > 0) {
    html += `\n\n<h2>سوالات متداول</h2>`;
    for (const f of faqs) html += `\n<h3>${f.q}</h3>\n<p>${f.a}</p>`;
  }
  return html;
}
export async function generateFullContent(title: string, category: string, excerpt: string): Promise<string> {
  const catLabel = CATEGORY_LABELS[category] || category;
  const system = `${STYLE_GUIDE}

Your job: write a COMPLETE 2000-word article in Persian.
RULES:
- Start with an engaging intro (no heading).
- Include 6-8 main sections using <h2> tags.
- Inside sections, use <h3>, <ul>, <li>, and <strong>.
- End with a conclusion section under <h2>نتیجه‌گیری</h2>.
- DO NOT repeat the article title in the body.
- DO NOT use markdown, code blocks, or <html> tags. Return ONLY the HTML content.
CRITICAL: Return ONLY valid HTML.`;

  const user = `عنوان: "${title}"
دسته: ${catLabel}
خلاصه: ${excerpt}

محتوای کامل مقاله را بنویس.`;
  
  return aiChat(system, user, { temperature: 0.7, maxTokens: 4000 });
}


==========================================================================================
FILE [235/255] src\lib\auth.ts
SIZE 649 bytes
==========================================================================================
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const secretValue = process.env.JWT_SECRET;
if (!secretValue) throw new Error('FATAL: JWT_SECRET is missing in environment variables.');
const secret = new TextEncoder().encode(secretValue);

export async function verifyAdmin() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) throw new Error('UNAUTHORIZED');
  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== 'super_admin' && payload.role !== 'admin') throw new Error('FORBIDDEN');
    return payload;
  } catch {
    throw new Error('UNAUTHORIZED');
  }
}


==========================================================================================
FILE [236/255] src\lib\cache-tags.ts
SIZE 78 bytes
==========================================================================================
export const CACHE_TAGS = {
  PRODUCTS_LIST: 'products-list',
} as const;


==========================================================================================
FILE [237/255] src\lib\currency.ts
SIZE 536 bytes
==========================================================================================
export function tomanToRial(toman: number): number {
  return Math.round(toman * 10);
}

export function rialToToman(rial: number): number {
  return Math.round(rial / 10);
}

export function formatToman(rial: number): string {
  if (!rial || rial === 0) return 'به زودی';
  return rialToToman(rial).toLocaleString('fa-IR') + ' تومان';
}

export function formatTomanPlain(rial: number): string {
  if (!rial || rial === 0) return 'تعیین نشده';
  return rialToToman(rial).toLocaleString('fa-IR');
}


==========================================================================================
FILE [238/255] src\lib\customer-auth.ts
SIZE 1734 bytes
==========================================================================================
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const CUSTOMER_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || process.env.JWT_SECRET
);

const COOKIE_NAME = 'customer_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export interface CustomerPayload {
  id: string;
  email: string;
  name: string;
}

export async function createCustomerToken(payload: CustomerPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(CUSTOMER_SECRET);
}

export async function setCustomerCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearCustomerCookie() {
  (await cookies()).set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function getCurrentCustomer(): Promise<CustomerPayload | null> {
  try {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, CUSTOMER_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function requireCustomer(): Promise<CustomerPayload> {
  const customer = await getCurrentCustomer();
  if (!customer) throw new Error('UNAUTHORIZED');
  return customer;
}


==========================================================================================
FILE [239/255] src\lib\db.ts
SIZE 543 bytes
==========================================================================================
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

// Vercel Serverless-safe connection settings:
// - prepare: false (required for PgBouncer / poolers)
// - max: 1 (each serverless invocation gets its own connection)
// - idle_timeout / connect_timeout: prevent hung connections
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });


==========================================================================================
FILE [240/255] src\lib\format.ts
SIZE 1505 bytes
==========================================================================================
export function formatNumberInput(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  const str = value.toString().replace(/,/g, '');
  const num = Number(str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US');
}

export function parseNumberInput(value: string): number | '' {
  if (!value || value.trim() === '') return '';
  const str = value.replace(/,/g, '');
  const num = Number(str.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString()));
  return isNaN(num) ? '' : num;
}

export function formatPersianDate(date: Date | string | number | null | undefined): string {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date));
  } catch { return ''; }
}

export function formatPersianDateTime(date: Date | string | number | null | undefined): string {
  if (!date) return '';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      timeZone: 'Asia/Tehran',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  } catch { return ''; }
}


==========================================================================================
FILE [241/255] src\lib\journal.ts
SIZE 18087 bytes
==========================================================================================
export type ArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'list'; ordered?: boolean; items: string[] };

export type JournalArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  readTime: string;
  publishedAt: string;
  author: string;
  featured?: boolean;
  editorsPick?: boolean;
  content: ArticleBlock[];
};

export const journalCategories = [
  { slug: 'all', label: 'همه' },
  { slug: 'education', label: 'آموزش' },
  { slug: 'buying-guide', label: 'راهنمای خرید' },
  { slug: 'skincare', label: 'مراقبت پوست' },
  { slug: 'haircare', label: 'مراقبت مو' },
  { slug: 'makeup', label: 'آرایشی' },
];

export const journalArticles: JournalArticle[] = [
  {
    slug: 'skin-types-guide',
    title: 'انواع پوست و انتخاب محصول مناسب',
    excerpt: 'شناخت نوع پوست، اولین قدم برای انتخاب محصولات درست است. در این راهنما با انواع پوست و نیازهای هرکدام آشنا می‌شوید.',
    category: 'مراقبت پوست',
    categorySlug: 'skincare',
    readTime: '۸ دقیقه',
    publishedAt: '۱۵ آذر ۱۴۰۳',
    author: 'تیم فاطمه بیوتی لند',
    featured: true,
    content: [
      { type: 'paragraph', text: 'پوست هر فرد ساختار و نیاز منحصربه‌فردی دارد. شناخت نوع پوست، پایه و اساس انتخاب محصولات مراقبتی است. در این راهنما با چهار دسته اصلی پوست و نیازهای هرکدام آشنا می‌شوید.' },
      { type: 'heading', level: 2, text: 'پوست خشک' },
      { type: 'paragraph', text: 'پوست خشک معمولاً حس کشیدگی، زبری و گاهی پوسته‌پوسته شدن دارد. این نوع پوست به دلیل کمبود چربی طبیعی، بیشتر در معرض از دست دادن رطوبت است.' },
      { type: 'list', items: ['استفاده از پاک‌کننده‌های ملایم بدون سولفات', 'آبرسانی با کرم‌های حاوی سرامید و هیالورونیک اسید', 'پرهیز از محصولات حاوی الکل خشک‌کننده', 'استفاده از مرطوب‌کننده در محیط‌های خشک'] },
      { type: 'heading', level: 2, text: 'پوست چرب' },
      { type: 'paragraph', text: 'پوست چرب به دلیل تولید بیش از حد سبوم، درخشندگی و منافذ بازتری دارد و ممکن است مستعد جوش باشد. اما این نوع پوست در بلندمدت کمتر دچار چین‌وچروک می‌شود.' },
      { type: 'list', items: ['پاک‌سازی دوبار در روز با ژل‌های ملایم', 'استفاده از محصولات غیرکومدوژنیک', 'پرهیز از محصولات سنگین و چرب', 'استفاده از مرطوب‌کننده‌های سبک و ژل‌مانند'] },
      { type: 'quote', text: 'پوست چرب به معنی نیازی نداشتن به مرطوب‌کننده نیست. حتی پوست چرب هم به آبرسانی نیاز دارد.' },
      { type: 'heading', level: 2, text: 'پوست مختلط' },
      { type: 'paragraph', text: 'پوست مختلط ترکیبی از خشکی و چربی در نواحی مختلف است؛ معمولاً ناحیه T (پیشانی، بینی و چانه) چرب‌تر و گونه‌ها خشک‌تر هستند. این نوع پوست شایع‌ترین نوع پوست است.' },
      { type: 'list', items: ['استفاده از محصولات چندکاره', 'مرطوب‌کننده مخصوص پوست مختلط', 'استفاده موضعی از محصولات کنترل‌کننده چربی', 'پرهیز از محصولات سنگین روی تمام صورت'] },
      { type: 'heading', level: 2, text: 'پوست حساس' },
      { type: 'paragraph', text: 'پوست حساس به سرعت به عوامل محیطی، محصولات جدید یا تغییرات دما واکنش نشان می‌دهد. قرمزی، سوزش و خارش از علائم رایج آن است.' },
      { type: 'list', items: ['انتخاب محصولات بدون عطر و رنگ', 'تست حساسیت پیش از استفاده کامل', 'استفاده از محصولات با ترکیبات ساده', 'پرهیز از لایه‌برداری شدید و مکرر'] },
      { type: 'heading', level: 2, text: 'جمع‌بندی' },
      { type: 'paragraph', text: 'تشخیص دقیق نوع پوست معمولاً نیازمند بررسی توسط متخصص پوست است. اما شناخت کلی نوع پوست به شما کمک می‌کند انتخاب آگاهانه‌تری داشته باشید و از خرید محصولات نامناسب بپرهیزید.' },
    ],
  },
  {
    slug: 'read-skincare-label',
    title: 'چگونه برچسب محصولات مراقبت پوست را بخوانیم؟',
    excerpt: 'برچسب هر محصول، کلیدی برای شناخت ترکیبات و کاربرد آن است. با اصول خواندن برچسب آشنا شوید.',
    category: 'آموزش',
    categorySlug: 'education',
    readTime: '۶ دقیقه',
    publishedAt: '۸ آذر ۱۴۰۳',
    author: 'تیم فاطمه بیوتی لند',
    editorsPick: true,
    content: [
      { type: 'paragraph', text: 'برچسب محصولات مراقبتی، منبع اصلی اطلاعات درباره ترکیبات، کاربرد و شرایط نگهداری محصول است. اما خواندن این برچسب‌ها گاهی پیچیده به نظر می‌رسد.' },
      { type: 'heading', level: 2, text: 'ترتیب ترکیبات چه معنایی دارد؟' },
      { type: 'paragraph', text: 'ترکیبات روی برچسب بر اساس مقدارشان مرتب می‌شوند؛ از بیشترین به کمترین. یعنی ترکیب اول بیشترین درصد و ترکیب آخر کمترین درصد را دارد. این قاعده به شما کمک می‌کند تشخیص دهید یک ترکیب مؤثر واقعاً در محصول وجود دارد یا فقط برای نام‌گذاری استفاده شده است.' },
      { type: 'quote', text: 'اگر یک ترکیب مؤثر در انتهای لیست باشد، احتمالاً مقدار بسیار کمی از آن در محصول وجود دارد.' },
      { type: 'heading', level: 2, text: 'بخش‌های مهم برچسب' },
      { type: 'list', items: ['نام تجاری و نام کامل محصول', 'فهرست کامل ترکیبات', 'حجم یا وزن خالص', 'کاربرد و روش استفاده', 'هشدارها و محدودیت‌ها', 'تاریخ تولید و انقضا', 'کشور سازنده'] },
      { type: 'heading', level: 2, text: 'به چه نکاتی توجه کنیم؟' },
      { type: 'paragraph', text: 'اولین قدم، بررسی وجود ترکیباتی است که به آن‌ها حساسیت دارید. اگر پوست حساسی دارید، محصولات بدون عطر و رنگ را ترجیح دهید. همچنین به تاریخ انقضا و شرایط نگهداری توجه کنید؛ برخی محصولات پس از باز شدن باید در یخچال نگهداری شوند.' },
      { type: 'list', ordered: true, items: ['بررسی ترکیبات برای حساسیت‌های شناخته‌شده', 'توجه به ترتیب ترکیبات مؤثر', 'بررسی تاریخ تولید و انقضا', 'توجه به شرایط نگهداری'] },
      { type: 'heading', level: 2, text: 'هشدارها را جدی بگیرید' },
      { type: 'paragraph', text: 'بخش هشدارها معمولاً شامل نکات مهمی درباره استفاده صحیح، پرهیز از تماس با چشم، یا توصیه به تست حساسیت است. این بخش را هرگز نادیده نگیرید.' },
    ],
  },
  {
    slug: 'before-buying-toner',
    title: 'پیش از خرید تونر به چه نکاتی توجه کنیم؟',
    excerpt: 'تونر یکی از محصولات پرکاربرد در روتین پوستی است. اما انتخاب تونر مناسب نیازمند بررسی چند نکته است.',
    category: 'راهنمای خرید',
    categorySlug: 'buying-guide',
    readTime: '۵ دقیقه',
    publishedAt: '۱ آذر ۱۴۰۳',
    author: 'تیم فاطمه بیوتی لند',
    editorsPick: true,
    content: [
      { type: 'paragraph', text: 'تونر معمولاً به عنوان دومین مرحله روتین پوستی، پس از پاک‌کننده استفاده می‌شود. اما تونرها با کاربردهای مختلف، انتخاب را پیچیده می‌کنند.' },
      { type: 'heading', level: 2, text: 'کاربرد تونر چیست؟' },
      { type: 'paragraph', text: 'تونرها معمولاً سه کاربرد اصلی دارند: آبرسانی، تعادل pH پوست پس از پاک‌سازی، و آماده‌سازی پوست برای جذب محصولات بعدی. برخی تونرها نیز حاوی ترکیبات لایه‌بردار یا کنترل‌کننده چربی هستند.' },
      { type: 'list', items: ['تونرهای آبرسان: حاوی هیالورونیک اسید و گلیسیرین', 'تونرهای متعادل‌کننده: حاوی ترکیبات pH-balancing', 'تونرهای لایه‌بردار: حاوی AHA یا BHA', 'تونرهای کنترل چربی: حاوی نیاسینامید یا روی'] },
      { type: 'heading', level: 2, text: 'چه چیزی را بررسی کنیم؟' },
      { type: 'paragraph', text: 'پیش از خرید تونر، به ترکیبات، نوع پوست و کاربرد مورد نظر توجه کنید. اگر پوست حساسی دارید، از تونرهای حاوی الکل بالا و عطر پرهیز کنید. اگر پوست چرب دارید، تونرهای حاوی نیاسینامید می‌توانند مفید باشند.' },
      { type: 'quote', text: 'تونر خوب، تونری است که نیاز پوست شما را برطرف کند، نه چیزی که فقط نامش جذاب باشد.' },
      { type: 'heading', level: 2, text: 'روش استفاده صحیح' },
      { type: 'paragraph', text: 'تونر را می‌توانید با پنبه روی صورت بزنید یا در دست کف کرده و روی پوست بمالید. روش دوم برای پوست‌های حساس gentler است. پس از جذب، محصولات بعدی مثل سرم و مرطوب‌کننده را استفاده کنید.' },
    ],
  },
  {
    slug: 'how-to-layer-skincare',
    title: 'ترتیب استفاده از محصولات مراقبت پوست',
    excerpt: 'ترتیب درست استفاده از محصولات، تأثیر آن‌ها را چند برابر می‌کند. با اصول لایه‌بندی آشنا شوید.',
    category: 'آموزش',
    categorySlug: 'education',
    readTime: '۷ دقیقه',
    publishedAt: '۲۴ آبان ۱۴۰۳',
    author: 'تیم فاطمه بیوتی لند',
    content: [
      { type: 'paragraph', text: 'استفاده از محصولات مراقبتی به ترتیب درست، یکی از مهم‌ترین اصول در روتین پوستی است. محصولاتی که سبک‌تر هستند اول و محصولات سنگین‌تر در انتها استفاده می‌شوند.' },
      { type: 'heading', level: 2, text: 'قاعده کلی' },
      { type: 'paragraph', text: 'قاعده طلایی این است: از سبک‌ترین به سنگین‌ترین. یعنی هر محصولی که بافت رقیق‌تری دارد، اول استفاده می‌شود تا جذب شود. محصولات سنگین‌تر در انتها استفاده می‌شوند تا رطوبت را قفل کنند.' },
      { type: 'list', ordered: true, items: ['پاک‌کننده', 'تونر', 'سرم', 'کرم دور چشم', 'مرطوب‌کننده', 'روغن یا محصولات سنگین', 'ضد آفتاب (صبح‌ها)'] },
      { type: 'heading', level: 2, text: 'نکات مهم' },
      { type: 'paragraph', text: 'بین استفاده از هر محصول، چند ثانیه صبر کنید تا جذب شود. اگر از محصولات لایه‌بردار مثل AHA یا BHA استفاده می‌کنید، آن‌ها را در مرحله سرم استفاده کنید و از ترکیب با رتینول پرهیز کنید.' },
      { type: 'quote', text: 'لایه‌بندی درست، مهم‌تر از استفاده از محصولات متعدد است.' },
      { type: 'heading', level: 2, text: 'اشتباهات رایج' },
      { type: 'list', items: ['استفاده از محصولات سنگین قبل از سبک', 'ترکیب همزمان محصولات ناسازگار', 'استفاده از تعداد زیاد محصولات بدون نیاز واقعی', 'نادیده گرفتن ضد آفتاب در روتین صبح'] },
    ],
  },
  {
    slug: 'haircare-basics',
    title: 'اصول مراقبت از مو در روتین روزانه',
    excerpt: 'مراقبت از مو فراتر از شستن آن است. با اصول ساده اما مؤثر مراقبت از مو آشنا شوید.',
    category: 'مراقبت مو',
    categorySlug: 'haircare',
    readTime: '۶ دقیقه',
    publishedAt: '۱۷ آبان ۱۴۰۳',
    author: 'تیم فاطمه بیوتی لند',
    content: [
      { type: 'paragraph', text: 'مو مانند پوست، نیازمند مراقبت روزانه است. اما مراقبت از مو با چند اصل ساده می‌تواند تفاوت زیادی در سلامت و ظاهر آن ایجاد کند.' },
      { type: 'heading', level: 2, text: 'شستن صحیح' },
      { type: 'paragraph', text: 'شستن مو با آب گرم و شامپوی مناسب نوع مو، اولین قدم است. شامپو را فقط روی پوست سر بمالید و با آب ولرم بشویید. آب داغ باعث خشکی پوست سر و مو می‌شود.' },
      { type: 'heading', level: 2, text: 'نرم‌کننده، ضروری است' },
      { type: 'paragraph', text: 'استفاده از نرم‌کننده پس از هر شستن، مو را نرم‌تر و قابل مدیریت‌تر می‌کند. نرم‌کننده را فقط روی ساقه مو بمالید، نه روی پوست سر.' },
      { type: 'list', items: ['استفاده از ماسک مو هفتگی', 'پرهیز از شستن روزانه مو', 'استفاده از محصولات حرارتی محافظ', 'کوتاه کردن منظم موهای آسیب‌دیده'] },
      { type: 'quote', text: 'موی سالم، نتیجه مراقبت مداوم است، نه محصولات گران‌قیمت.' },
    ],
  },
  {
    slug: 'makeup-shelf-life',
    title: 'ماندگاری محصولات آرایشی و نشانه‌های فساد',
    excerpt: 'محصولات آرایشی تاریخ انقضا دارند. با نشانه‌های فساد و نحوه نگهداری درست آشنا شوید.',
    category: 'آرایشی',
    categorySlug: 'makeup',
    readTime: '۵ دقیقه',
    publishedAt: '۱۰ آبان ۱۴۰۳',
    author: 'تیم فاطمه بیوتی لند',
    content: [
      { type: 'paragraph', text: 'محصولات آرایشی مانند سایر محصولات، تاریخ انقضا دارند. اما این تاریخ برای محصولات باز شده و باز نشده متفاوت است.' },
      { type: 'heading', level: 2, text: 'ماندگاری معمول' },
      { type: 'list', items: ['ریمل: ۳ تا ۶ ماه پس از باز شدن', 'کرم پودر مایع: ۶ تا ۱۲ ماه', 'رژ لب: ۱۲ تا ۱۸ ماه', 'پنکیک پودری: ۱۸ تا ۲۴ ماه', 'خط چشم: ۶ ماه'] },
      { type: 'heading', level: 2, text: 'نشانه‌های فساد' },
      { type: 'paragraph', text: 'اگر محصولی بوی نامناسب، تغییر رنگ، جدا شدن فازها یا بافت غیرعادی دارد، از استفاده آن خودداری کنید. همچنین اگر روی پوست حساسیت ایجاد کرد، استفاده را متوقف کنید.' },
      { type: 'quote', text: 'نگهداری درست، عمر محصول را افزایش می‌دهد. محصولات آرایشی را در جای خشک و خنک نگه دارید.' },
      { type: 'heading', level: 2, text: 'نکات نگهداری' },
      { type: 'list', items: ['دور از نور مستقیم خورشید نگه دارید', 'قلم‌های آرایشی را به طور منظم تمیز کنید', 'از به اشتراک گذاشتن محصولات با دیگران پرهیز کنید', 'پس از هر استفاده درب را محکم ببندید'] },
    ],
  },
];

export function getArticleBySlug(slug: string): JournalArticle | undefined {
  return journalArticles.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): JournalArticle[] {
  if (categorySlug === 'all') return journalArticles;
  return journalArticles.filter((a) => a.categorySlug === categorySlug);
}

export function getRelatedArticles(currentSlug: string, limit = 3): JournalArticle[] {
  return journalArticles.filter((a) => a.slug !== currentSlug).slice(0, limit);
}


==========================================================================================
FILE [242/255] src\lib\product-content.ts
SIZE 889 bytes
==========================================================================================
const unverifiedSeedDescriptions = new Set([
  'آبرسان و شفاف‌کننده پوست',
  'تقویت‌کننده و ضخیم‌کننده مو',
  'پاک‌سازی عمیق پوست',
  'پوشش طبیعی و ماندگار',
]);

const knownNonProductAssets = [
  'home-services.webp',
  'lumen.png.png',
];

export function getPublicProductDescription(description: string | null | undefined): string | null {
  const value = description?.replace(/\s+/g, ' ').trim();
  if (!value) return null;
  if (unverifiedSeedDescriptions.has(value)) return null;
  return value;
}

export function getPublicProductImage(image: string | null | undefined): string | null {
  if (!image) return null;
  const normalized = image.toLowerCase().split('?')[0];
  if (knownNonProductAssets.some((asset) => normalized.includes(asset))) return null;
  return image;
}


==========================================================================================
FILE [243/255] src\lib\products.ts
SIZE 397 bytes
==========================================================================================
import { cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getCachedPublishedProducts() {
  'use cache';
  cacheTag('products');
  return await db
    .select()
    .from(products)
    .where(eq(products.status, 'published'))
    .orderBy(desc(products.createdAt));
}


==========================================================================================
FILE [244/255] src\lib\rate-limit.ts
SIZE 1765 bytes
==========================================================================================
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// If UPSTASH env vars are missing, fall back to a permissive in-memory limiter
// so local development and preview builds don't break.
const hasUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let redis: Redis | null = null;
if (hasUpstash) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

// Sliding window: 10 requests per 60 seconds
const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: false,
      prefix: '@fatemehlab/ratelimit',
    })
  : null;

// Simple in-memory fallback (per-process) when Upstash is not configured
const memoryBuckets = new Map<string, { count: number; resetAt: number }>();
const MEMORY_WINDOW_MS = 60_000;
const MEMORY_MAX = 10;

export async function rateLimit(key: string): Promise<{ success: boolean; remaining: number }> {
  if (limiter) {
    try {
      const { success, remaining } = await limiter.limit(key);
      return { success, remaining };
    } catch (e) {
      console.warn('[rate-limit] Upstash failed, falling back to memory', e);
    }
  }

  // Fallback path
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + MEMORY_WINDOW_MS });
    return { success: true, remaining: MEMORY_MAX - 1 };
  }
  if (bucket.count >= MEMORY_MAX) {
    return { success: false, remaining: 0 };
  }
  bucket.count++;
  return { success: true, remaining: MEMORY_MAX - bucket.count };
}


==========================================================================================
FILE [245/255] src\lib\security.ts
SIZE 2713 bytes
==========================================================================================
import { NextResponse } from 'next/server';

// OWASP CSRF Protection: Validate Origin header against an allowlist.
// This prevents cross-origin state-changing requests.
const ALLOWED_ORIGINS = [
  'https://fatemehbeautyland.ir',
  'https://www.fatemehbeautyland.ir',
  'https://fatemehlab.vercel.app',
  'https://fatemehlab.ir',
  'http://localhost:3000',
];

export function validateOrigin(request: Request): { valid: boolean; origin: string | null } {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  // If Origin header is present, validate it
  if (origin) {
    const isValid = ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed));
    return { valid: isValid, origin };
  }

  // Fallback to Referer if Origin is missing (some browsers omit Origin for GET/HEAD)
  if (referer) {
    const isValid = ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed));
    return { valid: isValid, origin: referer };
  }

  // If neither is present, fail closed (reject) for security
  return { valid: false, origin: null };
}

export function rejectCsrf(request: Request): NextResponse {
  const { origin } = validateOrigin(request);
  console.error(`[CSRF BLOCKED] Origin: ${origin} | URL: ${request.url}`);
  return NextResponse.json(
    { success: false, message: 'درخواست نامعتبر (CSRF)' },
    { status: 403 }
  );
}

// File Upload Security: Validate MIME type and size
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageUpload(file: File): { valid: boolean; message?: string } {
  if (!file) return { valid: false, message: 'فایلی ارسال نشد' };
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return { valid: false, message: 'فرمت فایل مجاز نیست (فقط JPG, PNG, WebP, GIF)' };
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return { valid: false, message: 'حجم فایل بیش از ۵ مگابایت است' };
  }
  // 🛡️ بررسی دقیق پسوند (جلوگیری از فایل‌های دوگانه مثل image.jpg.php)
  const ext = file.name.split('.').pop()?.toLowerCase();
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  if (!ext || !allowedExts.includes(ext)) {
    return { valid: false, message: 'پسوند فایل مجاز نیست' };
  }
  return { valid: true };
}

// Prevent path traversal & dangerous extensions
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.(php|exe|sh|js|html|svg)$/i, '');
}


==========================================================================================
FILE [246/255] src\lib\sms.ts
SIZE 4825 bytes
==========================================================================================
import { Smsir } from 'sms-typescript';

function getSmsir(): Smsir {
  const apiKey = process.env.SMSIR_API_KEY;
  const lineRaw = process.env.SMSIR_LINE_NUMBER;

  if (!apiKey || !lineRaw) {
    throw new Error('SMS config missing: SMSIR_API_KEY / SMSIR_LINE_NUMBER');
  }

  const cleaned = lineRaw
    .trim()
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

  const lineNumber = Number(cleaned);
  if (!Number.isFinite(lineNumber) || lineNumber <= 0) {
    throw new Error(`SMSIR_LINE_NUMBER invalid: "${lineRaw}"`);
  }

  return new Smsir(apiKey, lineNumber);
}

function serializeError(err: any) {
  // SMS.ir SDK may throw errors with a "response" containing the API's JSON body
  const out: any = {
    message: err?.message,
    name: err?.name,
    code: err?.code,
    status: err?.status,
    response_status: err?.response?.status,
    response_data: err?.response?.data,
    raw: undefined,
  };
  try {
    out.raw = JSON.stringify(err);
  } catch {
    out.raw = String(err);
  }
  return out;
}

export async function sendOtpCode(mobile: string, code: string) {
  try {
    const templateIdRaw = process.env.SMSIR_OTP_TEMPLATE_ID;
    const templateId = Number(templateIdRaw);
    if (!Number.isFinite(templateId) || templateId <= 0) {
      throw new Error(`SMSIR_OTP_TEMPLATE_ID invalid: "${templateIdRaw}"`);
    }

    const smsir = getSmsir();
    console.log('[SMS OTP] Attempting send:', { mobile, templateId });

    const result = await smsir.sendVerifyCode(mobile, templateId, [
      { name: 'Code', value: code },
    ]);

    console.log('[SMS OTP] Send result:', JSON.stringify(result));
    return { success: true, result };
  } catch (error: any) {
    console.error('[SMS OTP Error] Full details:', JSON.stringify(serializeError(error)));
    return { success: false, error };
  }
}

export async function sendOrderNotification(mobile: string, trackingCode: string) {
  try {
    const templateIdRaw = process.env.SMSIR_ORDER_TEMPLATE_ID;
    const templateId = Number(templateIdRaw);
    if (!Number.isFinite(templateId) || templateId <= 0) {
      throw new Error(`SMSIR_ORDER_TEMPLATE_ID invalid: "${templateIdRaw}"`);
    }

    const smsir = getSmsir();
    const result = await smsir.sendVerifyCode(mobile, templateId, [
      { name: 'TrackingCode', value: trackingCode },
    ]);
    console.log('[SMS Order] Send result:', JSON.stringify(result));
    return { success: true, result };
  } catch (error: any) {
    console.error('[SMS Order Error] Full details:', JSON.stringify(serializeError(error)));
    return { success: false, error };
  }
}
/**
 * ارسال اطلاع‌رسانی پاسخ پشتیبانی
 * Note: You need to create a template in SMS.ir with ID SMSIR_SUPPORT_TEMPLATE_ID
 * Template suggestion: "فاطمه بیوتی لند | پشتیبانی به تیکت شما پاسخ داد. موضوع: {0}"
 */
export async function sendSupportNotification(mobile: string, subject: string) {
  try {
    const apiKey = process.env.SMSIR_API_KEY || '';
    if (!apiKey) return { success: false };
    
    const templateId = Number(process.env.SMSIR_SUPPORT_TEMPLATE_ID);
    if (!templateId) {
      console.warn('[SMS Support] SMSIR_SUPPORT_TEMPLATE_ID not set. Skipping SMS.');
      return { success: false };
    }

    const smsir = getSmsir();
    const shortSubject = subject.length > 30 ? subject.substring(0, 30) + '...' : subject;
    
    const result = await smsir.sendVerifyCode(mobile, templateId, [
      { name: 'Subject', value: shortSubject },
    ]);
    return { success: true, result };
  } catch (error) {
    console.error('[SMS Support Error]', error);
    return { success: false, error };
  }
}
export async function sendBackInStockSms(mobile: string, productName: string) {
  try {
    const apiKey = process.env.SMSIR_API_KEY || '';
    if (!apiKey) return { success: false };
    
    // استفاده از یک قالب فرضی یا لاگ کردن
    const templateId = Number(process.env.SMSIR_STOCK_TEMPLATE_ID);
    if (!templateId) {
      console.warn(`[SMS Stock Notify] SMSIR_STOCK_TEMPLATE_ID not set. Mock sending to ${mobile} for ${productName}`);
      return { success: true };
    }

    const smsir = getSmsir();
    const shortName = productName.length > 30 ? productName.substring(0, 30) + '...' : productName;
    
    const result = await smsir.sendVerifyCode(mobile, templateId, [
      { name: 'ProductName', value: shortName },
    ]);
    return { success: true, result };
  } catch (error) {
    console.error('[SMS Stock Notify Error]', error);
    return { success: false, error };
  }
}


==========================================================================================
FILE [247/255] src\proxy.ts
SIZE 2720 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const adminSecretRaw = process.env.JWT_SECRET;
const customerSecretRaw = process.env.CUSTOMER_JWT_SECRET || process.env.JWT_SECRET;

if (!adminSecretRaw) console.error('[proxy] FATAL: JWT_SECRET missing');

const adminSecret = new TextEncoder().encode(adminSecretRaw || '');
const customerSecret = new TextEncoder().encode(customerSecretRaw || '');

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/36668862.txt') return NextResponse.next();

  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_token')?.value;
    if (pathname !== '/admin/login') {
      if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));
      try { await jwtVerify(token, adminSecret); }
      catch { return NextResponse.redirect(new URL('/admin/login', request.url)); }
    } else if (token) {
      try {
        await jwtVerify(token, adminSecret);
        return NextResponse.redirect(new URL('/admin', request.url));
      } catch {}
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/account')) {
    const isAuthRoute = pathname === '/account/login' || pathname === '/account/register';
    const token = request.cookies.get('customer_token')?.value;
    if (isAuthRoute) {
      if (token) {
        try {
          const { payload } = await jwtVerify(token, customerSecret);
          const isTemp = (payload.email as string)?.endsWith('@temp.fatemehlab.ir');
          return NextResponse.redirect(new URL(isTemp ? '/account/onboarding' : '/account', request.url));
        } catch {}
      }
      return NextResponse.next();
    }
    if (!token) return NextResponse.redirect(new URL(`/account/login?redirect=${encodeURIComponent(pathname)}`, request.url));
    try {
      const { payload } = await jwtVerify(token, customerSecret);
      const email = (payload.email as string) || '';
      const isTemp = email.endsWith('@temp.fatemehlab.ir');
      const onb = pathname === '/account/onboarding';
      if (isTemp && !onb) return NextResponse.redirect(new URL('/account/onboarding', request.url));
      if (!isTemp && onb) return NextResponse.redirect(new URL('/account', request.url));
    } catch {
      const res = NextResponse.redirect(new URL('/account/login', request.url));
      res.cookies.delete('customer_token');
      return res;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|36668862\\.txt|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$).*)',
  ],
};


==========================================================================================
FILE [248/255] src\store\cart.ts
SIZE 3320 bytes
==========================================================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  mainImage: string | null;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  recentlyViewed: Omit<CartItem, 'quantity'>[];
  quickViewProduct: Omit<CartItem, 'quantity'> | null;
  
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  addBundle: (items: Omit<CartItem, 'quantity'>[]) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  
  openCart: () => void;
  closeCart: () => void;
  
  openQuickView: (product: Omit<CartItem, 'quantity'>) => void;
  closeQuickView: () => void;
  
  addRecentlyViewed: (product: Omit<CartItem, 'quantity'>) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      recentlyViewed: [],
      quickViewProduct: null,

      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...currentItems, { ...item, quantity: 1 }] });
        }
      },

      addBundle: (itemsToAdd) => {
        const currentItems = [...get().items];
        itemsToAdd.forEach(item => {
          const existingIndex = currentItems.findIndex(i => i.id === item.id);
          if (existingIndex > -1) {
            currentItems[existingIndex] = { 
              ...currentItems[existingIndex], 
              quantity: currentItems[existingIndex].quantity + 1 
            };
          } else {
            currentItems.push({ ...item, quantity: 1 });
          }
        });
        set({ items: currentItems });
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      
      openQuickView: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),
      
      addRecentlyViewed: (product) => {
        const current = get().recentlyViewed;
        const filtered = current.filter((i) => i.id !== product.id);
        const updated = [product, ...filtered].slice(0, 5);
        set({ recentlyViewed: updated });
      },
    }),
    { name: 'fatemehlab-cart' }
  )
);

// 🛡️ همگام‌سازی سبد خرید بین تب‌های مختلف
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'fatemehlab-cart') {
      useCartStore.persist.rehydrate();
    }
  });
}


==========================================================================================
FILE [249/255] _chat_v4_backup_14050823_113217\globals.css
SIZE 72256 bytes
==========================================================================================
@import "tailwindcss";

@theme {
  /* Fatemeh Beauty Land — light-first modern pink identity */
  --color-canvas: #ffffff;
  --color-background: #ffffff;
  --color-background-secondary: #f8f7fa;
  --color-surface: #ffffff;
  --color-chalk: #f8f7fa;
  --color-oat: #fff2f8;
  --color-beige: #f8f3f6;
  --color-ink: #28242b;
  --color-foreground: #28242b;
  --color-muted: #77717b;
  --color-muted-foreground: #77717b;
  --color-line: #ece8ed;
  --color-border: #e9e5eb;
  --color-sage: #c61d70;
  --color-sage-dark: #a9155d;
  --color-rose: #f4b7d5;
  --color-terracotta: #c84f70;
  --color-gold: #c61d70;
  --color-primary: #c61d70;
  --color-primary-foreground: #ffffff;

  --font-sans: var(--font-vazirmatn), Tahoma, Arial, sans-serif;
  --font-serif: var(--font-vazirmatn), Tahoma, Arial, sans-serif;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 22px;
  --radius-2xl: 28px;

  --shadow-soft: 0 2px 12px rgba(37, 27, 39, 0.045);
  --shadow-card: 0 12px 34px rgba(67, 35, 57, 0.075);
  --shadow-pink: 0 10px 26px rgba(198, 29, 112, 0.16);
  --shadow-glass: 0 8px 28px rgba(40, 36, 43, 0.06);
  --shadow-float: 0 18px 42px rgba(40, 36, 43, 0.09);
}

:root {
  color-scheme: light;
  --fl-pink: #c61d70;
  --fl-pink-hover: #a9155d;
  --fl-pink-soft: #fff0f7;
  --fl-pink-tint: #fce5f0;
  --fl-ink: #28242b;
  --fl-muted: #77717b;
  --fl-line: #e9e5eb;
  --fl-canvas: #ffffff;
  --fl-soft: #f8f7fa;
}

@layer base {
  * { box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
    background: var(--fl-canvas);
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    min-height: 100vh;
    margin: 0;
    background: var(--fl-canvas);
    color: var(--fl-ink);
    font-family: var(--font-vazirmatn), Tahoma, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.85;
    font-feature-settings: "ss01", "ss02";
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  button, input, textarea, select { font: inherit; }
  button { cursor: pointer; }
  button:disabled { cursor: not-allowed; }
  img { max-width: 100%; }
  a { color: inherit; text-decoration: none; }
  ::selection { background: rgba(198, 29, 112, 0.16); color: #5a1038; }

  :focus-visible {
    outline: 3px solid rgba(198, 29, 112, 0.42);
    outline-offset: 3px;
  }
}

@layer utilities {
  .container-custom {
    width: min(100% - 40px, 1280px);
    margin-inline: auto;
  }

  .glass-panel,
  .glass-panel-strong {
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid var(--fl-line);
    box-shadow: var(--shadow-soft);
    backdrop-filter: none;
  }

  .btn-primary {
    display: inline-flex;
    min-height: 46px;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 0 21px;
    border: 1px solid var(--fl-pink);
    border-radius: 12px;
    background: var(--fl-pink);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    transition: background .18s ease, border-color .18s ease, transform .18s ease, box-shadow .18s ease;
  }
  .btn-primary:hover {
    background: var(--fl-pink-hover);
    border-color: var(--fl-pink-hover);
    box-shadow: var(--shadow-pink);
    transform: translateY(-1px);
  }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: .52; box-shadow: none; transform: none; }

  .btn-secondary {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 19px;
    border: 1px solid var(--fl-line);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
    color: var(--fl-ink);
    font-size: 13px;
    font-weight: 600;
    transition: border-color .18s ease, background .18s ease, color .18s ease;
  }
  .btn-secondary:hover { border-color: #e7a2c4; background: var(--fl-pink-soft); color: var(--fl-pink-hover); }

  .btn-glass {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 19px;
    border: 1px solid rgba(198, 29, 112, .18);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
    color: var(--fl-pink-hover);
    font-size: 13px;
    font-weight: 600;
    transition: background .18s ease, border-color .18s ease;
  }
  .btn-glass:hover { background: var(--fl-pink-soft); border-color: rgba(198, 29, 112, .34); }

  .editorial-heading {
    font-family: var(--font-vazirmatn), Tahoma, Arial, sans-serif;
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1.65;
  }

  .label-caps {
    color: var(--fl-pink);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .12em;
  }

  .noise-overlay { background-image: none; }
  .divider-line {
    width: 34px;
    height: 3px;
    border-radius: 99px;
    background: linear-gradient(90deg, #c61d70, #f0a4c8);
  }
  .scrollbar-hide { scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
}

/* -------------------------------------------------------------------------- */
/* Storefront shell                                                           */
/* -------------------------------------------------------------------------- */
.fl-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(233, 229, 235, .88);
  background: rgba(255, 255, 255, .94);
  backdrop-filter: blur(16px);
}
.fl-header-inner {
  display: flex;
  min-height: 74px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.fl-brand { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; }
.fl-brand-mark {
  position: relative;
  width: 39px;
  height: 39px;
  overflow: hidden;
  border: 1px solid #f1dce7;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
}
.fl-brand-name { color: var(--fl-ink); font-size: 15px; font-weight: 800; line-height: 1.25; }
.fl-brand-latin { margin-top: 2px; color: #a49ba5; font-size: 8px; font-weight: 700; letter-spacing: .19em; direction: ltr; }
.fl-nav { display: flex; align-items: center; gap: clamp(16px, 2.4vw, 34px); }
.fl-nav a { position: relative; color: #625c66; font-size: 12px; font-weight: 600; transition: color .18s ease; }
.fl-nav a:hover, .fl-nav a[aria-current="page"] { color: var(--fl-pink); }
.fl-nav a[aria-current="page"]::after { position: absolute; right: 0; bottom: -9px; left: 0; height: 2px; border-radius: 2px; background: var(--fl-pink); content: ""; }
.fl-icon-button {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: #625c66;
  transition: background .18s ease, color .18s ease, border-color .18s ease;
}
.fl-icon-button:hover { border-color: #f2d4e4; background: var(--fl-pink-soft); color: var(--fl-pink); }
.fl-cart-count { position: absolute; top: 0; right: 0; display: grid; min-width: 17px; height: 17px; place-items: center; padding-inline: 3px; border: 2px solid #fff; border-radius: 99px; background: var(--fl-pink); color: #fff; font-size: 9px; font-weight: 800; line-height: 1; }
.fl-search-panel { position: absolute; top: calc(100% + 8px); left: max(20px, calc((100vw - 1280px) / 2)); z-index: 60; width: min(430px, calc(100vw - 40px)); padding: 14px; border: 1px solid var(--fl-line); border-radius: 16px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); box-shadow: 0 18px 50px rgba(40, 25, 39, .12); }
.fl-search-field { display: flex; align-items: center; gap: 10px; padding-inline: 12px; border: 1px solid var(--fl-line); border-radius: 11px; background: #fbfafc; }
.fl-search-field input { width: 100%; min-width: 0; height: 44px; border: 0; outline: 0; background: transparent; color: var(--fl-ink); font-size: 13px; }
.fl-mobile-nav { position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column; background: rgba(255,255,255,.98); }
.fl-mobile-nav-head { display: flex; min-height: 70px; align-items: center; justify-content: space-between; padding-inline: 20px; border-bottom: 1px solid var(--fl-line); }
.fl-mobile-nav-links { display: grid; gap: 4px; padding: 18px 20px; }
.fl-mobile-nav-links a { padding: 15px 5px; border-bottom: 1px solid #f0edf1; color: var(--fl-ink); font-size: 15px; font-weight: 650; }

/* -------------------------------------------------------------------------- */
/* Homepage                                                                    */
/* -------------------------------------------------------------------------- */
.fl-home-hero { position: relative; overflow: hidden; padding-block: clamp(36px, 6vw, 74px) clamp(42px, 6vw, 76px); }
.fl-hero-grid { display: grid; grid-template-columns: minmax(0, .94fr) minmax(0, 1.06fr); align-items: center; gap: clamp(30px, 5vw, 70px); }
.fl-eyebrow { display: inline-flex; align-items: center; gap: 8px; color: var(--fl-pink); font-size: 10px; font-weight: 800; letter-spacing: .13em; }
.fl-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--fl-pink); box-shadow: 0 0 0 4px rgba(198,29,112,.10); }
.fl-hero-title { max-width: 520px; margin-top: 18px; color: var(--fl-ink); font-size: clamp(27px, 3.1vw, 39px); font-weight: 750; letter-spacing: -.045em; line-height: 1.72; }
.fl-hero-title span { color: var(--fl-pink); }
.fl-hero-copy { max-width: 450px; margin-top: 14px; color: var(--fl-muted); font-size: 14px; line-height: 2.15; }
.fl-hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 26px; }
.fl-hero-meta { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 27px; color: #817984; font-size: 10px; }
.fl-hero-meta span { display: inline-flex; align-items: center; gap: 6px; }
.fl-hero-meta svg { color: var(--fl-pink); }
.fl-hero-art { position: relative; min-height: 420px; overflow: hidden; border: 1px solid #f4d8e7; border-radius: 26px; background: radial-gradient(ellipse at 68% 25%, rgba(255,255,255,.8) 0 12%, transparent 42%), radial-gradient(ellipse at 22% 80%, rgba(239,143,190,.4), transparent 38%), linear-gradient(135deg, rgba(255,244,249,0.7) 0%, rgba(251,229,240,0.7) 48%, rgba(248,241,247,0.7) 100%); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.8); isolation: isolate; }
.fl-hero-art::before, .fl-hero-art::after { position: absolute; z-index: -1; border: 1px solid rgba(198,29,112,.14); border-radius: 50%; content: ""; }
.fl-hero-art::before { width: 360px; height: 360px; top: 30px; left: 50%; transform: translateX(-50%); box-shadow: 0 0 0 30px rgba(255,255,255,.16), 0 0 0 70px rgba(255,255,255,.11); }
.fl-hero-art::after { width: 230px; height: 230px; right: -85px; bottom: -88px; background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.95), rgba(226,92,155,.18) 65%, rgba(198,29,112,.07)); filter: blur(.2px); }
.fl-hero-art-top { position: absolute; top: 24px; right: 25px; left: 25px; display: flex; align-items: center; justify-content: space-between; color: #a44a78; font-size: 9px; font-weight: 800; letter-spacing: .14em; }
.fl-hero-art-mark { position: absolute; top: 50%; left: 50%; display: grid; width: 174px; height: 174px; place-items: center; overflow: hidden; transform: translate(-50%, -50%); border: 8px solid rgba(255,255,255,.8); border-radius: 50%; background: rgba(255,255,255,.72); box-shadow: 0 28px 75px rgba(151,41,99,.16), inset 0 0 0 1px rgba(198,29,112,.09); }
.fl-hero-art-mark img { width: 100%; height: 100%; object-fit: cover; }
.fl-hero-art-caption { position: absolute; right: 24px; bottom: 22px; left: 24px; display: flex; align-items: end; justify-content: space-between; gap: 20px; }
.fl-hero-art-caption strong { color: #71304f; font-size: 13px; font-weight: 800; }
.fl-hero-art-caption span { color: #9c6882; font-size: 10px; }
.fl-orbit { position: absolute; top: 50%; left: 50%; width: 300px; height: 112px; transform: translate(-50%, -50%) rotate(-28deg); border: 1px solid rgba(198,29,112,.22); border-radius: 50%; }
.fl-orbit::after { position: absolute; top: 11px; right: 30px; width: 9px; height: 9px; border-radius: 50%; background: #d94791; box-shadow: 0 0 0 7px rgba(217,71,145,.12); content: ""; }
.fl-feature-strip { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; padding-block: 18px; border-block: 1px solid var(--fl-line); }
.fl-feature { display: flex; align-items: center; justify-content: center; gap: 10px; min-width: 0; color: #5e5862; font-size: 11px; font-weight: 650; }
.fl-feature-icon { display: grid; width: 34px; height: 34px; flex-shrink: 0; place-items: center; border: 1px solid #f2d7e5; border-radius: 11px; background: #fff7fb; color: var(--fl-pink); }
.fl-section { padding-block: clamp(42px, 6vw, 70px); }
.fl-section-head { display: flex; align-items: end; justify-content: space-between; gap: 18px; margin-bottom: 24px; }
.fl-section-kicker { color: var(--fl-pink); font-size: 10px; font-weight: 800; letter-spacing: .11em; }
.fl-section-title { margin-top: 5px; color: var(--fl-ink); font-size: clamp(20px, 2.1vw, 25px); font-weight: 750; letter-spacing: -.035em; line-height: 1.7; }
.fl-section-note { margin-top: 4px; color: var(--fl-muted); font-size: 12px; line-height: 1.9; }
.fl-text-link { display: inline-flex; align-items: center; gap: 7px; color: var(--fl-pink); font-size: 12px; font-weight: 750; white-space: nowrap; }
.fl-text-link:hover { color: var(--fl-pink-hover); }
.fl-product-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; }
.fl-product-card { display: flex; min-width: 0; flex-direction: column; }
.fl-product-media { position: relative; aspect-ratio: 4 / 4.65; overflow: hidden; border: 1px solid #eee9ef; border-radius: 17px; background: linear-gradient(145deg, #fcfafc, #f7f2f7); }
.fl-product-media img { padding: 12px; object-fit: contain; transition: transform .45s cubic-bezier(.2,.7,.2,1); }
.fl-product-card:hover .fl-product-media img { transform: scale(1.045); }
.fl-product-placeholder { position: absolute; inset: 0; display: grid; place-items: center; background: radial-gradient(circle at 50% 42%, #fff 0 15%, transparent 58%), linear-gradient(145deg, #fff7fb, #f6eef4); color: #d28aac; }
.fl-product-placeholder::before { width: 94px; height: 94px; border: 1px solid rgba(198,29,112,.17); border-radius: 50%; box-shadow: 0 0 0 16px rgba(255,255,255,.36), 0 0 0 34px rgba(255,255,255,.22); content: ""; }
.fl-product-info { padding: 12px 2px 0; }
.fl-product-name { overflow: hidden; color: var(--fl-ink); font-size: 13px; font-weight: 750; line-height: 1.8; text-overflow: ellipsis; white-space: nowrap; }
.fl-product-desc { min-height: 22px; margin-top: 2px; overflow: hidden; color: #8a838d; font-size: 10px; line-height: 1.8; text-overflow: ellipsis; white-space: nowrap; }
.fl-product-bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 9px; }
.fl-product-price { color: var(--fl-ink); font-size: 12px; font-weight: 800; }
.fl-product-status { color: #27835c; font-size: 10px; font-weight: 700; }
.fl-product-status.is-out { color: #a47c86; }
.fl-product-view { display: inline-flex; align-items: center; gap: 5px; margin-top: 11px; color: var(--fl-pink); font-size: 10px; font-weight: 750; }
.fl-editorial-panel { position: relative; display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); align-items: center; gap: clamp(24px, 5vw, 65px); overflow: hidden; padding: clamp(24px, 4.5vw, 52px); border: 1px solid #f0d8e5; border-radius: 23px; background: linear-gradient(115deg, #fff 0%, #fff8fc 56%, #fff0f7 100%); }
.fl-editorial-visual { position: relative; min-height: 245px; overflow: hidden; border-radius: 18px; background: radial-gradient(circle at 65% 30%, #fff 0 8%, transparent 33%), radial-gradient(circle at 30% 75%, rgba(224,103,164,.25), transparent 40%), linear-gradient(145deg, #f9e8f1, #fff7fb); }
.fl-editorial-visual::before { position: absolute; top: 50%; left: 50%; width: 170px; height: 170px; transform: translate(-50%,-50%); border: 1px solid rgba(198,29,112,.22); border-radius: 50%; box-shadow: 0 0 0 22px rgba(255,255,255,.28), 0 0 0 48px rgba(255,255,255,.2); content: ""; }
.fl-editorial-visual::after { position: absolute; top: 17%; left: 23%; width: 48px; height: 48px; border: 1px solid rgba(198,29,112,.22); border-radius: 50%; background: rgba(255,255,255,.68); box-shadow: 0 12px 25px rgba(198,29,112,.12); content: ""; }
.fl-editorial-copy { max-width: 490px; }
.fl-editorial-copy h2 { margin-top: 12px; color: var(--fl-ink); font-size: clamp(20px,2.2vw,27px); font-weight: 750; line-height: 1.85; }
.fl-editorial-copy p { margin-top: 10px; color: var(--fl-muted); font-size: 13px; line-height: 2.15; }
.fl-faq-list { display: grid; gap: 9px; }
.fl-faq-item { overflow: hidden; border: 1px solid var(--fl-line); border-radius: 13px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); }
.fl-faq-item summary { display: flex; min-height: 54px; align-items: center; justify-content: space-between; gap: 18px; padding: 13px 17px; color: var(--fl-ink); cursor: pointer; font-size: 12px; font-weight: 700; list-style: none; }
.fl-faq-item summary::-webkit-details-marker { display: none; }
.fl-faq-item summary::after { display: grid; width: 24px; height: 24px; flex-shrink: 0; place-items: center; border-radius: 8px; background: var(--fl-pink-soft); color: var(--fl-pink); content: "+"; font-size: 16px; font-weight: 500; }
.fl-faq-item[open] summary::after { content: "−"; }
.fl-faq-answer { padding: 0 17px 16px; color: var(--fl-muted); font-size: 12px; line-height: 2; }

/* -------------------------------------------------------------------------- */
/* Product catalog and detail                                                  */
/* -------------------------------------------------------------------------- */
.fl-page-intro { padding-block: 36px 30px; border-bottom: 1px solid var(--fl-line); background: linear-gradient(110deg, #fff 0%, #fff8fc 100%); }
.fl-page-title { margin-top: 8px; color: var(--fl-ink); font-size: clamp(23px, 2.5vw, 30px); font-weight: 800; letter-spacing: -.035em; line-height: 1.7; }
.fl-page-description { max-width: 620px; margin-top: 5px; color: var(--fl-muted); font-size: 13px; line-height: 2; }
.fl-input { width: 100%; min-height: 44px; padding: 0 13px; border: 1px solid var(--fl-line); border-radius: 11px; outline: none; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); color: var(--fl-ink); font-size: 13px; transition: border-color .18s ease, box-shadow .18s ease; }
.fl-input:focus { border-color: #db78a9; box-shadow: 0 0 0 3px rgba(198,29,112,.09); }
.fl-filter-chip { display: inline-flex; min-height: 36px; align-items: center; padding: 0 13px; border: 1px solid var(--fl-line); border-radius: 10px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); color: #6e6671; font-size: 11px; font-weight: 650; transition: .18s ease; }
.fl-filter-chip:hover, .fl-filter-chip.is-active { border-color: #d95a98; background: var(--fl-pink-soft); color: var(--fl-pink-hover); }
.fl-breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; color: #8b8490; font-size: 10px; }
.fl-breadcrumb a:hover { color: var(--fl-pink); }
.fl-detail-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, .92fr); align-items: start; gap: clamp(28px, 5vw, 70px); }
.fl-gallery-main { position: relative; aspect-ratio: 1 / 1; overflow: hidden; border: 1px solid var(--fl-line); border-radius: 20px; background: linear-gradient(145deg, #fff, #faf7fa); }
.fl-gallery-main img { padding: 20px; object-fit: contain; }
.fl-gallery-thumbs { display: flex; gap: 9px; overflow-x: auto; padding: 3px 1px 7px; }
.fl-gallery-thumb { position: relative; width: 70px; height: 70px; flex-shrink: 0; overflow: hidden; border: 1px solid var(--fl-line); border-radius: 11px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); }
.fl-gallery-thumb.is-active { border: 2px solid var(--fl-pink); box-shadow: 0 0 0 3px rgba(198,29,112,.08); }
.fl-gallery-thumb img { padding: 4px; object-fit: contain; }
.fl-detail-title { color: var(--fl-ink); font-size: clamp(23px, 2.5vw, 31px); font-weight: 800; letter-spacing: -.035em; line-height: 1.75; }
.fl-detail-description { margin-top: 10px; color: var(--fl-muted); font-size: 13px; line-height: 2.15; }
.fl-price-box { padding-block: 18px; border-block: 1px solid var(--fl-line); }
.fl-price { color: var(--fl-ink); font-size: 20px; font-weight: 850; }
.fl-detail-section { padding: 19px; border: 1px solid var(--fl-line); border-radius: 15px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); }
.fl-spec-row { display: flex; justify-content: space-between; gap: 18px; padding-block: 10px; border-bottom: 1px solid #f0edf1; font-size: 12px; }
.fl-spec-row:last-child { border-bottom: 0; }
.fl-muted-note { padding: 14px 16px; border: 1px solid #f2dce8; border-radius: 12px; background: #fff8fc; color: #7d586a; font-size: 11px; line-height: 2; }
.fl-empty-state { padding: 65px 20px; border: 1px dashed #e6d9e2; border-radius: 18px; background: #fffbfd; text-align: center; }

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */
.fl-footer { margin-top: 50px; border-top: 1px solid var(--fl-line); background: #fbfafc; }
.fl-footer-main { display: grid; grid-template-columns: minmax(0,1.5fr) repeat(2,minmax(0,1fr)); gap: 45px; padding-block: 42px; }
.fl-footer-title { margin-bottom: 12px; color: var(--fl-ink); font-size: 12px; font-weight: 800; }
.fl-footer-link { color: #77717b; font-size: 11px; transition: color .18s ease; }
.fl-footer-link:hover { color: var(--fl-pink); }
.fl-footer-bottom { display: flex; min-height: 58px; align-items: center; justify-content: space-between; gap: 15px; border-top: 1px solid var(--fl-line); color: #918a95; font-size: 10px; }

@media (max-width: 900px) {
  .fl-hero-grid { grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 25px; }
  .fl-hero-art { min-height: 360px; }
  .fl-product-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 23px 15px; }
  .fl-detail-grid { gap: 28px; }
}

@media (max-width: 767px) {
  .fl-nav { display: none; }
}

@media (max-width: 680px) {
  .container-custom { width: min(100% - 30px, 1280px); }
  .fl-header-inner { min-height: 64px; gap: 10px; }
  .fl-brand-mark { width: 35px; height: 35px; }
  .fl-brand-name { font-size: 13px; }
  .fl-nav { display: none; }
  .fl-search-panel { right: 15px; left: 15px; width: auto; }
  .fl-hero-grid { grid-template-columns: 1fr; gap: 24px; }
  .fl-hero-copy-wrap { order: 2; text-align: right; }
  .fl-hero-art { min-height: 315px; order: 1; border-radius: 20px; }
  .fl-hero-art-mark { width: 135px; height: 135px; }
  .fl-orbit { width: 240px; height: 90px; }
  .fl-hero-title { max-width: 100%; margin-top: 12px; font-size: 27px; line-height: 1.8; }
  .fl-hero-copy { font-size: 13px; }
  .fl-hero-actions { margin-top: 20px; }
  .fl-hero-actions a { flex: 1; }
  .fl-hero-meta { margin-top: 19px; gap: 12px; }
  .fl-feature-strip { gap: 6px; padding-block: 13px; }
  .fl-feature { flex-direction: column; gap: 5px; text-align: center; font-size: 9px; }
  .fl-feature-icon { width: 31px; height: 31px; border-radius: 10px; }
  .fl-section { padding-block: 40px; }
  .fl-section-head { align-items: start; margin-bottom: 18px; }
  .fl-section-title { font-size: 20px; }
  .fl-product-grid { gap: 21px 12px; }
  .fl-product-media { border-radius: 13px; }
  .fl-product-info { padding-top: 9px; }
  .fl-product-name { font-size: 12px; }
  .fl-product-desc { font-size: 9px; }
  .fl-product-bottom { align-items: start; flex-direction: column; gap: 3px; }
  .fl-product-price { font-size: 11px; }
  .fl-editorial-panel { grid-template-columns: 1fr; gap: 20px; border-radius: 18px; }
  .fl-editorial-visual { min-height: 190px; }
  .fl-footer-main { grid-template-columns: 1fr 1fr; gap: 28px 20px; padding-block: 32px; }
  .fl-footer-brand { grid-column: 1 / -1; }
  .fl-footer-bottom { align-items: flex-start; flex-direction: column; justify-content: center; padding-block: 15px; }
  .fl-detail-grid { grid-template-columns: 1fr; }
  .fl-detail-title { font-size: 24px; }
  .fl-gallery-main { border-radius: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}



/* ============================================================ */
/* Mobile Bottom Navigation — Premium iOS-Style                 */
/* ============================================================ */
.fl-bottom-nav {
  position: fixed;
  bottom: max(16px, env(safe-area-inset-bottom, 16px));
  left: 16px;
  right: 16px;
  z-index: 45;
  pointer-events: none;
  animation: flNavAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fl-bottom-nav-inner {
  position: relative;
  display: flex;
  align-items: stretch;
  height: 68px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px) saturate(190%);
  -webkit-backdrop-filter: blur(30px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 26px;
  box-shadow:
    0 24px 60px -12px rgba(40, 36, 43, 0.25),
    0 8px 20px -4px rgba(40, 36, 43, 0.10),
    inset 0 1px 1px rgba(255, 255, 255, 1);
  pointer-events: auto;
  isolation: isolate;
  overflow: hidden;
}

/* پیل شناور پشت آیتم فعال */
.fl-bottom-nav-pill {
  position: absolute;
  top: 5px;
  bottom: 5px;
  background: linear-gradient(135deg, #fff0f7 0%, #fce5f0 100%);
  border: 1px solid rgba(198, 29, 112, 0.18);
  border-radius: 20px;
  box-shadow:
    0 4px 12px -2px rgba(198, 29, 112, 0.20),
    0 1px 3px rgba(198, 29, 112, 0.08),
    inset 0 1px 1px rgba(255, 255, 255, 0.9);
  transition:
    transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1),
    width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  z-index: 0;
  pointer-events: none;
}

/* آیتم‌ها */
.fl-bottom-nav-item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 2px;
  color: #918a95;
  border-radius: 20px;
  transition:
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  -webkit-tap-highlight-color: transparent;
  text-decoration: none;
}

.fl-bottom-nav-item:active {
  transform: scale(0.94);
}

.fl-bottom-nav-item.is-active {
  color: #c61d70;
}

.fl-bottom-nav-icon-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fl-bottom-nav-item.is-active .fl-bottom-nav-icon-wrap {
  transform: translateY(-1px) scale(1.05);
}

.fl-bottom-nav-label {
  font-size: 10px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.02em;
  transition: font-weight 0.2s ease;
}

.fl-bottom-nav-item.is-active .fl-bottom-nav-label {
  font-weight: 800;
}

/* نشان سبد خرید */
.fl-bottom-nav-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #e6367e 0%, #c61d70 100%);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  line-height: 1;
  border-radius: 99px;
  border: 1.5px solid #fff;
  box-shadow:
    0 3px 8px rgba(198, 29, 112, 0.45),
    inset 0 1px 1px rgba(255, 255, 255, 0.3);
  animation: flNavBadgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes flNavAppear {
  from {
    opacity: 0;
    transform: translateY(120%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes flNavBadgePop {
  0% { opacity: 0; transform: scale(0) rotate(-20deg); }
  60% { opacity: 1; transform: scale(1.3) rotate(5deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}

/* فاصله امن برای موبایل */
@media (max-width: 767px) {
  body {
    padding-bottom: 100px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fl-bottom-nav,
  .fl-bottom-nav-pill,
  .fl-bottom-nav-item,
  .fl-bottom-nav-icon-wrap,
  .fl-bottom-nav-badge {
    animation: none !important;
    transition: none !important;
  }
}



/* ============================================================ */
/* NO HORIZONTAL SCROLL — GLOBAL PROTECTION                     */
/* ============================================================ */
html, body {
  max-width: 100vw;
  overflow-x: hidden !important;
}

@media (max-width: 767px) {
  /* همه عناصر از عرض صفحه بیرون نزنند */
  * {
    max-width: 100%;
  }

  /* عناصر flex و grid بدون min-width: 0 کوچک نمی‌شوند */
  .flex > *, .grid > * {
    min-width: 0;
  }

  /* تصاویر و ویدیوها هرگز از عرض صفحه بزرگ‌تر نباشند */
  img, video, iframe, svg {
    max-width: 100%;
    height: auto;
  }

  /* کدهای طولانی خط بشکنند */
  pre, code {
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* متن‌های طولانی بشکنند */
  p, h1, h2, h3, h4, h5, h6, span, a, div {
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  /* همه ورودی‌ها ۱۶ پیکسل تا iOS زوم نکند */
  input, textarea, select {
    font-size: 16px !important;
  }
}

/* ============================================================ */
/* ADMIN TABLES — MOBILE CARD LAYOUT                            */
/* ============================================================ */
@media (max-width: 767px) {
  .admin-table-wrapper {
    overflow-x: visible !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }
  .admin-table {
    min-width: 0 !important;
    width: 100% !important;
  }
  .admin-table thead {
    display: none !important;
  }
  .admin-table tbody tr {
    display: block !important;
    margin-bottom: 1rem !important;
    border: 1px solid #eee9ef !important;
    border-radius: 16px !important;
    background: #fff !important;
    overflow: hidden !important;
    box-shadow: 0 4px 16px rgba(40, 36, 43, 0.06) !important;
    width: 100% !important;
  }
  .admin-table tbody td {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 0.875rem 1rem !important;
    border: none !important;
    border-bottom: 1px solid #f5f0f2 !important;
    font-size: 0.875rem !important;
    white-space: normal !important;
    gap: 1rem !important;
    width: 100% !important;
  }
  .admin-table tbody td:last-child {
    border-bottom: none !important;
    justify-content: flex-end !important;
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
    background: #fbfafc !important;
  }
  .admin-table tbody td::before {
    content: attr(data-label) !important;
    font-weight: 600 !important;
    color: #77717b !important;
    font-size: 0.8125rem !important;
    flex-shrink: 0 !important;
  }
}

/* ============================================================ */
/* SAFE AREA FOR BOTTOM ELEMENTS                                */
/* ============================================================ */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .safe-bottom {
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)) !important;
  }
}

/* ============================================================ */
/* ADMIN MOBILE BOTTOM NAV — PREMIUM INFINITY                   */
/* ============================================================ */

@media (max-width: 767px) {
  /* فاصله از پایین برای اینکه محتوا زیر نوار پنهان نشود */
  body {
    padding-bottom: calc(84px + env(safe-area-inset-bottom)) !important;
  }
}

.admin-bottom-nav {
  position: fixed;
  bottom: max(12px, env(safe-area-inset-bottom, 12px));
  left: 12px;
  right: 12px;
  z-index: 45;
  animation: adminNavSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.admin-bottom-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 64px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(240, 220, 232, 0.8);
  border-radius: 22px;
  box-shadow: 
    0 16px 40px -8px rgba(40, 36, 43, 0.18), 
    0 2px 8px -2px rgba(40, 36, 43, 0.06), 
    inset 0 1px 1px rgba(255, 255, 255, 0.95);
}

.admin-bottom-nav-item {
  position: relative; /* اصلاح اصلی: برای نگه داشتن badge در جای درست */
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 52px;
  color: #8a838d;
  border-radius: 16px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}

.admin-bottom-nav-item:active {
  transform: scale(0.92);
}

.admin-bottom-nav-item.is-active {
  color: #c61d70;
  background: rgba(198, 29, 112, 0.08); /* پس‌زمینه صورتی ملایم برای تب فعال */
}

.admin-bottom-label {
  font-size: 9.5px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.01em;
}

.admin-bottom-nav-item.is-active .admin-bottom-label {
  font-weight: 800;
}

.admin-bottom-nav-item.is-active svg {
  transform: translateY(-1px) scale(1.05);
}

/* نشان سفارشات (Badge) */
.admin-bottom-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  background: #c61d70;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  line-height: 1;
  border-radius: 99px;
  border: 1.5px solid #fff;
  box-shadow: 0 2px 6px rgba(198, 29, 112, 0.3);
  animation: adminBadgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes adminNavSlideUp {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes adminBadgePop {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .admin-bottom-nav, .admin-bottom-nav-item, .admin-bottom-badge {
    animation: none !important;
    transition: none !important;
  }
}

/* ============================================================ */
/* FRONTEND MOBILE INFINITY OPTIMIZATION (2026)                 */
/* ============================================================ */

/* ۱. جلوگیری از اسکرول افقی و تنظیمات پایه */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  overflow-x: hidden !important;
  scroll-behavior: smooth;
  height: 100dvh;
}

body {
  width: 100%;
  overflow-x: hidden !important;
  touch-action: pan-y;
}

/* ۲. تایپوگرافی سیال (بدون پرش ناگهانی) */
@layer base {
  h1 { font-size: clamp(1.75rem, 1.5rem + 1.25vw, 3.5rem); line-height: 1.3; }
  h2 { font-size: clamp(1.5rem, 1.25rem + 1vw, 2.5rem); line-height: 1.4; }
  h3 { font-size: clamp(1.25rem, 1.1rem + 0.75vw, 2rem); line-height: 1.5; }
  p, li, span { font-size: clamp(0.9375rem, 0.9rem + 0.25vw, 1.0625rem); line-height: 1.8; }
}

/* ۳. تنظیمات لمس و ورودی‌ها در موبایل */
@media (max-width: 767px) {
  button, a.btn-primary, a.btn-secondary, a.btn-glass, input[type="submit"], input[type="button"] {
    min-height: 44px;
    min-width: 44px;
  }

  input, textarea, select {
    font-size: 16px !important;
  }

  .fl-bottom-nav {
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
}

/* ۴. جلوگیری از سرریز تصاویر و متن‌ها */
img, video, iframe, svg {
  max-width: 100%;
  height: auto;
}

@media (max-width: 767px) {
  p, h1, h2, h3, h4, h5, h6, span, a, li, div {
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  /* جلوگیری از پهن شدن فرزندان Flex و Grid */
  .flex > *, .grid > * {
    min-width: 0;
  }
}

/* ============================================================ */
/* MAGAZINE — Editorial Journal Styles                         */
/* ============================================================ */

/* نوار پیشرفت مطالعه */
.journal-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
  z-index: 100;
  pointer-events: none;
}
.journal-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #c61d70, #e84e9e);
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
}

/* هدر مجله */
.journal-hero {
  position: relative;
  padding: 4rem 0 3rem;
  text-align: center;
  overflow: hidden;
}
@media (min-width: 768px) {
  .journal-hero { padding: 6rem 0 4rem; }
}
.journal-hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.25em;
  color: #c61d70;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}
.journal-hero-title {
  font-size: clamp(2rem, 1.5rem + 2vw, 3.5rem);
  font-weight: 900;
  line-height: 1.2;
  color: #28242b;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}
.journal-hero-subtitle {
  max-width: 42rem;
  margin: 0 auto;
  color: #77717b;
  font-size: 15px;
  line-height: 2;
}

/* فیلتر دسته‌بندی */
.journal-category-filter {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0 1rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.journal-category-filter::-webkit-scrollbar { display: none; }
.journal-category-pill {
  flex-shrink: 0;
  padding: 0.625rem 1.25rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
  border: 1px solid #eee8ed;
  font-size: 13px;
  font-weight: 600;
  color: #77717b;
  text-decoration: none;
  transition: all 0.2s ease;
}
.journal-category-pill:hover {
  border-color: #c61d70;
  color: #c61d70;
}
.journal-category-pill.is-active {
  background: #c61d70;
  border-color: #c61d70;
  color: #fff;
  box-shadow: 0 4px 14px -2px rgba(198, 29, 112, 0.35);
}

/* تگ دسته‌بندی داخل کارت */
.journal-category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #fff0f7;
  border: 1px solid rgba(198, 29, 112, 0.15);
  color: #c61d70;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

/* متا */
.journal-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: #918a95;
  font-size: 11px;
  margin-top: 1rem;
}
.journal-meta-dot {
  color: #d0c8cc;
}

/* Featured Card */
.journal-featured {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  text-decoration: none;
  color: inherit;
  padding: 0;
  border-radius: 24px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
@media (min-width: 768px) {
  .journal-featured {
    grid-template-columns: 1fr 1fr;
    min-height: 480px;
  }
}
.journal-featured:hover { transform: translateY(-4px); }
.journal-featured-visual {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}
.journal-featured-art {
  position: relative;
  height: 100%;
  min-height: 300px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(198, 29, 112, 0.08);
  overflow: hidden;
}
.journal-featured-art::before {
  content: '';
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 1px solid rgba(198, 29, 112, 0.12);
  box-shadow: 0 0 0 40px rgba(255, 255, 255, 0.3), 0 0 0 80px rgba(255, 255, 255, 0.15);
}
.journal-featured-icon {
  position: relative;
  font-size: 5rem;
  color: rgba(198, 29, 112, 0.4);
  z-index: 1;
}
.journal-featured-brand {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: rgba(198, 29, 112, 0.5);
}
.journal-featured-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
}
@media (min-width: 768px) {
  .journal-featured-content { padding: 1rem 0; }
}
.journal-featured-title {
  font-size: clamp(1.5rem, 1.25rem + 1vw, 2.25rem);
  font-weight: 900;
  line-height: 1.35;
  color: #28242b;
  margin-bottom: 1rem;
  transition: color 0.2s ease;
}
.journal-featured:hover .journal-featured-title { color: #c61d70; }
.journal-featured-excerpt {
  color: #77717b;
  font-size: 14px;
  line-height: 2;
  margin-bottom: 1.5rem;
}
.journal-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #c61d70;
  font-weight: 700;
  font-size: 13px;
  margin-top: 1.5rem;
}
.journal-cta-arrow {
  transition: transform 0.3s ease;
}
.journal-featured:hover .journal-cta-arrow {
  transform: translateX(-4px);
}

/* EditorsPick Card */
.journal-pick {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
  border: 1px solid #eee8ed;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.journal-pick:hover {
  border-color: rgba(198, 29, 112, 0.25);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(198, 29, 112, 0.15);
}
.journal-pick-art {
  position: relative;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.journal-pick-icon {
  font-size: 3rem;
  color: rgba(198, 29, 112, 0.35);
}
.journal-pick-content {
  padding: 1.5rem;
}
.journal-pick-title {
  font-size: 16px;
  font-weight: 800;
  line-height: 1.6;
  color: #28242b;
  margin-bottom: 0.75rem;
  transition: color 0.2s ease;
}
.journal-pick:hover .journal-pick-title { color: #c61d70; }
.journal-pick-excerpt {
  font-size: 12px;
  line-height: 1.9;
  color: #77717b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Standard Card */
.journal-card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
  border: 1px solid #eee8ed;
  border-radius: 18px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}
.journal-card:hover {
  border-color: rgba(198, 29, 112, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 12px 28px -8px rgba(40, 36, 43, 0.08);
}
.journal-card-art {
  position: relative;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.journal-card-icon {
  font-size: 2.5rem;
  color: rgba(198, 29, 112, 0.3);
}
.journal-card-content {
  padding: 1.25rem;
}
.journal-card-title {
  font-size: 14px;
  font-weight: 800;
  line-height: 1.7;
  color: #28242b;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}
.journal-card:hover .journal-card-title { color: #c61d70; }
.journal-card-excerpt {
  font-size: 12px;
  line-height: 1.9;
  color: #77717b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* حالت خالی */
.journal-empty {
  text-align: center;
  padding: 5rem 1.5rem;
  border: 1px dashed #eee8ed;
  border-radius: 24px;
  background: #fffbfd;
}
.journal-empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  display: grid;
  place-items: center;
  background: #fff0f7;
  border-radius: 16px;
  color: #c61d70;
}

/* صفحه جزئیات مقاله */
.journal-article-hero {
  position: relative;
  padding: 3rem 0 2rem;
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
}
.journal-article-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 11px;
  color: #918a95;
  margin-bottom: 2rem;
}
.journal-article-breadcrumb a:hover { color: #c61d70; }
.journal-article-title {
  font-size: clamp(1.75rem, 1.5rem + 1.5vw, 3rem);
  font-weight: 900;
  line-height: 1.35;
  color: #28242b;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}
.journal-article-lead {
  font-size: 16px;
  line-height: 2;
  color: #77717b;
  max-width: 40rem;
  margin: 0 auto 2rem;
}
.journal-article-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 11px;
  color: #918a95;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee8ed;
  max-width: 36rem;
  margin: 0 auto;
}

/* محتوای مقاله */
.journal-article-body {
  max-width: 42rem;
  margin: 3rem auto 0;
  padding: 0 1.25rem;
}
.journal-article-body p {
  font-size: 15px;
  line-height: 2.2;
  color: #3a333f;
  margin-bottom: 1.5rem;
}
.journal-article-body h2 {
  font-size: 22px;
  font-weight: 800;
  color: #28242b;
  margin: 3rem 0 1rem;
  line-height: 1.5;
}
.journal-article-body h3 {
  font-size: 18px;
  font-weight: 800;
  color: #28242b;
  margin: 2rem 0 0.75rem;
  line-height: 1.6;
}
.journal-article-body ul,
.journal-article-body ol {
  margin: 1.5rem 0;
  padding-right: 1.5rem;
}
.journal-article-body li {
  font-size: 15px;
  line-height: 2.2;
  color: #3a333f;
  margin-bottom: 0.75rem;
}
.journal-article-body ul li { list-style-type: disc; }
.journal-article-body ul li::marker { color: #c61d70; }
.journal-article-body ol li { list-style-type: decimal; }
.journal-article-body ol li::marker { color: #c61d70; font-weight: 800; }

/* نقل قول */
.journal-quote {
  position: relative;
  margin: 2.5rem 0;
  padding: 1.5rem 2rem;
  background: #fff8fc;
  border-right: 3px solid #c61d70;
  border-radius: 0 12px 12px 0;
  font-size: 16px;
  line-height: 2;
  color: #5a1038;
  font-weight: 600;
}
.journal-quote::before {
  content: '"';
  position: absolute;
  top: -1.5rem;
  right: 1rem;
  font-size: 4rem;
  color: rgba(198, 29, 112, 0.15);
  font-family: Georgia, serif;
  line-height: 1;
}

/* مقاله‌های مرتبط */
.journal-related-section {
  border-top: 1px solid #eee8ed;
  padding: 4rem 0;
  margin-top: 4rem;
}
.journal-related-title {
  font-size: 22px;
  font-weight: 900;
  color: #28242b;
  text-align: center;
  margin-bottom: 2.5rem;
}
.journal-related-title span {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: #c61d70;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

@media (prefers-reduced-motion: reduce) {
  .journal-featured,
  .journal-pick,
  .journal-card,
  .journal-cta-arrow,
  .journal-category-pill {
    transition: none !important;
    transform: none !important;
  }
}
/* ============================================================ */
/* RICH TEXT EDITOR & PROSE STYLES                              */
/* ============================================================ */

.prose img, .journal-article-body img {
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  margin: 2rem auto;
  max-width: 100%;
  height: auto;
}
.prose h2, .journal-article-body h2 {
  font-size: 1.8rem;
  font-weight: 900;
  color: #28242b;
  margin-top: 3rem;
  margin-bottom: 1.2rem;
  line-height: 1.4;
  position: relative;
  padding-right: 1.5rem;
}
.prose h2::before, .journal-article-body h2::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 4px;
  background: #c61d70;
  border-radius: 99px;
}
.prose h3, .journal-article-body h3 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #28242b;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
.prose p, .journal-article-body p {
  font-size: 1.05rem;
  line-height: 2.2;
  color: #3a333f;
  margin-bottom: 1.8rem;
  text-align: justify;
}
.prose ul, .journal-article-body ul,
.prose ol, .journal-article-body ol {
  margin: 1.5rem 0;
  padding-right: 2rem;
}
.prose li, .journal-article-body li {
  font-size: 1.05rem;
  line-height: 2.2;
  color: #3a333f;
  margin-bottom: 0.8rem;
}
.prose ul li, .journal-article-body ul li { list-style-type: disc; }
.prose ul li::marker, .journal-article-body ul li::marker { color: #c61d70; }
.prose ol li, .journal-article-body ol li { list-style-type: decimal; }
.prose ol li::marker, .journal-article-body ol li::marker { color: #c61d70; font-weight: 800; }

/* استایل‌های مخصوص ادیتور Tiptap */
.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: right;
  height: 0;
  pointer-events: none;
}
.tiptap {
  min-height: 400px;
}
/* ============================================================ */
/* WISHLIST HEART ANIMATION                                    */
/* ============================================================ */
@keyframes pingOnce {
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}
.animate-ping-once {
  animation: pingOnce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInFromRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-in.slide-in-from-right {
  animation: slideInFromRight 0.3s ease-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake { animation: shake 0.3s ease-in-out; }

/* ============================================================ */
/* SONNER PREMIUM TOAST OVERRIDES                               */
/* ============================================================ */
[data-sonner-toaster] {
  --normal-bg: rgba(255, 255, 255, 0.85) !important;
  --normal-border: rgba(233, 229, 235, 0.8) !important;
  --normal-text: #28242b !important;
}

[data-sonner-toast] {
  animation: toast-spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

@keyframes toast-spring-in {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

[data-sonner-toast][data-removed="true"] {
  animation: toast-spring-out 0.3s ease-in forwards !important;
}

@keyframes toast-spring-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}

/* Make the close button look premium */
[data-sonner-toast] [data-close-button] {
  background-color: #f8f7fa !important;
  border-color: #e9e5eb !important;
  color: #77717b !important;
  border-radius: 8px !important;
  transition: all 0.2s ease;
}
[data-sonner-toast] [data-close-button]:hover {
  background-color: #fff0f7 !important;
  border-color: #f2d7e5 !important;
  color: #c61d70 !important;
}
/* ============================================================ */
/*  PREMIUM BACKGROUND & MESH GRADIENTS                         */
/* ============================================================ */

/* بک‌گراند اصلی سایت: ترکیبی از گرادیانت‌های نرم و عمق */
body {
  background-color: #fafafc;
  background-image: 
    radial-gradient(at 0% 0%, hsla(330, 80%, 96%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, hsla(280, 60%, 95%, 0.6) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(330, 50%, 93%, 0.8) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(350, 60%, 97%, 1) 0px, transparent 50%);
  background-attachment: fixed;
  background-size: cover;
  position: relative;
}

/* بافت نویز (Noise) بسیار ظریف برای حس لوکس بودن کاغذی */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* افکت شیشه‌ای واقعی برای هدر */
.fl-header {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(24px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03) !important;
}

/* کارت‌ها و پنل‌های شیشه‌ای */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(40, 36, 43, 0.04);
}

/* انیمیشن شناور شدن آرام برای نورها */
@keyframes floatSlow {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.animate-float-slow {
  animation: floatSlow 15s ease-in-out infinite;
}

.animate-float-slower {
  animation: floatSlow 20s ease-in-out infinite reverse;
}
/* ============================================================ */
/*  PREMIUM MESH GRADIENT (Optimized for Speed & Mobile)        */
/* ============================================================ */

/* استفاده از پس‌زمینه ثابت و بهینه روی body */
body {
  background-color: #fcfbfe !important; /* رنگ پایه بسیار روشن */
  background-image: 
    radial-gradient(circle at 15% 0%, rgba(255, 240, 247, 0.8), transparent 45%),
    radial-gradient(circle at 85% 0%, rgba(240, 235, 255, 0.7), transparent 45%),
    radial-gradient(circle at 100% 100%, rgba(255, 235, 245, 0.6), transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(255, 248, 240, 0.7), transparent 50%) !important;
  background-attachment: fixed !important;
  background-size: cover !important;
}

/* پوشش برای هدر شیشه‌ای */
.fl-header {
  background: rgba(255, 255, 255, 0.65) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 4px 20px rgba(198, 29, 112, 0.03) !important;
}

/* کارت‌های شیشه‌ای برای خوانایی بهتر */
.glass-panel, .glass-card {
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
}
/* ============================================================ */
/*  AURORA MESH BACKGROUND (GPU Accelerated)                    */
/* ============================================================ */

@keyframes floatOrb1 {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5vw, -5vh) scale(1.1); }
  66% { transform: translate(-3vw, 4vh) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes floatOrb2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-6vw, 5vh) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes floatOrb3 {
  0% { transform: translate(0, 0) scale(1); }
  40% { transform: translate(4vw, 6vh) scale(1.15); }
  80% { transform: translate(-2vw, -3vh) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.aurora-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  z-index: -10;
  opacity: 0.6;
  pointer-events: none;
  will-change: transform; /* باخبر کردن مرورگر برای استفاده از GPU */
}

.orb-pink {
  top: -10%; left: -10%;
  width: 50vw; height: 50vw;
  background: radial-gradient(circle, rgba(255, 218, 236, 0.9) 0%, rgba(255, 240, 247, 0) 70%);
  animation: floatOrb1 20s ease-in-out infinite;
}

.orb-purple {
  top: 20%; right: -10%;
  width: 45vw; height: 45vw;
  background: radial-gradient(circle, rgba(235, 225, 255, 0.8) 0%, rgba(248, 247, 250, 0) 70%);
  animation: floatOrb2 25s ease-in-out infinite;
}

.orb-peach {
  bottom: -10%; left: 20%;
  width: 55vw; height: 55vw;
  background: radial-gradient(circle, rgba(255, 235, 225, 0.8) 0%, rgba(255, 250, 248, 0) 70%);
  animation: floatOrb3 22s ease-in-out infinite;
}

/* در موبایل سایز اورب‌ها را کوچک‌تر و بلور را کمتر می‌کنیم تا لگ نزند */
@media (max-width: 768px) {
  .aurora-orb { filter: blur(60px); opacity: 0.5; }
  .orb-pink { width: 80vw; height: 80vw; }
  .orb-purple { width: 70vw; height: 70vw; }
  .orb-peach { width: 90vw; height: 90vw; }
}
/* ============================================================ */
/*  PREMIUM PERSIAN DATE PICKER (React-Multi-Date-Picker)       */
/* ============================================================ */

.rmdp-wrapper, .rmdp-calendar {
  border-radius: 16px !important;
  box-shadow: 0 15px 40px rgba(198, 29, 112, 0.15) !important;
  border: 1px solid #f2d7e5 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(16px) !important;
  padding: 10px !important;
  font-family: var(--font-vazirmatn), sans-serif !important;
}

.rmdp-header-values {
  color: #28242b !important;
  font-weight: 900 !important;
  font-size: 15px !important;
}

.rmdp-day.rmdp-selected span:not(.highlight) {
  background-color: #c61d70 !important;
  box-shadow: 0 0 0 3px rgba(198, 29, 112, 0.2) !important;
}

.rmdp-day:not(.rmdp-disabled):not(.rmdp-day-hidden) span:hover {
  background-color: #fff0f7 !important;
  color: #c61d70 !important;
}

.rmdp-day.rmdp-today span {
  background-color: #f8f7fa !important;
  color: #28242b !important;
  border: 1px solid #e9e5eb !important;
}

.rmdp-arrow-container:hover {
  background-color: #fff0f7 !important;
  box-shadow: none !important;
}

.rmdp-arrow {
  border-color: #c61d70 !important;
}

.rmdp-week-day {
  color: #c61d70 !important;
  font-weight: bold !important;
}

.rmdp-month-picker, .rmdp-year-picker {
  background: white !important;
  border-radius: 16px !important;
}
/* ============================================================ */
/*  TIME PICKER STYLES                                          */
/* ============================================================ */

.rmdp-time-picker {
  border-top: 1px solid #f2d7e5 !important;
  padding: 10px !important;
  margin-top: 10px !important;
  direction: ltr !important;
}

.rmdp-time-picker div input {
  background: #f8f7fa !important;
  border: 1px solid #e9e5eb !important;
  border-radius: 8px !important;
  color: #28242b !important;
  font-weight: bold !important;
  padding: 4px 8px !important;
  outline: none !important;
}

.rmdp-time-picker div input:focus {
  border-color: #c61d70 !important;
  box-shadow: 0 0 0 2px rgba(198, 29, 112, 0.1) !important;
}

.rmdp-time-picker .rmdp-time-picker-icon svg {
  fill: #c61d70 !important;
}

.rmdp-time-picker .rmdp-time-picker-am-pm {
  background: #fff0f7 !important;
  color: #c61d70 !important;
  border-radius: 6px !important;
  padding: 4px 8px !important;
  font-weight: bold !important;
  cursor: pointer !important;
}
/* ============================================================ */
/*  BIG & READABLE TIME PICKER STYLES                           */
/* ============================================================ */

.rmdp-time-picker {
  border-top: 1px solid #f2d7e5 !important;
  padding: 15px 10px !important;
  margin-top: 10px !important;
  direction: ltr !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 5px !important;
}

/* باکس‌های ورودی ساعت و دقیقه */
.rmdp-time-picker div input {
  background: #ffffff !important;
  border: 1px solid #e9e5eb !important;
  border-radius: 10px !important;
  color: #28242b !important; /* رنگ تیره برای دیده شدن */
  font-size: 18px !important; /* فونت بزرگ */
  font-weight: 900 !important;
  width: 50px !important; /* عرض بیشتر */
  height: 40px !important; /* ارتفاع بیشتر */
  text-align: center !important;
  padding: 0 !important;
  outline: none !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05) !important;
}

/* حالت فوکوس روی باکس‌ها */
.rmdp-time-picker div input:focus {
  border-color: #c61d70 !important;
  box-shadow: 0 0 0 3px rgba(198, 29, 112, 0.15) !important;
}

/* رنگ فلش‌های بالا و پایین */
.rmdp-time-picker .rmdp-time-picker-icon svg {
  fill: #c61d70 !important;
  width: 18px !important;
  height: 18px !important;
}

/* علامت دو نقطه بین ساعت و دقیقه */
.rmdp-time-picker div div {
  font-size: 20px !important;
  color: #28242b !important;
  font-weight: 900 !important;
  padding-bottom: 5px !important;
}

/* متن AM/PM (اگر وجود داشته باشد) */
.rmdp-time-picker .rmdp-time-picker-am-pm {
  background: #fff0f7 !important;
  color: #c61d70 !important;
  border-radius: 8px !important;
  padding: 6px 10px !important;
  font-size: 14px !important;
  font-weight: 900 !important;
  cursor: pointer !important;
  border: 1px solid #f2d7e5 !important;
}
/* ============================================================ */
/*  MOBILE OPTIMIZATIONS FOR NEW FEATURES                       */
/* ============================================================ */

/* بهینه‌سازی تقویم شمسی در موبایل */
@media (max-width: 768px) {
  .rmdp-wrapper {
    max-width: 90vw !important;
    transform: scale(0.9) !important;
    transform-origin: top right !important;
  }
  .rmdp-day, .rmdp-week-day {
    width: 34px !important;
    height: 34px !important;
  }
  .rmdp-time-picker {
    padding: 10px 5px !important;
  }
  .rmdp-time-picker div input {
    width: 40px !important;
    height: 35px !important;
    font-size: 16px !important;
  }
}

/* بهینه‌سازی مودال نمایش سریع (QuickView) در موبایل */
@media (max-width: 640px) {
  .quick-view-modal-content {
    max-height: 85vh !important;
    overflow-y: auto !important;
    border-radius: 24px !important;
  }
}

/* جلوگیری از اسکرول افقی در همه بخش‌های جدید */
.aurora-orb, .fl-bottom-nav, .promo-bar {
  max-width: 100vw;
  overflow: hidden;
}
/* ============================================================ */
/*  FIX MOBILE INPUT ZOOM                                       */
/* ============================================================ */
@media (max-width: 768px) {
  input, textarea, select {
    font-size: 16px !important;
  }
}
/* ============================================================ */
/*  DARK MODE (MIDNIGHT BEAUTY)                                 */
/* ============================================================ */

@custom-variant dark (&:is(.dark *));

.dark {
  /* Base Colors */
  --fl-canvas: #0b090c;
  --fl-soft: #131015;
  --fl-ink: #f2edf5;
  --fl-muted: #9e94a6;
  --fl-line: #2a232e;
  
  background-color: #0b090c !important;
  color: #f2edf5 !important;
}

/* Aurora Background for Dark Mode */
.dark body {
  background-color: #0b090c !important;
  background-image: none !important;
}

.dark .orb-pink {
  background: radial-gradient(circle, rgba(198, 29, 112, 0.15) 0%, rgba(11, 9, 12, 0) 70%) !important;
}

.dark .orb-purple {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(11, 9, 12, 0) 70%) !important;
}

.dark .orb-peach {
  background: radial-gradient(circle, rgba(225, 29, 72, 0.1) 0%, rgba(11, 9, 12, 0) 70%) !important;
}

/* Header */
.dark .fl-header {
  background: rgba(19, 16, 21, 0.75) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.dark .fl-icon-button {
  color: #9e94a6;
}
.dark .fl-icon-button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #f2edf5;
}

/* Cards & Panels */
.dark .glass-panel, 
.dark .glass-card,
.dark .bg-white {
  background: rgba(26, 22, 28, 0.7) !important;
  border-color: #2a232e !important;
  backdrop-filter: blur(16px) !important;
}

/* Text Overrides */
.dark .text-\[\#28242b\] { color: #f2edf5 !important; }
.dark .text-\[\#77717b\] { color: #9e94a6 !important; }
.dark .text-\[\#918a95\] { color: #706677 !important; }

/* Borders */
.dark .border-\[\#e9e5eb\] { border-color: #2a232e !important; }
.dark .divide-\[\#e9e5eb\] > :not([hidden]) ~ :not([hidden]) { border-color: #2a232e !important; }

/* Inputs */
.dark input, .dark textarea, .dark select {
  background: #131015 !important;
  border-color: #2a232e !important;
  color: #f2edf5 !important;
}
.dark input:focus, .dark textarea:focus {
  border-color: #c61d70 !important;
  background: #0b090c !important;
}

/* Specific Components */
.dark .fl-product-media {
  background: linear-gradient(145deg, #1a161c, #131015) !important;
  border-color: #2a232e !important;
}

.dark .fl-bottom-nav-inner {
  background: rgba(19, 16, 21, 0.85) !important;
  border-color: rgba(255, 255, 255, 0.05) !important;
}

.dark .fl-bottom-nav-item {
  color: #706677;
}

.dark .fl-bottom-nav-item.is-active {
  color: #ff4d94;
}

.dark .fl-bottom-nav-pill {
  background: linear-gradient(135deg, rgba(198, 29, 112, 0.2) 0%, rgba(198, 29, 112, 0.1) 100%) !important;
  border-color: rgba(198, 29, 112, 0.3) !important;
}

/* Admin Sidebar */
.dark aside {
  background: rgba(19, 16, 21, 0.8) !important;
  border-left-color: #2a232e !important;
}

.dark .admin-bottom-nav-inner {
  background: rgba(19, 16, 21, 0.9) !important;
  border-color: #2a232e !important;
}
/* ============================================================ */
/*  PRINT MEDIA QUERIES FOR INVOICES & LABELS                   */
/* ============================================================ */
@media print {
  @page {
    size: A4;
    margin: 15mm;
  }
  
  body {
    background: white !important;
  }

  /* مخفی کردن همه چیز */
  body * {
    visibility: hidden;
  }

  /* فقط فاکتور قابل مشاهده باشد */
  #print-area, #print-area * {
    visibility: visible;
  }

  /* موقعیت فاکتور */
  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* مخفی کردن المان‌هایی که نباید چاپ شوند */
  .no-print, header, footer, nav, .fl-bottom-nav, .admin-bottom-nav, aside {
    display: none !important;
  }
}
/* ============================================================ */
/*  ACCESSIBILITY & UX POLISH                                   */
/* ============================================================ */

/* Focus visible - برای کاربرانی که با کیبورد ناوبری می‌کنند */
*:focus-visible {
  outline: 2px solid #c61d70 !important;
  outline-offset: 3px !important;
  border-radius: 8px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid #c61d70 !important;
  outline-offset: 3px !important;
}

/* اسکرول نرم برای همه صفحات */
html {
  scroll-behavior: smooth;
}

/* کاهش حرکت برای کاربران با prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* اسکرول‌بار شیک سفارشی */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #fafafc;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #c61d70, #e84e9e);
  border-radius: 99px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #a9155d, #c61d70);
}
/* ============================================================ */
/*  MICRO-INTERACTIONS & SPRING ANIMATIONS                      */
/* ============================================================ */

/* انیمیشن Spring برای بج سبد */
@keyframes cartBadgeSpring {
  0% { transform: scale(0) rotate(-20deg); }
  50% { transform: scale(1.3) rotate(5deg); }
  70% { transform: scale(0.9) rotate(-2deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.animate-cart-badge {
  animation: cartBadgeSpring 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* انیمیشن Reveal برای کارت‌ها */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

/* انیمیشن Ripple برای کلیک (تاثیر اپل) */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
}

.btn-ripple:active::after {
  animation: ripple 0.6s ease-out;
}

/* Glow pulse برای دکمه‌های مهم */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(198, 29, 112, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(198, 29, 112, 0);
  }
}

.animate-glow-pulse {
  animation: glowPulse 2s ease-in-out infinite;
}

/* Shimmer loading effect */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.shimmer {
  background: linear-gradient(90deg, #f0edf1 0%, #f8f7fa 50%, #f0edf1 100%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}

/* احترام به prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .animate-cart-badge,
  .animate-fade-up,
  .animate-glow-pulse,
  .shimmer {
    animation: none !important;
  }
}
/* ===== CHAT SCROLLBAR (v3) ===== */
.chat-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
.chat-scroll::-webkit-scrollbar-track { background: transparent; }
.chat-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #f4b7d5, #e84e9e);
  border-radius: 99px;
  opacity: 0.5;
}
.chat-scroll::-webkit-scrollbar-thumb:hover { background: #c61d70; }
.chat-scroll { scrollbar-width: thin; scrollbar-color: #f4b7d5 transparent; }
.chat-scroll-hide { scrollbar-width: none; -ms-overflow-style: none; }
.chat-scroll-hide::-webkit-scrollbar { display: none; }



==========================================================================================
FILE [250/255] src\app\globals.css
SIZE 72256 bytes
==========================================================================================
@import "tailwindcss";

@theme {
  /* Fatemeh Beauty Land — light-first modern pink identity */
  --color-canvas: #ffffff;
  --color-background: #ffffff;
  --color-background-secondary: #f8f7fa;
  --color-surface: #ffffff;
  --color-chalk: #f8f7fa;
  --color-oat: #fff2f8;
  --color-beige: #f8f3f6;
  --color-ink: #28242b;
  --color-foreground: #28242b;
  --color-muted: #77717b;
  --color-muted-foreground: #77717b;
  --color-line: #ece8ed;
  --color-border: #e9e5eb;
  --color-sage: #c61d70;
  --color-sage-dark: #a9155d;
  --color-rose: #f4b7d5;
  --color-terracotta: #c84f70;
  --color-gold: #c61d70;
  --color-primary: #c61d70;
  --color-primary-foreground: #ffffff;

  --font-sans: var(--font-vazirmatn), Tahoma, Arial, sans-serif;
  --font-serif: var(--font-vazirmatn), Tahoma, Arial, sans-serif;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 22px;
  --radius-2xl: 28px;

  --shadow-soft: 0 2px 12px rgba(37, 27, 39, 0.045);
  --shadow-card: 0 12px 34px rgba(67, 35, 57, 0.075);
  --shadow-pink: 0 10px 26px rgba(198, 29, 112, 0.16);
  --shadow-glass: 0 8px 28px rgba(40, 36, 43, 0.06);
  --shadow-float: 0 18px 42px rgba(40, 36, 43, 0.09);
}

:root {
  color-scheme: light;
  --fl-pink: #c61d70;
  --fl-pink-hover: #a9155d;
  --fl-pink-soft: #fff0f7;
  --fl-pink-tint: #fce5f0;
  --fl-ink: #28242b;
  --fl-muted: #77717b;
  --fl-line: #e9e5eb;
  --fl-canvas: #ffffff;
  --fl-soft: #f8f7fa;
}

@layer base {
  * { box-sizing: border-box; }

  html {
    scroll-behavior: smooth;
    background: var(--fl-canvas);
    text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
  }

  body {
    min-height: 100vh;
    margin: 0;
    background: var(--fl-canvas);
    color: var(--fl-ink);
    font-family: var(--font-vazirmatn), Tahoma, Arial, sans-serif;
    font-size: 14px;
    line-height: 1.85;
    font-feature-settings: "ss01", "ss02";
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }

  button, input, textarea, select { font: inherit; }
  button { cursor: pointer; }
  button:disabled { cursor: not-allowed; }
  img { max-width: 100%; }
  a { color: inherit; text-decoration: none; }
  ::selection { background: rgba(198, 29, 112, 0.16); color: #5a1038; }

  :focus-visible {
    outline: 3px solid rgba(198, 29, 112, 0.42);
    outline-offset: 3px;
  }
}

@layer utilities {
  .container-custom {
    width: min(100% - 40px, 1280px);
    margin-inline: auto;
  }

  .glass-panel,
  .glass-panel-strong {
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid var(--fl-line);
    box-shadow: var(--shadow-soft);
    backdrop-filter: none;
  }

  .btn-primary {
    display: inline-flex;
    min-height: 46px;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 0 21px;
    border: 1px solid var(--fl-pink);
    border-radius: 12px;
    background: var(--fl-pink);
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    transition: background .18s ease, border-color .18s ease, transform .18s ease, box-shadow .18s ease;
  }
  .btn-primary:hover {
    background: var(--fl-pink-hover);
    border-color: var(--fl-pink-hover);
    box-shadow: var(--shadow-pink);
    transform: translateY(-1px);
  }
  .btn-primary:active { transform: translateY(0); }
  .btn-primary:disabled { opacity: .52; box-shadow: none; transform: none; }

  .btn-secondary {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 19px;
    border: 1px solid var(--fl-line);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
    color: var(--fl-ink);
    font-size: 13px;
    font-weight: 600;
    transition: border-color .18s ease, background .18s ease, color .18s ease;
  }
  .btn-secondary:hover { border-color: #e7a2c4; background: var(--fl-pink-soft); color: var(--fl-pink-hover); }

  .btn-glass {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 19px;
    border: 1px solid rgba(198, 29, 112, .18);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
    color: var(--fl-pink-hover);
    font-size: 13px;
    font-weight: 600;
    transition: background .18s ease, border-color .18s ease;
  }
  .btn-glass:hover { background: var(--fl-pink-soft); border-color: rgba(198, 29, 112, .34); }

  .editorial-heading {
    font-family: var(--font-vazirmatn), Tahoma, Arial, sans-serif;
    font-weight: 700;
    letter-spacing: -0.035em;
    line-height: 1.65;
  }

  .label-caps {
    color: var(--fl-pink);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .12em;
  }

  .noise-overlay { background-image: none; }
  .divider-line {
    width: 34px;
    height: 3px;
    border-radius: 99px;
    background: linear-gradient(90deg, #c61d70, #f0a4c8);
  }
  .scrollbar-hide { scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
}

/* -------------------------------------------------------------------------- */
/* Storefront shell                                                           */
/* -------------------------------------------------------------------------- */
.fl-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid rgba(233, 229, 235, .88);
  background: rgba(255, 255, 255, .94);
  backdrop-filter: blur(16px);
}
.fl-header-inner {
  display: flex;
  min-height: 74px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.fl-brand { display: inline-flex; align-items: center; gap: 10px; flex-shrink: 0; }
.fl-brand-mark {
  position: relative;
  width: 39px;
  height: 39px;
  overflow: hidden;
  border: 1px solid #f1dce7;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
}
.fl-brand-name { color: var(--fl-ink); font-size: 15px; font-weight: 800; line-height: 1.25; }
.fl-brand-latin { margin-top: 2px; color: #a49ba5; font-size: 8px; font-weight: 700; letter-spacing: .19em; direction: ltr; }
.fl-nav { display: flex; align-items: center; gap: clamp(16px, 2.4vw, 34px); }
.fl-nav a { position: relative; color: #625c66; font-size: 12px; font-weight: 600; transition: color .18s ease; }
.fl-nav a:hover, .fl-nav a[aria-current="page"] { color: var(--fl-pink); }
.fl-nav a[aria-current="page"]::after { position: absolute; right: 0; bottom: -9px; left: 0; height: 2px; border-radius: 2px; background: var(--fl-pink); content: ""; }
.fl-icon-button {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 12px;
  background: transparent;
  color: #625c66;
  transition: background .18s ease, color .18s ease, border-color .18s ease;
}
.fl-icon-button:hover { border-color: #f2d4e4; background: var(--fl-pink-soft); color: var(--fl-pink); }
.fl-cart-count { position: absolute; top: 0; right: 0; display: grid; min-width: 17px; height: 17px; place-items: center; padding-inline: 3px; border: 2px solid #fff; border-radius: 99px; background: var(--fl-pink); color: #fff; font-size: 9px; font-weight: 800; line-height: 1; }
.fl-search-panel { position: absolute; top: calc(100% + 8px); left: max(20px, calc((100vw - 1280px) / 2)); z-index: 60; width: min(430px, calc(100vw - 40px)); padding: 14px; border: 1px solid var(--fl-line); border-radius: 16px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); box-shadow: 0 18px 50px rgba(40, 25, 39, .12); }
.fl-search-field { display: flex; align-items: center; gap: 10px; padding-inline: 12px; border: 1px solid var(--fl-line); border-radius: 11px; background: #fbfafc; }
.fl-search-field input { width: 100%; min-width: 0; height: 44px; border: 0; outline: 0; background: transparent; color: var(--fl-ink); font-size: 13px; }
.fl-mobile-nav { position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column; background: rgba(255,255,255,.98); }
.fl-mobile-nav-head { display: flex; min-height: 70px; align-items: center; justify-content: space-between; padding-inline: 20px; border-bottom: 1px solid var(--fl-line); }
.fl-mobile-nav-links { display: grid; gap: 4px; padding: 18px 20px; }
.fl-mobile-nav-links a { padding: 15px 5px; border-bottom: 1px solid #f0edf1; color: var(--fl-ink); font-size: 15px; font-weight: 650; }

/* -------------------------------------------------------------------------- */
/* Homepage                                                                    */
/* -------------------------------------------------------------------------- */
.fl-home-hero { position: relative; overflow: hidden; padding-block: clamp(36px, 6vw, 74px) clamp(42px, 6vw, 76px); }
.fl-hero-grid { display: grid; grid-template-columns: minmax(0, .94fr) minmax(0, 1.06fr); align-items: center; gap: clamp(30px, 5vw, 70px); }
.fl-eyebrow { display: inline-flex; align-items: center; gap: 8px; color: var(--fl-pink); font-size: 10px; font-weight: 800; letter-spacing: .13em; }
.fl-eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--fl-pink); box-shadow: 0 0 0 4px rgba(198,29,112,.10); }
.fl-hero-title { max-width: 520px; margin-top: 18px; color: var(--fl-ink); font-size: clamp(27px, 3.1vw, 39px); font-weight: 750; letter-spacing: -.045em; line-height: 1.72; }
.fl-hero-title span { color: var(--fl-pink); }
.fl-hero-copy { max-width: 450px; margin-top: 14px; color: var(--fl-muted); font-size: 14px; line-height: 2.15; }
.fl-hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 26px; }
.fl-hero-meta { display: flex; flex-wrap: wrap; gap: 18px; margin-top: 27px; color: #817984; font-size: 10px; }
.fl-hero-meta span { display: inline-flex; align-items: center; gap: 6px; }
.fl-hero-meta svg { color: var(--fl-pink); }
.fl-hero-art { position: relative; min-height: 420px; overflow: hidden; border: 1px solid #f4d8e7; border-radius: 26px; background: radial-gradient(ellipse at 68% 25%, rgba(255,255,255,.8) 0 12%, transparent 42%), radial-gradient(ellipse at 22% 80%, rgba(239,143,190,.4), transparent 38%), linear-gradient(135deg, rgba(255,244,249,0.7) 0%, rgba(251,229,240,0.7) 48%, rgba(248,241,247,0.7) 100%); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.8); isolation: isolate; }
.fl-hero-art::before, .fl-hero-art::after { position: absolute; z-index: -1; border: 1px solid rgba(198,29,112,.14); border-radius: 50%; content: ""; }
.fl-hero-art::before { width: 360px; height: 360px; top: 30px; left: 50%; transform: translateX(-50%); box-shadow: 0 0 0 30px rgba(255,255,255,.16), 0 0 0 70px rgba(255,255,255,.11); }
.fl-hero-art::after { width: 230px; height: 230px; right: -85px; bottom: -88px; background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.95), rgba(226,92,155,.18) 65%, rgba(198,29,112,.07)); filter: blur(.2px); }
.fl-hero-art-top { position: absolute; top: 24px; right: 25px; left: 25px; display: flex; align-items: center; justify-content: space-between; color: #a44a78; font-size: 9px; font-weight: 800; letter-spacing: .14em; }
.fl-hero-art-mark { position: absolute; top: 50%; left: 50%; display: grid; width: 174px; height: 174px; place-items: center; overflow: hidden; transform: translate(-50%, -50%); border: 8px solid rgba(255,255,255,.8); border-radius: 50%; background: rgba(255,255,255,.72); box-shadow: 0 28px 75px rgba(151,41,99,.16), inset 0 0 0 1px rgba(198,29,112,.09); }
.fl-hero-art-mark img { width: 100%; height: 100%; object-fit: cover; }
.fl-hero-art-caption { position: absolute; right: 24px; bottom: 22px; left: 24px; display: flex; align-items: end; justify-content: space-between; gap: 20px; }
.fl-hero-art-caption strong { color: #71304f; font-size: 13px; font-weight: 800; }
.fl-hero-art-caption span { color: #9c6882; font-size: 10px; }
.fl-orbit { position: absolute; top: 50%; left: 50%; width: 300px; height: 112px; transform: translate(-50%, -50%) rotate(-28deg); border: 1px solid rgba(198,29,112,.22); border-radius: 50%; }
.fl-orbit::after { position: absolute; top: 11px; right: 30px; width: 9px; height: 9px; border-radius: 50%; background: #d94791; box-shadow: 0 0 0 7px rgba(217,71,145,.12); content: ""; }
.fl-feature-strip { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 12px; padding-block: 18px; border-block: 1px solid var(--fl-line); }
.fl-feature { display: flex; align-items: center; justify-content: center; gap: 10px; min-width: 0; color: #5e5862; font-size: 11px; font-weight: 650; }
.fl-feature-icon { display: grid; width: 34px; height: 34px; flex-shrink: 0; place-items: center; border: 1px solid #f2d7e5; border-radius: 11px; background: #fff7fb; color: var(--fl-pink); }
.fl-section { padding-block: clamp(42px, 6vw, 70px); }
.fl-section-head { display: flex; align-items: end; justify-content: space-between; gap: 18px; margin-bottom: 24px; }
.fl-section-kicker { color: var(--fl-pink); font-size: 10px; font-weight: 800; letter-spacing: .11em; }
.fl-section-title { margin-top: 5px; color: var(--fl-ink); font-size: clamp(20px, 2.1vw, 25px); font-weight: 750; letter-spacing: -.035em; line-height: 1.7; }
.fl-section-note { margin-top: 4px; color: var(--fl-muted); font-size: 12px; line-height: 1.9; }
.fl-text-link { display: inline-flex; align-items: center; gap: 7px; color: var(--fl-pink); font-size: 12px; font-weight: 750; white-space: nowrap; }
.fl-text-link:hover { color: var(--fl-pink-hover); }
.fl-product-grid { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 16px; }
.fl-product-card { display: flex; min-width: 0; flex-direction: column; }
.fl-product-media { position: relative; aspect-ratio: 4 / 4.65; overflow: hidden; border: 1px solid #eee9ef; border-radius: 17px; background: linear-gradient(145deg, #fcfafc, #f7f2f7); }
.fl-product-media img { padding: 12px; object-fit: contain; transition: transform .45s cubic-bezier(.2,.7,.2,1); }
.fl-product-card:hover .fl-product-media img { transform: scale(1.045); }
.fl-product-placeholder { position: absolute; inset: 0; display: grid; place-items: center; background: radial-gradient(circle at 50% 42%, #fff 0 15%, transparent 58%), linear-gradient(145deg, #fff7fb, #f6eef4); color: #d28aac; }
.fl-product-placeholder::before { width: 94px; height: 94px; border: 1px solid rgba(198,29,112,.17); border-radius: 50%; box-shadow: 0 0 0 16px rgba(255,255,255,.36), 0 0 0 34px rgba(255,255,255,.22); content: ""; }
.fl-product-info { padding: 12px 2px 0; }
.fl-product-name { overflow: hidden; color: var(--fl-ink); font-size: 13px; font-weight: 750; line-height: 1.8; text-overflow: ellipsis; white-space: nowrap; }
.fl-product-desc { min-height: 22px; margin-top: 2px; overflow: hidden; color: #8a838d; font-size: 10px; line-height: 1.8; text-overflow: ellipsis; white-space: nowrap; }
.fl-product-bottom { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 9px; }
.fl-product-price { color: var(--fl-ink); font-size: 12px; font-weight: 800; }
.fl-product-status { color: #27835c; font-size: 10px; font-weight: 700; }
.fl-product-status.is-out { color: #a47c86; }
.fl-product-view { display: inline-flex; align-items: center; gap: 5px; margin-top: 11px; color: var(--fl-pink); font-size: 10px; font-weight: 750; }
.fl-editorial-panel { position: relative; display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); align-items: center; gap: clamp(24px, 5vw, 65px); overflow: hidden; padding: clamp(24px, 4.5vw, 52px); border: 1px solid #f0d8e5; border-radius: 23px; background: linear-gradient(115deg, #fff 0%, #fff8fc 56%, #fff0f7 100%); }
.fl-editorial-visual { position: relative; min-height: 245px; overflow: hidden; border-radius: 18px; background: radial-gradient(circle at 65% 30%, #fff 0 8%, transparent 33%), radial-gradient(circle at 30% 75%, rgba(224,103,164,.25), transparent 40%), linear-gradient(145deg, #f9e8f1, #fff7fb); }
.fl-editorial-visual::before { position: absolute; top: 50%; left: 50%; width: 170px; height: 170px; transform: translate(-50%,-50%); border: 1px solid rgba(198,29,112,.22); border-radius: 50%; box-shadow: 0 0 0 22px rgba(255,255,255,.28), 0 0 0 48px rgba(255,255,255,.2); content: ""; }
.fl-editorial-visual::after { position: absolute; top: 17%; left: 23%; width: 48px; height: 48px; border: 1px solid rgba(198,29,112,.22); border-radius: 50%; background: rgba(255,255,255,.68); box-shadow: 0 12px 25px rgba(198,29,112,.12); content: ""; }
.fl-editorial-copy { max-width: 490px; }
.fl-editorial-copy h2 { margin-top: 12px; color: var(--fl-ink); font-size: clamp(20px,2.2vw,27px); font-weight: 750; line-height: 1.85; }
.fl-editorial-copy p { margin-top: 10px; color: var(--fl-muted); font-size: 13px; line-height: 2.15; }
.fl-faq-list { display: grid; gap: 9px; }
.fl-faq-item { overflow: hidden; border: 1px solid var(--fl-line); border-radius: 13px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); }
.fl-faq-item summary { display: flex; min-height: 54px; align-items: center; justify-content: space-between; gap: 18px; padding: 13px 17px; color: var(--fl-ink); cursor: pointer; font-size: 12px; font-weight: 700; list-style: none; }
.fl-faq-item summary::-webkit-details-marker { display: none; }
.fl-faq-item summary::after { display: grid; width: 24px; height: 24px; flex-shrink: 0; place-items: center; border-radius: 8px; background: var(--fl-pink-soft); color: var(--fl-pink); content: "+"; font-size: 16px; font-weight: 500; }
.fl-faq-item[open] summary::after { content: "−"; }
.fl-faq-answer { padding: 0 17px 16px; color: var(--fl-muted); font-size: 12px; line-height: 2; }

/* -------------------------------------------------------------------------- */
/* Product catalog and detail                                                  */
/* -------------------------------------------------------------------------- */
.fl-page-intro { padding-block: 36px 30px; border-bottom: 1px solid var(--fl-line); background: linear-gradient(110deg, #fff 0%, #fff8fc 100%); }
.fl-page-title { margin-top: 8px; color: var(--fl-ink); font-size: clamp(23px, 2.5vw, 30px); font-weight: 800; letter-spacing: -.035em; line-height: 1.7; }
.fl-page-description { max-width: 620px; margin-top: 5px; color: var(--fl-muted); font-size: 13px; line-height: 2; }
.fl-input { width: 100%; min-height: 44px; padding: 0 13px; border: 1px solid var(--fl-line); border-radius: 11px; outline: none; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); color: var(--fl-ink); font-size: 13px; transition: border-color .18s ease, box-shadow .18s ease; }
.fl-input:focus { border-color: #db78a9; box-shadow: 0 0 0 3px rgba(198,29,112,.09); }
.fl-filter-chip { display: inline-flex; min-height: 36px; align-items: center; padding: 0 13px; border: 1px solid var(--fl-line); border-radius: 10px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); color: #6e6671; font-size: 11px; font-weight: 650; transition: .18s ease; }
.fl-filter-chip:hover, .fl-filter-chip.is-active { border-color: #d95a98; background: var(--fl-pink-soft); color: var(--fl-pink-hover); }
.fl-breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; color: #8b8490; font-size: 10px; }
.fl-breadcrumb a:hover { color: var(--fl-pink); }
.fl-detail-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, .92fr); align-items: start; gap: clamp(28px, 5vw, 70px); }
.fl-gallery-main { position: relative; aspect-ratio: 1 / 1; overflow: hidden; border: 1px solid var(--fl-line); border-radius: 20px; background: linear-gradient(145deg, #fff, #faf7fa); }
.fl-gallery-main img { padding: 20px; object-fit: contain; }
.fl-gallery-thumbs { display: flex; gap: 9px; overflow-x: auto; padding: 3px 1px 7px; }
.fl-gallery-thumb { position: relative; width: 70px; height: 70px; flex-shrink: 0; overflow: hidden; border: 1px solid var(--fl-line); border-radius: 11px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); }
.fl-gallery-thumb.is-active { border: 2px solid var(--fl-pink); box-shadow: 0 0 0 3px rgba(198,29,112,.08); }
.fl-gallery-thumb img { padding: 4px; object-fit: contain; }
.fl-detail-title { color: var(--fl-ink); font-size: clamp(23px, 2.5vw, 31px); font-weight: 800; letter-spacing: -.035em; line-height: 1.75; }
.fl-detail-description { margin-top: 10px; color: var(--fl-muted); font-size: 13px; line-height: 2.15; }
.fl-price-box { padding-block: 18px; border-block: 1px solid var(--fl-line); }
.fl-price { color: var(--fl-ink); font-size: 20px; font-weight: 850; }
.fl-detail-section { padding: 19px; border: 1px solid var(--fl-line); border-radius: 15px; background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); }
.fl-spec-row { display: flex; justify-content: space-between; gap: 18px; padding-block: 10px; border-bottom: 1px solid #f0edf1; font-size: 12px; }
.fl-spec-row:last-child { border-bottom: 0; }
.fl-muted-note { padding: 14px 16px; border: 1px solid #f2dce8; border-radius: 12px; background: #fff8fc; color: #7d586a; font-size: 11px; line-height: 2; }
.fl-empty-state { padding: 65px 20px; border: 1px dashed #e6d9e2; border-radius: 18px; background: #fffbfd; text-align: center; }

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */
.fl-footer { margin-top: 50px; border-top: 1px solid var(--fl-line); background: #fbfafc; }
.fl-footer-main { display: grid; grid-template-columns: minmax(0,1.5fr) repeat(2,minmax(0,1fr)); gap: 45px; padding-block: 42px; }
.fl-footer-title { margin-bottom: 12px; color: var(--fl-ink); font-size: 12px; font-weight: 800; }
.fl-footer-link { color: #77717b; font-size: 11px; transition: color .18s ease; }
.fl-footer-link:hover { color: var(--fl-pink); }
.fl-footer-bottom { display: flex; min-height: 58px; align-items: center; justify-content: space-between; gap: 15px; border-top: 1px solid var(--fl-line); color: #918a95; font-size: 10px; }

@media (max-width: 900px) {
  .fl-hero-grid { grid-template-columns: minmax(0,1fr) minmax(0,1fr); gap: 25px; }
  .fl-hero-art { min-height: 360px; }
  .fl-product-grid { grid-template-columns: repeat(2,minmax(0,1fr)); gap: 23px 15px; }
  .fl-detail-grid { gap: 28px; }
}

@media (max-width: 767px) {
  .fl-nav { display: none; }
}

@media (max-width: 680px) {
  .container-custom { width: min(100% - 30px, 1280px); }
  .fl-header-inner { min-height: 64px; gap: 10px; }
  .fl-brand-mark { width: 35px; height: 35px; }
  .fl-brand-name { font-size: 13px; }
  .fl-nav { display: none; }
  .fl-search-panel { right: 15px; left: 15px; width: auto; }
  .fl-hero-grid { grid-template-columns: 1fr; gap: 24px; }
  .fl-hero-copy-wrap { order: 2; text-align: right; }
  .fl-hero-art { min-height: 315px; order: 1; border-radius: 20px; }
  .fl-hero-art-mark { width: 135px; height: 135px; }
  .fl-orbit { width: 240px; height: 90px; }
  .fl-hero-title { max-width: 100%; margin-top: 12px; font-size: 27px; line-height: 1.8; }
  .fl-hero-copy { font-size: 13px; }
  .fl-hero-actions { margin-top: 20px; }
  .fl-hero-actions a { flex: 1; }
  .fl-hero-meta { margin-top: 19px; gap: 12px; }
  .fl-feature-strip { gap: 6px; padding-block: 13px; }
  .fl-feature { flex-direction: column; gap: 5px; text-align: center; font-size: 9px; }
  .fl-feature-icon { width: 31px; height: 31px; border-radius: 10px; }
  .fl-section { padding-block: 40px; }
  .fl-section-head { align-items: start; margin-bottom: 18px; }
  .fl-section-title { font-size: 20px; }
  .fl-product-grid { gap: 21px 12px; }
  .fl-product-media { border-radius: 13px; }
  .fl-product-info { padding-top: 9px; }
  .fl-product-name { font-size: 12px; }
  .fl-product-desc { font-size: 9px; }
  .fl-product-bottom { align-items: start; flex-direction: column; gap: 3px; }
  .fl-product-price { font-size: 11px; }
  .fl-editorial-panel { grid-template-columns: 1fr; gap: 20px; border-radius: 18px; }
  .fl-editorial-visual { min-height: 190px; }
  .fl-footer-main { grid-template-columns: 1fr 1fr; gap: 28px 20px; padding-block: 32px; }
  .fl-footer-brand { grid-column: 1 / -1; }
  .fl-footer-bottom { align-items: flex-start; flex-direction: column; justify-content: center; padding-block: 15px; }
  .fl-detail-grid { grid-template-columns: 1fr; }
  .fl-detail-title { font-size: 24px; }
  .fl-gallery-main { border-radius: 16px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}



/* ============================================================ */
/* Mobile Bottom Navigation — Premium iOS-Style                 */
/* ============================================================ */
.fl-bottom-nav {
  position: fixed;
  bottom: max(16px, env(safe-area-inset-bottom, 16px));
  left: 16px;
  right: 16px;
  z-index: 45;
  pointer-events: none;
  animation: flNavAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fl-bottom-nav-inner {
  position: relative;
  display: flex;
  align-items: stretch;
  height: 68px;
  padding: 5px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px) saturate(190%);
  -webkit-backdrop-filter: blur(30px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 26px;
  box-shadow:
    0 24px 60px -12px rgba(40, 36, 43, 0.25),
    0 8px 20px -4px rgba(40, 36, 43, 0.10),
    inset 0 1px 1px rgba(255, 255, 255, 1);
  pointer-events: auto;
  isolation: isolate;
  overflow: hidden;
}

/* پیل شناور پشت آیتم فعال */
.fl-bottom-nav-pill {
  position: absolute;
  top: 5px;
  bottom: 5px;
  background: linear-gradient(135deg, #fff0f7 0%, #fce5f0 100%);
  border: 1px solid rgba(198, 29, 112, 0.18);
  border-radius: 20px;
  box-shadow:
    0 4px 12px -2px rgba(198, 29, 112, 0.20),
    0 1px 3px rgba(198, 29, 112, 0.08),
    inset 0 1px 1px rgba(255, 255, 255, 0.9);
  transition:
    transform 0.45s cubic-bezier(0.34, 1.3, 0.64, 1),
    width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  z-index: 0;
  pointer-events: none;
}

/* آیتم‌ها */
.fl-bottom-nav-item {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 4px 2px;
  color: #918a95;
  border-radius: 20px;
  transition:
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
  -webkit-tap-highlight-color: transparent;
  text-decoration: none;
}

.fl-bottom-nav-item:active {
  transform: scale(0.94);
}

.fl-bottom-nav-item.is-active {
  color: #c61d70;
}

.fl-bottom-nav-icon-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fl-bottom-nav-item.is-active .fl-bottom-nav-icon-wrap {
  transform: translateY(-1px) scale(1.05);
}

.fl-bottom-nav-label {
  font-size: 10px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.02em;
  transition: font-weight 0.2s ease;
}

.fl-bottom-nav-item.is-active .fl-bottom-nav-label {
  font-weight: 800;
}

/* نشان سبد خرید */
.fl-bottom-nav-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #e6367e 0%, #c61d70 100%);
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  line-height: 1;
  border-radius: 99px;
  border: 1.5px solid #fff;
  box-shadow:
    0 3px 8px rgba(198, 29, 112, 0.45),
    inset 0 1px 1px rgba(255, 255, 255, 0.3);
  animation: flNavBadgePop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes flNavAppear {
  from {
    opacity: 0;
    transform: translateY(120%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes flNavBadgePop {
  0% { opacity: 0; transform: scale(0) rotate(-20deg); }
  60% { opacity: 1; transform: scale(1.3) rotate(5deg); }
  100% { opacity: 1; transform: scale(1) rotate(0); }
}

/* فاصله امن برای موبایل */
@media (max-width: 767px) {
  body {
    padding-bottom: 100px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fl-bottom-nav,
  .fl-bottom-nav-pill,
  .fl-bottom-nav-item,
  .fl-bottom-nav-icon-wrap,
  .fl-bottom-nav-badge {
    animation: none !important;
    transition: none !important;
  }
}



/* ============================================================ */
/* NO HORIZONTAL SCROLL — GLOBAL PROTECTION                     */
/* ============================================================ */
html, body {
  max-width: 100vw;
  overflow-x: hidden !important;
}

@media (max-width: 767px) {
  /* همه عناصر از عرض صفحه بیرون نزنند */
  * {
    max-width: 100%;
  }

  /* عناصر flex و grid بدون min-width: 0 کوچک نمی‌شوند */
  .flex > *, .grid > * {
    min-width: 0;
  }

  /* تصاویر و ویدیوها هرگز از عرض صفحه بزرگ‌تر نباشند */
  img, video, iframe, svg {
    max-width: 100%;
    height: auto;
  }

  /* کدهای طولانی خط بشکنند */
  pre, code {
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* متن‌های طولانی بشکنند */
  p, h1, h2, h3, h4, h5, h6, span, a, div {
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  /* همه ورودی‌ها ۱۶ پیکسل تا iOS زوم نکند */
  input, textarea, select {
    font-size: 16px !important;
  }
}

/* ============================================================ */
/* ADMIN TABLES — MOBILE CARD LAYOUT                            */
/* ============================================================ */
@media (max-width: 767px) {
  .admin-table-wrapper {
    overflow-x: visible !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }
  .admin-table {
    min-width: 0 !important;
    width: 100% !important;
  }
  .admin-table thead {
    display: none !important;
  }
  .admin-table tbody tr {
    display: block !important;
    margin-bottom: 1rem !important;
    border: 1px solid #eee9ef !important;
    border-radius: 16px !important;
    background: #fff !important;
    overflow: hidden !important;
    box-shadow: 0 4px 16px rgba(40, 36, 43, 0.06) !important;
    width: 100% !important;
  }
  .admin-table tbody td {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    padding: 0.875rem 1rem !important;
    border: none !important;
    border-bottom: 1px solid #f5f0f2 !important;
    font-size: 0.875rem !important;
    white-space: normal !important;
    gap: 1rem !important;
    width: 100% !important;
  }
  .admin-table tbody td:last-child {
    border-bottom: none !important;
    justify-content: flex-end !important;
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
    background: #fbfafc !important;
  }
  .admin-table tbody td::before {
    content: attr(data-label) !important;
    font-weight: 600 !important;
    color: #77717b !important;
    font-size: 0.8125rem !important;
    flex-shrink: 0 !important;
  }
}

/* ============================================================ */
/* SAFE AREA FOR BOTTOM ELEMENTS                                */
/* ============================================================ */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .safe-bottom {
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom)) !important;
  }
}

/* ============================================================ */
/* ADMIN MOBILE BOTTOM NAV — PREMIUM INFINITY                   */
/* ============================================================ */

@media (max-width: 767px) {
  /* فاصله از پایین برای اینکه محتوا زیر نوار پنهان نشود */
  body {
    padding-bottom: calc(84px + env(safe-area-inset-bottom)) !important;
  }
}

.admin-bottom-nav {
  position: fixed;
  bottom: max(12px, env(safe-area-inset-bottom, 12px));
  left: 12px;
  right: 12px;
  z-index: 45;
  animation: adminNavSlideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.admin-bottom-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 64px;
  padding: 6px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(240, 220, 232, 0.8);
  border-radius: 22px;
  box-shadow: 
    0 16px 40px -8px rgba(40, 36, 43, 0.18), 
    0 2px 8px -2px rgba(40, 36, 43, 0.06), 
    inset 0 1px 1px rgba(255, 255, 255, 0.95);
}

.admin-bottom-nav-item {
  position: relative; /* اصلاح اصلی: برای نگه داشتن badge در جای درست */
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  height: 52px;
  color: #8a838d;
  border-radius: 16px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}

.admin-bottom-nav-item:active {
  transform: scale(0.92);
}

.admin-bottom-nav-item.is-active {
  color: #c61d70;
  background: rgba(198, 29, 112, 0.08); /* پس‌زمینه صورتی ملایم برای تب فعال */
}

.admin-bottom-label {
  font-size: 9.5px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.01em;
}

.admin-bottom-nav-item.is-active .admin-bottom-label {
  font-weight: 800;
}

.admin-bottom-nav-item.is-active svg {
  transform: translateY(-1px) scale(1.05);
}

/* نشان سفارشات (Badge) */
.admin-bottom-badge {
  position: absolute;
  top: -6px;
  right: -10px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  display: grid;
  place-items: center;
  background: #c61d70;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  line-height: 1;
  border-radius: 99px;
  border: 1.5px solid #fff;
  box-shadow: 0 2px 6px rgba(198, 29, 112, 0.3);
  animation: adminBadgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes adminNavSlideUp {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes adminBadgePop {
  0% { transform: scale(0); }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .admin-bottom-nav, .admin-bottom-nav-item, .admin-bottom-badge {
    animation: none !important;
    transition: none !important;
  }
}

/* ============================================================ */
/* FRONTEND MOBILE INFINITY OPTIMIZATION (2026)                 */
/* ============================================================ */

/* ۱. جلوگیری از اسکرول افقی و تنظیمات پایه */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  overflow-x: hidden !important;
  scroll-behavior: smooth;
  height: 100dvh;
}

body {
  width: 100%;
  overflow-x: hidden !important;
  touch-action: pan-y;
}

/* ۲. تایپوگرافی سیال (بدون پرش ناگهانی) */
@layer base {
  h1 { font-size: clamp(1.75rem, 1.5rem + 1.25vw, 3.5rem); line-height: 1.3; }
  h2 { font-size: clamp(1.5rem, 1.25rem + 1vw, 2.5rem); line-height: 1.4; }
  h3 { font-size: clamp(1.25rem, 1.1rem + 0.75vw, 2rem); line-height: 1.5; }
  p, li, span { font-size: clamp(0.9375rem, 0.9rem + 0.25vw, 1.0625rem); line-height: 1.8; }
}

/* ۳. تنظیمات لمس و ورودی‌ها در موبایل */
@media (max-width: 767px) {
  button, a.btn-primary, a.btn-secondary, a.btn-glass, input[type="submit"], input[type="button"] {
    min-height: 44px;
    min-width: 44px;
  }

  input, textarea, select {
    font-size: 16px !important;
  }

  .fl-bottom-nav {
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
}

/* ۴. جلوگیری از سرریز تصاویر و متن‌ها */
img, video, iframe, svg {
  max-width: 100%;
  height: auto;
}

@media (max-width: 767px) {
  p, h1, h2, h3, h4, h5, h6, span, a, li, div {
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  /* جلوگیری از پهن شدن فرزندان Flex و Grid */
  .flex > *, .grid > * {
    min-width: 0;
  }
}

/* ============================================================ */
/* MAGAZINE — Editorial Journal Styles                         */
/* ============================================================ */

/* نوار پیشرفت مطالعه */
.journal-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
  z-index: 100;
  pointer-events: none;
}
.journal-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #c61d70, #e84e9e);
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
}

/* هدر مجله */
.journal-hero {
  position: relative;
  padding: 4rem 0 3rem;
  text-align: center;
  overflow: hidden;
}
@media (min-width: 768px) {
  .journal-hero { padding: 6rem 0 4rem; }
}
.journal-hero-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.25em;
  color: #c61d70;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}
.journal-hero-title {
  font-size: clamp(2rem, 1.5rem + 2vw, 3.5rem);
  font-weight: 900;
  line-height: 1.2;
  color: #28242b;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}
.journal-hero-subtitle {
  max-width: 42rem;
  margin: 0 auto;
  color: #77717b;
  font-size: 15px;
  line-height: 2;
}

/* فیلتر دسته‌بندی */
.journal-category-filter {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.5rem 0 1rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.journal-category-filter::-webkit-scrollbar { display: none; }
.journal-category-pill {
  flex-shrink: 0;
  padding: 0.625rem 1.25rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
  border: 1px solid #eee8ed;
  font-size: 13px;
  font-weight: 600;
  color: #77717b;
  text-decoration: none;
  transition: all 0.2s ease;
}
.journal-category-pill:hover {
  border-color: #c61d70;
  color: #c61d70;
}
.journal-category-pill.is-active {
  background: #c61d70;
  border-color: #c61d70;
  color: #fff;
  box-shadow: 0 4px 14px -2px rgba(198, 29, 112, 0.35);
}

/* تگ دسته‌بندی داخل کارت */
.journal-category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #fff0f7;
  border: 1px solid rgba(198, 29, 112, 0.15);
  color: #c61d70;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.05em;
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

/* متا */
.journal-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  color: #918a95;
  font-size: 11px;
  margin-top: 1rem;
}
.journal-meta-dot {
  color: #d0c8cc;
}

/* Featured Card */
.journal-featured {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  text-decoration: none;
  color: inherit;
  padding: 0;
  border-radius: 24px;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
@media (min-width: 768px) {
  .journal-featured {
    grid-template-columns: 1fr 1fr;
    min-height: 480px;
  }
}
.journal-featured:hover { transform: translateY(-4px); }
.journal-featured-visual {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
}
.journal-featured-art {
  position: relative;
  height: 100%;
  min-height: 300px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(198, 29, 112, 0.08);
  overflow: hidden;
}
.journal-featured-art::before {
  content: '';
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  border: 1px solid rgba(198, 29, 112, 0.12);
  box-shadow: 0 0 0 40px rgba(255, 255, 255, 0.3), 0 0 0 80px rgba(255, 255, 255, 0.15);
}
.journal-featured-icon {
  position: relative;
  font-size: 5rem;
  color: rgba(198, 29, 112, 0.4);
  z-index: 1;
}
.journal-featured-brand {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.3em;
  color: rgba(198, 29, 112, 0.5);
}
.journal-featured-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
}
@media (min-width: 768px) {
  .journal-featured-content { padding: 1rem 0; }
}
.journal-featured-title {
  font-size: clamp(1.5rem, 1.25rem + 1vw, 2.25rem);
  font-weight: 900;
  line-height: 1.35;
  color: #28242b;
  margin-bottom: 1rem;
  transition: color 0.2s ease;
}
.journal-featured:hover .journal-featured-title { color: #c61d70; }
.journal-featured-excerpt {
  color: #77717b;
  font-size: 14px;
  line-height: 2;
  margin-bottom: 1.5rem;
}
.journal-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #c61d70;
  font-weight: 700;
  font-size: 13px;
  margin-top: 1.5rem;
}
.journal-cta-arrow {
  transition: transform 0.3s ease;
}
.journal-featured:hover .journal-cta-arrow {
  transform: translateX(-4px);
}

/* EditorsPick Card */
.journal-pick {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
  border: 1px solid #eee8ed;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.journal-pick:hover {
  border-color: rgba(198, 29, 112, 0.25);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -12px rgba(198, 29, 112, 0.15);
}
.journal-pick-art {
  position: relative;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.journal-pick-icon {
  font-size: 3rem;
  color: rgba(198, 29, 112, 0.35);
}
.journal-pick-content {
  padding: 1.5rem;
}
.journal-pick-title {
  font-size: 16px;
  font-weight: 800;
  line-height: 1.6;
  color: #28242b;
  margin-bottom: 0.75rem;
  transition: color 0.2s ease;
}
.journal-pick:hover .journal-pick-title { color: #c61d70; }
.journal-pick-excerpt {
  font-size: 12px;
  line-height: 1.9;
  color: #77717b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Standard Card */
.journal-card {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px);
  border: 1px solid #eee8ed;
  border-radius: 18px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}
.journal-card:hover {
  border-color: rgba(198, 29, 112, 0.25);
  transform: translateY(-3px);
  box-shadow: 0 12px 28px -8px rgba(40, 36, 43, 0.08);
}
.journal-card-art {
  position: relative;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.journal-card-icon {
  font-size: 2.5rem;
  color: rgba(198, 29, 112, 0.3);
}
.journal-card-content {
  padding: 1.25rem;
}
.journal-card-title {
  font-size: 14px;
  font-weight: 800;
  line-height: 1.7;
  color: #28242b;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}
.journal-card:hover .journal-card-title { color: #c61d70; }
.journal-card-excerpt {
  font-size: 12px;
  line-height: 1.9;
  color: #77717b;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* حالت خالی */
.journal-empty {
  text-align: center;
  padding: 5rem 1.5rem;
  border: 1px dashed #eee8ed;
  border-radius: 24px;
  background: #fffbfd;
}
.journal-empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  display: grid;
  place-items: center;
  background: #fff0f7;
  border-radius: 16px;
  color: #c61d70;
}

/* صفحه جزئیات مقاله */
.journal-article-hero {
  position: relative;
  padding: 3rem 0 2rem;
  text-align: center;
  max-width: 48rem;
  margin: 0 auto;
}
.journal-article-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 11px;
  color: #918a95;
  margin-bottom: 2rem;
}
.journal-article-breadcrumb a:hover { color: #c61d70; }
.journal-article-title {
  font-size: clamp(1.75rem, 1.5rem + 1.5vw, 3rem);
  font-weight: 900;
  line-height: 1.35;
  color: #28242b;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}
.journal-article-lead {
  font-size: 16px;
  line-height: 2;
  color: #77717b;
  max-width: 40rem;
  margin: 0 auto 2rem;
}
.journal-article-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 11px;
  color: #918a95;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee8ed;
  max-width: 36rem;
  margin: 0 auto;
}

/* محتوای مقاله */
.journal-article-body {
  max-width: 42rem;
  margin: 3rem auto 0;
  padding: 0 1.25rem;
}
.journal-article-body p {
  font-size: 15px;
  line-height: 2.2;
  color: #3a333f;
  margin-bottom: 1.5rem;
}
.journal-article-body h2 {
  font-size: 22px;
  font-weight: 800;
  color: #28242b;
  margin: 3rem 0 1rem;
  line-height: 1.5;
}
.journal-article-body h3 {
  font-size: 18px;
  font-weight: 800;
  color: #28242b;
  margin: 2rem 0 0.75rem;
  line-height: 1.6;
}
.journal-article-body ul,
.journal-article-body ol {
  margin: 1.5rem 0;
  padding-right: 1.5rem;
}
.journal-article-body li {
  font-size: 15px;
  line-height: 2.2;
  color: #3a333f;
  margin-bottom: 0.75rem;
}
.journal-article-body ul li { list-style-type: disc; }
.journal-article-body ul li::marker { color: #c61d70; }
.journal-article-body ol li { list-style-type: decimal; }
.journal-article-body ol li::marker { color: #c61d70; font-weight: 800; }

/* نقل قول */
.journal-quote {
  position: relative;
  margin: 2.5rem 0;
  padding: 1.5rem 2rem;
  background: #fff8fc;
  border-right: 3px solid #c61d70;
  border-radius: 0 12px 12px 0;
  font-size: 16px;
  line-height: 2;
  color: #5a1038;
  font-weight: 600;
}
.journal-quote::before {
  content: '"';
  position: absolute;
  top: -1.5rem;
  right: 1rem;
  font-size: 4rem;
  color: rgba(198, 29, 112, 0.15);
  font-family: Georgia, serif;
  line-height: 1;
}

/* مقاله‌های مرتبط */
.journal-related-section {
  border-top: 1px solid #eee8ed;
  padding: 4rem 0;
  margin-top: 4rem;
}
.journal-related-title {
  font-size: 22px;
  font-weight: 900;
  color: #28242b;
  text-align: center;
  margin-bottom: 2.5rem;
}
.journal-related-title span {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: #c61d70;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

@media (prefers-reduced-motion: reduce) {
  .journal-featured,
  .journal-pick,
  .journal-card,
  .journal-cta-arrow,
  .journal-category-pill {
    transition: none !important;
    transform: none !important;
  }
}
/* ============================================================ */
/* RICH TEXT EDITOR & PROSE STYLES                              */
/* ============================================================ */

.prose img, .journal-article-body img {
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  margin: 2rem auto;
  max-width: 100%;
  height: auto;
}
.prose h2, .journal-article-body h2 {
  font-size: 1.8rem;
  font-weight: 900;
  color: #28242b;
  margin-top: 3rem;
  margin-bottom: 1.2rem;
  line-height: 1.4;
  position: relative;
  padding-right: 1.5rem;
}
.prose h2::before, .journal-article-body h2::before {
  content: '';
  position: absolute;
  right: 0;
  top: 0.5rem;
  bottom: 0.5rem;
  width: 4px;
  background: #c61d70;
  border-radius: 99px;
}
.prose h3, .journal-article-body h3 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #28242b;
  margin-top: 2rem;
  margin-bottom: 1rem;
}
.prose p, .journal-article-body p {
  font-size: 1.05rem;
  line-height: 2.2;
  color: #3a333f;
  margin-bottom: 1.8rem;
  text-align: justify;
}
.prose ul, .journal-article-body ul,
.prose ol, .journal-article-body ol {
  margin: 1.5rem 0;
  padding-right: 2rem;
}
.prose li, .journal-article-body li {
  font-size: 1.05rem;
  line-height: 2.2;
  color: #3a333f;
  margin-bottom: 0.8rem;
}
.prose ul li, .journal-article-body ul li { list-style-type: disc; }
.prose ul li::marker, .journal-article-body ul li::marker { color: #c61d70; }
.prose ol li, .journal-article-body ol li { list-style-type: decimal; }
.prose ol li::marker, .journal-article-body ol li::marker { color: #c61d70; font-weight: 800; }

/* استایل‌های مخصوص ادیتور Tiptap */
.tiptap p.is-editor-empty:first-child::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: right;
  height: 0;
  pointer-events: none;
}
.tiptap {
  min-height: 400px;
}
/* ============================================================ */
/* WISHLIST HEART ANIMATION                                    */
/* ============================================================ */
@keyframes pingOnce {
  0% { transform: scale(1); }
  50% { transform: scale(1.4); }
  100% { transform: scale(1); }
}
.animate-ping-once {
  animation: pingOnce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideInFromRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-in.slide-in-from-right {
  animation: slideInFromRight 0.3s ease-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake { animation: shake 0.3s ease-in-out; }

/* ============================================================ */
/* SONNER PREMIUM TOAST OVERRIDES                               */
/* ============================================================ */
[data-sonner-toaster] {
  --normal-bg: rgba(255, 255, 255, 0.85) !important;
  --normal-border: rgba(233, 229, 235, 0.8) !important;
  --normal-text: #28242b !important;
}

[data-sonner-toast] {
  animation: toast-spring-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}

@keyframes toast-spring-in {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

[data-sonner-toast][data-removed="true"] {
  animation: toast-spring-out 0.3s ease-in forwards !important;
}

@keyframes toast-spring-out {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
}

/* Make the close button look premium */
[data-sonner-toast] [data-close-button] {
  background-color: #f8f7fa !important;
  border-color: #e9e5eb !important;
  color: #77717b !important;
  border-radius: 8px !important;
  transition: all 0.2s ease;
}
[data-sonner-toast] [data-close-button]:hover {
  background-color: #fff0f7 !important;
  border-color: #f2d7e5 !important;
  color: #c61d70 !important;
}
/* ============================================================ */
/*  PREMIUM BACKGROUND & MESH GRADIENTS                         */
/* ============================================================ */

/* بک‌گراند اصلی سایت: ترکیبی از گرادیانت‌های نرم و عمق */
body {
  background-color: #fafafc;
  background-image: 
    radial-gradient(at 0% 0%, hsla(330, 80%, 96%, 1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, hsla(280, 60%, 95%, 0.6) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(330, 50%, 93%, 0.8) 0px, transparent 50%),
    radial-gradient(at 0% 100%, hsla(350, 60%, 97%, 1) 0px, transparent 50%);
  background-attachment: fixed;
  background-size: cover;
  position: relative;
}

/* بافت نویز (Noise) بسیار ظریف برای حس لوکس بودن کاغذی */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  opacity: 0.025;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
}

/* افکت شیشه‌ای واقعی برای هدر */
.fl-header {
  background: rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(24px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03) !important;
}

/* کارت‌ها و پنل‌های شیشه‌ای */
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(40, 36, 43, 0.04);
}

/* انیمیشن شناور شدن آرام برای نورها */
@keyframes floatSlow {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.animate-float-slow {
  animation: floatSlow 15s ease-in-out infinite;
}

.animate-float-slower {
  animation: floatSlow 20s ease-in-out infinite reverse;
}
/* ============================================================ */
/*  PREMIUM MESH GRADIENT (Optimized for Speed & Mobile)        */
/* ============================================================ */

/* استفاده از پس‌زمینه ثابت و بهینه روی body */
body {
  background-color: #fcfbfe !important; /* رنگ پایه بسیار روشن */
  background-image: 
    radial-gradient(circle at 15% 0%, rgba(255, 240, 247, 0.8), transparent 45%),
    radial-gradient(circle at 85% 0%, rgba(240, 235, 255, 0.7), transparent 45%),
    radial-gradient(circle at 100% 100%, rgba(255, 235, 245, 0.6), transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(255, 248, 240, 0.7), transparent 50%) !important;
  background-attachment: fixed !important;
  background-size: cover !important;
}

/* پوشش برای هدر شیشه‌ای */
.fl-header {
  background: rgba(255, 255, 255, 0.65) !important;
  backdrop-filter: blur(20px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0 4px 20px rgba(198, 29, 112, 0.03) !important;
}

/* کارت‌های شیشه‌ای برای خوانایی بهتر */
.glass-panel, .glass-card {
  background: rgba(255, 255, 255, 0.75) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
}
/* ============================================================ */
/*  AURORA MESH BACKGROUND (GPU Accelerated)                    */
/* ============================================================ */

@keyframes floatOrb1 {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(5vw, -5vh) scale(1.1); }
  66% { transform: translate(-3vw, 4vh) scale(0.95); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes floatOrb2 {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-6vw, 5vh) scale(1.05); }
  100% { transform: translate(0, 0) scale(1); }
}

@keyframes floatOrb3 {
  0% { transform: translate(0, 0) scale(1); }
  40% { transform: translate(4vw, 6vh) scale(1.15); }
  80% { transform: translate(-2vw, -3vh) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

.aurora-orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(100px);
  z-index: -10;
  opacity: 0.6;
  pointer-events: none;
  will-change: transform; /* باخبر کردن مرورگر برای استفاده از GPU */
}

.orb-pink {
  top: -10%; left: -10%;
  width: 50vw; height: 50vw;
  background: radial-gradient(circle, rgba(255, 218, 236, 0.9) 0%, rgba(255, 240, 247, 0) 70%);
  animation: floatOrb1 20s ease-in-out infinite;
}

.orb-purple {
  top: 20%; right: -10%;
  width: 45vw; height: 45vw;
  background: radial-gradient(circle, rgba(235, 225, 255, 0.8) 0%, rgba(248, 247, 250, 0) 70%);
  animation: floatOrb2 25s ease-in-out infinite;
}

.orb-peach {
  bottom: -10%; left: 20%;
  width: 55vw; height: 55vw;
  background: radial-gradient(circle, rgba(255, 235, 225, 0.8) 0%, rgba(255, 250, 248, 0) 70%);
  animation: floatOrb3 22s ease-in-out infinite;
}

/* در موبایل سایز اورب‌ها را کوچک‌تر و بلور را کمتر می‌کنیم تا لگ نزند */
@media (max-width: 768px) {
  .aurora-orb { filter: blur(60px); opacity: 0.5; }
  .orb-pink { width: 80vw; height: 80vw; }
  .orb-purple { width: 70vw; height: 70vw; }
  .orb-peach { width: 90vw; height: 90vw; }
}
/* ============================================================ */
/*  PREMIUM PERSIAN DATE PICKER (React-Multi-Date-Picker)       */
/* ============================================================ */

.rmdp-wrapper, .rmdp-calendar {
  border-radius: 16px !important;
  box-shadow: 0 15px 40px rgba(198, 29, 112, 0.15) !important;
  border: 1px solid #f2d7e5 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(16px) !important;
  padding: 10px !important;
  font-family: var(--font-vazirmatn), sans-serif !important;
}

.rmdp-header-values {
  color: #28242b !important;
  font-weight: 900 !important;
  font-size: 15px !important;
}

.rmdp-day.rmdp-selected span:not(.highlight) {
  background-color: #c61d70 !important;
  box-shadow: 0 0 0 3px rgba(198, 29, 112, 0.2) !important;
}

.rmdp-day:not(.rmdp-disabled):not(.rmdp-day-hidden) span:hover {
  background-color: #fff0f7 !important;
  color: #c61d70 !important;
}

.rmdp-day.rmdp-today span {
  background-color: #f8f7fa !important;
  color: #28242b !important;
  border: 1px solid #e9e5eb !important;
}

.rmdp-arrow-container:hover {
  background-color: #fff0f7 !important;
  box-shadow: none !important;
}

.rmdp-arrow {
  border-color: #c61d70 !important;
}

.rmdp-week-day {
  color: #c61d70 !important;
  font-weight: bold !important;
}

.rmdp-month-picker, .rmdp-year-picker {
  background: white !important;
  border-radius: 16px !important;
}
/* ============================================================ */
/*  TIME PICKER STYLES                                          */
/* ============================================================ */

.rmdp-time-picker {
  border-top: 1px solid #f2d7e5 !important;
  padding: 10px !important;
  margin-top: 10px !important;
  direction: ltr !important;
}

.rmdp-time-picker div input {
  background: #f8f7fa !important;
  border: 1px solid #e9e5eb !important;
  border-radius: 8px !important;
  color: #28242b !important;
  font-weight: bold !important;
  padding: 4px 8px !important;
  outline: none !important;
}

.rmdp-time-picker div input:focus {
  border-color: #c61d70 !important;
  box-shadow: 0 0 0 2px rgba(198, 29, 112, 0.1) !important;
}

.rmdp-time-picker .rmdp-time-picker-icon svg {
  fill: #c61d70 !important;
}

.rmdp-time-picker .rmdp-time-picker-am-pm {
  background: #fff0f7 !important;
  color: #c61d70 !important;
  border-radius: 6px !important;
  padding: 4px 8px !important;
  font-weight: bold !important;
  cursor: pointer !important;
}
/* ============================================================ */
/*  BIG & READABLE TIME PICKER STYLES                           */
/* ============================================================ */

.rmdp-time-picker {
  border-top: 1px solid #f2d7e5 !important;
  padding: 15px 10px !important;
  margin-top: 10px !important;
  direction: ltr !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  gap: 5px !important;
}

/* باکس‌های ورودی ساعت و دقیقه */
.rmdp-time-picker div input {
  background: #ffffff !important;
  border: 1px solid #e9e5eb !important;
  border-radius: 10px !important;
  color: #28242b !important; /* رنگ تیره برای دیده شدن */
  font-size: 18px !important; /* فونت بزرگ */
  font-weight: 900 !important;
  width: 50px !important; /* عرض بیشتر */
  height: 40px !important; /* ارتفاع بیشتر */
  text-align: center !important;
  padding: 0 !important;
  outline: none !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05) !important;
}

/* حالت فوکوس روی باکس‌ها */
.rmdp-time-picker div input:focus {
  border-color: #c61d70 !important;
  box-shadow: 0 0 0 3px rgba(198, 29, 112, 0.15) !important;
}

/* رنگ فلش‌های بالا و پایین */
.rmdp-time-picker .rmdp-time-picker-icon svg {
  fill: #c61d70 !important;
  width: 18px !important;
  height: 18px !important;
}

/* علامت دو نقطه بین ساعت و دقیقه */
.rmdp-time-picker div div {
  font-size: 20px !important;
  color: #28242b !important;
  font-weight: 900 !important;
  padding-bottom: 5px !important;
}

/* متن AM/PM (اگر وجود داشته باشد) */
.rmdp-time-picker .rmdp-time-picker-am-pm {
  background: #fff0f7 !important;
  color: #c61d70 !important;
  border-radius: 8px !important;
  padding: 6px 10px !important;
  font-size: 14px !important;
  font-weight: 900 !important;
  cursor: pointer !important;
  border: 1px solid #f2d7e5 !important;
}
/* ============================================================ */
/*  MOBILE OPTIMIZATIONS FOR NEW FEATURES                       */
/* ============================================================ */

/* بهینه‌سازی تقویم شمسی در موبایل */
@media (max-width: 768px) {
  .rmdp-wrapper {
    max-width: 90vw !important;
    transform: scale(0.9) !important;
    transform-origin: top right !important;
  }
  .rmdp-day, .rmdp-week-day {
    width: 34px !important;
    height: 34px !important;
  }
  .rmdp-time-picker {
    padding: 10px 5px !important;
  }
  .rmdp-time-picker div input {
    width: 40px !important;
    height: 35px !important;
    font-size: 16px !important;
  }
}

/* بهینه‌سازی مودال نمایش سریع (QuickView) در موبایل */
@media (max-width: 640px) {
  .quick-view-modal-content {
    max-height: 85vh !important;
    overflow-y: auto !important;
    border-radius: 24px !important;
  }
}

/* جلوگیری از اسکرول افقی در همه بخش‌های جدید */
.aurora-orb, .fl-bottom-nav, .promo-bar {
  max-width: 100vw;
  overflow: hidden;
}
/* ============================================================ */
/*  FIX MOBILE INPUT ZOOM                                       */
/* ============================================================ */
@media (max-width: 768px) {
  input, textarea, select {
    font-size: 16px !important;
  }
}
/* ============================================================ */
/*  DARK MODE (MIDNIGHT BEAUTY)                                 */
/* ============================================================ */

@custom-variant dark (&:is(.dark *));

.dark {
  /* Base Colors */
  --fl-canvas: #0b090c;
  --fl-soft: #131015;
  --fl-ink: #f2edf5;
  --fl-muted: #9e94a6;
  --fl-line: #2a232e;
  
  background-color: #0b090c !important;
  color: #f2edf5 !important;
}

/* Aurora Background for Dark Mode */
.dark body {
  background-color: #0b090c !important;
  background-image: none !important;
}

.dark .orb-pink {
  background: radial-gradient(circle, rgba(198, 29, 112, 0.15) 0%, rgba(11, 9, 12, 0) 70%) !important;
}

.dark .orb-purple {
  background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(11, 9, 12, 0) 70%) !important;
}

.dark .orb-peach {
  background: radial-gradient(circle, rgba(225, 29, 72, 0.1) 0%, rgba(11, 9, 12, 0) 70%) !important;
}

/* Header */
.dark .fl-header {
  background: rgba(19, 16, 21, 0.75) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.dark .fl-icon-button {
  color: #9e94a6;
}
.dark .fl-icon-button:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #f2edf5;
}

/* Cards & Panels */
.dark .glass-panel, 
.dark .glass-card,
.dark .bg-white {
  background: rgba(26, 22, 28, 0.7) !important;
  border-color: #2a232e !important;
  backdrop-filter: blur(16px) !important;
}

/* Text Overrides */
.dark .text-\[\#28242b\] { color: #f2edf5 !important; }
.dark .text-\[\#77717b\] { color: #9e94a6 !important; }
.dark .text-\[\#918a95\] { color: #706677 !important; }

/* Borders */
.dark .border-\[\#e9e5eb\] { border-color: #2a232e !important; }
.dark .divide-\[\#e9e5eb\] > :not([hidden]) ~ :not([hidden]) { border-color: #2a232e !important; }

/* Inputs */
.dark input, .dark textarea, .dark select {
  background: #131015 !important;
  border-color: #2a232e !important;
  color: #f2edf5 !important;
}
.dark input:focus, .dark textarea:focus {
  border-color: #c61d70 !important;
  background: #0b090c !important;
}

/* Specific Components */
.dark .fl-product-media {
  background: linear-gradient(145deg, #1a161c, #131015) !important;
  border-color: #2a232e !important;
}

.dark .fl-bottom-nav-inner {
  background: rgba(19, 16, 21, 0.85) !important;
  border-color: rgba(255, 255, 255, 0.05) !important;
}

.dark .fl-bottom-nav-item {
  color: #706677;
}

.dark .fl-bottom-nav-item.is-active {
  color: #ff4d94;
}

.dark .fl-bottom-nav-pill {
  background: linear-gradient(135deg, rgba(198, 29, 112, 0.2) 0%, rgba(198, 29, 112, 0.1) 100%) !important;
  border-color: rgba(198, 29, 112, 0.3) !important;
}

/* Admin Sidebar */
.dark aside {
  background: rgba(19, 16, 21, 0.8) !important;
  border-left-color: #2a232e !important;
}

.dark .admin-bottom-nav-inner {
  background: rgba(19, 16, 21, 0.9) !important;
  border-color: #2a232e !important;
}
/* ============================================================ */
/*  PRINT MEDIA QUERIES FOR INVOICES & LABELS                   */
/* ============================================================ */
@media print {
  @page {
    size: A4;
    margin: 15mm;
  }
  
  body {
    background: white !important;
  }

  /* مخفی کردن همه چیز */
  body * {
    visibility: hidden;
  }

  /* فقط فاکتور قابل مشاهده باشد */
  #print-area, #print-area * {
    visibility: visible;
  }

  /* موقعیت فاکتور */
  #print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* مخفی کردن المان‌هایی که نباید چاپ شوند */
  .no-print, header, footer, nav, .fl-bottom-nav, .admin-bottom-nav, aside {
    display: none !important;
  }
}
/* ============================================================ */
/*  ACCESSIBILITY & UX POLISH                                   */
/* ============================================================ */

/* Focus visible - برای کاربرانی که با کیبورد ناوبری می‌کنند */
*:focus-visible {
  outline: 2px solid #c61d70 !important;
  outline-offset: 3px !important;
  border-radius: 8px;
}

button:focus-visible,
a:focus-visible {
  outline: 2px solid #c61d70 !important;
  outline-offset: 3px !important;
}

/* اسکرول نرم برای همه صفحات */
html {
  scroll-behavior: smooth;
}

/* کاهش حرکت برای کاربران با prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* اسکرول‌بار شیک سفارشی */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #fafafc;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #c61d70, #e84e9e);
  border-radius: 99px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #a9155d, #c61d70);
}
/* ============================================================ */
/*  MICRO-INTERACTIONS & SPRING ANIMATIONS                      */
/* ============================================================ */

/* انیمیشن Spring برای بج سبد */
@keyframes cartBadgeSpring {
  0% { transform: scale(0) rotate(-20deg); }
  50% { transform: scale(1.3) rotate(5deg); }
  70% { transform: scale(0.9) rotate(-2deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.animate-cart-badge {
  animation: cartBadgeSpring 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

/* انیمیشن Reveal برای کارت‌ها */
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  animation: fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
}

/* انیمیشن Ripple برای کلیک (تاثیر اپل) */
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
}

.btn-ripple:active::after {
  animation: ripple 0.6s ease-out;
}

/* Glow pulse برای دکمه‌های مهم */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(198, 29, 112, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(198, 29, 112, 0);
  }
}

.animate-glow-pulse {
  animation: glowPulse 2s ease-in-out infinite;
}

/* Shimmer loading effect */
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.shimmer {
  background: linear-gradient(90deg, #f0edf1 0%, #f8f7fa 50%, #f0edf1 100%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
}

/* احترام به prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .animate-cart-badge,
  .animate-fade-up,
  .animate-glow-pulse,
  .shimmer {
    animation: none !important;
  }
}
/* ===== CHAT SCROLLBAR (v3) ===== */
.chat-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
.chat-scroll::-webkit-scrollbar-track { background: transparent; }
.chat-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #f4b7d5, #e84e9e);
  border-radius: 99px;
  opacity: 0.5;
}
.chat-scroll::-webkit-scrollbar-thumb:hover { background: #c61d70; }
.chat-scroll { scrollbar-width: thin; scrollbar-color: #f4b7d5 transparent; }
.chat-scroll-hide { scrollbar-width: none; -ms-overflow-style: none; }
.chat-scroll-hide::-webkit-scrollbar { display: none; }



==========================================================================================
FILE [251/255] pnpm-workspace.yaml
SIZE 87 bytes
==========================================================================================
allowBuilds:
  argon2: true
  esbuild: true
  sharp: false
  unrs-resolver: false



==========================================================================================
FILE [252/255] vercel.json
SIZE 97 bytes
==========================================================================================
{
  "crons": [
    {
      "path": "/api/cron/cleanup",
      "schedule": "0 0 * * *"
    }
  ]
}


==========================================================================================
FILE [253/255] .gitignore
SIZE 575 bytes
==========================================================================================
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# Fix script backups
_fix_backup_*


_fix_backup_*



==========================================================================================
FILE [254/255] README.md
SIZE 1486 bytes
==========================================================================================
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



==========================================================================================
FILE [255/255] SUPPORT_FILES_14050823_000148.txt
SIZE 39315 bytes
==========================================================================================
################################################################################
FILE: src/app/account/(protected)/support/[id]/chat-client.tsx
################################################################################
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Send, ShieldCheck, X, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

const STATUS: Record<string, { label: string; cls: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200' },
};

export default function ChatClient({ ticket, initialMessages, currentUserName }: { ticket: any; initialMessages: any[]; currentUserName: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState(ticket.status);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/support/tickets/${ticket.id}`);
        const data = await res.json();
        if (data.success && data.messages.length !== messages.length) {
          setMessages(data.messages);
          setStatus(data.ticket.status);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [ticket.id, messages.length]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('حجم حداکثر ۵ مگابایت'); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/support/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) { setAttachmentUrl(data.url); toast.success('عکس پیوست شد'); }
      else toast.error(data.message || 'خطا');
    } catch { toast.error('خطا در آپلود'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleSend = async () => {
    if ((newMessage.trim().length === 0 && !attachmentUrl) || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() || 'عکس ارسال شد', attachmentUrl }),
      });
      if (res.ok) {
        setNewMessage(''); setAttachmentUrl(null);
        const refresh = await fetch(`/api/support/tickets/${ticket.id}`);
        const data = await refresh.json();
        if (data.success) { setMessages(data.messages); setStatus(data.ticket.status); }
      } else { const data = await res.json(); toast.error(data.message || 'خطا'); }
    } catch { toast.error('خطا در ارسال'); }
    finally { setSending(false); }
  };

  const statusInfo = STATUS[status] || STATUS.open;

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] bg-white/90 backdrop-blur-md rounded-3xl border border-[#e9e5eb] shadow-sm overflow-hidden">
      <div className="shrink-0 px-4 md:px-6 py-4 border-b border-[#e9e5eb] bg-gradient-to-br from-[#fff8fc] to-white">
        <div className="flex items-center gap-3">
          <Link href="/account/support" className="p-2 rounded-xl hover:bg-[#f8f7fa] text-[#77717b]"><ArrowRight size={18} /></Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-base font-black text-[#28242b] truncate">{ticket.subject}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold ${statusInfo.cls}`}>{statusInfo.label}</span>
              <span className="text-[10px] text-[#918a95]">#{ticket.id.slice(0, 8)}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 bg-[#fafafc]">
        {messages.map((msg) => {
          const isAdmin = msg.senderType === 'admin';
          return (
            <div key={msg.id} className={`flex gap-2 ${isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ${isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e]' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]'}`}>
                {isAdmin ? <ShieldCheck size={14} /> : currentUserName.charAt(0)}
              </div>
              <div className={`max-w-[75%] ${isAdmin ? '' : 'items-end'}`}>
                <div className="text-[10px] font-bold text-[#918a95] mb-1 px-1">{isAdmin ? 'تیم پشتیبانی' : 'شما'}</div>
                <div className={`rounded-2xl overflow-hidden text-sm leading-relaxed shadow-sm ${isAdmin ? 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-md' : 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-md'}`}>
                  {msg.attachmentUrl && (
                    <div className="relative w-full max-w-[250px]">
                      <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                        <img src={msg.attachmentUrl} alt="پیوست" className="w-full h-auto object-cover" />
                      </a>
                    </div>
                  )}
                  <div className="px-4 py-2.5">{msg.message}</div>
                </div>
                <div className={`text-[9px] text-[#918a95] mt-1 px-1 ${isAdmin ? '' : 'text-left'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-[#e9e5eb] bg-white p-3 md:p-4">
        {status === 'closed' ? (
          <div className="text-center py-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700"><X size={14} /> تیکت بسته شده</div>
            <Link href="/account/support" className="block mt-3 text-xs font-bold text-[#c61d70] hover:underline">ایجاد تیکت جدید</Link>
          </div>
        ) : (
          <div>
            {attachmentUrl && (
              <div className="mb-3 relative inline-block">
                <img src={attachmentUrl} alt="پیش‌نمایش" className="h-20 w-auto rounded-lg border border-[#e9e5eb]" />
                <button onClick={() => setAttachmentUrl(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md"><X size={12} /></button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1 flex items-center bg-[#f8f7fa] border border-[#e9e5eb] rounded-2xl focus-within:border-[#c61d70] transition-all overflow-hidden">
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="p-3 text-[#918a95] hover:text-[#c61d70] shrink-0">
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="پیام خود را بنویسید..." rows={1} className="flex-1 py-3 px-1 bg-transparent text-sm outline-none resize-none max-h-32" style={{ minHeight: '48px' }} maxLength={2000} />
              </div>
              <button onClick={handleSend} disabled={sending || (newMessage.trim().length === 0 && !attachmentUrl)} className="h-12 w-12 shrink-0 rounded-2xl bg-[#c61d70] text-white flex items-center justify-center shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] disabled:opacity-40 transition-all">
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

################################################################################
FILE: src/app/account/(protected)/support/[id]/page.tsx
################################################################################
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { supportTickets, supportMessages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { notFound } from 'next/navigation';
import ChatClient from './chat-client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#c61d70]">در حال بارگذاری چت...</div>;
}

async function ChatContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const current = await getCurrentCustomer();
  if (!current) return null;

  const [ticket] = await db.select().from(supportTickets).where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id))).limit(1);
  if (!ticket) notFound();

  const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));

  if (ticket.unreadByCustomer > 0) {
    await db.update(supportMessages).set({ isRead: true }).where(and(eq(supportMessages.ticketId, id), eq(supportMessages.senderType, 'admin')));
    await db.update(supportTickets).set({ unreadByCustomer: 0 }).where(eq(supportTickets.id, id));
  }

  return <ChatClient ticket={ticket} initialMessages={messages} currentUserName={current.name} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <ChatContent params={params} />
    </Suspense>
  );
}

################################################################################
FILE: src/app/admin/(dashboard)/support/[id]/admin-chat-client.tsx
################################################################################
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Send, ShieldCheck, X, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

const STATUS: Record<string, { label: string; cls: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200' },
};

export default function AdminChatClient({ ticket, customer, initialMessages }: { ticket: any; customer: { name: string; email: string }; initialMessages: any[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState(ticket.status);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId: ticket.id }) }).catch(() => {});
  }, [ticket.id]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/support/${ticket.id}`);
        const data = await res.json();
        if (data.success && data.messages.length !== messages.length) {
          setMessages(data.messages); setStatus(data.ticket.status);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [ticket.id, messages.length]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('حجم حداکثر ۵ مگابایت'); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/support/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) { setAttachmentUrl(data.url); toast.success('عکس پیوست شد'); }
      else toast.error(data.message || 'خطا');
    } catch { toast.error('خطا در آپلود'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleSend = async () => {
    if ((newMessage.trim().length === 0 && !attachmentUrl) || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/support/${ticket.id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() || 'عکس ارسال شد', status: 'answered', attachmentUrl }),
      });
      if (res.ok) {
        setNewMessage(''); setAttachmentUrl(null); setStatus('answered');
        const refresh = await fetch(`/api/admin/support/${ticket.id}`);
        const data = await refresh.json();
        if (data.success) setMessages(data.messages);
        toast.success('پاسخ ارسال شد');
      } else { const data = await res.json(); toast.error(data.message || 'خطا'); }
    } catch { toast.error('خطا'); }
    finally { setSending(false); }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/support/${ticket.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      if (res.ok) { setStatus(newStatus); toast.success('وضعیت به‌روزرسانی شد'); }
    } catch { toast.error('خطا'); }
  };

  const statusInfo = STATUS[status] || STATUS.open;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white/90 backdrop-blur-md rounded-3xl border border-[#e9e5eb] shadow-sm overflow-hidden">
      <div className="shrink-0 px-4 md:px-6 py-4 border-b border-[#e9e5eb] bg-gradient-to-br from-[#fff8fc] to-white">
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/admin/support" className="p-2 rounded-xl hover:bg-[#f8f7fa] text-[#77717b]"><ArrowRight size={18} /></Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-base font-black text-[#28242b] truncate">{ticket.subject}</h1>
            <div className="flex items-center gap-2 text-[10px] text-[#77717b] mt-1">
              <span className="font-bold">{customer.name}</span>
              <span>·</span>
              <span dir="ltr" className="truncate">{customer.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusInfo.cls}`}>{statusInfo.label}</span>
            <select value={status} onChange={(e) => updateStatus(e.target.value)} className="text-[10px] font-bold rounded-lg border border-[#e9e5eb] px-2 py-1.5 outline-none bg-white cursor-pointer">
              <option value="open">باز</option>
              <option value="answered">پاسخ داده</option>
              <option value="closed">بسته</option>
            </select>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 bg-[#fafafc]">
        {messages.map((msg) => {
          const isAdmin = msg.senderType === 'admin';
          return (
            <div key={msg.id} className={`flex gap-2 ${isAdmin ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ${isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e]' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]'}`}>
                {isAdmin ? <ShieldCheck size={14} /> : customer.name.charAt(0)}
              </div>
              <div className={`max-w-[75%] ${isAdmin ? 'items-end' : ''}`}>
                <div className="text-[10px] font-bold text-[#918a95] mb-1 px-1">{isAdmin ? 'شما (پشتیبانی)' : customer.name}</div>
                <div className={`rounded-2xl overflow-hidden text-sm leading-relaxed shadow-sm ${isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-md' : 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-md'}`}>
                  {msg.attachmentUrl && (
                    <div className="relative w-full max-w-[250px]">
                      <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                        <img src={msg.attachmentUrl} alt="پیوست" className="w-full h-auto object-cover" />
                      </a>
                    </div>
                  )}
                  <div className="px-4 py-2.5">{msg.message}</div>
                </div>
                <div className={`text-[9px] text-[#918a95] mt-1 px-1 ${isAdmin ? 'text-left' : ''}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-[#e9e5eb] bg-white p-3 md:p-4">
        {status === 'closed' ? (
          <div className="text-center py-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600"><X size={14} /> تیکت بسته شده</div>
          </div>
        ) : (
          <div>
            {attachmentUrl && (
              <div className="mb-3 relative inline-block">
                <img src={attachmentUrl} alt="پیش‌نمایش" className="h-20 w-auto rounded-lg border border-[#e9e5eb]" />
                <button onClick={() => setAttachmentUrl(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md"><X size={12} /></button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1 flex items-center bg-[#f8f7fa] border border-[#e9e5eb] rounded-2xl focus-within:border-[#c61d70] transition-all overflow-hidden">
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="p-3 text-[#918a95] hover:text-[#c61d70] shrink-0">
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="پاسخ خود را بنویسید..." rows={1} className="flex-1 py-3 px-1 bg-transparent text-sm outline-none resize-none max-h-32" style={{ minHeight: '48px' }} maxLength={2000} />
              </div>
              <button onClick={handleSend} disabled={sending || (newMessage.trim().length === 0 && !attachmentUrl)} className="h-12 w-12 shrink-0 rounded-2xl bg-[#c61d70] text-white flex items-center justify-center shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] disabled:opacity-40 transition-all">
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

################################################################################
FILE: src/app/admin/(dashboard)/support/[id]/page.tsx
################################################################################
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { supportTickets, supportMessages, customers } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminChatClient from './admin-chat-client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#c61d70]">در حال بارگذاری چت...</div>;
}

async function ChatContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await db.select({
    ticket: supportTickets,
    customerName: customers.name,
    customerEmail: customers.email,
  }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).where(eq(supportTickets.id, id)).limit(1);

  if (result.length === 0) notFound();

  const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));

  return (
    <AdminChatClient
      ticket={result[0].ticket}
      customer={{ name: result[0].customerName || 'کاربر', email: result[0].customerEmail || '' }}
      initialMessages={messages}
    />
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <ChatContent params={params} />
    </Suspense>
  );
}

################################################################################
FILE: src/app/admin/(dashboard)/support/admin-support-client.tsx
################################################################################
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Search, Clock, CheckCircle2, ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';
import { formatPersianDate } from '@/lib/format';

const CATEGORIES: Record<string, string> = { order: 'سفارش', product: 'محصول', payment: 'پرداخت', other: 'سایر' };
const STATUS: Record<string, { label: string; cls: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200' },
};

export default function AdminSupportClient() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'answered' | 'closed'>('all');

  useEffect(() => {
    fetch('/api/admin/support')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => { 
        if (data.success) setTickets(data.tickets); 
        else setError(data.message || 'خطا');
      })
      .catch((err) => setError(err.message || 'دسترسی غیرمجاز'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter((t) => {
    if (filter !== 'all' && t.ticket.status !== filter) return false;
    if (search && !t.ticket.subject.toLowerCase().includes(search.toLowerCase()) && !t.customerName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.ticket.status === 'open').length,
    answered: tickets.filter((t) => t.ticket.status === 'answered').length,
    unread: tickets.filter((t) => t.ticket.unreadByAdmin > 0).length,
  };

  if (loading) return <div className="p-12 text-center text-[#c61d70]"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" /><p className="text-sm">در حال بارگذاری تیکت‌ها...</p></div>;

  if (error) return (
    <div className="p-12 text-center">
      <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
      <p className="text-sm text-rose-600">{error}</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-black text-[#28242b] md:text-2xl">
          <MessageCircle className="text-[#c61d70]" size={26} /> مدیریت پشتیبانی
        </h1>
        <p className="mt-1 text-xs text-[#77717b] md:text-sm">تیکت‌های کاربران را ببینید و پاسخ دهید.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[#e9e5eb] bg-white p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-[#77717b]">کل تیکت‌ها</span><MessageCircle size={16} className="text-[#c61d70]" /></div>
          <p className="text-xl font-black text-[#28242b]">{stats.total.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-blue-700">باز</span><Clock size={16} className="text-blue-600" /></div>
          <p className="text-xl font-black text-blue-800">{stats.open.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-emerald-700">پاسخ داده شده</span><CheckCircle2 size={16} className="text-emerald-600" /></div>
          <p className="text-xl font-black text-emerald-800">{stats.answered.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-amber-700">پیام جدید</span><AlertCircle size={16} className="text-amber-600" /></div>
          <p className="text-xl font-black text-amber-800">{stats.unread.toLocaleString('fa-IR')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو..." className="w-full pr-11 pl-4 py-3 bg-white border border-[#e9e5eb] rounded-2xl text-sm outline-none focus:border-[#c61d70] transition-all" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {[{ k: 'all' as const, label: 'همه' }, { k: 'open' as const, label: 'باز' }, { k: 'answered' as const, label: 'پاسخ داده' }, { k: 'closed' as const, label: 'بسته' }].map((f) => (
            <button key={f.k} onClick={() => setFilter(f.k)} className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === f.k ? 'bg-[#c61d70] text-white shadow-lg shadow-[#c61d70]/20' : 'bg-white text-[#77717b] border border-[#e9e5eb]'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#e9e5eb] bg-white p-12 text-center">
          <MessageCircle size={48} className="mx-auto mb-4 text-[#c61d70]/30" />
          <h3 className="text-lg font-black text-[#28242b] mb-2">تیکتی یافت نشد</h3>
          <p className="text-sm text-[#77717b]">هنوز هیچ تیکتی ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map(({ ticket, customerName, customerEmail }) => {
            const status = STATUS[ticket.status] || STATUS.open;
            return (
              <Link key={ticket.id} href={`/admin/support/${ticket.id}`} className="group rounded-2xl border border-[#e9e5eb] bg-white p-4 hover:border-[#c61d70]/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-black text-sm text-[#28242b] truncate">{ticket.subject}</h3>
                      {ticket.unreadByAdmin > 0 && (
                        <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-[#c61d70] text-white text-[10px] font-black animate-pulse">{ticket.unreadByAdmin.toLocaleString('fa-IR')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#77717b]">
                      <span className="font-bold">{customerName || 'کاربر'}</span>
                      {customerEmail && <><span>·</span><span className="truncate" dir="ltr">{customerEmail}</span></>}
                    </div>
                  </div>
                  <ChevronLeft size={18} className="shrink-0 text-[#c61d70] opacity-50 group-hover:opacity-100" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold ${status.cls}`}>{status.label}</span>
                  <span className="inline-flex items-center rounded-full bg-[#f8f7fa] border border-[#e9e5eb] px-2 py-0.5 text-[9px] font-bold text-[#77717b]">{CATEGORIES[ticket.category] || ticket.category}</span>
                  <span className="text-[9px] text-[#918a95]">{formatPersianDate(ticket.lastMessageAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

################################################################################
FILE: src/app/api/support/tickets/[id]/route.ts
################################################################################
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';

const messageSchema = z.object({
  message: z.string().min(1).max(2000),
  attachmentUrl: z.string().optional().nullable(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const { id } = await params;
    const [ticket] = await db.select().from(supportTickets).where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id))).limit(1);
    if (!ticket) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
    
    const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));
    
    if (ticket.unreadByCustomer > 0) {
      await db.update(supportMessages).set({ isRead: true }).where(and(eq(supportMessages.ticketId, id), eq(supportMessages.senderType, 'admin')));
      await db.update(supportTickets).set({ unreadByCustomer: 0 }).where(eq(supportTickets.id, id));
    }
    return NextResponse.json({ success: true, ticket, messages });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const validated = messageSchema.parse(body);
    
    const [ticket] = await db.select().from(supportTickets).where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id))).limit(1);
    if (!ticket) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
    if (ticket.status === 'closed') return NextResponse.json({ message: 'تیکت بسته شده' }, { status: 400 });
    
    const [msg] = await db.insert(supportMessages).values({
      ticketId: id,
      senderType: 'customer',
      senderName: current.name,
      message: validated.message,
      attachmentUrl: validated.attachmentUrl || null,
    }).returning();
    
    await db.update(supportTickets).set({
      status: 'open',
      unreadByAdmin: (ticket.unreadByAdmin || 0) + 1,
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(supportTickets.id, id));
    
    return NextResponse.json({ success: true, message: msg });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}

################################################################################
FILE: src/app/api/admin/support/[id]/route.ts
################################################################################
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages, customers } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

const replySchema = z.object({
  message: z.string().min(1).max(2000),
  attachmentUrl: z.string().optional().nullable(),
  status: z.enum(['open', 'answered', 'closed']).optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const result = await db.select({
      ticket: supportTickets,
      customerName: customers.name,
      customerEmail: customers.email,
    }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).where(eq(supportTickets.id, id)).limit(1);
    if (result.length === 0) return NextResponse.json({ message: 'not found' }, { status: 404 });
    
    const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));
    return NextResponse.json({ success: true, ticket: result[0].ticket, customer: { name: result[0].customerName, email: result[0].customerEmail }, messages });
  } catch { return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const body = await req.json();
    const validated = replySchema.parse(body);
    
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).limit(1);
    if (!ticket) return NextResponse.json({ message: 'not found' }, { status: 404 });
    
    await db.insert(supportMessages).values({
      ticketId: id,
      senderType: 'admin',
      senderName: 'تیم پشتیبانی',
      message: validated.message,
      attachmentUrl: validated.attachmentUrl || null,
    });
    
    await db.update(supportTickets).set({
      status: validated.status || 'answered',
      unreadByCustomer: (ticket.unreadByCustomer || 0) + 1,
      unreadByAdmin: 0,
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(supportTickets.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const { status } = await req.json();
    if (!['open', 'answered', 'closed'].includes(status)) return NextResponse.json({ message: 'invalid' }, { status: 400 });
    await db.update(supportTickets).set({ status, updatedAt: new Date() }).where(eq(supportTickets.id, id));
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}

################################################################################
FILE: src/app/api/support/upload/route.ts
################################################################################
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { verifyAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    let isAuthorized = false;
    try { await verifyAdmin(); isAuthorized = true; } catch { 
      const customer = await getCurrentCustomer();
      if (customer) isAuthorized = true;
    }
    if (!isAuthorized) return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ message: 'فایلی ارسال نشد' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ message: 'حجم فایل بیش از ۵ مگابایت است' }, { status: 400 });
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return NextResponse.json({ message: 'فقط تصویر مجاز است' }, { status: 400 });

    const blob = await put(`support-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: 'خطا در آپلود' }, { status: 500 });
  }
}



