import {
  CompatibilitySection,
  HeroSection,
  PipelineSection,
} from './top-sections';
import {
  FinalCtaSection,
  RepositorySection,
  SetupSection,
  UseCasesSection,
} from './bottom-sections';

export function SealosSkillsLanding() {
  return (
    <>
      <div className="-mt-24 overflow-x-clip" role="main">
        <HeroSection />
      </div>
      <CompatibilitySection />
      <PipelineSection />
      <SetupSection />
      <RepositorySection />
      <UseCasesSection />
      <FinalCtaSection />
    </>
  );
}
