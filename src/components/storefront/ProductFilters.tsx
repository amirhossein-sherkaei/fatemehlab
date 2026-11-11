'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SlidersHorizontal, X, Check } from 'lucide-react';

const SKIN_TYPES = ['پوست خشک', 'پوست چرب', 'پوست مختلط', 'پوست حساس', 'موی خشک', 'موی چرب'];
const SORT_OPTIONS = [
  { label: 'جدیدترین', value: 'newest' },
  { label: 'ارزان‌ترین', value: 'cheapest' },
  { label: 'گران‌ترین', value: 'expensive' },
];

export default function ProductFilters({ brands }: { brands: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentSkinType = searchParams.get('skinType');
  const currentBrand = searchParams.get('brand');
  const currentSort = searchParams.get('sort') || 'newest';

  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    return params.toString();
  };

  const handleFilter = (name: string, value: string) => {
    const current = searchParams.get(name);
    const newValue = current === value ? null : value;
    router.push(`${pathname}?${createQueryString(name, newValue)}`, { scroll: false });
  };

  const activeFiltersCount = Array.from(searchParams.keys()).filter(k => ['skinType', 'brand'].includes(k)).length;

  return (
    <>
      {/* نوار مرتب‌سازی و دکمه فیلتر موبایل */}
      <div className="flex items-center justify-between gap-3 mb-6 w-full overflow-x-auto pb-2">
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e9e5eb] rounded-xl text-sm font-bold text-[#28242b] shadow-sm shrink-0 hover:border-[#c61d70] transition-colors"
        >
          <SlidersHorizontal size={16} /> 
          فیلترها
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 flex items-center justify-center bg-[#c61d70] text-white text-[10px] rounded-full">
              {activeFiltersCount.toLocaleString('fa-IR')}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-[#77717b] font-medium hidden md:inline">مرتب‌سازی:</span>
          <div className="flex bg-white border border-[#e9e5eb] rounded-xl p-1 shadow-sm">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => router.push(`${pathname}?${createQueryString('sort', opt.value)}`, { scroll: false })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${currentSort === opt.value ? 'bg-[#28242b] text-white' : 'text-[#77717b] hover:text-[#28242b]'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* پنل فیلتر (Drawer) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-start md:justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative w-[85vw] max-w-sm h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left md:slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-5 border-b border-[#e9e5eb] bg-[#fafafc]">
              <h3 className="font-black text-lg flex items-center gap-2"><SlidersHorizontal size={18} /> فیلترهای محصولات</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 bg-white border border-[#e9e5eb] rounded-lg hover:text-rose-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-8">
              {/* نوع پوست/مو */}
              <div>
                <h4 className="text-sm font-bold text-[#28242b] mb-4">نوع پوست / مو</h4>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TYPES.map(type => {
                    const isActive = currentSkinType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => handleFilter('skinType', type)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          isActive ? 'bg-[#fff0f7] border-[#c61d70] text-[#c61d70]' : 'bg-white border-[#e9e5eb] text-[#77717b] hover:border-[#c61d70]'
                        }`}
                      >
                        {isActive && <Check size={12} />} {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* برند */}
              {brands.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#28242b] mb-4">برند</h4>
                  <div className="flex flex-col gap-2">
                    {brands.map(brand => {
                      const isActive = currentBrand === brand;
                      return (
                        <button
                          key={brand}
                          onClick={() => handleFilter('brand', brand)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm border transition-all ${
                            isActive ? 'bg-[#fff0f7] border-[#c61d70] text-[#c61d70] font-bold' : 'bg-white border-[#e9e5eb] text-[#77717b] hover:border-[#c61d70]'
                          }`}
                        >
                          <span>{brand}</span>
                          {isActive && <Check size={16} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-[#e9e5eb] bg-white flex gap-3">
              <button 
                onClick={() => router.push(pathname, { scroll: false })}
                className="flex-1 py-3 bg-[#f8f7fa] text-[#28242b] text-sm font-bold rounded-xl border border-[#e9e5eb]"
              >
                حذف همه فیلترها
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20"
              >
                مشاهده نتایج
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}