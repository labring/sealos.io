import { Mermaid } from '@/components/mdx/mermaid';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ArticleImage(
  props: React.ImgHTMLAttributes<HTMLImageElement>,
): JSX.Element {
  return (
    <div className="image-container">
      <ImageZoom {...props} className="rounded-xl" />
      {props.alt && <span className="image-caption">{props.alt}</span>}
    </div>
  );
}

function ArticleParagraph({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>): JSX.Element {
  const hasBlockChild = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement<{ src?: unknown }>(child) &&
      (child.type === 'h5' || child.props.src !== undefined),
  );

  if (hasBlockChild) return <div {...props}>{children}</div>;
  return <p {...props}>{children}</p>;
}

export const articleMdxComponents = {
  ...defaultMdxComponents,
  Mermaid,
  img: ArticleImage,
  p: ArticleParagraph,
};

interface ArticleFaqProps {
  items?: ReadonlyArray<{
    answer: string;
    question: string;
  }>;
}

export function ArticleFaq({ items }: ArticleFaqProps): JSX.Element | null {
  if (!items?.length) return null;

  return (
    <div className="mt-12">
      <h2 className="mb-4 text-2xl font-bold">FAQ</h2>
      <Accordions type="multiple">
        {items.map((item, index) => (
          <Accordion key={index} title={item.question}>
            <Markdown remarkPlugins={[remarkGfm]}>{item.answer}</Markdown>
          </Accordion>
        ))}
      </Accordions>
    </div>
  );
}
