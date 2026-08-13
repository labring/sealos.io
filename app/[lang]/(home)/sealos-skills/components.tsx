import type { languagesType } from '@/lib/i18n';
import { CapabilitiesSection, HeroSection } from './top-sections';
import {
  FinalCtaSection,
  SetupFaqSection,
  WorkflowSection,
} from './bottom-sections';
import { AgentDirectorySection } from './agent-directory';
import { SkillsPageShell } from './shared';

export function SealosSkillsLanding({ lang }: { lang: languagesType }) {
  return (
    <SkillsPageShell>
      <HeroSection />
      <AgentDirectorySection lang={lang} />
      <WorkflowSection />
      <CapabilitiesSection />
      <SetupFaqSection />
      <FinalCtaSection />
    </SkillsPageShell>
  );
}
