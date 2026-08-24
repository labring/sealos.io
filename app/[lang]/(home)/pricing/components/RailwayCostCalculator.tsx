'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import RailwayIcon from '@/assets/platform-icons/railway.svg';
import SealosIcon from '@/assets/shared-icons/sealos.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGTM } from '@/hooks/use-gtm';
import { getLanguageSlug } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { railwayComparablePlans, type PricingPlanId } from '../config/plans';
import {
  DEFAULT_RAILWAY_UTILIZATION,
  RAILWAY_RATE_CARD,
  calculateBreakEvenUtilization,
  calculateCostDifference,
  estimateRailwayMonthlyCost,
  formatUsd,
  type RailwayCostInput,
} from '../config/railway-cost';

const utilizationOptions = [10, 25, 50, 100] as const;
type Utilization = (typeof utilizationOptions)[number];

interface RailwayCostCalculatorProps {
  lang: string;
}

const buildInputs = (
  plan: (typeof railwayComparablePlans)[number],
  utilization: number,
): RailwayCostInput => ({
  averageVcpu: plan.resources.cpu * (utilization / 100),
  averageRamGb: plan.resources.ram * (utilization / 100),
  volumeGb: plan.resources.disk,
  egressGb: plan.resources.traffic,
});

export function RailwayCostCalculator({ lang }: RailwayCostCalculatorProps) {
  const { trackCustom } = useGTM();
  const sectionRef = useRef<HTMLElement>(null);
  const hasTrackedView = useRef(false);
  const defaultPlan = railwayComparablePlans.find(
    ({ planId }) => planId === 'hobby',
  )!;
  const [selectedPlanId, setSelectedPlanId] = useState<PricingPlanId>('hobby');
  const [utilization, setUtilization] = useState<Utilization>(
    DEFAULT_RAILWAY_UTILIZATION,
  );
  const [inputs, setInputs] = useState<RailwayCostInput>(() =>
    buildInputs(defaultPlan, DEFAULT_RAILWAY_UTILIZATION),
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const selectedPlan =
    railwayComparablePlans.find(({ planId }) => planId === selectedPlanId) ??
    defaultPlan;

  const selectPlan = useCallback(
    (planId: PricingPlanId, shouldTrack: boolean) => {
      const plan = railwayComparablePlans.find(
        (candidate) => candidate.planId === planId,
      );
      if (!plan) return;

      setSelectedPlanId(plan.planId);
      setInputs(buildInputs(plan, utilization));
      if (shouldTrack) {
        trackCustom('pricing_compare_plan_selected', {
          plan_id: plan.planId,
          location: 'railway_calculator',
        });
      }
    },
    [trackCustom, utilization],
  );

  useEffect(() => {
    const handleExternalPlanSelection = (
      event: Event & { detail?: { planId?: PricingPlanId } },
    ) => {
      if (event.detail?.planId) selectPlan(event.detail.planId, false);
    };

    window.addEventListener(
      'pricing:compare-plan',
      handleExternalPlanSelection as EventListener,
    );
    return () =>
      window.removeEventListener(
        'pricing:compare-plan',
        handleExternalPlanSelection as EventListener,
      );
  }, [selectPlan]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTrackedView.current) {
          hasTrackedView.current = true;
          trackCustom('pricing_railway_compare_viewed', {
            default_plan_id: 'hobby',
            default_utilization: DEFAULT_RAILWAY_UTILIZATION,
          });
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [trackCustom]);

  const estimate = useMemo(() => estimateRailwayMonthlyCost(inputs), [inputs]);
  const railwayPlan = RAILWAY_RATE_CARD.plans[estimate.selectedPlan];
  const difference = calculateCostDifference(
    selectedPlan.monthlyPrice,
    estimate.total,
  );
  const crossover = calculateBreakEvenUtilization({
    sealosMonthlyPrice: selectedPlan.monthlyPrice,
    cpu: selectedPlan.resources.cpu,
    ram: selectedPlan.resources.ram,
    volume: inputs.volumeGb,
    egress: inputs.egressGb,
    railwayPlan: estimate.selectedPlan,
  });

  const handleUtilizationChange = (nextUtilization: Utilization) => {
    setUtilization(nextUtilization);
    setInputs(buildInputs(selectedPlan, nextUtilization));
    trackCustom('pricing_utilization_changed', {
      plan_id: selectedPlan.planId,
      utilization: nextUtilization,
    });
  };

  const updateInput = (key: keyof RailwayCostInput, value: string) => {
    const parsed = Number(value);
    setInputs((current) => ({
      ...current,
      [key]: Number.isFinite(parsed) ? Math.max(0, parsed) : 0,
    }));
  };

  const handleAdvancedBlur = (field: keyof RailwayCostInput) => {
    trackCustom('pricing_utilization_changed', {
      plan_id: selectedPlan.planId,
      utilization: 'custom',
      field,
      value: inputs[field],
    });
  };

  const handleSourceClick = (source: string) => {
    trackCustom('pricing_source_clicked', {
      source,
      plan_id: selectedPlan.planId,
    });
  };

  const handleChoosePlan = () => {
    trackCustom('pricing_plan_selected', {
      plan_id: selectedPlan.planId,
      plan_price: selectedPlan.monthlyPrice,
      location: 'railway_calculator',
    });
    if (selectedPlan.action.type === 'direct') {
      window.open(selectedPlan.action.url, '_blank', 'noopener,noreferrer');
    }
  };

  const comparisonMessage = estimate.validationResult.valid
    ? difference.lowerCost === 'equal'
      ? 'Both options have the same estimated monthly cost.'
      : `${difference.lowerCost === 'sealos' ? 'Sealos' : 'Railway'} is estimated to cost ${formatUsd(difference.amount)} (${difference.percentage}%) less than ${difference.lowerCost === 'sealos' ? 'Railway' : 'Sealos'} in this example.`
    : estimate.validationResult.message;
  const lowerCostName = estimate.validationResult.valid
    ? difference.lowerCost === 'equal'
      ? 'Equal estimated cost'
      : `${difference.lowerCost === 'sealos' ? 'Sealos' : 'Railway'} lower`
    : 'Plan validation required';
  const currentComputeUtilization = Math.max(
    0,
    Math.min(
      100,
      ((inputs.averageVcpu / selectedPlan.resources.cpu +
        inputs.averageRamGb / selectedPlan.resources.ram) /
        2) *
        100,
    ),
  );
  const markerTransform = (position: number) => {
    if (position <= 8) return 'translateX(0)';
    if (position >= 92) return 'translateX(-100%)';
    return 'translateX(-50%)';
  };
  const getLowerCostAtUtilization = (percentage: number) =>
    calculateCostDifference(
      selectedPlan.monthlyPrice,
      estimateRailwayMonthlyCost(
        {
          averageVcpu: selectedPlan.resources.cpu * (percentage / 100),
          averageRamGb: selectedPlan.resources.ram * (percentage / 100),
          volumeGb: inputs.volumeGb,
          egressGb: inputs.egressGb,
        },
        estimate.selectedPlan,
      ).total,
    ).lowerCost;
  const lowerCostAtZero = getLowerCostAtUtilization(0);
  const lowerCostAtFull = getLowerCostAtUtilization(100);
  const interiorCrossover =
    crossover !== null && crossover > 0 && crossover < 100 ? crossover : null;
  const lowerCostLabel = (
    lowerCost: ReturnType<typeof calculateCostDifference>['lowerCost'],
  ) =>
    lowerCost === 'equal'
      ? 'Equal cost'
      : `${lowerCost === 'sealos' ? 'Sealos' : 'Railway'} lower`;
  const fullRangeLabel =
    lowerCostAtZero === lowerCostAtFull
      ? `${lowerCostLabel(lowerCostAtFull)} across 0–100%`
      : `${lowerCostLabel(lowerCostAtZero)} at low use · ${lowerCostLabel(lowerCostAtFull)} at full use`;
  const costLineItems = [
    {
      label: 'CPU',
      value: estimate.cpu,
      rate: `${formatUsd(RAILWAY_RATE_CARD.cpuPerVcpuMonth)} / avg vCPU`,
    },
    {
      label: 'RAM',
      value: estimate.ram,
      rate: `${formatUsd(RAILWAY_RATE_CARD.ramPerGbMonth)} / avg GB`,
    },
    {
      label: 'Volume',
      value: estimate.volume,
      rate: `${formatUsd(RAILWAY_RATE_CARD.volumePerGbMonth)} / GB`,
    },
    {
      label: 'Egress',
      value: estimate.egress,
      rate: `${formatUsd(RAILWAY_RATE_CARD.egressPerGb)} / GB`,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="railway-cost"
      className="scroll-mt-20 border-y border-white/10 bg-zinc-950/60 py-24 sm:py-28"
    >
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-medium text-blue-400">
              <span className="size-1.5 bg-blue-400" aria-hidden="true" />
              Cost comparison
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-balance sm:text-4xl">
              Same workload inputs. Different billing models.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl leading-7 text-pretty">
              Sealos provides the listed resources for a known monthly plan
              price. Railway bills measured CPU, memory, volume, and egress.
              This estimate uses Railway {railwayPlan.name}&apos;s{' '}
              {formatUsd(estimate.planMinimum)} monthly subscription, which
              includes {formatUsd(estimate.planIncludedUsage)} of resource
              usage. {estimate.validationResult.message}
            </p>
            <Link
              href={`${getLanguageSlug(lang)}/railway-alternative/`}
              onClick={() => handleSourceClick('railway_alternative_page')}
              className="text-foreground mt-4 inline-flex items-center text-sm underline decoration-white/30 underline-offset-4 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
            >
              Evaluate the Railway alternative and migration path
              <ArrowRight className="ml-1.5 size-3.5" />
            </Link>
          </div>
          <div className="flex flex-col items-start gap-1 lg:items-end lg:text-right">
            <a
              href={RAILWAY_RATE_CARD.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSourceClick('railway_pricing_plans')}
              className="inline-flex items-center text-sm font-medium text-zinc-200 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
            >
              Official Railway pricing and usage rates
              <ExternalLink className="ml-1.5 size-3.5" />
            </a>
            <p className="text-muted-foreground text-xs">
              Verified {RAILWAY_RATE_CARD.verifiedAt}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-7 border-y border-white/10 py-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-medium">Sealos plan</p>
            <div
              className="grid grid-cols-2 rounded-lg border border-white/10 bg-black/20 p-1 sm:grid-cols-4"
              role="group"
              aria-label="Sealos plan"
            >
              {railwayComparablePlans.map((plan) => (
                <button
                  key={plan.planId}
                  type="button"
                  aria-pressed={selectedPlan.planId === plan.planId}
                  onClick={() => selectPlan(plan.planId, true)}
                  className={cn(
                    'h-10 rounded-md px-3 text-sm font-medium transition duration-200 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none active:translate-y-px motion-reduce:transition-none',
                    selectedPlan.planId === plan.planId
                      ? 'bg-white text-zinc-950'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {plan.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium">
              Average CPU and RAM utilization
            </p>
            <div
              className="grid grid-cols-4 rounded-lg border border-white/10 bg-black/20 p-1"
              role="group"
              aria-label="Average CPU and RAM utilization"
            >
              {utilizationOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={utilization === option}
                  onClick={() => handleUtilizationChange(option)}
                  className={cn(
                    'h-10 min-w-0 rounded-md px-2 text-sm font-medium transition duration-200 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none active:translate-y-px motion-reduce:transition-none sm:min-w-16 sm:px-3',
                    utilization === option
                      ? 'bg-white text-zinc-950'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {option}%
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <article className="flex min-h-72 flex-col rounded-lg border border-blue-400/40 bg-blue-500/[0.06] p-6 shadow-[0_24px_70px_-44px_rgba(59,130,246,0.8)] sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-md bg-white p-2">
                  <Image src={SealosIcon} alt="Sealos" width={28} height={28} />
                </div>
                <div>
                  <p className="font-semibold">Sealos {selectedPlan.name}</p>
                  <p className="text-muted-foreground text-sm">
                    Known plan price
                  </p>
                </div>
              </div>
              <span className="border border-blue-400/25 bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-200">
                Fixed resource package
              </span>
            </div>
            <div className="mt-auto flex items-end gap-2 pt-10">
              <span className="text-5xl font-semibold tabular-nums">
                {formatUsd(selectedPlan.monthlyPrice)}
              </span>
              <span className="text-muted-foreground pb-1">/ month</span>
            </div>
            <p className="text-muted-foreground mt-5 border-t border-blue-300/15 pt-5 text-sm leading-6">
              Includes {selectedPlan.resources.cpu} vCPU,{' '}
              {selectedPlan.resources.ram}Gi RAM, {selectedPlan.resources.disk}
              Gi disk, and {selectedPlan.resources.traffic}GB traffic.
            </p>
          </article>

          <article className="flex min-h-72 flex-col rounded-lg border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-md border border-white/10 bg-black p-2">
                  <Image
                    src={RailwayIcon}
                    alt="Railway"
                    width={28}
                    height={28}
                  />
                </div>
                <div>
                  <p className="font-semibold">Railway {railwayPlan.name}</p>
                  <p className="text-muted-foreground text-sm">
                    Estimated usage bill
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="border border-white/10 bg-white/5 px-2 py-1 text-xs font-medium text-zinc-200">
                  {estimate.requiredPlan
                    ? `${railwayPlan.name} required`
                    : `${railwayPlan.name} eligible`}
                </span>
                <span className="border border-white/10 px-2 py-1 text-xs text-zinc-400">
                  {formatUsd(estimate.planMinimum)}/mo incl.{' '}
                  {formatUsd(estimate.planIncludedUsage)} usage
                </span>
              </div>
            </div>
            <div className="mt-auto flex items-end gap-2 pt-10">
              <span className="text-5xl font-semibold tabular-nums">
                ~{formatUsd(estimate.total)}
              </span>
              <span className="text-muted-foreground pb-1">/ month</span>
            </div>
            <p className="text-muted-foreground mt-5 border-t border-white/10 pt-5 text-sm leading-6">
              Assumes {inputs.averageVcpu.toFixed(2)} average vCPU,{' '}
              {inputs.averageRamGb.toFixed(2)}GB average RAM, {inputs.volumeGb}
              GB volume, and {inputs.egressGb}GB egress.{' '}
              {estimate.validationResult.message}
            </p>
          </article>
        </div>

        <div className="mt-6 grid gap-10 border-y border-white/10 py-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-14">
          <div>
            <p className="text-muted-foreground text-sm">Monthly difference</p>
            <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
              <p className="text-4xl font-semibold tabular-nums">
                {estimate.validationResult.valid
                  ? formatUsd(difference.amount)
                  : '—'}
              </p>
              <p className="pb-1 text-sm font-medium text-zinc-200">
                {lowerCostName}
              </p>
            </div>
            <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-6">
              {comparisonMessage}
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">
                Compute utilization threshold
              </p>
              <p className="text-muted-foreground text-xs">
                0–100% average CPU and RAM
              </p>
            </div>
            <div
              className="relative mt-10 h-2 bg-zinc-800"
              role="img"
              aria-label={`Current compute utilization ${currentComputeUtilization.toFixed(1)} percent${
                interiorCrossover === null
                  ? ''
                  : `, break-even ${interiorCrossover.toFixed(1)} percent`
              }`}
            >
              <div
                className="absolute inset-y-0 left-0 bg-blue-500/50"
                style={{ width: `${currentComputeUtilization}%` }}
              />
              <span
                className="absolute top-1/2 size-3 -translate-y-1/2 bg-blue-400 ring-4 ring-zinc-950"
                style={{ left: `${currentComputeUtilization}%` }}
                aria-hidden="true"
              />
              <span
                className="absolute -top-8 text-xs font-medium whitespace-nowrap text-blue-300"
                style={{
                  left: `${currentComputeUtilization}%`,
                  transform: markerTransform(currentComputeUtilization),
                }}
              >
                Current {currentComputeUtilization.toFixed(1)}%
              </span>
              {interiorCrossover !== null && (
                <>
                  <span
                    className="absolute top-1/2 h-5 w-px -translate-y-1/2 bg-white"
                    style={{ left: `${interiorCrossover}%` }}
                    aria-hidden="true"
                  />
                  <span
                    className="absolute top-5 text-xs font-medium whitespace-nowrap text-zinc-200"
                    style={{
                      left: `${interiorCrossover}%`,
                      transform: markerTransform(interiorCrossover),
                    }}
                  >
                    Break-even {interiorCrossover.toFixed(1)}%
                  </span>
                </>
              )}
            </div>
            <div className="text-muted-foreground mt-9 flex justify-between gap-4 text-xs">
              {interiorCrossover !== null ? (
                <>
                  <span>
                    {lowerCostLabel(lowerCostAtZero)} below{' '}
                    {interiorCrossover.toFixed(1)}%
                  </span>
                  <span className="text-right">
                    {lowerCostLabel(lowerCostAtFull)} above{' '}
                    {interiorCrossover.toFixed(1)}%
                  </span>
                </>
              ) : (
                <span>{fullRangeLabel}</span>
              )}
            </div>
          </div>
        </div>

        <dl className="grid grid-cols-2 border-b border-white/10 lg:grid-cols-4">
          {costLineItems.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                'py-6',
                index % 2 === 0 ? 'pr-4' : 'border-l border-white/10 pl-4',
                index >= 2 && 'border-t border-white/10 lg:border-t-0',
                index > 0 && 'lg:border-l lg:border-white/10 lg:px-6',
                index === 0 && 'lg:pr-6',
              )}
            >
              <dt className="text-muted-foreground text-xs">{item.label}</dt>
              <dd className="mt-2 text-xl font-semibold tabular-nums">
                {formatUsd(item.value)}
              </dd>
              <p className="text-muted-foreground mt-1 text-xs">{item.rate}</p>
            </div>
          ))}
        </dl>

        <div className="border-b border-white/10 py-6">
          <Button
            variant="ghost"
            className="h-10 px-3 transition-colors"
            onClick={() => setShowAdvanced((current) => !current)}
            aria-expanded={showAdvanced}
          >
            <SlidersHorizontal className="mr-2 size-4" />
            Adjust workload inputs
            <ChevronDown
              className={cn(
                'ml-2 size-4 transition-transform',
                showAdvanced && 'rotate-180',
              )}
            />
          </Button>

          {showAdvanced && (
            <div className="mt-5 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ['averageVcpu', 'Average vCPU', 0.01],
                  ['averageRamGb', 'Average RAM (GB)', 0.01],
                  ['volumeGb', 'Volume (GB)', 1],
                  ['egressGb', 'Egress (GB)', 1],
                ] as const
              ).map(([key, label, step]) => (
                <label key={key} className="text-sm font-medium">
                  {label}
                  <Input
                    type="number"
                    min={0}
                    step={step}
                    value={inputs[key]}
                    onChange={(event) => updateInput(key, event.target.value)}
                    onBlur={() => handleAdvancedBlur(key)}
                    className="mt-2 h-11 rounded-md border-white/10 bg-zinc-950 tabular-nums focus-visible:ring-blue-400"
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="text-muted-foreground text-sm leading-6">
            <p className="font-mono text-xs [overflow-wrap:anywhere] break-words whitespace-normal text-zinc-300">
              max(
              {formatUsd(estimate.planMinimum)} {railwayPlan.name} subscription,{' '}
              {inputs.averageVcpu.toFixed(2)} vCPU ×{' '}
              {formatUsd(RAILWAY_RATE_CARD.cpuPerVcpuMonth)} +{' '}
              {inputs.averageRamGb.toFixed(2)}GB RAM ×{' '}
              {formatUsd(RAILWAY_RATE_CARD.ramPerGbMonth)} + {inputs.volumeGb}GB
              volume × {formatUsd(RAILWAY_RATE_CARD.volumePerGbMonth)} +{' '}
              {inputs.egressGb}GB egress ×{' '}
              {formatUsd(RAILWAY_RATE_CARD.egressPerGb)})
            </p>
            <p className="mt-3">
              CPU {formatUsd(estimate.cpu)} · RAM {formatUsd(estimate.ram)} ·
              Volume {formatUsd(estimate.volume)} · Egress{' '}
              {formatUsd(estimate.egress)} · Usage subtotal{' '}
              {formatUsd(estimate.usageSubtotal)} · Billed total{' '}
              {formatUsd(estimate.billedTotal)}. Estimate verified on{' '}
              {RAILWAY_RATE_CARD.verifiedAt}.
            </p>
            <p className="mt-3">
              {estimate.validationResult.message} Railway {railwayPlan.name}{' '}
              applies a {formatUsd(estimate.planMinimum)}/month subscription and{' '}
              {formatUsd(estimate.planIncludedUsage)} of included usage.
              Measured usage above that minimum becomes the billed total.
            </p>
            <p className="mt-2">
              Sealos plan capacities use Gi. Railway publishes RAM and volume
              rates in GB. This estimate uses the displayed numeric workload
              inputs.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              <a
                href={RAILWAY_RATE_CARD.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSourceClick('railway_pricing_plans')}
                className="text-foreground inline-flex items-center underline decoration-white/30 underline-offset-4 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
              >
                Railway pricing and usage rates
                <ExternalLink className="ml-1.5 size-3.5" />
              </a>
              <a
                href={RAILWAY_RATE_CARD.costControlUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSourceClick('railway_cost_control')}
                className="text-foreground inline-flex items-center underline decoration-white/30 underline-offset-4 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
              >
                Railway cost controls
                <ExternalLink className="ml-1.5 size-3.5" />
              </a>
              <Link
                href={`/${lang}/comparison/sealos-vs-railway/`}
                onClick={() => handleSourceClick('full_railway_comparison')}
                className="text-foreground inline-flex items-center underline decoration-white/30 underline-offset-4 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
              >
                View full Sealos vs. Railway comparison
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </div>
          </div>

          <Button
            variant="landing-primary"
            className="h-11 w-full rounded-md px-6 transition duration-200 active:translate-y-px motion-reduce:transition-none lg:w-auto"
            onClick={handleChoosePlan}
          >
            Choose {selectedPlan.name}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
