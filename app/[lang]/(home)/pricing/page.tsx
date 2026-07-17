import { PageTopRays } from '@/new-components/SideRays';
import { GradientText } from '@/new-components/GradientText';
import { FreeTrialCard } from './components/FreeTrialCard';
import { PricingCard } from './components/PricingCard';
import { MorePlans } from './components/MorePlans';
import { FeaturesSection } from './components/FeaturesSection';
import { FAQSection } from './components/FAQSection';
import { mainPricingPlans } from './config/plans';
import { generatePageMetadata } from '@/lib/utils/metadata';
import Image from 'next/image';
import HeroLinesImage from './assets/hero-lines.svg';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    title: 'Pricing',
    description:
      'Explore Sealos pricing plans with 7-day free trial and no credit card required.',
    pathname: '/pricing',
  });
}

export default async function PricingPage({ params }: PageProps) {
  const { lang } = await params;
  const langPrefix = `/${lang}`;

  return (
    <>
      <PageTopRays />

      <section className="relative container -mt-24 pt-44 pb-18">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src={HeroLinesImage}
            alt=""
            className="h-full w-full object-cover"
            fill
            priority
          />
        </div>
        <div className="relative z-10">
          <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-center text-sm">
            Choose the perfect plan for your needs. Always flexible to scale.
          </div>

          <h1
            aria-label="7-Day free trial. No credit card required."
            className="mt-9 mb-6 text-center text-3xl font-medium sm:text-5xl"
          >
            <span>
              7-Day free trial
              <br />
              No credit{' '}
            </span>
            <GradientText>card required</GradientText>
          </h1>
          <p className="text-muted-foreground text-center">
            Whether you're a startup or an enterprise, our flexible plans evolve
            with your needs, ensuring you always have the right tools to
            succeed.
          </p>
        </div>
      </section>

      <section
        className="container flex flex-col items-center gap-9 pb-18"
        role="main"
      >
        <FreeTrialCard />

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {mainPricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        <MorePlans />
      </section>

      <FeaturesSection />

      <FAQSection />
    </>
  );
}
