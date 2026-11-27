import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/track' },
  title: 'رهگیری سفارش',
  description: 'با کد رهگیری و شماره تماس، وضعیت دقیق سفارش خود را پیگیری کنید.',
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}