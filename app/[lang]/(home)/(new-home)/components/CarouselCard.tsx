import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface CarouselCardProps {
  children: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function CarouselCard({
  children,
  title,
  description,
  buttonText,
  onButtonClick,
}: CarouselCardProps) {
  return (
    <div className="relative mt-6 flex flex-col border-zinc-700">
      <div className="inset-shadow-bubble pointer-events-none absolute z-10 h-full w-full rounded-2xl" />
      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden border-b border-zinc-700 md:aspect-[16/9] lg:aspect-[24/9]">
        {children}
      </div>
      <div className="flex flex-col gap-6 px-12 pt-6 pb-8 sm:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-xl text-zinc-200 md:text-2xl">{title}</h3>
          <p className="text-sm text-zinc-500 md:text-base">{description}</p>
        </div>

        <div>
          <Button variant="landing-primary" onClick={onButtonClick}>
            <span>{buttonText}</span>
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
