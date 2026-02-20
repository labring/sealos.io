/**
 * Blog helpers that do not use Node (fs/path). Safe to import from client components.
 */

export type BlogImageFormat = 'svg-card' | 'svg-header' | 'png-og';

/** Serializable summary of a blog post for client components (no body/functions). */
export interface BlogPostSummary {
  url: string;
  data: {
    title: string;
    description?: string;
    image?: string;
    tags?: string[];
  };
  file: { dirname: string };
  slugs: string[];
  locale?: string;
}

export function getPageCategory(page: { file: { dirname: string } }): string {
  const match = page.file.dirname.match(/\((.*?)\)/);
  return match ? match[1] : 'uncategorized';
}

export function getBlogImage(
  page: { slugs: string[]; locale?: string },
  _category?: string,
  format: BlogImageFormat = 'png-og',
): string {
  const formatMap: Record<BlogImageFormat, string> = {
    'svg-card': '384x256.svg',
    'svg-header': '400x210.svg',
    'png-og': '1200x630@3x.png',
  };

  const locale = page.locale ?? 'en';
  const slug = page.slugs[0];
  const formatString = formatMap[format] ?? formatMap['png-og'];

  return `/api/blog/${encodeURIComponent(locale)}/${encodeURIComponent(
    slug,
  )}/thumbnail/${formatString}`;
}
