import { generateBlogMetadata } from '@/lib/utils/metadata';
import CategoryBar from './components/CategoryBar';
import BlogItem from './components/BlogItem';
import BlogHeader from './components/BlogHeader';
import { getCategories, getSortedBlogPosts } from '@/lib/utils/blog-utils';

export default async function BlogIndex() {
  const categories = await getCategories();
  const posts = getSortedBlogPosts();

  return (
    <main className="flex flex-1 flex-col pb-20">
      <BlogHeader
        title="Blog"
        description="Sharing our technical insights, product updates and industry news"
      />

      <CategoryBar categories={categories} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((page, index) => (
          <BlogItem key={page.url} page={page} priorityImage={index < 9} />
        ))}
      </div>
    </main>
  );
}

export const generateMetadata = generateBlogMetadata;
