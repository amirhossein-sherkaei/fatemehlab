'use client';
import { unstable_rethrow } from 'next/navigation';
import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('════════════════════════════════════════════');
    console.error('🔴 ADMIN ERROR CAUGHT');
    console.error('Message:', error.message);
    console.error('Digest:', error.digest);
    console.error('Name:', error.name);
    console.error('Stack:', error.stack);
    console.error('Full JSON:', JSON.stringify({ message: error.message, digest: error.digest, name: error.name, stack: error.stack }));
    console.error('════════════════════════════════════════════');
  }, [error]);

  unstable_rethrow(error);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-rose-100 shadow-sm">
      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="text-rose-500 w-8 h-8" />
      </div>
      <h2 className="text-xl font-black text-[#28242b] mb-2">خطایی در پنل مدیریت رخ داد</h2>
      <p className="text-sm text-[#77717b] mb-2 max-w-md">متأسفانه در بارگذاری این بخش مشکلی پیش آمد.</p>
      {error.digest && (
        <p className="text-xs text-rose-500 mb-6 font-mono" dir="ltr">Digest: {error.digest}</p>
      )}
      <p className="text-xs text-[#918a95] mb-6 max-w-md leading-relaxed">
        {error.message || 'خطای ناشناخته'}
      </p>
      <button onClick={() => reset()} className="flex items-center gap-2 rounded-xl bg-[#28242b] px-6 py-3 text-sm font-bold text-white hover:bg-black transition-colors">
        <RotateCcw size={16} /> تلاش مجدد
      </button>
    </div>
  );
}