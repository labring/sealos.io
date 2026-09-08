import {
  ArticleFaq,
  articleMdxComponents,
} from '@/components/mdx/article-mdx-components';
import {
  getSortedTutorials,
  getTutorialPage,
} from '@/lib/utils/tutorial-utils';
import { generateTutorialMetadata } from '@/lib/utils/tutorial-metadata';
import { DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';

interface TutorialPageProps {
  params: Promise<{ lang: string; slug: string[] }>;
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
      <Content components={articleMdxComponents} />
      <ArticleFaq items={page.data.faq} />
    </DocsBody>
  );
}

export function generateStaticParams(): Array<{ slug: string[] }> {
  return getSortedTutorials().map((tutorial) => ({
    slug: tutorial.slugs,
  }));
}

export const generateMetadata = generateTutorialMetadata;
