'use client';

import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { Clock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function RecentlyViewed() {
  const { recentlyViewed } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted || recentlyViewed.length === 0) return null;

  return (
    <section className="container-custom py-12 border-t border-[#e9e5eb]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-[#28242b] flex items-center gap-2">
          <Clock size={20} className="text-[#c61d70]" /> بازدیدهای اخیر شما
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {recentlyViewed.map((product) => (
          <Link key={product.id} href={`/products/${product.slug}`} className="group bg-white rounded-2xl border border-[#e9e5eb] p-3 hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-square bg-[#fafafc] rounded-xl overflow-hidden mb-3">
              {product.mainImage ? (
                <Image src={product.mainImage} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#c61d70]/20">بدون عکس</div>
              )}
            </div>
            <h3 className="text-xs font-bold text-[#28242b] line-clamp-1 group-hover:text-[#c61d70] transition-colors">{product.name}</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] font-black text-[#77717b]">{product.price > 0 ? formatToman(product.price) : 'به زودی'}</span>
              <ArrowLeft size={12} className="text-[#c61d70] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}