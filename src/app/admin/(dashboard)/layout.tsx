import AdminLayoutClient from './admin-layout-client';

export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // 认证逻辑移至 proxy.ts，此处不再使用服务端 redirect 避免 441 错误
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}