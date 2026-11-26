'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, ShoppingCart, MessageCircle, UserRound } from 'lucide-react';
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

const ITEMS: NavItem[] = [
  { href: '/', label: 'خانه', icon: Home, match: 'exact' },
  { href: '/products', label: 'دسته‌بندی', icon: LayoutGrid, match: 'prefix' },
  { href: '/cart', label: 'سبد خرید', icon: ShoppingCart, match: 'prefix' },
  { href: '/account/support', label: 'پیام‌ها', icon: MessageCircle, match: 'prefix' },
  { href: '/account', label: 'حساب کاربری', icon: UserRound, match: 'prefix' },
];

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

  const isHidden =
    pathname.startsWith('/admin') ||
    pathname === '/checkout' ||
    pathname.startsWith('/checkout/') ||
    pathname.startsWith('/account') ||
    (pathname.startsWith('/products/') && pathname !== '/products');

  if (!mounted || isHidden) return null;

  return createPortal(
    <nav
      className="fbl-signature-dock-v8 md:hidden"
      dir="rtl"
      aria-label="ناوبری اصلی فروشگاه"
    >
      <div className="fbl-signature-dock-v8__surface">
        <span className="fbl-signature-dock-v8__sheen" aria-hidden="true" />
        {ITEMS.map((item) => {
          const active = item.match === 'exact'
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          const showCartBadge = item.href === '/cart' && cartCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                'fbl-signature-dock-v8__item' +
                (active ? ' is-active' : '')
              }
              aria-label={showCartBadge ? item.label + '، ' + cartCount + ' کالا' : item.label}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              prefetch
            >
              <span className="fbl-signature-dock-v8__icon" aria-hidden="true">
                <Icon size={24} strokeWidth={active ? 2.25 : 1.8} />
                {showCartBadge && (
                  <span className="fbl-signature-dock-v8__badge">
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
