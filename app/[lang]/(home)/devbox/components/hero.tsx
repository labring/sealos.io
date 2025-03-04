import { cn } from '@/lib/utils';
import { ArrowRight, Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import AnimatedGridPattern from '@/components/ui/animated-grid-pattern';
import TypingAnimation from '@/components/ui/typing-animation';
import Image from 'next/image';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { GetStartedButton } from '@/components/ui/shiny-button';

const DynamicVideo = dynamic(() => import('@/components/header/video'), {
  ssr: false,
});

export default function Hero() {
  return (
    <div className="relative">
      <Image
        className="absolute left-4  top-4 z-10 h-[28px] w-[34px] lg:left-28 lg:top-28 lg:h-[100px] lg:w-[136px]"
        src="/images/header-1.svg"
        alt="hero-bg"
        width={136}
        height={100}
      />
      <Image
        className="absolute -top-8 right-20 z-10 h-[28px] w-[34px] lg:right-64 lg:h-[115px] lg:w-[181px]"
        src="/images/header-2.svg"
        alt="hero-bg"
        width={181}
        height={115}
      />
      <Image
        className="absolute right-12 top-[130px] z-10 h-[28px] w-[34px] lg:right-36 lg:top-[330px] lg:h-[92px] lg:w-[153px]"
        src="/images/header-3.svg"
        alt="hero-bg"
        width={153}
        height={92}
      />

      <div className="relative flex min-h-[700px] w-full flex-col overflow-hidden rounded-lg pb-0 pt-6 sm:py-14 lg:min-h-[1000px] lg:py-20">
        <div className="z-10 whitespace-pre-wrap text-center tracking-tighter text-black">
          <AnimateElement type="slideUp" delay={0.2} duration={0.6}>
            <div
              className="text-xl font-bold leading-[30px] sm:text-[40px] sm:leading-[54px] lg:text-[48px] lg:leading-[64px] xl:text-[56px] xl:leading-[82px]"
              style={{ letterSpacing: '0.15px' }}
            >
              <span className="block">Ship 10x Faster with</span>
              <span className="block">Sealos DevBox</span>
            </div>
            <div
              className="mx-auto my-6 max-w-[700px] text-xs font-medium text-custom-secondary-text sm:text-base"
              style={{ letterSpacing: '0.15px' }}
            >
              In just one-click DevBox enables you to spin up full-stack
              development environments. Develop, test, release, deploy, and
              scale all in one seamless workflow.
            </div>

            <div className="flex items-center justify-center gap-4 text-base font-medium">
              <a href="https://usw.sealos.io" target="_blank">
                <GetStartedButton />
              </a>
              <a href="mailto:contact@sealos.io" target="_blank">
                <div className="flex cursor-pointer items-center justify-center gap-[6px] rounded-md bg-[#FAFCFF] px-4 py-2 text-custom-primary-text shadow-button hover:bg-[#F1F5FB] sm:px-5">
                  Contact Sales
                </div>
              </a>
            </div>
          </AnimateElement>
        </div>

        <DynamicVideo />

        <AnimatedGridPattern
          width={72}
          height={72}
          numSquares={200}
          maxOpacity={0.5}
          duration={1}
          className={cn(
            '[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]',
            'top-10 h-[600px]',
          )}
        />
      </div>
      <div className="z-1 absolute bottom-32  h-[400px] w-full bg-[#99E0FFB2] blur-[200px]"></div>
    </div>
  );
}
