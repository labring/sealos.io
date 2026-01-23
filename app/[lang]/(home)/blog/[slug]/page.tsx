import { Mermaid } from '@/components/mdx/mermaid';
import { blog } from '@/lib/source';
import { generateBlogMetadata } from '@/lib/utils/metadata';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type BlogPageParams = {
  lang: string;
  slug: string;
};

type BlogPageProps = {
  params: Promise<BlogPageParams>;
};

export default async function BlogPage({
  params,
}: BlogPageProps): Promise<JSX.Element> {
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;

  const page = blog.getPage([slug], lang);
  if (!page) notFound();

  const Content = page.data.body;

  return (
    <>
      <DocsBody>
        <Content
          components={{
            ...defaultMdxComponents,
            Mermaid,
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

export function generateStaticParams(): Array<{ slug: string }> {
  return blog.generateParams().map((blog) => ({
    slug: blog.slug[0],
  }));
}

export const generateMetadata = generateBlogMetadata;
