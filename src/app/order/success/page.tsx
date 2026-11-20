import { CheckCircle2, ArrowRight, Clock3 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import CopyButton from './copy-button';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

export const instant = false;

const CONFIRMED_STATUSES = ['paid', 'processing', 'shipped', 'delivered'];

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string; code?: string }> }) {
  const { id, code } = await searchParams;
  let confirmedOrder: { trackingCode: string; status: string } | undefined;

  if (id && code && /^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(id) && code.length <= 40) {
    const [order] = await db.select({ trackingCode: orders.trackingCode, status: orders.status })
      .from(orders)
      .where(and(eq(orders.id, id), eq(orders.trackingCode, code)))
      .limit(1);
    if (order && CONFIRMED_STATUSES.includes(order.status)) confirmedOrder = order;
  }

  const trackingCode = confirmedOrder?.trackingCode;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 pb-24 md:pb-20">
        <div className="glass-panel p-8 md:p-12 max-w-lg w-full text-center bg-white/80">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${confirmedOrder ? 'bg-sage/10' : 'bg-amber-50'}`}>
            {confirmedOrder ? <CheckCircle2 className="w-10 h-10 text-sage" /> : <Clock3 className="w-10 h-10 text-amber-600" />}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink mb-3">
            {confirmedOrder ? 'پرداخت و ثبت سفارش تأیید شد' : 'در انتظار تأیید سفارش'}
          </h1>
          <p className="text-sm text-muted leading-relaxed mb-8">
            {confirmedOrder
              ? 'از خرید شما سپاسگزاریم. سفارش شما در سیستم ثبت شده است؛ کد رهگیری را نزد خود نگه دارید.'
              : 'وضعیت سفارش هنوز به‌عنوان پرداخت‌شده تأیید نشده است. اگر مبلغ از حساب شما کسر شده، برای بررسی وضعیت با پشتیبانی تماس بگیرید.'}
          </p>

          {trackingCode && (
            <div className="bg-chalk rounded-2xl p-6 mb-8 border border-line relative group">
              <p className="text-xs text-muted mb-2">کد رهگیری اختصاصی شما</p>
              <div className="flex items-center justify-center gap-3">
                <p className="font-mono text-2xl md:text-3xl font-black text-sage tracking-widest" dir="ltr">{trackingCode}</p>
                <CopyButton text={trackingCode} />
              </div>
              <p className="text-[10px] text-muted mt-4">با این کد و شماره تماس خود می‌توانید وضعیت سفارش را در صفحه رهگیری مشاهده کنید.</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {confirmedOrder ? (
              <Link href="/track" className="btn-primary w-full justify-center">پیگیری سفارش <ArrowRight size={16} /></Link>
            ) : (
              <Link href="/account/orders" className="btn-primary w-full justify-center">مشاهده سفارش‌های من <ArrowRight size={16} /></Link>
            )}
            <Link href="/" className="btn-secondary w-full justify-center">بازگشت به صفحه اصلی</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
