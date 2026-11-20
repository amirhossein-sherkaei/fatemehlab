"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpLeft,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
} from "lucide-react";
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

/** FBL_PRODUCT_RAILS_AUTOPLAY_MOBILE_FIX_V4 — compact, seamless, pauseable and motion-aware. */
export default function HomeProductShelf({
  eyebrow,
  title,
  description,
  products,
  variant = "featured",
  actionHref = "/products",
  actionLabel = "مشاهده همه محصولات",
}: HomeProductShelfProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const railId = useId();
  const [canScroll, setCanScroll] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const updateOverflow = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanScroll(rail.scrollWidth > rail.clientWidth + 8 && products.length > 1);
  }, [products.length]);

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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "100px 0px", threshold: 0.01 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  const scrollRail = useCallback((direction: "next" | "previous") => {
    const rail = railRef.current;
    if (!rail) return;

    setIsPaused(true);
    const firstCard = rail.querySelector<HTMLElement>('[data-rail-copy="primary"]');
    const computedGap = Number.parseFloat(window.getComputedStyle(rail).columnGap || "12") || 12;
    const distance = firstCard
      ? Math.round(firstCard.getBoundingClientRect().width + computedGap)
      : Math.max(180, Math.round(rail.clientWidth * 0.55));

    rail.scrollBy({
      left: direction === "next" ? -distance : distance,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [prefersReducedMotion]);

  // Seamless two-set loop: the second set is visually identical and inert. Once
  // the viewport reaches it, scroll position is shifted back by one set instantly.
  // The visual content therefore stays in the same place without a long reverse jump.
  useEffect(() => {
    if (!canScroll || isPaused || isHovered || isFocused || !isInView || prefersReducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      const rail = railRef.current;
      if (!rail || document.visibilityState !== "visible") return;

      const firstPrimary = rail.querySelector<HTMLElement>('[data-rail-copy="primary"]');
      const firstClone = rail.querySelector<HTMLElement>('[data-rail-copy="clone"]');
      if (!firstPrimary || !firstClone) return;

      const cycleDistance = Math.abs(
        firstClone.getBoundingClientRect().left - firstPrimary.getBoundingClientRect().left,
      );
      if (!Number.isFinite(cycleDistance) || cycleDistance < 20) return;

      const computedGap = Number.parseFloat(window.getComputedStyle(rail).columnGap || "12") || 12;
      const step = Math.round(firstPrimary.getBoundingClientRect().width + computedGap);
      const nextLeft = rail.scrollLeft - step;
      const nextProgress = Math.abs(nextLeft);

      if (nextProgress >= cycleDistance) {
        const adjustedLeft = nextLeft + cycleDistance;
        rail.style.scrollBehavior = "auto";
        rail.scrollLeft = adjustedLeft;
        window.requestAnimationFrame(() => {
          if (rail.isConnected) rail.style.removeProperty("scroll-behavior");
        });
      } else {
        rail.scrollBy({ left: -step, behavior: "smooth" });
      }
    }, 5200);

    return () => window.clearInterval(timer);
  }, [canScroll, isPaused, isHovered, isFocused, isInView, prefersReducedMotion]);

  if (!products.length) return null;

  const renderProductCard = (product: HomeShelfProduct, index: number, copy: "primary" | "clone") => {
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
      <article
        className="fl-shelf-card fbl-luxe-product-card"
        key={`${copy}-${product.id}`}
        aria-hidden={copy === "clone" ? true : undefined}
        data-rail-clone={copy === "clone" ? "true" : undefined}
        data-rail-copy={index === 0 ? copy : undefined}
      >
        <div className="fl-shelf-media fbl-luxe-product-card__media">
          <Link
            href={`/products/${product.slug}`}
            className="fl-shelf-image-link"
            aria-label={`مشاهده ${product.name}`}
            tabIndex={copy === "clone" ? -1 : undefined}
          >
            <SafeImage
              src={product.mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 360px) 44vw, (max-width: 680px) 45vw, (max-width: 1050px) 24vw, 260px"
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

          {copy === "primary" && (
            <div className="fl-shelf-card-actions">
              <QuickViewButton product={product} />
            </div>
          )}
        </div>

        <div className="fl-shelf-info fbl-luxe-product-card__info">
          <div className="fbl-luxe-product-card__identity">
            {product.brand && <span className="fl-shelf-brand">{product.brand}</span>}
            <Link
              href={`/products/${product.slug}`}
              className="fl-shelf-name fbl-luxe-product-card__name"
              tabIndex={copy === "clone" ? -1 : undefined}
            >
              {product.name}
            </Link>
            <p className="fl-shelf-description fbl-luxe-product-card__description">
              {product.description || "مشاهده مشخصات و جزئیات محصول"}
            </p>
          </div>

          <div className="fl-shelf-price-area fbl-luxe-product-card__purchase">
            <div className="fbl-luxe-product-card__price-stack">
              {hasDiscount && <del className="fl-shelf-old-price">{formatToman(product.compareAtPrice!)}</del>}
              <div className="fl-shelf-price-row">
                <strong className={hasDiscount ? "has-discount" : ""}>
                  {hasPrice ? formatToman(product.price) : "قیمت ثبت نشده"}
                </strong>
                <span className={`fl-shelf-status ${isAvailable ? "" : "is-out"}`}>
                  {isAvailable ? "موجود" : hasPrice ? "ناموجود" : "به‌زودی"}
                </span>
              </div>
            </div>
            <Link
              href={`/products/${product.slug}`}
              className="fl-shelf-cta fbl-luxe-product-card__cta"
              tabIndex={copy === "clone" ? -1 : undefined}
            >
              <span>مشاهده محصول</span>
              <ArrowUpLeft size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="container-custom fl-section fl-home-shelf fbl-luxe-shelf fbl-luxe-shelf--autoplay"
      data-shelf-variant={variant}
      aria-label={title}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={(event) => {
        const target = event.target as HTMLElement;
        if (!target.closest(".fbl-luxe-shelf__controls")) setIsFocused(true);
      }}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget as HTMLElement | null;
        if (
          !nextTarget ||
          !event.currentTarget.contains(nextTarget) ||
          nextTarget.closest(".fbl-luxe-shelf__controls")
        ) {
          setIsFocused(false);
        }
      }}
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
            <div className="fbl-luxe-shelf__controls" aria-label="کنترل نوار محصولات">
              <button
                type="button"
                className="fbl-luxe-shelf__motion"
                onClick={() => setIsPaused((current) => !current)}
                aria-label={prefersReducedMotion
                  ? "حرکت خودکار به دلیل تنظیم کاهش حرکت دستگاه غیرفعال است"
                  : isPaused ? `فعال‌کردن حرکت خودکار ${title}` : `توقف حرکت خودکار ${title}`}
                aria-pressed={isPaused || prefersReducedMotion}
                title={prefersReducedMotion ? "حرکت خودکار با تنظیمات دستگاه غیرفعال است" : isPaused ? "پخش خودکار" : "توقف حرکت خودکار"}
                disabled={prefersReducedMotion}
              >
                {isPaused || prefersReducedMotion
                  ? <Play size={14} aria-hidden="true" />
                  : <Pause size={14} aria-hidden="true" />}
              </button>
              <div className="fl-home-shelf-arrows fbl-luxe-shelf__arrows">
                <button
                  type="button"
                  onClick={() => scrollRail("previous")}
                  aria-label={`محصولات قبلی در ${title}`}
                  aria-controls={railId}
                  title="محصولات قبلی"
                >
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRail("next")}
                  aria-label={`محصولات بعدی در ${title}`}
                  aria-controls={railId}
                  title="محصولات بعدی"
                >
                  <ChevronLeft size={17} aria-hidden="true" />
                </button>
              </div>
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
          aria-live="off"
          onPointerDown={() => setIsPaused(true)}
        >
          {products.map((product, index) => renderProductCard(product, index, "primary"))}
          {products.length > 1 && products.map((product, index) => renderProductCard(product, index, "clone"))}
        </div>
      </div>

      <div className="fbl-luxe-shelf__hint" aria-hidden="true">
        <span>برای دیدن محصولات بیشتر، افقی حرکت کنید</span>
        <span className="fbl-luxe-shelf__hint-line"><i /></span>
      </div>
    </section>
  );
}
