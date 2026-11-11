import { Suspense } from 'react';
import AdminLayoutClient from './admin-layout-client';

export const instant = false;

// 用于给客户端组件加载时的占位符
function LayoutFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafc]">
      <div className="w-10 h-10 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LayoutFallback />}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </Suspense>
  );
}