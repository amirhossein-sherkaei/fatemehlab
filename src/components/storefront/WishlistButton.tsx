'use client';

import { useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';

interface WishlistButtonProps {
  productId: string;
  variant?: 'icon' | 'button';
  className?: string;
}

export default function WishlistButton({ productId, variant = 'icon', className = '' }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [animating, setAnimating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch(`/api/account/wishlist/check?productId=${productId}`)
      .then(r => r.json())
      .then(data => {
        setIsWishlisted(data.isWishlisted || false);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [productId]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch('/api/account/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      if (res.status === 401) {
        toast.error('برای افزودن به علاقه‌مندی‌ها ابتدا وارد شوید');
        router.push(`/account/login?redirect=${pathname}`);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setIsWishlisted(data.action === 'added');
        setAnimating(true);
        setTimeout(() => setAnimating(false), 400);
        toast.success(data.action === 'added' ? 'به علاقه‌مندی‌ها اضافه شد ❤️' : 'از علاقه‌مندی‌ها حذف شد');
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  if (!checked) return <div className={className} />;

  if (variant === 'button') {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm transition-all ${
          isWishlisted
            ? 'bg-rose-50 border-rose-400 text-rose-600'
            : 'bg-white border-[#e9e5eb] text-[#77717b] hover:border-rose-300 hover:text-rose-500'
        } ${className}`}
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Heart
            size={18}
            fill={isWishlisted ? 'currentColor' : 'none'}
            className={animating ? 'animate-ping-once' : ''}
          />
        )}
        {isWishlisted ? 'در علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی'}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center justify-center w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-md border transition-all hover:scale-110 ${
        isWishlisted
          ? 'border-rose-400 text-rose-600'
          : 'border-[#e9e5eb] text-[#77717b] hover:border-rose-300 hover:text-rose-500'
      } ${className}`}
      aria-label={isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Heart
          size={16}
          fill={isWishlisted ? 'currentColor' : 'none'}
          className={animating ? 'scale-125 transition-transform' : 'transition-transform'}
        />
      )}
    </button>
  );
}