'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Home, LayoutGrid, Truck, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  match: 'exact' | 'prefix';
};

const ITEMS: NavItem[] = [
  { href: '/', label: 'خانه', icon: Home, match: 'exact' },
  { href: '/products', label: 'محصولات', icon: LayoutGrid, match: 'prefix' },
  { href: '/journal', label: 'مجله', icon: BookOpen, match: 'prefix' },
  { href: '/track', label: 'رهگیری', icon: Truck, match: 'prefix' },
  { href: '/account', label: 'حساب', icon: UserRound, match: 'prefix' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isHidden =
    pathname.startsWith('/admin') ||
    pathname === '/cart' ||
    pathname.startsWith('/cart/') ||
    pathname === '/checkout' ||
    pathname.startsWith('/checkout/') ||
    pathname.startsWith('/account') ||
    (pathname.startsWith('/products/') && pathname !== '/products');

  if (!mounted || isHidden) return null;

  return createPortal(
    <nav
      className="fbl-atelier-dock-v6 md:hidden"
      dir="rtl"
      aria-label="ناوبری اصلی فروشگاه"
    >
      <div className="fbl-atelier-dock-v6__rail">
        <span className="fbl-atelier-dock-v6__shine" aria-hidden="true" />
        {ITEMS.map((item) => {
          const active = item.match === 'exact'
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                'fbl-atelier-dock-v6__item' +
                (active ? ' is-active' : '')
              }
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              prefetch
            >
              <span className="fbl-atelier-dock-v6__icon" aria-hidden="true">
                <Icon size={23} strokeWidth={active ? 2.05 : 1.75} />
              </span>
              <span className="fbl-atelier-dock-v6__label">{item.label}</span>
              {active ? (
                <span className="fbl-atelier-dock-v6__active-dot" aria-hidden="true" />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>,
    document.body,
  );
}
