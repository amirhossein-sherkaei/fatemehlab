import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowLeft, Mail, MapPin, Phone, Clock } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/SocialIcons';

export const metadata: Metadata = {
  title: 'تماس با فاطمه بیوتی لند',
  description: 'راه‌های ارتباطی فروشگاه فاطمه بیوتی لند.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="fl-page-intro">
          <div className="container-custom">
            <span className="fl-eyebrow"><span className="fl-eyebrow-dot" />تماس با ما</span>
            <h1 className="fl-page-title">ارتباط با فاطمه بیوتی لند</h1>
            <p className="fl-page-description">از راه‌های زیر می‌توانید با ما در ارتباط باشید. در اولین فرصت پاسخگو هستیم.</p>
          </div>
        </section>

        <section className="container-custom max-w-4xl py-10 md:py-14">
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="tel:09905316327" className="rounded-2xl border border-[#eee9ef] bg-white p-5 transition hover:border-[#e6b3ce]">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><Phone size={18} /></span>
              <span className="block text-[11px] text-[#908894]">شماره تماس</span>
              <span className="mt-1 block text-[14px] font-bold text-[#302a33]" dir="ltr">۰۹۹۰۵۳۱۶۳۲۷</span>
            </a>

            <a href="mailto:mirzaeico255@gmail.com" className="rounded-2xl border border-[#eee9ef] bg-white p-5 transition hover:border-[#e6b3ce]">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><Mail size={18} /></span>
              <span className="block text-[11px] text-[#908894]">ایمیل</span>
              <span className="mt-1 block break-all text-[14px] font-bold text-[#302a33]" dir="ltr">mirzaeico255@gmail.com</span>
            </a>

            <a
              href="https://instagram.com/fatemehlab.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-[#eee9ef] bg-white p-5 transition hover:border-[#e6b3ce]"
            >
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70] transition-transform duration-300 group-hover:scale-110">
                <InstagramIcon size={18} />
              </span>
              <span className="block text-[11px] text-[#908894]">اینستاگرام</span>
              <span className="mt-1 block text-[14px] font-bold text-[#302a33]" dir="ltr">@fatemehlab.ir</span>
            </a>

            <div className="rounded-2xl border border-[#eee9ef] bg-white p-5">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><MapPin size={18} /></span>
              <span className="block text-[11px] text-[#908894]">موقعیت</span>
              <span className="mt-1 block text-[14px] font-bold text-[#302a33]">تهران</span>
            </div>

            <div className="rounded-2xl border border-[#eee9ef] bg-white p-5 sm:col-span-2">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><Clock size={18} /></span>
              <span className="block text-[11px] text-[#908894]">ساعات پاسخگویی</span>
              <span className="mt-1 block text-[14px] font-bold text-[#302a33]">در اولین فرصت پاسخگو هستیم</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#f0dce8] bg-[#fff8fc] p-5">
            <div>
              <h2 className="text-[13px] font-extrabold text-[#302a33]">برای پیگیری سفارش</h2>
              <p className="mt-1 text-[11px] text-[#77717b]">کد رهگیری و شماره تماس سفارش را آماده داشته باشید.</p>
            </div>
            <Link href="/track" className="btn-primary">رهگیری سفارش <ArrowLeft size={15} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}