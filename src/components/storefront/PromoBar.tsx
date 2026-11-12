'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Clock } from 'lucide-react';
import Link from 'next/link';

interface PromoBarProps {
  text: string;
  expiresAt: string | null;
  link?: string;
}

export default function PromoBar({ text, expiresAt, link = '/products' }: PromoBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    // بررسی اینکه آیا کاربر این "متن خاص" را قبلاً بسته است یا نه
    const dismissedText = localStorage.getItem('promo-bar-dismissed-text');
    if (dismissedText === text) return;

    if (expiresAt) {
      const expireTime = new Date(expiresAt).getTime();
      if (expireTime < Date.now()) return;

      const timer = setInterval(() => {
        const now = Date.now();
        const distance = expireTime - now;

        if (distance < 0) {
          clearInterval(timer);
          setIsVisible(false);
          return;
        }

        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }, 1000);

      setIsVisible(true);
      return () => clearInterval(timer);
    } else {
      setIsVisible(true);
    }
  }, [expiresAt, text]);

  const handleDismiss = () => {
    setIsVisible(false);
    // ذخیره متن فعلی برای اینکه اگر متن عوض شد، دوباره نمایش داده شود
    localStorage.setItem('promo-bar-dismissed-text', text);
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#c61d70] via-[#e84e9e] to-[#c61d70] text-white shadow-md overflow-hidden z-[60]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50 pointer-events-none animate-pulse" />
      
      <div className="container-custom flex items-center justify-between gap-4 py-2.5 relative z-10">
        <Link href={link} className="flex-1 flex items-center justify-center gap-2 group text-xs md:text-sm font-bold hover:underline">
          <Sparkles size={16} className="text-yellow-300 animate-bounce shrink-0" />
          <span className="truncate text-center">{text}</span>
        </Link>

        {timeLeft && (
          <div className="hidden md:flex items-center gap-2 text-xs font-mono font-black bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10" dir="ltr">
            <Clock size={12} />
            {timeLeft.days > 0 && <span>{timeLeft.days}d</span>}
            <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        )}

        <button 
          onClick={handleDismiss} 
          className="p-1.5 hover:bg-white/20 rounded-full transition-colors shrink-0 flex items-center justify-center"
          aria-label="بستن نوار تبلیغاتی"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}