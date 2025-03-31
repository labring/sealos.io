import Guides from './components/guides';
import Trusted from './components/trusted';
import FeatureGrid from './components/feature-grid';
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

const title = {
  main: 'Develop, deploy, and scale in one seamless cloud platform',
  sub: 'The Unified Cloud Platform for Developers',
};

export const metadata = generatePageMetadata();

export default function HomePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  return (
    <div className="h-full bg-[#EBF2FF]">
      <Header lang={params.lang} />
      <main className="custom-container px-8 pt-14 md:px-[15%]">
        <Hero title={title} mainTitleEmphasis={2} getStartedLink={appDomain}>
          <Video
            url="https://youtu.be/A9mxz0JaY2o"
            image={{
              src: '/images/video.webp',
              width: 1280,
              height: 720,
            }}
          />
          <div className="my-8 flex items-center justify-center">
            <a href="/devbox">
              <HovermeButton text="Discover DevBox" />
            </a>
          </div>
        </Hero>

        <div className="mb-[64px]  mt-[64px] h-[1px] bg-[#DDE7F7]"></div>
        <Trusted />
        <div className="mb-[64px]  mt-[64px]"></div>
        <FeatureGrid />
        <Guides />
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer />
      <TailwindIndicator />
      <RedirectSuggest />
    </div>
  );
}
