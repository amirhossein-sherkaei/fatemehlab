'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Headphones, ArrowLeft, Loader2 } from 'lucide-react';

export default function FloatingSupportButton() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const authCheckStarted = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check authentication only when support is opened. The support control itself
  // remains visible immediately instead of waiting for an account API request.
  useEffect(() => {
    if (!expanded || authCheckStarted.current) return;
    authCheckStarted.current = true;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 7000);

    fetch('/api/account/me', {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      signal: controller.signal,
    })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setLoggedIn(Boolean(data?.success)))
      .catch(() => setLoggedIn(false))
      .finally(() => window.clearTimeout(timeoutId));
  }, [expanded]);

  const hidden =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/cart') ||
    pathname === '/login' ||
    pathname === '/register';

  // On product details the support bubble sits beside the dock, not above it.
  const bottomNavHidden =
    pathname.startsWith('/admin') ||
    pathname === '/cart' ||
    pathname === '/checkout' ||
    pathname.startsWith('/account');

  if (!isMounted || hidden) return null;

  return (
    <div
      className={`fbl-support-float fixed right-4 z-40 ${bottomNavHidden ? 'is-viewport-bottom' : 'is-above-bottom-nav'} ${pathname.startsWith('/products/') && pathname !== '/products' ? 'is-product-detail-page' : ''}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && expanded) {
          setExpanded(false);
          triggerRef.current?.focus();
        }
      }}
    >
      {expanded && (
        <div
          id="fbl-support-popover"
          role="dialog"
          aria-label="پنجره پشتیبانی"
          className="fbl-support-popover mb-3 w-72 rounded-2xl border border-[#e9e5eb] bg-white/95 backdrop-blur-xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center shadow-md">
              <Headphones size={18} className="text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-[#28242b]">چطور می‌تونیم کمکتون کنیم؟</p>
              <p className="text-xs text-[#77717b] mt-1 leading-relaxed">
                سوال یا مشکلی دارید؟ تیم پشتیبانی آماده کمک است.
              </p>
            </div>
          </div>

          {loggedIn === null ? (
            <div
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#faf5f8] text-[#8c4a6b] text-xs font-bold"
              role="status"
              aria-live="polite"
            >
              <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              در حال بررسی وضعیت حساب...
            </div>
          ) : (
            <Link
              href={loggedIn ? '/account/support' : '/account/login?redirect=%2Faccount%2Fsupport'}
              onClick={() => setExpanded(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#c61d70] text-white text-xs font-black shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors"
            >
              {loggedIn ? 'ورود به پشتیبانی' : 'ورود برای پشتیبانی'}
              <ArrowLeft size={14} aria-hidden="true" />
            </Link>
          )}
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="fbl-support-trigger w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white shadow-2xl shadow-[#c61d70]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all animate-glow-pulse"
        aria-label={expanded ? 'بستن پنجره پشتیبانی' : 'باز کردن پشتیبانی'}
        aria-expanded={expanded}
        aria-controls="fbl-support-popover"
        aria-haspopup="dialog"
      >
        {expanded ? <X size={22} aria-hidden="true" /> : <MessageCircle size={24} aria-hidden="true" />}
      </button>
    </div>
  );
}
