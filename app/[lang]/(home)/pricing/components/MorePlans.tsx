'use client';

import { ArrowUpRight, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { useGTM } from '@/hooks/use-gtm';
import { cn } from '@/lib/utils';
import { morePlans, type PricingPlan } from '../config/plans';
import { getRybbitCtaProps, toRybbitCtaId } from '@/lib/analytics/rybbit-cta';

interface MorePlansProps {
  className?: string;
}

export function MorePlans({ className }: MorePlansProps) {
  const handleAuthRedirect = useAuthRedirect();
  const { trackButton, trackCustom } = useGTM();

  const handlePlanClick = (plan: PricingPlan) => {
    const url = plan.action.type === 'direct' ? plan.action.url : '';
    trackButton(plan.buttonText, `pricing-scale-${plan.planId}`, 'url', url, {
      plan_id: plan.planId,
      plan_name: plan.name,
      plan_price: plan.monthlyPrice,
    });
    trackCustom('pricing_plan_selected', {
      plan_id: plan.planId,
      plan_price: plan.monthlyPrice,
      location: 'scale_plan_card',
    });

    if (plan.action.type === 'auth') {
      handleAuthRedirect(plan.action.params);
      return;
    }

    window.open(plan.action.url, '_blank', 'noopener,noreferrer');
  };

  const handleCompare = (plan: PricingPlan) => {
    trackCustom('pricing_compare_plan_selected', {
      plan_id: plan.planId,
      location: 'scale_plan_card',
    });
    window.dispatchEvent(
      new CustomEvent('pricing:compare-plan', {
        detail: { planId: plan.planId },
      }),
    );
    document
      .getElementById('railway-cost')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className={cn('container py-24', className)}>
      <div className="mb-10 max-w-2xl">
        <p className="text-sm font-medium text-blue-400">Scale</p>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
          More capacity for growing workloads
        </h2>
        <p className="text-muted-foreground mt-4">
          Move into larger resource packages or define a custom configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {morePlans.map((plan) => (
          <article
            key={plan.planId}
            className="flex min-h-72 flex-col rounded-lg border bg-zinc-900 p-6"
          >
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="text-muted-foreground mt-3 min-h-16 text-sm">
              {plan.description}
            </p>
            <div className="mt-6 flex items-end gap-1">
              <span className="text-3xl font-semibold">{plan.price}</span>
              {plan.monthlyPrice && (
                <span className="text-muted-foreground pb-1 text-sm">
                  / month
                </span>
              )}
            </div>
            <div className="mt-auto flex flex-col gap-2 pt-6">
              <Button
                variant="secondary"
                className="h-10 rounded-full"
                {...getRybbitCtaProps({
                  id: `pricing_${toRybbitCtaId(plan.name)}_get_started`,
                  location: 'pricing_more_plans',
                  destination:
                    plan.action.type === 'auth' ? 'signup_modal' : 'checkout',
                })}
                onClick={() => handlePlanClick(plan)}
              >
                {plan.buttonText}
                <ArrowUpRight className="ml-2 size-4" />
              </Button>
              {plan.planId === 'pro' && (
                <Button
                  variant="ghost"
                  className="h-10 rounded-full"
                  onClick={() => handleCompare(plan)}
                >
                  <GitCompare className="mr-2 size-4" />
                  See Railway estimate
                </Button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
