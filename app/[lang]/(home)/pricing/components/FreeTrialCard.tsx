'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGTM } from '@/hooks/use-gtm';
import { getRybbitCtaProps } from '@/lib/analytics/rybbit-cta';

interface FreeTrialCardProps {
  className?: string;
}

const FREE_TRIAL_URL =
  'https://os.sealos.io/?openapp=system-costcenter?mode%3dcreate';

export function FreeTrialCard({ className }: FreeTrialCardProps) {
  const { trackButton, trackCustom } = useGTM();

  const handleStartDeploying = () => {
    trackButton(
      'Get Started',
      'pricing-free-trial-card',
      'url',
      FREE_TRIAL_URL,
      {
        plan_name: 'Free Trial',
        plan_price: '$0',
      },
    );
    trackCustom('pricing_plan_selected', {
      plan_id: 'free-trial',
      plan_price: 0,
      location: 'free_trial_card',
    });

    window.open(FREE_TRIAL_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      className={cn(
        'grid w-full items-center gap-7 border-y border-white/10 py-6 lg:grid-cols-[0.9fr_1.65fr_auto] lg:gap-10',
        className,
      )}
    >
      <div>
        <p className="flex items-center gap-2 text-sm font-medium text-blue-400">
          <span className="size-1.5 bg-blue-400" aria-hidden="true" />
          Free trial
        </p>
        <div className="mt-2 flex items-end gap-3">
          <p className="text-4xl font-semibold tabular-nums">$0</p>
          <p className="text-muted-foreground pb-1 text-sm">for new users</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
        {[
          ['Duration', '7 days'],
          ['Compute', '4 vCPU'],
          ['Memory', '4GB RAM'],
          ['Storage', '5GB'],
          ['Bandwidth', '500MB'],
          ['AI credits', '100'],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-muted-foreground text-xs">{label}</dt>
            <dd className="mt-1 text-sm font-semibold tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col items-start gap-2 lg:items-end">
        <Button
          variant="landing-primary"
          className="h-10 rounded-md px-6 transition duration-200 active:translate-y-px motion-reduce:transition-none"
          {...getRybbitCtaProps({
            id: 'pricing_free_trial_start_deploying',
            location: 'pricing_free_trial_card',
            destination: 'costcenter_topup',
          })}
          onClick={handleStartDeploying}
        >
          <span>Start free</span>
          <ArrowRight className="ml-2 size-4" />
        </Button>
        <p className="text-muted-foreground text-xs">No credit card required</p>
      </div>
    </aside>
  );
}
