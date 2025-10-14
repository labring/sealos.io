import { languagesType } from '@/lib/i18n';
import { Header } from './components/Header';
import { HeroSection } from './sections/HeroSection';
import { DemoSection } from './sections/DemoSection';
import { ChoicesSection } from './sections/ChoicesSection';
import { ComparisonSection } from './sections/ComparisonSection';

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
      <div className="sticky top-8 z-50 container">
        <Header />
      </div>

      <main className="container pt-8">
        <HeroSection />
        <DemoSection />
        <ChoicesSection />
        <ComparisonSection />
      </main>
    </>
  );
}
