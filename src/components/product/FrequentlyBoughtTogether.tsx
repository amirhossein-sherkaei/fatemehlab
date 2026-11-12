'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { Plus, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  mainImage: string | null;
};

export default function FrequentlyBoughtTogether({ currentProduct, fbtProducts }: { currentProduct: Product, fbtProducts: Product[] }) {
  const { addBundle, openCart } = useCartStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([currentProduct.id, ...fbtProducts.map(p => p.id)]);
  
  const allProducts = [currentProduct, ...fbtProducts];

  const toggleSelection = (id: string) => {
    if (id === currentProduct.id) return; // محصول اصلی همیشه انتخاب است
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedProducts = allProducts.filter(p => selectedIds.includes(p.id));
  const totalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddBundle = () => {
    if (selectedProducts.length === 0) return;
    
    // تبدیل به فرمت سبد خرید
    const cartItems = selectedProducts.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price,
      mainImage: p.mainImage,
    }));

    addBundle(cartItems);
    toast.success('محصولات انتخابی به سبد خرید اضافه شدند');
    openCart();
  };

  if (fbtProducts.length === 0) return null;

  return (
    <div className="mt-12 bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-8 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#fff0f7] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="relative z-10">
        <h2 className="text-xl font-black text-[#28242b] mb-6 flex items-center gap-2">
          <Sparkles className="text-[#c61d70]" size={24} />
          مشتریان دیگر این محصولات را با هم می‌خرند
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
          {/* نمایش محصولات */}
          <div className="flex-1 flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4">
            {allProducts.map((product, index) => {
              const isSelected = selectedIds.includes(product.id);
              const isMain = index === 0;

              return (
                <div key={product.id} className="flex items-center gap-3 md:gap-4">
                  <div 
                    className={`relative w-24 h-24 md:w-32 md:h-32 rounded-2xl border-2 transition-all duration-300 p-2 flex flex-col items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#c61d70] bg-[#fffafc] shadow-md' : 'border-[#e9e5eb] bg-white opacity-60 grayscale'
                    } ${!isMain ? 'cursor-pointer hover:border-[#c61d70]/50' : ''}`}
                    onClick={() => toggleSelection(product.id)}
                  >
                    {/* چک‌باکس */}
                    {!isMain && (
                      <div className={`absolute top-2 right-2 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#c61d70] border-[#c61d70]' : 'bg-white border-[#e9e5eb]'}`}>
                        {isSelected && <Check size={12} className="text-white" />}
                      </div>
                    )}
                    {isMain && (
                      <span className="absolute -top-3 bg-[#c61d70] text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 whitespace-nowrap">این محصول</span>
                    )}

                    <div className="relative w-full h-full">
                      {product.mainImage ? (
                        <Image src={product.mainImage} alt={product.name} fill className="object-contain p-1" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 m-auto text-[#c61d70]/20" />
                      )}
                    </div>
                    <p className="text-[10px] md:text-xs font-bold text-[#28242b] mt-1 line-clamp-1 text-center">{product.name}</p>
                  </div>
                  
                  {index < allProducts.length - 1 && (
                    <div className="w-8 h-8 rounded-full bg-[#f8f7fa] border border-[#e9e5eb] flex items-center justify-center text-[#77717b] shrink-0">
                      <Plus size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* بخش پرداخت */}
          <div className="w-full lg:w-72 shrink-0 bg-[#fafafc] rounded-2xl p-5 border border-[#e9e5eb]">
            <div className="mb-4">
              <p className="text-xs text-[#77717b] mb-1">قیمت {selectedProducts.length} محصول انتخابی:</p>
              <p className="text-xl md:text-2xl font-black text-[#28242b]">{formatToman(totalPrice)}</p>
            </div>
            <button
              onClick={handleAddBundle}
              disabled={selectedProducts.length === 0}
              className="w-full h-12 bg-[#c61d70] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all disabled:opacity-50"
            >
              <ShoppingBag size={18} />
              افزودن همه به سبد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}