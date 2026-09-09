import { SealosBrandCard } from '@/new-components/SealosBrandCard';
import { SocialLinks } from '@/new-components/SocialLinks';
import { DocsLayout, type DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import { DocsPage, type DocsPageProps } from 'fumadocs-ui/page';
import type { ReactNode } from 'react';

const articleLayoutStyles = `
  #nd-subnav {
    display: none;
  }

  .article-content img {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }

  .article-content :not(pre) > code {
    overflow-wrap: anywhere;
  }

  #nd-docs-layout.article-detail-layout {
    gap: 4rem;
    --fd-nav-height: 96px !important;
  }

  #nd-docs-layout.article-detail-layout #nd-page > article {
    margin-left: auto !important;
    margin-right: auto !important;
  }

  #nd-docs-layout.article-detail-layout #nd-page > :first-child {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  #nd-docs-layout.article-detail-layout #nd-tocnav {
    margin: 0.5rem auto 0;
    border: 1px solid var(--color-border);
    border-radius: 20px;
  }

  @media (min-width: 40rem) {
    #nd-docs-layout.article-detail-layout #nd-page > :first-child {
      max-width: 40rem;
    }
  }

  @media (min-width: 48rem) {
    #nd-docs-layout.article-detail-layout #nd-page > :first-child {
      max-width: 48rem;
    }
  }

  @media (min-width: 64rem) {
    #nd-docs-layout.article-detail-layout #nd-page > :first-child {
      max-width: 64rem;
    }
  }

  @media (min-width: 80rem) {
    #nd-docs-layout.article-detail-layout {
      width: 100%;
      margin-left: auto;
      margin-right: auto;
      --fd-toc-width: 360px !important;
    }

    #nd-docs-layout.article-detail-layout #nd-page > :first-child {
      max-width: 80rem;
    }
  }

  @media (min-width: 96rem) {
    #nd-docs-layout.article-detail-layout #nd-page > :first-child {
      max-width: 96rem;
    }
  }
`;

interface ArticleTocHeaderProps {
  className?: string;
  title: string;
  url: string;
}

export function ArticleBadge({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <span className="bg-primary/5 border-primary/5 text-primary flex items-center gap-1 rounded-lg border border-dashed px-3 py-2 text-xs font-medium">
      <span className="block size-1.5 rounded-full bg-blue-400" />
      {children}
    </span>
  );
}

export function ArticleTocHeader({
  className = 'mb-4',
  title,
  url,
}: ArticleTocHeaderProps): JSX.Element {
  return (
    <div className={className}>
      <SealosBrandCard />
      <SocialLinks url={url} title={title} />
    </div>
  );
}

interface ArticleDetailShellProps {
  children: ReactNode;
  footer: DocsPageProps['footer'];
  pageTree: DocsLayoutProps['tree'];
  title: string;
  toc: DocsPageProps['toc'];
  url: string;
}

export function ArticleDetailShell({
  children,
  footer,
  pageTree,
  title,
  toc,
  url,
}: ArticleDetailShellProps): JSX.Element {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: articleLayoutStyles }} />

      <DocsLayout
        sidebar={{ enabled: false, tabs: false }}
        tree={pageTree}
        containerProps={{ className: 'article-detail-layout' }}
      >
        <DocsPage
          toc={toc}
          tableOfContent={{
            style: 'clerk',
            single: false,
            header: <ArticleTocHeader url={url} title={title} />,
          }}
          tableOfContentPopover={{ style: 'normal' }}
          breadcrumb={{ enabled: false }}
          footer={footer}
        >
          <article className="custom-container w-full max-w-[900px]">
            {children}
          </article>
        </DocsPage>
      </DocsLayout>
    </>
  );
}
