import { Suspense } from 'react';
import CustomersClient from './customers-client';

export const instant = false;

export default function Page() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#c61d70]">در حال بارگذاری مشتریان...</div>}>
      <CustomersClient />
    </Suspense>
  );
}