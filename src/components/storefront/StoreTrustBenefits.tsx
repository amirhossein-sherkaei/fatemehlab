import Link from 'next/link';
import { ArrowUpLeft, BadgeCheck, CreditCard, Headset, PackageCheck } from 'lucide-react';

const benefits = [
  {
    icon: BadgeCheck,
    title: 'اطلاعات روشن محصول',
    description: 'مشخصات و موجودی را پیش از خرید بررسی کنید.',
    href: '/products',
    action: 'مشاهده محصولات',
  },
  {
    icon: CreditCard,
    title: 'پرداخت از درگاه بانکی',
    description: 'پرداخت سفارش از مسیر درگاه بانکی فروشگاه.',
    href: '/faq',
    action: 'راهنمای خرید',
  },
  {
    icon: PackageCheck,
    title: 'پیگیری سفارش',
    description: 'وضعیت سفارش را پس از ثبت دنبال کنید.',
    href: '/track',
    action: 'رهگیری سفارش',
  },
  {
    icon: Headset,
    title: 'پشتیبانی و ارتباط',
    description: 'برای پرسش و پیگیری با ما در ارتباط باشید.',
    href: '/contact',
    action: 'تماس با ما',
  },
];

export default function StoreTrustBenefits() {
  return (
    <section className="container-custom fbl-lux-benefits" aria-labelledby="fbl-lux-benefits-title">
      <div className="fbl-lux-benefits__heading">
        <span>SHOP WITH CONFIDENCE</span>
        <h2 id="fbl-lux-benefits-title">همراه شما، در تمام مسیر خرید</h2>
      </div>
      <div className="fbl-lux-benefits__grid">
        {benefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <Link href={benefit.href} className="fbl-lux-benefits__item" key={benefit.title}>
              <span className="fbl-lux-benefits__icon" aria-hidden="true"><Icon size={20} strokeWidth={1.7} /></span>
              <span className="fbl-lux-benefits__copy">
                <strong>{benefit.title}</strong>
                <small>{benefit.description}</small>
                <em>{benefit.action}<ArrowUpLeft size={12} aria-hidden="true" /></em>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}