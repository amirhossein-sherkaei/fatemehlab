import { Suspense } from 'react';
import ClientContent from './content';

export const instant = false;

function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientContent />
    </Suspense>
  );
}