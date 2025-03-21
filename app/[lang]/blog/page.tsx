import { generateBlogMetadata } from '@/lib/utils/metadata';
import BlogItem from './components/BlogItem';
import BlogHeader from './components/BlogHeader';
import {
  getCategories,
  getAllTags,
  getSortedBlogPosts,
} from '@/lib/utils/blog-utils';
import BlogGrid from './components/BlogGrid';
import BlogContainer from './components/BlogContainer';
import { languagesType } from '@/lib/i18n';

interface BlogIndexProps {
  params: { lang: languagesType };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function BlogIndex({
  params: { lang },
  searchParams,
}: BlogIndexProps) {
  const categories = await getCategories();
  const tags = await getAllTags();

  // Extract tags from URL search params
  const selectedTags = searchParams.tag
    ? Array.isArray(searchParams.tag)
      ? searchParams.tag
      : [searchParams.tag]
    : [];

  // Pass selected tags to filter posts
  const posts = getSortedBlogPosts({ tags: selectedTags });

  return (
    <BlogContainer>
      <BlogHeader lang={lang} categories={categories} tags={tags} />
      <BlogGrid posts={posts} />
    </BlogContainer>
  );
}

export const generateMetadata = generateBlogMetadata;
