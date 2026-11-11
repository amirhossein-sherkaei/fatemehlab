import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import EditForm from './edit-form';

export const instant = false;

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (product.length === 0) return <div className="p-8 text-center text-rose">محصول یافت نشد</div>;
  return <EditForm product={product[0]} />;
}