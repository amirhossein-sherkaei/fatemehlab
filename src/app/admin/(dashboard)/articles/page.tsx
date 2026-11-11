import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import ArticlesClient from './list';
import { desc } from 'drizzle-orm';
import AdminGuard from '@/components/admin/AdminGuard';


export const instant = false;

export default async function AdminArticlesPage() {
  return (
    <AdminGuard>
      <ArticlesContent />
    </AdminGuard>
  );
}

async function ArticlesContent() {
  const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));
  return <ArticlesClient initialArticles={allArticles} />;
}