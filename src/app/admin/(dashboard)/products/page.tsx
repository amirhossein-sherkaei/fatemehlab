import { db } from '@/lib/db';
import { products } from '@/db/schema';
import ProductsPage from './list';
import { desc } from 'drizzle-orm';
import AdminGuard from '@/components/admin/AdminGuard';

export const instant = false;


export default async function AdminProductsPage() {
  return (
    <AdminGuard>
      <ProductsContent />
    </AdminGuard>
  );
}

async function ProductsContent() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
  return <ProductsPage initialProducts={allProducts} />;
}