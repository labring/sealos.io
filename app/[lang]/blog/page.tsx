import { generateBlogMetadata } from '@/lib/utils/metadata';
import { blogAuthors } from '@/config/site';
import { blog } from '@/lib/source';
import type { InferPageType } from 'fumadocs-core/source';
import Image from 'next/image';
import Link from 'next/link';

function BlogItem({
  page,
  priorityImage,
}: {
  page: InferPageType<typeof blog>;
  priorityImage?: Boolean;
}) {
  return (
    <Link
      href={page.url}
      className="group flex flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-md transition-all hover:-translate-y-1 hover:bg-accent hover:text-accent-foreground hover:shadow-xl"
    >
      <div className="relative aspect-video h-auto w-full overflow-hidden">
        <Image
          alt="image"
          src={`/api/og/blog/${encodeURI(page.data.title)}`}
          className="h-full object-cover transition-transform group-hover:scale-105"
          fill
          priority={priorityImage ? true : false}
          sizes="(max-width: 760px) 90vw, 400px"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <p className="line-clamp-2 font-semibold">{page.data.title}</p>
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

export default function BlogIndex() {
  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? b.file.name).getTime() -
      new Date(a.data.date ?? a.file.name).getTime(),
  );

  return (
    <main className="flex flex-1 flex-col pb-20">
      <div className="py-16">
        <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
          Blog
        </h1>
        <div className="flex flex-row justify-center gap-2.5 max-sm:flex-col max-sm:items-stretch">
          <p className="text-center text-lg text-muted-foreground">
            Sharing our technical insights, product updates and industry news
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((page, index) => (
          <BlogItem key={page.url} page={page} priorityImage={index < 9} />
        ))}
      </div>
    </main>
  );
}

export const generateMetadata = generateBlogMetadata;
