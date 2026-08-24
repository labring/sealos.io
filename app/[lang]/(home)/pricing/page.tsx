import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowDown, ArrowRight } from 'lucide-react';
import RailwayIcon from '@/assets/platform-icons/railway.svg';
import SealosIcon from '@/assets/shared-icons/sealos.svg';
import { Button } from '@/components/ui/button';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { PageTopRays } from '@/new-components/SideRays';
import { FAQSection } from './components/FAQSection';
import { FeaturesSection } from './components/FeaturesSection';
import { FreeTrialCard } from './components/FreeTrialCard';
import { MorePlans } from './components/MorePlans';
import { PricingCard } from './components/PricingCard';
import { RailwayCostCalculator } from './components/RailwayCostCalculator';
import HeroLinesImage from './assets/hero-lines.svg';
import { mainPricingPlans, railwayComparablePlans } from './config/plans';
import {
  DEFAULT_RAILWAY_UTILIZATION,
  RAILWAY_RATE_CARD,
  calculateCostDifference,
  estimateRailwayMonthlyCost,
  formatUsd,
} from './config/railway-cost';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Predictable Cloud Pricing',
    description:
      'Choose a fixed monthly Sealos resource package and compare it with a transparent Railway usage-based cost estimate.',
    pathname: '/pricing',
  });
}

const heroPlan = railwayComparablePlans.find(
  ({ planId }) => planId === 'hobby',
)!;
const heroRailwayEstimate = estimateRailwayMonthlyCost({
  averageVcpu: heroPlan.resources.cpu * (DEFAULT_RAILWAY_UTILIZATION / 100),
  averageRamGb: heroPlan.resources.ram * (DEFAULT_RAILWAY_UTILIZATION / 100),
  volumeGb: heroPlan.resources.disk,
  egressGb: heroPlan.resources.traffic,
});
const heroRailwayPlan =
  RAILWAY_RATE_CARD.plans[heroRailwayEstimate.selectedPlan];
const heroDifference = calculateCostDifference(
  heroPlan.monthlyPrice,
  heroRailwayEstimate.total,
);

export default async function PricingPage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <main>
      <PageTopRays />

      <section className="relative container -mt-24 overflow-hidden pt-40 pb-14 sm:pt-48 sm:pb-18">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src={HeroLinesImage}
            alt=""
            className="h-full w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)] object-cover opacity-70"
            fill
            priority
          />
        </div>
        <div className="relative z-10 grid items-end gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:gap-16">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 text-sm font-medium text-zinc-300">
              <span className="size-1.5 bg-blue-400" aria-hidden="true" />
              Predictable cloud pricing
            </p>

            <h1 className="mt-7 max-w-3xl text-5xl leading-[0.98] font-semibold text-balance sm:text-6xl lg:text-7xl">
              Know your plan price{' '}
              <span className="text-blue-400">before you deploy.</span>
            </h1>
            <p className="text-muted-foreground mt-7 max-w-xl text-base leading-7 text-pretty sm:text-lg">
              Choose a fixed monthly resource package, then estimate how the
              same workload would be billed on Railway.
            </p>
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <Button
                asChild
                variant="landing-primary"
                className="h-11 rounded-md px-6 transition duration-200 active:translate-y-px motion-reduce:transition-none"
              >
                <a href="#plans">
                  Choose your plan
                  <ArrowDown className="ml-2 size-4" />
                </a>
              </Button>
              <a
                href="#railway-cost"
                className="group inline-flex items-center py-2 text-sm font-medium text-zinc-200 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none motion-reduce:transition-none"
              >
                Compare with Railway
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none" />
              </a>
            </div>
            <p className="text-muted-foreground mt-7 max-w-lg text-sm leading-6">
              Your plan covers the resources listed below. Taxes and optional
              services are shown separately before checkout.
            </p>
          </div>

          <aside
            aria-label="Default Hobby cost comparison"
            className="relative overflow-hidden rounded-lg border border-blue-400/25 bg-zinc-950/80 p-6 shadow-[0_24px_80px_-36px_rgba(59,130,246,0.55)] backdrop-blur-sm sm:p-7"
          >
            <div
              className="absolute inset-y-0 left-0 w-px bg-blue-400"
              aria-hidden="true"
            />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  Hobby workload example · Railway {heroRailwayPlan.name}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {heroRailwayEstimate.validationResult.message}
                </p>
              </div>
              <span className="max-w-48 border border-white/10 bg-white/5 px-2 py-1 text-right text-xs leading-5 text-zinc-300">
                {DEFAULT_RAILWAY_UTILIZATION}% average CPU and RAM · full listed
                volume and egress
              </span>
            </div>

            <div className="mt-7 divide-y divide-white/10 border-y border-white/10">
              <div className="flex items-center justify-between gap-5 py-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-white p-2">
                    <Image src={SealosIcon} alt="" width={24} height={24} />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Sealos Hobby</p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Known plan price
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-semibold tabular-nums">
                  {formatUsd(heroPlan.monthlyPrice)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-5 py-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md border border-white/10 bg-black p-2">
                    <Image src={RailwayIcon} alt="" width={24} height={24} />
                  </span>
                  <div>
                    <p className="text-sm font-medium">
                      Railway {heroRailwayPlan.name}
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {formatUsd(heroRailwayEstimate.planMinimum)} minimum ·{' '}
                      {formatUsd(heroRailwayEstimate.planIncludedUsage)}{' '}
                      included
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-semibold tabular-nums">
                  ~{formatUsd(heroRailwayEstimate.total)}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-muted-foreground text-xs">
                  Estimated monthly difference
                </p>
                <p className="mt-1 text-xl font-semibold tabular-nums">
                  Sealos is {formatUsd(heroDifference.amount)} lower in this
                  example.
                </p>
              </div>
              <p className="text-muted-foreground text-xs sm:text-right">
                4 vCPU · 4Gi RAM
                <br />
                20Gi volume · 50GB egress
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="container pb-18">
        <FreeTrialCard />
      </section>

      <section id="plans" className="container scroll-mt-24 pb-24">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium text-blue-400">Monthly plans</p>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
            Choose your resource package
          </h2>
          <p className="text-muted-foreground mt-4">
            Every plan shows the CPU, memory, storage, traffic, and platform
            credits included in its monthly price.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-3">
          {mainPricingPlans.map((plan) => (
            <PricingCard key={plan.planId} plan={plan} />
          ))}
        </div>
      </section>

      <RailwayCostCalculator lang={lang} />

      <MorePlans />

      <FeaturesSection />

      <FAQSection />
    </main>
  );
}
