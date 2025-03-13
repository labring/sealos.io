'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export default function CategoryBar({
  categories = [],
}: {
  categories?: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Initialize activeCategory from pathname directly
  const [activeCategory, setActiveCategory] = useState(() => {
    const pathParts = pathname.split('/');
    const categoryIndex = pathParts.findIndex((part) => part === 'category');
    return categoryIndex !== -1 && pathParts[categoryIndex + 1]
      ? decodeURIComponent(pathParts[categoryIndex + 1])
      : 'all';
  });

  // Keep active category in sync with URL changes
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

  const checkScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll]);

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    // Set the active category immediately before navigation
    setActiveCategory(category);

    const langSegment = pathname.split('/')[1]; // Extract language segment
    const langPath =
      langSegment && langSegment !== 'blog' ? `/${langSegment}` : '';

    // Small delay to prevent the navigation from happening too quickly
    // before the state update occurs
    setTimeout(() => {
      if (category === 'all') {
        // Remove category from URL - go back to main blog page
        const basePath = langPath + '/blog';
        router.push(basePath);
      } else {
        // Navigate to the category page
        const categoryPath =
          langPath + `/blog/category/${encodeURIComponent(category)}`;
        router.push(categoryPath);
      }
    }, 10);
  };

  return (
    <div className="relative my-6 w-full">
      {showLeftArrow && (
        <button
          onClick={scrollLeft}
          className="absolute -left-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className="scrollbar-hide flex gap-2 overflow-x-auto px-2 pb-2"
        onScroll={checkScroll}
      >
        <button
          onClick={() => handleCategoryChange('all')}
          className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
            activeCategory === 'all'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-muted bg-transparent hover:bg-accent'
          }`}
        >
          All Posts
        </button>

        {Array.isArray(categories) &&
          categories.map((category) => {
            const categoryTitle = category
              .split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  activeCategory === category
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted bg-transparent hover:bg-accent'
                }`}
              >
                {categoryTitle}
              </button>
            );
          })}
      </div>

      {showRightArrow && (
        <button
          onClick={scrollRight}
          className="absolute -right-1 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 shadow-md backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
