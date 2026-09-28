'use client';

import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowUpRight } from 'lucide-react';
import releaseSnapshot from '../releases-snapshot.json';

const GITHUB_RELEASES_URL =
  'https://api.github.com/repos/labring/brain/releases?per_page=30';

type SnapshotRelease = {
  version: string;
  publishedAt: string;
  href: string;
  body: string;
};

type GithubRelease = {
  tag_name: string;
  published_at: string;
  html_url: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
};

type DisplayRelease = {
  version: string;
  date: string;
  href: string;
  body: string;
};

function formatReleaseDate(publishedAt: string): string {
  return new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function toDisplayRelease(
  release: SnapshotRelease | GithubRelease,
): DisplayRelease {
  if ('tag_name' in release) {
    return {
      version: release.tag_name,
      date: formatReleaseDate(release.published_at),
      href: release.html_url,
      body: release.body ?? '',
    };
  }

  return {
    version: release.version,
    date: formatReleaseDate(release.publishedAt),
    href: release.href,
    body: release.body,
  };
}

// The committed snapshot is the initial render (full list, SEO-visible);
// the browser-side refresh below replaces it with live data on success and
// quietly keeps the snapshot when GitHub is rate-limited or unreachable.
const initialReleases: DisplayRelease[] = releaseSnapshot.map(toDisplayRelease);

function ReleaseCard({ release }: { release: DisplayRelease }) {
  return (
    <article className="relative border-l border-white/15 pl-6 sm:pl-10">
      <div className="absolute top-1 -left-[7px] flex size-3 items-center justify-center rounded-full bg-blue-300 ring-8 ring-black">
        <span className="size-1.5 rounded-full bg-blue-950" />
      </div>

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
          <span className="rounded-full border border-blue-300/30 bg-blue-300/10 px-3 py-1 font-medium text-blue-200">
            Brain {release.version}
          </span>
          <time dateTime={release.date}>{release.date}</time>
        </div>
        <a
          href={release.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-200"
        >
          View release
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>

      <div className="mb-10 rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur sm:p-6">
        <div className="text-sm leading-7 text-zinc-300">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-200 underline-offset-4 transition hover:text-blue-100 hover:underline"
                >
                  {children}
                </a>
              ),
              code: ({ children }) => (
                <code className="rounded border border-white/10 bg-white/[0.055] px-1.5 py-0.5 font-mono text-[0.9em] text-zinc-100">
                  {children}
                </code>
              ),
              h1: ({ children }) => (
                <h3 className="mt-0 mb-3 text-base font-semibold text-white">
                  {children}
                </h3>
              ),
              h2: ({ children }) => (
                <h3 className="mt-6 mb-3 text-base font-semibold text-white">
                  {children}
                </h3>
              ),
              h3: ({ children }) => (
                <h3 className="mt-6 mb-3 text-base font-semibold text-white">
                  {children}
                </h3>
              ),
              li: ({ children }) => (
                <li className="my-1.5 leading-7 text-zinc-400">{children}</li>
              ),
              ol: ({ children }) => (
                <ol className="my-4 list-decimal space-y-1 pl-6">{children}</ol>
              ),
              p: ({ children }) => <p className="my-4 leading-7">{children}</p>,
              pre: ({ children }) => (
                <pre className="my-4 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4 text-xs leading-6 text-zinc-100">
                  {children}
                </pre>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-zinc-100">
                  {children}
                </strong>
              ),
              ul: ({ children }) => (
                <ul className="my-4 list-disc space-y-1 pl-6">{children}</ul>
              ),
            }}
          >
            {release.body}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}

export default function ReleasesTimeline() {
  const [releases, setReleases] = useState<DisplayRelease[]>(initialReleases);

  useEffect(() => {
    const controller = new AbortController();

    fetch(GITHUB_RELEASES_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`GitHub API responded with ${response.status}`);
        }

        const data = (await response.json()) as GithubRelease[];
        const published = data
          .filter((release) => !release.draft && !release.prerelease)
          .map(toDisplayRelease);

        if (published.length > 0) {
          setReleases(published);
        }
      })
      .catch(() => {
        // Keep the committed snapshot; the page never shows a partial list.
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      {releases.map((release) => (
        <ReleaseCard key={release.version} release={release} />
      ))}
    </div>
  );
}
