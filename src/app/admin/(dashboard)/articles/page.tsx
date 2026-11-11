import { Suspense } from 'react';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import ArticlesClient from './list';
import { desc } from 'drizzle-orm';
import AdminGuard from '@/components/admin/AdminGuard';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری مجله...</div>;
}

async function Content() {
  const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));
  return <ArticlesClient initialArticles={allArticles} />;
}

export default function Page() {
  return <Suspense fallback={<Skeleton />}><AdminGuard><Content /></AdminGuard></Suspense>;
}