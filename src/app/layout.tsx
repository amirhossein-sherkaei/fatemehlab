import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "sonner";
import BottomNav from "@/components/storefront/BottomNav";
import CartDrawer from "@/components/storefront/CartDrawer";
import AuroraBackground from "@/components/storefront/AuroraBackground";
import PromoBar from "@/components/storefront/PromoBar";
import PwaInstallPrompt from "@/components/storefront/PwaInstallPrompt";
import QuickViewModal from "@/components/storefront/QuickViewModal";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "فاطمه بیوتی لند | فروشگاه محصولات آرایشی و بهداشتی",
  description: "محصولات آرایشی و مراقبتی فاطمه بیوتی لند را بررسی کنید؛ مشخصات، قیمت و وضعیت موجودی هر محصول در صفحه اختصاصی آن نمایش داده می‌شود.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://fatemehbeautyland.ir"),
  appleWebApp: {
    capable: true,
    title: "فاطمه بیوتی لند",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "فاطمه بیوتی لند",
  "url": "https://fatemehbeautyland.ir",
  "logo": "https://fatemehbeautyland.ir/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+989905316327",
    "contactType": "customer service",
    "areaServed": "IR",
    "availableLanguage": "Persian"
  },
  "sameAs": [
    "https://instagram.com/fatemehlab.ir"
  ]
};

import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    // دریافت تنظیمات نوار تبلیغاتی
  let promoText = null;
  let promoExpiresAt = null;
  try {
    const settings = await db.select().from(siteSettings);
    const textSetting = settings.find(s => s.key === 'promoBarText');
    const expiresSetting = settings.find(s => s.key === 'promoBarExpiresAt');
    if (textSetting?.value) promoText = textSetting.value as string;
    if (expiresSetting?.value) promoExpiresAt = expiresSetting.value as string;
  } catch (e) {
    console.error('Failed to load promo bar settings', e);
  }

  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-[100dvh] font-sans text-foreground overflow-x-hidden">
        {promoText && <PromoBar text={promoText} expiresAt={promoExpiresAt} />}
        <AuroraBackground />
        <Toaster position="top-center" richColors theme="light" closeButton />
        <CartDrawer />
        <PwaInstallPrompt />
        <QuickViewModal />
        {children}
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </body>
    </html>
  );
}