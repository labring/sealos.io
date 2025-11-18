import { blogAuthors } from '@/config/site';
import { InferPageType } from 'fumadocs-core/source';
import { blog } from '@/lib/source';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogImage, getPageCategory } from '@/lib/utils/blog-utils';
import { GradientText } from '@/new-components/GradientText';

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
      className="group text-card-foreground flex flex-col rounded-xl"
    >
      <div className="relative aspect-video h-auto w-full overflow-clip rounded-xl border">
        <Image
          src={page.data?.image ?? getBlogImage(page, category)}
          alt={page.data.title}
          className="h-full object-cover"
          fill
          priority={priorityImage ? true : false}
          sizes="(max-width: 760px) 90vw, 400px"
        />
        <div className="absolute right-2 bottom-2 flex items-center gap-2 overflow-visible">
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
                      className="border-background rounded-full border-2 bg-white"
                    />
                    <div className="absolute top-0 left-1/2 z-50 mb-2 -translate-x-1/2 -translate-y-[120%] rounded bg-black/75 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover/author:opacity-100">
                      {info.name}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 pt-4">
        <div className="flex items-start justify-between">
          <h3 className="line-clamp-2 flex-1 font-semibold">
            <GradientText>
              <span className="text-foreground transition-colors group-hover:text-transparent">
                {page.data.title}
              </span>
            </GradientText>
          </h3>
        </div>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {page.data.description}
        </p>
      </div>
    </Link>
  );
}
