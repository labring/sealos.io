import Feature from './components/feature';
import HighlightedApps from './components/highlighted-apps';
import FooterCta from './components/footerCta';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { templateDomain } from '@/config/site';
import { languagesType } from '@/lib/i18n';

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

export const metadata = generatePageMetadata({
  title: 'App Store' + ' | ' + translations.en.title.sub,
  pathname: '/products/app-store'
});

export default function AppStorePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang] || translations.en;

  return (
    <div className="h-full bg-[#EBF2FF]">
      <Header lang={params.lang} />
      <main className="custom-container px-8 pt-14 md:px-[15%]">
        <Hero
          title={t.title}
          mainTitleEmphasis={2}
          getStartedLink={templateDomain}
          lang={params.lang}
          testimonial={false}
          videoCta={false}
        ></Hero>
        <Feature />
        <div id="deploy" className="scroll-m-0" />

        <HighlightedApps lang={params.lang} />
        <FooterCta />
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer lang={params.lang} />
    </div>
  );
}
