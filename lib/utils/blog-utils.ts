import fs from 'fs';
import path from 'path';
import { Page } from 'fumadocs-core/source';
import { blog } from '@/lib/source';

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

export function getPageCategory(page: Page) {
  const match = page.file.dirname.match(/\((.*?)\)/); // Extracts text inside ()
  return match ? match[1] : 'uncategorized';
}

export function getBlogImage(title: string) {
  return `/api/og/blog/${title}`;
}

function getBlogPosts() {
  const posts = [...blog.getPages()];
  return posts;
}

export function getSortedBlogPosts(category?: string) {
  const posts = getBlogPosts();

  const filteredPosts = category
    ? posts.filter(
        (post) => getPageCategory(post) === decodeURIComponent(category),
      )
    : posts;

  filteredPosts.sort(
    (a, b) =>
      new Date(b.data.date ?? b.file.name).getTime() -
      new Date(a.data.date ?? a.file.name).getTime(),
  );
  return filteredPosts;
}

export function formatCategoryTitle(category: string) {
  return decodeURIComponent(category)
    .split(/[-\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
