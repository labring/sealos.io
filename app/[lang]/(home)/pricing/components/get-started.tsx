import { ArrowRight } from 'lucide-react';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { appDomain } from '@/config/site';
import Image from 'next/image';
import quickStartImage from '/public/images/quick-start.png';

export default function GetStarted() {
  return (
    <div className="mt-[140px]">
      <AnimateElement type="slideUp">
        <div
          className="flex w-full flex-col justify-between overflow-hidden rounded-[20px] md:flex-row"
          style={{
            background: 'linear-gradient(90deg, #D6EEFF 0%, #E1F3FF 100%)',
          }}
        >
          <AnimateElement type="slideUp">
            <div className="flex size-full flex-col justify-center gap-16 px-4 py-16 sm:px-[72px] md:pr-0">
              <div className="text-base leading-normal font-bold text-black sm:text-[28px]">
                Start a New Development Environment in Seconds
              </div>
              <a href={appDomain} target="_blank">
                <div className="text-custom-primary-text shadow-button flex w-fit cursor-pointer items-center justify-center gap-[6px] rounded-md bg-[#FAFCFF] py-2 pr-4 pl-5 font-medium hover:bg-[#F1F5FB]">
                  New Project
                  <ArrowRight className="relative h-4 w-4" />
                </div>
              </a>
            </div>
          </AnimateElement>
          <Image
            src={quickStartImage}
            alt="Quick Start"
            className="ml-auto block h-[312px] w-[478px] object-cover"
          />
        </div>
      </AnimateElement>
    </div>
  );
}
