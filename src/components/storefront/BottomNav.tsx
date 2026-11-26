'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, BookOpen, Truck, UserRound, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useEffect, useState } from 'react';

type MaisonNavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match: 'exact' | 'prefix';
};

const MAISON_ITEMS: MaisonNavItem[] = [
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

  if (isHidden) return null;

  return (
    <nav className="fbl-maison-dock md:hidden" dir="rtl" aria-label="ناوبری اصلی فروشگاه">
      <div className="fbl-maison-dock__surface">
        <span className="fbl-maison-dock__sheen" aria-hidden="true" />
        {MAISON_ITEMS.map((item) => {
          const active = item.match === 'exact'
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          const showCartBadge = item.href === '/cart' && cartCount > 0;
          const accessibleLabel = showCartBadge
            ? `${item.label}، ${cartCount} کالا`
            : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`fbl-maison-dock__item${active ? ' is-active' : ''}`}
              aria-label={accessibleLabel}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              prefetch
            >
              <span className="fbl-maison-dock__icon" aria-hidden="true">
                <Icon size={21} strokeWidth={active ? 2.15 : 1.75} />
                {showCartBadge && (
                  <span className="fbl-maison-dock__badge">
                    {cartCount > 99 ? '۹۹+' : cartCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </span>
              <span className="fbl-maison-dock__label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}