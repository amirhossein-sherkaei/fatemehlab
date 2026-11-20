"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import SafeImage from "@/components/product/SafeImage";
import QuickViewButton from "@/components/storefront/QuickViewButton";
import { formatToman } from "@/lib/currency";

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
  variant?: "new" | "featured" | "sale" | "bestseller";
  actionHref?: string;
  actionLabel?: string;
};

/** FBL_LUXURY_HORIZONTAL_RAIL_V2 — accessible, manually controlled product shelf. */
export default function HomeProductShelf({
  eyebrow,
  title,
  description,
  products,
  variant = "featured",
  actionHref = "/products",
  actionLabel = "مشاهده همه محصولات",
}: HomeProductShelfProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const railId = useId();
  const [canScroll, setCanScroll] = useState(false);

  const updateOverflow = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanScroll(rail.scrollWidth > rail.clientWidth + 4);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    updateOverflow();
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateOverflow)
      : null;
    observer?.observe(rail);
    window.addEventListener("resize", updateOverflow, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, [products.length, updateOverflow]);

  const scrollRail = useCallback((direction: "next" | "previous") => {
    const rail = railRef.current;
    if (!rail) return;

    const distance = Math.max(260, Math.round(rail.clientWidth * 0.78));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({
      left: direction === "next" ? -distance : distance,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, []);

  if (!products.length) return null;

  return (
    <section
      className="container-custom fl-section fl-home-shelf fbl-luxe-shelf"
      data-shelf-variant={variant}
      aria-label={title}
    >
      <div className="fl-section-head fl-home-shelf-head fbl-luxe-shelf__head">
        <div className="min-w-0 fbl-luxe-shelf__intro">
          <span className="fl-section-kicker fbl-luxe-shelf__eyebrow">
            <i aria-hidden="true" />
            {eyebrow}
          </span>
          <h2 className="fl-section-title">{title}</h2>
          <p className="fl-section-note">{description}</p>
        </div>

        <div className="fl-home-shelf-tools fbl-luxe-shelf__tools">
          <Link href={actionHref} className="fl-text-link fbl-luxe-shelf__all">
            {actionLabel}
            <ArrowLeft size={15} aria-hidden="true" />
          </Link>
          {canScroll && (
            <div className="fl-home-shelf-arrows fbl-luxe-shelf__arrows" aria-label="کنترل نوار محصولات">
              <button
                type="button"
                onClick={() => scrollRail("previous")}
                aria-label={`محصولات قبلی در ${title}`}
                aria-controls={railId}
                title="محصولات قبلی"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollRail("next")}
                aria-label={`محصولات بعدی در ${title}`}
                aria-controls={railId}
                title="محصولات بعدی"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="fbl-luxe-shelf__rail-frame">
        <div
          id={railId}
          className="fl-product-rail fbl-luxe-rail"
          ref={railRef}
          dir="rtl"
          tabIndex={0}
          role="region"
          aria-label={`نوار افقی محصولات: ${title}`}
          aria-roledescription="نوار محصولات"
        >
          {products.map((product, index) => {
            const hasPrice = Number.isFinite(product.price) && product.price > 0;
            const isAvailable = hasPrice && product.stock > 0;
            const hasDiscount =
              hasPrice &&
              typeof product.compareAtPrice === "number" &&
              Number.isFinite(product.compareAtPrice) &&
              product.compareAtPrice > product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
              : 0;

            const badgeLabel = hasDiscount
              ? `${discountPercent.toLocaleString("fa-IR")}٪ تخفیف`
              : variant === "new"
                ? "تازه‌رسیده"
                : variant === "bestseller"
                  ? "پرفروش"
                  : variant === "featured"
                    ? "انتخاب فروشگاه"
                    : null;

            return (
              <article className="fl-shelf-card fbl-luxe-product-card" key={product.id}>
                <div className="fl-shelf-media fbl-luxe-product-card__media">
                  <Link
                    href={`/products/${product.slug}`}
                    className="fl-shelf-image-link"
                    aria-label={`مشاهده ${product.name}`}
                  >
                    <SafeImage
                      src={product.mainImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 680px) 76vw, (max-width: 1050px) 30vw, 280px"
                    />
                  </Link>

                  <span className="fbl-luxe-product-card__index" aria-hidden="true">
                    {(index + 1).toLocaleString("fa-IR", { minimumIntegerDigits: 2, useGrouping: false })}
                  </span>

                  {badgeLabel && (
                    <span className={`fl-shelf-badge fbl-luxe-product-card__badge ${hasDiscount ? "is-sale" : ""}`}>
                      {variant === "featured" && !hasDiscount && <Sparkles size={11} aria-hidden="true" />}
                      {badgeLabel}
                    </span>
                  )}

                  {!isAvailable && (
                    <span className="fl-shelf-stock-badge">
                      {hasPrice ? "ناموجود" : "قیمت ثبت نشده"}
                    </span>
                  )}

                  <div className="fl-shelf-card-actions">
                    <QuickViewButton product={product} />
                  </div>
                </div>

                <div className="fl-shelf-info fbl-luxe-product-card__info">
                  <div className="fbl-luxe-product-card__identity">
                    {product.brand && <span className="fl-shelf-brand">{product.brand}</span>}
                    <Link href={`/products/${product.slug}`} className="fl-shelf-name fbl-luxe-product-card__name">
                      {product.name}
                    </Link>
                    <p className="fl-shelf-description fbl-luxe-product-card__description">
                      {product.description || "مشاهده مشخصات و جزئیات محصول"}
                    </p>
                  </div>

                  <div className="fl-shelf-price-area fbl-luxe-product-card__purchase">
                    <div className="fbl-luxe-product-card__price-stack">
                      {hasDiscount && (
                        <del className="fl-shelf-old-price">{formatToman(product.compareAtPrice!)}</del>
                      )}
                      <div className="fl-shelf-price-row">
                        <strong className={hasDiscount ? "has-discount" : ""}>
                          {hasPrice ? formatToman(product.price) : "قیمت ثبت نشده"}
                        </strong>
                        <span className={`fl-shelf-status ${isAvailable ? "" : "is-out"}`}>
                          {isAvailable ? "موجود" : hasPrice ? "ناموجود" : "به‌زودی"}
                        </span>
                      </div>
                    </div>
                    <Link href={`/products/${product.slug}`} className="fl-shelf-cta fbl-luxe-product-card__cta">
                      <span>مشاهده محصول</span>
                      <ArrowUpLeft size={15} aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="fbl-luxe-shelf__hint" aria-hidden="true">
        <span>برای کشف محصولات بیشتر، افقی حرکت کنید</span>
        <span className="fbl-luxe-shelf__hint-line"><i /></span>
      </div>
    </section>
  );
}
