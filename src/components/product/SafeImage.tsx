'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SafeImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  title?: string;
}

export default function SafeImage({ src, alt, fill, width, height, className, sizes, priority, title }: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || src.trim() === '' || error) {
    if (fill) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#fcfafc] to-[#f7f2f7] text-[#d28aac]">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-[#c61d70]/20 shadow-[0_0_0_16px_rgba(255,255,255,.36),0_0_0_34px_rgba(255,255,255,.22)] flex items-center justify-center mb-2 md:mb-4">
            <Sparkles size={24} className="md:w-8 md:h-8" />
          </div>
          <span className="text-[8px] md:text-[10px] font-bold tracking-[.16em]">FATEMEHLAB</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-[#f8f7fa] text-[#d28aac] rounded-xl">
        <Sparkles size={24} />
      </div>
    );
  }

  return (
    <Image 
      src={src} 
      alt={alt} 
      fill={fill} 
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes} 
      priority={priority}
      className={className}
      onError={() => setError(true)}
      title={title || alt}
      itemProp="image"
    />
  );
}