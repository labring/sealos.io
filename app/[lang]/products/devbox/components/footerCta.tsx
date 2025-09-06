import { AnimateElement } from '@/components/ui/animated-wrapper';
import { CallToActionSection } from '@/components/ui/call-to-action-section';
import { appDomain } from '@/config/site';
import { languagesType } from '@/lib/i18n';

export default function Example({
  lang = 'en',
}: {
  lang?: languagesType;
}) {
  const buttonText =
    lang === 'zh-cn' ? '免费开始（无需信用卡）' : 'Start Free – No Credit Card';
  const buttonHref = `${appDomain}/?openapp=system-devbox`;
  return (
    <div className="mt-[140px]">
      <AnimateElement type="slideUp">
        <CallToActionSection
          title="Develop faster and deploy smarter with DevBox"
          buttonText={buttonText}
          buttonHref={buttonHref}
          newWindow={false}
          className=""
        />
      </AnimateElement>
    </div>
  );
}
