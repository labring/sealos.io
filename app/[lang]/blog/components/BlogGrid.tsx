import { BlogPost } from '@/lib/utils/blog-utils';
import BlogItem from './BlogItem';
import { languagesType } from '@/lib/i18n';

interface BlogGridProps {
  posts: BlogPost[];
  lang: languagesType
}

export default function BlogGrid({ posts, lang }: BlogGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.length > 0 ? (
        posts.map((page, index) => (
          <BlogItem key={index} page={page} priorityImage={index < 9} />
        ))
      ) : (
        <div className="col-span-3 py-10 text-center">
          <p className="text-lg text-muted-foreground">No posts found.</p>
        </div>
      )}
    </div>
  );
}
