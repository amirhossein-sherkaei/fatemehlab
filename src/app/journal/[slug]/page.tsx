import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq, ne, and, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Calendar, User, BookOpen } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import ReadingProgress from './reading-progress';


const categoryLabels: Record<string, string> = {
  education: 'آموزش',
  'buying-guide': 'راهنمای خرید',
  skincare: 'مراقبت پوست',
  haircare: 'مراقبت مو',
  makeup: 'آرایشی',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  
  if (!article) return { title: 'مقاله یافت نشد' };
  
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
  };
}

export const instant = false;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const [article] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, 'published')))
    .limit(1);

  if (!article) notFound();

  const related = await db
    .select()
    .from(articles)
    .where(and(eq(articles.category, article.category), eq(articles.status, 'published'), ne(articles.id, article.id)))
    .orderBy(desc(articles.createdAt))
    .limit(3);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <ReadingProgress />
      <Header />
      
      <main className="flex-1 w-full max-w-[100vw]">
        {/* هدر مقاله */}
        <section className="pt-10 md:pt-16 pb-8 md:pb-12 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fff0f7] to-white">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/journal" className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black text-[#c61d70] bg-white shadow-sm border border-[#f2d7e5] px-4 py-1.5 md:px-5 md:py-2 rounded-full mb-6 md:mb-8 hover:bg-[#fff0f7] transition-colors">
              <ArrowRight size={14} className="md:w-4 md:h-4" /> بازگشت به مجله
            </Link>
            
            <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs mb-4 md:mb-8">
              <span className="text-[#c61d70] font-black bg-white shadow-sm border border-[#f2d7e5] px-3 py-1 md:px-4 md:py-1.5 rounded-lg">{categoryLabels[article.category] || article.category}</span>
            </div>

            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-[#28242b] leading-[1.5] md:leading-[1.4] mb-4 md:mb-8 tracking-tight px-2">
              {article.title}
            </h1>

            <p className="text-[#77717b] text-xs md:text-lg leading-loose mb-6 md:mb-10 max-w-2xl mx-auto px-4">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8 text-[10px] md:text-sm font-bold text-[#918a95] bg-white shadow-sm border border-[#f2d7e5] w-fit mx-auto px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl">
              <span className="flex items-center gap-1.5 md:gap-2"><User size={14} className="text-[#c61d70] md:w-[18px] md:h-[18px]" /> {article.author}</span>
              <span className="hidden md:block w-px h-6 bg-[#e9e5eb]" />
              <span className="flex items-center gap-1.5 md:gap-2"><Calendar size={14} className="text-[#c61d70] md:w-[18px] md:h-[18px]" /> {formatPersianDate(article.createdAt)}</span>
              <span className="hidden md:block w-px h-6 bg-[#e9e5eb]" />
              <span className="flex items-center gap-1.5 md:gap-2"><Clock size={14} className="text-[#c61d70] md:w-[18px] md:h-[18px]" /> {article.readTime}</span>
            </div>
          </div>
        </section>

        {/* تصویر کاور */}
        {article.coverImage && (
          <section className="px-3 md:px-4 -mt-4 md:-mt-8 relative z-10 mb-8 md:mb-16">
            <div className="max-w-5xl mx-auto relative aspect-video md:aspect-[21/9] rounded-xl md:rounded-[2rem] overflow-hidden shadow-xl md:shadow-2xl shadow-[#c61d70]/20 border-2 md:border-4 border-white">
              <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
            </div>
          </section>
        )}

        {/* محتوای مقاله */}
        <section className="px-4 md:px-6 pb-16 md:pb-24">
          <article 
            className="journal-article-body max-w-3xl mx-auto text-sm md:text-base"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </section>

        {/* مقالات مرتبط */}
        {related.length > 0 && (
          <section className="bg-[#fafafc] py-12 md:py-20 border-t border-[#e9e5eb]">
            <div className="container-custom px-4 md:px-6">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-[#28242b] mb-2 md:mb-3">مقالات مرتبط</h2>
                <p className="text-[#77717b] text-xs md:text-sm">شاید این مطالب هم برایتان جالب باشد</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {related.map(rel => (
                  <Link key={rel.id} href={`/journal/${rel.slug}`} className="group bg-white rounded-2xl md:rounded-3xl border border-[#e9e5eb] overflow-hidden hover:shadow-2xl hover:shadow-[#c61d70]/10 hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[16/10] md:aspect-[4/3] bg-[#fce5f0]">
                      {rel.coverImage ? (
                        <Image src={rel.coverImage} alt={rel.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#c61d70]/20"><BookOpen size={32} className="md:w-10 md:h-10" /></div>
                      )}
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="font-black text-sm md:text-base text-[#28242b] group-hover:text-[#c61d70] transition-colors line-clamp-2 leading-relaxed">{rel.title}</h3>
                      <div className="mt-3 md:mt-4 flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#c61d70]">
                        خواندن <ArrowRight size={12} className="md:w-3.5 md:h-3.5 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}