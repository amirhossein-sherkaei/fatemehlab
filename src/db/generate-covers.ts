import { db } from '../lib/db';
import { articles } from './schema';
import { isNull, eq } from 'drizzle-orm';
import { generateArticleCover } from '../lib/ai-image';

async function generateAllCovers() {
  console.log('🎨 در حال تولید عکس برای مقالات بدون کاور...');
  
  // پیدا کردن مقالاتی که کاور ندارند
  const articlesWithoutCover = await db.select().from(articles).where(isNull(articles.coverImage));
  
  if (articlesWithoutCover.length === 0) {
    console.log('ℹ️ همه مقالات کاور دارند.');
    process.exit(0);
  }

  console.log(`📊 تعداد مقالات بدون کاور: ${articlesWithoutCover.length}`);

  for (const article of articlesWithoutCover) {
    try {
      console.log(`⏳ در حال ساخت عکس برای: ${article.title}`);
      const imageUrl = await generateArticleCover(article.title, article.category);
      
      // آپدیت دیتابیس
      await db.update(articles)
        .set({ coverImage: imageUrl, updatedAt: new Date() })
        .where(eq(articles.id, article.id));
        
      console.log(`✅ عکس ساخته شد: ${imageUrl}`);
      
      // کمی صبر بین درخواست‌ها برای جلوگیری از Rate Limit
      await new Promise(resolve => setTimeout(resolve, 3000));
      
    } catch (error) {
      console.error(`❌ خطا در تولید عکس برای ${article.title}:`, error);
    }
  }

  console.log('🎉 تولید عکس برای همه مقالات تمام شد!');
  process.exit(0);
}
generateAllCovers();