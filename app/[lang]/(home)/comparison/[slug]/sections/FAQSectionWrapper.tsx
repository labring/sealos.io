import { ComparisonConfig } from '../../config/platforms';
import { FAQSection } from '../components/FAQSection';

interface FAQSectionWrapperProps {
  firstPlatform: ComparisonConfig;
  secondPlatform: ComparisonConfig;
}

export function FAQSectionWrapper({
  firstPlatform,
  secondPlatform,
}: FAQSectionWrapperProps) {
  return (
    <section className="container mx-auto max-w-4xl px-4 py-16">
      <FAQSection
        firstPlatform={firstPlatform}
        secondPlatform={secondPlatform}
      />
    </section>
  );
}
