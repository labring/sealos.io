// App Store listing page entry with semantic theme and Hero variant.
import Feature from './components/feature';
import HighlightedApps from './components/highlighted-apps-server';
import FooterCta from './components/footerCta';
import Footer from '@/components/footer';
import { Header } from '@/new-components/Header';
import Hero from '@/components/header/hero';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType, LANGUAGES } from '@/lib/i18n';

// Define translations for different languages
const translations = {
  en: {
    title: {
      main: 'Deploy Applications in One Click',
      sub: 'Transform complex Kubernetes deployments into simple app store experiences.',
    },
  },
  'zh-cn': {
    title: {
      main: '一键部署应用程序',
      sub: '将复杂的 Kubernetes 部署转换为简单的应用商店体验.',
    },
  },
};

// Generate static params for all supported languages
export async function generateStaticParams() {
  return LANGUAGES.map((lang) => ({
    lang: lang,
  }));
}

// Generate metadata function that supports internationalization
export function generateMetadata({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang] || translations.en;
  return generatePageMetadata({
    title: 'App Store' + ' | ' + t.title.sub,
    description: t.title.main + ' ' + t.title.sub,
    pathname: '/products/app-store',
    lang: params.lang,
  });
}

export default function AppStorePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang] || translations.en;

  return (
    <div
      data-theme="app-store"
      className="min-h-screen bg-background text-foreground"
    >
      <div className="sticky top-21 z-50 container pt-8 sm:top-14 lg:top-12">
        <Header />
      </div>
      <main className="custom-container px-8 pt-14 md:px-[15%]">
        <Hero
          title={t.title}
          mainTitleEmphasis={2}
          variant="app-store"
          getStartedLink="#featured-apps"
          lang={params.lang}
          testimonial={false}
          videoCta={false}
        ></Hero>
        <Feature />
        <div id="deploy" className="scroll-m-0" />

        <HighlightedApps lang={params.lang} />
        <FooterCta />
      </main>
      <div className="mt-[140px] h-[1px] bg-border"></div>
      <Footer lang={params.lang} />
    </div>
  );
}
