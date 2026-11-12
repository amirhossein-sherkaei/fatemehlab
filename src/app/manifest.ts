import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'فاطمه بیوتی لند | فروشگاه آرایشی و بهداشتی',
    short_name: 'فاطمه بیوتی لند',
    description: 'فروشگاه آنلاین محصولات آرایشی، بهداشتی و مراقبتی فاطمه بیوتی لند',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#c61d70',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable', // اصلاح شد (حذف any)
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}