'use client';
import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ProductsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100 p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-rose-500 w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#28242b] mb-2">خطا در بارگذاری محصولات</h2>
        <p className="text-sm text-[#77717b] mb-6">لطفاً دوباره تلاش کنید یا به صفحه اصلی بازگردید.</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => reset()} className="w-full py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2"><RotateCcw size={16} /> تلاش مجدد</button>
          <Link href="/" className="w-full py-3 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl flex items-center justify-center gap-2"><Home size={16} /> صفحه اصلی</Link>
        </div>
      </div>
    </div>
  );
}