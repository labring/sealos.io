import { source } from '@/lib/source';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { generateDocsMetadata } from '@/lib/utils/metadata';

/**
 * Generate the correct GitHub file path based on language
 * @param filePath - The base file path from page.file.path
 * @param language - The current language (en, zh-cn, etc.)
 * @returns The correct GitHub file path with proper language suffix
 */
function getGithubFilePath(filePath: string, language: string): string {
  // Remove any existing language suffix from the file path
  const basePath = filePath.replace(/\.(zh-cn|en)\.mdx$/, '.mdx').replace(/\.mdx$/, '');

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
}: {
  params: { lang: string; slug?: string[] };
}) {
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{
        style: 'clerk',
        single: false,
      }}
      lastUpdate={
        page.data.lastModified ? new Date(page.data.lastModified) : undefined
      }
      editOnGithub={{
        owner: 'labring',
        repo: 'sealos.io',
        sha: 'main',
        // Generate correct file path based on language
        path: `content/docs/${getGithubFilePath(page.file.path, params.lang)}`,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            Tabs,
            Tab,
            img: (props) => (
              <ImageZoom {...(props as any)} className="rounded-xl" />
            ),
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export const generateMetadata = generateDocsMetadata;
