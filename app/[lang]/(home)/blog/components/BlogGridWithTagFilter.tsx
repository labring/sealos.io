'use client';

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import type { BlogPostSummary } from '@/lib/utils/blog-utils-shared';
import type { languagesType } from '@/lib/i18n';
import BlogGrid from './BlogGrid';

interface BlogGridWithTagFilterProps {
  posts: BlogPostSummary[];
  lang: languagesType;
}

function filterPostsByTags(
  posts: BlogPostSummary[],
  tags: string[],
): BlogPostSummary[] {
  if (!tags.length) return posts;
  return posts.filter((post) => {
    if (!post.data.tags || !Array.isArray(post.data.tags)) return false;
    return tags.every((tag) =>
      post.data.tags!.some(
        (postTag) => postTag.toLowerCase() === tag.toLowerCase(),
      ),
    );
  });
}

function BlogGridFilteredContent({ posts, lang }: BlogGridWithTagFilterProps) {
  const searchParams = useSearchParams();
  const selectedTags = useMemo(
    () => searchParams.getAll('tag'),
    [searchParams],
  );
  const filteredPosts = useMemo(
    () => filterPostsByTags(posts, selectedTags),
    [posts, selectedTags],
  );
  return <BlogGrid posts={filteredPosts} lang={lang} />;
}

/**
 * Client wrapper that filters blog posts by URL ?tag=... for static export.
 * Uses Suspense so useSearchParams() is allowed.
 */
export default function BlogGridWithTagFilter(props: BlogGridWithTagFilterProps) {
  return (
    <Suspense fallback={<BlogGrid posts={props.posts} lang={props.lang} />}>
      <BlogGridFilteredContent {...props} />
    </Suspense>
  );
}
