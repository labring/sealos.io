import fs from 'fs';
import path from 'path';
import { Page } from 'fumadocs-core/source';
import { blog } from '@/lib/source';
import { languagesType } from '../i18n';

export async function getCategories() {
  const contentPath = path.join(process.cwd(), 'content/blog');

  try {
    if (!fs.existsSync(contentPath)) {
      return [];
    }

    const categories = fs
      .readdirSync(contentPath)
      .filter((file) => fs.statSync(path.join(contentPath, file)).isDirectory())
      .filter((dir) => dir.startsWith('(') && dir.endsWith(')'))
      .map((category) => {
        return category.replace(/^\(|\)$/g, '');
      })
      .filter((category) => category !== 'uncategorized');
    return categories;
  } catch (error) {
    console.error('Error reading blog categories:', error);
    return [];
  }
}

// Extract the blog post type with Zod parameters
export type BlogPost = ReturnType<typeof blog.getPages>[number];
export async function getAllTags(pages?: BlogPost[], lang?: languagesType) {
  let posts;
  if (pages) {
    posts = pages;
  } else {
    posts = [...blog.getPages(lang)];

    // Apply the same language filtering logic as getSortedBlogPosts
    if (lang && posts.length > 0) {
      posts = posts.filter((post) => {
        // Check if the file path contains language identifier
        if (lang === 'zh-cn') {
          return post.file.path.includes('.zh-cn.');
        } else {
          // English articles typically don't have language identifiers or have .en.
          return (
            !post.file.path.includes('.zh-cn.') ||
            post.file.path.includes('.en.')
          );
        }
      });
    }
  }

  const tagSet = new Set<string>();

  posts.forEach((post) => {
    if (post.data.tags && Array.isArray(post.data.tags)) {
      post.data.tags.forEach((tag) => tagSet.add(tag.toLowerCase()));
    }
  });

  const tags = Array.from(tagSet);
  return tags;
}

export function getPageCategory(page: Page) {
  const match = page.file.dirname.match(/\((.*?)\)/); // Extracts text inside ()
  return match ? match[1] : 'uncategorized';
}

export function getBlogImage(page: Page, category?: string) {
  const baseUrl = `/api/og/blog/${encodeURIComponent(page.slugs[0] + '.' + page.locale)}`;
  return category ? `${baseUrl}/${encodeURI(category)}` : baseUrl;
}

export function getPostsByLanguage(lang: languagesType) {
  // Retrieve all blog posts filtered by language
  const posts = blog.getPages(lang);

  // Modify language filtering logic based on actual file structure
  let filteredPosts = posts;
  // Filter based on known file structure
  if (lang && posts.length > 0) {
    // Filter based on language identifiers in file paths
    // Example: content/blog/(category)/article/index.zh-cn.md
    filteredPosts = filteredPosts.filter((post) => {
      const path = post.data._file.path;
      // Check if the file path contains language identifier
      if (lang === 'zh-cn') {
        return path.includes('.zh-cn.');
      }
      // English articles typically don't have language identifiers or have .en.
      return !path.includes('.zh-cn.') || path.includes('.en.');
    });
  }

  return filteredPosts;
}

export function getSortedBlogPosts(options?: {
  category?: string;
  tags?: string[];
  lang?: languagesType;
}) {
  let filteredPosts = getPostsByLanguage(options?.lang ?? 'en');

  // Filter by category if provided
  if (options?.category) {
    filteredPosts = filteredPosts.filter(
      (post) => getPageCategory(post) === decodeURIComponent(options.category!),
    );
  }

  // Filter by tags if provided
  if (options?.tags && options.tags.length > 0) {
    filteredPosts = filteredPosts.filter((post) => {
      if (!post.data.tags || !Array.isArray(post.data.tags)) return false;

      // Check if post has all of the selected tags
      return options.tags!.every((tag) =>
        post.data.tags.some(
          (postTag) => postTag.toLowerCase() === tag.toLowerCase(),
        ),
      );
    });
  }

  // Sort by date
  filteredPosts.sort(
    (a, b) =>
      new Date(b.data.date ?? b.file.name).getTime() -
      new Date(a.data.date ?? a.file.name).getTime(),
  );

  return filteredPosts;
}

export function formatTagTitle(tag: string) {
  return decodeURIComponent(tag)
    .split(/[-\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Alias for backward compatibility
export const formatCategoryTitle = formatTagTitle;

export function getRelatedArticles(
  currentArticle: BlogPost,
  allArticles: BlogPost[],
  options?: {
    maxRecommendations?: number;
    categoryWeight?: number;
    tagWeight?: number;
  },
): BlogPost[] {
  if (!currentArticle || !Array.isArray(allArticles) || allArticles.length === 0) {
    return [];
  }

  const {
    maxRecommendations = 4,
    categoryWeight = 2,
    tagWeight = 1,
  } = options ?? {};

  const limit = Math.max(0, Math.floor(maxRecommendations));
  if (limit === 0) {
    return [];
  }

  const currentLocale = currentArticle.locale;
  const currentCategory = getPageCategory(currentArticle).toLowerCase();
  const currentTags = new Set(
    (currentArticle.data.tags ?? [])
      .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
      .map((tag) => tag.toLowerCase().trim()),
  );

  const candidates = allArticles.filter((article) => {
    if (!article || article === currentArticle) return false;
    if (article.file?.path && currentArticle.file?.path) {
      return article.file.path !== currentArticle.file.path;
    }
    return article.data.title !== currentArticle.data.title;
  });

  if (candidates.length === 0) {
    return [];
  }

  const scoreCandidate = (article: BlogPost) => {
    const candidateCategory = getPageCategory(article).toLowerCase();
    const categoryMatch = candidateCategory === currentCategory;

    const candidateTags = new Set(
      (article.data.tags ?? [])
        .filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
        .map((tag) => tag.toLowerCase().trim()),
    );

    let sharedTagsCount = 0;
    if (currentTags.size > 0 && candidateTags.size > 0) {
      currentTags.forEach((tag) => {
        if (candidateTags.has(tag)) {
          sharedTagsCount += 1;
        }
      });
    }

    const tagSimilarity =
      currentTags.size === 0 || candidateTags.size === 0
        ? 0
        : sharedTagsCount / currentTags.size;

    const score =
      (categoryMatch ? categoryWeight : 0) + tagWeight * tagSimilarity;

    const updatedAt = (() => {
      const rawDate = article.data.date ?? article.file?.name;
      const normalizedDate = rawDate instanceof Date ? rawDate.toISOString() : rawDate;
      const timestamp = normalizedDate ? Date.parse(normalizedDate) : Number.NaN;
      return Number.isNaN(timestamp) ? 0 : timestamp;
    })();

    return {
      article,
      categoryMatch,
      sharedTagsCount,
      tagSimilarity,
      score,
      updatedAt,
      sameLocale: article.locale === currentLocale,
    };
  };

  const rankedCandidates = candidates.map(scoreCandidate);

  const sortByRelevance = (a: ReturnType<typeof scoreCandidate>, b: ReturnType<typeof scoreCandidate>) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.sharedTagsCount !== a.sharedTagsCount) return b.sharedTagsCount - a.sharedTagsCount;
    if (b.updatedAt !== a.updatedAt) return b.updatedAt - a.updatedAt;
    return a.article.data.title.localeCompare(b.article.data.title, currentLocale ?? 'en');
  };

  const sameLocale = rankedCandidates.filter((item) => item.sameLocale);
  const otherLocales = rankedCandidates.filter((item) => !item.sameLocale);

  // Smart fallback order: same locale & category first, then progressively relax constraints.
  const pickOrder: ReturnType<typeof scoreCandidate>[][] = [
    sameLocale.filter((item) => item.categoryMatch),
    sameLocale.filter((item) => !item.categoryMatch),
    otherLocales.filter((item) => item.categoryMatch),
    otherLocales.filter((item) => !item.categoryMatch),
  ];

  const recommendations: BlogPost[] = [];
  for (const group of pickOrder) {
    if (recommendations.length >= limit) break;

    group.sort(sortByRelevance);

    for (const { article } of group) {
      if (recommendations.length >= limit) break;
      recommendations.push(article);
    }
  }

  return recommendations.slice(0, limit);
}
