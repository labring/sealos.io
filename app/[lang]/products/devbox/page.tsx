import Problems from './components/problems';
import Solutions from './components/solutions-v2';
import Workflow from './components/workflow-v2';
import MetricsVisualization from './components/metrics-visualization';
import TechGrid from './components/techgrid';
import FooterCta from './components/footerCta';
import SocialProof from './components/social-proof';
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
  generateDevBoxSchema,
  generateBreadcrumbSchema,
} from '@/lib/utils/structured-data';

// Define translations for different languages
const translations = {
  en: {
    title: {
      main: 'Ship 10x Faster with Cloud Development Environments',
      sub: 'Join 10,000+ developers who eliminated setup time. Start coding in 60 seconds.',
    },
    description:
      'Eliminate development environment friction with ready-to-code cloud workstations. Instant setup, perfect isolation, enterprise security.',
    watchDemo: 'Live Demo (2 min)',
  },
  'zh-cn': {
    title: {
      main: '使用云端开发环境，交付速度提升10倍',
      sub: '加入10,000+开发者，消除环境配置时间。60秒内开始编码。',
    },
    description:
      '使用即开即用的云工作站消除开发环境摩擦。即时设置，完美隔离，企业级安全。',
    watchDemo: '在线演示 (2分钟)',
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
  const devboxSchema = generateDevBoxSchema(params.lang);

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
      <StructuredDataComponent data={[devboxSchema, breadcrumbSchema]} />

      <div className="h-full min-h-screen bg-white">
        <Header lang={params.lang} />
        <main className="custom-container px-8 pt-14 md:px-[15%]">
          <Hero
            title={t.title}
            mainTitleEmphasis={3}
            getStartedLink={`${appDomain}/?openapp=system-devbox`}
            lang={params.lang}
            videoCta={true}
            secondaryCta={{
              title: t.watchDemo,
              href: '#video-section',
            }}
          >
            <Video
              url="https://www.youtube.com/watch?v=TrEsUMwWtDg"
              placeholderImage={placeholderImage}
              title="Sealos DevBox"
              location="hero"
            />
          </Hero>

          {/* Social Proof Section */}
          <SocialProof lang={params.lang} />

          {/* Problem-Solution Structure */}
          <Problems lang={params.lang} />
          <Solutions lang={params.lang} />

          {/* Development Workflow */}
          <Workflow lang={params.lang} />

          {/* Metrics Visualization */}
          <MetricsVisualization lang={params.lang} />

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
