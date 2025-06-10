import Feature from './components/feature';
import Databases from './components/databases';
import FooterCta from './components/footerCta';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { appDomain } from '@/config/site';
import { languagesType } from '@/lib/i18n';

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

export const metadata = generatePageMetadata({
  title: 'Cloud Databases' + ' | ' + translations.en.title.sub,
});

export default function DatabasesPage({
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
          mainTitleEmphasis={1}
          getStartedLink={`${appDomain}/?openapp=system-database`}
          lang={params.lang}
          testimonial={false}
          videoCta={false}
        ></Hero>
        <Feature />
        <div id="deploy" className="scroll-m-0" />
        <Databases />
        <FooterCta />
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer lang={params.lang} />
    </div>
  );
}
