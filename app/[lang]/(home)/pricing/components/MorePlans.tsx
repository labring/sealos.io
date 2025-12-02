'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';
import { morePlans, type PricingPlan } from '../config/plans';

interface MorePlansProps {
  className?: string;
}

export function MorePlans({ className }: MorePlansProps) {
  const openAuthForm = useOpenAuthForm();
  const [isMorePlansEnabled, setIsMorePlansEnabled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(morePlans[0]);

  const handleGetStarted = () => {
    if (selectedPlan.action.type === 'auth') {
      openAuthForm(selectedPlan.action.params);
    } else {
      window.open(selectedPlan.action.url, '_blank');
    }
  };

  const displayPlan = selectedPlan;

  const handlePlanSelect = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center gap-4 lg:flex-row',
        className,
      )}
    >
      <div className="flex w-full flex-1 flex-col items-start gap-4 overflow-hidden rounded-2xl border bg-zinc-900 px-4 py-3 lg:flex-row lg:items-center">
        <label className="flex w-full shrink-0 items-center justify-start gap-2 lg:w-auto">
          <button
            onClick={() => setIsMorePlansEnabled(!isMorePlansEnabled)}
            className={cn(
              'border-primary bg-background pointer-events-none flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
              isMorePlansEnabled && 'bg-primary',
            )}
          >
            {isMorePlansEnabled && (
              <Check className="text-primary-foreground size-3" />
            )}
          </button>
          <p className="text-primary text-base font-normal whitespace-nowrap">
            More Plans
          </p>
        </label>

        <DropdownMenu
          open={isMorePlansEnabled ? isDropdownOpen : false}
          onOpenChange={(open) => {
            if (isMorePlansEnabled) {
              setIsDropdownOpen(open);
            }
          }}
          modal={false}
        >
          <DropdownMenuTrigger asChild>
            <div
              className={cn(
                'flex w-full flex-1 items-center justify-between overflow-hidden rounded-xl bg-zinc-950 px-3 py-2',
                isMorePlansEnabled
                  ? 'cursor-pointer'
                  : 'cursor-not-allowed opacity-50',
              )}
            >
              <div className="flex flex-1 flex-col gap-3 lg:flex-row lg:items-center">
                <p className="text-primary shrink-0 text-base font-semibold whitespace-nowrap">
                  {displayPlan.name}
                </p>
                {displayPlan.description && (
                  <>
                    <div className="hidden h-4 w-px shrink-0 border-l lg:block" />
                    <div className="block h-px w-full shrink-0 border-t lg:hidden" />
                    <p className="text-muted-foreground w-full flex-1 overflow-hidden text-base font-normal text-ellipsis">
                      {displayPlan.description}
                    </p>
                  </>
                )}
                <div className="hidden h-4 w-px shrink-0 border-l lg:block" />
                <div className="block h-px w-full shrink-0 border-t lg:hidden" />
                <p className="text-muted-foreground shrink-0 text-base font-semibold whitespace-nowrap">
                  {displayPlan.price}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  'text-muted-foreground ml-2 size-4 shrink-0 transition-transform',
                  isDropdownOpen && 'rotate-180',
                )}
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[var(--radix-dropdown-menu-trigger-width)] rounded-xl border bg-zinc-900 p-0"
            align="start"
          >
            {morePlans.map((plan, index) => (
              <DropdownMenuItem
                key={plan.name}
                onSelect={() => handlePlanSelect(plan)}
                className={cn(
                  'flex cursor-pointer flex-col items-start gap-3 px-3 py-2.5 focus:bg-white/5 lg:flex-row lg:items-center',
                  index > 0 && 'border-t border-white/5',
                )}
              >
                <p className="text-primary shrink-0 text-base font-semibold whitespace-nowrap">
                  {plan.name}
                </p>
                {plan.description && (
                  <>
                    <div className="hidden h-4 w-px shrink-0 border-l lg:block" />
                    <p className="text-muted-foreground flex-1 overflow-hidden text-base font-normal text-ellipsis">
                      {plan.description}
                    </p>
                  </>
                )}
                <div className="hidden h-4 w-px shrink-0 border-l lg:block" />
                <p className="text-muted-foreground shrink-0 text-base font-semibold whitespace-nowrap">
                  {plan.price}
                </p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isMorePlansEnabled && (
        <Button
          variant="secondary"
          className="h-11 shrink-0 rounded-full px-8"
          onClick={handleGetStarted}
        >
          Get Started
        </Button>
      )}
    </div>
  );
}
