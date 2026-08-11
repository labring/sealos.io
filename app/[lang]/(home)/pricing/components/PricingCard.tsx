'use client';

import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useGTM } from '@/hooks/use-gtm';
import { cn } from '@/lib/utils';
import { FeatureItem } from './FeatureItem';
import { appendAttributionToUrl } from '@/lib/attribution-url';
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
    priceLabel,
    originalPriceLabel,
    offerEligibility,
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

    const decoratedActionUrl = appendAttributionToUrl(action.url);
    window.open(decoratedActionUrl, '_blank', 'noopener,noreferrer');
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

  const cardContent = (
    <>
      <div className="min-h-24">
        <h3 className="text-2xl font-semibold">{name}</h3>
        <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-6 text-pretty">
          {description}
        </p>
      </div>

      <div className="mt-7 min-h-24">
        <div className="flex items-end gap-3">
          {originalPrice && (
            <div className="shrink-0">
              <p className="text-muted-foreground mb-2 text-[11px] font-medium uppercase">
                {originalPriceLabel ?? 'Regular price'}
              </p>
              <p className="text-muted-foreground text-3xl leading-none font-semibold tabular-nums line-through opacity-70">
                {originalPrice}
              </p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground mb-2 text-[11px] font-medium uppercase">
              {priceLabel ?? 'Monthly plan price'}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-4xl leading-none font-semibold tabular-nums">
                {price}
              </span>
              <span className="text-muted-foreground pb-0.5">/ month</span>
            </div>
          </div>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {offerEligibility
            ? `${offerEligibility} · Eligibility confirmed in Cost Center`
            : 'Fixed monthly resource package'}
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
    </>
  );

  return (
    <div
      className={cn(
        'relative flex h-full flex-col',
        !isPopular && 'xl:py-7',
        className,
      )}
    >
      {isPopular ? (
        <article className="flex h-full flex-col rounded-2xl bg-gradient-to-r from-white via-blue-300 to-blue-600 p-1 transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(59,130,246,0.65)] motion-reduce:transform-none motion-reduce:transition-none">
          <div className="flex h-10 shrink-0 items-center justify-center px-4">
            <p className="text-center text-sm font-bold text-zinc-950">
              RECOMMENDED FOR MOST PROJECTS
            </p>
          </div>
          <div className="grid h-full flex-1 grid-rows-[auto_auto_auto_1fr] rounded-xl bg-zinc-900 p-7">
            {cardContent}
          </div>
        </article>
      ) : (
        <article className="relative grid h-full flex-1 grid-rows-[auto_auto_auto_1fr] overflow-hidden rounded-lg border border-white/10 bg-zinc-900/70 p-7 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_-36px_rgba(59,130,246,0.45)] motion-reduce:transform-none motion-reduce:transition-none">
          {cardContent}
        </article>
      )}
    </div>
  );
}
