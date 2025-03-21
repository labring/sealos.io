import { generateBlogMetadata } from '@/lib/utils/metadata';
import BlogHeader from '../../components/BlogHeader';
import BlogGrid from '../../components/BlogGrid';
import { redirect } from 'next/navigation';
import {
  getCategories,
  getSortedBlogPosts,
  formatCategoryTitle,
  getAllTags,
} from '@/lib/utils/blog-utils';
import BlogContainer from '../../components/BlogContainer';
import { languagesType } from '@/lib/i18n';

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

  const allPosts = getSortedBlogPosts({ category: category, tags: [] });
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
      title: `${categoryTitle} 的文章`,
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

export const generateMetadata = generateBlogMetadata;
