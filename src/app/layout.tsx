import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "sonner";
import BottomNav from "@/components/storefront/BottomNav";
import CartDrawer from "@/components/storefront/CartDrawer";
import AuroraBackground from "@/components/storefront/AuroraBackground";
import PwaInstallPrompt from "@/components/storefront/PwaInstallPrompt";
import PromoBarWrapper from "@/components/storefront/PromoBarWrapper";
import { ThemeProvider } from "next-themes";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-[100dvh] font-sans text-foreground overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <Suspense fallback={null}>
          <PromoBarWrapper />
        </Suspense>
        <Toaster position="top-center" richColors theme="light" closeButton />
        <AuroraBackground />
        <CartDrawer />
        <PwaInstallPrompt />
        {children}
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </ThemeProvider>
      </body>
    </html>
  );
}