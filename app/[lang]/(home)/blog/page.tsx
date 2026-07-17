import { PageTopRays } from '@/new-components/SideRays';
import CategoryBar from './components/CategoryBar';
import {
  getAllTags,
  getCategories,
  getSortedBlogPosts,
  toBlogPostSummary,
} from '@/lib/utils/blog-utils';
import TagsBar from './components/TagBar';
import { languagesType } from '@/lib/i18n';
import BlogGridWithTagFilter from './components/BlogGridWithTagFilter';
import { BlogHeader } from './components/BlogHeader';
import { generatePageMetadata } from '@/lib/utils/metadata';
import type { Metadata } from 'next';

type BlogIndexProps = {
  params: { lang: languagesType };
};

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Blog',
    description: 'Explore Sealos blog posts and technical insights.',
    pathname: '/blog',
  });
}

/** Blog index: tag filtering is done on the client for static export. */
export default async function BlogPage({ params: { lang } }: BlogIndexProps) {
  const categories = await getCategories();
  const tags = await getAllTags(undefined, lang);
  const posts = getSortedBlogPosts({ lang });

  return (
    <>
      <PageTopRays />

      <section className="container -mt-24 pt-44 pb-14">
        <BlogHeader />
      </section>

      <section className="container">
        <CategoryBar categories={categories} />
        <TagsBar tags={tags} />
      </section>

      <section className="container mt-10">
        <BlogGridWithTagFilter
          posts={posts.map(toBlogPostSummary)}
          lang={lang}
        />
      </section>
    </>
  );
}
