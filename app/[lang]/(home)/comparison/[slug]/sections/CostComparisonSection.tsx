'use client';

import type { ReactNode } from 'react';
import { ExternalLink, InfoIcon, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ComparisonConfig, COSTS, type CostRow } from '../../config/platforms';

interface CostComparisonSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

interface PlatformCostProps {
  icon: ReactNode;
  name: string;
  costData?: CostRow;
  percentage: number;
}

function PlatformCost({ icon, name, costData, percentage }: PlatformCostProps) {
  const isSealos = name.toLowerCase() === 'sealos';

  return (
    <div className="grid grid-cols-[minmax(7.5rem,auto)_minmax(2rem,1fr)_auto] items-center gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="flex size-5 shrink-0 items-center justify-center">
          {icon}
        </span>
        <div className="min-w-0">
          <span className="block truncate text-sm font-medium">{name}</span>
          <span
            className={cn(
              'mt-1 inline-block border px-1.5 py-0.5 text-[10px] leading-none',
              isSealos
                ? 'border-blue-400/25 bg-blue-400/10 text-blue-200'
                : 'border-white/10 bg-white/5 text-zinc-400',
            )}
          >
            {isSealos ? 'Fixed' : 'Estimate'}
          </span>
        </div>
      </div>
      <div className="relative h-1.5 min-w-8 overflow-hidden bg-zinc-800">
        <div
          role="progressbar"
          aria-valuenow={Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name} cost: ${costData?.cost ?? 'unavailable'}, ${percentage.toFixed(0)}% of highest cost`}
          className={cn(
            'absolute inset-y-0 left-0',
            isSealos ? 'bg-blue-500' : 'bg-zinc-500',
          )}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
      <span className="min-w-20 text-right font-mono text-sm font-semibold tabular-nums">
        {costData?.cost ?? '—'}
      </span>
    </div>
  );
}

const parseCost = (cost: string): number => {
  const match = cost.replaceAll(',', '').match(/\$(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
};

export function CostComparisonSection({
  firstPlatform,
  secondPlatform,
}: CostComparisonSectionProps) {
  return (
    <section className="container-compact pb-16 sm:pb-24">
      <div className="mb-10 max-w-3xl">
        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-blue-400">
          <span className="size-1.5 bg-blue-400" aria-hidden="true" />
          Cost evidence
        </p>
        <h2 className="mb-4 text-2xl font-semibold sm:text-3xl">
          {COSTS.title}
        </h2>
        <p className="text-muted-foreground max-w-3xl leading-7">
          {COSTS.description}
        </p>
      </div>

      <div className="hidden md:block">
        <div className="text-muted-foreground grid grid-cols-[minmax(10rem,0.75fr)_minmax(22rem,1.7fr)_minmax(9rem,0.55fr)] border-y border-white/10 px-4 py-4 text-xs font-medium">
          <span>Workload example</span>
          <span>Platform and monthly cost</span>
          <span className="text-right">Estimated difference</span>
        </div>

        {COSTS.rows.map((row, index) => {
          const firstCostData = firstPlatform.content.costs.rows[index];
          const secondCostData = secondPlatform.content.costs.rows[index];
          const firstCost = parseCost(firstCostData?.cost ?? '');
          const secondCost = parseCost(secondCostData?.cost ?? '');
          const highestCost = Math.max(firstCost, secondCost, 1);
          const savingsData = secondCostData?.sealosSavings;
          const savings =
            savingsData?.type === 'comparable' ? savingsData.savings : null;

          return (
            <div
              key={row.workload}
              className="grid grid-cols-[minmax(10rem,0.75fr)_minmax(22rem,1.7fr)_minmax(9rem,0.55fr)] items-center border-b border-white/10 px-4 py-7 transition-colors hover:bg-white/[0.02]"
            >
              <div>
                <p className="text-sm font-medium">{row.workload}</p>
                <p className="text-muted-foreground mt-2 text-sm">
                  {row.specs}
                </p>
              </div>
              <div className="space-y-5 pr-8">
                <PlatformCost
                  icon={firstPlatform.icon}
                  name={firstPlatform.name}
                  costData={firstCostData}
                  percentage={(firstCost / highestCost) * 100}
                />
                <PlatformCost
                  icon={secondPlatform.icon}
                  name={secondPlatform.name}
                  costData={secondCostData}
                  percentage={(secondCost / highestCost) * 100}
                />
              </div>
              <div className="text-right">
                {savings === null ? (
                  <span className="text-muted-foreground text-sm">
                    Not comparable
                  </span>
                ) : savings === 0 ? (
                  <span className="text-muted-foreground text-sm">Equal</span>
                ) : (
                  <span
                    className={cn(
                      'inline-flex items-center gap-1 text-sm font-medium',
                      savings > 0 ? 'text-blue-300' : 'text-zinc-300',
                    )}
                  >
                    {savings > 0 ? firstPlatform.name : secondPlatform.name}{' '}
                    {Math.abs(savings)}% lower
                    {savings > 0 && <TrendingDown className="size-3.5" />}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4 md:hidden">
        {COSTS.rows.map((row, index) => {
          const firstCostData = firstPlatform.content.costs.rows[index];
          const secondCostData = secondPlatform.content.costs.rows[index];
          const firstCost = parseCost(firstCostData?.cost ?? '');
          const secondCost = parseCost(secondCostData?.cost ?? '');
          const highestCost = Math.max(firstCost, secondCost, 1);
          const savingsData = secondCostData?.sealosSavings;
          const savings =
            savingsData?.type === 'comparable' ? savingsData.savings : null;

          return (
            <article
              key={row.workload}
              className="rounded-lg border border-white/10 bg-white/[0.025] p-5"
            >
              <h3 className="font-medium">{row.workload}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{row.specs}</p>
              <div className="mt-5 space-y-5 border-y border-white/10 py-5">
                <PlatformCost
                  icon={firstPlatform.icon}
                  name={firstPlatform.name}
                  costData={firstCostData}
                  percentage={(firstCost / highestCost) * 100}
                />
                <PlatformCost
                  icon={secondPlatform.icon}
                  name={secondPlatform.name}
                  costData={secondCostData}
                  percentage={(secondCost / highestCost) * 100}
                />
              </div>
              <p
                className={cn(
                  'mt-4 text-sm font-medium',
                  savings !== null && savings > 0
                    ? 'text-blue-300'
                    : 'text-zinc-300',
                )}
              >
                {savings === null
                  ? 'Cost comparison unavailable'
                  : savings === 0
                    ? 'Equal estimated monthly cost'
                    : `${savings > 0 ? firstPlatform.name : secondPlatform.name} ${Math.abs(savings)}% lower`}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 space-y-3">
        {firstPlatform.content.costs.note && (
          <p className="text-muted-foreground flex items-start gap-2 text-xs leading-5">
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            {firstPlatform.content.costs.note}
          </p>
        )}
        {secondPlatform.content.costs.note && (
          <p className="text-muted-foreground flex items-start gap-2 text-xs leading-5">
            <InfoIcon className="mt-0.5 size-4 shrink-0" />
            {secondPlatform.content.costs.note}
          </p>
        )}
        {(firstPlatform.content.costs.source ||
          secondPlatform.content.costs.source) && (
          <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            <ExternalLink className="size-4 shrink-0" />
            <span>Sources:</span>
            {firstPlatform.content.costs.source && (
              <a
                href={firstPlatform.content.costs.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-white/30 underline-offset-4 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
              >
                {firstPlatform.content.costs.source.label}
              </a>
            )}
            {firstPlatform.content.costs.source &&
              secondPlatform.content.costs.source && <span>·</span>}
            {secondPlatform.content.costs.source && (
              <a
                href={secondPlatform.content.costs.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline decoration-white/30 underline-offset-4 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
              >
                {secondPlatform.content.costs.source.label}
              </a>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
