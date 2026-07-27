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
        'relative flex h-full flex-col rounded-lg border bg-zinc-900 p-7',
        isPopular && 'border-blue-400/70 ring-1 ring-blue-400/30',
        className,
      )}
    >
      {isPopular && (
        <p className="absolute top-0 right-5 -translate-y-1/2 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
          MOST POPULAR
        </p>
      )}

      <div className="min-h-24">
        <h3 className="text-2xl font-semibold">{name}</h3>
        <p className="text-muted-foreground mt-3 text-sm">{description}</p>
      </div>

      <div className="mt-6">
        <div className="flex items-end gap-2">
          {originalPrice && (
            <span className="text-muted-foreground text-xl line-through">
              {originalPrice}
            </span>
          )}
          <span className="text-4xl font-bold">{price}</span>
          <span className="text-muted-foreground pb-1">/ month</span>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          Monthly resource package
        </p>
      </div>

      <Button
        variant={isPopular ? 'landing-primary' : buttonVariant}
        className="mt-6 h-11 rounded-full"
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
        <Button
          variant="ghost"
          className="mt-2 h-10 rounded-full border border-white/10"
          onClick={handleCompare}
        >
          <GitCompare className="mr-2 size-4" />
          See Railway estimate
        </Button>
      )}

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
