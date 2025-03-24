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
export async function getAllTags(pages?: BlogPost[]) {
  let posts;
  if (pages) {
    posts = pages;
  } else {
    posts = [...blog.getPages()];
  }
  const tagSet = new Set<string>();

  posts.forEach((post) => {
    if (post.data.tags && Array.isArray(post.data.tags)) {
      post.data.tags.forEach((tag) => tagSet.add(tag.toLowerCase()));
    }
  });

  return Array.from(tagSet);
}

export function getPageCategory(page: Page) {
  const match = page.file.dirname.match(/\((.*?)\)/); // Extracts text inside ()
  return match ? match[1] : 'uncategorized';
}

export function getBlogImage(title: string, category?: string) {
  if (process.env.NODE_ENV !== 'production') {
    return `/images/og-blog/${`${title}.png`
      .replaceAll(' ', '')
      .replaceAll('?', '')}`;
  }
  const baseUrl = `/api/og/blog/${encodeURI(title)}`;
  return category
    ? `${baseUrl}?category=${encodeURI(category)}`
    : baseUrl;
}


export function getSortedBlogPosts(options?: {
  category?: string;
  tags?: string[];
  lang?: languagesType
}) {
  const posts = blog.getPages(options?.lang);
  
  let filteredPosts = posts;

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
