'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
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
      <header className="fbl-store-header sticky top-0 z-50 w-full border-b border-[#e9e5eb] bg-white/90 backdrop-blur-xl">
        <div className="fbl-store-header-inner container-custom flex h-16 items-center justify-between gap-2 md:h-[74px]">
          
          {/* لوگو */}
          <Link href="/" className="fbl-store-brand flex items-center gap-2 shrink-0" aria-label="صفحه اصلی فاطمه بیوتی لند">
            <span className="fbl-store-brand-mark relative w-9 h-9 overflow-hidden rounded-full border border-[#f1dce7] bg-white shrink-0">
              <Image src="/logo.png" alt="نشان فاطمه بیوتی لند" fill sizes="48px" priority />
            </span>
            <span className="fbl-store-brand-copy flex flex-col whitespace-nowrap">
              <span className="text-sm font-black text-[#28242b] leading-tight">فاطمه بیوتی لند</span>
              <span className="text-[8px] font-bold tracking-widest text-[#a49ba5]" dir="ltr">FATEMEH BEAUTY LAND</span>
            </span>
          </Link>

          {/* ناوبری دسکتاپ */}
          <nav className="fbl-store-nav hidden md:flex items-center gap-6" aria-label="ناوبری اصلی">
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
          <div className="fbl-store-actions flex items-center gap-1 md:gap-2">
            <div className="shrink-0"><InstantSearch /></div>
            <UserMenuButton />
            
            <button
              type="button"
              onClick={openCart}
              className="fbl-cart-action relative"
              aria-label="سبد خرید"
              title="سبد خرید"
            >
              <ShoppingBag size={19} strokeWidth={1.8} />
              {cartCount > 0 && !isCartPage && (
                <span className="fbl-cart-badge">
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