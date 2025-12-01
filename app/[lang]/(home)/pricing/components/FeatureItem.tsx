import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureItemProps {
  text: string;
  className?: string;
}

export function FeatureItem({ text, className }: FeatureItemProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="size-4 shrink-0">
        <Check className="text-muted-foreground size-4" />
      </div>
      <p className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
        {text}
      </p>
    </div>
  );
}
