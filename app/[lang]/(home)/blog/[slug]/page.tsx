import { blogAuthors, domain, siteConfig } from '@/config/site';
import { blog } from '@/lib/source';
import { DocsBody } from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import React from 'react';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const page = blog.getPage([(await params).slug]);
  if (!page) notFound();

  const Content = page.data.body;

  return (
    <DocsBody>
      <Content
        components={{
          ...defaultMdxComponents,
          img: (props) => (
            <ImageZoom {...(props as any)} className="rounded-xl" />
          ),
          p: ({ children, ...props }: any) => {
            const hasH5 = React.Children.toArray(children).some(
              (child) => React.isValidElement(child) && child.type === 'h5',
            );
            if (hasH5) {
              return <div {...props}>{children}</div>;
            }
            return <p {...props}>{children}</p>;
          },
        }}
      />
    </DocsBody>
  );
}

export function generateStaticParams() {
  return blog.generateParams().map((blog) => ({
    slug: blog.slug[0],
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);
  if (!page) notFound();

  const imageUrl = `/api/og/blog/${page.data.title}`;

  const url = `${siteConfig.url.base}/blog/${page.slugs.join('/')}`;

  const isRootPage = !params.slug || params.slug.length === 0;
  const docTitle = isRootPage
    ? 'Sealos Blog'
    : `${page.data.title} | Sealos Blog`;

  return {
    metadataBase: new URL(siteConfig.url.base),
    title: {
      absolute: docTitle,
    },
    description: page.data.description,
    keywords: page.data.keywords,
    alternates: {
      canonical: `${domain}/blog/${params.slug}`,
    },
    openGraph: {
      url,
      title: docTitle,
      type: 'article',
      tags: page.data.keywords,
      authors: page.data.authors.map((author) => blogAuthors[author].name),
      description: page.data.description,
      images: imageUrl,
    },
  } satisfies Metadata;
}
