'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronDown, Layers } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function CategoryBar({
  categories = [],
  text
}: {
  categories?: string[];
  text: Record<string, string>
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState(() => {
    const pathParts = pathname.split('/');
    const categoryIndex = pathParts.findIndex((part) => part === 'category');
    return categoryIndex !== -1 && pathParts[categoryIndex + 1]
      ? decodeURIComponent(pathParts[categoryIndex + 1])
      : 'all';
  });

  useEffect(() => {
    const pathParts = pathname.split('/');
    const categoryIndex = pathParts.findIndex((part) => part === 'category');

    const categoryFromUrl =
      categoryIndex !== -1 && pathParts[categoryIndex + 1]
        ? decodeURIComponent(pathParts[categoryIndex + 1])
        : 'all';

    if (activeCategory !== categoryFromUrl) {
      setActiveCategory(categoryFromUrl);
    }
  }, [pathname, activeCategory]);

  // Determine visible and expandable categories
  const visibleCount = categories.length + 1; // Show this many categories in the main view
  const visibleCategories = [
    'all',
    ...(categories || []).slice(0, visibleCount - 1),
  ];
  const expandableCategories = (categories || []).slice(visibleCount - 1);
  const hasMoreCategories = expandableCategories.length > 0;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);

    const langSegment = pathname.split('/')[1]; // Extract language segment
    const langPath =
      langSegment && langSegment !== 'blog' ? `/${langSegment}` : '';

    setTimeout(() => {
      if (category === 'all') {
        const basePath = langPath + '/blog';
        router.push(basePath);
      } else {
        const categoryPath =
          langPath + `/blog/category/${encodeURIComponent(category)}`;
        router.push(categoryPath);
      }
    }, 10);
    setExpanded(false); // Close expanded section after selection
  };

  return (
    <div className="relative my-6 w-full">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="whitespace-nowrap font-medium">{text.cates}</h3>
        </div>

        <div className="h-8 border-l border-muted-foreground/20"></div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {visibleCategories.map((category) => {
              const categoryTitle =
                category === 'all'
                  ? text.all_cates
                  : category
                      .split('-')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ');

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`whitespace-nowrap border-b-2 px-4 py-2 font-medium transition-all ${
                    activeCategory === category
                      ? 'border-primary text-primary'
                      : 'border-transparent hover:border-primary/40 hover:text-primary/80'
                  }`}
                >
                  {categoryTitle}
                </button>
              );
            })}

            {hasMoreCategories && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 whitespace-nowrap border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-all hover:border-primary/40 hover:text-primary/80"
                aria-expanded={expanded}
              >
                {expanded ? 'Less' : 'More'}{' '}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    expanded ? 'rotate-180' : ''
                  }`}
                />
              </button>
            )}
          </div>

          {hasMoreCategories && (
            <div
              className={`mt-2 flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${
                expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              {expandableCategories.map((category) => {
                const categoryTitle = category
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`whitespace-nowrap border-b-2 px-4 py-2 text-sm font-medium transition-all ${
                      activeCategory === category
                        ? 'border-primary text-primary'
                        : 'border-transparent hover:border-primary/40 hover:text-primary/80'
                    }`}
                  >
                    {categoryTitle}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
