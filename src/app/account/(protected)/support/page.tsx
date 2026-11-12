import { Suspense } from 'react';
import SupportClient from './support-client';

export const instant = false;

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#c61d70]">در حال بارگذاری...</div>}>
      <SupportClient />
    </Suspense>
  );
}