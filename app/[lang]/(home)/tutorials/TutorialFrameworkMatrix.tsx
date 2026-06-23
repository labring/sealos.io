import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Clock3, Layers3 } from 'lucide-react';
import Link from 'next/link';
import { TutorialRequestGuideLink } from './TutorialRequestGuideLink';
import { TutorialStatusChip } from './TutorialStatusChip';
import {
  STATUS_LABELS,
  TUTORIAL_STAGES,
  getTutorialFrameworkMatrix,
  getTutorialInventoryItem,
  type TutorialInventoryItem,
} from './tutorial-growth-data';

function MatrixCell({ item }: { item: TutorialInventoryItem }) {
  if (item.status === 'available') {
    return (
      <Link
        href={`/tutorials/${item.slug}`}
        className="group flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-blue-400/25 bg-blue-400/[0.07] px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-blue-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 active:translate-y-px"
      >
        <span>
          <span className="block text-sm font-semibold text-white">
            {item.stageLabel}
          </span>
          <span className="mt-1 block text-xs text-blue-100/75">
            Available tutorial
          </span>
        </span>
        <ArrowRight
          size={15}
          className="text-blue-100 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    );
  }

  return (
    <TutorialRequestGuideLink
      framework={item.framework}
      stage={item.stage}
      stageLabel={item.stageLabel}
      slug={item.slug}
      status={item.status}
      source="framework-matrix"
      className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-white/[0.025] px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-blue-300/45 hover:bg-blue-400/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 active:translate-y-px"
    >
      <span>
        <span className="block text-sm font-semibold text-white">
          {item.stageLabel}
        </span>
        <span className="mt-1 block text-xs text-zinc-500">
          {STATUS_LABELS[item.status]}
        </span>
      </span>
      <TutorialStatusChip status={item.status} className="shrink-0" />
    </TutorialRequestGuideLink>
  );
}

export function TutorialFrameworkMatrix() {
  const matrix = getTutorialFrameworkMatrix();
  const comingSoonCount = matrix
    .flatMap((row) => row.items)
    .filter((item) => item.status === 'coming_next').length;
  const plannedCount = matrix
    .flatMap((row) => row.items)
    .filter((item) => item.status === 'planned').length;

  return (
    <section id="frameworks" className="mx-auto mt-24 max-w-7xl scroll-mt-28">
      <div className="mb-8 max-w-3xl">
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
          Framework paths by launch job
        </h2>
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          Next.js is the complete public path. The remaining entries collect
          demand without creating unpublished routes, sitemap entries, or
          canonical URLs.
        </p>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-400/20 bg-blue-400/[0.07] p-4">
          <div className="flex items-center gap-3 text-blue-100">
            <Clock3 size={17} aria-hidden="true" />
            <span className="text-sm font-medium">Coming next</span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-white">
            {comingSoonCount} requested paths
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-white/[0.03] p-4">
          <div className="flex items-center gap-3 text-zinc-300">
            <Layers3 size={17} aria-hidden="true" />
            <span className="text-sm font-medium">Planned inventory</span>
          </div>
          <p className="mt-3 text-2xl font-semibold tabular-nums text-white">
            {plannedCount} mapped paths
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {matrix.map((row) => (
          <article
            key={row.framework.key}
            className="grid gap-3 rounded-3xl border border-zinc-800 bg-white/[0.03] p-4 lg:grid-cols-[13rem_repeat(3,minmax(0,1fr))] lg:items-center"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {row.framework.name}
                </h3>
                {row.framework.key === 'nextjs' && (
                  <span className="inline-flex min-h-7 items-center rounded-full border border-blue-400/35 bg-blue-400/10 px-3 py-1 text-xs font-medium text-blue-100">
                    Default path
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-zinc-500">
                {row.framework.pathNote}
              </p>
            </div>
            {row.items.map((item) => (
              <MatrixCell key={item.slug} item={item} />
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}

export function TutorialRequestPanel() {
  const nextGuide = getTutorialInventoryItem(
    { key: 'react', name: 'React', pathNote: 'High-demand frontend path' },
    TUTORIAL_STAGES[0],
  );

  return (
    <section className="mx-auto mt-16 grid max-w-7xl gap-5 rounded-3xl border border-blue-400/20 bg-blue-400/[0.055] p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div>
        <div className="mb-3 inline-flex min-h-8 items-center gap-2 rounded-full border border-zinc-700 bg-neutral-950/70 px-3 py-1 text-xs font-medium text-zinc-400">
          <CheckCircle2 size={14} aria-hidden="true" />
          Request signal
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          Want a framework guide sooner?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Every unavailable guide records framework, stage, and slug intent when
          analytics is available. The same action opens a prefilled email; if
          mail does not open, use the contact page.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
        <TutorialRequestGuideLink
          framework={nextGuide.framework}
          stage={nextGuide.stage}
          stageLabel={nextGuide.stageLabel}
          slug={nextGuide.slug}
          status={nextGuide.status}
          source="framework-matrix"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-blue-300/35 bg-blue-400/12 px-5 py-3 text-sm font-semibold text-blue-50 transition-all hover:border-blue-100/70 hover:bg-blue-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 active:translate-y-px"
        >
          Request React Deploy
        </TutorialRequestGuideLink>
        <Button
          variant="outline"
          className="min-h-11 rounded-full border-white/10 bg-neutral-900/80 px-5 text-white transition-transform hover:bg-zinc-800 hover:text-white active:translate-y-px"
          asChild
        >
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    </section>
  );
}
