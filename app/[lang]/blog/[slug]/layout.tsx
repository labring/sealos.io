import { type AuthorData, blogAuthors } from '@/config/site';
import { blog } from '@/lib/source';
import type { InferPageType } from 'fumadocs-core/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { DocsPage } from 'fumadocs-ui/page';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { Fragment } from 'react';

export default async function BlogLayout({
  params,
  children,
}: {
  params: { lang: string; slug: string };
  children: ReactNode;
}) {
  const page = blog.getPage([params.slug]);
  if (!page) notFound();

  return (
    <DocsLayout
      sidebar={{
        enabled: false,
      }}
      tree={blog.pageTree[params.lang]}
    >
      <DocsPage
        toc={page.data.toc}
        tableOfContent={{
          style: 'clerk',
          single: false,
        }}
      >
        <main
          className="mx-auto w-full max-w-[800px] py-10  sm:py-20"
          itemType="http://schema.org/Article"
          itemScope
        >
          <h1
            className="mb-2 text-3xl font-bold leading-normal"
            itemProp="name"
          >
            {page.data.title}
          </h1>
          <div className="mb-6 mt-3 flex flex-row flex-wrap items-center gap-1">
            <div className="flex flex-row flex-wrap gap-1">
              {page.data.authors.map((author, i) => (
                <Fragment key={i}>
                  {i !== 0 && <span className="mx-1">+</span>}
                  <SmallAuthor author={blogAuthors[author]} />
                </Fragment>
              ))}
            </div>

            <div className="text-sm text-muted-foreground">
              <span className="mr-1">•</span>
              <span itemProp="datePublished">
                {new Date(page.data.date).toLocaleDateString()}
              </span>
            </div>
          </div>
          {children}
          <Footer page={page} />
        </main>
      </DocsPage>
    </DocsLayout>
  );
}

function SmallAuthor({ author }: { author: AuthorData }) {
  return (
    <Link
      className="flex flex-row items-center gap-1.5 text-foreground"
      href={author.url ?? '#'}
      rel="nofollow noreferrer"
      target="_blank"
      itemProp="author"
    >
      {author.image_url != null && (
        <Image
          alt="avatar"
          src={author.image_url}
          width={25}
          height={25}
          className="h-full rounded-full"
        />
      )}
      {author.name}
    </Link>
  );
}

function Footer({ page }: { page: InferPageType<typeof blog> }) {
  return (
    <div className="mt-[5rem] flex flex-col gap-6">
      {page.data.authors
        .map((author) => blogAuthors[author])
        .map((author, i) => (
          <Link
            key={i}
            className="flex flex-row gap-2 rounded-xl bg-card p-4 text-card-foreground"
            href={author.url ?? '#'}
            target="_blank"
            rel="nofollow noreferrer"
          >
            {author.image_url != null && (
              <Image
                itemProp="image"
                alt="avatar"
                src={author.image_url}
                width={40}
                height={40}
                className="h-full rounded-full"
              />
            )}
            <div>
              <p itemProp="name" className="font-medium">
                {author.name}
              </p>
              <p itemProp="jobTitle" className="text-sm text-muted-foreground">
                {author.title}
              </p>
            </div>
          </Link>
        ))}
    </div>
  );
}
