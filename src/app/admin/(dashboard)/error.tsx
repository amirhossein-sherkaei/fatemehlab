'use client';
import { unstable_rethrow } from 'next/navigation';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // اگر خطا از نوع redirect یا notFound باشد، اینجا throw میشود و به بالا میرود
  unstable_rethrow(error);

  return (
    <div className="min-h-[60vh] p-6 bg-white rounded-3xl border border-rose-100 m-4">
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="text-rose-500 w-8 h-8" />
        <h2 className="text-xl font-black text-rose-600">خطای واقعی این است:</h2>
      </div>
      
      <div className="space-y-3">
        <div>
          <p className="text-xs font-bold text-[#28242b] mb-1">پیام خطا:</p>
          <pre className="bg-rose-50 p-3 rounded-lg text-xs text-rose-700 overflow-auto" dir="ltr">{error.message || 'بدون پیام'}</pre>
        </div>
        
        {error.digest && (
          <div>
            <p className="text-xs font-bold text-[#28242b] mb-1">Digest:</p>
            <pre className="bg-amber-50 p-3 rounded-lg text-xs text-amber-700" dir="ltr">{error.digest}</pre>
          </div>
        )}
        
        <div>
          <p className="text-xs font-bold text-[#28242b] mb-1">Stack Trace:</p>
          <pre className="bg-gray-50 p-3 rounded-lg text-[10px] text-gray-700 overflow-auto max-h-64" dir="ltr">{error.stack || 'بدون stack'}</pre>
        </div>
        
        <button onClick={() => reset()} className="flex items-center gap-2 rounded-xl bg-[#c61d70] px-6 py-3 text-sm font-bold text-white hover:bg-[#a9155d] mt-4">
          <RotateCcw size={16} /> تلاش مجدد
        </button>
      </div>
    </div>
  );
}