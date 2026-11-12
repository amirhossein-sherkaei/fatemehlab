import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpLeft, BookOpen, Clock, Sparkles, Filter } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';


export const metadata = {
  title: 'مجله فاطمه بیوتی لند | آموزش آرایش، مراقبت پوست و مو',
  description: 'جدیدترین مقالات آموزشی، راهنمای خرید محصولات آرایشی، مراقبت از پوست و مو را در مجله فاطمه بیوتی لند بخوانید.',
  keywords: ['مجله زیبایی', 'آموزش آرایش', 'مراقبت پوست', 'مراقبت مو', 'راهنمای خرید لوازم آرایشی'],
  alternates: { canonical: '/journal' },
  openGraph: {
    title: 'مجله فاطمه بیوتی لند',
    description: 'آموزش آرایش، مراقبت پوست و مو',
    type: 'website',
    locale: 'fa_IR',
  },
};

const categoryLabels: Record<string, string> = {
  education: 'آموزش',
  'buying-guide': 'راهنمای خرید',
  skincare: 'مراقبت پوست',
  haircare: 'مراقبت مو',
  makeup: 'آرایشی',
};

export const instant = false;

export default async function JournalPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string }> 
}) {
  const { category } = await searchParams;
  const activeCategory = category && categoryLabels[category] ? category : null;

  // ساخت کوئری
  const conditions = [eq(articles.status, 'published')];
  if (activeCategory) {
    conditions.push(eq(articles.category, activeCategory));
  }
  const whereClause = and(...conditions)!;

  const allArticles = await db
    .select()
    .from(articles)
    .where(whereClause)
    .orderBy(desc(articles.createdAt));

  const featured = !activeCategory ? (allArticles.find(a => a.featured) || allArticles[0]) : null;
  const rest = featured ? allArticles.filter(a => a.id !== featured.id) : allArticles;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc]">
      <Header />
      
      {/* pb-32 برای جلوگیری از تداخل با نوار پایین (BottomNav) */}
      <main className="flex-1 pb-32 md:pb-12 overflow-x-hidden">
        
        {/* هدر مجله */}
        <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden bg-gradient-to-b from-[#fff0f7] to-[#fafafc] px-4">
          <div className="container-custom relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#f2d7e5] text-[#c61d70] text-[10px] md:text-xs font-bold shadow-sm mb-4 md:mb-6">
              <Sparkles size={14} /> مجله اختصاصی فاطمه بیوتی لند
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#28242b] mb-4 md:mb-6 tracking-tight leading-tight">
              دنیای زیبایی<br className="md:hidden"/>
              <span className="text-[#c61d70]"> و مراقبت</span>
            </h1>
            <p className="text-[#77717b] text-xs md:text-base lg:text-lg max-w-xl mx-auto leading-relaxed px-2">
              جدیدترین مقالات، آموزش‌ها و راهنمای خرید محصولات آرایشی و بهداشتی را از زبان متخصصان بخوانید.
            </p>
          </div>
        </section>

        <section className="container-custom py-8 md:py-12 px-4 md:px-6">
          
          {/* فیلتر دسته‌بندی - اصلاح شده برای موبایل */}
          <div className="relative mb-10 w-full overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide snap-x pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
              <div className="hidden md:flex items-center gap-2 text-[#c61d70] font-bold text-sm pl-2 shrink-0">
                <Filter size={16} /> فیلتر:
              </div>
              
              <Link href="/journal" className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all border ${!activeCategory ? 'bg-[#28242b] text-white border-[#28242b] shadow-md' : 'bg-white text-[#77717b] border-[#e9e5eb] hover:border-[#c61d70] hover:text-[#c61d70]'}`}>
                همه
              </Link>
              
              {Object.entries(categoryLabels).map(([key, label]) => (
                <Link 
                  key={key} 
                  href={`/journal?category=${key}`} 
                  className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all border ${activeCategory === key ? 'bg-[#c61d70] text-white border-[#c61d70] shadow-md shadow-[#c61d70]/20' : 'bg-white text-[#77717b] border-[#e9e5eb] hover:border-[#c61d70] hover:text-[#c61d70]'}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* حالت خالی */}
          {allArticles.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 bg-[#fff0f7] rounded-full flex items-center justify-center mx-auto mb-6 text-[#c61d70]">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-black text-[#28242b] mb-2">مقاله‌ای یافت نشد</h3>
              <p className="text-[#77717b] text-sm">در این دسته‌بندی هنوز مقاله‌ای منتشر نشده است.</p>
              <Link href="/journal" className="inline-block mt-6 px-6 py-2.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl">مشاهده همه مقالات</Link>
            </div>
          )}

          {/* مقاله ویژه */}
          {featured && (
            <Link href={`/journal/${featured.slug}`} className="group relative block w-full rounded-2xl md:rounded-[2rem] overflow-hidden mb-12 md:mb-20 shadow-xl shadow-[#c61d70]/5 bg-white border border-[#f2d7e5] flex flex-col md:flex-row">
              
              {/* تصویر */}
              <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[400px] bg-[#fce5f0] overflow-hidden">
                {featured.coverImage ? (
                  <Image src={featured.coverImage} alt={featured.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#c61d70]/30"><BookOpen size={64} /></div>
                )}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-black text-[#c61d70] shadow-lg flex items-center gap-1 md:gap-2">
                  <Sparkles size={12} className="md:w-3.5 md:h-3.5" /> مقاله ویژه
                </div>
              </div>

              {/* محتوا */}
              <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-14 flex flex-col justify-center bg-white">
                <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-[#77717b] mb-3 md:mb-6">
                  <span className="text-[#c61d70] font-black bg-[#fff0f7] px-2 py-1 md:px-3 md:py-1 rounded-md">{categoryLabels[featured.category] || featured.category}</span>
                  <span className="flex items-center gap-1 md:gap-1.5"><Clock size={12} className="md:w-4 md:h-4" /> {featured.readTime}</span>
                </div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-[#28242b] mb-3 md:mb-6 leading-[1.4] md:leading-[1.3] group-hover:text-[#c61d70] transition-colors line-clamp-3">
                  {featured.title}
                </h2>
                <p className="text-[#77717b] text-xs md:text-sm lg:text-base leading-loose line-clamp-3 mb-6 md:mb-10">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs md:text-sm font-black text-[#c61d70] bg-[#fff0f7] w-fit px-4 py-2 md:px-6 md:py-3 rounded-xl transition-all group-hover:bg-[#c61d70] group-hover:text-white mt-auto">
                  خواندن مقاله <ArrowUpLeft size={16} className="md:w-[18px] md:h-[18px] transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </Link>
          )}

          {/* گرید مقالات */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {rest.map((article) => (
                <Link key={article.id} href={`/journal/${article.slug}`} className="group flex flex-col bg-transparent">
                  <div className="relative aspect-[4/3] md:aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-5 bg-[#fafafc] border border-[#e9e5eb] shadow-sm">
                    {article.coverImage ? (
                      <Image src={article.coverImage} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#c61d70]/20"><BookOpen size={32} /></div>
                    )}
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-[9px] md:text-[10px] font-black text-[#c61d70] shadow-sm">
                      {categoryLabels[article.category] || article.category}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col px-1">
                    <h3 className="text-base md:text-lg font-black text-[#28242b] mb-2 leading-[1.6] group-hover:text-[#c61d70] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-[#77717b] text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#e9e5eb] text-[10px] text-[#918a95] font-bold">
                      <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                      <span>{formatPersianDate(article.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </section>
      </main>
      <Footer />
    </div>
  );
}