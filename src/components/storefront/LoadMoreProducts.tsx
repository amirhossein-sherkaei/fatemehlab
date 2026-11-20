'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Loader2, PackageSearch, Star } from 'lucide-react';
import SafeImage from '@/components/product/SafeImage';
import WishlistButton from '@/components/storefront/WishlistButton';
import QuickViewButton from '@/components/storefront/QuickViewButton';
import { formatToman } from '@/lib/currency';
import { getPublicProductDescription, getPublicProductImage } from '@/lib/product-content';

type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  brand?: string | null;
  description?: string | null;
  mainImage?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isFeatured?: boolean;
  ratingAverage?: number | string;
  ratingCount?: number | string;
};

type Props = {
  initialProducts: CatalogProduct[];
  queryString: string;
  initialHasMore: boolean;
};

export default function LoadMoreProducts({ initialProducts, queryString, initialHasMore }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const observerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    setLoadError(false);

    try {
      const params = new URLSearchParams(queryString);
      params.set('page', String(page));
      const response = await fetch(`/api/products?${params.toString()}`, {
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Products request failed: ${response.status}`);
      const data = await response.json();
      if (!data?.success || !Array.isArray(data.products)) throw new Error('Invalid products response');

      const nextProducts = data.products as CatalogProduct[];
      setProducts((previous) => {
        const existingIds = new Set(previous.map((product) => product.id));
        return [...previous, ...nextProducts.filter((product) => !existingIds.has(product.id))];
      });
      setHasMore(Boolean(data.hasMore));
      setPage((previous) => previous + 1);
    } catch (error) {
      console.error('Failed to load additional products', error);
      setLoadError(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasMore, page, queryString]);

  useEffect(() => {
    if (!hasMore || loadError) return;
    const target = observerRef.current;
    if (!target) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadMore();
    }, { threshold: 0.1, rootMargin: '320px 0px' });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, loadError, loadMore]);

  return (
    <div className="fbl-product-list">
      <div className="fbl-product-grid">
        {products.map((product) => {
          const hasPrice = product.price > 0;
          const isAvailable = product.stock > 0 && hasPrice;
          const hasDiscount = hasPrice && Number(product.compareAtPrice) > product.price;
          const discountPercent = hasDiscount
            ? Math.round(((Number(product.compareAtPrice) - product.price) / Number(product.compareAtPrice)) * 100)
            : 0;
          const productImage = getPublicProductImage(product.mainImage);
          const productDescription = getPublicProductDescription(product.description);
          const ratingAverage = Number(product.ratingAverage || 0);
          const ratingCount = Number(product.ratingCount || 0);

          return (
            <article key={product.id} className="fbl-product-card group">
              <div className="fbl-product-card__media">
                <Link href={`/products/${product.slug}`} className="fbl-product-card__image-link" aria-label={`مشاهده ${product.name}`}>
                  <SafeImage
                    src={productImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 639px) 48vw, (max-width: 1023px) 31vw, (max-width: 1399px) 25vw, 280px"
                    className="fbl-product-card__image"
                  />
                </Link>

                <div className="fbl-product-card__badges">
                  {hasDiscount && <span className="fbl-product-card__discount">{discountPercent.toLocaleString('fa-IR')}٪ تخفیف</span>}
                  {product.isFeatured && <span className="fbl-product-card__featured">انتخاب فروشگاه</span>}
                  {!isAvailable && <span className="fbl-product-card__availability">{hasPrice ? 'ناموجود' : 'به‌زودی'}</span>}
                </div>

                <div className="fbl-product-card__actions" aria-label="اقدامات محصول">
                  <WishlistButton productId={product.id} />
                  <QuickViewButton product={product} />
                </div>
                <span className="fbl-product-card__media-caption" aria-hidden="true">FATEMEH BEAUTY LAND</span>
              </div>

              <div className="fbl-product-card__body">
                <div className="fbl-product-card__identity">
                  {product.brand && <span className="fbl-product-card__brand">{product.brand}</span>}
                  <Link href={`/products/${product.slug}`} className="fbl-product-card__title-link">
                    <h2>{product.name}</h2>
                  </Link>
                  <p>{productDescription || 'برای مشاهده جزئیات و مشخصات محصول وارد صفحه آن شوید.'}</p>
                </div>

                {(ratingCount > 0 || isAvailable) && (
                  <div className="fbl-product-card__meta">
                    {ratingCount > 0 && (
                      <span className="fbl-product-card__rating" aria-label={`امتیاز ${ratingAverage.toFixed(1)} از ۵ بر اساس ${ratingCount} نظر تأییدشده`}>
                        <Star size={13} fill="currentColor" aria-hidden="true" />
                        <b>{ratingAverage.toLocaleString('fa-IR', { maximumFractionDigits: 1 })}</b>
                        <small>({ratingCount.toLocaleString('fa-IR')})</small>
                      </span>
                    )}
                    {isAvailable && <span className="fbl-product-card__stock"><Check size={12} aria-hidden="true" /> موجود</span>}
                  </div>
                )}

                <div className="fbl-product-card__purchase">
                  <div className="fbl-product-card__price-wrap">
                    {hasPrice ? (
                      <>
                        {hasDiscount && <del>{formatToman(Number(product.compareAtPrice))}</del>}
                        <strong>{formatToman(product.price)}</strong>
                      </>
                    ) : (
                      <strong className="fbl-product-card__price-pending">قیمت به‌زودی اعلام می‌شود</strong>
                    )}
                  </div>
                  <Link href={`/products/${product.slug}`} className="fbl-product-card__view-link" aria-label={`مشاهده جزئیات ${product.name}`}>
                    <span>مشاهده محصول</span><ArrowLeft size={15} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div ref={observerRef} className="fbl-product-list__sentinel" aria-live="polite">
        {loading && <><Loader2 size={21} className="animate-spin" aria-hidden="true" /><span>در حال دریافت محصولات بیشتر…</span></>}
        {hasMore && !loading && !loadError && (
          <button type="button" className="fbl-product-list__load-more" onClick={() => void loadMore()}>
            مشاهده محصولات بیشتر <ArrowLeft size={15} aria-hidden="true" />
          </button>
        )}
        {loadError && (
          <div className="fbl-product-list__load-error" role="alert">
            <span>بارگذاری محصولات با مشکل روبه‌رو شد.</span>
            <button type="button" onClick={() => void loadMore()}>تلاش دوباره</button>
          </div>
        )}
        {!hasMore && products.length > 0 && <span className="fbl-product-list__end">به پایان فهرست محصولات رسیدید.</span>}
      </div>
    </div>
  );
}
