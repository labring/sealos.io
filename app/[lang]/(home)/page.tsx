import Guides from './components/guides';
import Trusted from './components/trusted';
import FeatureGrid from './components/feature-grid';
import WhyChooseUs from './components/why-choose-us';
import FAQ from './components/faq';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import Video from '@/components/video';
import { HovermeButton } from '@/components/button/hoverme';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { appDomain } from '@/config/site';
import RedirectSuggest from '@/components/redirectSuggest';
import { languagesType } from '@/lib/i18n';
import placeholderImage from '/public/images/video.webp';
import ScrollProgressWrapper from '@/components/scroll-progress-wrapper';

// Define translations for different languages
const translations = {
  en: {
    title: {
      main: 'Develop, deploy, and scale in one seamless cloud platform',
      sub: 'The Unified Cloud Platform for Developers',
    },
    discoverButton: 'Discover DevBox',
  },
  'zh-cn': {
    title: {
      main: '在一个无缝云平台中开发、部署和扩展',
      sub: '为开发者打造的统一云平台',
    },
    discoverButton: '探索 DevBox',
  },
};

export const metadata = generatePageMetadata({
  pathname: '/'
});

export default function HomePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  return (
    <div className="h-full bg-[#EBF2FF]">
      <Header lang={params.lang} />
      {/* Scroll progress indicator */}
      <ScrollProgressWrapper />

      <main className="custom-container px-8 pt-14 md:px-[15%]">
        <Hero
          title={translations[params.lang].title}
          mainTitleEmphasis={2}
          getStartedLink={appDomain}
          lang={params.lang}
        >
          <Video
            url="https://youtu.be/A9mxz0JaY2o"
            placeholderImage={placeholderImage}
          />
          <div className="my-8 flex items-center justify-center">
            <a href="/products/devbox">
              <HovermeButton text={translations[params.lang].discoverButton} />
            </a>
          </div>
        </Hero>

        <div className="mt-[64px] mb-[40px] h-[1px] bg-[#DDE7F7]"></div>
        <Trusted lang={params.lang} />
        <div className="mt-[64px] mb-[40px]"></div>
        <FeatureGrid />
        <WhyChooseUs lang={params.lang} />
        <Guides />
        <FAQ lang={params.lang} />
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer lang={params.lang} />
      <TailwindIndicator />
      <RedirectSuggest />
    </div>
  );
}
