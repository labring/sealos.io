// App Store listing page entry with semantic theme and marketplace browsing.
import type { CSSProperties } from 'react';
import Footer from '@/components/footer';
import { Header } from '@/new-components/Header';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType, LANGUAGES } from '@/lib/i18n';
import AppStoreContent from './components/app-store-content';
import AppStoreFAQ from './components/app-store-faq';
import FooterTransition from './components/footer-transition';

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
      className="min-h-screen overflow-hidden bg-background text-foreground"
    >
      <div className="sticky top-0 z-50 container pt-8">
        <Header lang={params.lang} />
      </div>

      <main>
        <AppStoreContent lang={params.lang} />
        <AppStoreFAQ />
        <FooterTransition />
      </main>

      <div className="bg-background">
        <Footer lang={params.lang} />
      </div>
    </div>
  );
}
