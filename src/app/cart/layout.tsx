import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سبد خرید | فاطمه بیوتی لند',
  description: 'محصولات انتخابی خود را در سبد خرید فاطمه بیوتی لند بررسی و سفارش خود را نهایی کنید.',
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}