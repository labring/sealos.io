'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AiAgentStar } from '@/new-components/AiAgentStar';
import { GradientText } from '@/new-components/GradientText';
import { FeatureItem } from './FeatureItem';
import { cn } from '@/lib/utils';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';

interface FreeTrialCardProps {
  className?: string;
}

export function FreeTrialCard({ className }: FreeTrialCardProps) {
  const openAuthForm = useOpenAuthForm();

  const handleStartDeploying = () => {
    openAuthForm({
      openapp: 'system-costcenter?mode=create',
    });
  };

  return (
    <div
      className={cn(
        'flex w-full flex-row flex-wrap items-center rounded-xl border bg-zinc-900 p-7',
        className,
      )}
    >
      <div className="flex w-full flex-col gap-4 sm:w-2/3 xl:w-auto">
        <div className="flex w-fit items-center gap-1 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-sm backdrop-blur-sm">
          <GradientText>New User Offer</GradientText>
          <AiAgentStar className="size-1.5" />
        </div>

        <div className="flex max-w-md flex-col gap-3">
          <div className="flex items-end gap-3">
            <p className="text-foreground text-4xl font-bold">Free</p>
            <p className="text-foreground text-4xl font-bold">$0</p>
          </div>
          <p className="text-muted-foreground text-base whitespace-pre-wrap">
            For individuals. Perfect for getting started and deploying small
            apps on Sealos.
          </p>
        </div>
      </div>

      <div className="mx-10 mt-10 hidden h-[6rem] w-px shrink-0 items-center justify-center border-l xl:block" />

      <div className="mt-8 ml-auto flex w-full flex-col justify-center gap-3 sm:mt-0 sm:w-1/3 sm:max-w-2xs xl:order-4 xl:w-auto">
        <Button
          variant="landing-primary"
          className="h-10 px-8"
          onClick={handleStartDeploying}
        >
          <span>Start Deploying</span>
          <ArrowRight className="ml-2 size-4" />
        </Button>
        <p className="text-muted-foreground text-sm whitespace-pre-wrap sm:text-center">
          No credit card required
        </p>
      </div>

      <div className="my-4 h-px w-full shrink-0 items-center justify-center border-t xl:hidden" />

      <div className="grid grow grid-cols-1 flex-col items-start gap-3 sm:grid-cols-2 sm:flex-row lg:grid-cols-3 xl:order-3 xl:mt-12 xl:grid-cols-2">
        <FeatureItem text="Start with a 7-day free trial" />
        <FeatureItem text="4 vCPU" />
        <FeatureItem text="4GB RAM" />
        <FeatureItem text="1 GB of volume storage" />
        <FeatureItem text="500 MB included bandwidth" />
        <FeatureItem text="100 AI Credits" />
      </div>
    </div>
  );
}
