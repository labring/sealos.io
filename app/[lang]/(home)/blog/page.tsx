import { GodRays } from '@/new-components/GodRays';
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

type BlogIndexProps = {
  params: { lang: languagesType };
};

/** Blog index: tag filtering is done on the client for static export. */
export default async function BlogPage({ params: { lang } }: BlogIndexProps) {
  const categories = await getCategories();
  const tags = await getAllTags(undefined, lang);
  const posts = getSortedBlogPosts({ lang });

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
        <BlogGridWithTagFilter
          posts={posts.map(toBlogPostSummary)}
          lang={lang}
        />
      </section>
    </>
  );
}
