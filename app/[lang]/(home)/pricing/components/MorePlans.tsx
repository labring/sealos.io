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

  const formatCapacity = (plan: PricingPlan) => {
    if (!plan.resources) return plan.description;

    const traffic =
      plan.resources.traffic >= 1000
        ? `${plan.resources.traffic / 1000}TB traffic`
        : `${plan.resources.traffic}GB traffic`;

    return `${plan.resources.cpu} vCPU · ${plan.resources.ram}Gi RAM · ${plan.resources.disk}Gi disk · ${traffic}`;
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

      <div className="overflow-hidden border-y border-white/10">
        <div className="text-muted-foreground hidden grid-cols-[0.65fr_1.7fr_0.55fr_auto] gap-6 border-b border-white/10 px-5 py-3 text-xs lg:grid">
          <span>Plan</span>
          <span>Capacity</span>
          <span>Price</span>
          <span className="min-w-40 text-right">Action</span>
        </div>
        {morePlans.map((plan) => (
          <article
            key={plan.planId}
            className="grid gap-5 border-b border-white/10 px-1 py-7 transition-colors last:border-b-0 hover:bg-white/[0.025] sm:px-5 lg:grid-cols-[0.65fr_1.7fr_0.55fr_auto] lg:items-center lg:gap-6"
          >
            <div>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="text-muted-foreground mt-1 text-xs lg:hidden">
                Plan
              </p>
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm leading-6 text-pretty">
              {formatCapacity(plan)}
            </p>
            <div className="flex items-end gap-1">
              <span className="text-xl font-semibold tabular-nums">
                {plan.price}
              </span>
              {plan.monthlyPrice && (
                <span className="text-muted-foreground pb-1 text-sm">
                  / month
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 lg:min-w-40 lg:justify-end">
              {plan.planId === 'pro' && (
                <button
                  type="button"
                  className="inline-flex items-center text-sm font-medium text-zinc-300 transition-colors hover:text-white focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none"
                  onClick={() => handleCompare(plan)}
                >
                  <GitCompare className="mr-2 size-4 text-blue-400" />
                  Estimate
                </button>
              )}
              <Button
                variant="secondary"
                className="h-9 px-4 transition duration-200 active:translate-y-px motion-reduce:transition-none"
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
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
