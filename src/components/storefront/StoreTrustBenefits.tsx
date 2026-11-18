import Link from 'next/link';
import { BadgeCheck, CreditCard, PackageCheck, Headset, ArrowLeft } from 'lucide-react';

const benefits = [
  {
    icon: BadgeCheck,
    title: 'اطلاعات روشن محصول',
    description: 'مشخصات، تصاویر، قیمت و وضعیت موجودی را پیش از خرید بررسی کنید.',
    href: '/products',
    action: 'مشاهده محصولات',
  },
  {
    icon: CreditCard,
    title: 'پرداخت از درگاه بانکی',
    description: 'پرداخت سفارش از مسیر درگاه بانکی فروشگاه انجام می‌شود.',
    href: '/faq',
    action: 'راهنمای خرید',
  },
  {
    icon: PackageCheck,
    title: 'پیگیری سفارش',
    description: 'پس از ثبت سفارش، وضعیت آن را از صفحه رهگیری بررسی کنید.',
    href: '/track',
    action: 'رهگیری سفارش',
  },
  {
    icon: Headset,
    title: 'راه‌های ارتباطی مشخص',
    description: 'برای پرسش و پیگیری، از راه‌های ارتباطی فروشگاه استفاده کنید.',
    href: '/contact',
    action: 'تماس با ما',
  },
];

export default function StoreTrustBenefits() {
  return (
    <section className="container-custom fl-trust-section" aria-labelledby="fl-trust-title">
      <div className="fl-trust-heading">
        <span className="fl-section-kicker">SHOP WITH CONFIDENCE</span>
        <h2 id="fl-trust-title">خریدی آگاهانه، از انتخاب تا پیگیری</h2>
        <p>اطلاعات محصول را بررسی کنید، سفارش خود را ثبت کنید و مسیر پیگیری آن را در اختیار داشته باشید.</p>
      </div>

      <div className="fl-trust-grid">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <Link href={benefit.href} className="fl-trust-card" key={benefit.title}>
              <span className="fl-trust-icon" aria-hidden="true">
                <Icon size={21} strokeWidth={1.8} />
              </span>
              <span className="fl-trust-copy">
                <strong>{benefit.title}</strong>
                <span>{benefit.description}</span>
                <small>{benefit.action} <ArrowLeft size={12} /></small>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}