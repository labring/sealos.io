'use client';

import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useGTM } from '@/hooks/use-gtm';
import { cn } from '@/lib/utils';
import { FeatureItem } from './FeatureItem';
import type { PricingPlan } from '../config/plans';
import { getRybbitCtaProps, toRybbitCtaId } from '@/lib/analytics/rybbit-cta';

interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
}

export function PricingCard({ plan, className }: PricingCardProps) {
  const handleAuthRedirect = useAuthRedirect();
  const { trackButton, trackCustom } = useGTM();
  const {
    planId,
    name,
    description,
    price,
    originalPrice,
    monthlyPrice,
    buttonText,
    buttonVariant = 'secondary',
    features,
    resources,
    isPopular = false,
    action,
  } = plan;

  const handleButtonClick = () => {
    const url = action.type === 'direct' ? action.url : '';
    trackButton(buttonText, `pricing-card-${planId}`, 'url', url, {
      plan_id: planId,
      plan_name: name,
      plan_price: monthlyPrice,
    });
    trackCustom('pricing_plan_selected', {
      plan_id: planId,
      plan_price: monthlyPrice,
      location: 'primary_plan_card',
    });

    if (action.type === 'auth') {
      handleAuthRedirect(action.params);
      return;
    }

    window.open(action.url, '_blank', 'noopener,noreferrer');
  };

  const handleCompare = () => {
    trackCustom('pricing_compare_plan_selected', {
      plan_id: planId,
      location: 'primary_plan_card',
    });
    window.dispatchEvent(
      new CustomEvent('pricing:compare-plan', { detail: { planId } }),
    );
    document
      .getElementById('railway-cost')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article
      className={cn(
        'relative grid h-full grid-rows-[auto_auto_auto_auto_1fr] overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 p-7 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_-36px_rgba(59,130,246,0.45)] motion-reduce:transform-none motion-reduce:transition-none',
        isPopular &&
          'border-blue-400/40 bg-blue-500/[0.06] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-blue-400',
        className,
      )}
    >
      <div className="mb-5 h-4">
        {isPopular ? (
          <p className="flex items-center gap-2 text-xs font-medium text-blue-300">
            <span className="size-1.5 bg-blue-400" aria-hidden="true" />
            Recommended for most projects
          </p>
        ) : (
          <span className="sr-only">Standard plan option</span>
        )}
      </div>

      <div className="min-h-24">
        <h3 className="text-2xl font-semibold">{name}</h3>
        <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-6 text-pretty">
          {description}
        </p>
      </div>

      <div className="mt-7 min-h-20">
        <div className="flex items-end gap-2">
          {originalPrice && (
            <span className="text-muted-foreground text-xl leading-none tabular-nums line-through">
              {originalPrice}
            </span>
          )}
          <span className="text-4xl font-semibold tabular-nums">{price}</span>
          <span className="text-muted-foreground pb-1">/ month</span>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          Monthly resource package
        </p>
      </div>

      <div className="mt-6">
        <Button
          variant={isPopular ? 'landing-primary' : buttonVariant}
          className="h-11 w-full rounded-md transition duration-200 active:translate-y-px motion-reduce:transition-none"
          {...getRybbitCtaProps({
            id: `pricing_${toRybbitCtaId(name)}_get_started`,
            location: 'pricing_plan_card',
            destination: action.type === 'auth' ? 'signup_modal' : 'checkout',
          })}
          onClick={handleButtonClick}
        >
          {buttonText}
        </Button>
        {resources && (
          <button
            type="button"
            className="mt-4 inline-flex items-center text-sm font-medium text-zinc-300 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none motion-reduce:transition-none"
            onClick={handleCompare}
          >
            <GitCompare className="mr-2 size-4 text-blue-400" />
            Compare with Railway
          </button>
        )}
      </div>

      <div className="mt-7 border-t border-white/10 pt-6">
        <p className="mb-4 text-sm font-medium">Included resources</p>
        <div className="flex flex-col gap-3">
          {features.map((feature) => (
            <FeatureItem key={feature} text={feature} />
          ))}
        </div>
      </div>
    </article>
  );
}
