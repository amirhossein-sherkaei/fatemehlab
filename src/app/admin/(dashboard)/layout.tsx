import AdminLayoutClient from './admin-layout-client';

export const instant = false;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // امنیت کاملاً توسط فایل proxy.ts مدیریت می‌شود.
  // نیازی به redirect در اینجا نیست که باعث خطای 441 شود.
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}