import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowLeft, ClipboardCheck, Eye, Search, Heart, ShieldCheck, Users, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'درباره فاطمه بیوتی لند',
  description: 'آشنایی با فروشگاه آنلاین فاطمه بیوتی لند، فلسفه انتخاب محصولات و شیوه بررسی اطلاعات.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <section className="fl-page-intro">
          <div className="container-custom">
            <span className="fl-eyebrow"><span className="fl-eyebrow-dot" />درباره فاطمه بیوتی لند</span>
            <h1 className="fl-page-title">درباره فاطمه بیوتی لند</h1>
            <p className="fl-page-description">فروشگاهی برای بررسی و خرید محصولات آرایشی و مراقبتی؛ با تمرکز بر نمایش روشن و شفاف اطلاعات هر محصول.</p>
          </div>
        </section>

        <section className="container-custom py-12 md:py-16">
          <div className="grid items-center gap-8 md:grid-cols-[.85fr_1.15fr] md:gap-14">
            <div className="relative grid min-h-[280px] place-items-center overflow-hidden rounded-[22px] border border-[#f1dce8] bg-[radial-gradient(circle_at_55%_40%,#ffffff_0_12%,transparent_38%),linear-gradient(145deg,#fff4f9,#f8e8f1)]">
              <div className="absolute h-44 w-44 rounded-full border border-[#d98ab2]/30 shadow-[0_0_0_24px_rgba(255,255,255,.28),0_0_0_52px_rgba(255,255,255,.18)]" />
              <span className="relative text-[12px] font-extrabold tracking-[.22em] text-[#ad3b76]">FATEMEH BEAUTY LAND</span>
            </div>
            <div className="max-w-xl">
              <span className="fl-section-kicker">داستان ما</span>
              <h2 className="mt-2 text-[22px] font-extrabold leading-[1.85] tracking-[-.025em] text-[#28242b]">زیبایی واقعی، از شناخت آغاز می‌شود.</h2>
              <p className="mt-4 text-[13px] leading-[2.2] text-[#77717b]">فاطمه بیوتی لند، روایتی است از مراقبت؛ جایی که هر محصول با اطلاعاتی روشن و هر انتخاب با آگاهی شکل می‌گیرد. ما بر این باوریم که زیبایی واقعی از شناخت آغاز می‌شود، و تلاش می‌کنیم تجربه‌ای ساده، شفاف و ماندگار از خرید محصولات مراقبتی برای شما بسازیم.</p>
              <p className="mt-3 text-[13px] leading-[2.2] text-[#77717b]">هنگام خرید آنلاین، امکان لمس یا بررسی حضوری محصول وجود ندارد. به همین دلیل، صفحه هر محصول در فاطمه بیوتی لند برای نمایش اطلاعات ثبت‌شده، تصاویر، قیمت و وضعیت موجودی در نظر گرفته شده است.</p>
            </div>
          </div>
        </section>

        <section className="container-custom pb-12 md:pb-16">
          <div className="mb-6">
            <span className="fl-section-kicker">اصول ما</span>
            <h2 className="fl-section-title">فلسفه انتخاب محصولات</h2>
            <p className="fl-section-note">چهار اصلی که تجربه فاطمه بیوتی لند را می‌سازند.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { icon: Eye, title: 'شفافیت اطلاعات', desc: 'هر محصول با مشخصات، ترکیبات و کاربرد ثبت‌شده نمایش داده می‌شود. هیچ وعده درمانی یا ادعای تأییدنشده‌ای در فروشگاه ارائه نمی‌شود.' },
              { icon: Search, title: 'بررسی آسان', desc: 'جست‌وجو، فیلتر و صفحه‌های محصول به گونه‌ای طراحی شده‌اند که کاربر بدون سردرگمی محصول مورد نیاز خود را پیدا کند.' },
              { icon: ShieldCheck, title: 'انتخاب آگاهانه', desc: 'به جای تشویق به خرید سریع، در فروشگاه اطلاعات دقیق درباره هر محصول ارائه می‌شود تا کاربر با اطمینان تصمیم بگیرد.' },
              { icon: ClipboardCheck, title: 'پیگیری سفارش', desc: 'پس از ثبت سفارش، کد رهگیری اختصاصی صادر می‌شود و کاربر می‌تواند وضعیت سفارش خود را پیگیری کند.' },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-[#eee9ef] bg-white p-6">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><item.icon size={20} /></span>
                <h3 className="text-[14px] font-extrabold text-[#28242b]">{item.title}</h3>
                <p className="mt-2 text-[11px] leading-[2.1] text-[#77717b]">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container-custom pb-12 md:pb-16">
          <div className="glass-panel rounded-2xl p-8 md:p-12">
            <div className="mb-6">
              <span className="fl-section-kicker">تعهد ما</span>
              <h2 className="fl-section-title">استانداردهای فروشگاه</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: Users, title: 'پاسخگویی', desc: 'تیم فروشگاه در اولین فرصت پاسخگوی سوالات شماست.' },
                { icon: Package, title: 'بسته‌بندی ایمن', desc: 'محصولات با بسته‌بندی مناسب و محافظت‌شده ارسال می‌شوند.' },
                { icon: Heart, title: 'رضایت مشتری', desc: 'در صورت بروز مشکل در سفارش، تیم ما برای حل آن در کنار شماست.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><item.icon size={18} /></span>
                  <div>
                    <h3 className="mb-1 text-[12px] font-bold text-[#28242b]">{item.title}</h3>
                    <p className="text-[11px] leading-[2] text-[#77717b]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-custom pb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-[#f0dce8] bg-[#fff8fc] p-8">
            <div>
              <h2 className="text-[18px] font-extrabold text-[#28242b]">سؤالی دارید؟</h2>
              <p className="mt-2 text-[12px] leading-[2] text-[#77717b]">تیم فاطمه بیوتی لند آماده پاسخگویی به سوالات شما درباره محصولات و سفارشات است.</p>
            </div>
            <Link href="/contact" className="btn-primary">تماس با ما <ArrowLeft size={15} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}