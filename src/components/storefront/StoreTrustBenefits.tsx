import Link from 'next/link';
import { ArrowUpLeft, BadgeCheck, CreditCard, Headset, PackageCheck } from 'lucide-react';

const benefits = [
  {
    icon: BadgeCheck,
    index: '01',
    title: 'اطلاعات روشن محصول',
    description: 'مشخصات و موجودی را پیش از خرید بررسی کنید.',
    href: '/products',
    action: 'مشاهده محصولات',
  },
  {
    icon: CreditCard,
    index: '02',
    title: 'پرداخت از درگاه بانکی',
    description: 'پرداخت سفارش از مسیر درگاه بانکی فروشگاه.',
    href: '/faq',
    action: 'راهنمای خرید',
  },
  {
    icon: PackageCheck,
    index: '03',
    title: 'پیگیری سفارش',
    description: 'وضعیت سفارش را پس از ثبت دنبال کنید.',
    href: '/track',
    action: 'رهگیری سفارش',
  },
  {
    icon: Headset,
    index: '04',
    title: 'پشتیبانی و ارتباط',
    description: 'برای پرسش و پیگیری با ما در ارتباط باشید.',
    href: '/contact',
    action: 'تماس با ما',
  },
];

export default function StoreTrustBenefits() {
  return (
    <section className="fbl-atelier-benefits" aria-labelledby="fbl-atelier-benefits-title">
      <div className="container-custom fbl-atelier-benefits__inner">
        <div className="fbl-atelier-benefits__heading">
          <span>THE DETAILS THAT MATTER</span>
          <h2 id="fbl-atelier-benefits-title">از انتخاب تا پیگیری، همراه شما</h2>
        </div>
        <div className="fbl-atelier-benefits__grid">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Link href={benefit.href} className="fbl-atelier-benefits__item" key={benefit.index}>
                <span className="fbl-atelier-benefits__number">{benefit.index}</span>
                <span className="fbl-atelier-benefits__icon" aria-hidden="true"><Icon size={21} strokeWidth={1.65} /></span>
                <span className="fbl-atelier-benefits__copy">
                  <strong>{benefit.title}</strong>
                  <small>{benefit.description}</small>
                  <em>{benefit.action}<ArrowUpLeft size={12} aria-hidden="true" /></em>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
