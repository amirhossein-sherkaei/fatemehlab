'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, ArrowRight, RefreshCcw, ShieldAlert, HeadphonesIcon } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

function FailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  const errorMessages: Record<string, string> = {
    'cancelled': 'شما از پرداخت انصراف دادید یا تراکنش توسط بانک لغو شد.',
    'verify_failed': 'تایید پرداخت با خطا مواجه شد. اگر مبلغ از حساب شما کسر شده، تا ۷۲ ساعت آینده بازگردانده می‌شود.',
    'missing_params': 'اطلاعات پرداخت ناقص است.',
    'order_not_found': 'سفارش مورد نظر در سیستم یافت نشد.',
    'server_error': 'خطای ارتباط با سرور رخ داده است.'
  };

  const message = errorMessages[reason || ''] || 'متأسفانه در فرآیند پرداخت مشکلی پیش آمد.';

  return (
    <div className="glass-panel p-8 md:p-12 max-w-lg w-full text-center bg-white/80 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
        <XCircle className="w-12 h-12 text-rose-500" />
      </div>
      
      <h1 className="text-2xl md:text-3xl font-black text-[#28242b] mb-3">پرداخت ناموفق</h1>
      <p className="text-sm text-[#77717b] leading-loose mb-8">{message}</p>
      
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-right mb-8">
        <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <p className="text-xs text-amber-800 leading-relaxed">
          اگر مبلغی از حساب شما کسر شده است، نگران نباشید. این مبلغ طبق قوانین بانکی حداکثر تا ۷۲ ساعت کاری به صورت خودکار به حساب شما بازگردانده می‌شود.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/checkout" className="btn-primary w-full justify-center">
          <RefreshCcw size={16} /> تلاش مجدد برای پرداخت
        </Link>
        <Link href="/cart" className="btn-secondary w-full justify-center">
          بازگشت به سبد خرید
        </Link>
        <Link href="/contact" className="flex items-center justify-center gap-2 text-xs font-bold text-[#77717b] hover:text-[#c61d70] mt-2 transition-colors">
          <HeadphonesIcon size={14} /> نیاز به کمک دارید؟ با پشتیبانی تماس بگیرید
        </Link>
      </div>
    </div>
  );
}

export default function OrderFailurePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 pb-24 md:pb-20">
        <Suspense fallback={<div className="text-center p-8 text-[#c61d70]">در حال بارگذاری...</div>}>
          <FailureContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}