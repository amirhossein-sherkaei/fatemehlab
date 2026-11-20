"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
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

type RtlScrollType = "negative" | "reverse" | "default";
let cachedRtlScrollType: RtlScrollType | null = null;

function getRtlScrollType(): RtlScrollType {
  if (cachedRtlScrollType) return cachedRtlScrollType;
  const outer = document.createElement("div");
  const inner = document.createElement("div");
  outer.dir = "rtl";
  outer.style.cssText = "position:absolute;top:-9999px;width:4px;height:1px;overflow:scroll;visibility:hidden;";
  inner.style.cssText = "width:8px;height:1px;";
  outer.appendChild(inner);
  document.body.appendChild(outer);
  if (outer.scrollLeft > 0) cachedRtlScrollType = "default";
  else {
    outer.scrollLeft = 1;
    cachedRtlScrollType = outer.scrollLeft === 0 ? "negative" : "reverse";
  }
  outer.remove();
  return cachedRtlScrollType;
}

function getLogicalScrollOffset(element: HTMLElement): number {
  const max = Math.max(0, element.scrollWidth - element.clientWidth);
  if (getComputedStyle(element).direction !== "rtl") return Math.max(0, Math.min(max, element.scrollLeft));
  const raw = element.scrollLeft;
  const type = getRtlScrollType();
  const logical = type === "negative" ? -raw : type === "reverse" ? raw : max - raw;
  return Math.max(0, Math.min(max, logical));
}

function setLogicalScrollOffset(element: HTMLElement, logicalOffset: number, behavior: ScrollBehavior = "auto") {
  const max = Math.max(0, element.scrollWidth - element.clientWidth);
  const logical = Math.max(0, Math.min(max, logicalOffset));
  let physical = logical;
  if (getComputedStyle(element).direction === "rtl") {
    const type = getRtlScrollType();
    physical = type === "negative" ? -logical : type === "reverse" ? logical : max - logical;
  }
  element.scrollTo({ left: physical, behavior });
}

/** One canonical card per product. Autoplay loops by resetting scroll, never by cloning DOM. */
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
  const pendingRecenterRef = useRef<number | null>(null);
  const cycleTimerRef = useRef<number | null>(null);

  const uniqueProducts = useMemo(() => {
    const seen = new Set<string>();
    return products.filter((product) => {
      if (!product?.id || seen.has(product.id)) return false;
      seen.add(product.id);
      return true;
    });
  }, [products]);
  const [displayProducts, setDisplayProducts] = useState<HomeShelfProduct[]>(() => uniqueProducts);

  useEffect(() => {
    setDisplayProducts(uniqueProducts);
    pendingRecenterRef.current = null;
  }, [uniqueProducts]);

  useLayoutEffect(() => {
    if (pendingRecenterRef.current == null) return;
    const rail = railRef.current;
    if (rail) setLogicalScrollOffset(rail, pendingRecenterRef.current, "auto");
    pendingRecenterRef.current = null;
  }, [displayProducts]);

  const updateOverflow = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanScroll(uniqueProducts.length > 1 && rail.scrollWidth > rail.clientWidth + 8);
  }, [uniqueProducts.length]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    updateOverflow();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateOverflow) : null;
    observer?.observe(rail);
    rail.querySelectorAll<HTMLElement>("[data-rail-card='true']").forEach((card) => observer?.observe(card));
    window.addEventListener("resize", updateOverflow, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateOverflow);
    };
  }, [uniqueProducts.length, updateOverflow]);

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
    if (!rail || displayProducts.length < 2) return;
    setIsPaused(true);
    if (cycleTimerRef.current != null) window.clearTimeout(cycleTimerRef.current);
    const firstCard = rail.querySelector<HTMLElement>("[data-rail-card='true']");
    const computedGap = Number.parseFloat(window.getComputedStyle(rail).columnGap || "12") || 12;
    const distance = firstCard
      ? Math.round(firstCard.getBoundingClientRect().width + computedGap)
      : Math.max(180, Math.round(rail.clientWidth * 0.55));
    const current = getLogicalScrollOffset(rail);
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth);

    if (direction === "next") {
      const target = Math.min(max, current + distance);
      if (target <= current + 2 && current >= max - 2) {
        pendingRecenterRef.current = Math.max(0, max - distance);
        setDisplayProducts((items) => items.length > 1 ? [...items.slice(1), items[0]] : items);
        return;
      }
      setLogicalScrollOffset(rail, target, prefersReducedMotion ? "auto" : "smooth");
      cycleTimerRef.current = window.setTimeout(() => {
        pendingRecenterRef.current = Math.max(0, target - distance);
        setDisplayProducts((items) => items.length > 1 ? [...items.slice(1), items[0]] : items);
        cycleTimerRef.current = null;
      }, prefersReducedMotion ? 0 : 520);
      return;
    }

    if (current > 2) {
      setLogicalScrollOffset(rail, Math.max(0, current - distance), prefersReducedMotion ? "auto" : "smooth");
    } else {
      // At the logical RTL start, rotate the tail to the head. React keeps
      // keyed cards mounted, so the previous product appears without a clone.
      pendingRecenterRef.current = 0;
      setDisplayProducts((items) => items.length > 1 ? [items[items.length - 1], ...items.slice(0, -1)] : items);
    }
  }, [displayProducts.length, prefersReducedMotion]);

  useEffect(() => () => {
    if (cycleTimerRef.current != null) window.clearTimeout(cycleTimerRef.current);
  }, []);


  useEffect(() => {
    if (!canScroll || displayProducts.length < 3 || isPaused || isHovered || isFocused || !isInView || prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      const rail = railRef.current;
      if (!rail || document.visibilityState !== "visible") return;
      const firstCard = rail.querySelector<HTMLElement>("[data-rail-card='true']");
      if (!firstCard || cycleTimerRef.current != null) return;

      const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap || "12") || 12;
      const step = Math.round(firstCard.getBoundingClientRect().width + gap);
      const maxOffset = Math.max(0, rail.scrollWidth - rail.clientWidth);
      if (maxOffset < step * 0.75) return;

      const currentOffset = getLogicalScrollOffset(rail);
      const targetOffset = Math.min(maxOffset, currentOffset + step);
      // Move one real card, then recycle that exact keyed node behind the tail.
      // Re-centering by one step keeps the visible cards in the same positions;
      // no duplicated product cards are rendered at any time.
      setLogicalScrollOffset(rail, targetOffset, "smooth");
      cycleTimerRef.current = window.setTimeout(() => {
        pendingRecenterRef.current = Math.max(0, targetOffset - step);
        setDisplayProducts((items) => items.length > 1 ? [...items.slice(1), items[0]] : items);
        cycleTimerRef.current = null;
      }, 560);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [canScroll, displayProducts.length, isPaused, isHovered, isFocused, isInView, prefersReducedMotion]);

  if (!uniqueProducts.length) return null;

  const pauseForInteraction = () => {
    setIsPaused(true);
    if (cycleTimerRef.current != null) window.clearTimeout(cycleTimerRef.current);
    cycleTimerRef.current = null;
  };

  const renderProductCard = (product: HomeShelfProduct, index: number) => {
    const hasPrice = Number.isFinite(product.price) && product.price > 0;
    const isAvailable = hasPrice && product.stock > 0;
    const hasDiscount = hasPrice && typeof product.compareAtPrice === "number"
      && Number.isFinite(product.compareAtPrice) && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount
      ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
      : 0;
    const badgeLabel = hasDiscount
      ? `${discountPercent.toLocaleString("fa-IR")}٪ تخفیف`
      : variant === "new" ? "تازه‌رسیده"
        : variant === "bestseller" ? "پرفروش"
          : variant === "featured" ? "انتخاب فروشگاه" : null;

    return (
      <article
        className="fl-shelf-card fbl-luxe-product-card"
        key={product.id}
        data-rail-card="true"
        data-product-id={product.id}
      >
        <div className="fl-shelf-media fbl-luxe-product-card__media">
          <Link href={`/products/${product.slug}`} className="fl-shelf-image-link" aria-label={`مشاهده ${product.name}`}>
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
          {!isAvailable && <span className="fl-shelf-stock-badge">{hasPrice ? "ناموجود" : "قیمت ثبت نشده"}</span>}
          <div className="fl-shelf-card-actions"><QuickViewButton product={product} /></div>
        </div>

        <div className="fl-shelf-info fbl-luxe-product-card__info">
          <div className="fbl-luxe-product-card__identity">
            {product.brand && <span className="fl-shelf-brand">{product.brand}</span>}
            <Link href={`/products/${product.slug}`} className="fl-shelf-name fbl-luxe-product-card__name">{product.name}</Link>
            <p className="fl-shelf-description fbl-luxe-product-card__description">
              {product.description || "مشاهده مشخصات و جزئیات محصول"}
            </p>
          </div>
          <div className="fl-shelf-price-area fbl-luxe-product-card__purchase">
            <div className="fbl-luxe-product-card__price-stack">
              {hasDiscount && <del className="fl-shelf-old-price">{formatToman(product.compareAtPrice!)}</del>}
              <div className="fl-shelf-price-row">
                <strong className={hasDiscount ? "has-discount" : ""}>{hasPrice ? formatToman(product.price) : "قیمت ثبت نشده"}</strong>
                <span className={`fl-shelf-status ${isAvailable ? "" : "is-out"}`}>
                  {isAvailable ? "موجود" : hasPrice ? "ناموجود" : "به‌زودی"}
                </span>
              </div>
            </div>
            <Link href={`/products/${product.slug}`} className="fl-shelf-cta fbl-luxe-product-card__cta">
              <span>مشاهده محصول</span><ArrowUpLeft size={14} aria-hidden="true" />
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
      onMouseEnter={() => {
        setIsHovered(true);
        if (cycleTimerRef.current != null) window.clearTimeout(cycleTimerRef.current);
        cycleTimerRef.current = null;
      }}
      onMouseLeave={() => setIsHovered(false)}
      onFocusCapture={(event) => {
        const target = event.target as HTMLElement;
        if (!target.closest(".fbl-luxe-shelf__controls")) {
          setIsFocused(true);
          if (cycleTimerRef.current != null) window.clearTimeout(cycleTimerRef.current);
          cycleTimerRef.current = null;
        }
      }}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget as HTMLElement | null;
        if (!nextTarget || !event.currentTarget.contains(nextTarget) || nextTarget.closest(".fbl-luxe-shelf__controls")) {
          setIsFocused(false);
        }
      }}
    >
      <div className="fl-section-head fl-home-shelf-head fbl-luxe-shelf__head">
        <div className="min-w-0 fbl-luxe-shelf__intro">
          <span className="fl-section-kicker fbl-luxe-shelf__eyebrow"><i aria-hidden="true" />{eyebrow}</span>
          <h2 className="fl-section-title">{title}</h2>
          <p className="fl-section-note">{description}</p>
        </div>
        <div className="fl-home-shelf-tools fbl-luxe-shelf__tools">
          <Link href={actionHref} className="fl-text-link fbl-luxe-shelf__all">
            {actionLabel}<ArrowLeft size={15} aria-hidden="true" />
          </Link>
          {canScroll && (
            <div className="fbl-luxe-shelf__controls" aria-label="کنترل نوار محصولات">
              <button
                type="button"
                className="fbl-luxe-shelf__motion"
                onClick={() => setIsPaused((current) => !current)}
                aria-label={prefersReducedMotion ? "حرکت خودکار به دلیل تنظیم کاهش حرکت دستگاه غیرفعال است" : isPaused ? `فعال‌کردن حرکت خودکار ${title}` : `توقف حرکت خودکار ${title}`}
                aria-pressed={isPaused || prefersReducedMotion}
                title={prefersReducedMotion ? "حرکت خودکار با تنظیمات دستگاه غیرفعال است" : isPaused ? "پخش خودکار" : "توقف حرکت خودکار"}
                disabled={prefersReducedMotion}
              >
                {isPaused || prefersReducedMotion ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
              </button>
              <div className="fl-home-shelf-arrows fbl-luxe-shelf__arrows">
                <button type="button" onClick={() => scrollRail("previous")} aria-label={`محصولات قبلی در ${title}`} aria-controls={railId} title="محصولات قبلی">
                  <ChevronRight size={17} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => scrollRail("next")} aria-label={`محصولات بعدی در ${title}`} aria-controls={railId} title="محصولات بعدی">
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
          onPointerDown={pauseForInteraction}
          onWheel={pauseForInteraction}
          onTouchStart={pauseForInteraction}
        >
          {displayProducts.map(renderProductCard)}
        </div>
      </div>
      <div className="fbl-luxe-shelf__hint" aria-hidden="true">
        <span>برای دیدن محصولات بیشتر، افقی حرکت کنید</span>
        <span className="fbl-luxe-shelf__hint-line"><i /></span>
      </div>
    </section>
  );
}
