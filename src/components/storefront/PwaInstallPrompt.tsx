'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { X, Smartphone, Download } from 'lucide-react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const pathname = usePathname();

  // 🛡️ مخفی کردن اعلان در پنل ادمین و صفحات حساب کاربری
  const shouldHide = 
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/account') || 
    pathname === '/checkout' || 
    pathname === '/cart';

  useEffect(() => {
    // اگر کاربر قبلاً بسته یا نصب کرده، نمایش نده
    if (localStorage.getItem('pwa-dismissed') || localStorage.getItem('pwa-installed')) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // فقط اگر در صفحات مخفی نبودیم، بعد از ۱۰ ثانیه نشان بده
      if (!shouldHide) {
        setTimeout(() => setShowPrompt(true), 10000); 
      }
    };

    const handleAppInstalled = () => {
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [shouldHide]);

  // اگر کاربر در حین نمایش اعلان، به صفحه ادمین رفت، آن را ببند
  useEffect(() => {
    if (shouldHide) {
      setShowPrompt(false);
    }
  }, [shouldHide]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-dismissed', 'true');
  };

  // اگر در صفحه ممنوعه هستیم یا قرار نیست نمایش داده شود، هیچی رندر نکن
  if (!showPrompt || shouldHide) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 z-[90] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-[#f2d7e5] shadow-2xl shadow-[#c61d70]/20 p-4 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#c61d70]/10 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="w-12 h-12 bg-gradient-to-br from-[#c61d70] to-[#e84e9e] rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
          <Smartphone className="text-white" size={24} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-black text-[#28242b]">نصب اپلیکیشن فاطمه بیوتی لند</h3>
          <p className="text-[10px] text-[#77717b] mt-1">دسترسی سریع‌تر و تجربه‌ای عالی‌تر بدون نیاز به مرورگر</p>
        </div>
        
        <button onClick={handleInstall} className="px-4 py-2 bg-[#c61d70] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#a9155d] transition-colors shrink-0 flex items-center gap-1">
          <Download size={14} /> نصب
        </button>
        
        <button onClick={handleDismiss} className="absolute top-2 left-2 p-1.5 text-[#918a95] hover:text-rose-500 bg-white rounded-full transition-colors" aria-label="بستن">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}