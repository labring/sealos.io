import { GodRays } from '@/new-components/GodRays';
import { GradientText } from '@/new-components/GradientText';
import { FreeTrialCard } from './components/FreeTrialCard';
import { PricingCard } from './components/PricingCard';
import { MorePlans } from './components/MorePlans';
import { FeaturesSection } from './components/FeaturesSection';
import { FAQSection } from './components/FAQSection';
import { mainPricingPlans } from './config/plans';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function PricingPage({ params }: PageProps) {
  const { lang } = await params;
  const langPrefix = `/${lang}`;

  return (
    <>
      <GodRays
        sources={[
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 20,
            count: 12,
            color: '220, 220, 220',
            opacityMin: 0.24,
            opacityMax: 0.25,
            minWidth: 120,
            maxWidth: 180,
          },
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 8,
            count: 6,
            color: '255, 255, 255',
            opacityMin: 0.89,
            opacityMax: 0.9,
            minWidth: 12,
            maxWidth: 24,
          },
          {
            x: 0.25,
            y: -0.06,
            angle: 50,
            spread: 20,
            count: 6,
            color: '180, 180, 180',
            opacityMin: 0.14,
            opacityMax: 0.15,
            minWidth: 60,
            maxWidth: 120,
          },
        ]}
        speed={0.0}
        maxWidth={48}
        minLength={1200}
        maxLength={2000}
        blur={8}
      />

      <section className="container -mt-24 pt-44 pb-18">
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
          with your needs, ensuring you always have the right tools to succeed.
        </p>
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
