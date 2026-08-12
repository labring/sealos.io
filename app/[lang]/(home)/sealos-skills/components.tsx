import type { languagesType } from '@/lib/i18n';
import { CapabilitiesSection, HeroSection } from './top-sections';
import {
  FinalCtaSection,
  SetupFaqSection,
  WorkflowSection,
} from './bottom-sections';
import { AgentDirectorySection } from './agent-directory';

export function SealosSkillsLanding({ lang }: { lang: languagesType }) {
  return (
    <main className="-mt-24 min-w-0 overflow-x-clip bg-[#13111C] text-[#F5F2F8] selection:bg-[#4CAFE1] selection:text-[#0D1720]">
      <HeroSection />
      <AgentDirectorySection lang={lang} />
      <WorkflowSection />
      <CapabilitiesSection />
      <SetupFaqSection />
      <FinalCtaSection />
    </main>
  );
}
