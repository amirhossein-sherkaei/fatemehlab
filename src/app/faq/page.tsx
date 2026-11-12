import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'راهنمای خرید و سؤالات متداول',
  description: 'راهنمای استفاده از فروشگاه فاطمه بیوتی لند، مشاهده اطلاعات محصولات و پیگیری سفارش.',
};

const FAQ_GROUPS = [
  {
    title: 'محصولات و اطلاعات',
    items: [
      { question: 'از کجا مشخصات کامل محصول را ببینم؟', answer: 'روی محصول موردنظر بزنید تا وارد صفحه اختصاصی آن شوید. اطلاعاتی مانند توضیحات، تصاویر، مشخصات، ترکیبات و روش استفاده در صورت ثبت‌شدن در همان صفحه نمایش داده می‌شوند.' },
      { question: 'چرا قیمت بعضی محصولات نمایش داده نمی‌شود؟', answer: 'تا زمانی که قیمت محصول در فروشگاه ثبت نشده باشد، به‌جای نمایش مبلغ حدسی، وضعیت «قیمت ثبت نشده» نشان داده می‌شود و امکان افزودن آن به سبد خرید فعال نیست.' },
      { question: 'وضعیت موجودی محصول را چطور بررسی کنم؟', answer: 'وضعیت موجودی در صفحه محصول و کنار اطلاعات قیمت نمایش داده می‌شود. وضعیت نهایی هنگام ثبت سفارش نیز در سمت فروشگاه بررسی می‌شود.' },
    ],
  },
  {
    title: 'ثبت و پیگیری سفارش',
    items: [
      { question: 'چطور سفارش ثبت کنم؟', answer: 'محصولی را که قیمت ثبت‌شده و موجودی دارد انتخاب کنید، آن را به سبد خرید اضافه کنید و اطلاعات لازم را در مرحله تسویه‌حساب وارد کنید.' },
      { question: 'چطور سفارش ثبت‌شده را پیگیری کنم؟', answer: 'به صفحه «رهگیری سفارش» بروید و کد رهگیری و شماره تماس ثبت‌شده برای سفارش را وارد کنید.' },
      { question: 'اگر درباره یک محصول سؤال داشته باشم چه کار کنم؟', answer: 'از بخش تماس با ما، اطلاعات ارتباطی ثبت‌شده فروشگاه را بررسی کنید. اگر راه ارتباطی هنوز در فروشگاه درج نشده باشد، باید پیش از خرید از مالک فروشگاه دریافت شود.' },
    ],
  },
];

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap(group => group.items.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  })))
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <Header />
      <main className="flex-1">
        <section className="fl-page-intro">
          <div className="container-custom">
            <span className="fl-eyebrow"><span className="fl-eyebrow-dot" />HELP CENTER</span>
            <h1 className="fl-page-title">راهنمای خرید</h1>
            <p className="fl-page-description">پاسخ پرسش‌های مربوط به بررسی محصولات، ثبت سفارش و پیگیری خرید.</p>
          </div>
        </section>

        <section className="container-custom max-w-4xl py-9 md:py-12">
          <div className="grid gap-9">
            {FAQ_GROUPS.map((group) => (
              <section key={group.title}>
                <h2 className="mb-4 border-b border-[#eee9ef] pb-3 text-[14px] font-extrabold text-[#302a33]">{group.title}</h2>
                <div className="fl-faq-list">
                  {group.items.map((item) => (
                    <details className="fl-faq-item" key={item.question}>
                      <summary>{item.question}</summary>
                      <div className="fl-faq-answer">{item.answer}</div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#f0dce8] bg-[#fff8fc] p-5">
            <div><h2 className="text-[13px] font-extrabold text-[#302a33]">سفارش ثبت‌شده‌ای دارید؟</h2><p className="mt-1 text-[11px] text-[#77717b]">برای مشاهده آخرین وضعیت، صفحه رهگیری را باز کنید.</p></div>
            <Link href="/track" className="btn-primary">رهگیری سفارش <ArrowLeft size={15} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}