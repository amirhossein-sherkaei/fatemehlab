'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import SafeImage from '@/components/product/SafeImage';
import QuickViewButton from '@/components/storefront/QuickViewButton';
import { formatToman } from '@/lib/currency';

export type HomeShelfProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  mainImage: string | null;
};

type HomeProductShelfProps = {
  eyebrow: string;
  title: string;
  description: string;
  products: HomeShelfProduct[];
  variant?: 'new' | 'featured' | 'sale' | 'bestseller';
  actionHref?: string;
  actionLabel?: string;
};

export default function HomeProductShelf({
  eyebrow,
  title,
  description,
  products,
  variant = 'featured',
  actionHref = '/products',
  actionLabel = 'مشاهده همه محصولات',
}: HomeProductShelfProps) {
  const railRef = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scrollRail = (direction: 'next' | 'previous') => {
    const rail = railRef.current;
    if (!rail) return;

    const amount = Math.max(220, Math.round(rail.clientWidth * 0.78));
    rail.scrollBy({
      left: direction === 'next' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="container-custom fl-section fl-home-shelf" data-shelf-variant={variant} aria-label={title}>
      <div className="fl-section-head fl-home-shelf-head">
        <div className="min-w-0">
          <span className="fl-section-kicker">{eyebrow}</span>
          <h2 className="fl-section-title">{title}</h2>
          <p className="fl-section-note">{description}</p>
        </div>

        <div className="fl-home-shelf-tools">
          <Link href={actionHref} className="fl-text-link">
            {actionLabel}
            <ArrowLeft size={15} aria-hidden="true" />
          </Link>
          <div className="fl-home-shelf-arrows" aria-label="کنترل محصولات">
            <button
              type="button"
              onClick={() => scrollRail('previous')}
              aria-label="محصولات قبلی"
              title="محصولات قبلی"
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollRail('next')}
              aria-label="محصولات بعدی"
              title="محصولات بعدی"
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="fl-product-rail" ref={railRef} dir="rtl" tabIndex={0} aria-label={`فهرست ${title}`}>
        {products.map((product) => {
          const hasPrice = Number.isFinite(product.price) && product.price > 0;
          const isAvailable = hasPrice && product.stock > 0;
          const hasDiscount =
            hasPrice &&
            typeof product.compareAtPrice === 'number' &&
            product.compareAtPrice > product.price;

          const discountPercent = hasDiscount
            ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
            : 0;

          const badgeLabel = hasDiscount
            ? `${discountPercent.toLocaleString('fa-IR')}٪ تخفیف`
            : variant === 'new'
              ? 'تازه‌رسیده'
              : variant === 'bestseller'
                ? 'پرفروش'
                : variant === 'featured'
                  ? 'انتخاب فروشگاه'
                  : null;

          return (
            <article className="fl-shelf-card" key={product.id}>
              <div className="fl-shelf-media">
                <Link
                  href={`/products/${product.slug}`}
                  className="fl-shelf-image-link"
                  aria-label={`مشاهده ${product.name}`}
                  tabIndex={0}
                >
                  <SafeImage
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 680px) 47vw, (max-width: 1024px) 30vw, 260px"
                  />
                </Link>

                {badgeLabel && (
                  <span className={`fl-shelf-badge ${hasDiscount ? 'is-sale' : ''}`}>
                    {variant === 'featured' && <Sparkles size={11} aria-hidden="true" />}
                    {badgeLabel}
                  </span>
                )}

                {!isAvailable && (
                  <span className="fl-shelf-stock-badge">
                    {hasPrice ? 'ناموجود' : 'قیمت ثبت نشده'}
                  </span>
                )}

                <div className="fl-shelf-card-actions">
                  <QuickViewButton product={product} />
                </div>
              </div>

              <div className="fl-shelf-info">
                {product.brand && <span className="fl-shelf-brand">{product.brand}</span>}
                <Link href={`/products/${product.slug}`} className="fl-shelf-name">
                  {product.name}
                </Link>
                <p className="fl-shelf-description">
                  {product.description || 'مشاهده مشخصات و جزئیات محصول'}
                </p>

                <div className="fl-shelf-price-area">
                  {hasDiscount && (
                    <del className="fl-shelf-old-price">{formatToman(product.compareAtPrice!)}</del>
                  )}
                  <div className="fl-shelf-price-row">
                    <strong className={hasDiscount ? 'has-discount' : ''}>
                      {hasPrice ? formatToman(product.price) : 'قیمت ثبت نشده'}
                    </strong>
                    <span className={`fl-shelf-status ${isAvailable ? '' : 'is-out'}`}>
                      {isAvailable ? 'موجود' : hasPrice ? 'ناموجود' : 'به‌زودی'}
                    </span>
                  </div>
                </div>

                <Link href={`/products/${product.slug}`} className="fl-shelf-cta">
                  مشاهده محصول
                  <ArrowLeft size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}