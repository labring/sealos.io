import Footer from '@/components/footer';
import Header from '@/components/header';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { getIndustryConfig, getAllIndustries } from '@/config/industries';

// Components
import IndustryOverview from './components/IndustryOverview';
import IndustryChallenges from './components/IndustryChallenges';
import IndustryBenefits from './components/IndustryBenefits';
import IndustryStats from './components/IndustryStats';
import CoreProducts from './components/CoreProducts';
import IndustryProducts from './components/IndustryProducts';
import ImplementationBenefits from './components/ImplementationBenefits';
import IndustryCTA from './components/IndustryCTA';
import IndustryVisualBreak from './components/IndustryVisualBreak';
import { appDomain } from '@/config/site';

interface PageProps {
  params: Promise<{ lang: languagesType; industry: string }>;
}

export async function generateStaticParams() {
  const industries = getAllIndustries();
  return industries.map((industrySlug) => ({
    industry: industrySlug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const config = getIndustryConfig(resolvedParams.industry);

  if (!config) {
    return {};
  }

  return generatePageMetadata({
    title: config.metadata.title,
    description: config.metadata.description,
    keywords: config.metadata.keywords,
    pathname: `/solutions/industries/${config.slug}`,
  });
}

export default async function IndustryPage({ params }: PageProps) {
  const resolvedParams = await params;
  const config = getIndustryConfig(resolvedParams.industry);

  if (!config) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header lang={resolvedParams.lang} />

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-20 sm:px-6 lg:px-8">
        {/* Industry Overview Section with integrated CTAs */}
        <IndustryOverview
          industryName={config.name}
          title={config.title}
          overviewParagraphs={config.overview.paragraphs}
          ctaText={config.hero.ctaText ?? 'Get Started'}
          ctaUrl={config.hero.ctaUrl ?? appDomain}
          description={config.hero.description}
          introText={config.hero.introText}
          centralIcon={config.centralIcon}
        />

        {/* Visual Break */}
        <IndustryVisualBreak config={config.visualBreak} />

        {/* Challenges Section */}
        <IndustryChallenges
          challenges={config.challenges}
          industryName={config.name}
        />

        {/* Why Sealos Section */}
        <IndustryBenefits
          benefits={config.benefits}
          industryName={config.name}
        />

        {/* Statistics Section */}
        <IndustryStats stats={config.stats} industryName={config.name} />

        {/* Core Sealos Products Section */}
        <CoreProducts industryName={config.name} />

        {/* Industry-Specific Products Section */}
        <IndustryProducts
          products={config.products}
          industryName={config.name}
        />

        {/* Implementation Benefits */}
        <ImplementationBenefits benefits={config.implementation} />

        {/* CTA Section */}
        <IndustryCTA config={config} />
      </main>

      <Footer lang={resolvedParams.lang} />
    </div>
  );
}
