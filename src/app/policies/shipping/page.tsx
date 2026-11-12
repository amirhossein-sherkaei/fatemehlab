import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'شرایط ارسال | فاطمه بیوتی لند',
  description: 'اطلاعات مربوط به شرایط ارسال در فروشگاه فاطمه بیوتی لند',
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-1 container-custom max-w-3xl py-12 px-4 md:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] bg-white shadow-sm border border-[#f2d7e5] px-4 py-2 rounded-full mb-8 hover:bg-[#fff0f7] transition-colors">
          <ArrowRight size={14} /> بازگشت به صفحه اصلی
        </Link>
        
        <h1 className="text-2xl md:text-4xl font-black text-[#28242b] mb-8">شرایط ارسال</h1>
        
        <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 md:p-10 shadow-sm prose prose-sm md:prose-base max-w-none">
          <h2 className="text-lg font-bold text-[#28242b] mb-4">زمان و نحوه ارسال</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">سفارشات شما پس از تایید و آماده‌سازی، معمولاً در بازه زمانی ۱ تا ۳ روز کاری به دست شما خواهد رسید. ارسال سفارشات از طریق پست پیشتاز یا پیک موتوری (در تهران) انجام می‌شود.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">هزینه ارسال</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">هزینه ارسال بر اساس تعرفه‌های پست جمهوری اسلامی ایران و وزن مرسوله محاسبه می‌شود. در برخی از کمپین‌ها، ارسال به صورت رایگان خواهد بود که در صفحه محصول و سبد خرید اطلاع‌رسانی می‌شود.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">پیگیری سفارش</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">پس از تحویل مرسوله به پست، کد رهگیری از طریق پیامک برای شما ارسال می‌شود و همچنین می‌توانید از صفحه «رهگیری سفارش» در سایت، وضعیت دقیق سفارش خود را مشاهده کنید.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}