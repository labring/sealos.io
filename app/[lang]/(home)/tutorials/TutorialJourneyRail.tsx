import type { TutorialSummary } from '@/lib/utils/tutorial-utils';
import {
  ArrowRight,
  BookOpen,
  Database,
  Rocket,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { TutorialStatusChip } from './TutorialStatusChip';
import {
  TUTORIAL_STAGES,
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
  tutorial: TutorialSummary;
  stage: TutorialStageDefinition;
}) {
  return (
    <Link
      href={tutorial.url}
      className="group border-border bg-card text-card-foreground hover:border-primary/40 focus-visible:ring-ring block rounded-xl border p-5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <TutorialStatusChip status="available" />
        <span className="text-muted-foreground text-xs font-medium">
          {tutorial.framework}
        </span>
      </div>
      <h4 className="group-hover:text-primary leading-snug font-semibold transition-colors">
        {tutorial.title}
      </h4>
      <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-6">
        {tutorial.description}
      </p>
      <div className="text-muted-foreground mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        {tutorial.estimatedReadingTime && (
          <span className="inline-flex items-center gap-2">
            <BookOpen size={14} aria-hidden="true" />
            {tutorial.estimatedReadingTime}
          </span>
        )}
        <span className="text-primary inline-flex items-center font-medium">
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

function StageEntry({
  stage,
  tutorial,
}: {
  stage: TutorialStageDefinition;
  tutorial: TutorialSummary | undefined;
}) {
  if (tutorial) {
    return <AvailableTutorialCard tutorial={tutorial} stage={stage} />;
  }

  return (
    <Link
      href="#frameworks"
      className="text-primary focus-visible:ring-ring inline-flex items-center text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
    >
      Browse {stage.label} paths
      <ArrowRight size={15} className="ml-2" aria-hidden="true" />
    </Link>
  );
}

function JourneyLane({
  stage,
  availableTutorial,
}: {
  stage: TutorialStageDefinition;
  availableTutorial: TutorialSummary | undefined;
}) {
  const StageIcon = stageIcons[stage.id];

  return (
    <li>
      <article className="border-border bg-card text-card-foreground flex h-full flex-col rounded-xl border p-5 md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="bg-muted text-primary border-border flex size-9 items-center justify-center rounded-lg border">
            <StageIcon size={17} aria-hidden="true" />
          </div>
          <span className="text-muted-foreground text-sm font-medium">
            {stage.label}
          </span>
        </div>
        <h3 className="text-2xl font-semibold tracking-tight">{stage.title}</h3>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          {stage.intent}
        </p>
        <p className="bg-muted text-muted-foreground mt-4 rounded-lg p-4 text-sm leading-6">
          {stage.outcome}
        </p>
        <div className="mt-auto pt-6">
          <StageEntry stage={stage} tutorial={availableTutorial} />
        </div>
      </article>
    </li>
  );
}

export function TutorialJourneyRail({
  tutorialBySlug,
}: {
  tutorialBySlug: Map<string, TutorialSummary>;
}) {
  return (
    <section
      className="mx-auto mt-16 max-w-7xl"
      aria-labelledby="journey-heading"
    >
      <div className="mb-8 max-w-3xl">
        <h2
          id="journey-heading"
          className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl"
        >
          Deploy, add PostgreSQL, prepare production
        </h2>
        <p className="text-muted-foreground mt-4 text-sm leading-6">
          Pick the job that matches your app today. The path keeps each guide
          tied to a concrete release outcome.
        </p>
      </div>

      <ol className="grid gap-5 lg:grid-cols-3">
        {TUTORIAL_STAGES.map((stage) => (
          <JourneyLane
            key={stage.id}
            stage={stage}
            availableTutorial={tutorialBySlug.get(stage.availableSlug)}
          />
        ))}
      </ol>
    </section>
  );
}
