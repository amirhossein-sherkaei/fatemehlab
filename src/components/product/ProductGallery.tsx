'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageOff, X, ZoomIn } from 'lucide-react';

type ProductGalleryProps = {
  mainImage: string | null;
  gallery: string[] | null;
  name: string;
};

export default function ProductGallery({ mainImage, gallery, name }: ProductGalleryProps) {
  const allImages = useMemo(
    () => Array.from(new Set([mainImage, ...(gallery || [])].filter((value): value is string => Boolean(value)))),
    [mainImage, gallery]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const activeImage = allImages[activeIndex] || null;

  useEffect(() => {
    setActiveIndex(0);
    setIsLightboxOpen(false);
  }, [mainImage, name]);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsLightboxOpen(false);
      if (event.key === 'ArrowRight') setActiveIndex((current) => (current + 1) % allImages.length);
      if (event.key === 'ArrowLeft') setActiveIndex((current) => (current - 1 + allImages.length) % allImages.length);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isLightboxOpen, allImages.length]);

  const previousImage = () => setActiveIndex((current) => (current - 1 + allImages.length) % allImages.length);
  const nextImage = () => setActiveIndex((current) => (current + 1) % allImages.length);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || typeof end !== 'number' || allImages.length < 2) return;
    const delta = end - start;
    if (Math.abs(delta) < 42) return;
    if (delta > 0) previousImage();
    else nextImage();
  };

  if (!activeImage) {
    return (
      <div className="fl-gallery-main grid place-items-center" role="img" aria-label={`تصویر ${name} هنوز ثبت نشده است`}>
        <div className="flex flex-col items-center gap-3 text-[#c18aa7]">
          <span className="grid h-16 w-16 place-items-center rounded-2xl border border-[#f0dce7] bg-white"><ImageOff size={25} strokeWidth={1.5} /></span>
          <span className="text-[11px]">تصویر این محصول هنوز ثبت نشده است</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-3" aria-label={`گالری تصاویر ${name}`}>
        <div
          className="fl-gallery-main group"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <Image
            key={activeImage}
            src={activeImage}
            alt={`${name}، تصویر ${activeIndex + 1}`}
            fill
            unoptimized={activeImage.startsWith('http')}
            priority={activeIndex === 0}
            sizes="(max-width: 900px) 100vw, 50vw"
            className="object-contain p-5 md:p-8 transition-transform duration-500 group-hover:scale-[1.025]"
          />
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="absolute bottom-3 left-3 z-10 inline-flex h-10 items-center gap-2 rounded-full border border-white/80 bg-white/90 px-3 text-xs font-bold text-[#6d5664] shadow-sm backdrop-blur transition hover:bg-white hover:text-[#c61d70]"
            aria-label="بزرگ‌نمایی تصویر محصول"
          >
            <ZoomIn size={16} /> بزرگ‌نمایی
          </button>
          {allImages.length > 1 && (
            <>
              <button type="button" onClick={previousImage} className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-[#6d5664] shadow-sm backdrop-blur transition hover:text-[#c61d70]" aria-label="تصویر قبلی">
                <ChevronRight size={18} />
              </button>
              <button type="button" onClick={nextImage} className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-white/90 text-[#6d5664] shadow-sm backdrop-blur transition hover:text-[#c61d70]" aria-label="تصویر بعدی">
                <ChevronLeft size={18} />
              </button>
              <span className="absolute bottom-4 right-3 z-10 rounded-full bg-[#28242b]/65 px-2.5 py-1 text-[10px] font-bold text-white" dir="ltr">
                {activeIndex + 1} / {allImages.length}
              </span>
            </>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="fl-gallery-thumbs" aria-label="انتخاب تصویر محصول">
            {allImages.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`fl-gallery-thumb relative ${activeIndex === index ? 'is-active' : ''}`}
                aria-label={`نمایش تصویر شماره ${index + 1}`}
                aria-pressed={activeIndex === index}
              >
                <Image src={image} alt="" fill unoptimized={image.startsWith('http')} sizes="70px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </section>

      {isLightboxOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm md:p-6" role="dialog" aria-modal="true" aria-label={`نمایش تصاویر ${name}`} onClick={() => setIsLightboxOpen(false)}>
          <button type="button" onClick={() => setIsLightboxOpen(false)} className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="بستن تصویر">
            <X size={22} />
          </button>
          {allImages.length > 1 && (
            <>
              <button type="button" onClick={(event) => { event.stopPropagation(); previousImage(); }} className="absolute right-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:right-8" aria-label="تصویر قبلی"><ChevronRight size={22} /></button>
              <button type="button" onClick={(event) => { event.stopPropagation(); nextImage(); }} className="absolute left-3 top-1/2 z-20 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 md:left-8" aria-label="تصویر بعدی"><ChevronLeft size={22} /></button>
            </>
          )}
          <div className="relative h-[82dvh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <Image src={activeImage} alt={name} fill sizes="100vw" priority className="object-contain" unoptimized={activeImage.startsWith('http')} />
          </div>
          {allImages.length > 1 && <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-white" dir="ltr">{activeIndex + 1} / {allImages.length}</span>}
        </div>
      )}
    </>
  );
}