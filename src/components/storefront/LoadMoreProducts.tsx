'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, PackageSearch } from 'lucide-react';
import SafeImage from '@/components/product/SafeImage';
import WishlistButton from '@/components/storefront/WishlistButton';
import QuickViewButton from '@/components/storefront/QuickViewButton';
import { formatToman } from '@/lib/currency';
import { getPublicProductDescription, getPublicProductImage } from '@/lib/product-content';

export default function LoadMoreProducts({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProducts.length === 12);

  const loadMore = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${page}`);
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => [...prev, ...data.products]);
        setHasMore(data.products.length === 12);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to load more');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {products.map((product) => {
          const hasPrice = product.price > 0;
          const isAvailable = product.stock > 0 && hasPrice;
          const productImage = getPublicProductImage(product.mainImage);
          const productDescription = getPublicProductDescription(product.description);

          return (
            <Link key={product.id} href={`/products/${product.slug}`} className="group flex flex-col bg-white/70 backdrop-blur-md rounded-2xl border border-[#e9e5eb] overflow-hidden hover:shadow-xl hover:shadow-[#c61d70]/5 hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-square bg-[#fafafc] p-4">
                <SafeImage src={productImage} alt={product.name} fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                {!isAvailable && (
                  <span className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[9px] font-bold text-rose-500 shadow-sm z-10">
                    {hasPrice ? 'ناموجود' : 'در انتظار قیمت'}
                  </span>
                )}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                  <WishlistButton productId={product.id} />
                  <QuickViewButton product={product} />
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                {product.brand && <span className="text-[10px] font-bold text-[#c61d70] mb-1">{product.brand}</span>}
                <h2 className="text-sm md:text-base font-black text-[#28242b] mb-1 line-clamp-1 group-hover:text-[#c61d70] transition-colors">{product.name}</h2>
                <p className="text-[10px] md:text-xs text-[#77717b] line-clamp-2 mb-3 flex-1">{productDescription || 'مشاهده مشخصات'}</p>
                <div className="flex items-center justify-between border-t border-[#f5f0f2] pt-3 mt-auto">
                  <span className="text-xs md:text-sm font-black text-[#28242b]">{hasPrice ? formatToman(product.price) : '---'}</span>
                  <span className="w-7 h-7 rounded-full bg-[#fff0f7] text-[#c61d70] flex items-center justify-center group-hover:bg-[#c61d70] group-hover:text-white transition-colors">
                    <ArrowLeft size={14} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <button 
            onClick={loadMore} 
            disabled={loading} 
            className="flex items-center gap-2 px-8 py-3.5 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-2xl shadow-sm hover:border-[#c61d70] hover:text-[#c61d70] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin text-[#c61d70]" /> : 'مشاهده محصولات بیشتر'}
          </button>
        </div>
      )}

      {!hasMore && products.length === 0 && (
        <div className="text-center py-20">
          <PackageSearch size={48} className="mx-auto text-[#c61d70]/30 mb-4" />
          <h2 className="text-lg font-black text-[#28242b] mb-2">محصولی پیدا نشد</h2>
        </div>
      )}
    </div>
  );
}