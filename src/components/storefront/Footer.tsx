'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpLeft,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { InstagramIcon, RubikaIcon } from '@/components/icons/SocialIcons';
import StoreTrustBenefits from '@/components/storefront/StoreTrustBenefits';

const storeLinks = [
  { href: '/products', label: 'همه محصولات' },
  { href: '/cart', label: 'سبد خرید' },
  { href: '/track', label: 'رهگیری سفارش' },
  { href: '/journal', label: 'مجله زیبایی' },
];

const guideLinks = [
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
  { href: '/faq', label: 'سؤالات متداول' },
  { href: '/policies/shipping', label: 'روش‌های ارسال' },
  { href: '/policies/returns', label: 'شرایط مرجوعی' },
  { href: '/policies/privacy', label: 'حریم خصوصی' },
];

export default function Footer() {
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear().toLocaleString('fa-IR', { useGrouping: false }));
  }, []);

  return (
    <>
      <StoreTrustBenefits />
      <footer className="fbl-atelier-footer" aria-labelledby="fbl-atelier-title">
        <div className="fbl-atelier-footer__glow" aria-hidden="true" />
        <div className="container-custom fbl-atelier-footer__container">
          <div className="fbl-atelier-footer__masthead">
            <span className="fbl-atelier-footer__masthead-brand">FATEMEH BEAUTY LAND</span>
            <span className="fbl-atelier-footer__masthead-note">A MORE CONSIDERED BEAUTY JOURNEY</span>
          </div>

          <section className="fbl-atelier-footer__hero" aria-label="معرفی فاطمه بیوتی لند">
            <div className="fbl-atelier-footer__hero-copy">
              <span className="fbl-atelier-footer__eyebrow"><i aria-hidden="true" /> BEAUTY, WITH INTENTION</span>
              <h2 id="fbl-atelier-title">مراقبت، از انتخابی آگاهانه آغاز می‌شود.</h2>
              <p>برای شناخت بهتر محصولات، مقایسه‌ی جزئیات و انتخابی متناسب با نیازهای روزمره‌ی خود، همراه شما هستیم.</p>
              <Link href="/products" className="fbl-atelier-footer__discover">
                <span>ورود به دنیای محصولات</span>
                <ArrowUpLeft size={17} strokeWidth={1.8} aria-hidden="true" />
              </Link>
            </div>

            <div className="fbl-atelier-footer__seal" aria-hidden="true">
              <span className="fbl-atelier-footer__seal-orbit fbl-atelier-footer__seal-orbit--one" />
              <span className="fbl-atelier-footer__seal-orbit fbl-atelier-footer__seal-orbit--two" />
              <span className="fbl-atelier-footer__seal-word fbl-atelier-footer__seal-word--top">FATEMEH BEAUTY LAND</span>
              <span className="fbl-atelier-footer__seal-mark">
                <Image src="/logo.png" alt="" fill sizes="112px" className="fbl-atelier-footer__logo-image" />
              </span>
              <span className="fbl-atelier-footer__seal-word fbl-atelier-footer__seal-word--bottom">CARE · BEAUTY · YOU</span>
            </div>
          </section>

          <div className="fbl-atelier-footer__divider" />

          <div className="fbl-atelier-footer__main">
            <section className="fbl-atelier-footer__brand" aria-label="درباره فاطمه بیوتی لند">
              <Link href="/" className="fbl-atelier-footer__brand-lockup" aria-label="فاطمه بیوتی لند، صفحه اصلی">
                <span className="fbl-atelier-footer__brand-logo">
                  <Image src="/logo.png" alt="نشان فاطمه بیوتی لند" fill sizes="48px" className="fbl-atelier-footer__logo-image" />
                </span>
                <span className="fbl-atelier-footer__brand-name">
                  <strong>فاطمه بیوتی لند</strong>
                  <small>FATEMEH BEAUTY LAND</small>
                </span>
              </Link>
              <p>دنیایی برای بررسی آگاهانه‌ی محصولات آرایشی و مراقبتی؛ با تمرکز بر اطلاعات روشن و انتخاب متناسب با نیاز شما.</p>
              <span className="fbl-atelier-footer__brand-motto">مراقبت، با انتخابی آگاهانه</span>
            </section>

            <nav className="fbl-atelier-footer__nav" aria-label="لینک‌های فروشگاه">
              <h3>فروشگاه</h3>
              <ul>
                {storeLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}><span>{item.label}</span><ArrowLeft size={13} aria-hidden="true" /></Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="fbl-atelier-footer__nav" aria-label="راهنما و قوانین">
              <h3>راهنما و قوانین</h3>
              <ul>
                {guideLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}><span>{item.label}</span><ArrowLeft size={13} aria-hidden="true" /></Link>
                  </li>
                ))}
              </ul>
            </nav>

            <section className="fbl-atelier-footer__contact" aria-label="راه‌های ارتباطی">
              <h3>ارتباط با ما</h3>
              <a href="tel:09905316327" className="fbl-atelier-footer__contact-item">
                <span className="fbl-atelier-footer__contact-icon"><Phone size={16} aria-hidden="true" /></span>
                <span><small>تماس با فروشگاه</small><strong dir="ltr">۰۹۹۰۵۳۱۶۳۲۷</strong></span>
              </a>
              <a href="mailto:mirzaeico255@gmail.com" className="fbl-atelier-footer__contact-item">
                <span className="fbl-atelier-footer__contact-icon"><Mail size={16} aria-hidden="true" /></span>
                <span><small>رایانامه</small><strong dir="ltr">mirzaeico255@gmail.com</strong></span>
              </a>
              <div className="fbl-atelier-footer__contact-item fbl-atelier-footer__location">
                <span className="fbl-atelier-footer__contact-icon"><MapPin size={16} aria-hidden="true" /></span>
                <span><small>موقعیت</small><strong>تهران</strong></span>
              </div>
              <div className="fbl-atelier-footer__socials" aria-label="شبکه‌های اجتماعی">
                <a href="https://instagram.com/fatemeh_beauty_landd" target="_blank" rel="noopener noreferrer" aria-label="اینستاگرام فاطمه بیوتی لند">
                  <InstagramIcon size={18} /><span><strong>اینستاگرام</strong><small dir="ltr">@fatemeh_beauty_landd</small></span><ArrowUpLeft size={13} aria-hidden="true" />
                </a>
                <a href="https://rubika.ir/fatemeh_beauty_land" target="_blank" rel="noopener noreferrer" aria-label="روبیکای فاطمه بیوتی لند">
                  <RubikaIcon size={18} /><span><strong>روبیکا</strong><small dir="ltr">@fatemeh_beauty_land</small></span><ArrowUpLeft size={13} aria-hidden="true" />
                </a>
              </div>
            </section>
          </div>

          <div className="fbl-atelier-footer__trustbar">
            <div className="fbl-atelier-footer__payment">
              <span className="fbl-atelier-footer__trust-icon"><ShieldCheck size={20} aria-hidden="true" /></span>
              <span><strong>پرداخت از درگاه بانکی</strong><small><CreditCard size={13} aria-hidden="true" /> پرداخت سفارش از مسیر درگاه بانکی فروشگاه انجام می‌شود.</small></span>
            </div>
            <div className="fbl-atelier-footer__enamad">
              <span>نماد اعتماد الکترونیکی</span>
              <a referrerPolicy="origin" target="_blank" rel="noopener noreferrer" href="https://trustseal.enamad.ir/?id=8646028&Code=0k8tNe8JU0wOu1wOUF3YVI3faqSFyznQ" aria-label="مشاهده نماد اعتماد الکترونیکی فاطمه بیوتی لند">
                <img referrerPolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=8646028&Code=0k8tNe8JU0wOu1wOUF3YVI3faqSFyznQ" alt="نماد اعتماد الکترونیکی" />
              </a>
            </div>
          </div>

          <div className="fbl-atelier-footer__bottom">
            <p>© {year} فاطمه بیوتی لند. تمامی حقوق محفوظ است.</p>
            <div className="fbl-atelier-footer__legal">
              <Link href="/policies/privacy">حریم خصوصی</Link>
              <span aria-hidden="true" />
              <Link href="/policies/returns">شرایط مرجوعی</Link>
            </div>
            <span className="fbl-atelier-footer__signature">MADE FOR YOUR EVERYDAY RITUAL</span>
          </div>
        </div>
      </footer>
    </>
  );
}
