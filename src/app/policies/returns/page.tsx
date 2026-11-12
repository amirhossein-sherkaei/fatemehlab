import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'مرجوعی و تعویض | فاطمه بیوتی لند',
  description: 'اطلاعات مربوط به مرجوعی و تعویض در فروشگاه فاطمه بیوتی لند',
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-1 container-custom max-w-3xl py-12 px-4 md:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] bg-white shadow-sm border border-[#f2d7e5] px-4 py-2 rounded-full mb-8 hover:bg-[#fff0f7] transition-colors">
          <ArrowRight size={14} /> بازگشت به صفحه اصلی
        </Link>
        
        <h1 className="text-2xl md:text-4xl font-black text-[#28242b] mb-8">مرجوعی و تعویض</h1>
        
        <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 md:p-10 shadow-sm prose prose-sm md:prose-base max-w-none">
          <h2 className="text-lg font-bold text-[#28242b] mb-4">شرایط مرجوعی کالا</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">با توجه به ماهیت بهداشتی محصولات آرایشی و مراقبتی، امکان بازگشت کالا تنها در صورتی پذیرفته می‌شود که پلمب محصول باز نشده باشد و بسته‌بندی آن آسیب ندیده باشد.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">فرآیند درخواست مرجوعی</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">در صورت وجود مشکل در سفارش (مغایرت کالا، آسیب‌دیدگی در حین حمل)، لطفاً حداکثر تا ۴۸ ساعت پس از دریافت، با پشتیبانی تماس بگیرید. پس از بررسی، در صورت تایید، هزینه به حساب شما بازگردانده می‌شود.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">کالاهای غیرقابل مرجوعی</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">محصولاتی که پلمب آن‌ها باز شده باشد، یا به دلایل بهداشتی قابل استفاده مجدد نباشند، به هیچ عنوان قابل مرجوعی نیستند.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}