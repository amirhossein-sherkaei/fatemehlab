import { Suspense } from 'react';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import EditForm from './edit-form';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری مقاله...</div>;
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!article) notFound();
  return <EditForm article={article} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <AdminGuard>
        <Content params={params} />
      </AdminGuard>
    </Suspense>
  );
}