import { ArrowRight } from 'lucide-react';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { appDomain } from '@/config/site';
import Image from 'next/image';
import quickStartImage from '/public/images/quick-start.png';
import { CustomButton } from '@/components/ui/button-custom';

interface CallToActionSectionProps {
  title: string;
  buttonText: string;
  buttonHref?: string;
  className?: string;
  showImage?: boolean;
  trackingLocation?: string;
}

export function CallToActionSection({
  title,
  buttonText,
  buttonHref = appDomain,
  className = 'mt-[100px]',
  showImage = true,
}: CallToActionSectionProps) {
  return (
    <div
      className={`relative flex w-full flex-col justify-between overflow-hidden rounded-[20px] ${className}`}
      style={{
        background: 'linear-gradient(90deg, #D6EEFF 0%, #E1F3FF 100%)',
      }}
    >
      {showImage && (
        <Image
          src={quickStartImage}
          alt="Quick Start"
          className="pointer-events-none absolute top-0 right-0 z-0 hidden h-full w-auto object-cover lg:block"
          style={{ maxHeight: 400, minWidth: 320 }}
        />
      )}
      <AnimateElement type="slideUp">
        <div className="relative z-10 flex size-full flex-col justify-center gap-16 px-4 py-16 sm:px-[72px] md:pr-0">
          <div className="text-base leading-normal font-bold text-black sm:text-[28px]">
            {title}
          </div>
          <CustomButton
            className="text-custom-primary-text shadow-button flex w-fit cursor-pointer items-center justify-center gap-[6px] rounded-md bg-[#FAFCFF] py-2 pr-4 pl-5 font-medium hover:bg-[#F1F5FB]"
            title={buttonText}
            href={buttonHref}
            newWindow={true}
            location="footer-cta"
          >
            {buttonText}
            <ArrowRight className="relative h-4 w-4" />
          </CustomButton>
        </div>
      </AnimateElement>
    </div>
  );
}

export default CallToActionSection;
