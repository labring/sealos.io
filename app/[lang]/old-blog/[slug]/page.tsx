import { blog } from '@/lib/source';
import RelatedArticles from '@/app/[lang]/blog/components/RelatedArticles';
import { getRelatedArticles } from '@/lib/utils/blog-utils';
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
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;

  const page = blog.getPage([slug], lang);
  if (!page) notFound();

  const candidateArticles = blog.getPages(lang);
  const recommendedArticles = getRelatedArticles(page, candidateArticles);
  const relatedArticlesToRender =
    recommendedArticles.length > 0 ? recommendedArticles : candidateArticles;

  const Content = page.data.body;

  return (
    <DocsBody>
      <Content
        components={{
          ...defaultMdxComponents,
          img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
            <div className="image-container">
              <ImageZoom {...props} className="rounded-xl" />
              {props.alt && (
                <span className="image-caption">
                  {props.alt}
                </span>
              )}
            </div>
          ),
          p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
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
      <RelatedArticles
        currentArticle={page}
        relatedArticles={relatedArticlesToRender}
        lang={lang}
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
