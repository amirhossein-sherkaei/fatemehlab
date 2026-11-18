'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock3, Loader2, Search, Sparkles, X } from 'lucide-react';
import { formatToman } from '@/lib/currency';

type SearchProduct = {
  id: string | number;
  slug: string;
  name: string;
  price?: number | null;
  mainImage?: string | null;
};

type SearchResponse = {
  success?: boolean;
  results?: SearchProduct[];
};

const HISTORY_KEY = 'fatemeh-beauty-search-history';

export default function InstantSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      if (Array.isArray(saved)) {
        setHistory(saved.filter((item): item is string => typeof item === 'string').slice(0, 5));
      }
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    const term = query.trim();
    if (!isOpen || term.length < 2) {
      setResults([]);
      setLoading(false);
      setHasError(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setHasError(false);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(term)}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Search request failed');
        const data = (await response.json()) as SearchResponse;
        if (!data.success || !Array.isArray(data.results)) throw new Error('Invalid search response');
        setResults(data.results);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        setResults([]);
        setHasError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 320);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isOpen, query]);

  const closeSearch = () => setIsOpen(false);

  const rememberSearch = (term: string) => {
    const next = [term, ...history.filter((item) => item !== term)].slice(0, 5);
    setHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {
      // Search still works when browser storage is unavailable.
    }
  };

  const navigateToSearchResults = () => {
    const term = query.trim();
    if (!term) return;
    rememberSearch(term);
    setIsOpen(false);
    router.push(`/products?q=${encodeURIComponent(term)}`);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigateToSearchResults();
  };

  const chooseHistory = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="fl-icon-button fl-search-trigger"
        aria-label="جست‌وجوی محصولات"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        title="جست‌وجوی محصولات"
      >
        <Search size={19} strokeWidth={1.9} />
      </button>

      {isOpen && isMounted && createPortal(
        <div className="fl-search-portal-root">
          <button
            type="button"
            className="fl-search-backdrop"
            onClick={closeSearch}
            aria-label="بستن جست‌وجو"
          />

          <section
            className="fl-search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="جست‌وجوی محصولات فروشگاه"
          >
            <div className="fl-search-dialog-head">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#fff0f7] text-[#c61d70]">
                  <Search size={19} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-black text-[#28242b]">جست‌وجوی فروشگاه</h2>
                  <p className="mt-0.5 text-[11px] text-[#918a95]">نام محصول یا برند موردنظرت را وارد کن</p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeSearch}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f7f5f8] text-[#77717b] transition hover:bg-[#fff0f7] hover:text-[#c61d70]"
                aria-label="بستن جست‌وجو"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={submitSearch} className="fl-search-dialog-form">
              <Search size={19} className="shrink-0 text-[#c61d70]" />
              <input
                ref={inputRef}
                autoFocus
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="مثلاً کرم مرطوب‌کننده..."
                autoComplete="off"
                enterKeyHint="search"
                aria-label="عبارت جست‌وجو"
                dir="rtl"
              />
              {loading ? (
                <Loader2 size={18} className="shrink-0 animate-spin text-[#c61d70]" aria-label="در حال جست‌وجو" />
              ) : query ? (
                <button type="button" onClick={() => setQuery('')} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#918a95] hover:bg-white" aria-label="پاک کردن جست‌وجو">
                  <X size={16} />
                </button>
              ) : null}
              <button type="submit" className="fl-search-submit" disabled={!query.trim()}>
                جست‌وجو
              </button>
            </form>

            <div className="fl-search-dialog-results" aria-live="polite">
              {query.trim().length === 1 && (
                <p className="py-7 text-center text-xs text-[#77717b]">برای جست‌وجوی دقیق‌تر حداقل دو حرف وارد کن.</p>
              )}

              {query.trim().length >= 2 && loading && results.length === 0 && (
                <div className="flex items-center justify-center gap-2 py-9 text-xs text-[#77717b]">
                  <Loader2 size={17} className="animate-spin text-[#c61d70]" /> در حال پیدا کردن محصولات...
                </div>
              )}

              {query.trim().length >= 2 && hasError && (
                <div className="py-8 text-center">
                  <p className="text-sm font-bold text-[#28242b]">جست‌وجو انجام نشد</p>
                  <p className="mt-1 text-xs text-[#77717b]">اتصال را بررسی کن و دوباره تلاش کن.</p>
                </div>
              )}

              {query.trim().length >= 2 && !loading && !hasError && results.length === 0 && (
                <div className="py-8 text-center">
                  <Sparkles size={25} className="mx-auto mb-2 text-[#c61d70]/45" />
                  <p className="text-sm font-bold text-[#28242b]">محصولی پیدا نشد</p>
                  <p className="mt-1 text-xs text-[#77717b]">عبارت دیگری را امتحان کن.</p>
                </div>
              )}

              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={closeSearch}
                  className="fl-search-result"
                >
                  <span className="fl-search-result-image">
                    {product.mainImage ? (
                      <Image src={product.mainImage} alt={product.name} fill sizes="56px" className="object-contain p-1" />
                    ) : (
                      <Sparkles size={20} className="text-[#c61d70]/35" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-bold text-[#28242b]">{product.name}</span>
                    <span className="mt-1 block text-xs font-black text-[#c61d70]">
                      {typeof product.price === 'number' && product.price > 0 ? formatToman(product.price) : 'قیمت به‌زودی'}
                    </span>
                  </span>
                  <ArrowLeft size={16} className="shrink-0 text-[#a39aa5]" />
                </Link>
              ))}

              {!query.trim() && history.length > 0 && (
                <div className="py-2">
                  <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-bold text-[#918a95]">
                    <Clock3 size={14} /> جست‌وجوهای اخیر
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {history.map((term) => (
                      <button key={term} type="button" onClick={() => chooseHistory(term)} className="rounded-full border border-[#eee7ed] bg-white px-3 py-1.5 text-xs text-[#625c66] transition hover:border-[#e8b8d0] hover:text-[#c61d70]">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!query.trim() && history.length === 0 && (
                <div className="py-8 text-center">
                  <Sparkles size={25} className="mx-auto mb-2 text-[#c61d70]/45" />
                  <p className="text-xs text-[#77717b]">جست‌وجو را با نام محصول یا برند شروع کن.</p>
                </div>
              )}
            </div>

            {results.length > 0 && query.trim().length >= 2 && (
              <div className="fl-search-dialog-foot">
                <button type="button" onClick={navigateToSearchResults}>
                  مشاهده همه نتایج <ArrowLeft size={14} />
                </button>
              </div>
            )}
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
