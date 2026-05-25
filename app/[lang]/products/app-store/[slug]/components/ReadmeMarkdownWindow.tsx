import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArchiveIcon } from '@radix-ui/react-icons';
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

export type LoadedReadmeMarkdown = {
  markdown: string;
  source: ReadmeCandidate;
};

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

function buildDirectReadmeSource(readmeUrl: string): ReadmeSource | null {
  if (isUnsafeUrl(readmeUrl)) return null;

  try {
    const url = new URL(readmeUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const rawAssetBaseUrl = new URL('./', url).toString();

    let repoLabel = url.hostname;
    let repoUrl = readmeUrl;
    let blobBaseUrl = rawAssetBaseUrl;

    if (
      url.hostname.toLowerCase() === 'raw.githubusercontent.com' &&
      pathParts.length >= 4
    ) {
      const [owner, repo, branch, ...repoPathParts] = pathParts;
      const encodedOwner = encodeURIComponent(owner);
      const encodedRepo = encodeURIComponent(repo);
      const encodedBranch = encodeURIComponent(branch);
      const encodedDirectoryPath = encodePathSegments(
        repoPathParts.slice(0, -1),
      );

      repoLabel = `${owner}/${repo}`;
      repoUrl = `https://github.com/${encodedOwner}/${encodedRepo}`;
      blobBaseUrl = [repoUrl, 'blob', encodedBranch, encodedDirectoryPath]
        .filter(Boolean)
        .join('/');
      blobBaseUrl = `${blobBaseUrl}/`;
    }

    return {
      repoLabel,
      repoUrl,
      candidates: [
        {
          sourcePath: 'README.md',
          url: readmeUrl,
          rawAssetBaseUrl,
          blobBaseUrl,
        },
      ],
    };
  } catch {
    return null;
  }
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
  app: Pick<AppDetailConfig, 'readme' | 'github' | 'website'>,
): ReadmeSource | null {
  const readmeUrl = app.readme || undefined;
  if (readmeUrl) {
    const directSource = buildDirectReadmeSource(readmeUrl);
    if (directSource) return directSource;
  }

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

async function fetchReadme(source: ReadmeSource) {
  for (const candidate of source.candidates) {
    const response = await fetch(candidate.url, {
      cache: 'force-cache',
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

export async function loadReadmeMarkdown(
  app: Pick<AppDetailConfig, 'readme' | 'github' | 'website'>,
): Promise<LoadedReadmeMarkdown | null> {
  const readmeSource = getReadmeSource({
    readme: app.readme,
    github: app.github,
    website: app.website,
  });

  if (!readmeSource) return null;

  try {
    return await fetchReadme(readmeSource);
  } catch {
    return null;
  }
}

function ReadmeUnavailableNotice({ app }: { app: AppDetailConfig }) {
  return (
    <div className="absolute inset-x-4 bottom-4 z-10 rounded-2xl border border-white/10 bg-[#0d1117]/88 p-4 shadow-2xl shadow-black/40 backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.055] text-[#6ea2ff]">
          <ArchiveIcon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-sm font-semibold text-white">
            README preview is unavailable
          </h3>
          <p className="mt-1 text-xs leading-5 text-zinc-400">
            We could not load {app.name} README content, so this page keeps the
            app preview visible instead.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReadmeFallback({ app }: { app: AppDetailConfig }) {
  const screenshot = app.screenshots?.[0];

  if (!screenshot) {
    return (
      <div className="relative aspect-video min-h-[320px] overflow-hidden bg-[#0d1117]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,109,255,0.15),transparent_42%)]" />
        <div className="relative flex h-full min-h-[320px] items-center justify-center px-6">
          <ReadmeUnavailableNotice app={app} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video min-h-[320px] overflow-hidden bg-[#d8d8d8]">
      <Image
        src={screenshot}
        alt={`${app.name} screenshot`}
        fill
        className="object-cover object-top opacity-70"
        sizes="(max-width: 768px) 100vw, 1253px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/20 to-transparent" />
      <ReadmeUnavailableNotice app={app} />
    </div>
  );
}

export default function ReadmeMarkdownWindow({
  app,
  readme,
}: {
  app: AppDetailConfig;
  readme: LoadedReadmeMarkdown | null;
}) {
  if (!readme) {
    return <ReadmeFallback app={app} />;
  }

  return (
    <div
      aria-label={`${app.name} README content`}
      className="aspect-video min-h-[260px] overflow-y-auto overscroll-contain bg-[#0d1117] px-5 py-6 text-sm text-zinc-300 [scrollbar-color:#335f91_#0d1117] [scrollbar-width:thin] sm:px-8"
      role="region"
    >
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
