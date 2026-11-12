import { Suspense } from 'react';
import StockNotifyClient from './client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b] text-sm">در حال بارگذاری اعلان‌ها...</div>;
}

export default function AdminStockNotifyPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <StockNotifyClient />
    </Suspense>
  );
}