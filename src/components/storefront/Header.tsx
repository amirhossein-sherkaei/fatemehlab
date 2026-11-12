'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, Search, ShoppingBag, X, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import UserMenuButton from './UserMenuButton';

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    if (!searchOpen && !mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen, mobileMenuOpen]);

  const cartCount = isMounted ? items.reduce((total, item) => total + item.quantity, 0) : 0;
  const isCartPage = pathname === '/cart' || pathname === '/checkout';

  const closeOverlays = () => {
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fl-header">
        <div className="container-custom fl-header-inner">
          <Link href="/" className="fl-brand" aria-label="صفحه اصلی فاطمه بیوتی لند">
            <span className="fl-brand-mark">
              <Image src="/logo.png" alt="نشان فاطمه بیوتی لند" fill sizes="39px" priority />
            </span>
            <span className="flex flex-col">
              <span className="fl-brand-name">فاطمه بیوتی لند</span>
              <span className="fl-brand-latin">FATEMEH BEAUTY LAND</span>
            </span>
          </Link>

          <nav className="fl-nav" aria-label="ناوبری اصلی">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <UserMenuButton />

            <button
              type="button"
              className="fl-icon-button"
              aria-label="جست‌وجوی محصولات"
              aria-expanded={searchOpen}
              aria-controls="store-search-panel"
              onClick={() => {
                setSearchOpen((open) => !open);
                setMobileMenuOpen(false);
              }}
            >
              <Search size={18} strokeWidth={1.8} />
            </button>
            
            <button
              type="button"
              onClick={openCart}
              className="fl-icon-button relative"
              aria-label={`سبد خرید${cartCount ? `، ${cartCount} کالا` : ''}`}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              {cartCount > 0 && !isCartPage && (
                <span className="fl-cart-count animate-in zoom-in">{cartCount.toLocaleString('fa-IR')}</span>
              )}
            </button>
            
            <button
              type="button"
              className="fl-icon-button md:hidden"
              aria-label="باز کردن منو"
              aria-expanded={mobileMenuOpen}
              onClick={() => {
                setMobileMenuOpen(true);
                setSearchOpen(false);
              }}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div id="store-search-panel" className="fl-search-panel" role="dialog" aria-label="جست‌وجوی محصولات">
            <form action="/products" method="get" className="fl-search-field" onSubmit={() => setSearchOpen(false)}>
              <Search size={17} className="shrink-0 text-[#a49aa5]" />
              <input
                autoFocus
                name="q"
                type="search"
                placeholder="نام محصول را جست‌وجو کنید..."
                aria-label="عبارت جست‌وجو"
              />
              <button type="submit" className="text-[#c61d70]" aria-label="شروع جست‌وجو">
                <ArrowLeft size={17} />
              </button>
            </form>
          </div>
        )}
      </header>

      {mobileMenuOpen && (
        <div className="fl-mobile-nav md:hidden" role="dialog" aria-modal="true" aria-label="منوی سایت">
          <div className="fl-mobile-nav-head">
            <Link href="/" className="fl-brand" onClick={closeOverlays}>
              <span className="fl-brand-mark">
                <Image src="/logo.png" alt="" fill sizes="39px" />
              </span>
              <span className="flex flex-col">
                <span className="fl-brand-name">فاطمه بیوتی لند</span>
                <span className="fl-brand-latin">FATEMEH BEAUTY LAND</span>
              </span>
            </Link>
            <button type="button" className="fl-icon-button" onClick={closeOverlays} aria-label="بستن منو">
              <X size={20} />
            </button>
          </div>
          <nav className="fl-mobile-nav-links" aria-label="ناوبری موبایل">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} onClick={closeOverlays}>
                {item.label}
              </Link>
            ))}
            <Link href="/account" onClick={closeOverlays}>حساب کاربری</Link>
            <button onClick={() => { closeOverlays(); openCart(); }} className="text-right text-[#28242b] font-[650] text-[15px] py-[15px] px-[5px] border-b border-[#f0edf1]">سبد خرید</button>
          </nav>
        </div>
      )}
    </>
  );
}