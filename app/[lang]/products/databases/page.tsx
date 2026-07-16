import Feature from './components/feature';
import Databases from './components/databases';
import FooterCta from './components/footerCta';
import { Footer } from '@/new-components/Footer';
import { Header } from '@/new-components/Header';
import { LegacyHeroBackground } from '@/app/[lang]/(home)/(new-home)/components/LegacyHeroBackground';
import { GodRays } from '@/new-components/GodRays';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { appDomain } from '@/config/site';
import { languagesType } from '@/lib/i18n';
import BottomLightImage from '@/assets/bottom-light.svg';

// Define translations for different languages
const translations = {
  en: {
    title: {
      main: 'Cloud Databases That Scale With You',
      sub: 'Managed databases that grow with your applications.',
    },
  },
  'zh-cn': {
    title: {
      main: '随您扩展的云数据库',
      sub: '与您的应用程序一起成长的托管数据库.',
    },
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
    title: 'Cloud Databases' + ' | ' + t.title.sub,
    description: t.title.main + ' ' + t.title.sub,
    pathname: '/products/databases',
    lang: params.lang,
  });
}

export default function DatabasesPage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang] || translations.en;

  return (
    <div className="min-h-screen overflow-x-clip text-white">
      <div className="pointer-events-none fixed inset-0 -z-20 bg-[#0A0A0A]" />

      <div className="sticky top-0 z-50 container pt-8">
        <Header lang={params.lang} />
      </div>

      <main className="-mt-24 overflow-x-clip bg-black">
        <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-24 lg:pt-48 lg:pb-28">
          <LegacyHeroBackground />
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
              <h1 className="text-4xl leading-tight font-medium tracking-normal text-white sm:text-6xl lg:text-7xl">
                {t.title.main}
              </h1>
              <p className="mx-auto mt-6 max-w-3xl bg-linear-to-r from-white to-blue-600 bg-clip-text text-2xl leading-tight font-medium text-transparent sm:text-4xl lg:text-5xl">
                {t.title.sub}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  variant="landing-primary"
                  size="lg"
                  className="h-12 w-full px-7 text-base sm:w-auto"
                >
                  <a href={`${appDomain}/?openapp=system-database`}>
                    {params.lang === 'zh-cn'
                      ? '免费开始 (无需信用卡)'
                      : 'Get Started'}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container space-y-16 pb-20 sm:space-y-24 lg:space-y-28">
          <Feature />
          <div id="deploy" className="scroll-m-0" />
          <Databases />
          <FooterCta />
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
  );
}
