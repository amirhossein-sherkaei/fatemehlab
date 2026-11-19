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

const helpLinks = [
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
      <footer className="fbl-lux-footer" aria-labelledby="fbl-lux-footer-title">
        <div className="fbl-lux-footer__ambient" aria-hidden="true" />
        <div className="container-custom fbl-lux-footer__inner">
          <div className="fbl-lux-footer__intro">
            <div className="fbl-lux-footer__intro-copy">
              <span className="fbl-lux-footer__eyebrow">FATEMEH BEAUTY LAND <i /> BEAUTY WITH INTENTION</span>
              <h2 id="fbl-lux-footer-title">زیبایی، از انتخابی آگاهانه آغاز می‌شود.</h2>
              <p>جزئیات محصولات را ببینید، آگاهانه مقایسه کنید و متناسب با نیازتان انتخاب کنید.</p>
            </div>
            <Link href="/products" className="fbl-lux-footer__discover">
              <span>کشف محصولات</span>
              <ArrowUpLeft size={17} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>

          <div className="fbl-lux-footer__rule" />

          <div className="fbl-lux-footer__grid">
            <section className="fbl-lux-footer__brand" aria-label="معرفی فاطمه بیوتی لند">
              <Link href="/" className="fbl-lux-footer__brand-lockup" aria-label="فاطمه بیوتی لند، صفحه اصلی">
                <span className="fbl-lux-footer__brand-seal">
                  <Image
                    src="/logo.png"
                    alt="نشان فاطمه بیوتی لند"
                    fill
                    sizes="58px"
                    className="fbl-lux-footer__brand-image"
                  />
                </span>
                <span className="fbl-lux-footer__brand-words">
                  <strong>فاطمه بیوتی لند</strong>
                  <small>FATEMEH BEAUTY LAND</small>
                </span>
              </Link>

              <p className="fbl-lux-footer__description">
                فاطمه بیوتی لند؛ جایی برای بررسی آگاهانه محصولات آرایشی و مراقبتی و انتخاب متناسب با نیاز شما.
              </p>
              <div className="fbl-lux-footer__brand-note">
                <span aria-hidden="true" />
                <span>مراقبت، با انتخابی آگاهانه</span>
              </div>
            </section>

            <nav className="fbl-lux-footer__nav" aria-label="دسترسی به فروشگاه">
              <h3 className="fbl-lux-footer__heading">فروشگاه</h3>
              <ul>
                {storeLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="fbl-lux-footer__link">
                      <span>{item.label}</span>
                      <ArrowLeft size={13} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="fbl-lux-footer__nav" aria-label="راهنما و پشتیبانی مشتریان">
              <h3 className="fbl-lux-footer__heading">راهنما و پشتیبانی</h3>
              <ul>
                {helpLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="fbl-lux-footer__link">
                      <span>{item.label}</span>
                      <ArrowLeft size={13} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <section className="fbl-lux-footer__contact" aria-label="راه‌های ارتباطی">
              <h3 className="fbl-lux-footer__heading">با ما در ارتباط باشید</h3>
              <a href="tel:09905316327" className="fbl-lux-footer__contact-link">
                <span className="fbl-lux-footer__contact-icon"><Phone size={15} aria-hidden="true" /></span>
                <span><small>تماس با فروشگاه</small><strong dir="ltr">۰۹۹۰۵۳۱۶۳۲۷</strong></span>
              </a>
              <a href="mailto:mirzaeico255@gmail.com" className="fbl-lux-footer__contact-link">
                <span className="fbl-lux-footer__contact-icon"><Mail size={15} aria-hidden="true" /></span>
                <span><small>رایانامه</small><strong dir="ltr">mirzaeico255@gmail.com</strong></span>
              </a>
              <div className="fbl-lux-footer__contact-link fbl-lux-footer__location">
                <span className="fbl-lux-footer__contact-icon"><MapPin size={15} aria-hidden="true" /></span>
                <span><small>موقعیت</small><strong>تهران</strong></span>
              </div>

              <div className="fbl-lux-footer__socials" aria-label="شبکه‌های اجتماعی">
                <a
                  href="https://instagram.com/fatemeh_beauty_landd"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="اینستاگرام فاطمه بیوتی لند"
                  className="fbl-lux-footer__social-link"
                >
                  <InstagramIcon size={19} />
                  <span>اینستاگرام</span>
                  <ArrowUpLeft size={13} aria-hidden="true" />
                </a>
                <a
                  href="https://rubika.ir/fatemeh_beauty_land"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="روبیکای فاطمه بیوتی لند"
                  className="fbl-lux-footer__social-link"
                >
                  <RubikaIcon size={19} />
                  <span>روبیکا</span>
                  <ArrowUpLeft size={13} aria-hidden="true" />
                </a>
              </div>
            </section>
          </div>

          <div className="fbl-lux-footer__assurance">
            <div className="fbl-lux-footer__assurance-copy">
              <span className="fbl-lux-footer__assurance-icon"><ShieldCheck size={20} aria-hidden="true" /></span>
              <span>
                <strong>خریدی روشن از انتخاب تا پرداخت</strong>
                <small><CreditCard size={13} aria-hidden="true" /> پرداخت سفارش از مسیر درگاه بانکی فروشگاه انجام می‌شود.</small>
              </span>
            </div>
            <div className="fbl-lux-footer__certificate">
              <span>نماد اعتماد الکترونیکی</span>
              <a
                referrerPolicy="origin"
                target="_blank"
                rel="noopener noreferrer"
                href="https://trustseal.enamad.ir/?id=8646028&Code=0k8tNe8JU0wOu1wOUF3YVI3faqSFyznQ"
                aria-label="مشاهده نماد اعتماد الکترونیکی فاطمه بیوتی لند"
              >
                <img
                  referrerPolicy="origin"
                  src="https://trustseal.enamad.ir/logo.aspx?id=8646028&Code=0k8tNe8JU0wOu1wOUF3YVI3faqSFyznQ"
                  alt="نماد اعتماد الکترونیکی"
                />
              </a>
            </div>
          </div>

          <div className="fbl-lux-footer__bottom">
            <p>© {year} فاطمه بیوتی لند. تمامی حقوق محفوظ است.</p>
            <div className="fbl-lux-footer__bottom-links">
              <Link href="/policies/privacy">حریم خصوصی</Link>
              <span aria-hidden="true" />
              <Link href="/policies/returns">شرایط مرجوعی</Link>
            </div>
            <span className="fbl-lux-footer__signature">FATEMEH BEAUTY LAND</span>
          </div>
        </div>
      </footer>
    </>
  );
}