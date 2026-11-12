'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, X, Headphones, ArrowLeft } from 'lucide-react';

export default function FloatingSupportButton() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetch('/api/account/me')
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setLoggedIn(Boolean(data?.success)))
      .catch(() => setLoggedIn(false));
  }, []);

  // 🛡️ مخفی کردن در صفحات خاص (ادمین، حساب، سبد، تسویه، لاگین)
  const hidden =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/cart') ||
    pathname === '/login' ||
    pathname === '/register';

  if (!isMounted || hidden || loggedIn === null) return null;

  return (
    <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-40">
      {expanded && (
        <div className="mb-3 w-72 rounded-2xl border border-[#e9e5eb] bg-white/95 backdrop-blur-xl p-4 shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-start gap-3 mb-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center shadow-md">
              <Headphones size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-[#28242b]">چطور می‌تونیم کمکتون کنیم؟</p>
              <p className="text-xs text-[#77717b] mt-1 leading-relaxed">
                سوال یا مشکلی دارید؟ تیم پشتیبانی همیشه آماده کمک است.
              </p>
            </div>
          </div>
          <Link
            href={loggedIn ? '/account/support' : '/account/login?redirect=/account/support'}
            onClick={() => setExpanded(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#c61d70] text-white text-xs font-black shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors"
          >
            {loggedIn ? 'ورود به پشتیبانی' : 'ورود برای پشتیبانی'}
            <ArrowLeft size={14} />
          </Link>
        </div>
      )}

      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white shadow-2xl shadow-[#c61d70]/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-glow-pulse"
        aria-label="پشتیبانی"
      >
        {expanded ? <X size={22} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}