'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { formatToman } from '@/lib/currency';

export default function InstantSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // بستن منو با کلیک بیرون
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  // جستجوی زنده با تاخیر (Debounce)
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) setResults(data.results);
      } catch (err) {
        console.error('Search error');
      } finally {
        setLoading(false);
      }
    }, 400); // ۴۰۰ میلی‌ثانیه صبر می‌کند تا تایپ کاربر تمام شود

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative">
      {/* دکمه آیکون جستجو (در موبایل و دسکتاپ) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fl-icon-button"
        aria-label="جستجوی محصولات"
      >
        <Search size={18} strokeWidth={1.8} />
      </button>

      {/* کادر شیشه‌ای جستجو */}
      {isOpen && (
        <div className="absolute top-full left-0 md:-left-20 mt-3 w-[320px] md:w-[450px] bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-[100]">
          <div className="p-4 border-b border-[#e9e5eb]/50 flex items-center gap-3 bg-white/50">
            <Search size={18} className="text-[#c61d70]" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام محصول، برند یا کلمات کلیدی..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[#28242b] placeholder:text-[#918a95]"
              dir="rtl"
            />
            {loading && <Loader2 size={16} className="text-[#c61d70] animate-spin" />}
          </div>

          <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2">
            {query.length > 0 && query.length < 2 && (
              <p className="text-center text-xs text-[#77717b] py-6">حداقل ۲ حرف وارد کنید...</p>
            )}

            {query.length >= 2 && results.length === 0 && !loading && (
              <div className="text-center py-8">
                <Sparkles size={24} className="mx-auto text-[#c61d70]/30 mb-2" />
                <p className="text-xs text-[#77717b]">محصولی با این مشخصات پیدا نشد.</p>
              </div>
            )}

            {results.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                onClick={() => { setIsOpen(false); setQuery(''); }}
                className="flex items-center gap-3 p-2 rounded-2xl hover:bg-[#fff0f7] transition-all group"
              >
                <div className="relative w-14 h-14 bg-white rounded-xl border border-[#e9e5eb] overflow-hidden shrink-0">
                  {product.mainImage ? (
                    <Image src={product.mainImage} alt={product.name} fill className="object-contain p-1" />
                  ) : (
                    <Sparkles className="w-5 h-5 m-auto text-[#c61d70]/20" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#28242b] truncate group-hover:text-[#c61d70] transition-colors">{product.name}</h4>
                  <p className="text-xs font-black text-[#c61d70] mt-1">{product.price > 0 ? formatToman(product.price) : 'به زودی'}</p>
                </div>
                <ArrowLeft size={16} className="text-[#918a95] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>

          {results.length > 0 && (
            <div className="p-3 border-t border-[#e9e5eb]/50 bg-[#fafafc]">
              <Link
                href={`/products?q=${query}`}
                onClick={() => setIsOpen(false)}
                className="block w-full text-center text-xs font-bold text-[#c61d70] py-2 hover:bg-[#fff0f7] rounded-xl transition-colors"
              >
                مشاهده همه نتایج برای "{query}"
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}