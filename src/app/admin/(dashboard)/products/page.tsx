import { Suspense } from 'react';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import ProductsPage from './list';
import { desc } from 'drizzle-orm';
import AdminGuard from '@/components/admin/AdminGuard';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری محصولات...</div>;
}

async function Content() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
  return <ProductsPage initialProducts={allProducts} />;
}

export default function Page() {
  return <Suspense fallback={<Skeleton />}><AdminGuard><Content /></AdminGuard></Suspense>;
}