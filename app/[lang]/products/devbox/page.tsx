import Problems from './components/problems';
import Solutions from './components/solutions-v2';
import Workflow from './components/workflow-v2';
import MetricsVisualization from './components/metrics-visualization';
import TechGrid from './components/techgrid';
import FooterCta from './components/footerCta';
import SocialProof from './components/social-proof';
import { Footer } from '@/new-components/Footer';
import { Header } from '@/new-components/Header';
import { HeroBackground } from '@/app/[lang]/(home)/(new-home)/components/HeroBackground';
import { GodRays } from '@/new-components/GodRays';
import Image from 'next/image';
import Video from '@/components/video';
import { Button } from '@/components/ui/button';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { appDomain, siteConfig } from '@/config/site';
import { languagesType } from '@/lib/i18n';
import placeholderImage from '/public/images/video.webp';
import BottomLightImage from '@/assets/bottom-light.svg';
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
    description: '标准镜像发布，一键部署，IDE 不限，环境 100% 一致。',
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
      <StructuredDataComponent data={[devboxSchema, breadcrumbSchema]} />

      <div className="min-h-screen overflow-x-clip text-white">
        <div className="sticky top-0 z-50 container pt-8">
          <Header lang={params.lang} />
        </div>

        <main className="-mt-24 overflow-x-clip bg-black">
          <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24 lg:pt-48 lg:pb-28">
            <HeroBackground />
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
                  opacityMin: 0.84,
                  opacityMax: 0.85,
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
              speed={0}
              maxWidth={48}
              minLength={1200}
              maxLength={2000}
              blur={8}
            />

            <div className="relative z-10 container">
              <div className="mx-auto max-w-5xl text-center">
                <USPChips lang={params.lang} />
                <h1 className="mt-10 text-4xl leading-tight font-medium tracking-normal text-white sm:text-6xl lg:text-7xl">
                  {t.title.main}
                </h1>
                <p className="mx-auto mt-6 max-w-3xl bg-linear-to-r from-white to-blue-600 bg-clip-text text-2xl leading-tight font-medium text-transparent sm:text-4xl lg:text-5xl">
                  {t.title.sub}
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                  {t.description}
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Button
                    asChild
                    variant="landing-primary"
                    size="lg"
                    className="h-12 w-full px-7 text-base sm:w-auto"
                  >
                    <a href={`${appDomain}/?openapp=system-devbox`}>
                      {params.lang === 'zh-cn'
                        ? '免费开始（无需信用卡）'
                        : 'Start Free – No Credit Card'}
                    </a>
                  </Button>
                  <a
                    href="#video-section"
                    className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 text-base font-medium text-white backdrop-blur transition-colors hover:bg-white/10 sm:w-auto"
                  >
                    {t.watchDemo}
                  </a>
                </div>
              </div>

              <div
                id="video-section"
                className="mx-auto mt-12 w-full max-w-5xl scroll-mt-28 rounded-3xl border border-white/10 bg-white/[0.03] p-2 shadow-[0_24px_80px_rgba(20,109,255,0.18)] backdrop-blur sm:p-3"
              >
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <Video
                    url="https://www.youtube.com/watch?v=TrEsUMwWtDg"
                    placeholderImage={placeholderImage}
                    title="Sealos DevBox"
                    location="hero"
                  />
                </div>
              </div>

              <PositioningStrip lang={params.lang} />
            </div>
          </section>

          <div className="container space-y-16 pb-20 sm:space-y-24 lg:space-y-28">
            <SocialProof lang={params.lang} />
            <Problems lang={params.lang} />
            <Solutions lang={params.lang} />
            <Workflow lang={params.lang} />
            <MetricsVisualization lang={params.lang} />

            <div id="one-click-deployment" className="scroll-mt-28" />
            <TechGrid />
            <FooterCta lang={params.lang} />
          </div>
        </main>

        <div className="relative mt-[80px] mb-[400px] h-[800px]">
          <div className="w-full">
            <Image
              src={BottomLightImage}
              alt=""
              className="h-auto w-full object-cover select-none"
              priority
              fill
            />
          </div>

          <Footer lang={params.lang} />
        </div>
      </div>
    </>
  );
}
