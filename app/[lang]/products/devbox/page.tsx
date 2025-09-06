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
import USPChips from './components/usp-chips';
import PositioningStrip from './components/positioning-strip';

// Define translations for different languages
const translations = {
  en: {
    title: {
      main: 'Ship 10x Faster with Cloud Development Environments',
      sub: 'Beyond cloud IDE: code, package, and deploy in one platform.',
    },
    description:
      'Standard image-based releases, one-click deploy, IDE-agnostic, 100% environment parity.',
    watchDemo: 'Live Demo (2 min)',
  },
  'zh-cn': {
    title: {
      main: '使用云端开发环境，交付速度提升10倍',
      sub: '不仅是云 IDE：在一个平台上完成编码、打包与部署。',
    },
    description:
      '标准镜像发布，一键部署，IDE 不限，环境 100% 一致。',
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
    title: 'Sealos DevBox — ' + t.title.sub,
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
            getStartedText={
              params.lang === 'zh-cn'
                ? '免费开始（无需信用卡）'
                : 'Start Free – No Credit Card'
            }
            lang={params.lang}
            videoCta={true}
            secondaryCta={{
              title: t.watchDemo,
              href: '#video-section',
            }}
          >
            <USPChips lang={params.lang} />
            <div id="video-section" className="mt-8">
              <Video
                url="https://www.youtube.com/watch?v=TrEsUMwWtDg"
                placeholderImage={placeholderImage}
                title="Sealos DevBox"
                location="hero"
              />
            </div>
          </Hero>

          {/* Positioning Strip */}
          <PositioningStrip lang={params.lang} />

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

          <FooterCta lang={params.lang} />
        </main>
        <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
        <Footer lang={params.lang} />
      </div>
    </>
  );
}
