'use client';

import { ComparisonConfig, COSTS } from '../../config/platforms';
import { TrendingDown, InfoIcon, WebcamIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CostComparisonSectionProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function CostComparisonSection({
  firstPlatform,
  secondPlatform,
}: CostComparisonSectionProps) {
  // Extract numeric values from cost strings for visualization
  const parseCost = (costStr: string): number => {
    const match = costStr.match(/\$(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  return (
    <section className="container-compact pb-16 sm:pb-24">
      <div className="mb-12">
        <h2 className="mb-6 text-center text-2xl font-medium">{COSTS.title}</h2>
        <p className="text-muted-foreground">{COSTS.description}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse whitespace-nowrap">
          <thead>
            <tr className="text-primary border-y text-lg">
              <th className="p-4 text-start font-normal">Workload Example</th>
              <th className="p-4 text-start font-normal" colSpan={2}>
                Cost Comparison
              </th>
              <th className="p-4 text-center font-normal">Savings</th>
            </tr>
          </thead>
          <tbody>
            {COSTS.rows.map((row, index) => {
              const firstCostData = firstPlatform.content.costs.rows[index];
              const secondCostData = secondPlatform.content.costs.rows[index];

              const firstCost = firstCostData?.cost || '';
              const secondCost = secondCostData?.cost || '';
              const firstCostNum = parseCost(firstCost);
              const secondCostNum = parseCost(secondCost);

              // Determine which price is higher
              const higherCost = Math.max(firstCostNum, secondCostNum, 1);

              // Calculate percentages: higher price = 100%, lower price = percentage of higher
              const firstPercentage =
                firstCostNum === higherCost
                  ? 100
                  : higherCost > 0
                    ? (firstCostNum / higherCost) * 100
                    : 0;
              const secondPercentage =
                secondCostNum === higherCost
                  ? 100
                  : higherCost > 0
                    ? (secondCostNum / higherCost) * 100
                    : 0;

              // Determine which platform has higher price for gradient styling
              // Price higher = gray gradient, price lower = blue gradient
              const firstIsHigher = firstCostNum > secondCostNum;
              const secondIsHigher = secondCostNum > firstCostNum;

              // Get savings from sealosSavings in the row
              const sealosSavingsData = secondCostData?.sealosSavings;

              let savings: number | null = null;
              let isInvalidComparison = false;

              if (sealosSavingsData) {
                if (sealosSavingsData.type === 'not-applicable') {
                  isInvalidComparison = true;
                } else if (sealosSavingsData.type === 'comparable') {
                  savings = sealosSavingsData.savings;
                }
              }

              return (
                <tr key={row.workload} className={cn('border-b')}>
                  <td className="w-[25%] px-4 py-6">
                    <div className="flex flex-col gap-3">
                      <div className="text-primary text-sm">{row.workload}</div>
                      <div className="text-muted-foreground text-sm">
                        {row.specs}
                      </div>
                    </div>
                  </td>
                  {/* Progress bars column */}
                  <td className="w-[25%] px-4 py-6">
                    <div className="flex flex-col gap-6">
                      {/* First Platform Progress Bar */}
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <div className="h-1.5 w-full rounded-full bg-zinc-800" />
                          <div
                            role="progressbar"
                            aria-valuenow={firstPercentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${firstPlatform.name} cost: ${firstCost}, ${firstPercentage.toFixed(0)}% of highest cost`}
                            className={cn(
                              'absolute top-0 h-1.5 rounded-full',
                              firstIsHigher
                                ? 'bg-gradient-to-r from-zinc-400 to-zinc-600'
                                : 'bg-gradient-to-r from-white to-blue-600',
                            )}
                            style={{
                              width: `${firstPercentage}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Second Platform Progress Bar */}
                      <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                          <div className="h-1.5 w-full rounded-full bg-zinc-800" />
                          <div
                            role="progressbar"
                            aria-valuenow={secondPercentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`${secondPlatform.name} cost: ${secondCost}, ${secondPercentage.toFixed(0)}% of highest cost`}
                            className={cn(
                              'absolute top-0 h-1.5 rounded-full',
                              secondIsHigher
                                ? 'bg-gradient-to-r from-zinc-400 to-zinc-600'
                                : 'bg-gradient-to-r from-white to-blue-600',
                            )}
                            style={{
                              width: `${secondPercentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Labels and costs column */}
                  <td className="w-[30%] px-4 py-6">
                    <div className="flex flex-col gap-3">
                      {/* First Platform Info */}
                      <div className="flex items-center gap-2">
                        <span className="text-primary text-sm">
                          {firstCost}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          | {firstCostData?.label || firstPlatform.name}
                        </span>
                      </div>

                      {/* Second Platform Info */}
                      <div className="flex items-center gap-2">
                        <span className="text-primary text-sm">
                          {secondCost}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          | {secondCostData?.label || secondPlatform.name}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="w-[20%] px-4 py-6 text-center">
                    {isInvalidComparison || savings === null ? (
                      <span className="text-muted-foreground text-sm">-</span>
                    ) : savings > 0 ? (
                      <div className="flex items-center justify-center gap-1 text-green-500">
                        <span className="text-sm">{savings}%</span>
                        <TrendingDown className="size-3.5" />
                      </div>
                    ) : savings < 0 ? (
                      <div className="flex items-center justify-center gap-1 text-red-500">
                        <span className="text-sm">{savings}%</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">0%</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-2">
        {firstPlatform.content.costs.note && (
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <InfoIcon size={16} />
            {firstPlatform.content.costs.note}
          </p>
        )}
        {secondPlatform.content.costs.note && (
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <InfoIcon size={16} />
            {secondPlatform.content.costs.note}
          </p>
        )}
        {(firstPlatform.content.costs.source ||
          secondPlatform.content.costs.source) && (
          <p className="text-muted-foreground mt-2 flex items-center gap-1 text-xs">
            <WebcamIcon size={16} />
            Sources:{' '}
            {firstPlatform.content.costs.source && (
              <a
                href={firstPlatform.content.costs.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {firstPlatform.content.costs.source.label}
              </a>
            )}
            {firstPlatform.content.costs.source &&
              secondPlatform.content.costs.source && <> | </>}
            {secondPlatform.content.costs.source && (
              <a
                href={secondPlatform.content.costs.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
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
