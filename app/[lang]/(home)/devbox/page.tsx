import Feature from './components/feature';
import FeatureFour from './components/featurefour';
import TechGrid from './components/techgrid';
import FooterCta from './components/footerCta';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import Video from '@/components/video';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { appDomain } from '@/config/site';
import { languagesType } from '@/lib/i18n';
import placeholderImage from '/public/images/video.webp';

const title = {
  main: 'Code. Build. Deploy. We’ve Got the Rest.',
  sub: 'Seamless development from start to production. ',
};

export const metadata = generatePageMetadata({
  title: 'DevBox' + ' | ' + title.sub,
});

export default function HomePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  return (
    <div className="h-full bg-[#EBF2FF]">
      <Header lang={params.lang} />
      <main className="custom-container px-8 pt-14 md:px-[15%]">
        <Hero
          title={title}
          mainTitleEmphasis={1}
          getStartedLink={`${appDomain}/?openapp=system-devbox`}
        >
          <Video
            url="https://youtu.be/A9mxz0JaY2o"
            placeholderImage={placeholderImage}
          />
        </Hero>
        <div className="mb-[64px]  mt-[64px] h-[1px] bg-[#DDE7F7]"></div>
        <FeatureFour />
        <div id="one-click-deployment" className="scroll-mt-20" />
        <TechGrid />
        <Feature />
        <FooterCta />
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer lang={params.lang} />
      <TailwindIndicator />
    </div>
  );
}
