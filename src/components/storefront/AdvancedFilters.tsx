'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Check, ChevronDown, Filter, RotateCcw, SlidersHorizontal, X,
} from 'lucide-react';

type FilterData = {
  categories: { id: string; name: string; slug: string }[];
  brands: string[];
  skinTypes: string[];
  maxPrice: number;
};

const SORT_OPTIONS = [
  { label: 'جدیدترین', value: 'newest' },
  { label: 'پرفروش‌ترین', value: 'bestselling' },
  { label: 'بالاترین امتیاز', value: 'toprated' },
  { label: 'پیشنهاد فروشگاه', value: 'featured' },
  { label: 'ارزان‌ترین', value: 'cheapest' },
  { label: 'گران‌ترین', value: 'expensive' },
];

export default function AdvancedFilters({ data, totalResults }: { data: FilterData; totalResults: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const currentBrands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
  const currentSkinTypes = searchParams.get('skinTypes')?.split(',').filter(Boolean) || [];
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentQuery = searchParams.get('q') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const [priceRange, setPriceRange] = useState({
    min: currentMinPrice ? String(Math.floor(Number(currentMinPrice) / 10)) : '',
    max: currentMaxPrice ? String(Math.floor(Number(currentMaxPrice) / 10)) : String(Math.floor(data.maxPrice / 10)),
  });

  useEffect(() => {
    setPriceRange({
      min: currentMinPrice ? String(Math.floor(Number(currentMinPrice) / 10)) : '',
      max: currentMaxPrice ? String(Math.floor(Number(currentMaxPrice) / 10)) : String(Math.floor(data.maxPrice / 10)),
    });
  }, [currentMinPrice, currentMaxPrice, data.maxPrice]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const toggleListValue = (key: 'brands' | 'skinTypes', current: string[], value: string) => {
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    updateURL({ [key]: next.length ? next.join(',') : null });
  };

  const applyPriceRange = () => {
    const min = priceRange.min.trim() ? Math.max(0, Math.floor(Number(priceRange.min))) : 0;
    const max = priceRange.max.trim() ? Math.max(0, Math.floor(Number(priceRange.max))) : Math.floor(data.maxPrice / 10);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min > max) return;
    updateURL({
      minPrice: min > 0 ? String(min * 10) : null,
      maxPrice: max < Math.floor(data.maxPrice / 10) ? String(max * 10) : null,
    });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const activeChips: { key: string; label: string; remove: () => void }[] = (() => {
    const chips: { key: string; label: string; remove: () => void }[] = [];
    if (currentQuery) chips.push({ key: 'query', label: `جست‌وجو: ${currentQuery}`, remove: () => updateURL({ q: null }) });
    currentBrands.forEach((brand) => chips.push({ key: `brand-${brand}`, label: `برند: ${brand}`, remove: () => toggleListValue('brands', currentBrands, brand) }));
    currentSkinTypes.forEach((skinType) => chips.push({ key: `skin-${skinType}`, label: skinType, remove: () => toggleListValue('skinTypes', currentSkinTypes, skinType) }));
    if (currentCategory) chips.push({
      key: 'category',
      label: `دسته: ${data.categories.find((item) => item.slug === currentCategory)?.name || currentCategory}`,
      remove: () => updateURL({ category: null }),
    });
    if (currentInStock) chips.push({ key: 'stock', label: 'فقط محصولات قابل سفارش', remove: () => updateURL({ inStock: null }) });
    if (currentMinPrice || currentMaxPrice) chips.push({
      key: 'price',
      label: `قیمت: ${currentMinPrice ? Math.floor(Number(currentMinPrice) / 10).toLocaleString('fa-IR') : '۰'} تا ${currentMaxPrice ? Math.floor(Number(currentMaxPrice) / 10).toLocaleString('fa-IR') : Math.floor(data.maxPrice / 10).toLocaleString('fa-IR')} تومان`,
      remove: () => updateURL({ minPrice: null, maxPrice: null }),
    });
    return chips;
  })();

  const activeFiltersCount = activeChips.length;
  const selectedSort = SORT_OPTIONS.some((option) => option.value === currentSort) ? currentSort : 'newest';

  const FilterContent = () => (
    <div className="fbl-filter-content">
      <section className="fbl-filter-group" aria-labelledby="fbl-filter-category-title">
        <h3 id="fbl-filter-category-title">دسته‌بندی</h3>
        <div className="fbl-filter-category-list">
          <button type="button" aria-pressed={!currentCategory} className={!currentCategory ? 'is-active' : ''} onClick={() => updateURL({ category: null })}>
            <span>همه محصولات</span>{!currentCategory && <Check size={15} aria-hidden="true" />}
          </button>
          {data.categories.map((item) => (
            <button type="button" key={item.id} aria-pressed={currentCategory === item.slug}
              className={currentCategory === item.slug ? 'is-active' : ''} onClick={() => updateURL({ category: item.slug })}>
              <span>{item.name}</span>{currentCategory === item.slug && <Check size={15} aria-hidden="true" />}
            </button>
          ))}
        </div>
      </section>

      {data.brands.length > 0 && (
        <section className="fbl-filter-group" aria-labelledby="fbl-filter-brand-title">
          <h3 id="fbl-filter-brand-title">برند محصولات</h3>
          <div className="fbl-filter-check-list">
            {data.brands.map((brand) => (
              <label key={brand} className="fbl-filter-checkbox">
                <input type="checkbox" checked={currentBrands.includes(brand)} onChange={() => toggleListValue('brands', currentBrands, brand)} />
                <span className="fbl-filter-checkbox__box"><Check size={12} aria-hidden="true" /></span>
                <span className="fbl-filter-checkbox__label">{brand}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      {data.skinTypes.length > 0 && (
        <section className="fbl-filter-group" aria-labelledby="fbl-filter-skin-title">
          <h3 id="fbl-filter-skin-title">نوع پوست و مو</h3>
          <div className="fbl-filter-pills">
            {data.skinTypes.map((skinType) => (
              <button type="button" key={skinType} aria-pressed={currentSkinTypes.includes(skinType)}
                className={currentSkinTypes.includes(skinType) ? 'is-active' : ''}
                onClick={() => toggleListValue('skinTypes', currentSkinTypes, skinType)}>{skinType}</button>
            ))}
          </div>
        </section>
      )}

      <section className="fbl-filter-group" aria-labelledby="fbl-filter-price-title">
        <h3 id="fbl-filter-price-title">محدوده قیمت <small>(تومان)</small></h3>
        <div className="fbl-filter-price-fields">
          <label>
            <span>از</span>
            <input type="number" inputMode="numeric" min="0" max={priceRange.max || undefined} step="1000"
              value={priceRange.min} onChange={(event) => setPriceRange((previous) => ({ ...previous, min: event.target.value }))} />
          </label>
          <label>
            <span>تا</span>
            <input type="number" inputMode="numeric" min={priceRange.min || 0} max={Math.floor(data.maxPrice / 10)} step="1000"
              value={priceRange.max} onChange={(event) => setPriceRange((previous) => ({ ...previous, max: event.target.value }))} />
          </label>
        </div>
        <button type="button" className="fbl-filter-apply" onClick={applyPriceRange}
          disabled={Boolean(priceRange.min && priceRange.max && Number(priceRange.min) > Number(priceRange.max))}>
          اعمال محدوده قیمت <ArrowIcon />
        </button>
      </section>

      <section className="fbl-filter-group" aria-labelledby="fbl-filter-stock-title">
        <h3 id="fbl-filter-stock-title">وضعیت محصول</h3>
        <label className="fbl-filter-stock">
          <input type="checkbox" checked={currentInStock} onChange={() => updateURL({ inStock: currentInStock ? null : 'true' })} />
          <span>فقط محصولات قابل سفارش</span>
          <span className="fbl-filter-stock__switch" aria-hidden="true" />
        </label>
      </section>

      {activeFiltersCount > 0 && (
        <button type="button" className="fbl-filter-clear" onClick={clearAllFilters}>
          <RotateCcw size={14} aria-hidden="true" /> پاک کردن همه فیلترها
        </button>
      )}
    </div>
  );

  return (
    <>
      <aside className="fbl-catalog-sidebar" aria-label="فیلترهای محصولات">
        <div className="fbl-catalog-filter-panel">
          <div className="fbl-catalog-filter-panel__head">
            <span className="fbl-catalog-filter-panel__icon"><SlidersHorizontal size={17} aria-hidden="true" /></span>
            <div><strong>فیلترهای انتخاب</strong><small>نتایج را دقیق‌تر کنید</small></div>
            {activeFiltersCount > 0 && <span className="fbl-catalog-filter-count">{activeFiltersCount.toLocaleString('fa-IR')}</span>}
          </div>
          <FilterContent />
        </div>
      </aside>

      <div className="fbl-catalog-filter-tools">
        <div className="fbl-catalog-toolbar">
          <button type="button" className="fbl-mobile-filter-trigger" onClick={() => setIsOpen(true)}>
            <Filter size={16} aria-hidden="true" /> فیلترها
            {activeFiltersCount > 0 && <span>{activeFiltersCount.toLocaleString('fa-IR')}</span>}
          </button>
          <label className="fbl-catalog-sort">
            <span>مرتب‌سازی</span>
            <select value={selectedSort} onChange={(event) => updateURL({ sort: event.target.value === 'newest' ? null : event.target.value })}>
              {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </label>
          <span className="fbl-catalog-result-count" aria-live="polite">{totalResults.toLocaleString('fa-IR')} نتیجه</span>
        </div>

        {activeChips.length > 0 && (
          <div className="fbl-catalog-active-filters" aria-label="فیلترهای فعال">
            {activeChips.map((chip) => (
              <button type="button" key={chip.key} onClick={chip.remove}>
                <span>{chip.label}</span><X size={12} aria-hidden="true" />
              </button>
            ))}
            <button type="button" className="fbl-catalog-active-filters__clear" onClick={clearAllFilters}>حذف همه</button>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="fbl-filter-drawer" role="presentation">
          <button type="button" className="fbl-filter-drawer__backdrop" aria-label="بستن فیلترها" onClick={() => setIsOpen(false)} />
          <div className="fbl-filter-drawer__dialog" role="dialog" aria-modal="true" aria-labelledby="fbl-filter-drawer-title" ref={dialogRef}>
            <div className="fbl-filter-drawer__header">
              <div><span>REFINE YOUR SELECTION</span><h2 id="fbl-filter-drawer-title">فیلترهای محصولات</h2></div>
              <button ref={closeButtonRef} type="button" onClick={() => setIsOpen(false)} aria-label="بستن پنل فیلترها"><X size={19} /></button>
            </div>
            <div className="fbl-filter-drawer__body"><FilterContent /></div>
            <div className="fbl-filter-drawer__footer">
              <button type="button" onClick={() => setIsOpen(false)}>مشاهده {totalResults.toLocaleString('fa-IR')} محصول</button>
              {activeFiltersCount > 0 && <button type="button" onClick={clearAllFilters}>پاک کردن</button>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">←</span>;
}
