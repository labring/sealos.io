import { AnimateElement } from '@/components/ui/animated-wrapper';
import { CallToActionSection } from '@/components/ui/call-to-action-section';

export default function GetStarted() {
  return (
    <div className="mt-[140px]">
      <AnimateElement type="slideUp">
        <CallToActionSection
          title="Start a New Development Environment in Seconds"
          buttonText="New Project"
          className=""
        />
      </AnimateElement>
    </div>
  );
}
