'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Menu, Headphones } from 'lucide-react';

export default function AdminBottomNav({
  pendingCount = 0,
  onOpenMenu
}: {
  pendingCount?: number;
  onOpenMenu: () => void;
}) {
  const pathname = usePathname();

  const primaryItems = [
    { href: '/admin', label: 'داشبورد', icon: LayoutDashboard, exact: true },
    { href: '/admin/orders', label: 'سفارشات', icon: Package, badge: pendingCount },
    { href: '/admin/products', label: 'محصولات', icon: ShoppingBag },
    { href: '/admin/support', label: 'پشتیبانی', icon: Headphones },
  ];

  return (
    <nav className="md:hidden fixed bottom-4 left-3 right-3 z-50">
      <div className="flex h-[68px] items-center justify-around rounded-3xl border border-[#e9e5eb] bg-white/95 px-2 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] backdrop-blur-2xl overflow-hidden">
        
        {primaryItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center justify-center gap-1 h-full rounded-2xl transition-all ${
                isActive ? 'text-[#c61d70]' : 'text-[#918a95]'
              }`}
            >
              {isActive && <div className="absolute inset-0.5 rounded-2xl bg-[#fff0f7] -z-10" />}
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} className={isActive ? 'drop-shadow-sm' : ''} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -right-2.5 -top-1.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#c61d70] px-1 text-[9px] font-black text-white ring-2 ring-white">
                    {item.badge.toLocaleString('fa-IR')}
                  </span>
                ) : null}
              </div>
              <span className={`text-[9px] ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
            </Link>
          );
        })}

        {/* Menu Button */}
        <button
          onClick={onOpenMenu}
          className="relative flex flex-1 flex-col items-center justify-center gap-1 h-full rounded-2xl text-[#918a95] hover:text-[#c61d70] transition-all"
        >
          <div className="relative">
            <Menu size={20} strokeWidth={1.8} />
          </div>
          <span className="text-[9px] font-bold">منو</span>
        </button>

      </div>
    </nav>
  );
}