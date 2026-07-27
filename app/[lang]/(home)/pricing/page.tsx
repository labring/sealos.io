import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowDown, ArrowRight, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { GradientText } from '@/new-components/GradientText';
import { PageTopRays } from '@/new-components/SideRays';
import { FAQSection } from './components/FAQSection';
import { FeaturesSection } from './components/FeaturesSection';
import { FreeTrialCard } from './components/FreeTrialCard';
import { MorePlans } from './components/MorePlans';
import { PricingCard } from './components/PricingCard';
import { RailwayCostCalculator } from './components/RailwayCostCalculator';
import HeroLinesImage from './assets/hero-lines.svg';
import { mainPricingPlans } from './config/plans';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Predictable Cloud Pricing',
    description:
      'Compare Sealos monthly resource plans with a transparent Railway usage-based cost estimate.',
    pathname: '/pricing',
  });
}

export default async function PricingPage({ params }: PageProps) {
  const { lang } = await params;

  return (
    <>
      <PageTopRays />

      <section className="relative container -mt-24 pt-44 pb-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src={HeroLinesImage}
            alt=""
            className="h-full w-full object-cover"
            fill
            priority
          />
        </div>
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm">
            Predictable cloud pricing
          </div>

          <h1 className="mt-8 text-center text-4xl leading-tight font-semibold sm:text-6xl">
            Know what you’ll pay
            <br />
            <GradientText>before you deploy.</GradientText>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-2xl text-center text-base sm:text-lg">
            Choose a monthly resource plan, then compare the same workload with
            Railway’s usage-based pricing.
          </p>
          <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
            <Button asChild variant="landing-primary" className="h-11 px-6">
              <a href="#plans">
                Choose your plan
                <ArrowDown className="ml-2 size-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-full px-6"
            >
              <a href="#railway-cost">
                <GitCompare className="mr-2 size-4" />
                Compare with Railway
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="container pb-20">
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

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-3">
          {mainPricingPlans.map((plan) => (
            <PricingCard key={plan.planId} plan={plan} />
          ))}
        </div>
      </section>

      <RailwayCostCalculator lang={lang} />

      <MorePlans />

      <FeaturesSection />

      <FAQSection />

      <section className="container py-20">
        <div className="flex flex-col items-start justify-between gap-8 border-y border-white/10 py-12 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-blue-400">Ready to deploy</p>
            <h2 className="mt-3 text-3xl font-semibold">
              Pick a resource package you can plan around.
            </h2>
          </div>
          <Button asChild variant="landing-primary" className="h-11 px-6">
            <a href="#plans">
              Choose your plan
              <ArrowRight className="ml-2 size-4" />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
