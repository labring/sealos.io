import { blog } from '@/lib/source';
import { DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import React from 'react';
import { generateBlogMetadata } from '@/lib/utils/metadata';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const page = blog.getPage([(await params).slug], (await params).lang);
  if (!page) notFound();

  const Content = page.data.body;

  return (
    <DocsBody>
      <Content
        components={{
          ...defaultMdxComponents,
          img: (props) => (
            <div className="image-container">
              <ImageZoom {...(props as any)} className="rounded-xl" />
              {props.alt && (
                <span className="image-caption">
                  {props.alt}
                </span>
              )}
            </div>
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

export const generateMetadata = generateBlogMetadata;
