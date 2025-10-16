import { languagesType } from '@/lib/i18n';
import { Header } from './components/Header';
import { HeroSection } from './sections/HeroSection';
import { DemoSection } from './sections/DemoSection';
import { ChoicesSection } from './sections/ChoicesSection';
import { ComparisonSection } from './sections/ComparisonSection';
import { SequenceSection } from './sections/SequenceSection';
import { CapsSection } from './sections/CapsSection';
import SourceAvailSection from './merged-components/SourceAvailSection';
import FAQSection from './merged-components/FAQSection';
import Footer from './merged-components/Footer';
import Image from 'next/image';
import light4 from './assets/liht4.png';

const translations = {
  en: {},
  'zh-cn': {},
};

export default function HomePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang] || translations.en;

  return (
    <>
      <div className="sticky top-0 z-50 container pt-8">
        <Header />
      </div>

      <div className="-mt-24">
        <HeroSection />
      </div>

      <main className="container pt-8">
        <DemoSection />
        <ChoicesSection />
        <ComparisonSection />
        <SequenceSection />
        <CapsSection />
      </main>

      {/* 第六屏、七屏与页脚 */}
      <div>
        <div
          style={{
            paddingTop: '114px',
            paddingBottom: 0,
            paddingLeft: '64px',
            paddingRight: '64px',
          }}
        >
          <SourceAvailSection lang={'en'} />
        </div>
        <FAQSection />
        {/* 第七屏与页脚之间的光照背景 */}
        <div className="relative mt-[140px]">
          <div
            className="pointer-events-none absolute left-1/2 z-10 w-screen -translate-x-1/2"
            style={{ top: '-140px' }}
          >
            <Image
              src={light4}
              alt=""
              className="h-auto w-full select-none"
              priority
            />
          </div>
          {/* 间距容器，确保光照有展示空间 */}
          <div className="h-[330px]"></div>
        </div>
        <Footer lang={'en'} />
      </div>
    </>
  );
}
