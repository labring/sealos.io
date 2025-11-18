import { Button } from '@/components/ui/button';
import { GodRays } from '@/new-components/GodRays';
import { GradientText } from '@/new-components/GradientText';
import { RssIcon } from 'lucide-react';
import CategoryBar from './components/CategoryBar';
import {
  getAllTags,
  getCategories,
  getSortedBlogPosts,
} from '@/lib/utils/blog-utils';
import TagsBar from './components/TagBar';
import { languagesType } from '@/lib/i18n';
import BlogGrid from './components/BlogGrid';
import { BlogHeader } from './components/BlogHeader';

type BlogIndexProps = {
  params: { lang: languagesType };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function BlogPage({
  params: { lang },
  searchParams,
}: BlogIndexProps) {
  const categories = await getCategories();
  const tags = await getAllTags(undefined, lang);

  // Extract tags from URL search params
  const selectedTags = searchParams.tag
    ? Array.isArray(searchParams.tag)
      ? searchParams.tag
      : [searchParams.tag]
    : [];

  // Pass selected tags to filter posts
  const posts = getSortedBlogPosts({
    tags: selectedTags,
    lang: lang,
  });

  return (
    <>
      <GodRays
        sources={[
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 20,
            count: 12,
            color: '220, 220, 220',
            opacityMin: 0.24,
            opacityMax: 0.25,
            minWidth: 120,
            maxWidth: 180,
          },
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 8,
            count: 6,
            color: '255, 255, 255',
            opacityMin: 0.89,
            opacityMax: 0.9,
            minWidth: 12,
            maxWidth: 24,
          },
          {
            x: 0.25,
            y: -0.06,
            angle: 50,
            spread: 20,
            count: 6,
            color: '180, 180, 180',
            opacityMin: 0.14,
            opacityMax: 0.15,
            minWidth: 60,
            maxWidth: 120,
          },
        ]}
        speed={0.0}
        maxWidth={48}
        minLength={1200}
        maxLength={2000}
        blur={8}
      />

      <section className="container -mt-24 pt-44 pb-14">
        <BlogHeader />
      </section>

      <section className="container">
        <CategoryBar categories={categories} />
        <TagsBar tags={tags} />
      </section>

      <section className="container mt-10">
        <BlogGrid posts={posts} lang={lang} />
      </section>
    </>
  );
}
