'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';


export default function WishlistRemoveButton({ wishlistId }: { wishlistId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/account/wishlist?id=${wishlistId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('از علاقه‌مندی‌ها حذف شد');
        router.refresh();
      } else {
        toast.error('خطا در حذف');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="flex items-center justify-center w-10 h-10 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
      aria-label="حذف از علاقه‌مندی‌ها"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}