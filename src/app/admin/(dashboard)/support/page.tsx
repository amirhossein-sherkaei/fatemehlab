import { Suspense } from 'react';
import AdminSupportClient from './admin-support-client';

export const instant = false;

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#c61d70]">در حال بارگذاری...</div>}>
      <AdminSupportClient />
    </Suspense>
  );
}