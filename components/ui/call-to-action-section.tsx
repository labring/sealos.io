import { ArrowRight } from 'lucide-react';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { appDomain } from '@/config/site';
import Image from 'next/image';
import quickStartImage from '/public/images/quick-start.png';
import { CustomButton } from '@/components/ui/custom-button';

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
      className={`flex w-full flex-col justify-between overflow-hidden rounded-[20px] md:flex-row ${className}`}
      style={{
        background: 'linear-gradient(90deg, #D6EEFF 0%, #E1F3FF 100%)',
      }}
    >
      <AnimateElement type="slideUp">
        <div className="flex size-full flex-col justify-center gap-16 px-4 py-16 sm:px-[72px] md:pr-0">
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
      {showImage && (
        <Image
          src={quickStartImage}
          alt="Quick Start"
          className="ml-auto block h-[312px] w-[478px] object-cover"
        />
      )}
    </div>
  );
}
