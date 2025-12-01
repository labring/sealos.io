import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AiAgentStar } from '@/new-components/AiAgentStar';
import { GradientText } from '@/new-components/GradientText';
import { FeatureItem } from './FeatureItem';
import { cn } from '@/lib/utils';

interface FreeTrialCardProps {
  className?: string;
}

export function FreeTrialCard({ className }: FreeTrialCardProps) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-8 rounded-xl border bg-zinc-900 p-7',
        className,
      )}
    >
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex w-fit items-center gap-1 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-sm backdrop-blur-sm">
          <GradientText>New User Offer</GradientText>
          <AiAgentStar className="size-1.5" />
        </div>

        <div className="flex flex-wrap items-center gap-8 lg:flex-nowrap lg:gap-10">
          <div className="flex max-w-md flex-shrink-0 flex-col gap-3">
            <div className="flex items-end gap-3">
              <p className="text-foreground text-4xl font-bold">Free</p>
              <p className="text-foreground text-4xl font-bold">$0</p>
            </div>
            <p className="text-muted-foreground text-base whitespace-pre-wrap">
              For individuals. Perfect for getting started and deploying small
              apps on Sealos.
            </p>
          </div>

          <div className="hidden h-[6rem] w-px shrink-0 items-center justify-center border-l lg:block" />

          <div className="flex min-w-0 flex-1 items-start gap-6 lg:gap-8">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <FeatureItem text="Start with a 7-day free trial" />
              <FeatureItem text="4 vCPU" />
              <FeatureItem text="4GB RAM" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <FeatureItem text="1 GB of volume storage" />
              <FeatureItem text="500 MB included bandwidth" />
              <FeatureItem text="100 AI Credits" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-3 px-0 pt-5 pb-0">
        <Button variant="landing-primary" className="h-10 px-8">
          <span>Start Deploying</span>
          <ArrowRight className="ml-2 size-4" />
        </Button>
        <p className="text-muted-foreground text-center text-sm whitespace-pre-wrap">
          No credit card required
        </p>
      </div>
    </div>
  );
}
