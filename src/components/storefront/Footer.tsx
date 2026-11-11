'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowUpLeft, Mail, Phone, MapPin } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/SocialIcons';

export default function Footer() {
  const [year, setYear] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear().toLocaleString('fa-IR', { useGrouping: false }));
  }, []);

  return (
    <footer className="fl-footer">
      <div className="container-custom fl-footer-main">
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
            فاطمه بیوتی لند؛ جایی که زیبایی، با آگاهی آغاز می‌شود.
          </p>
          <Link href="/products" className="fl-text-link mt-4">
            مرور محصولات <ArrowUpLeft size={15} />
          </Link>

          <div className="mt-5 space-y-2">
            <a href="tel:09905316327" className="flex items-center gap-2 text-[11px] text-[#77717b] hover:text-[#c61d70] transition-colors group">
              <Phone size={13} className="shrink-0" />
              <span dir="ltr">۰۹۹۰۵۳۱۶۳۲۷</span>
            </a>
            <a href="mailto:mirzaeico255@gmail.com" className="flex items-center gap-2 text-[11px] text-[#77717b] hover:text-[#c61d70] transition-colors group">
              <Mail size={13} className="shrink-0" />
              <span dir="ltr">mirzaeico255@gmail.com</span>
            </a>
            <a
              href="https://instagram.com/fatemehlab.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[11px] text-[#77717b] hover:text-[#c61d70] transition-all duration-300 group"
            >
              <InstagramIcon size={14} className="shrink-0 transition-transform duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_8px_rgba(198,29,112,0.4)]" />
              <span dir="ltr">@fatemehlab.ir</span>
            </a>
            <span className="flex items-center gap-2 text-[11px] text-[#77717b]">
              <MapPin size={13} className="shrink-0" />
              تهران
            </span>
          </div>
        </div>

        <div>
          <h2 className="fl-footer-title">فروشگاه</h2>
          <ul className="grid gap-3">
            <li><Link className="fl-footer-link" href="/products">همه محصولات</Link></li>
            <li><Link className="fl-footer-link" href="/cart">سبد خرید</Link></li>
            <li><Link className="fl-footer-link" href="/track">رهگیری سفارش</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="fl-footer-title">راهنما و اطلاعات</h2>
          <ul className="grid gap-3">
            <li><Link className="fl-footer-link" href="/about">درباره فاطمه بیوتی لند</Link></li>
            <li><Link className="fl-footer-link" href="/journal">مجله فاطمه بیوتی لند</Link></li>
            <li><Link className="fl-footer-link" href="/faq">سؤالات متداول</Link></li>
            <li><Link className="fl-footer-link" href="/contact">تماس با ما</Link></li>
          </ul>
        </div>
      </div>

      <div className="container-custom fl-footer-bottom">
        <p>© {year} فاطمه بیوتی لند. تمامی حقوق محفوظ است.</p>
        <p className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#c61d70]" />
          مراقبت، با انتخابی آگاهانه
        </p>
      </div>
    </footer>
  );
}