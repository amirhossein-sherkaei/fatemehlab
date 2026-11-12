'use client';

import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { X, ShoppingBag, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addItem, openCart } = useCartStore();

  useEffect(() => {
    if (quickViewProduct) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const handleAddToCart = () => {
    addItem(quickViewProduct);
    toast.success('محصول به سبد خرید اضافه شد');
    closeQuickView();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={closeQuickView} />
      
      <div className="relative w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        <button onClick={closeQuickView} className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-[#77717b] hover:text-rose-500 shadow-sm transition-all">
          <X size={20} />
        </button>

        {/* تصویر */}
        <div className="md:w-1/2 bg-[#fafafc] p-8 flex items-center justify-center relative min-h-[300px]">
          {quickViewProduct.mainImage ? (
            <Image src={quickViewProduct.mainImage} alt={quickViewProduct.name} fill className="object-contain p-6 drop-shadow-xl hover:scale-105 transition-transform duration-500" />
          ) : (
            <Sparkles size={64} className="text-[#c61d70]/20" />
          )}
        </div>

        {/* اطلاعات */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-black text-[#28242b] leading-relaxed mb-2">{quickViewProduct.name}</h2>
          <p className="text-2xl font-black text-[#c61d70] mb-6">
            {quickViewProduct.price > 0 ? formatToman(quickViewProduct.price) : 'به زودی'}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-[#77717b] mb-8 bg-[#f8f7fa] p-3 rounded-xl border border-[#e9e5eb]">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            ارسال از انبار فاطمه بیوتی لند با ضمانت اصالت کالا
          </div>

          <div className="space-y-3 mt-auto">
            <button onClick={handleAddToCart} disabled={quickViewProduct.price <= 0} className="w-full h-12 bg-[#c61d70] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all disabled:opacity-50">
              <ShoppingBag size={18} /> افزودن به سبد خرید
            </button>
            <Link href={`/products/${quickViewProduct.slug}`} onClick={closeQuickView} className="w-full h-12 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#f8f7fa] transition-all">
              مشاهده جزئیات کامل <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}