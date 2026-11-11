import Link from 'next/link';

type Category = { slug: string; label: string };

export default function CategoryFilter({
  categories,
  activeCategory,
  basePath = '/journal',
}: {
  categories: Category[];
  activeCategory: string;
  basePath?: string;
}) {
  return (
    <div className="journal-category-filter" role="tablist" aria-label="فیلتر دسته‌بندی">
      {categories.map((cat) => {
        const isActive = cat.slug === activeCategory;
        const href = cat.slug === 'all' ? basePath : `${basePath}?category=${cat.slug}`;
        return (
          <Link
            key={cat.slug}
            href={href}
            className={`journal-category-pill ${isActive ? 'is-active' : ''}`}
            role="tab"
            aria-selected={isActive}
          >
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}