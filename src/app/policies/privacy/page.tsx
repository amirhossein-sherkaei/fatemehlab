import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'حریم خصوصی | فاطمه بیوتی لند',
  description: 'اطلاعات مربوط به حریم خصوصی در فروشگاه فاطمه بیوتی لند',
};

export default function PolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc]">
      <Header />
      <main className="flex-1 container-custom max-w-3xl py-12 px-4 md:px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] bg-white shadow-sm border border-[#f2d7e5] px-4 py-2 rounded-full mb-8 hover:bg-[#fff0f7] transition-colors">
          <ArrowRight size={14} /> بازگشت به صفحه اصلی
        </Link>
        
        <h1 className="text-2xl md:text-4xl font-black text-[#28242b] mb-8">حریم خصوصی</h1>
        
        <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 md:p-10 shadow-sm prose prose-sm md:prose-base max-w-none">
          <h2 className="text-lg font-bold text-[#28242b] mb-4">حریم خصوصی کاربران</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">فاطمه بیوتی لند به حریم خصوصی کاربران خود احترام می‌گذارد. اطلاعات شخصی شما (مانند نام، شماره تماس و آدرس) تنها برای پردازش سفارش، ارسال کالا و بهبود تجربه خرید استفاده می‌شود.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">امنیت اطلاعات</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">تمامی اطلاعات مشتریان به صورت رمزنگاری شده ذخیره می‌شود و در اختیار هیچ شخص یا سازمان ثالثی قرار نمی‌گیرد. پرداخت‌ها از طریق درگاه‌های امن انجام می‌شود.</p>

<h2 className="text-lg font-bold text-[#28242b] mb-4">کوکی‌ها</h2>
<p className="text-sm text-[#77717b] leading-loose mb-6">ما از کوکی‌ها برای بهبود عملکرد سایت (مانند حفظ سبد خرید) استفاده می‌کنیم. با ادامه استفاده از سایت، شما موافقت خود را با این سیاست اعلام می‌کنید.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}