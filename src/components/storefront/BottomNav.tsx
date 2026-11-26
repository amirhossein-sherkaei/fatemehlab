'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, BookOpen, ShoppingBag, UserRound, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useCallback, useEffect, useRef, useState } from 'react';

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match: 'exact' | 'prefix';
  badge?: number;
};

export default function BottomNav() {
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, show: false });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  const cartCount = mounted
    ? cartItems.reduce((total, item) => total + item.quantity, 0)
    : 0;
  const isCartOrCheckout = pathname === '/cart' || pathname === '/checkout';

  const isHidden =
    pathname.startsWith('/admin') ||
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname.startsWith('/account') ||
    (pathname.startsWith('/products/') && pathname !== '/products');

  const navItems: NavItem[] = [
    { href: '/', label: 'خانه', icon: Home, match: 'exact' },
    { href: '/products', label: 'محصولات', icon: LayoutGrid, match: 'prefix' },
    { href: '/journal', label: 'مجله', icon: BookOpen, match: 'prefix' },
    { href: '/track', label: 'رهگیری', icon: Truck, match: 'prefix' },
    { href: '/account', label: 'حساب', icon: UserRound, match: 'prefix' },
    { href: '/cart', label: 'سبد', icon: ShoppingBag, match: 'prefix', badge: cartCount },
  ];

  const activeIndex = isHidden
    ? -1
    : navItems.findIndex((item) =>
        item.match === 'exact'
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`),
      );

  const measureIndicator = useCallback(() => {
    const nav = navRef.current;
    if (!nav || activeIndex < 0) {
      setIndicator((current) => current.show ? { ...current, show: false } : current);
      return;
    }
    const active = nav.querySelectorAll<HTMLElement>('.fl-bottom-nav-item')[activeIndex];
    if (!active) return;
    const navRect = nav.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    setIndicator({
      left: activeRect.left - navRect.left,
      width: activeRect.width,
      show: true,
    });
  }, [activeIndex]);

  useEffect(() => {
    measureIndicator();
    const nav = navRef.current;
    if (!nav) return;
    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(measureIndicator)
      : null;
    observer?.observe(nav);
    window.addEventListener('resize', measureIndicator, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measureIndicator);
    };
  }, [measureIndicator, pathname, cartCount]);

  if (isHidden) return null;

  return (
    <nav className="fl-bottom-nav md:hidden" aria-label="ناوبری اصلی فروشگاه">
      <div className="fl-bottom-nav-inner" ref={navRef}>
        {indicator.show && (
          <span
            className="fl-bottom-nav-pill"
            style={{ width: `${indicator.width}px`, transform: `translateX(${indicator.left}px)` }}
            aria-hidden="true"
          />
        )}
        {navItems.map((item, index) => {
          const active = index === activeIndex;
          const Icon = item.icon;
          const showBadge = item.href === '/cart' && cartCount > 0 && !isCartOrCheckout;
          const accessibleName = showBadge
            ? `${item.label}، ${cartCount} کالا`
            : item.label;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`fl-bottom-nav-item${active ? ' is-active' : ''}`}
              aria-label={accessibleName}
              aria-current={active ? 'page' : undefined}
              title={item.label}
              prefetch={true}
            >
              <span className="fl-bottom-nav-icon-wrap" aria-hidden="true">
                <Icon size={21} strokeWidth={active ? 2.25 : 1.75} />
                {showBadge && (
                  <span className="fl-bottom-nav-badge">
                    {cartCount > 99 ? '۹۹+' : cartCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </span>
              <span className="fl-bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}