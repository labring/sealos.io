// App Store listing page entry with semantic theme and marketplace browsing.
import type { CSSProperties } from 'react';
import Image from 'next/image';
import { Footer } from '@/new-components/Footer';
import { Header } from '@/new-components/Header';
import BottomLightImage from '@/assets/bottom-light.svg';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType, LANGUAGES } from '@/lib/i18n';
import AppStoreContent from './components/app-store-content';
import AppStoreFAQ from './components/app-store-faq';

const translations = {
  en: {
    title: {
      main: 'Ready-to-use, One-Click Deployment',
      sub: 'Discover top-tier open-source applications and run them through the Sealos automation engine.',
    },
  },
  'zh-cn': {
    title: {
      main: '一键部署应用程序',
      sub: '将复杂的 Kubernetes 部署转换为简单的应用商店体验.',
    },
  },
};

const appStoreBackgroundVars = {
  '--background': '0 0% 3.9%',
  '--card': '0 0% 3.9%',
  '--popover': '0 0% 3.9%',
} as CSSProperties;

export async function generateStaticParams() {
  return LANGUAGES.map((lang) => ({
    lang,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang] || translations.en;
  return generatePageMetadata({
    title: 'App Store' + ' | ' + t.title.main,
    description: t.title.sub,
    pathname: '/products/app-store',
    lang: params.lang,
  });
}

export default function AppStorePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  return (
    <div
      data-theme="app-store"
      style={appStoreBackgroundVars}
      className="isolate min-h-screen bg-background text-foreground"
    >
      <div className="sticky top-0 z-50 container pt-8">
        <Header lang={params.lang} />
      </div>

      <main>
        <AppStoreContent lang={params.lang} />
        <AppStoreFAQ />
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
