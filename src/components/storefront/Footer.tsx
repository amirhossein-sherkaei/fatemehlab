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
  Sparkles,
} from 'lucide-react';
import { InstagramIcon } from '@/components/icons/SocialIcons';
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
      <footer className="fbl-signature-footer-v3" aria-labelledby="fbl-signature-footer-title">
        <div className="fbl-signature-footer-v3__ambient" aria-hidden="true" />
        <div className="container-custom fbl-signature-footer-v3__inner">
          <section className="fbl-signature-footer-v3__hero">
            <div className="fbl-signature-footer-v3__hero-copy">
              <div className="fbl-signature-footer-v3__eyebrow">
                <span /> FATEMEH BEAUTY LAND <i /> THE ART OF CONSCIOUS CARE
              </div>
              <h2 id="fbl-signature-footer-title">زیبایی، در انتخابی آگاهانه معنا پیدا می‌کند.</h2>
              <p>جزئیات را بشناسید، با آرامش مقایسه کنید و محصولی متناسب با نیاز خود انتخاب کنید.</p>
              <div className="fbl-signature-footer-v3__hero-actions">
                <Link href="/products" className="fbl-signature-footer-v3__discover">
                  <span>کشف مجموعه محصولات</span>
                  <ArrowUpLeft size={17} strokeWidth={1.8} aria-hidden="true" />
                </Link>
                <span className="fbl-signature-footer-v3__hero-note"><Sparkles size={14} aria-hidden="true" /> همراه شما در انتخابی آگاهانه</span>
              </div>
            </div>
            <div className="fbl-signature-footer-v3__seal" role="img" aria-label="نشان فاطمه بیوتی لند">
              <span className="fbl-signature-footer-v3__seal-orbit fbl-signature-footer-v3__seal-orbit--one" />
              <span className="fbl-signature-footer-v3__seal-orbit fbl-signature-footer-v3__seal-orbit--two" />
              <span className="fbl-signature-footer-v3__seal-core">
                <Image src="/logo.png" alt="نشان فاطمه بیوتی لند" fill sizes="104px" className="fbl-signature-footer-v3__seal-image" />
              </span>
              <span className="fbl-signature-footer-v3__seal-caption">CARE · BEAUTY · YOU</span>
            </div>
          </section>

          <div className="fbl-signature-footer-v3__separator">
            <span /> <small>FATEMEH BEAUTY LAND</small> <span />
          </div>

          <div className="fbl-signature-footer-v3__main-grid">
            <section className="fbl-signature-footer-v3__about" aria-label="درباره فاطمه بیوتی لند">
              <span className="fbl-signature-footer-v3__section-kicker">OUR WORLD</span>
              <h3>فاطمه بیوتی لند</h3>
              <p>فضایی برای آشنایی دقیق‌تر با محصولات آرایشی و مراقبتی؛ با اطلاعات روشن و انتخابی متناسب با نیاز شما.</p>
              <div className="fbl-signature-footer-v3__motto"><span /> مراقبت، با انتخابی آگاهانه</div>
            </section>

            <nav className="fbl-signature-footer-v3__nav" aria-label="دسترسی به فروشگاه">
              <span className="fbl-signature-footer-v3__section-kicker">DISCOVER</span>
              <h3>فروشگاه</h3>
              <ul>
                {storeLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}><span>{item.label}</span><ArrowLeft size={13} aria-hidden="true" /></Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav className="fbl-signature-footer-v3__nav" aria-label="راهنما و پشتیبانی مشتریان">
              <span className="fbl-signature-footer-v3__section-kicker">HERE TO HELP</span>
              <h3>راهنما و پشتیبانی</h3>
              <ul>
                {helpLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}><span>{item.label}</span><ArrowLeft size={13} aria-hidden="true" /></Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <section className="fbl-signature-footer-v3__contact-band" aria-labelledby="fbl-signature-contact-title">
            <div className="fbl-signature-footer-v3__contact-intro">
              <span className="fbl-signature-footer-v3__section-kicker">LET’S CONNECT</span>
              <h3 id="fbl-signature-contact-title">ارتباط با ما، ساده و مستقیم</h3>
              <p>برای پرسش، راهنمایی و پیگیری سفارش از راه‌های زیر با ما در ارتباط باشید.</p>
              <span className="fbl-signature-footer-v3__location"><MapPin size={14} aria-hidden="true" /> تهران، ایران</span>
            </div>

            <div className="fbl-signature-footer-v3__contact-methods">
              <a href="tel:09905316327" className="fbl-signature-footer-v3__contact-card">
                <span className="fbl-signature-footer-v3__contact-icon"><Phone size={18} aria-hidden="true" /></span>
                <span className="fbl-signature-footer-v3__contact-copy">
                  <small>تماس با فروشگاه</small>
                  <strong dir="ltr">۰۹۹۰۵۳۱۶۳۲۷</strong>
                  <em>تماس مستقیم <ArrowUpLeft size={12} aria-hidden="true" /></em>
                </span>
              </a>
              <a href="mailto:mirzaeico255@gmail.com" className="fbl-signature-footer-v3__contact-card">
                <span className="fbl-signature-footer-v3__contact-icon"><Mail size={18} aria-hidden="true" /></span>
                <span className="fbl-signature-footer-v3__contact-copy">
                  <small>رایانامه فروشگاه</small>
                  <strong dir="ltr">mirzaeico255@gmail.com</strong>
                  <em>ارسال پیام <ArrowUpLeft size={12} aria-hidden="true" /></em>
                </span>
              </a>
            </div>

            <div className="fbl-signature-footer-v3__social-area">
              <span className="fbl-signature-footer-v3__section-kicker">FOLLOW OUR WORLD</span>
              <div className="fbl-signature-footer-v3__social-cards">
                <a href="https://instagram.com/fatemeh_beauty_landd" target="_blank" rel="noopener noreferrer" aria-label="اینستاگرام فاطمه بیوتی لند" className="fbl-signature-footer-v3__social-card fbl-signature-footer-v3__social-card--instagram">
                  <span className="fbl-signature-footer-v3__social-mark fbl-signature-footer-v3__social-mark--instagram"><InstagramIcon size={23} /></span>
                  <span className="fbl-signature-footer-v3__social-copy"><strong>اینستاگرام</strong><small dir="ltr">@fatemeh_beauty_landd</small></span>
                  <ArrowUpLeft size={15} aria-hidden="true" />
                </a>
                <a href="https://rubika.ir/fatemeh_beauty_land" target="_blank" rel="noopener noreferrer" aria-label="روبیکای فاطمه بیوتی لند" className="fbl-signature-footer-v3__social-card fbl-signature-footer-v3__social-card--rubika">
                  <span className="fbl-signature-footer-v3__social-mark fbl-signature-footer-v3__social-mark--rubika">
                    <Image src="/rubika-icon.png" alt="" width={30} height={30} className="fbl-signature-footer-v3__rubika-image" />
                  </span>
                  <span className="fbl-signature-footer-v3__social-copy"><strong>روبیکا</strong><small dir="ltr">@fatemeh_beauty_land</small></span>
                  <ArrowUpLeft size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          </section>

          <div className="fbl-signature-footer-v3__assurance">
            <div className="fbl-signature-footer-v3__assurance-copy">
              <span className="fbl-signature-footer-v3__assurance-icon"><ShieldCheck size={21} aria-hidden="true" /></span>
              <span><strong>مسیر پرداخت سفارش</strong><small><CreditCard size={13} aria-hidden="true" /> پرداخت سفارش از مسیر درگاه بانکی فروشگاه انجام می‌شود.</small></span>
            </div>
            <div className="fbl-signature-footer-v3__certificate">
              <span>نماد اعتماد الکترونیکی</span>
              <a referrerPolicy="origin" target="_blank" rel="noopener noreferrer" href="https://trustseal.enamad.ir/?id=8646028&Code=0k8tNe8JU0wOu1wOUF3YVI3faqSFyznQ" aria-label="مشاهده نماد اعتماد الکترونیکی فاطمه بیوتی لند">
                <img referrerPolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=8646028&Code=0k8tNe8JU0wOu1wOUF3YVI3faqSFyznQ" alt="نماد اعتماد الکترونیکی" />
              </a>
            </div>
          </div>

          <div className="fbl-signature-footer-v3__bottom">
            <p>© {year} فاطمه بیوتی لند. تمامی حقوق محفوظ است.</p>
            <div className="fbl-signature-footer-v3__bottom-links">
              <Link href="/policies/privacy">حریم خصوصی</Link>
              <span />
              <Link href="/policies/returns">شرایط مرجوعی</Link>
            </div>
            <span className="fbl-signature-footer-v3__signature">MADE FOR YOUR BEAUTY JOURNEY</span>
          </div>
        </div>
      </footer>
    </>
  );
}