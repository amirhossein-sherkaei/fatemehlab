import { cacheTag } from 'next/cache';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getCachedPublishedProducts() {
  'use cache';
  cacheTag('products');
  return await db
    .select()
    .from(products)
    .where(eq(products.status, 'published'))
    .orderBy(desc(products.createdAt));
}