'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type TouchEvent, type MouseEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type HomeBanner = {
  id: string;
  image: string;
  mobileImage?: string;
  alt: string;
  href?: string;
  objectPosition?: string;
};

type HomeBannerCarouselProps = {
  slides: HomeBanner[];
  interval?: number;
  autoPlay?: boolean;
};

export default function HomeBannerCarousel({ slides, interval = 5600, autoPlay = true }: HomeBannerCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const total = slides.length;

  useEffect(() => {
    if (total < 2 || isPaused || !autoPlay) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return;

    const timer = window.setInterval(() => {
      if (!document.hidden) {
        setActiveIndex((current) => (current + 1) % total);
      }
    }, Math.max(4000, interval));

    return () => window.clearInterval(timer);
  }, [interval, isPaused, total, autoPlay]);

  useEffect(() => {
    if (activeIndex >= total && total > 0) setActiveIndex(0);
  }, [activeIndex, total]);

  if (total === 0) return null;

  const goTo = (index: number) => {
    setActiveIndex(((index % total) + total) % total);
  };

  const handleArrowClick = (event: MouseEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    event.stopPropagation();
    goTo(index);
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    if (startX === null) return;

    const endX = event.changedTouches[0]?.clientX ?? startX;
    const distance = endX - startX;
    if (Math.abs(distance) >= 44 && total > 1) {
      goTo(activeIndex + (distance > 0 ? -1 : 1));
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="container-custom fl-banner-section"
      aria-label="پیشنهادها و بنرهای فروشگاه"
      data-fl-carousel-refined="true"
    >
      <div
        className="fl-banner-carousel"
        role="region"
        aria-roledescription="اسلایدر"
        aria-label="بنرهای فاطمه بیوتی لند"
        data-current-slide={activeIndex + 1}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setIsPaused(false);
          }
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchStartX.current = null; }}
      >
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.id}
              className={`fl-banner-slide${isActive ? ' is-active' : ''}`}
              aria-hidden={!isActive}
            >
              <Link
                href={slide.href || '/products'}
                className="fl-banner-slide-link"
                aria-label={slide.alt || `مشاهده پیشنهاد شماره ${index + 1}`}
                tabIndex={isActive ? 0 : -1}
                draggable={false}
              >
                <picture className="fl-banner-picture">
                  {slide.mobileImage && (
                    <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
                  )}
                  <Image
                    src={slide.image}
                    alt={slide.alt || 'پیشنهاد ویژه فاطمه بیوتی لند'}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 767px) 100vw, (max-width: 1280px) 94vw, 1280px"
                    className="fl-banner-image"
                    style={{ objectPosition: slide.objectPosition || 'center center' }}
                    draggable={false}
                  />
                </picture>
              </Link>
            </div>
          );
        })}

        {total > 1 && (
          <>
            <button
              type="button"
              className="fl-banner-arrow fl-banner-arrow-prev"
              onClick={(event) => handleArrowClick(event, activeIndex - 1)}
              aria-label="بنر قبلی"
              title="بنر قبلی"
            >
              <ChevronRight size={21} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="fl-banner-arrow fl-banner-arrow-next"
              onClick={(event) => handleArrowClick(event, activeIndex + 1)}
              aria-label="بنر بعدی"
              title="بنر بعدی"
            >
              <ChevronLeft size={21} aria-hidden="true" />
            </button>
            <div className="fl-banner-pagination" role="group" aria-label="انتخاب بنر">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`fl-banner-dot${index === activeIndex ? ' is-active' : ''}`}
                  onClick={(event) => handleArrowClick(event, index)}
                  aria-label={`رفتن به بنر ${index + 1}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                  aria-pressed={index === activeIndex}
                >
                  <span className="fl-banner-dot-indicator" aria-hidden="true" />
                </button>
              ))}
            </div>
          </>
        )}
        <span className="sr-only" aria-live="polite">
          بنر {activeIndex + 1} از {total}
        </span>
      </div>
    </section>
  );
}