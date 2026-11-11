import { Suspense } from 'react';
import AdminLayoutClient from './admin-layout-client';

export const instant = false;

function LayoutSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafc]">
      <div className="w-10 h-10 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <AdminLayoutClient>
        <Suspense fallback={<PageSkeleton />}>
          {children}
        </Suspense>
      </AdminLayoutClient>
    </Suspense>
  );
}