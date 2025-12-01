import { languagesType } from '@/lib/i18n';
import { HeroSection } from './sections/HeroSection';
import { DemoSection } from './sections/DemoSection';
import { ChoicesSection } from './sections/ChoicesSection';
import { ComparisonSection } from './sections/ComparisonSection';
import { SequenceSection } from './sections/SequenceSection';
import { CapsSection } from './sections/CapsSection';
import SourceAvailSection from './sections/SourceAvailSection';
import FAQSection from './sections/FAQSection';
import { faqData } from './config/faq-data';
import { generateFAQSchema } from '@/lib/utils/structured-data';
import { StructuredDataComponent } from '@/components/structured-data';

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
  const faqSchema = generateFAQSchema(faqData, params.lang);

  return (
    <>
      <StructuredDataComponent data={faqSchema} />
      <div className="-mt-24 overflow-x-clip" role="main">
        <HeroSection />
      </div>

      <DemoSection />

      <ChoicesSection />
      <ComparisonSection />
      <SequenceSection />
      <CapsSection />

      <SourceAvailSection />
      <FAQSection />
    </>
  );
}
