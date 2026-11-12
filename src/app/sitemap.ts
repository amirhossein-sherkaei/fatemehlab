import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { products, articles, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';

  // Static pages
  const staticRoutes = [
    '', '/about', '/products', '/journal', '/contact', '/faq', '/track',
    '/policies/privacy', '/policies/returns', '/policies/shipping',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic products
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const allProducts = await db
      .select({ slug: products.slug, updatedAt: products.updatedAt, mainImage: products.mainImage })
      .from(products)
      .where(eq(products.status, 'published'));

    productRoutes = allProducts.map((p) => ({
      url: `${baseUrl}/products/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
      images: p.mainImage ? [p.mainImage] : [],
    }));
  } catch (e) {
    console.error('Sitemap products error:', e);
  }

  // Dynamic articles
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const allArticles = await db
      .select({ slug: articles.slug, updatedAt: articles.updatedAt })
      .from(articles)
      .where(eq(articles.status, 'published'));

    articleRoutes = allArticles.map((a) => ({
      url: `${baseUrl}/journal/${a.slug}`,
      lastModified: a.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (e) {
    console.error('Sitemap articles error:', e);
  }

  // Dynamic categories
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const allCategories = await db.select({ slug: categories.slug }).from(categories);
    categoryRoutes = allCategories.map((c) => ({
      url: `${baseUrl}/products?category=${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (e) {
    console.error('Sitemap categories error:', e);
  }

  return [...staticRoutes, ...productRoutes, ...articleRoutes, ...categoryRoutes];
}