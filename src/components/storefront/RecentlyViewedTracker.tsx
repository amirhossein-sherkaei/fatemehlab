'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart';

export default function RecentlyViewedTracker({ product }: { product: any }) {
  const addRecentlyViewed = useCartStore((state) => state.addRecentlyViewed);

  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        mainImage: product.mainImage,
      });
    }
  }, [product, addRecentlyViewed]);

  return null;
}