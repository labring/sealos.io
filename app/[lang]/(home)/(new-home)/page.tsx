import { HeroSection } from './sections/hero-section';
import { DemosSection } from './sections/demos-section';
import { TerminalAgentSection } from './sections/terminal-agent-section';
import { BrainCapsSection } from './sections/brain-caps-section';
import { ComparisonSection } from './sections/comparison-section';
import { AppsSection } from './sections/apps-section';
import { FAQSection } from './sections/faq-section';
import { CTASection } from './sections/cta-section';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <DemosSection />
      <TerminalAgentSection />
      <BrainCapsSection />
      <ComparisonSection />
      <AppsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
