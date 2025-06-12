import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType } from '@/lib/i18n';
import { HovermeButton } from '@/components/button/hoverme';
import Feature from './components/feature';
import FAQ from './components/faq';

const title = {
  main: 'Launch Your Learning in the Cloud ',
  sub: 'Free Cloud Credits for Students and Teachers',
};

export const metadata = generatePageMetadata({
  title: 'Education | Free Cloud Credits for Students and Teachers',
  description: 'Launch your learning in the cloud with free cloud credits for students and teachers. Join thousands already using Sealos for education.',
  pathname: '/education'
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
        <Hero title={title} mainTitleEmphasis={2}>
          <div className="my-8 flex items-center justify-center">
            <HovermeButton
              text="Apply for Free Credits"
              href="https://go.sealos.io/edu-apply"
              location="hero"
            />
          </div>
          <p className="text-center font-medium">
            Join thousands of students already using Sealos for education
          </p>
        </Hero>
        <Feature />
        <FAQ />
      </main>
      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer lang={params.lang} />
    </div>
  );
}
