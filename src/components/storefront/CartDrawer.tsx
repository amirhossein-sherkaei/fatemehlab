'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // قفل کردن اسکرول صفحه وقتی سبد باز است
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  if (!isMounted || !isCartOpen) return null;

  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* بک‌دراپ تار */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={closeCart} 
      />

      {/* بدنه کشو */}
      <div className="relative w-full max-w-md h-full bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
        
        {/* هدر کشو */}
        <div className="flex items-center justify-between p-5 border-b border-[#e9e5eb] bg-gradient-to-r from-[#fff0f7] to-white">
          <h2 className="text-lg font-black text-[#28242b] flex items-center gap-2">
            <ShoppingBag className="text-[#c61d70]" size={20} />
            سبد خرید شما
            <span className="bg-[#c61d70] text-white text-[10px] px-2 py-0.5 rounded-full">
              {items.reduce((t, i) => t + i.quantity, 0).toLocaleString('fa-IR')} کالا
            </span>
          </h2>
          <button onClick={closeCart} className="p-2 bg-white rounded-xl border border-[#e9e5eb] text-[#77717b] hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm">
            <X size={18} />
          </button>
        </div>

        {/* لیست محصولات */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-24 h-24 bg-[#fff0f7] rounded-full flex items-center justify-center">
                <ShoppingBag size={40} className="text-[#c61d70]/40" />
              </div>
              <h3 className="font-black text-lg text-[#28242b]">سبد خرید شما خالی است</h3>
              <p className="text-sm text-[#77717b] max-w-[250px]">محصولات مورد علاقه خود را پیدا کنید و به سبد خرید اضافه کنید.</p>
              <button onClick={closeCart} className="mt-4 px-6 py-2.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors">
                مشاهده محصولات
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white p-3 rounded-2xl border border-[#e9e5eb] shadow-sm group">
                <div className="relative w-20 h-20 shrink-0 bg-[#fafafc] rounded-xl overflow-hidden border border-[#f5f0f2]">
                  {item.mainImage ? (
                    <Image src={item.mainImage} alt={item.name} fill className="object-contain p-2" />
                  ) : (
                    <Sparkles className="w-6 h-6 m-auto text-[#c61d70]/20" />
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <Link href={`/products/${item.slug}`} onClick={closeCart} className="text-sm font-bold text-[#28242b] hover:text-[#c61d70] transition-colors line-clamp-2 leading-relaxed">
                      {item.name}
                    </Link>
                    <button onClick={() => removeItem(item.id)} className="p-1.5 text-[#918a95] hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center bg-[#fafafc] border border-[#e9e5eb] rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-white hover:text-[#c61d70] text-[#77717b] transition-colors">
                        <Plus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-black text-[#28242b]">{item.quantity.toLocaleString('fa-IR')}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1.5 hover:bg-white hover:text-[#c61d70] text-[#77717b] transition-colors disabled:opacity-30">
                        <Minus size={14} />
                      </button>
                    </div>
                    <span className="text-sm font-black text-[#28242b]">{formatToman(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* فوتر کشو */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#e9e5eb] bg-white space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#77717b]">جمع کل</span>
              <span className="font-bold text-[#28242b]">{formatToman(totalPrice)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#77717b]">هزینه ارسال</span>
              <span className="text-[#c61d70] font-bold text-xs">در مرحله بعد</span>
            </div>
            <div className="border-t border-dashed border-[#e9e5eb] pt-4 flex justify-between items-center">
              <span className="font-black text-[#28242b]">مبلغ قابل پرداخت</span>
              <span className="font-black text-xl text-[#c61d70]">{formatToman(totalPrice)}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link href="/checkout" onClick={closeCart} className="flex items-center justify-center gap-1.5 bg-[#c61d70] text-white text-sm font-bold py-3 rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all">
                تسویه حساب <ArrowLeft size={16} />
              </Link>
              <Link href="/cart" onClick={closeCart} className="flex items-center justify-center gap-1.5 bg-[#fafafc] text-[#28242b] border border-[#e9e5eb] text-sm font-bold py-3 rounded-xl hover:bg-white transition-all">
                مشاهده سبد
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#77717b]">
              <ShieldCheck size={12} className="text-emerald-500" />
              پرداخت امن و رمزنگاری شده
            </div>
          </div>
        )}
      </div>
    </div>
  );
}