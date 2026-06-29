import { HeroSection } from './sections/hero-section';
import { GitHubImportSection } from './sections/github-import-section';
import { DockerImageSection } from './sections/docker-image-section';
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
      <GitHubImportSection />
      <DockerImageSection />
      <TerminalAgentSection />
      <BrainCapsSection />
      <ComparisonSection />
      <AppsSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}
