'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Heart, MapPin, User } from 'lucide-react';

const items = [
  { href: '/account', label: 'داشبورد', icon: LayoutDashboard, exact: true },
  { href: '/account/orders', label: 'سفارشات', icon: Package },
  { href: '/account/wishlist', label: 'علاقه‌مندی', icon: Heart },
  { href: '/account/addresses', label: 'آدرس‌ها', icon: MapPin },
  { href: '/account/profile', label: 'پروفایل', icon: User },
];

export default function AccountBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-4 left-3 right-3 z-40">
      <div className="flex items-stretch h-16 bg-white/90 backdrop-blur-xl border border-[#e9e5eb] rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
        {items.map((item) => {
          // Logic to strictly match paths
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${
                isActive ? 'text-[#c61d70] bg-[#fff0f7]' : 'text-[#77717b] hover:bg-[#f8f7fa]'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
              <span className="text-[9px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}