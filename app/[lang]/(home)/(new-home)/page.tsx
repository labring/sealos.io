import { HeroSection } from './sections/hero-section';
import { TerminalAgentSection } from './sections/terminal-agent-section';
import { ComparisonSection } from './sections/comparison-section';
import { AppsSection } from './sections/apps-section';
import { FAQSection } from './sections/faq-section';
import { CTASection } from './sections/cta-section';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TerminalAgentSection />
      <ComparisonSection />
      <AppsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
