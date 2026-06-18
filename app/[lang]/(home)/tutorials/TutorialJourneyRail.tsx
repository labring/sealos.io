import { cn } from '@/lib/utils';
import type { TutorialSummary } from '@/lib/utils/tutorial-utils';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Database,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { TutorialRequestGuideLink } from './TutorialRequestGuideLink';
import { TutorialStatusChip } from './TutorialStatusChip';
import {
  TUTORIAL_STAGES,
  getTutorialFrameworkMatrix,
  type TutorialInventoryItem,
  type TutorialStageDefinition,
} from './tutorial-growth-data';

const stageIcons = {
  deploy: Rocket,
  postgresql: Database,
  production: ShieldCheck,
} as const;

function AvailableTutorialCard({
  tutorial,
  stage,
}: {
  tutorial: TutorialSummary | undefined;
  stage: TutorialStageDefinition;
}) {
  if (!tutorial) return null;

  return (
    <Link
      href={tutorial.url}
      className="group block rounded-3xl border border-blue-400/25 bg-blue-400/[0.07] p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 active:translate-y-px"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <TutorialStatusChip status="available" />
        <span className="inline-flex min-h-7 items-center rounded-full border border-zinc-700 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-400">
          Next.js
        </span>
      </div>
      <h3 className="text-lg font-semibold leading-snug text-white transition-colors group-hover:text-blue-100">
        {tutorial.title}
      </h3>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
        {tutorial.description}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        {tutorial.estimatedReadingTime && (
          <span className="inline-flex items-center gap-2 text-zinc-500">
            <BookOpen size={14} aria-hidden="true" />
            {tutorial.estimatedReadingTime}
          </span>
        )}
        <span className="inline-flex items-center font-medium text-blue-100">
          {stage.availableCta}
          <ArrowRight
            size={15}
            className="ml-2 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}

function RequestChip({ item }: { item: TutorialInventoryItem }) {
  return (
    <TutorialRequestGuideLink
      framework={item.framework}
      stage={item.stage}
      stageLabel={item.stageLabel}
      slug={item.slug}
      status={item.status}
      source="journey-rail"
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-zinc-700 bg-white/[0.04] px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:-translate-y-0.5 hover:border-blue-300/50 hover:bg-blue-400/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 active:translate-y-px"
    >
      {item.framework}
    </TutorialRequestGuideLink>
  );
}

function JourneyLane({
  stage,
  index,
  availableTutorial,
}: {
  stage: TutorialStageDefinition;
  index: number;
  availableTutorial: TutorialSummary | undefined;
}) {
  const previewItems = getTutorialFrameworkMatrix()
    .map((row) => row.items.find((item) => item.stage === stage.id))
    .filter((item): item is TutorialInventoryItem => {
      if (!item) return false;
      return item.status !== 'available';
    })
    .slice(0, 6);
  const StageIcon = stageIcons[stage.id];

  return (
    <li
      className={cn(
        'relative',
        index === 1 && 'lg:pt-10',
        index === 2 && 'lg:pt-20',
      )}
    >
      <div className="absolute -left-[1.65rem] top-2 flex size-9 items-center justify-center rounded-full border border-zinc-700 bg-neutral-950 text-blue-100 lg:left-1/2 lg:top-0 lg:-translate-x-1/2">
        <StageIcon size={17} aria-hidden="true" />
      </div>
      <article className="min-h-full rounded-3xl border border-zinc-800 bg-white/[0.035] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.38)] backdrop-blur md:p-6 lg:mt-10">
        <div className="mb-4 inline-flex min-h-8 items-center gap-2 rounded-full border border-zinc-700 bg-neutral-950/70 px-3 py-1 text-sm font-medium text-zinc-400">
          <CheckCircle2 size={14} className="text-blue-100" aria-hidden="true" />
          {stage.label}
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">
          {stage.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {stage.intent}
        </p>
        <p className="mt-4 rounded-2xl border border-zinc-800 bg-neutral-950/70 p-4 text-sm leading-6 text-zinc-300">
          {stage.outcome}
        </p>

        <div className="mt-5">
          <AvailableTutorialCard tutorial={availableTutorial} stage={stage} />
        </div>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-zinc-200">Coming frameworks</p>
            <Link
              href="#frameworks"
              className="text-xs font-medium text-blue-100 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70"
            >
              View all 18
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {previewItems.map((item) => (
              <RequestChip key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </article>
    </li>
  );
}

export function TutorialStatusSummary() {
  const inventory = getTutorialFrameworkMatrix().flatMap((row) => row.items);
  const counts = [
    ['Available', inventory.filter((item) => item.status === 'available').length],
    [
      'Coming next',
      inventory.filter((item) => item.status === 'coming_next').length,
    ],
    ['Planned', inventory.filter((item) => item.status === 'planned').length],
  ] as const;

  return (
    <aside className="mx-auto mt-4 rounded-3xl border border-zinc-800 bg-white/[0.035] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur md:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:items-center">
        <div>
          <p className="text-sm font-medium text-zinc-400">Live inventory</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Public tutorials and requestable paths stay in one map.
          </h2>
        </div>
        <dl className="grid grid-cols-3 gap-3">
        {counts.map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-zinc-800 bg-neutral-950/70 p-3"
          >
            <dt className="text-xs text-zinc-500">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold text-white">{value}</dd>
          </div>
        ))}
      </dl>
      </div>
    </aside>
  );
}

export function TutorialJourneyRail({
  tutorialBySlug,
}: {
  tutorialBySlug: Map<string, TutorialSummary>;
}) {
  return (
    <section className="mx-auto mt-20 max-w-7xl" aria-labelledby="journey-heading">
      <div className="mb-8 max-w-3xl">
        <h2
          id="journey-heading"
          className="text-3xl font-semibold tracking-tight text-white md:text-4xl"
        >
          Deploy, add PostgreSQL, prepare production
        </h2>
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          Pick the job that matches your app today. The path keeps each guide
          tied to a concrete release outcome.
        </p>
      </div>

      <ol className="relative border-l border-zinc-800 pl-6 lg:grid lg:grid-cols-3 lg:gap-5 lg:border-l-0 lg:pl-0">
        <li
          aria-hidden="true"
          className="absolute left-0 top-6 hidden h-px w-full bg-gradient-to-r from-blue-300/35 via-zinc-700 to-white/10 lg:block"
        />
        {TUTORIAL_STAGES.map((stage, index) => (
          <JourneyLane
            key={stage.id}
            stage={stage}
            index={index}
            availableTutorial={tutorialBySlug.get(stage.availableSlug)}
          />
        ))}
      </ol>
    </section>
  );
}
