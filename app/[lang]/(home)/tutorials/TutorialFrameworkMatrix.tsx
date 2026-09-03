import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { TutorialRequestGuideLink } from './TutorialRequestGuideLink';
import { TutorialStatusChip } from './TutorialStatusChip';
import {
  STATUS_LABELS,
  TUTORIAL_STAGES,
  getTutorialFrameworkMatrix,
  getTutorialInventory,
  type TutorialInventoryItem,
} from './tutorial-growth-data';

function MatrixCell({ item }: { item: TutorialInventoryItem }) {
  if (item.status === 'available') {
    return (
      <Link
        href={`/tutorials/${item.slug}`}
        className="group focus-visible:ring-ring flex min-h-16 items-center justify-between gap-3 rounded-lg border border-blue-400/35 bg-blue-400/10 px-4 py-3 text-left transition-colors hover:border-blue-300/70 hover:bg-blue-400/15 focus-visible:ring-2 focus-visible:outline-none"
      >
        <span>
          <span className="text-foreground block text-sm font-semibold">
            {item.stageLabel}
          </span>
          <span className="mt-1 block text-xs text-blue-200">
            Available tutorial
          </span>
        </span>
        <ArrowRight
          size={15}
          className="text-primary transition-transform group-hover:translate-x-1"
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
      className="group border-border bg-card hover:border-primary/40 hover:bg-muted focus-visible:ring-ring flex min-h-16 items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <span>
        <span className="text-foreground block text-sm font-semibold">
          {item.stageLabel}
        </span>
        <span className="text-muted-foreground mt-1 block text-xs">
          {STATUS_LABELS[item.status]}
        </span>
      </span>
      <TutorialStatusChip status={item.status} className="shrink-0" />
    </TutorialRequestGuideLink>
  );
}

function getStatusCounts() {
  const inventory = getTutorialInventory();
  return [
    [
      'Available',
      inventory.filter((item) => item.status === 'available').length,
    ],
    [
      'Coming next',
      inventory.filter((item) => item.status === 'coming_next').length,
    ],
    ['Planned', inventory.filter((item) => item.status === 'planned').length],
  ] as const;
}

export function TutorialFrameworkMatrix() {
  const matrix = getTutorialFrameworkMatrix();

  return (
    <section id="frameworks" className="mx-auto mt-20 max-w-7xl scroll-mt-28">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="text-foreground text-3xl font-semibold tracking-tight md:text-4xl">
            Framework paths by launch job
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-6">
            Django Deploy is the qualified Core guide. Every planned framework,
            PostgreSQL, and production opportunity collects demand through the
            matrix until its implementation is ready to publish.
          </p>
        </div>
        <dl className="border-border grid grid-cols-3 gap-4 border-t pt-4 lg:min-w-96 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
          {getStatusCounts().map(([label, value]) => (
            <div key={label}>
              <dt className="text-muted-foreground text-xs">{label}</dt>
              <dd className="text-foreground mt-1 text-2xl font-semibold tabular-nums">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-border bg-card overflow-hidden rounded-xl border">
        <div className="text-muted-foreground border-border bg-muted hidden grid-cols-[13rem_repeat(3,minmax(0,1fr))] gap-3 border-b px-4 py-3 text-xs font-medium tracking-wide uppercase lg:grid">
          <span>Framework</span>
          {TUTORIAL_STAGES.map((stage) => (
            <span key={stage.id}>{stage.label}</span>
          ))}
        </div>
        {matrix.map((row) => (
          <article
            key={row.framework.key}
            className="border-border grid gap-3 border-b p-4 last:border-b-0 lg:grid-cols-[13rem_repeat(3,minmax(0,1fr))] lg:items-center"
          >
            <div className="lg:pr-4">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-foreground text-lg font-semibold">
                  {row.framework.name}
                </h3>
                {row.framework.key === 'django' && (
                  <span className="text-primary text-xs font-medium">
                    Published path
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-2 text-sm">
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
  return (
    <p className="text-muted-foreground border-border mx-auto mt-8 max-w-7xl border-t pt-6 text-sm leading-6">
      Select a planned matrix cell to request a framework guide with a prefilled
      email, or{' '}
      <Link
        href="/contact"
        className="text-primary focus-visible:ring-ring font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
      >
        contact us directly
      </Link>
      .
    </p>
  );
}
