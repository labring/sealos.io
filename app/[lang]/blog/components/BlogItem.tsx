import { blogAuthors } from '@/config/site';
import { InferPageType } from 'fumadocs-core/source';
import { blog } from '@/lib/source';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogImage, getPageCategory } from '@/lib/utils/blog-utils';

export default function BlogItem({
  page,
  priorityImage,
}: {
  page: InferPageType<typeof blog>;
  priorityImage?: Boolean;
}) {
  const pageCategory = getPageCategory(page);
  return (
    <Link
      href={page.url}
      className="group flex flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-md transition-all hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground hover:shadow-xl"
    >
      <div className="relative aspect-video h-auto w-full overflow-hidden">
        <Image
          src={getBlogImage(encodeURI(page.data.title))}
          alt={page.data.title}
          className="h-full object-cover transition-transform group-hover:scale-105"
          fill
          priority={priorityImage ? true : false}
          sizes="(max-width: 760px) 90vw, 400px"
        />
        {pageCategory && (
          <div className="absolute bottom-2 right-2 rounded-full bg-background/80 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
            {pageCategory.toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="line-clamp-2 font-semibold">{page.data.title}</p>
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {page.data.description}
        </p>

        <div className="mt-auto flex flex-row items-center pt-3">
          <div className="flex -space-x-2">
            {page.data.authors.flatMap((author, i) => {
              const info = blogAuthors[author];
              if (!info?.image_url) return [];

              return (
                <Image
                  key={info.name}
                  src={info.image_url}
                  alt={info.name}
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-background"
                />
              );
            })}
          </div>
          <time className="ml-auto text-xs text-muted-foreground">
            {new Date(page.data.date).toLocaleDateString()}
          </time>
        </div>
      </div>
    </Link>
  );
}
