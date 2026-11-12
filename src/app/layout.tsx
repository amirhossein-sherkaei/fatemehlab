import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "sonner";
import BottomNav from "@/components/storefront/BottomNav";
import CartDrawer from "@/components/storefront/CartDrawer";
import AuroraBackground from "@/components/storefront/AuroraBackground";
import PwaInstallPrompt from "@/components/storefront/PwaInstallPrompt";
import WebVitals from "@/components/shared/WebVitals";
import PromoBarWrapper from "@/components/storefront/PromoBarWrapper";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
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
      priceRange: "$",
    },
  ],
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
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
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "فاطمه بیوتی لند",
  url: baseUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const jsonLdLocalBusiness = {
  "@context": "https://schema.org",
  "@type": "Store",
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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }} />
        
        
      </head>
      <body className="min-h-[100dvh] font-sans text-foreground overflow-x-hidden">
        <Suspense fallback={null}><PromoBarWrapper /></Suspense>
        <Toaster position="top-center" richColors theme="light" closeButton />
        <AuroraBackground />
        <WebVitals />
        <CartDrawer />
        <PwaInstallPrompt />
        {children}
        <Suspense fallback={null}><BottomNav /></Suspense>
      </body>
    </html>
  );
}