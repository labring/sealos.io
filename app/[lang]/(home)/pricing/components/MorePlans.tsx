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

interface MorePlansProps {
  className?: string;
}

interface PlanOption {
  name: string;
  description: string;
  price: string;
}

const planOptions: PlanOption[] = [
  {
    name: 'Hobby+',
    description: '4 vCPU + 4 GB RAM + 20 GB Disk + 5 GB Traffic',
    price: '$14/month',
  },
  {
    name: 'Enterprise',
    description:
      '256 vCPU + 1024Gi RAM + 1024Gi Disk + 10TB Traffic + 128 Nodeport + 2000 AI Credits',
    price: '$12451/month',
  },
  {
    name: 'Customized',
    description: '',
    price: 'Contact Us',
  },
];

export function MorePlans({ className }: MorePlansProps) {
  const [isMorePlansEnabled, setIsMorePlansEnabled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(planOptions[0]);

  const displayPlan = selectedPlan;

  const handlePlanSelect = (plan: PlanOption) => {
    setSelectedPlan(plan);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className={cn(
        'flex w-full flex-col items-center gap-4 sm:flex-row',
        className,
      )}
    >
      <div className="flex w-full flex-1 flex-col items-start gap-4 overflow-hidden rounded-2xl border bg-zinc-900 px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-center gap-2">
          <button
            onClick={() => setIsMorePlansEnabled(!isMorePlansEnabled)}
            className={cn(
              'border-primary bg-background flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors',
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
        </div>

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
              <div className="flex min-w-0 flex-1 flex-col items-start gap-3 sm:flex-row">
                <p className="text-primary shrink-0 text-base font-semibold whitespace-nowrap">
                  {displayPlan.name}
                </p>
                {displayPlan.description && (
                  <>
                    <div className="hidden h-4 w-px shrink-0 border-l sm:block" />
                    <div className="block h-px w-full shrink-0 border-t sm:hidden" />
                    <p className="text-muted-foreground min-w-0 flex-1 overflow-hidden text-base font-normal text-ellipsis">
                      {displayPlan.description}
                    </p>
                  </>
                )}
                <div className="hidden h-4 w-px shrink-0 border-l sm:block" />
                <div className="block h-px w-full shrink-0 border-t sm:hidden" />
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
            {planOptions.map((plan, index) => (
              <DropdownMenuItem
                key={plan.name}
                onSelect={() => handlePlanSelect(plan)}
                className={cn(
                  'flex cursor-pointer flex-col items-start gap-3 px-3 py-2.5 focus:bg-white/5 sm:flex-row',
                  index > 0 && 'border-t border-white/5',
                )}
              >
                <p className="text-primary shrink-0 text-base font-semibold whitespace-nowrap">
                  {plan.name}
                </p>
                {plan.description && (
                  <>
                    <div className="hidden h-4 w-px shrink-0 border-l sm:block" />
                    <p className="text-muted-foreground min-w-0 flex-1 overflow-hidden text-base font-normal text-ellipsis">
                      {plan.description}
                    </p>
                  </>
                )}
                <div className="hidden h-4 w-px shrink-0 border-l sm:block" />
                <p className="text-muted-foreground shrink-0 text-base font-semibold whitespace-nowrap">
                  {plan.price}
                </p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isMorePlansEnabled && (
        <Button variant="secondary" className="h-11 shrink-0 rounded-full px-8">
          Get Started
        </Button>
      )}
    </div>
  );
}
