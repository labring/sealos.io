import type { BlogPostSummary } from '@/lib/utils/blog-utils-shared';
import BlogItem from './BlogItem';
import type { languagesType } from '@/lib/i18n';

interface BlogGridProps {
  posts: BlogPostSummary[];
  lang: languagesType;
}

export default function BlogGrid({ posts, lang }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
      {posts.length > 0 ? (
        posts.map((page, index) => (
          <BlogItem key={index} page={page} priorityImage={index < 9} />
        ))
      ) : (
        <div className="col-span-3 py-10 text-center">
          <p className="text-muted-foreground text-lg">No posts found.</p>
        </div>
      )}
    </div>
  );
}
