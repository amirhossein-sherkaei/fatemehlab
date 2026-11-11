'use client';

import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return (
    <div className="min-h-screen bg-background pt-32 flex justify-center">
      <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container-custom py-6 md:py-10 pb-24 md:pb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink mb-6">سبد خرید شما</h1>

        {items.length === 0 ? (
          <div className="glass-panel p-10 md:p-16 text-center flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <ShoppingBag className="w-9 h-9 text-muted" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-ink mb-2">سبد خرید شما خالی است</h2>
            <p className="text-muted mb-8 text-sm">هنوز محصولی به سبد خرید اضافه نکرده‌اید.</p>
            <Link href="/products" className="btn-primary w-full">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* لیست محصولات */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="glass-panel p-4 flex gap-3 items-start">
                  <Link href={`/products/${item.slug}`} className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-oat relative">
                    {item.mainImage ? (
                      <Image src={item.mainImage} alt={item.name} fill sizes="96px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-sage/30" />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link href={`/products/${item.slug}`} className="font-bold text-sm text-ink hover:text-sage line-clamp-2">
                        {item.name}
                      </Link>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 -m-1.5 text-muted hover:text-rose shrink-0" aria-label="حذف محصول">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-[11px] text-muted mt-1">{formatToman(item.price)}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-white border border-line rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-chalk text-ink" aria-label="افزایش تعداد">
                          <Plus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity.toLocaleString('fa-IR')}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-2 hover:bg-chalk text-ink disabled:opacity-30" aria-label="کاهش تعداد">
                          <Minus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-extrabold text-ink">{formatToman(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <button onClick={clearCart} className="text-xs text-muted hover:text-rose underline underline-offset-4 mt-2">
                پاک کردن سبد خرید
              </button>
            </div>

            {/* خلاصه سفارش */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-5 md:p-6 sticky top-24">
                <h3 className="text-lg font-bold text-ink mb-4 border-b border-line pb-3">خلاصه سفارش</h3>
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between text-muted">
                    <span>جمع کل کالاها</span>
                    <span>{formatToman(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>هزینه ارسال</span>
                    <span className="text-sage font-bold">در مرحله بعد</span>
                  </div>
                </div>
                <div className="border-t border-line pt-4 mb-5 flex justify-between items-center font-black text-lg text-ink">
                  <span>مبلغ قابل پرداخت</span>
                  <span>{formatToman(totalPrice)}</span>
                </div>
                <Link href="/checkout" className="btn-primary w-full justify-center">
                  ادامه و تسویه حساب <ArrowRight size={16} />
                </Link>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                  <ShieldCheck size={14} className="text-sage" /> پرداخت امن
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}