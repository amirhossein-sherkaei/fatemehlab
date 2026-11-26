'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRound, MessageCircle, ShoppingCart, LayoutGrid, ShoppingBag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: 'exact' | 'prefix';
};

// Items are intentionally ordered for RTL: home is the far-right destination.
const ITEMS: NavItem[] = [
  { href: '/', label: 'خانه', icon: ShoppingBag, match: 'exact' },
  { href: '/products', label: 'دسته‌بندی', icon: LayoutGrid, match: 'prefix' },
  { href: '/cart', label: 'سبد خرید', icon: ShoppingCart, match: 'prefix' },
  { href: '/account/support', label: 'پیام‌ها', icon: MessageCircle, match: 'prefix' },
  { href: '/account', label: 'حساب کاربری', icon: UserRound, match: 'prefix' },
];

function StoreHomeGlyph({ active }: { active: boolean }) {
  if (!active) {
    return <ShoppingBag size={25} strokeWidth={1.85} aria-hidden="true" />;
  }

  return (
    <svg viewBox="0 0 24 24" width="27" height="27" fill="none" aria-hidden="true">
      <path
        d="M5.1 8.4h13.8l1.15 11.05a1.8 1.8 0 0 1-1.79 1.99H5.74a1.8 1.8 0 0 1-1.79-1.99L5.1 8.4Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M8.2 8.2V6.45a3.8 3.8 0 0 1 7.6 0V8.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.7 14.1c.8 1.15 2 1.72 3.3 1.72s2.5-.57 3.3-1.72" stroke="#fff" strokeWidth="1.65" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;

  // Account pages use their own purpose-built account navigation; checkout and
  // product details keep their focused purchase layouts.
  const isHidden =
    pathname.startsWith('/admin') ||
    pathname === '/checkout' ||
    pathname.startsWith('/checkout/') ||
    pathname.startsWith('/account') ||
    (pathname.startsWith('/products/') && pathname !== '/products');

  if (!mounted || isHidden) return null;

  return createPortal(
    <nav
      className="fbl-digikala-grade-dock-v9 md:hidden"
      dir="rtl"
      aria-label="ناوبری اصلی فروشگاه"
    >
      <div className="fbl-digikala-grade-dock-v9__surface">
        {ITEMS.map((item) => {
          const active = item.match === 'exact'
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          const isHome = item.href === '/';
          const showCartBadge = item.href === '/cart' && cartCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={'fbl-digikala-grade-dock-v9__item' + (active ? ' is-active' : '')}
              aria-label={showCartBadge ? item.label + '، ' + cartCount + ' کالا' : item.label}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              prefetch
            >
              <span className="fbl-digikala-grade-dock-v9__icon">
                {isHome ? <StoreHomeGlyph active={active} /> : <Icon size={25} strokeWidth={1.85} aria-hidden="true" />}
                {showCartBadge && (
                  <span className="fbl-digikala-grade-dock-v9__badge">
                    {cartCount > 99 ? '۹۹+' : cartCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </span>
              <span className="sr-only">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>,
    document.body,
  );
}
