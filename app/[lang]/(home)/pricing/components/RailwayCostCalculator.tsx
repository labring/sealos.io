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
import { cn } from '@/lib/utils';
import { railwayComparablePlans, type PricingPlanId } from '../config/plans';
import {
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
  utilization: Utilization,
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
  const [utilization, setUtilization] = useState<Utilization>(25);
  const [inputs, setInputs] = useState<RailwayCostInput>(() =>
    buildInputs(defaultPlan, 25),
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
            default_utilization: 25,
          });
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [trackCustom]);

  const estimate = useMemo(() => estimateRailwayMonthlyCost(inputs), [inputs]);
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

  const comparisonMessage =
    difference.lowerCost === 'equal'
      ? 'Both options have the same monthly cost in this example.'
      : `${difference.lowerCost === 'sealos' ? 'Sealos' : 'Railway'} is about ${formatUsd(difference.amount)} lower in this example.`;

  return (
    <section
      ref={sectionRef}
      id="railway-cost"
      className="scroll-mt-20 border-y border-white/10 bg-zinc-950/60 py-24"
    >
      <div className="container">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-blue-400">Cost comparison</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Same workload. Different billing model.
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl">
            Sealos lists a monthly resource package. Railway starts with a $5
            minimum usage commitment and bills measured CPU, memory, volume, and
            egress.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
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
                    'h-10 rounded-md px-4 text-sm font-medium transition-colors',
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
            <p className="mb-3 text-sm font-medium">Average CPU and RAM use</p>
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
                    'h-10 min-w-16 rounded-md px-3 text-sm font-medium transition-colors',
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

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <article className="flex min-h-72 flex-col rounded-lg border border-blue-400/40 bg-zinc-900 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-white p-2">
                <Image src={SealosIcon} alt="Sealos" width={28} height={28} />
              </div>
              <div>
                <p className="font-semibold">Sealos {selectedPlan.name}</p>
                <p className="text-muted-foreground text-sm">
                  Known monthly plan price
                </p>
              </div>
            </div>
            <div className="mt-8 flex items-end gap-2">
              <span className="text-5xl font-semibold">
                {formatUsd(selectedPlan.monthlyPrice)}
              </span>
              <span className="text-muted-foreground pb-1">/ month</span>
            </div>
            <p className="text-muted-foreground mt-5 text-sm leading-6">
              Includes {selectedPlan.resources.cpu} vCPU,{' '}
              {selectedPlan.resources.ram}GB RAM, {selectedPlan.resources.disk}
              GB disk, and {selectedPlan.resources.traffic}GB traffic.
            </p>
          </article>

          <article className="flex min-h-72 flex-col rounded-lg border bg-zinc-900 p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
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
                  <p className="font-semibold">Railway</p>
                  <p className="text-muted-foreground text-sm">
                    Estimated usage bill
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
                $5 minimum usage
              </span>
            </div>
            <div className="mt-8 flex items-end gap-2">
              <span className="text-5xl font-semibold">
                ~{formatUsd(estimate.total)}
              </span>
              <span className="text-muted-foreground pb-1">/ month</span>
            </div>
            <p className="text-muted-foreground mt-5 text-sm leading-6">
              Assumes {inputs.averageVcpu.toFixed(2)} average vCPU,{' '}
              {inputs.averageRamGb.toFixed(2)}GB average RAM, {inputs.volumeGb}
              GB volume, and {inputs.egressGb}GB egress.
            </p>
          </article>
        </div>

        <div className="mt-6 grid gap-6 border-y border-white/10 py-7 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-lg font-semibold">{comparisonMessage}</p>
            <p className="text-muted-foreground mt-2 text-sm">
              Absolute difference: {formatUsd(difference.amount)} (
              {difference.percentage}% of the Railway estimate).
            </p>
          </div>
          <p className="text-muted-foreground text-sm leading-6 md:text-right">
            With the listed volume and egress, Railway reaches{' '}
            {formatUsd(selectedPlan.monthlyPrice)} at about{' '}
            <span className="text-foreground font-medium">
              {crossover?.toFixed(1)}% average compute utilization
            </span>
            .
          </p>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            className="h-10 rounded-full border border-white/10"
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
            <div className="mt-5 grid gap-4 rounded-lg border border-white/10 bg-black/20 p-5 sm:grid-cols-2 lg:grid-cols-4">
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
                    className="mt-2 h-11 bg-zinc-950"
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="text-muted-foreground text-sm leading-6">
            <p className="font-mono text-xs text-zinc-300">
              max($5, {inputs.averageVcpu.toFixed(2)} vCPU × $20 +{' '}
              {inputs.averageRamGb.toFixed(2)}GB RAM × $10 + {inputs.volumeGb}GB
              volume × $0.15 + {inputs.egressGb}GB egress × $0.05)
            </p>
            <p className="mt-3">
              CPU {formatUsd(estimate.cpu)} · RAM {formatUsd(estimate.ram)} ·
              Volume {formatUsd(estimate.volume)} · Egress{' '}
              {formatUsd(estimate.egress)}. Estimate verified on{' '}
              {RAILWAY_RATE_CARD.verifiedAt}.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              <a
                href={RAILWAY_RATE_CARD.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSourceClick('railway_pricing_plans')}
                className="text-foreground inline-flex items-center underline underline-offset-4"
              >
                Railway pricing source
                <ExternalLink className="ml-1.5 size-3.5" />
              </a>
              <a
                href={RAILWAY_RATE_CARD.costControlUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleSourceClick('railway_cost_control')}
                className="text-foreground inline-flex items-center underline underline-offset-4"
              >
                Railway cost controls
                <ExternalLink className="ml-1.5 size-3.5" />
              </a>
              <Link
                href={`/${lang}/comparison/sealos-vs-railway/`}
                onClick={() => handleSourceClick('full_railway_comparison')}
                className="text-foreground inline-flex items-center underline underline-offset-4"
              >
                View full Sealos vs. Railway comparison
                <ArrowRight className="ml-1.5 size-3.5" />
              </Link>
            </div>
          </div>

          <Button
            variant="landing-primary"
            className="h-11 px-6"
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
