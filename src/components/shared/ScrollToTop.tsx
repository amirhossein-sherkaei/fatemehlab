'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const percent = height > 0 ? (scrolled / height) * 100 : 0;
      setProgress(percent);
      setVisible(scrolled > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const circumference = 2 * Math.PI * 22;

  return (
    <button
      onClick={scrollUp}
      className={`fixed bottom-24 left-4 md:bottom-6 md:left-6 z-30 w-12 h-12 rounded-full bg-white/95 backdrop-blur-xl border border-[#e9e5eb] shadow-xl flex items-center justify-center text-[#c61d70] transition-all duration-300 hover:scale-110 hover:border-[#c61d70] hover:shadow-2xl ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-label="بازگشت به بالای صفحه"
    >
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="none" stroke="#f0edf1" strokeWidth="2" />
        <circle
          cx="24" cy="24" r="22"
          fill="none" stroke="#c61d70" strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress / 100)}
          strokeLinecap="round"
          className="transition-all duration-150"
        />
      </svg>
      <ArrowUp size={18} className="relative z-10" strokeWidth={2.5} />
    </button>
  );
}