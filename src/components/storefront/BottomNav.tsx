'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, BookOpen, ShoppingBag, User, Truck } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useEffect, useState, useRef } from 'react';

export default function BottomNav() {
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, show: false });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsMounted(true); }, []);

  const cartCount = isMounted ? items.reduce((total, item) => total + item.quantity, 0) : 0;
  const isCartPage = pathname === '/cart' || pathname === '/checkout';

  const isHidden =
    pathname.startsWith('/admin') ||
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname.startsWith('/account') ||
    (pathname.startsWith('/products/') && pathname !== '/products');

  const navItems = [
    { href: '/', label: 'خانه', icon: Home, match: 'exact' as const },
    { href: '/products', label: 'محصولات', icon: LayoutGrid, match: 'prefix' as const },
    { href: '/journal', label: 'مجله', icon: BookOpen, match: 'prefix' as const },
    { href: '/track', label: 'رهگیری', icon: Truck, match: 'prefix' as const },
    { href: '/account', label: 'حساب', icon: User, match: 'prefix' as const },
    { href: '/cart', label: 'سبد', icon: ShoppingBag, match: 'prefix' as const, badge: cartCount },
  ];

  const activeIndex = isHidden ? -1 : navItems.findIndex((item) => {
    if (item.match === 'exact') return pathname === item.href;
    return pathname === item.href || pathname.startsWith(item.href + '/');
  });

  useEffect(() => {
    if (activeIndex < 0 || !navRef.current) {
      setIndicator((prev) => ({ ...prev, show: false }));
      return;
    }
    const nav = navRef.current;
    const allItems = nav.querySelectorAll('.fl-bottom-nav-item');
    const activeEl = allItems[activeIndex] as HTMLElement;
    if (activeEl) {
      const navRect = nav.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      setIndicator({
        left: activeRect.left - navRect.left,
        width: activeRect.width,
        show: true,
      });
    }
  }, [activeIndex, pathname, cartCount]);

  if (isHidden) return null;

  return (
    <nav className="fl-bottom-nav md:hidden" aria-label="ناوبری موبایل">
      <div className="fl-bottom-nav-inner" ref={navRef}>
        {indicator.show && (
          <div
            className="fl-bottom-nav-pill"
            style={{
              width: `${indicator.width}px`,
              transform: `translateX(${indicator.left}px)`,
            }}
            aria-hidden="true"
          />
        )}

        {navItems.map((item, idx) => {
          const isActive = idx === activeIndex;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`fl-bottom-nav-item ${isActive ? 'is-active' : ''}`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="fl-bottom-nav-icon-wrap">
                <Icon size={22} strokeWidth={isActive ? 2.4 : 1.7} />
                {(item.badge && item.badge > 0 && !isCartPage) ? (
                  <span className="fl-bottom-nav-badge">
                    {item.badge.toLocaleString('fa-IR')}
                  </span>
                ) : null}
              </div>
              <span className="fl-bottom-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}