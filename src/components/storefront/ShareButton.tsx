'use client';

import { Share2, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `مشاهده ${title} در فاطمه بیوتی لند`,
          url: url,
        });
      } catch (err) {
        // کاربر انصراف داده است
      }
    } else {
      // کپی کردن لینک
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success('لینک محصول کپی شد');
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast.error('خطا در کپی کردن لینک');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 border-[#e9e5eb] bg-white text-[#77717b] text-sm font-bold transition-all hover:border-[#c61d70] hover:text-[#c61d70] min-w-[140px]"
      aria-label="اشتراک‌گذاری محصول"
    >
      {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
      {copied ? 'کپی شد' : 'اشتراک‌گذاری'}
    </button>
  );
}