'use client';

import { useCartStore } from '@/store/cart';
import { Eye } from 'lucide-react';

export default function QuickViewButton({ product }: { product: any }) {
  const openQuickView = useCartStore((state) => state.openQuickView);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          mainImage: product.mainImage,
        });
      }}
      className="w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-[#77717b] hover:text-[#c61d70] hover:scale-110 shadow-md border border-[#e9e5eb] transition-all"
      aria-label="نمایش سریع"
    >
      <Eye size={16} />
    </button>
  );
}