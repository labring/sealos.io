import { blogAuthors, domain, siteConfig } from '@/config/site';
import { blog } from '@/lib/source';
import { source } from '@/lib/source';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

const ogImageApi = `${siteConfig.url.base}/api/og`;

export async function generateBlogMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const blogImageApi = `${ogImageApi}/blog/`;
  const params = await props.params;
  const page = blog.getPage([params.slug]);
  const isRootPage = !params.slug || params.slug.length === 0;

  if (!page && !isRootPage) notFound();

  let url = `${siteConfig.url.base}/blog`;
  let docTitle = 'Sealos Blog';
  let imageUrl = blogImageApi + docTitle;
  let description = 'Sealos Blog';
  let keywords = ['Sealos', 'Blog'];

  if (page) {
    url = `${siteConfig.url.base}/blog/${page.slugs.join('/')}`;
    imageUrl = blogImageApi + page.data.title;
    docTitle = `${page.data.title} | Sealos Blog`;
    description = page.data.description;
    keywords = page.data.keywords;
  }

  return {
    metadataBase: new URL(siteConfig.url.base),
    title: {
      absolute: docTitle,
    },
    description: description,
    keywords: keywords,
    alternates: {
      canonical: `${domain}/blog/${params.slug}`,
    },
    openGraph: {
      url,
      title: docTitle,
      description: description,
      tags: keywords,
      images: imageUrl,
      authors: page
        ? page.data.authors.map((author) => blogAuthors[author].name)
        : undefined,
      siteName: docTitle,
      type: page ? 'article' : 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title: docTitle,
      description: description,
      images: imageUrl,
    },
  };
}

export function generateDocsMetadata({
  params,
}: {
  params: { lang: string; slug?: string[] };
}) {
  const docsImageApi = `${ogImageApi}/docs/`;

  const page = source.getPage(params.slug, params.lang);
  if (!page) notFound();

  const fullPathTitle = page.slugs
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' > ');

  const url = `${siteConfig.url.base}/docs/${page.slugs.join('/')}`;
  const imageUrl =
    docsImageApi +
    (fullPathTitle ? fullPathTitle.toUpperCase() : 'Sealos Docs');

  const isRootPage = !params.slug || params.slug.length === 0;
  const docTitle = isRootPage
    ? 'Sealos Docs'
    : `${fullPathTitle} | Sealos Docs`;

  return {
    metadataBase: new URL(siteConfig.url.base),
    title: {
      absolute: docTitle,
    },
    description: page.data.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      url,
      title: docTitle,
      description: page.data.description,
      images: imageUrl,
      siteName: docTitle,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      title: docTitle,
      description: page.data.description,
      images: imageUrl,
    },
  } satisfies Metadata;
}

export function generateRootMetadata(): Metadata {
  return {
    title: {
      default: `${siteConfig.name} | ${siteConfig.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    alternates: {
      canonical: siteConfig.url.base,
    },
    openGraph: {
      type: 'website',
      url: siteConfig.url.base,
      siteName: `${siteConfig.name} | ${siteConfig.tagline}`,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteConfig.name} | ${siteConfig.tagline}`,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    metadataBase: new URL(siteConfig.url.base),
  };
}
