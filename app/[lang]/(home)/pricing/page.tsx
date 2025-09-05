import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType } from '@/lib/i18n';
import { SubscriptionPricing } from './components/subscription-pricing';
import { FeatureCard } from './components/feature-card';
import { TimelineContent } from './components/timeline-animation';
import { VerticalCutReveal } from './components/vertical-cut-reveal';
import GetStarted from './components/get-started';
// Icons are resolved inside FeatureCard on the client. Pass names only.
// Note: Pricing is subscription-only. No usage-based logic here.

const title = {
  main: '7-Day free trial\nNo credit card required',
  sub: 'Choose the perfect plan for your needs. Always flexible to scale.',
};

const description = {
  main: 'Start Building Today',
  sub: "Whether you're a startup or an enterprise, our flexible plans evolve with your needs, ensuring you always have the right tools to succeed.",
};

export const metadata = generatePageMetadata({
  title: 'Pricing | Simple, Transparent Pricing',
  description:
    'Choose the perfect plan for your needs. Always flexible to scale. No hidden fees, no surprises.',
  pathname: '/pricing',
});

export default function PricingPage({
  params,
}: {
  params: { lang: languagesType };
}) {
  return (
    <div className="h-full bg-gradient-to-b from-[#EBF2FF] to-white">
      <Header lang={params.lang} />
      <main className="custom-container px-8 pt-14 md:px-[15%]">
        {/* Hero Section */}
        <Hero title={title} mainTitleEmphasis={2}>
          <p className="text-center font-medium text-slate-600 mb-12">
            {description.sub}
          </p>
        </Hero>

        {/* Subscription Pricing Section */}
        <div className="mt-12 mb-20">
          <SubscriptionPricing />
        </div>

        {/* Features Grid Section */}
        <div className="mb-20">
          <TimelineContent
            delay={0.2}
            variant="fadeUp"
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              <VerticalCutReveal splitBy="words" staggerDelay={0.05}>
                Everything You Need to Build and Scale
              </VerticalCutReveal>
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Our platform provides all the tools and services you need to
              develop, deploy, and manage your applications efficiently.
            </p>
          </TimelineContent>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TimelineContent delay={0.3} variant="fadeUp">
              <FeatureCard
                icon="rocket"
                title="Instant Deployment"
                description="Deploy your applications in seconds. Just push your code and it works - no complex CI/CD setup required."
                bgColor="bg-blue-100"
                iconColor="text-blue-600"
              />
            </TimelineContent>

            <TimelineContent delay={0.35} variant="fadeUp">
              <FeatureCard
                icon="rotateCcw"
                title="Auto Scaling"
                description="Automatically scale your resources up or down based on demand to optimize performance and costs."
                bgColor="bg-green-100"
                iconColor="text-green-600"
              />
            </TimelineContent>

            <TimelineContent delay={0.4} variant="fadeUp">
              <FeatureCard
                icon="database"
                title="Managed Databases"
                description="Built-in support for PostgreSQL, MongoDB, Redis, and more with automated backups and scaling."
                bgColor="bg-purple-100"
                iconColor="text-purple-600"
              />
            </TimelineContent>

            <TimelineContent delay={0.45} variant="fadeUp">
              <FeatureCard
                icon="barChart3"
                title="Real-time Monitoring"
                description="Comprehensive monitoring, logging, and alerting to keep your applications running smoothly."
                bgColor="bg-red-100"
                iconColor="text-red-600"
              />
            </TimelineContent>

            <TimelineContent delay={0.5} variant="fadeUp">
              <FeatureCard
                icon="code2"
                title="DevBox IDE"
                description="Cloud-based development environment with pre-configured tools and instant collaboration."
                bgColor="bg-yellow-100"
                iconColor="text-yellow-600"
              />
            </TimelineContent>

            <TimelineContent delay={0.55} variant="fadeUp">
              <FeatureCard
                icon="headphones"
                title="24/7 Support"
                description="Expert support team available around the clock to help you succeed with your projects."
                bgColor="bg-pink-100"
                iconColor="text-pink-600"
              />
            </TimelineContent>
          </div>
        </div>

        {/* Get Started Section */}
        <TimelineContent delay={0.3} variant="fadeUp">
          <GetStarted />
        </TimelineContent>
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer lang={params.lang} />
    </div>
  );
}
