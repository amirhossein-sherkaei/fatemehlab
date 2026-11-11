'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';


export default function AccountGlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Account Global Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#fafafc]">
      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="text-rose-500 w-10 h-10" />
      </div>
      <h2 className="text-2xl font-black text-[#28242b] mb-3">خطایی رخ داد</h2>
      <p className="text-sm text-[#77717b] mb-8 max-w-md leading-relaxed">
        متأسفانه در بارگذاری این بخش مشکلی پیش آمد. لطفاً دوباره تلاش کنید. اگر مشکل ادامه داشت با پشتیبانی تماس بگیرید.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 rounded-xl bg-[#c61d70] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#a9155d] transition-colors shadow-lg shadow-[#c61d70]/20"
      >
        <RotateCcw size={18} /> تلاش مجدد
      </button>
    </div>
  );
}