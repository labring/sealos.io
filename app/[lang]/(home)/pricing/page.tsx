import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType } from '@/lib/i18n';
import { HovermeButton } from '@/components/ui/button-hoverme';
import { pricingData } from '@/config/pricing';
import { PricingTable } from './components/pricing-table';
import { FeatureCard } from './components/feature-card';
import GetStarted from './components/get-started';
import {
  Rocket,
  RotateCcw,
  Database,
  BarChart3,
  Code2,
  Headphones,
} from 'lucide-react';
import { appDomain } from '@/config/site';

const title = {
  main: 'Simple, Transparent Pricing',
  sub: 'Pay only for what you use. No hidden fees, no surprises.',
};

export const metadata = generatePageMetadata({
  title: 'Pricing | Simple, Transparent Pricing',
  description:
    'Pay only for what you use. No hidden fees, no surprises. Scale your applications with confidence on our cloud platform.',
  pathname: '/pricing',
});

export default function PricingPage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const region = pricingData[0];

  return (
    <div className="h-full bg-[#EBF2FF]">
      <Header lang={params.lang} />
      <main className="custom-container px-8 pt-14 md:px-[15%]">
        <Hero title={title} mainTitleEmphasis={2}>
          <div className="my-8 flex items-center justify-center">
            <HovermeButton
              text="Get Started Today"
              href={appDomain}
              location="hero"
            />
          </div>
          <p className="text-center font-medium text-slate-600">
            Scale your applications with confidence on our cloud platform
          </p>
        </Hero>

        {/* Pricing Table Section */}
        <div className="mt-20 mb-20">
          <PricingTable region={region} />
        </div>

        {/* Features Grid Section */}
        <div className="mb-20">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Everything You Need to Build and Scale
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600">
              Our platform provides all the tools and services you need to
              develop, deploy, and manage your applications efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Rocket}
              title="Instant Deployment"
              description="Deploy your applications in seconds. Just push your code and it works - no complex CI/CD setup required."
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />

            <FeatureCard
              icon={RotateCcw}
              title="Auto Scaling"
              description="Automatically scale your resources up or down based on demand to optimize performance and costs."
              bgColor="bg-green-100"
              iconColor="text-green-600"
            />

            <FeatureCard
              icon={Database}
              title="Managed Databases"
              description="Built-in support for PostgreSQL, MongoDB, Redis, and more with automated backups and scaling."
              bgColor="bg-purple-100"
              iconColor="text-purple-600"
            />

            <FeatureCard
              icon={BarChart3}
              title="Real-time Monitoring"
              description="Comprehensive monitoring, logging, and alerting to keep your applications running smoothly."
              bgColor="bg-red-100"
              iconColor="text-red-600"
            />

            <FeatureCard
              icon={Code2}
              title="DevBox IDE"
              description="Cloud-based development environment with pre-configured tools and instant collaboration."
              bgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />

            <FeatureCard
              icon={Headphones}
              title="24/7 Support"
              description="Expert support team available around the clock to help you succeed with your projects."
              bgColor="bg-pink-100"
              iconColor="text-pink-600"
            />
          </div>
        </div>

        {/* Get Started Section */}
        <GetStarted />
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer lang={params.lang} />
    </div>
  );
}
