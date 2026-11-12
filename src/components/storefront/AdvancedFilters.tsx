'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown, Check, Package, DollarSign } from 'lucide-react';

type FilterData = {
  categories: { id: string; name: string; slug: string }[];
  brands: string[];
  skinTypes: string[];
  maxPrice: number;
};

const SKIN_TYPES_LIST = ['پوست خشک', 'پوست چرب', 'پوست مختلط', 'پوست حساس', 'موی خشک', 'موی چرب', 'همه انواع پوست'];

const SORT_OPTIONS = [
  { label: 'جدیدترین', value: 'newest' },
  { label: 'ارزان‌ترین', value: 'cheapest' },
  { label: 'گران‌ترین', value: 'expensive' },
];

export default function AdvancedFilters({ data, totalResults }: { data: FilterData; totalResults: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // خواندن فیلترهای فعال از URL
  const currentBrands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
  const currentSkinTypes = searchParams.get('skinTypes')?.split(',').filter(Boolean) || [];
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  // استیت اسلایدر قیمت
  const [priceRange, setPriceRange] = useState({
    min: currentMinPrice ? parseInt(currentMinPrice) : 0,
    max: currentMaxPrice ? parseInt(currentMaxPrice) : data.maxPrice,
  });

  // آپدیت URL
  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleBrand = (brand: string) => {
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter(b => b !== brand)
      : [...currentBrands, brand];
    updateURL({ brands: newBrands.length > 0 ? newBrands.join(',') : null });
  };

  const toggleSkinType = (type: string) => {
    const newTypes = currentSkinTypes.includes(type)
      ? currentSkinTypes.filter(t => t !== type)
      : [...currentSkinTypes, type];
    updateURL({ skinTypes: newTypes.length > 0 ? newTypes.join(',') : null });
  };

  const setCategory = (slug: string | null) => {
    updateURL({ category: slug });
  };

  const setSort = (sort: string) => {
    updateURL({ sort });
  };

  const applyPriceRange = () => {
    updateURL({
      minPrice: priceRange.min > 0 ? priceRange.min.toString() : null,
      maxPrice: priceRange.max < data.maxPrice ? priceRange.max.toString() : null,
    });
  };

  const clearAllFilters = () => {
    router.push(pathname, { scroll: false });
  };

  // شمارش فیلترهای فعال
  const activeFiltersCount = 
    currentBrands.length + 
    currentSkinTypes.length + 
    (currentCategory ? 1 : 0) + 
    (currentInStock ? 1 : 0) + 
    (currentMinPrice ? 1 : 0) + 
    (currentMaxPrice ? 1 : 0);

  // چیپ‌های فیلتر فعال
  const activeChips = [
    ...currentBrands.map(b => ({ label: `برند: ${b}`, onRemove: () => toggleBrand(b) })),
    ...currentSkinTypes.map(t => ({ label: t, onRemove: () => toggleSkinType(t) })),
    ...(currentCategory ? [{ label: `دسته: ${data.categories.find(c => c.slug === currentCategory)?.name || currentCategory}`, onRemove: () => setCategory(null) }] : []),
    ...(currentInStock ? [{ label: 'فقط موجود', onRemove: () => updateURL({ inStock: null }) }] : []),
    ...(currentMinPrice || currentMaxPrice ? [{ 
      label: `قیمت: ${currentMinPrice ? parseInt(currentMinPrice).toLocaleString('fa-IR') : '۰'} - ${currentMaxPrice ? parseInt(currentMaxPrice).toLocaleString('fa-IR') : data.maxPrice.toLocaleString('fa-IR')}`, 
      onRemove: () => updateURL({ minPrice: null, maxPrice: null }) 
    }] : []),
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      {/* دسته‌بندی */}
      <div>
        <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#c61d70] rounded-full"></span>
          دسته‌بندی
        </h3>
        <div className="space-y-1.5">
          <button onClick={() => setCategory(null)} className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold transition-colors ${!currentCategory ? 'bg-[#fff0f7] text-[#c61d70]' : 'text-[#77717b] hover:bg-[#f8f7fa]'}`}>
            همه محصولات
          </button>
          {data.categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setCategory(cat.slug)} 
              className={`w-full text-right px-3 py-2 rounded-lg text-xs font-bold transition-colors ${currentCategory === cat.slug ? 'bg-[#fff0f7] text-[#c61d70]' : 'text-[#77717b] hover:bg-[#f8f7fa]'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* برند */}
      {data.brands.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#c61d70] rounded-full"></span>
            برند
          </h3>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pl-1">
            {data.brands.map(brand => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer group py-1">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${currentBrands.includes(brand) ? 'bg-[#c61d70] border-[#c61d70]' : 'border-[#e9e5eb] group-hover:border-[#c61d70]/40'}`}>
                  {currentBrands.includes(brand) && <Check size={10} className="text-white" />}
                </div>
                <span className="text-xs font-medium text-[#28242b] group-hover:text-[#c61d70] transition-colors">{brand}</span>
                <input type="checkbox" checked={currentBrands.includes(brand)} onChange={() => toggleBrand(brand)} className="hidden" />
              </label>
            ))}
          </div>
        </div>
      )}

      {/* نوع پوست/مو */}
      {data.skinTypes.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-[#c61d70] rounded-full"></span>
            نوع پوست / مو
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skinTypes.map(type => (
              <button
                key={type}
                onClick={() => toggleSkinType(type)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${currentSkinTypes.includes(type) ? 'bg-[#c61d70] text-white border-[#c61d70]' : 'bg-white text-[#77717b] border-[#e9e5eb] hover:border-[#c61d70]/40'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* محدوده قیمت */}
      <div>
        <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#c61d70] rounded-full"></span>
          محدوده قیمت (تومان)
        </h3>
        <div className="bg-[#f8f7fa] rounded-xl p-3 border border-[#e9e5eb]">
          <div className="flex justify-between text-xs font-bold text-[#28242b] mb-3">
            <span>از: {(priceRange.min / 10).toLocaleString('fa-IR')}</span>
            <span>تا: {(priceRange.max / 10).toLocaleString('fa-IR')}</span>
          </div>
          <input 
            type="range" 
            min={0} 
            max={data.maxPrice} 
            step={10000}
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
            className="w-full accent-[#c61d70]"
          />
          <button 
            onClick={applyPriceRange} 
            className="w-full mt-3 py-2 bg-[#c61d70] text-white text-xs font-bold rounded-lg hover:bg-[#a9155d] transition-colors"
          >
            اعمال محدوده قیمت
          </button>
        </div>
      </div>

      {/* موجودی */}
      <div>
        <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-[#c61d70] rounded-full"></span>
          موجودی
        </h3>
        <button
          onClick={() => updateURL({ inStock: currentInStock ? null : 'true' })}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${currentInStock ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-[#e9e5eb] text-[#77717b] hover:border-emerald-200'}`}
        >
          <span className="flex items-center gap-2"><Package size={14} /> فقط محصولات موجود</span>
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${currentInStock ? 'bg-emerald-500 border-emerald-500' : 'border-[#e9e5eb]'}`}>
            {currentInStock && <Check size={10} className="text-white" />}
          </div>
        </button>
      </div>

      {activeFiltersCount > 0 && (
        <button onClick={clearAllFilters} className="w-full py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
          حذف همه فیلترها ({activeFiltersCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* سایدبار دسکتاپ */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="bg-white rounded-2xl border border-[#e9e5eb] shadow-sm sticky top-24 p-5">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#e9e5eb]">
            <h2 className="font-black text-sm text-[#28242b] flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-[#c61d70]" />
              فیلترها
            </h2>
            {activeFiltersCount > 0 && (
              <span className="text-[10px] bg-[#c61d70] text-white px-2 py-0.5 rounded-full font-bold">
                {activeFiltersCount.toLocaleString('fa-IR')} فعال
              </span>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* موبایل: دکمه باز کردن فیلتر + مرتب‌سازی */}
      <div className="lg:hidden flex items-center gap-2 mb-4">
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e9e5eb] rounded-xl text-xs font-bold text-[#28242b] shadow-sm relative">
          <SlidersHorizontal size={14} className="text-[#c61d70]" />
          فیلترها
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-[#c61d70] text-white text-[9px] rounded-full absolute -top-2 -right-2">
              {activeFiltersCount.toLocaleString('fa-IR')}
            </span>
          )}
        </button>
        
        <div className="flex-1"></div>
        
        <select 
          value={currentSort} 
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 bg-white border border-[#e9e5eb] rounded-xl text-xs font-bold text-[#28242b] cursor-pointer"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* سایدبار دسکتاپ: مرتب‌سازی */}
      <div className="hidden lg:flex items-center justify-end gap-2 mb-4">
        <span className="text-xs text-[#77717b] font-bold">مرتب‌سازی:</span>
        <div className="flex bg-white border border-[#e9e5eb] rounded-xl p-1 shadow-sm">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${currentSort === opt.value ? 'bg-[#28242b] text-white' : 'text-[#77717b] hover:text-[#28242b]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* چیپ‌های فیلتر فعال */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold text-[#77717b]">فیلترهای فعال:</span>
          {activeChips.map((chip, i) => (
            <button
              key={i}
              onClick={chip.onRemove}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff0f7] border border-[#f2d7e5] text-[#c61d70] text-[10px] font-bold rounded-lg hover:bg-[#fce5f0] transition-colors"
            >
              {chip.label}
              <X size={10} />
            </button>
          ))}
        </div>
      )}

      {/* کشوی موبایل */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-[85vw] max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[#e9e5eb] bg-[#fafafc]">
              <h2 className="font-black text-sm text-[#28242b]">فیلترهای پیشرفته</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white border border-[#e9e5eb] rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterContent />
            </div>
            <div className="p-4 border-t border-[#e9e5eb] bg-white">
              <button onClick={() => setIsOpen(false)} className="w-full py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20">
                مشاهده {totalResults.toLocaleString('fa-IR')} محصول
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}