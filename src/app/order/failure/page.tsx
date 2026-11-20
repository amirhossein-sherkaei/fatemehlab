'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, RefreshCcw, ShieldAlert, HeadphonesIcon, Loader2 } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

function FailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const orderId = searchParams.get('orderId');
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState('');

  const errorMessages: Record<string, string> = {
    cancelled: 'تراکنش قبلی در درگاه ناموفق یا برگشت‌خورده گزارش شده است. سفارش شما حذف نشده و با بررسی دوباره می‌توانید پرداخت همین سفارش را ادامه دهید.',
    payment_processing: 'درگاه اعلام کرده تراکنش قبلی هنوز در حال انجام است. از شروع پرداخت تازه خودداری کنید؛ از همان سفارش وضعیت را دوباره بررسی کنید.',
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
  const isUncertain = ['payment_processing', 'verify_failed', 'verification_conflict', 'server_error'].includes(reason || '');
  const pageTitle = reason === 'payment_request_failed'
    ? 'اتصال به درگاه کامل نشد'
    : isUncertain
      ? 'وضعیت پرداخت نیازمند بررسی است'
      : reason === 'cancelled'
        ? 'پرداخت انجام نشد'
        : 'پرداخت تأیید نشد';
  // The payment API reconciles a persisted authority with the gateway before it
  // resumes or creates a transaction, so every owned order can safely use this action.
  const canCheckAndContinue = Boolean(orderId);

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
      const destination = new URL(data.redirectUrl, window.location.origin);
      const isSuccessPage = destination.origin === window.location.origin && destination.pathname === '/order/success';
      const isZarinpal = destination.origin === 'https://payment.zarinpal.com' && destination.pathname.startsWith('/pg/StartPay/');
      if (!isSuccessPage && !isZarinpal) throw new Error('نشانی مقصد پرداخت معتبر نیست.');
      window.location.assign(destination.toString());
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
      <h1 className='text-2xl md:text-3xl font-black text-[#28242b] mb-3'>{pageTitle}</h1>
      <p className='text-sm text-[#77717b] leading-loose mb-8'>{message}</p>

      <div className='bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-right mb-8'>
        <ShieldAlert className='text-amber-500 shrink-0 mt-0.5' size={20} />
        <p className='text-xs text-amber-800 leading-relaxed'>
          {orderId
            ? 'با انتخاب دکمه زیر، ابتدا وضعیت شناسه تراکنش قبلی از زرین‌پال استعلام می‌شود. اگر پرداخت قبلاً انجام شده باشد به صفحه تأیید سفارش منتقل می‌شوید؛ در صورت نامشخص بودن نتیجه، تراکنش تازه‌ای ساخته نخواهد شد.'
            : 'اگر مبلغی از حساب شما کسر شده است، پیش از ثبت سفارش جدید وضعیت تراکنش را از بانک یا پشتیبانی پیگیری کنید.'}
        </p>
      </div>

      {retryError && <p role='alert' className='text-sm text-rose-600 mb-4'>{retryError}</p>}

      <div className='flex flex-col gap-3'>
        {canCheckAndContinue ? (
          <button type='button' onClick={retryPayment} disabled={retrying} className='btn-primary w-full justify-center disabled:opacity-60'>
            {retrying ? <Loader2 size={16} className='animate-spin' /> : <RefreshCcw size={16} />}
            {retrying ? 'در حال استعلام و اتصال امن...' : 'بررسی وضعیت و ادامه پرداخت'}
          </button>
        ) : (
          <Link href='/cart' className='btn-primary w-full justify-center'>بازگشت به سبد خرید</Link>
        )}
        {(!orderId || canCheckAndContinue) && <Link href='/products' className='btn-secondary w-full justify-center'>مشاهده محصولات</Link>}
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
