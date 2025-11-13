'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactNode, memo } from 'react';
import { useGTM } from '@/hooks/use-gtm';

interface CarouselCardProps {
  children: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export const CarouselCard = memo(function CarouselCard({
  children,
  title,
  description,
  buttonText,
  buttonLink,
}: CarouselCardProps) {
  const { trackButton } = useGTM();

  return (
    <div className="relative mt-6 flex flex-col border-zinc-700">
      <div
        className="inset-shadow-bubble pointer-events-none absolute z-10 h-full w-full rounded-2xl"
        aria-hidden="true"
      />
      <div
        className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border-b border-zinc-700 md:aspect-[16/9] lg:aspect-[24/9]"
        aria-hidden="true"
      >
        {children}
      </div>
      <div className="flex flex-col gap-6 px-12 pt-6 pb-8 sm:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl text-zinc-200 md:text-2xl">{title}</h3>
          <p className="text-sm text-zinc-500 md:text-base">{description}</p>
        </div>

        <div>
          <Button variant="landing-primary" asChild>
            <a
              href={buttonLink}
              onClick={() =>
                trackButton(
                  'Get Started',
                  'sequence-carousel',
                  'url',
                  buttonLink,
                )
              }
            >
              <span>{buttonText}</span>
              <ArrowRight size={16} className="ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
});
