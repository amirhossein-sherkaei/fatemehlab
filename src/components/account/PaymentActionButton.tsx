'use client';

import { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';

type Props = {
  orderId: string;
  compact?: boolean;
  className?: string;
};

export default function PaymentActionButton({ orderId, compact = false, className = '' }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const continuePayment = async () => {
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
        cache: 'no-store',
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success || typeof data?.redirectUrl !== 'string') {
        throw new Error(data?.message || 'امکان ادامه پرداخت وجود ندارد. وضعیت سفارش را دوباره بررسی کنید.');
      }

      const destination = new URL(data.redirectUrl, window.location.origin);
      const isSuccessPage = destination.origin === window.location.origin && destination.pathname === '/order/success';
      const isZarinpal = destination.origin === 'https://payment.zarinpal.com' && destination.pathname.startsWith('/pg/StartPay/');
      if (!isSuccessPage && !isZarinpal) {
        throw new Error('نشانی مقصد پرداخت معتبر نیست.');
      }

      window.location.assign(destination.toString());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'ارتباط با سرور برقرار نشد. دوباره تلاش کنید.');
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={continuePayment}
        disabled={loading}
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#c61d70] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#a9155d] disabled:cursor-not-allowed disabled:opacity-60 ${compact ? 'whitespace-nowrap' : 'w-full sm:w-auto'}`}
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <CreditCard size={15} />}
        {loading ? 'در حال بررسی تراکنش...' : 'ادامه پرداخت امن'}
      </button>
      {error && (
        <p role="alert" aria-live="polite" className="mt-2 max-w-sm text-right text-[11px] leading-6 text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
