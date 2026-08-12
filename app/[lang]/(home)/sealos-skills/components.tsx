import {
  AgentDirectorySection,
  CapabilitiesSection,
  HeroSection,
  SupportMatrixSection,
} from './top-sections';
import {
  FinalCtaSection,
  InstallSection,
  SetupFaqSection,
  WorkflowSection,
} from './bottom-sections';

export function SealosSkillsLanding() {
  return (
    <main className="-mt-24 min-w-0 overflow-x-clip bg-[#13111C] text-[#F5F2F8] selection:bg-[#4CAFE1] selection:text-[#0D1720]">
      <HeroSection />
      <WorkflowSection />
      <CapabilitiesSection />
      <AgentDirectorySection />
      <SupportMatrixSection />
      <InstallSection />
      <SetupFaqSection />
      <FinalCtaSection />
    </main>
  );
}
