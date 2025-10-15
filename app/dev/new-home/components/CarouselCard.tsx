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
      <div className="flex h-[28rem] min-h-[28rem] overflow-hidden border-b border-zinc-700">
        {children}
      </div>
      <div className="flex items-center justify-between px-12 pt-6 pb-8">
        <div className="flex flex-col">
          <h3 className="text-2xl text-zinc-200">{title}</h3>
          <p className="text-zinc-500">{description}</p>
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
