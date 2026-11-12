'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, LogOut, Settings, Menu, X, Package, BookOpen, MessageSquare, Bell, HelpCircle, User, BellRing, TicketPercent, Users, Headphones } from 'lucide-react';
import { Suspense, useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import AdminBottomNav from '@/components/admin/AdminBottomNav';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { permission, requestPermission, hasNew } = useAdminNotifications();

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    
    fetch('/api/admin/orders').then(res => res.json()).then(data => {
      if (data.success) {
        setPendingCount(data.orders.filter((o: any) => ['pending', 'paid', 'processing'].includes(o.status)).length);
      }
    }).catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) {}
    router.push('/admin/login'); router.refresh();
  };

  const menuItems = [
    { name: 'داشبورد', href: '/admin', icon: LayoutDashboard },
    { name: 'سفارشات', href: '/admin/orders', icon: Package, badge: pendingCount },
    { name: 'محصولات', href: '/admin/products', icon: ShoppingBag },
    { name: 'مجله', href: '/admin/articles', icon: BookOpen },
    { name: 'نظرات', href: '/admin/reviews', icon: MessageSquare },
        { name: 'مشتریان', href: '/admin/customers', icon: Users },
        { name: 'اعلان موجودی', href: '/admin/stock-notify', icon: BellRing },
    { name: 'پشتیبانی', href: '/admin/support', icon: Headphones },
    { name: 'کد تخفیف', href: '/admin/coupons', icon: TicketPercent },
    { name: 'تنظیمات', href: '/admin/settings', icon: Settings },
    { name: 'راهنما', href: '/admin/help', icon: HelpCircle },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex h-20 shrink-0 items-center gap-3 px-6">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] shadow-lg shadow-[#c61d70]/20">
          <Image src="/logo.png" alt="لوگو" width={24} height={24} className="rounded-full" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-black text-[#28242b] leading-tight">فاطمه بیوتی لند</h2>
          <span className="text-[10px] font-bold tracking-widest text-[#c61d70]">ADMIN PANEL</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && item.href !== '/admin/help' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
                isActive 
                  ? 'bg-[#fff0f7] text-[#c61d70] shadow-sm border border-[#f2d7e5]' 
                  : 'text-[#77717b] hover:bg-white hover:text-[#28242b] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#c61d70]' : 'text-[#918a95] group-hover:text-[#28242b]'} />
                <span className={`text-sm ${isActive ? 'font-black' : 'font-bold'}`}>{item.name}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#c61d70] px-1.5 text-[10px] font-black text-white shadow-sm">
                  {item.badge.toLocaleString('fa-IR')}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 p-4 space-y-4">

        {permission !== 'granted' && (
          <button onClick={requestPermission} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c61d70] to-[#e84e9e] p-3 text-white shadow-lg shadow-[#c61d70]/20 animate-pulse">
            <BellRing size={18} />
            <span className="text-xs font-bold">فعال‌سازی اعلان‌های مرورگر</span>
          </button>
        )}
        
        <div className="flex items-center gap-3 rounded-2xl border border-[#e9e5eb] bg-[#f8f7fa] p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f7] text-[#c61d70]">
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-[#28242b] truncate">مدیر سیستم</p>
            <p className="text-[10px] text-[#77717b] truncate">دسترسی کامل</p>
          </div>
        </div>

        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50">
          <LogOut size={20} />
          <span>خروج از پنل</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-[100dvh] max-w-[100vw] overflow-hidden bg-[#fafafc]">
      <Toaster position="top-center" richColors theme="light" />

      <aside className="sticky top-0 z-20 hidden h-screen w-72 shrink-0 flex-col border-l border-[#e9e5eb] bg-white/70 backdrop-blur-2xl md:flex">
        <Suspense fallback={null}><SidebarContent /></Suspense>
      </aside>

      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[#e9e5eb] bg-white/80 px-4 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-[#28242b]" aria-label="منو">
            <Menu size={24} />
          </button>
          <h2 className="text-sm font-black text-[#28242b]">پنل مدیریت</h2>
        </div>
        <div className="flex items-center gap-2">
          {permission !== 'granted' ? (
            <button onClick={requestPermission} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff0f7] text-[#c61d70] rounded-full text-[10px] font-bold border border-[#f2d7e5] animate-pulse">
              <BellRing size={14} /> فعال‌سازی
            </button>
          ) : (
            <button className="relative p-2 text-[#77717b]">
              <Bell size={20} className={hasNew ? 'text-[#c61d70] animate-bounce' : ''} />
              {pendingCount > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#c61d70] ring-2 ring-white"></span>}
            </button>
          )}
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            ا
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed bottom-0 right-0 top-0 z-[70] flex w-[290px] max-w-[85vw] flex-col bg-white shadow-2xl md:hidden animate-in slide-in-from-right duration-300">
            <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-[#e9e5eb]">
              <h2 className="text-sm font-black">منوی مدیریت</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -ml-2 text-[#77717b] bg-[#f8f7fa] rounded-xl">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Suspense fallback={null}><SidebarContent /></Suspense>
            </div>
          </div>
        </>
      )}

      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-[#fafafc] to-[#fafafc]" />
        <div className="relative z-10 min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden pb-24 pt-16 md:pb-8 md:pt-0">
          <div className="mx-auto max-w-6xl p-4 md:p-8 lg:p-10">
            {children}
          </div>
        </div>
      </main>

      <Suspense fallback={null}>
        <AdminBottomNav pendingCount={pendingCount} onOpenMenu={() => setIsMobileMenuOpen(true)} />
      </Suspense>
    </div>
  );
}