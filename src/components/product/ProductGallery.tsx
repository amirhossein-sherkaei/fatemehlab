'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff, X, ZoomIn } from 'lucide-react';

type ProductGalleryProps = {
  mainImage: string | null;
  gallery: string[] | null;
  name: string;
};

export default function ProductGallery({ mainImage, gallery, name }: ProductGalleryProps) {
  const allImages = Array.from(new Set([mainImage, ...(gallery || [])].filter((value): value is string => Boolean(value))));
  const [activeImage, setActiveImage] = useState(allImages[0] || null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
      <div className="space-y-3">
        {/* تصویر اصلی */}
        <div 
          className="fl-gallery-main relative cursor-zoom-in group overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Image 
            key={activeImage} 
            src={activeImage} 
            alt={`تصویر ${name}`} 
            fill 
            unoptimized={activeImage.startsWith('http')} 
            priority 
            sizes="(max-width: 900px) 100vw, 50vw" 
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 drop-shadow-lg transition-all duration-300 scale-50 group-hover:scale-100" size={32} />
          </div>
        </div>

        {/* تصاویر کوچک */}
        {allImages.length > 1 && (
          <div className="fl-gallery-thumbs" aria-label="تصاویر دیگر محصول">
            {allImages.map((image, index) => (
              <button 
                key={image} 
                type="button" 
                onClick={() => setActiveImage(image)} 
                className={`fl-gallery-thumb relative ${activeImage === image ? 'is-active' : ''}`} 
                aria-label={`نمایش تصویر شماره ${index + 1}`} 
                aria-pressed={activeImage === image}
              >
                <Image src={image} alt="" fill unoptimized={image.startsWith('http')} sizes="70px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* لایت‌باکس (نمایش تمام‌صفحه) */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button 
            onClick={() => setIsLightboxOpen(false)} 
            className="absolute top-6 right-6 p-3 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all z-10"
          >
            <X size={24} />
          </button>
          <div className="relative w-full max-w-4xl aspect-square md:aspect-video">
            <Image 
              src={activeImage} 
              alt={name} 
              fill 
              className="object-contain" 
              unoptimized={activeImage.startsWith('http')}
            />
          </div>
        </div>
      )}
    </>
  );
}