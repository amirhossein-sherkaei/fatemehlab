'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowUpLeft, Mail, Phone, MapPin } from 'lucide-react';
import { InstagramIcon, RubikaIcon } from '@/components/icons/SocialIcons';
import StoreTrustBenefits from '@/components/storefront/StoreTrustBenefits';

export default function Footer() {
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear().toLocaleString('fa-IR', { useGrouping: false }));
  }, []);

  return (
    <>
      <StoreTrustBenefits />
      <footer className="fl-footer fl-footer-premium">
        <div className="container-custom fl-footer-main fl-footer-grid">
          <div className="fl-footer-brand">
            <Link href="/" className="fl-brand w-fit">
              <span className="fl-brand-mark">
                <Image src="/logo.png" alt="نشان فاطمه بیوتی لند" fill sizes="39px" />
              </span>
              <span className="flex flex-col">
                <span className="fl-brand-name">فاطمه بیوتی لند</span>
                <span className="fl-brand-latin">FATEMEH BEAUTY LAND</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-[12px] leading-[2.1] text-[#77717b]">
              فاطمه بیوتی لند؛ جایی برای بررسی آگاهانه محصولات آرایشی و مراقبتی و انتخاب متناسب با نیاز شما.
            </p>

            <Link href="/products" className="fl-text-link mt-4">
              مرور محصولات <ArrowUpLeft size={15} />
            </Link>

            <div className="fl-footer-contact mt-5">
              <a href="tel:09905316327" className="fl-footer-contact-link">
                <Phone size={14} />
                <span dir="ltr">۰۹۹۰۵۳۱۶۳۲۷</span>
              </a>
              <a href="mailto:mirzaeico255@gmail.com" className="fl-footer-contact-link">
                <Mail size={14} />
                <span dir="ltr">mirzaeico255@gmail.com</span>
              </a>
              <span className="fl-footer-contact-link">
                <MapPin size={14} />
                <span>تهران</span>
              </span>
            </div>
          </div>

          <div className="fl-footer-column">
            <h2 className="fl-footer-title">فروشگاه</h2>
            <ul className="grid gap-3">
              <li><Link className="fl-footer-link" href="/products">همه محصولات</Link></li>
              <li><Link className="fl-footer-link" href="/cart">سبد خرید</Link></li>
              <li><Link className="fl-footer-link" href="/track">رهگیری سفارش</Link></li>
              <li><Link className="fl-footer-link" href="/journal">مجله زیبایی</Link></li>
            </ul>
          </div>

          <div className="fl-footer-column">
            <h2 className="fl-footer-title">راهنما و قوانین</h2>
            <ul className="grid gap-3">
              <li><Link className="fl-footer-link" href="/about">درباره ما</Link></li>
              <li><Link className="fl-footer-link" href="/contact">تماس با ما</Link></li>
              <li><Link className="fl-footer-link" href="/faq">سؤالات متداول</Link></li>
              <li><Link className="fl-footer-link" href="/policies/shipping">روش‌های ارسال</Link></li>
              <li><Link className="fl-footer-link" href="/policies/returns">شرایط مرجوعی</Link></li>
              <li><Link className="fl-footer-link" href="/policies/privacy">حریم خصوصی</Link></li>
            </ul>
          </div>

          <div className="fl-footer-social">
            <h2 className="fl-footer-title">همراه ما باشید</h2>
            <p className="fl-footer-social-note">برای دیدن تازه‌ها و اطلاعیه‌های فروشگاه، ما را در شبکه‌های اجتماعی دنبال کنید.</p>
            <div className="fl-footer-social-links">
              <a
                href="https://instagram.com/fatemeh_beauty_landd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="صفحه اینستاگرام فاطمه بیوتی لند"
                className="fl-footer-social-link"
              >
                <span className="fl-footer-social-mark fl-footer-social-instagram"><InstagramIcon size={21} /></span>
                <span className="fl-footer-social-label"><strong>اینستاگرام</strong><small dir="ltr">@fatemeh_beauty_landd</small></span>
                <ArrowUpLeft size={15} />
              </a>
              <a
                href="https://rubika.ir/fatemeh_beauty_land"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="صفحه روبیکای فاطمه بیوتی لند"
                className="fl-footer-social-link"
              >
                <span className="fl-footer-social-mark fl-footer-social-rubika"><RubikaIcon size={21} /></span>
                <span className="fl-footer-social-label"><strong>روبیکا</strong><small dir="ltr">@fatemeh_beauty_land</small></span>
                <ArrowUpLeft size={15} />
              </a>
            </div>
          </div>
        </div>

        <div className="container-custom fl-footer-bottom fl-footer-bottom-premium">
          <div className="fl-footer-copyright">
            <p>© {year} فاطمه بیوتی لند. تمامی حقوق محفوظ است.</p>
            <p className="fl-footer-tagline"><span /> مراقبت، با انتخابی آگاهانه</p>
          </div>
          <div className="fl-footer-enamad">
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
      </footer>
    </>
  );
}