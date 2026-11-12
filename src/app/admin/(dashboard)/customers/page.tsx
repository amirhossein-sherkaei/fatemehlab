import { Suspense } from 'react';
import CustomersClient from './customers-client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b] text-sm">در حال بارگذاری لیست مشتریان...</div>;
}

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <CustomersClient />
    </Suspense>
  );
}