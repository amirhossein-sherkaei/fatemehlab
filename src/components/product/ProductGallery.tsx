'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';

type ProductGalleryProps = {
  mainImage: string | null;
  gallery: string[] | null;
  name: string;
};

export default function ProductGallery({ mainImage, gallery, name }: ProductGalleryProps) {
  const allImages = Array.from(new Set([mainImage, ...(gallery || [])].filter((value): value is string => Boolean(value))));
  const [activeImage, setActiveImage] = useState(allImages[0] || null);

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
    <div className="space-y-3">
      <div className="fl-gallery-main">
        <Image key={activeImage} src={activeImage} alt={`تصویر ${name}`} fill unoptimized={activeImage.startsWith('http')} priority sizes="(max-width: 900px) 100vw, 50vw" />
      </div>
      {allImages.length > 1 && (
        <div className="fl-gallery-thumbs" aria-label="تصاویر دیگر محصول">
          {allImages.map((image, index) => (
            <button key={image} type="button" onClick={() => setActiveImage(image)} className={`fl-gallery-thumb ${activeImage === image ? 'is-active' : ''}`} aria-label={`نمایش تصویر شماره ${index + 1}`} aria-pressed={activeImage === image}>
              <Image src={image} alt="" fill unoptimized={image.startsWith('http')} sizes="70px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}