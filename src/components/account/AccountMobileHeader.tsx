'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { ArrowRight, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const pageTitles: Record<string, string> = {
  '/account': 'حساب کاربری',
  '/account/orders': 'سفارشات من',
  '/account/wishlist': 'علاقه‌مندی‌ها',
  '/account/addresses': 'آدرس‌های من',
  '/account/support': 'پشتیبانی',
  '/account/profile': 'پروفایل من',
};

export default function AccountMobileHeader() {
  const pathname = usePathname();
  const router = useRouter();

  let title = 'حساب کاربری';
  for (const [path, t] of Object.entries(pageTitles)) {
    if (pathname === path || pathname.startsWith(path + '/')) {
      title = t;
      break;
    }
  }

  const handleLogout = async () => {
    if (!confirm('آیا از حساب کاربری خود خارج می‌شوید؟')) return;
    try {
      await fetch('/api/account/logout', { method: 'POST' });
      toast.success('با موفقیت خارج شدید');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('خطا در خروج');
    }
  };

  return (
    <div className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-lg border-b border-[#e9e5eb]">
      <div className="flex items-center justify-between h-14 px-3 gap-2">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-2 bg-[#fff0f7] border border-[#f2d7e5] rounded-xl text-[#c61d70] text-xs font-black shrink-0 active:scale-95 transition-transform"
          aria-label="بازگشت به فروشگاه"
        >
          <ArrowRight size={16} />
          فروشگاه
        </Link>

        <h1 className="font-black text-sm text-[#28242b] truncate flex-1 text-center">
          {title}
        </h1>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleLogout}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg active:scale-95 transition-transform"
            aria-label="خروج از حساب"
          >
            <LogOut size={18} />
          </button>
          <Link href="/" aria-label="فاطمه بیوتی لند">
            <Image
              src="/logo.png"
              alt=""
              width={32}
              height={32}
              className="rounded-full border border-[#e9e5eb]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}