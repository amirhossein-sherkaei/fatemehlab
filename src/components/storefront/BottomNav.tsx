'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, LayoutGrid, ShoppingCart, Truck, UserRound } from 'lucide-react';
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

// RTL order: home, categories, cart, order tracking, account.
// Customer support remains the single separate floating control at the left.
const ITEMS: NavItem[] = [
  { href: '/', label: 'خانه', icon: House, match: 'exact' },
  { href: '/products', label: 'دسته‌بندی‌ها', icon: LayoutGrid, match: 'prefix' },
  { href: '/cart', label: 'سبد خرید', icon: ShoppingCart, match: 'prefix' },
  { href: '/track', label: 'رهگیری سفارش', icon: Truck, match: 'prefix' },
  { href: '/account', label: 'حساب کاربری', icon: UserRound, match: 'prefix' },
];

function HomeGlyph({ active }: { active: boolean }) {
  if (!active) {
    return <House size={25} strokeWidth={1.85} aria-hidden="true" />;
  }

  return (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
      <path
        d="M3.15 10.2 12 2.95l8.85 7.25v9.2c0 .82-.66 1.48-1.48 1.48h-4.82v-6.14H9.45v6.14H4.63c-.82 0-1.48-.66-1.48-1.48v-9.2Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path d="M9.65 20.55v-5.78h4.7v5.78" fill="#f5eef2" stroke="#f5eef2" strokeWidth=".75" strokeLinejoin="round" />
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

  // The account area has its own purpose-built navigation. Checkout is kept focused.
  // The dock remains available on cart and product-detail pages.
  const isHidden =
    pathname.startsWith('/admin') ||
    pathname === '/checkout' ||
    pathname.startsWith('/checkout/') ||
    pathname.startsWith('/account');

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
          const accessibleLabel = showCartBadge
            ? `${item.label}، ${cartCount.toLocaleString('fa-IR')} کالا`
            : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                'fbl-digikala-grade-dock-v9__item' +
                (active ? ' is-active' : '')
              }
              aria-label={accessibleLabel}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              prefetch
            >
              <span className="fbl-digikala-grade-dock-v9__icon" aria-hidden="true">
                {isHome ? <HomeGlyph active={active} /> : <Icon size={25} strokeWidth={active ? 2.1 : 1.8} />}
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
