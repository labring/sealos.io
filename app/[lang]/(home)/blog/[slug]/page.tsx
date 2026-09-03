import {
  ArticleFaq,
  articleMdxComponents,
} from '@/components/mdx/article-mdx-components';
import { blog } from '@/lib/source';
import { generateBlogMetadata } from '@/lib/utils/metadata';
import { DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';

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
        <Content components={articleMdxComponents} />
        <ArticleFaq items={page.data.faq} />
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
