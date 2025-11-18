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
  const slug = page.slugs[0];
  const locale = page.locale;
  const category = getPageCategory(page);

  const imageSrc = page.data?.image ?? getBlogImage(page, category, 'svg-card');
  return (
    <Link
      href={page.url}
      className="group text-card-foreground flex flex-col rounded-xl"
    >
      <div className="relative aspect-[3/2] h-auto w-full overflow-clip rounded-xl border">
        <Image
          src={imageSrc}
          alt={page.data.title}
          className="h-full object-cover"
          fill
          priority={priorityImage ? true : false}
          sizes="(max-width: 760px) 90vw, 400px"
        />
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
