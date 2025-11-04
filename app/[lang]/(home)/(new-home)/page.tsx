import { languagesType } from '@/lib/i18n';
import { HeroSection } from './sections/HeroSection';
import { DemoSection } from './sections/DemoSection';
import { ChoicesSection } from './sections/ChoicesSection';
import { ComparisonSection } from './sections/ComparisonSection';
import { SequenceSection } from './sections/SequenceSection';
import { CapsSection } from './sections/CapsSection';
import SourceAvailSection from './merged-components/SourceAvailSection';
import FAQSection from './sections/FAQSection';

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
      <div className="-mt-24 overflow-x-clip" role="main">
        <HeroSection />
      </div>

      <DemoSection />

      <ChoicesSection />
      <ComparisonSection />
      <SequenceSection />
      <CapsSection />

      <div className="w-screen overflow-x-clip">
        <SourceAvailSection />
        <FAQSection />
      </div>
    </>
  );
}
