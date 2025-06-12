import { AnimateElement } from '@/components/ui/animated-wrapper';
import { CallToActionSection } from '@/components/ui/call-to-action-section';
import { appDomain } from '@/config/site';

export default function Example() {
  return (
    <div className="mt-[140px]">
      <AnimateElement type="slideUp">
        <CallToActionSection
          title="Develop faster and deploy smarter with DevBox"
          buttonText="Try DevBox today!"
          buttonHref={`${appDomain}/?openapp=system-devbox`}
          className=""
        />
      </AnimateElement>
    </div>
  );
}
