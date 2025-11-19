import { faqSource } from '@/lib/source';
import type { Page } from 'fumadocs-core/source';

export interface FAQItem {
  title: string;
  description: string;
  category: string;
  keywords: string[];
  slug: string;
  url: string;
  content?: string;
}

// Type guard for FAQ page data
export function getCategory(page: Page): string {
  return (page.data as any).category || '';
}

function getKeywords(page: Page): string[] {
  return (page.data as any).keywords || [];
}

/**
 * Get all FAQ pages
 */
export function getAllFAQs(lang: string = 'en'): Page[] {
  // Try to get pages for the requested language
  const language = faqSource.getLanguages().find((l) => l.language === lang);

  // If no pages found in requested language, fallback to English
  if (!language || language.pages.length === 0) {
    const defaultLanguage = faqSource
      .getLanguages()
      .find((l) => l.language === 'en');
    return defaultLanguage?.pages || [];
  }

  return language.pages;
}

/**
 * Get FAQ page by slug
 */
export function getFAQBySlug(
  slug: string,
  lang: string = 'en',
): Page | undefined {
  // Try to get from the requested language first
  let pages = getAllFAQs(lang);

  // If no pages found in requested language, fallback to English
  if (pages.length === 0 && lang !== 'en') {
    pages = getAllFAQs('en');
  }

  return pages.find((page) => {
    // Remove the numbered prefix if present for matching
    const pageSlug = page.url.split('/').pop() || '';
    const normalizedSlug = pageSlug.replace(/^\d+-/, '');
    const normalizedTarget = slug.replace(/^\d+-/, '');
    return normalizedSlug === normalizedTarget || pageSlug === slug;
  });
}

/**
 * Find related FAQs based on category, keywords, or content similarity
 */
export function findRelatedFAQs(
  currentSlug: string,
  lang: string = 'en',
  limit: number = 4,
): Page[] {
  const currentPage = getFAQBySlug(currentSlug, lang);
  if (!currentPage) return [];

  const allFAQs = getAllFAQs(lang);
  const currentCategory = getCategory(currentPage);
  const currentKeywords = getKeywords(currentPage);

  // Score each FAQ based on relevance
  const scoredFAQs = allFAQs
    .filter((page) => {
      const pageSlug = page.url.split('/').pop() || '';
      return (
        pageSlug !== currentSlug &&
        pageSlug.replace(/^\d+-/, '') !== currentSlug.replace(/^\d+-/, '')
      );
    })
    .map((page) => {
      let score = 0;
      const pageCategory = getCategory(page);
      const pageKeywords = getKeywords(page);

      // Same category gets high score
      if (pageCategory === currentCategory) {
        score += 10;
      }

      // Shared keywords increase score
      const sharedKeywords = currentKeywords.filter((k) =>
        pageKeywords.includes(k),
      );
      score += sharedKeywords.length * 3;

      // Title similarity (simple check)
      const currentTitle = (
        (currentPage.data.title as string) || ''
      ).toLowerCase();
      const pageTitle = ((page.data.title as string) || '').toLowerCase();
      const currentWords = currentTitle.split(/\s+/);
      const pageWords = pageTitle.split(/\s+/);
      const sharedWords = currentWords.filter(
        (w) => pageWords.includes(w) && w.length > 3,
      );
      score += sharedWords.length;

      return { page, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.page);

  return scoredFAQs;
}

/**
 * Get FAQs by category
 */
export function getFAQsByCategory(
  category: string,
  lang: string = 'en',
): Page[] {
  const allFAQs = getAllFAQs(lang);
  return allFAQs.filter((page) => getCategory(page) === category);
}

/**
 * Get all categories
 */
export function getAllCategories(lang: string = 'en'): string[] {
  const allFAQs = getAllFAQs(lang);
  const categories = new Set<string>();
  allFAQs.forEach((page) => {
    const category = getCategory(page);
    if (category) {
      categories.add(category);
    }
  });
  return Array.from(categories).sort();
}

/**
 * Get previous and next FAQ from the same category
 */
export function getAdjacentFAQs(
  currentSlug: string,
  lang: string = 'en',
): { previous?: Page; next?: Page } {
  const currentPage = getFAQBySlug(currentSlug, lang);
  if (!currentPage) {
    return {};
  }

  const currentCategory = getCategory(currentPage);

  // Get all FAQs from the same category (including current page for position finding)
  const allCategoryFAQs = getAllFAQs(lang).filter((page) => {
    return getCategory(page) === currentCategory;
  });

  if (allCategoryFAQs.length === 0) {
    return {};
  }

  // Find current page index in the full category list
  const currentIndex = allCategoryFAQs.findIndex((page) => {
    const pageSlug = page.url.split('/').pop() || '';
    return (
      pageSlug === currentSlug ||
      pageSlug.replace(/^\d+-/, '') === currentSlug.replace(/^\d+-/, '')
    );
  });

  if (currentIndex === -1) {
    // Current page not found in category, return first and last (excluding current)
    const categoryFAQsWithoutCurrent = allCategoryFAQs.filter((page) => {
      const pageSlug = page.url.split('/').pop() || '';
      return (
        pageSlug !== currentSlug &&
        pageSlug.replace(/^\d+-/, '') !== currentSlug.replace(/^\d+-/, '')
      );
    });

    if (categoryFAQsWithoutCurrent.length === 0) {
      return {};
    }

    return {
      previous:
        categoryFAQsWithoutCurrent[categoryFAQsWithoutCurrent.length - 1],
      next: categoryFAQsWithoutCurrent[0],
    };
  }

  // Get previous (wrap around if at start)
  const previousIndex =
    currentIndex > 0 ? currentIndex - 1 : allCategoryFAQs.length - 1;
  const previous = allCategoryFAQs[previousIndex];
  const previousSlug = previous.url.split('/').pop() || '';
  const isPreviousCurrent =
    previousSlug === currentSlug ||
    previousSlug.replace(/^\d+-/, '') === currentSlug.replace(/^\d+-/, '');

  // Get next (wrap around if at end)
  const nextIndex =
    currentIndex < allCategoryFAQs.length - 1 ? currentIndex + 1 : 0;
  const next = allCategoryFAQs[nextIndex];
  const nextSlug = next.url.split('/').pop() || '';
  const isNextCurrent =
    nextSlug === currentSlug ||
    nextSlug.replace(/^\d+-/, '') === currentSlug.replace(/^\d+-/, '');

  return {
    previous: isPreviousCurrent ? undefined : previous,
    next: isNextCurrent ? undefined : next,
  };
}

/**
 * Convert FAQ page to FAQItem format
 */
export function pageToFAQItem(page: Page): FAQItem {
  const slug = page.url.split('/').pop() || '';
  return {
    title: (page.data.title as string) || '',
    description: (page.data.description as string) || '',
    category: getCategory(page),
    keywords: getKeywords(page),
    slug,
    url: page.url,
    content: (page.data as any).content || undefined,
  };
}
