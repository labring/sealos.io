import Footer from '@/components/footer';
import Header from '@/components/header';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { getIndustryConfig, getAllIndustries } from '@/config/industries';

// Components
import IndividualOverview from './components/IndividualOverview';
import IndividualChallenges from './components/IndividualChallenges';
import IndividualBenefits from './components/IndividualBenefits';
import IndividualStats from './components/IndividualStats';
import IndividualProducts from './components/IndividualProducts';
import IndividualImplementation from './components/IndividualImplementation';
import IndividualCTA from './components/IndividualCTA';
import IndividualVisualBreak from './components/IndividualVisualBreak';
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
    title: `Individual Solutions for ${config.name} | ${config.metadata.title}`,
    description: `Discover personalized cloud solutions tailored for individuals in the ${config.name.toLowerCase()} sector. ${config.metadata.description}`,
    keywords: [
      ...config.metadata.keywords,
      'individual solutions',
      'personal cloud platform',
      'individual developer',
    ],
    pathname: `/solutions/industries/${config.slug}/individual`,
  });
}

export default async function IndividualIndustryPage({ params }: PageProps) {
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
        {/* Individual Overview Section with integrated CTAs */}
        <IndividualOverview
          industryName={config.name}
          industrySlug={config.slug}
          title={`Individual ${config.name} Solutions`}
          overviewParagraphs={config.overview.paragraphs}
          ctaText={config.hero.ctaText ?? 'Get Started'}
          ctaUrl={config.hero.ctaUrl ?? appDomain}
          description={config.hero.description}
          introText={`Empowering individual professionals in ${config.name.toLowerCase()} with scalable, secure, and cost-effective cloud solutions`}
          centralIcon={config.centralIcon}
          promoBanner={config.promoBanner}
        />

        {/* Visual Break */}
        <IndividualVisualBreak
          config={config.visualBreak}
          industryName={config.name}
        />

        {/* Challenges Section */}
        <IndividualChallenges
          challenges={config.challenges}
          industryName={config.name}
        />

        {/* Why Sealos Section */}
        <IndividualBenefits
          benefits={config.benefits}
          industryName={config.name}
        />

        {/* Statistics Section */}
        <IndividualStats stats={config.stats} industryName={config.name} />

        {/* Industry-Specific Products Section */}
        <IndividualProducts
          products={config.products}
          industryName={config.name}
        />

        {/* Implementation Benefits */}
        <IndividualImplementation
          benefits={config.implementation}
          industryName={config.name}
        />

        {/* CTA Section */}
        <IndividualCTA config={config} />
      </main>

      <Footer lang={resolvedParams.lang} />
    </div>
  );
}
