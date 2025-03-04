import { siteConfig } from '@/config/site';
import { source } from '@/lib/source';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';

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
      lastUpdate={page.data.lastModified ? new Date(page.data.lastModified) : undefined}
      editOnGithub={{
        owner: 'labring',
        repo: 'sealos-website',
        sha: 'main',
        // file path, make sure it's valid
        path: `content/docs/${page.file.path}`,
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

export function generateMetadata({
  params,
}: {
  params: { lang: string; slug?: string[] };
}) {
  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const url = `${siteConfig.url.base}/docs/${page.slugs.join('/')}`;

  const isRootPage = !params.slug || params.slug.length === 0;
  const docTitle = isRootPage ? 'Sealos Docs' : `${page.data.title} | Sealos Docs`;

  return {
    metadataBase: new URL(siteConfig.url.base),
    title: {
      absolute: docTitle
    },
    description: page.data.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title: docTitle,
      description: page.data.description,
      images: `${siteConfig.url.base}/images/banner.jpeg`,
      siteName: docTitle,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title: docTitle,
      description: page.data.description,
      images: `${siteConfig.url.base}/images/banner.jpeg`,
    },
  } satisfies Metadata;
}
