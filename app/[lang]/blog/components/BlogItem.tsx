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
  const category = getPageCategory(page);
  return (
    <Link
      href={page.url}
      className="group flex flex-col rounded-xl bg-card text-card-foreground shadow-md transition-all hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground hover:shadow-xl"
    >
      <div className="relative aspect-video h-auto w-full overflow-visible">
        <Image
          src={getBlogImage(page.data.title, category)}
          alt={page.data.title}
          className="h-full object-cover"
          fill
          priority={priorityImage ? true : false}
          sizes="(max-width: 760px) 90vw, 400px"
        />
        <div className="absolute bottom-2 right-2 flex items-center gap-2 overflow-visible">
          {page.data.authors.length > 0 && (
            <div className="flex -space-x-2 overflow-visible">
              {page.data.authors.flatMap((author, i) => {
                const info = blogAuthors[author];
                if (!info?.image_url) return [];

                return (
                  <div
                    key={info.name}
                    className="group/author relative overflow-visible"
                  >
                    <Image
                      src={info.image_url}
                      alt={info.name}
                      width={24}
                      height={24}
                      className="rounded-full border-2 border-background bg-white"
                    />
                    <div className="absolute left-1/2 top-0 z-50 mb-2 -translate-x-1/2 -translate-y-[120%] whitespace-nowrap rounded bg-black/75 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover/author:opacity-100">
                      {info.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
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
      </div>
    </Link>
  );
}
