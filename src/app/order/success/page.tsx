import { CheckCircle2, ArrowRight, Copy } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import CopyButton from './copy-button';


export const instant = false;

export default async function OrderSuccessPage({ searchParams }: { searchParams: Promise<{ id?: string; code?: string }> }) {
  const { id, code } = await searchParams;
  
  let trackingCode = 'در حال دریافت...';
  let isValid = false;
  
  if (code && code.length >= 3 && code !== 'undefined' && code !== 'null') {
    trackingCode = code;
    isValid = true;
  } else if (id && id.length >= 6 && id !== 'undefined') {
    trackingCode = `FL-${id.slice(0, 6).toUpperCase()}`;
    isValid = true;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 pb-24 md:pb-20">
        <div className="glass-panel p-8 md:p-12 max-w-lg w-full text-center bg-white/80">
          <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-sage" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-extrabold text-ink mb-3">سفارش شما با موفقیت ثبت شد!</h1>
          <p className="text-sm text-muted leading-relaxed mb-8">از خرید شما سپاسگزاریم. کد رهگیری زیر را نزد خود نگه دارید تا در هر زمان بتوانید وضعیت سفارش خود را پیگیری کنید.</p>
          
          <div className="bg-chalk rounded-2xl p-6 mb-8 border border-line relative group">
            <p className="text-xs text-muted mb-2">کد رهگیری اختصاصی شما</p>
            <div className="flex items-center justify-center gap-3">
              <p className="font-mono text-2xl md:text-3xl font-black text-sage tracking-widest" dir="ltr">{trackingCode}</p>
              {isValid && <CopyButton text={trackingCode} />}
            </div>
            <p className="text-[10px] text-muted mt-4">با این کد و شماره تماس خود می‌توانید وضعیت را در صفحه «رهگیری سفارش» مشاهده کنید.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/track" className="btn-primary w-full justify-center">
              پیگیری سفارش <ArrowRight size={16} />
            </Link>
            <Link href="/" className="btn-secondary w-full justify-center">
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}