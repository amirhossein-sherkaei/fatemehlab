'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { unstable_rethrow } from 'next/navigation';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  unstable_rethrow(error);

  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafc] px-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] border border-[#e9e5eb] p-8 text-center shadow-xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-[#28242b] mb-3">مشکلی پیش آمد!</h2>
        <p className="text-sm text-[#77717b] leading-loose mb-8">
          متأسفانه در بارگذاری این بخش خطایی رخ داد. تیم فنی ما مطلع شدند. لطفاً دوباره تلاش کنید.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={() => reset()} className="w-full py-3.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all flex items-center justify-center gap-2">
            <RotateCcw size={18} /> تلاش مجدد
          </button>
          <Link href="/" className="w-full py-3.5 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl hover:bg-[#f8f7fa] transition-all flex items-center justify-center gap-2">
            <Home size={18} /> بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}