import { blog } from '@/lib/source';
import { DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import React from 'react';
import { generateBlogMetadata } from '@/lib/utils/metadata';

import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;

  const page = blog.getPage([slug], lang);
  if (!page) notFound();

  const Content = page.data.body;

  const jsonLd = page.data.faq
    ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: await Promise.all(
        page.data.faq.map(async (item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: (
              await remark().use(remarkGfm).use(html).process(item.answer)
            ).toString(),
          },
        })),
      ),
    }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <DocsBody>
        <Content
          components={{
            ...defaultMdxComponents,
            img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
              <div className="image-container">
                <ImageZoom {...props} className="rounded-xl" />
                {props.alt && (
                  <span className="image-caption">{props.alt}</span>
                )}
              </div>
            ),
            p: ({
              children,
              ...props
            }: React.HTMLAttributes<HTMLParagraphElement>) => {
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
        {page.data.faq && page.data.faq.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">FAQ</h2>
            <Accordions type="multiple">
              {page.data.faq.map((item, index) => (
                <Accordion key={index} title={item.question}>
                  <Markdown remarkPlugins={[remarkGfm]}>{item.answer}</Markdown>
                </Accordion>
              ))}
            </Accordions>
          </div>
        )}
      </DocsBody>
    </>
  );
}

export function generateStaticParams() {
  return blog.generateParams().map((blog) => ({
    slug: blog.slug[0],
  }));
}

export const generateMetadata = generateBlogMetadata;
