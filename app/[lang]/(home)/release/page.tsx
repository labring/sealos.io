import { GradientText } from '@/new-components/GradientText';
import { PageTopRays } from '@/new-components/SideRays';
import { generatePageMetadata } from '@/lib/utils/metadata';
import type { languagesType } from '@/lib/i18n';
import type { Metadata } from 'next';
import { ArrowUpRight, Check, CircleDot, Package, Wrench } from 'lucide-react';

type ReleaseSection = {
  title: 'Added' | 'Changed' | 'Fixed' | 'Upgrade notes' | 'Release assets';
  items: string[];
  icon: typeof Check;
};

type ProductRelease = {
  version: string;
  product: string;
  date: string;
  headline: string;
  summary: string;
  href: string;
  sections: ReleaseSection[];
};

const releases: ProductRelease[] = [
  {
    version: 'v2.0.14',
    product: 'Brain',
    date: 'September 10, 2026',
    headline: 'A more capable Project Assistant',
    summary:
      'Project Assistant can now use Template README context, while managed deployments become more reliable and easier to trace.',
    href: 'https://github.com/labring/brain/releases/tag/v2.0.14',
    sections: [
      {
        title: 'Added',
        icon: Package,
        items: [
          "Project Assistant can use a project's Template README to answer setup and configuration questions.",
          'Template resolution considers deployment sources and adopted instances, with a clear selection path when several templates are available.',
          'README fetching now supports cancellation, time limits, and response-size limits.',
        ],
      },
      {
        title: 'Changed',
        icon: Wrench,
        items: [
          'Chat guidance gives clearer context about Sealos capabilities, workspace context, and user intent.',
          'Langfuse traces are grouped by verified workspace namespace for easier investigation.',
        ],
      },
      {
        title: 'Fixed',
        icon: Check,
        items: [
          'Managed deployment setup now writes ownership labels atomically, preserves the runtime kubeconfig location, and derives region settings from the request kubeconfig.',
          'Repeated tool calls, retries, cancellation, and superseded operations now follow consistent handling.',
          'New GitHub Deploy Devboxes once again receive LANGFUSE_* environment forwarding for Codex tracing.',
        ],
      },
      {
        title: 'Upgrade notes',
        icon: CircleDot,
        items: [
          'No database migrations or new operator environment variables are required.',
          'Template README access requires Template Provider support and a recorded Template source in the project.',
          'Existing Deploy Devboxes keep their current environment; restored Langfuse settings apply only to newly created Devboxes.',
          'No breaking changes were identified in this release.',
        ],
      },
      {
        title: 'Release assets',
        icon: Package,
        items: [
          'Linux/amd64 images are published for API, UI, registry, and WhoDB.',
          'Validation passed typecheck, checks, diff validation, and 174 focused tests.',
        ],
      },
    ],
  },
];

export function generateMetadata({
  params,
}: {
  params: { lang: languagesType };
}): Metadata {
  return generatePageMetadata({
    title: 'Product Releases',
    description: 'Follow the latest Sealos product releases and improvements.',
    pathname: '/release',
    lang: params.lang,
  });
}

export default function ReleasePage() {
  return (
    <>
      <PageTopRays />

      <main className="container -mt-24 pt-44 pb-24">
        <header className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium tracking-[0.18em] text-zinc-400 uppercase">
            Product updates
          </p>
          <h1 className="text-4xl leading-tight font-medium sm:text-5xl">
            <GradientText>Product releases</GradientText>
          </h1>
          <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
            A clear record of what shipped, why it matters, and where to find
            the details.
          </p>
        </header>

        <div className="mx-auto max-w-4xl">
          {releases.map((release) => (
            <article
              key={`${release.product}-${release.version}`}
              className="relative border-l border-white/15 pl-6 sm:pl-10"
            >
              <div className="absolute top-1 -left-[7px] flex size-3 items-center justify-center rounded-full bg-blue-300 ring-8 ring-black">
                <span className="size-1.5 rounded-full bg-blue-950" />
              </div>

              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                    <span className="rounded-full border border-blue-300/30 bg-blue-300/10 px-3 py-1 font-medium text-blue-200">
                      {release.product} {release.version}
                    </span>
                    <time dateTime="2026-09-10">{release.date}</time>
                  </div>
                  <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                    {release.headline}
                  </h2>
                  <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
                    {release.summary}
                  </p>
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

              <div className="grid gap-4 sm:grid-cols-2">
                {release.sections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <section
                      key={section.title}
                      className="rounded-xl border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur sm:p-6"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-white/10 text-blue-200">
                          <Icon size={16} aria-hidden="true" />
                        </div>
                        <h3 className="font-semibold text-white">
                          {section.title}
                        </h3>
                      </div>
                      <ul className="space-y-3">
                        {section.items.map((item) => (
                          <li
                            key={item}
                            className="text-sm leading-6 text-zinc-400"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <p className="mx-auto mt-16 max-w-2xl text-center text-sm leading-6 text-zinc-500">
          Releases are written for people using Sealos day to day: concise,
          benefit-led, and linked to the source notes for deeper context.
        </p>
      </main>
    </>
  );
}
