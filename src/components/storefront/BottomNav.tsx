'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, BookOpen, Truck, UserRound, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match: 'exact' | 'prefix';
};

const ITEMS: NavItem[] = [
  { href: '/', label: 'خانه', icon: Home, match: 'exact' },
  { href: '/products', label: 'محصولات', icon: LayoutGrid, match: 'prefix' },
  { href: '/journal', label: 'مجله', icon: BookOpen, match: 'prefix' },
  { href: '/track', label: 'رهگیری', icon: Truck, match: 'prefix' },
  { href: '/account', label: 'حساب', icon: UserRound, match: 'prefix' },
  { href: '/cart', label: 'سبد', icon: ShoppingBag, match: 'prefix' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cartCount = mounted
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;
  const isHidden =
    pathname.startsWith('/admin') ||
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname.startsWith('/account') ||
    (pathname.startsWith('/products/') && pathname !== '/products');

  // A body-level portal escapes transformed/overflow-clipped layout ancestors.
  // It is mounted only after hydration, so server and initial client markup agree.
  if (!mounted || isHidden) return null;

  return createPortal(
    <nav className="fbl-maison-dock-v3 md:hidden" dir="rtl" aria-label="ناوبری اصلی فروشگاه">
      <div className="fbl-maison-dock-v3__surface">
        {ITEMS.map((item) => {
          const active = item.match === 'exact'
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          const showCartBadge = item.href === '/cart' && cartCount > 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`fbl-maison-dock-v3__item${active ? ' is-active' : ''}`}
              aria-label={showCartBadge ? `${item.label}، ${cartCount} کالا` : item.label}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              prefetch
            >
              <span className="fbl-maison-dock-v3__icon" aria-hidden="true">
                <Icon size={21} strokeWidth={active ? 2.2 : 1.75} />
                {showCartBadge && (
                  <span className="fbl-maison-dock-v3__badge">
                    {cartCount > 99 ? '۹۹+' : cartCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </span>
              <span className="fbl-maison-dock-v3__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>,
    document.body,
  );
}