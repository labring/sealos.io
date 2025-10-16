import { languagesType } from '@/lib/i18n';
import { Header } from './components/Header';
import { HeroSection } from './sections/HeroSection';
import { DemoSection } from './sections/DemoSection';
import { ChoicesSection } from './sections/ChoicesSection';
import { ComparisonSection } from './sections/ComparisonSection';
import { SequenceSection } from './sections/SequenceSection';
import { CapsSection } from './sections/CapsSection';

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
    </>
  );
}
