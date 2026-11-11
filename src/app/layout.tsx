import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "sonner";
import BottomNav from "@/components/storefront/BottomNav";
import FloatingSupportButton from "@/components/storefront/FloatingSupportButton";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "36688862",
  description: "محصولات آرایشی و مراقبتی فاطمه بیوتی لند را بررسی کنید؛ مشخصات، قیمت و وضعیت موجودی هر محصول در صفحه اختصاصی آن نمایش داده می‌شود.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://fatemehbeautyland.ir"),
  other: {
    enamad: "36688862",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.variable}>
      <body className="min-h-[100dvh] bg-background font-sans text-foreground overflow-x-hidden">
        <Toaster position="top-center" richColors theme="light" closeButton />
        {children}
        <Suspense fallback={null}>
          <Suspense fallback={null}><FloatingSupportButton /></Suspense>
        </Suspense>
        <Suspense fallback={null}>
          <Suspense fallback={null}><BottomNav /></Suspense>
        </Suspense>
      </body>
    </html>
  );
}