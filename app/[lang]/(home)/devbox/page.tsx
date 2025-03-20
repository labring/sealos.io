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

const title = {
  main: 'Ship 10x Faster with DevBox',
  sub: 'One-Click Cloud Development Environment',
};

export const metadata = generatePageMetadata({
  title: 'DevBox' + ' | ' + title.sub,
});

export default function HomePage({ params }: { params: { lang: string } }) {
  return (
    <div className="h-full bg-[#EBF2FF]">
      <Header lang={params.lang} />
      <main className="custom-container px-8 pt-14 md:px-[15%]">
        <Hero
          title={title}
          mainTitleEmphasis={1}
          getStartedLink={`${appDomain}/?openapp=system-devbox`}
        >
          <Video url="https://youtu.be/A9mxz0JaY2o" />
        </Hero>
        <div className="mb-[64px]  mt-[64px] h-[1px] bg-[#DDE7F7]"></div>
        <FeatureFour />
        <TechGrid />
        <Feature />
        <FooterCta />
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer />
      <TailwindIndicator />
    </div>
  );
}
