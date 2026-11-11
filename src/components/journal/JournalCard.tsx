import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';

type Article = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  categorySlug: string;
  readTime: string;
  publishedAt: string;
  coverImage?: string | null;
};

const categoryGradients: Record<string, string> = {
  education: 'from-[#FFF0F7] to-[#FCE5F0]',
  'buying-guide': 'from-[#EAF2E5] to-[#D5E2D0]',
  skincare: 'from-[#FCF0EB] to-[#F5DCCF]',
  haircare: 'from-[#F5EDE0] to-[#EBDCC4]',
  makeup: 'from-[#F5E8EC] to-[#EBD4DC]',
};

const categoryIcon: Record<string, string> = {
  education: '✦',
  'buying-guide': '◈',
  skincare: '❋',
  haircare: '❊',
  makeup: '✧',
};

/* ---------- Featured Article ---------- */
export function FeaturedCard({ article }: { article: Article }) {
  const gradient = categoryGradients[article.categorySlug] || 'from-[#FFF0F7] to-[#FCE5F0]';
  const icon = categoryIcon[article.categorySlug] || '✦';
  return (
    <Link href={`/journal/${article.slug}`} className="journal-featured group" aria-label={`مطالعه مقاله ${article.title}`}>
      <div className="journal-featured-visual">
        {article.coverImage ? (
          <div className="relative w-full h-full min-h-[300px] md:min-h-[480px] rounded-[24px] overflow-hidden">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
        ) : (
          <div className={`journal-featured-art bg-gradient-to-br ${gradient}`}>
            <span className="journal-featured-icon" aria-hidden="true">{icon}</span>
            <span className="journal-featured-brand">FATEMEH BEAUTY LAND</span>
          </div>
        )}
      </div>
      <div className="journal-featured-content">
        <span className="journal-category-tag">{article.category}</span>
        <h2 className="journal-featured-title">{article.title}</h2>
        <p className="journal-featured-excerpt">{article.excerpt}</p>
        <div className="journal-meta">
          <span>{article.publishedAt}</span>
          <span className="journal-meta-dot">•</span>
          <span className="inline-flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
        </div>
        <span className="journal-cta">مطالعه مقاله <ArrowLeft size={15} className="journal-cta-arrow" /></span>
      </div>
    </Link>
  );
}

/* ---------- Editor's Pick ---------- */
export function EditorsPickCard({ article }: { article: Article }) {
  const gradient = categoryGradients[article.categorySlug] || 'from-[#FFF0F7] to-[#FCE5F0]';
  const icon = categoryIcon[article.categorySlug] || '✦';
  return (
    <Link href={`/journal/${article.slug}`} className="journal-pick group" aria-label={`مطالعه مقاله ${article.title}`}>
      <div className="journal-pick-art relative overflow-hidden">
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="journal-pick-icon">{icon}</span>
          </div>
        )}
      </div>
      <div className="journal-pick-content">
        <span className="journal-category-tag">{article.category}</span>
        <h3 className="journal-pick-title">{article.title}</h3>
        <p className="journal-pick-excerpt">{article.excerpt}</p>
        <div className="journal-meta">
          <span>{article.publishedAt}</span>
          <span className="journal-meta-dot">•</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Standard Card ---------- */
export function StandardCard({ article }: { article: Article }) {
  const gradient = categoryGradients[article.categorySlug] || 'from-[#FFF0F7] to-[#FCE5F0]';
  const icon = categoryIcon[article.categorySlug] || '✦';
  return (
    <Link href={`/journal/${article.slug}`} className="journal-card group" aria-label={`مطالعه مقاله ${article.title}`}>
      <div className="journal-card-art relative overflow-hidden">
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="journal-card-icon">{icon}</span>
          </div>
        )}
      </div>
      <div className="journal-card-content">
        <span className="journal-category-tag">{article.category}</span>
        <h3 className="journal-card-title">{article.title}</h3>
        <p className="journal-card-excerpt">{article.excerpt}</p>
        <div className="journal-meta">
          <span>{article.publishedAt}</span>
          <span className="journal-meta-dot">•</span>
          <span>{article.readTime}</span>
        </div>
      </div>
    </Link>
  );
}