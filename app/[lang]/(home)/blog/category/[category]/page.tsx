import { generatePageMetadata } from '@/lib/utils/metadata';
import { redirect } from 'next/navigation';
import {
  getCategories,
  getSortedBlogPosts,
  formatCategoryTitle,
  getAllTags,
  toBlogPostSummary,
} from '@/lib/utils/blog-utils';
import { languagesType, LANGUAGES } from '@/lib/i18n';
import { BlogHeader } from '../../components/BlogHeader';
import BlogGrid from '../../components/BlogGrid';
import CategoryBar from '../../components/CategoryBar';
import TagsBar from '../../components/TagBar';
import { GodRays } from '@/new-components/GodRays';
import type { Metadata } from 'next';

type CategoryPageParams = { category: string; lang: languagesType };

const categoryMetadataCopy: Record<
  languagesType,
  Record<'title' | 'description', string>
> = {
  en: {
    title: 'Blog Category',
    description: 'Browse Sealos blog articles by category.',
  },
  'zh-cn': {
    title: '博客分类',
    description: '按分类浏览 Sealos 博客文章。',
  },
};

export async function generateMetadata({
  params,
}: {
  params: CategoryPageParams;
}): Promise<Metadata> {
  const categories = await getCategories();
  const decodedCategory = decodeURIComponent(params.category);
  const copy = categoryMetadataCopy[params.lang];

  if (!categories.includes(decodedCategory)) {
    return generatePageMetadata({
      ...copy,
      pathname: '/blog',
      lang: params.lang,
    });
  }

  const categoryTitle = formatCategoryTitle(decodedCategory);

  return generatePageMetadata({
    title: `${categoryTitle} - ${copy.title}`,
    description: copy.description,
    pathname: `/blog/category/${encodeURIComponent(decodedCategory)}`,
    lang: params.lang,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: CategoryPageParams;
}) {
  const categories = await getCategories();
  const { category, lang } = params;

  const decodedCategory = decodeURIComponent(category);
  if (!categories.includes(decodedCategory)) {
    redirect(`../../blog/`);
  }

  const allPosts = getSortedBlogPosts({
    category,
    tags: [],
    lang,
  });
  const tags = await getAllTags(allPosts);

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
        <BlogGrid posts={allPosts.map(toBlogPostSummary)} lang={lang} />
      </section>
    </>
  );
}

export async function generateStaticParams(): Promise<
  Array<{ lang?: languagesType; category: string }>
> {
  try {
    const categories = await getCategories();
    const params: Array<{ lang?: languagesType; category: string }> = [];

    // Generate all combinations of languages and categories
    for (const lang of LANGUAGES) {
      for (const category of categories) {
        // URL encode category names to handle special characters
        const encodedCategory = encodeURIComponent(category);
        params.push({
          lang,
          category: encodedCategory,
        });
      }
    }

    // Generate params without lang for default language pages
    for (const category of categories) {
      const encodedCategory = encodeURIComponent(category);
      params.push({
        category: encodedCategory,
      });
    }

    return params;
  } catch (error) {
    console.error('Error generating static params for blog categories:', error);
    // Return empty array to allow build to continue
    return [];
  }
}
