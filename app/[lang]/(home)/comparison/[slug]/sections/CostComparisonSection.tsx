'use client';

import type { ReactNode } from 'react';
import { InfoIcon, TrendingDown, WebcamIcon } from 'lucide-react';
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
  isHigher: boolean;
}

function PlatformCost({
  icon,
  name,
  costData,
  percentage,
  isHigher,
}: PlatformCostProps) {
  return (
    <div className="grid grid-cols-[minmax(7rem,auto)_1fr_auto] items-center gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center">
          {icon}
        </span>
        <span className="truncate text-sm font-medium">{name}</span>
      </div>
      <div className="relative h-1.5 min-w-12 overflow-hidden rounded-full bg-zinc-800">
        <div
          role="progressbar"
          aria-valuenow={Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${name} cost: ${costData?.cost ?? 'unavailable'}, ${percentage.toFixed(0)}% of highest cost`}
          className={cn(
            'absolute inset-y-0 left-0 rounded-full',
            isHigher ? 'bg-zinc-500' : 'bg-blue-500',
          )}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
      <span className="min-w-20 text-right text-sm font-semibold">
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
      <div className="mb-10">
        <h2 className="mb-4 text-center text-2xl font-medium">{COSTS.title}</h2>
        <p className="text-muted-foreground mx-auto max-w-3xl text-center">
          {COSTS.description}
        </p>
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-[minmax(10rem,0.8fr)_minmax(22rem,1.6fr)_minmax(8rem,0.5fr)] border-y border-white/10 px-4 py-4 text-sm font-medium">
          <span>Workload example</span>
          <span>Platform and monthly cost</span>
          <span className="text-right">Difference</span>
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
              className="grid grid-cols-[minmax(10rem,0.8fr)_minmax(22rem,1.6fr)_minmax(8rem,0.5fr)] items-center border-b border-white/10 px-4 py-6"
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
                  isHigher={firstCost > secondCost}
                />
                <PlatformCost
                  icon={secondPlatform.icon}
                  name={secondPlatform.name}
                  costData={secondCostData}
                  percentage={(secondCost / highestCost) * 100}
                  isHigher={secondCost > firstCost}
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
                      savings > 0 ? 'text-green-500' : 'text-amber-400',
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
              className="rounded-lg border border-white/10 bg-zinc-900 p-5"
            >
              <h3 className="font-medium">{row.workload}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{row.specs}</p>
              <div className="mt-5 space-y-5 border-y border-white/10 py-5">
                <PlatformCost
                  icon={firstPlatform.icon}
                  name={firstPlatform.name}
                  costData={firstCostData}
                  percentage={(firstCost / highestCost) * 100}
                  isHigher={firstCost > secondCost}
                />
                <PlatformCost
                  icon={secondPlatform.icon}
                  name={secondPlatform.name}
                  costData={secondCostData}
                  percentage={(secondCost / highestCost) * 100}
                  isHigher={secondCost > firstCost}
                />
              </div>
              <p className="mt-4 text-sm font-medium">
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
            <WebcamIcon className="size-4 shrink-0" />
            <span>Sources:</span>
            {firstPlatform.content.costs.source && (
              <a
                href={firstPlatform.content.costs.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-4"
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
                className="text-foreground underline underline-offset-4"
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
