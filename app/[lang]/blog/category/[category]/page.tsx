import { generateBlogMetadata } from '@/lib/utils/metadata';
import BlogItem from '../../components/BlogItem';
import BlogHeader from '../../components/BlogHeader';
import { redirect } from 'next/navigation';
import {
  getCategories,
  getSortedBlogPosts,
  formatCategoryTitle,
  getAllTags,
} from '@/lib/utils/blog-utils';

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categories = await getCategories();
  const { category } = params;

  const decodedCategory = decodeURIComponent(category);
  if (!categories.includes(decodedCategory)) {
    redirect(`../../blog/`);
  }

  const allPosts = getSortedBlogPosts({ category: category, tags: [] });
  const posts = allPosts;
  const tags = await getAllTags(allPosts);

  const categoryTitle = formatCategoryTitle(category);

  return (
    <main className="flex flex-1 flex-col pb-20">
      <BlogHeader
        title={`${categoryTitle} Articles`}
        description={`Blog articles in the ${categoryTitle.toLowerCase()} category`}
        categories={categories}
        tags={tags}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.length > 0 ? (
          posts.map((page, index) => (
            <BlogItem key={page.url} page={page} priorityImage={index < 9} />
          ))
        ) : (
          <div className="col-span-3 py-10 text-center">
            <p className="text-lg text-muted-foreground">
              No posts found in this category.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export const generateMetadata = generateBlogMetadata;
