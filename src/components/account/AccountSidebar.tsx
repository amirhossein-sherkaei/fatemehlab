'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Heart, MapPin, User, LogOut, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const menuItems = [
  { name: 'داشبورد', href: '/account', icon: LayoutDashboard },
  { name: 'سفارشات من', href: '/account/orders', icon: Package },
  { name: 'علاقه‌مندی‌ها', href: '/account/wishlist', icon: Heart },
  { name: 'آدرس‌ها', href: '/account/addresses', icon: MapPin },
  { name: 'پروفایل', href: '/account/profile', icon: User },
];

export default function AccountSidebar({ customer }: { customer: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/account/logout', { method: 'POST' });
      toast.success('خارج شدید');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('خطا در خروج');
    }
  };

  return (
    <aside className="hidden md:flex fixed right-0 top-0 bottom-0 w-64 bg-white border-l border-[#e9e5eb] flex-col z-30">
      <div className="p-5 border-b border-[#e9e5eb] shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <Image src="/logo.png" alt="فاطمه بیوتی لند" width={32} height={32} className="rounded-full border border-[#e9e5eb]" />
          <span className="font-black text-[#28242b]">فاطمه بیوتی لند</span>
        </Link>
        <div className="flex items-center gap-3 bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] p-3 rounded-xl border border-[#f2d7e5]">
          <div className="w-10 h-10 rounded-full bg-[#c61d70] text-white flex items-center justify-center font-black shrink-0">
            {customer.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-[#28242b] truncate">{customer.name}</p>
            <p className="text-[10px] text-[#77717b] truncate" dir="ltr">{customer.email}</p>
          </div>
        </div>
      </div>

      <nav className="p-3 flex-1 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                isActive ? 'bg-[#c61d70] text-white shadow-md shadow-[#c61d70]/20' : 'text-[#77717b] hover:bg-[#f8f7fa] hover:text-[#28242b]'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#e9e5eb] shrink-0 space-y-1">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-[#77717b] hover:bg-[#f8f7fa] hover:text-[#28242b]">
          <ArrowRight size={18} /> بازگشت به فروشگاه
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut size={18} /> خروج از حساب
        </button>
      </div>
    </aside>
  );
}