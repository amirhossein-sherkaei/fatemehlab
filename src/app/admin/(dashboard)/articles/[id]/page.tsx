import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import EditForm from './edit-form';


export const instant = false;

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AdminGuard>
      <ArticleContent params={params} />
    </AdminGuard>
  );
}

async function ArticleContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!article) notFound();
  return <EditForm article={article} />;
}