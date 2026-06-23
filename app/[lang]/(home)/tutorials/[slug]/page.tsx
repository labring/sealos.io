import { Mermaid } from '@/components/mdx/mermaid';
import {
  getSortedTutorials,
  getTutorialPage,
} from '@/lib/utils/tutorial-utils';
import { generateTutorialMetadata } from '@/lib/utils/tutorial-metadata';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TutorialPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function TutorialPage({
  params,
}: TutorialPageProps): Promise<JSX.Element> {
  const resolvedParams = await params;
  const page = getTutorialPage(resolvedParams.slug, resolvedParams.lang);

  if (!page) notFound();

  const Content = page.data.body;

  return (
    <DocsBody>
      <Content
        components={{
          ...defaultMdxComponents,
          Mermaid,
          img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
            <div className="image-container">
              <ImageZoom {...props} className="rounded-xl" />
              {props.alt && <span className="image-caption">{props.alt}</span>}
            </div>
          ),
          p: ({
            children,
            ...props
          }: React.HTMLAttributes<HTMLParagraphElement>) => {
            const hasBlockContent = React.Children.toArray(children).some(
              (child) => {
                if (!React.isValidElement(child)) {
                  return false;
                }

                const childProps = child.props as { src?: unknown };

                return (
                  child.type === 'h5' ||
                  child.type === 'img' ||
                  childProps.src !== undefined
                );
              },
            );
            if (hasBlockContent) return <div {...props}>{children}</div>;
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
  );
}

export function generateStaticParams(): Array<{ slug: string }> {
  return getSortedTutorials().map((tutorial) => ({
    slug: tutorial.slugs[0],
  }));
}

export const generateMetadata = generateTutorialMetadata;
