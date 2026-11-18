'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCcw, ShieldAlert, HeadphonesIcon, Loader2 } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { useCartStore } from '@/store/cart';

function FailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const orderId = searchParams.get('orderId');
  const clearCart = useCartStore((state) => state.clearCart);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState('');

  const errorMessages: Record<string, string> = {
    cancelled: 'پرداخت لغو شد یا از ادامه آن انصراف دادید. سفارش شما حذف نشده و می‌توانید همان سفارش را دوباره پرداخت کنید.',
    verify_failed: 'تأیید پرداخت با خطا مواجه شد. وضعیت سفارش را با تلاش مجدد بررسی کنید؛ از پرداخت دوباره بدون بررسی وضعیت بانکی خودداری کنید.',
    payment_request_failed: 'سفارش ثبت شده، اما اتصال به درگاه کامل نشد. می‌توانید پرداخت همین سفارش را دوباره آغاز کنید.',
    missing_params: 'اطلاعات پرداخت ناقص است.',
    order_not_found: 'سفارش موردنظر در سیستم پیدا نشد.',
    security_error: 'اطلاعات امنیتی تراکنش با سفارش مطابقت ندارد.',
    invalid_order_state: 'وضعیت سفارش اجازه پرداخت مجدد نمی‌دهد.',
    verification_conflict: 'وضعیت تراکنش در حال بررسی است. قبل از تلاش دوباره، وضعیت سفارش را بررسی کنید.',
    server_error: 'ارتباط با سرور یا درگاه پرداخت با مشکل مواجه شد.',
  };

  const message = errorMessages[reason || ''] || 'متأسفانه در فرآیند پرداخت مشکلی پیش آمد.';
  const canSafelyRetry = Boolean(orderId && (reason === 'cancelled' || reason === 'payment_request_failed'));

  const retryPayment = async () => {
    if (!orderId || retrying) return;
    setRetrying(true);
    setRetryError('');
    try {
      const response = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();
      if (!response.ok || !data?.success || !data?.redirectUrl) {
        throw new Error(data?.message || 'امکان شروع مجدد پرداخت وجود ندارد.');
      }
      clearCart();
      try { localStorage.removeItem('checkout-draft'); } catch {}
      window.location.assign(data.redirectUrl);
    } catch (error) {
      setRetryError(error instanceof Error ? error.message : 'خطا در شروع مجدد پرداخت');
      setRetrying(false);
    }
  };

  return (
    <div className='glass-panel p-8 md:p-12 max-w-lg w-full text-center bg-white/80 animate-in zoom-in-95 duration-500'>
      <div className='w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner'>
        <XCircle className='w-12 h-12 text-rose-500' />
      </div>
      <h1 className='text-2xl md:text-3xl font-black text-[#28242b] mb-3'>پرداخت کامل نشد</h1>
      <p className='text-sm text-[#77717b] leading-loose mb-8'>{message}</p>

      <div className='bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-right mb-8'>
        <ShieldAlert className='text-amber-500 shrink-0 mt-0.5' size={20} />
        <p className='text-xs text-amber-800 leading-relaxed'>
          {reason === 'verify_failed' || reason === 'server_error' || reason === 'verification_conflict'
            ? 'وضعیت برداشت وجه هنوز قطعی نیست؛ برای جلوگیری از پرداخت تکراری، فعلاً پرداخت را دوباره آغاز نکنید و با پشتیبانی پیگیری کنید.'
            : 'اگر مبلغی از حساب شما کسر شده است، پیش از هر اقدام وضعیت تراکنش را از بانک یا پشتیبانی پیگیری کنید.'}
        </p>
      </div>

      {retryError && <p role='alert' className='text-sm text-rose-600 mb-4'>{retryError}</p>}

      <div className='flex flex-col gap-3'>
        {canSafelyRetry ? (
          <button type='button' onClick={retryPayment} disabled={retrying} className='btn-primary w-full justify-center disabled:opacity-60'>
            {retrying ? <Loader2 size={16} className='animate-spin' /> : <RefreshCcw size={16} />}
            {retrying ? 'در حال اتصال به درگاه...' : 'تلاش مجدد برای پرداخت همین سفارش'}
          </button>
        ) : orderId ? (
          <Link href='/contact' className='btn-primary w-full justify-center'>پیگیری وضعیت پرداخت با پشتیبانی</Link>
        ) : (
          <Link href='/cart' className='btn-primary w-full justify-center'>بازگشت به سبد خرید</Link>
        )}
        {(!orderId || canSafelyRetry) && <Link href='/products' className='btn-secondary w-full justify-center'>مشاهده محصولات</Link>}
        <Link href='/contact' className='flex items-center justify-center gap-2 text-xs font-bold text-[#77717b] hover:text-[#c61d70] mt-2 transition-colors'>
          <HeadphonesIcon size={14} /> نیاز به کمک دارید؟ با پشتیبانی تماس بگیرید
        </Link>
      </div>
    </div>
  );
}

export default function OrderFailurePage() {
  return (
    <div className='min-h-screen flex flex-col bg-background'>
      <Header />
      <main className='flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 pb-24 md:pb-20'>
        <Suspense fallback={<div className='text-center p-8 text-[#c61d70]'>در حال بارگذاری...</div>}>
          <FailureContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
