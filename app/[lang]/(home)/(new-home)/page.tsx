import { HeroSection } from './sections/hero-section';
import { ComparisonSection } from './sections/comparison-section';
import { AppsSection } from './sections/apps-section';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ComparisonSection />
      <AppsSection />
    </main>
  );
}
