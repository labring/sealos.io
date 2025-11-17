import { generateBlogMetadata } from '@/lib/utils/metadata';
import BlogHeader from '../../components/BlogHeader';
import BlogGrid from '../../../(home)/blog/components/BlogGrid';
import { redirect } from 'next/navigation';
import {
  getCategories,
  getSortedBlogPosts,
  formatCategoryTitle,
  getAllTags,
} from '@/lib/utils/blog-utils';
import BlogContainer from '../../components/BlogContainer';
import { languagesType, LANGUAGES } from '@/lib/i18n';

export default async function CategoryPage({
  params,
}: {
  params: { category: string; lang: languagesType };
}) {
  const categories = await getCategories();
  const { category, lang } = params;

  const decodedCategory = decodeURIComponent(category);
  if (!categories.includes(decodedCategory)) {
    redirect(`../../blog/`);
  }

  const allPosts = getSortedBlogPosts({
    category: category,
    tags: [],
    lang: lang,
  });
  const posts = allPosts;
  const tags = await getAllTags(allPosts);

  const categoryTitle = formatCategoryTitle(category);

  const translations: Record<
    languagesType,
    Record<'title' | 'description', string>
  > = {
    en: {
      title: `${categoryTitle} Articles`,
      description: `Blog articles in the ${categoryTitle.toLowerCase()} category`,
    },
    'zh-cn': {
      title: `${categoryTitle}`,
      description: `${categoryTitle.toLowerCase()}分类下的博客`,
    },
  };

  return (
    <BlogContainer>
      <BlogHeader
        title={translations[lang].title}
        description={translations[lang].description}
        lang={lang}
        categories={categories}
        tags={tags}
      />
      <BlogGrid posts={posts} lang={lang} />
    </BlogContainer>
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

export const generateMetadata = generateBlogMetadata;
