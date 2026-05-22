'use client';

import { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ExternalLink, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AppDetailConfig } from './app-detail-utils';

type ReadmeSource = {
  repoLabel: string;
  repoUrl: string;
  candidates: ReadmeCandidate[];
};

type ReadmeCandidate = {
  sourcePath: string;
  url: string;
  rawAssetBaseUrl: string;
  blobBaseUrl: string;
};

type ReadmeState =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; markdown: string; source: ReadmeCandidate }
  | { status: 'error' };

const README_FILENAMES = ['README.md', 'README.MD', 'Readme.md', 'readme.md'];
const README_DIRECTORIES = ['', 'docs'];
const ROOT_BRANCHES = ['HEAD', 'main', 'master'];

function isGithubUrl(value?: string): value is string {
  if (!value) return false;

  try {
    return new URL(value).hostname.toLowerCase() === 'github.com';
  } catch {
    return false;
  }
}

function encodePathSegments(segments: string[]) {
  return segments.map((segment) => encodeURIComponent(segment)).join('/');
}

function getAttr(attrs: string, name: string) {
  const pattern = new RegExp(`${name}\\s*=\\s*["']([^"']+)["']`, 'i');
  return attrs.match(pattern)?.[1];
}

function escapeMarkdownAlt(value: string) {
  return value.replace(/[[\]\\]/g, '\\$&');
}

function htmlImageToMarkdown(match: string, attrs: string) {
  const src = getAttr(attrs, 'src');
  if (!src) return match;

  const alt = getAttr(attrs, 'alt') || 'README image';
  return `![${escapeMarkdownAlt(alt)}](${src})`;
}

function htmlLinkToMarkdown(match: string, attrs: string, children: string) {
  const href = getAttr(attrs, 'href');
  if (!href) return children;

  return `[${children.replace(/\s+/g, ' ').trim()}](${href})`;
}

function buildReadmeCandidate({
  encodedOwner,
  encodedRepo,
  repoUrl,
  branch,
  pathParts,
}: {
  encodedOwner: string;
  encodedRepo: string;
  repoUrl: string;
  branch: string;
  pathParts: string[];
}): ReadmeCandidate {
  const encodedBranch = encodeURIComponent(branch);
  const encodedSourcePath = encodePathSegments(pathParts);
  const encodedDirectoryPath = encodePathSegments(pathParts.slice(0, -1));
  const rawAssetBaseUrl = [
    `https://raw.githubusercontent.com/${encodedOwner}/${encodedRepo}`,
    encodedBranch,
    encodedDirectoryPath,
  ]
    .filter(Boolean)
    .join('/');
  const blobBaseUrl = [repoUrl, 'blob', encodedBranch, encodedDirectoryPath]
    .filter(Boolean)
    .join('/');

  return {
    sourcePath: pathParts.join('/'),
    url: `https://raw.githubusercontent.com/${encodedOwner}/${encodedRepo}/${encodedBranch}/${encodedSourcePath}`,
    rawAssetBaseUrl: `${rawAssetBaseUrl}/`,
    blobBaseUrl: `${blobBaseUrl}/`,
  };
}

function buildReadmeCandidates({
  encodedOwner,
  encodedRepo,
  repoUrl,
  branch,
  basePathParts = [],
}: {
  encodedOwner: string;
  encodedRepo: string;
  repoUrl: string;
  branch: string;
  basePathParts?: string[];
}) {
  return README_DIRECTORIES.flatMap((directory) =>
    README_FILENAMES.map((filename) =>
      buildReadmeCandidate({
        encodedOwner,
        encodedRepo,
        repoUrl,
        branch,
        pathParts: [
          ...basePathParts,
          ...(directory ? [directory] : []),
          filename,
        ],
      }),
    ),
  );
}

export function normalizeGitHubMarkdown(markdown: string) {
  return markdown
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<source\b[^>]*\/?>/gi, '')
    .replace(
      /<a\b([^>]*)>([\s\S]*?)<\/a>/gi,
      (match, attrs: string, children: string) =>
        htmlLinkToMarkdown(match, attrs, children),
    )
    .replace(/<\/?(?:strong|b)\b[^>]*>/gi, '**')
    .replace(/<\/?(?:em|i)\b[^>]*>/gi, '*')
    .replace(/<\/?code\b[^>]*>/gi, '`')
    .replace(/<\/?(?:picture|p|div|span|center)\b[^>]*>/gi, '\n')
    .replace(/^[ \t]*<img\b([^>]*)\/?>[ \t]*$/gim, htmlImageToMarkdown)
    .replace(/<img\b([^>]*)\/?>/gi, htmlImageToMarkdown);
}

export function getReadmeSource(
  app: Pick<AppDetailConfig, 'github' | 'website'>,
): ReadmeSource | null {
  const githubUrl = isGithubUrl(app.github)
    ? app.github
    : isGithubUrl(app.website)
      ? app.website
      : undefined;

  if (!githubUrl) return null;

  const url = new URL(githubUrl);
  const [owner, repo, mode, branch, ...pathParts] = url.pathname
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean);

  if (!owner || !repo) return null;

  const repoLabel = `${owner}/${repo}`;
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const encodedOwner = encodeURIComponent(owner);
  const encodedRepo = encodeURIComponent(repo);

  if (mode === 'blob' && branch && pathParts.length > 0) {
    return {
      repoLabel,
      repoUrl,
      candidates: [
        buildReadmeCandidate({
          encodedOwner,
          encodedRepo,
          repoUrl,
          branch,
          pathParts,
        }),
      ],
    };
  }

  const scopedPathParts =
    mode === 'tree' && branch && pathParts.length > 0 ? pathParts : [];
  const branches = mode === 'tree' && branch ? [branch] : ROOT_BRANCHES;

  return {
    repoLabel,
    repoUrl,
    candidates: branches.flatMap((branchName) =>
      buildReadmeCandidates({
        encodedOwner,
        encodedRepo,
        repoUrl,
        branch: branchName,
        basePathParts: scopedPathParts,
      }),
    ),
  };
}

function isUnsafeUrl(value: string) {
  return /^(javascript|vbscript|data):/i.test(value.trim());
}

function resolveMarkdownUrl(
  value: string | undefined,
  source: ReadmeCandidate,
  kind: 'asset' | 'link',
) {
  if (!value || isUnsafeUrl(value)) return undefined;
  if (/^(https?:)?\/\//i.test(value) || /^(mailto|tel):/i.test(value)) {
    return value;
  }
  if (value.startsWith('#')) return value;

  const baseUrl =
    kind === 'asset' ? source.rawAssetBaseUrl : source.blobBaseUrl;

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

async function fetchReadme(source: ReadmeSource, signal: AbortSignal) {
  for (const candidate of source.candidates) {
    const response = await fetch(candidate.url, {
      signal,
      headers: {
        Accept: 'text/plain,text/markdown,*/*',
      },
    });

    if (!response.ok) continue;

    const markdown = (await response.text()).trim();
    if (markdown) {
      return {
        markdown: normalizeGitHubMarkdown(markdown),
        source: candidate,
      };
    }
  }

  throw new Error('README not found.');
}

function ReadmeFallback({ app }: { app: AppDetailConfig }) {
  const screenshot = app.screenshots?.[0];

  if (!screenshot) {
    return (
      <div
        aria-hidden="true"
        className="aspect-video min-h-[260px] bg-[#0d1117]"
      />
    );
  }

  return (
    <div className="relative aspect-video min-h-[260px] overflow-hidden bg-[#d8d8d8]">
      <img
        src={screenshot}
        alt={`${app.name} screenshot`}
        className="h-full w-full object-cover object-top"
        loading="lazy"
      />
    </div>
  );
}

function ReadmeLoading() {
  return (
    <div className="flex aspect-video min-h-[260px] items-center justify-center bg-[#0d1117] text-sm text-zinc-400">
      <span className="inline-flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading README from GitHub...
      </span>
    </div>
  );
}

export default function ReadmeMarkdownWindow({
  app,
}: {
  app: AppDetailConfig;
}) {
  const readmeSource = useMemo(
    () => getReadmeSource({ github: app.github, website: app.website }),
    [app.github, app.website],
  );
  const [readme, setReadme] = useState<ReadmeState>({ status: 'idle' });

  useEffect(() => {
    if (!readmeSource) {
      setReadme({ status: 'error' });
      return;
    }

    const controller = new AbortController();
    setReadme({ status: 'loading' });

    fetchReadme(readmeSource, controller.signal)
      .then(({ markdown, source }) => {
        setReadme({ status: 'ready', markdown, source });
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setReadme({ status: 'error' });
      });

    return () => controller.abort();
  }, [readmeSource]);

  if (!readmeSource || readme.status === 'error') {
    return <ReadmeFallback app={app} />;
  }

  if (readme.status !== 'ready') {
    return <ReadmeLoading />;
  }

  return (
    <div
      aria-label={`${app.name} README content`}
      className="aspect-video min-h-[260px] overflow-y-auto overscroll-contain bg-[#0d1117] px-5 py-6 text-sm text-zinc-300 [scrollbar-color:#335f91_#0d1117] [scrollbar-width:thin] sm:px-8"
      role="region"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs text-zinc-500">
        <a
          href={readmeSource.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-zinc-300 transition hover:text-[#69a3ff]"
        >
          {readmeSource.repoLabel}
          <ExternalLink className="h-3 w-3" />
        </a>
        <a
          href={readme.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 transition hover:text-[#69a3ff]"
        >
          Rendered from {readme.source.sourcePath}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const resolvedHref = resolveMarkdownUrl(
              href,
              readme.source,
              'link',
            );
            return (
              <a
                href={resolvedHref}
                target={
                  resolvedHref && !resolvedHref.startsWith('#')
                    ? '_blank'
                    : undefined
                }
                rel={
                  resolvedHref && !resolvedHref.startsWith('#')
                    ? 'noopener noreferrer'
                    : undefined
                }
                className="font-medium text-[#69a3ff] underline-offset-4 transition hover:text-[#9fc2ff] hover:underline"
              >
                {children}
              </a>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="my-5 border-l-2 border-[#69a3ff]/60 bg-white/[0.035] py-2 pr-4 pl-4 text-zinc-300">
              {children}
            </blockquote>
          ),
          code: ({ className, children }) => (
            <code
              className={cn(
                'rounded border border-white/10 bg-white/[0.055] px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-100',
                className,
              )}
            >
              {children}
            </code>
          ),
          h1: ({ children }) => (
            <h1 className="mt-0 mb-5 border-b border-white/10 pb-4 text-2xl leading-tight font-semibold text-zinc-50 sm:text-3xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-8 mb-4 border-b border-white/10 pb-2 text-xl leading-tight font-semibold text-zinc-50">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-7 mb-3 text-base font-semibold text-zinc-100">
              {children}
            </h3>
          ),
          hr: () => <hr className="my-7 border-white/10" />,
          img: ({ src, alt }) => {
            const resolvedSrc = resolveMarkdownUrl(src, readme.source, 'asset');

            if (!resolvedSrc) return null;

            return (
              <img
                src={resolvedSrc}
                alt={alt || ''}
                loading="lazy"
                className="my-5 max-h-[440px] w-full rounded-lg border border-white/10 object-contain"
              />
            );
          },
          li: ({ children }) => (
            <li className="my-1.5 pl-1 leading-7 text-zinc-300">{children}</li>
          ),
          ol: ({ children }) => (
            <ol className="my-4 list-decimal space-y-1 pl-6">{children}</ol>
          ),
          p: ({ children }) => (
            <p className="my-4 leading-7 text-zinc-300">{children}</p>
          ),
          pre: ({ children }) => (
            <pre className="my-5 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs leading-6 text-zinc-100">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="my-5 overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-white/10">{children}</tbody>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 align-top text-zinc-300">{children}</td>
          ),
          th: ({ children }) => (
            <th className="bg-white/[0.04] px-4 py-3 align-top font-semibold text-zinc-100">
              {children}
            </th>
          ),
          ul: ({ children }) => (
            <ul className="my-4 list-disc space-y-1 pl-6">{children}</ul>
          ),
        }}
      >
        {readme.markdown}
      </ReactMarkdown>
    </div>
  );
}
