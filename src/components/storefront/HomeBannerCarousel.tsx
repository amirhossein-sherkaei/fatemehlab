'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type TouchEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type HomeBanner = {
  id: string;
  image: string;
  mobileImage?: string;
  alt: string;
  href?: string;
};

type HomeBannerCarouselProps = {
  slides: HomeBanner[];
  interval?: number;
};

export default function HomeBannerCarousel({ slides, interval = 5600 }: HomeBannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;

  useEffect(() => {
    if (total < 2 || isPaused) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const timer = window.setInterval(() => {
      if (!document.hidden) setActiveIndex((current) => (current + 1) % total);
    }, Math.max(3500, interval));

    return () => window.clearInterval(timer);
  }, [interval, isPaused, total]);

  if (total === 0) return null;

  const goTo = (index: number) => {
    setActiveIndex((index + total) % total);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    if (startX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? startX;
    const distance = endX - startX;
    if (Math.abs(distance) > 48 && total > 1) {
      goTo(activeIndex + (distance > 0 ? -1 : 1));
    }
    touchStartX.current = null;
  };

  return (
    <section className="container-custom fl-banner-section" aria-label="پیشنهادها و بنرهای فروشگاه">
      <div
        className="fl-banner-carousel"
        role="region"
        aria-roledescription="اسلایدر"
        aria-label="بنرهای فاطمه بیوتی لند"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <Link
              key={slide.id}
              href={slide.href || '/products'}
              className={`fl-banner-slide${isActive ? ' is-active' : ''}`}
              aria-label={slide.alt || `مشاهده پیشنهاد شماره ${index + 1}`}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              <picture className="fl-banner-picture">
                {slide.mobileImage && <source media="(max-width: 767px)" srcSet={slide.mobileImage} />}
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 767px) 100vw, (max-width: 1280px) 94vw, 1280px"
                  className="fl-banner-image"
                  draggable={false}
                />
              </picture>
            </Link>
          );
        })}

        {total > 1 && (
          <>
            <button type="button" className="fl-banner-arrow fl-banner-arrow-prev" onClick={() => goTo(activeIndex - 1)} aria-label="بنر قبلی">
              <ChevronRight size={21} />
            </button>
            <button type="button" className="fl-banner-arrow fl-banner-arrow-next" onClick={() => goTo(activeIndex + 1)} aria-label="بنر بعدی">
              <ChevronLeft size={21} />
            </button>
            <div className="fl-banner-pagination" aria-label="انتخاب بنر">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`fl-banner-dot${index === activeIndex ? ' is-active' : ''}`}
                  onClick={() => goTo(index)}
                  aria-label={`رفتن به بنر ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </>
        )}
        <span className="sr-only" aria-live="polite">بنر {activeIndex + 1} از {total}</span>
      </div>
    </section>
  );
}
