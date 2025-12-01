import { GodRays } from '@/new-components/GodRays';
import { GradientText } from '@/new-components/GradientText';
import { FreeTrialCard } from './components/FreeTrialCard';
import { PricingCard, type PricingPlan } from './components/PricingCard';
import { MorePlans } from './components/MorePlans';
import { FeaturesSection } from './components/FeaturesSection';
import { FAQSection } from './components/FAQSection';

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    description:
      'For beginners deploying existing images. Not for development work.',
    price: '$7',
    originalPrice: '$34',
    buttonText: 'Get Started',
    features: [
      '2 vCPU ',
      '2Gi RAM',
      '1Gi Disk',
      '10GB Traffic',
      '4 Nodeport',
      '100 AI Credit',
    ],
  },
  {
    name: 'Hobby',
    description:
      'For hobbyists building side projects. Not for production use.',
    price: '$25',
    originalPrice: '$70',
    buttonText: 'Start Free Trial',
    features: [
      '4 vCPU ',
      '4Gi RAM',
      '30Gi Disk',
      '50GB Traffic',
      '8 Nodeport',
      '300 AI Credits',
      'All Starter Features',
    ],
    isPopular: true,
  },
  {
    name: 'Pro',
    description: 'For professionals and teams shipping production apps.',
    price: '$512',
    buttonText: 'Get Started',
    features: [
      '16 vCPU ',
      '32Gi RAM',
      '200Gi Disk',
      '1TB Traffic',
      '32 Nodeport',
      '1000 AI Credits',
      'Priority support',
      'All Hobby features',
      '99.99% SLA',
    ],
  },
  {
    name: 'Team',
    description:
      'For large teams with compliance needs. Built for collaboration.',
    price: '$2030',
    buttonText: 'Get Started',
    features: [
      '64 vCPU ',
      '128Gi RAM',
      '500Gi Disk',
      '3TB Traffic',
      '64 Nodeport',
      '1500 AI Credits',
      '24/7 dedicated support',
      'All Pro Features',
      'Custom Contracts',
    ],
  },
];

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
        <div className="mx-auto flex w-fit items-center gap-1.5 rounded-full border border-white/5 bg-white/5 px-3 py-1.5">
          Choose the perfect plan for your needs. Always flexible to scale.
        </div>

        <h1
          aria-label="7-Day free trial. No credit card required."
          className="mt-9 mb-6 text-center text-5xl font-medium"
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

      <section className="container pb-18">
        <div className="flex flex-col items-center gap-9">
          <FreeTrialCard />

          <div className="flex flex-wrap justify-center gap-4 lg:flex-nowrap">
            {pricingPlans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} className="lg:flex-1" />
            ))}
          </div>

          <MorePlans />
        </div>
      </section>

      <FeaturesSection />

      <FAQSection />
    </>
  );
}
