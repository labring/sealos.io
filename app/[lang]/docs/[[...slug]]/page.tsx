import AIShareButtons from '@/components/ai-share-buttons';
import { Mermaid } from '@/components/mdx/mermaid';
import PageActions from '@/components/page-actions';
import { languagesType } from '@/lib/i18n';
import { source } from '@/lib/source';
import { generateDocsMetadata, getPageUrl } from '@/lib/utils/metadata';
import { SealosBrandCard } from '@/new-components/SealosBrandCard';
import { SocialLinks } from '@/new-components/SocialLinks';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';

type DocsPageProps = {
  params: { lang: languagesType; slug?: string[] };
};

/**
 * Generate the correct GitHub file path based on language
 * @param filePath - The base file path from page.file.path
 * @param language - The current language (en, zh-cn, etc.)
 * @returns The correct GitHub file path with proper language suffix
 */
function getGithubFilePath(filePath: string, language: string): string {
  // Remove any existing language suffix from the file path
  const basePath = filePath
    .replace(/\.(zh-cn|en)\.mdx$/, '.mdx')
    .replace(/\.mdx$/, '');

  // Add the correct language suffix based on the current language
  if (language === 'zh-cn') {
    return `${basePath}.zh-cn.mdx`;
  } else {
    // For English and other languages, use .en.mdx suffix
    return `${basePath}.en.mdx`;
  }
}

export default async function Page({
  params,
}: DocsPageProps): Promise<JSX.Element> {
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;

  const githubFilePath = getGithubFilePath(page.file.path, params.lang);
  const pageUrl = getPageUrl(params.lang, page.url);
  const lastUpdate = page.data.lastModified
    ? new Date(page.data.lastModified)
    : undefined;

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{
        style: 'clerk',
        single: false,
        header: params.lang === 'en' && (
          <div className="mb-4">
            <SealosBrandCard />
            <SocialLinks url={pageUrl} title={page.data.title} />
          </div>
        ),
      }}
      lastUpdate={lastUpdate}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <PageActions
        lang={params.lang}
        githubUrl={`https://github.com/labring/sealos.io/blob/main/content/docs/${githubFilePath}`}
        markdownUrl={`https://raw.githubusercontent.com/labring/sealos.io/main/content/docs/${githubFilePath}`}
      />
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            Tabs,
            Tab,
            img: (props) => (
              <ImageZoom {...(props as any)} className="rounded-xl" />
            ),
            Mermaid,
          }}
        />
      </DocsBody>
      <AIShareButtons lang={params.lang} />
    </DocsPage>
  );
}

export async function generateStaticParams(): Promise<
  ReturnType<typeof source.generateParams>
> {
  return source.generateParams();
}

export const generateMetadata = generateDocsMetadata;
