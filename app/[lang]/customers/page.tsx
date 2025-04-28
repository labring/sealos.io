import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType } from '@/lib/i18n';
import Hero from './components/hero';
import FeaturedCases from './components/featured-cases';
import CaseGrid from './components/case-grid';
import Testimonials from './components/testimonials';
import TrustedCompanies from './components/trusted-companies';
import CallToAction from './components/call-to-action';

const translations = {
  'en': {
    title: 'Customer Success Stories',
    description: 'Discover how industry leaders and technology pioneers leverage our platform to power up their applications and accelerate business growth.',
  },
  'zh-cn': {
    title: '客户成功案例',
    description: '了解行业领导者和技术先驱如何利用我们的平台为其应用提供动力并加速业务增长。',
  }
};

export async function generateMetadata({ params }: { params: { lang: languagesType } }) {
  const t = translations[params.lang];

  return generatePageMetadata({
    title: t.title,
    description: t.description,
    pathname: `${params.lang}/customers`,
  });
}

export default function CasePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  return (
    <main className="px-8 pt-20 md:px-[15%]">
      <div className="space-y-16"> {/* Increased spacing between sections for better visual separation */}
        <Hero lang={params.lang} />
        <FeaturedCases lang={params.lang} />
        <CaseGrid lang={params.lang} />
        <Testimonials lang={params.lang} />
        <TrustedCompanies lang={params.lang} />
        <CallToAction lang={params.lang} />
      </div>
    </main>
  );
}
