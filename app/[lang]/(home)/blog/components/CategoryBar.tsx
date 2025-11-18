'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function CategoryBar({
  categories = [],
}: {
  categories?: string[];
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
      <div className="scrollbar-hide flex items-center gap-4 overflow-x-auto">
        <div className="flex-1">
          <div className="flex items-center border-b">
            {visibleCategories.map((category) => {
              const categoryTitle =
                category === 'all'
                  ? 'All Categories'
                  : category
                      .split('-')
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(' ');

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    'relative -mb-px cursor-pointer border-b px-4 py-2 whitespace-nowrap transition-all',
                    activeCategory === category
                      ? 'text-primary before:bg-primary before:absolute before:bottom-0 before:left-0 before:-mb-px before:h-0.5 before:w-full'
                      : 'hover:border-primary/40 hover:text-primary/80 text-muted-foreground border-transparent',
                  )}
                >
                  {categoryTitle}
                </button>
              );
            })}

            {hasMoreCategories && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="hover:border-primary/40 hover:text-primary/80 flex cursor-pointer items-center gap-1 border-b-2 border-transparent px-4 py-2 text-sm font-medium whitespace-nowrap transition-all"
                aria-expanded={expanded}
              >
                {expanded ? 'Less' : 'More'}{' '}
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    expanded ? 'rotate-180' : '',
                  )}
                />
              </button>
            )}
          </div>

          {hasMoreCategories && (
            <div
              className={cn(
                'mt-2 flex flex-wrap gap-2 overflow-hidden transition-all duration-300',
                expanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0',
              )}
            >
              {expandableCategories.map((category) => {
                const categoryTitle = category
                  .split('-')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                return (
                  <button
                    type="button"
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={cn(
                      'cursor-pointer border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all',
                      activeCategory === category
                        ? 'border-primary text-primary'
                        : 'hover:border-primary/40 hover:text-primary/80 border-transparent',
                    )}
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
