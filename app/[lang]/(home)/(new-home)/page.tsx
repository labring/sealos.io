import { HeroSection } from './sections/hero/hero-section';
import { TerminalAgentSection } from './sections/terminal-agent/terminal-agent-section';
import { BrainCapsSection } from './sections/brain-caps/brain-caps-section';
import { ComparisonSection } from './sections/comparison-section';
import { AppsSection } from './sections/apps/apps-section';
import { FAQSection } from './sections/faq-section';
import { CTASection } from './sections/cta/cta-section';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TerminalAgentSection />
      <BrainCapsSection />
      <ComparisonSection />
      <AppsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
