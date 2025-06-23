import Problems from './components/problems';
import Solutions from './components/solutions';
import Workflow from './components/workflow';
import TechGrid from './components/techgrid';
import FooterCta from './components/footerCta';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';
import Video from '@/components/video';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { appDomain, siteConfig } from '@/config/site';
import { languagesType } from '@/lib/i18n';
import placeholderImage from '/public/images/video.webp';
import StructuredDataComponent from '@/components/structured-data';
import {
  generateProductSchema,
  generateBreadcrumbSchema,
} from '@/lib/utils/structured-data';

// Define translations for different languages
const translations = {
  en: {
    title: {
      main: 'Focus on Your Code, Not Configuration',
      sub: 'Streamlined development flow so you can build, test, and ship faster.',
    },
    description:
      'Eliminate development environment friction with ready-to-code cloud workstations. Instant setup, perfect isolation, enterprise security.',
  },
  'zh-cn': {
    title: {
      main: '专注代码，无需配置',
      sub: '简化开发流程，让您更快地构建、测试和发布。',
    },
    description:
      '使用即开即用的云工作站消除开发环境摩擦。即时设置，完美隔离，企业级安全。',
  },
};

// Generate metadata function that supports internationalization
export function generateMetadata({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang] || translations.en;
  return generatePageMetadata({
    title: 'DevBox' + ' | ' + t.title.sub,
    description: t.description,
    pathname: '/products/devbox',
    lang: params.lang,
  });
}

export default function HomePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang] || translations.en;

  // Generate structured data for DevBox product
  const productSchema = generateProductSchema(
    'DevBox',
    t.description,
    `${siteConfig.url.base}/products/devbox`,
    params.lang,
  );

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: siteConfig.url.base },
      { name: 'Products', url: `${siteConfig.url.base}/products` },
      { name: 'DevBox', url: `${siteConfig.url.base}/products/devbox` },
    ],
    params.lang,
  );

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredDataComponent data={[productSchema, breadcrumbSchema]} />

      <div className="h-full bg-[#EBF2FF]">
        <Header lang={params.lang} />
        <main className="custom-container px-8 pt-14 md:px-[15%]">
          <Hero
            title={t.title}
            mainTitleEmphasis={1}
            getStartedLink={`${appDomain}/?openapp=system-devbox`}
            lang={params.lang}
          >
            <Video
              url="https://www.youtube.com/watch?v=TrEsUMwWtDg"
              placeholderImage={placeholderImage}
              title="Sealos DevBox"
              location="hero"
            />
          </Hero>

          {/* Problem-Solution Structure */}
          <Problems lang={params.lang} />
          <Solutions lang={params.lang} />

          {/* Development Workflow */}
          <Workflow lang={params.lang} />

          {/* Template Deployment Section */}
          <div id="one-click-deployment" className="scroll-mt-20" />
          <TechGrid />

          <FooterCta />
        </main>
        <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
        <Footer lang={params.lang} />
      </div>
    </>
  );
}
