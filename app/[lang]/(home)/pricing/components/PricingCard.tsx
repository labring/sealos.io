import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FeatureItem } from './FeatureItem';

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  buttonText: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  features: string[];
  isPopular?: boolean;
}

interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
}

export function PricingCard({ plan, className }: PricingCardProps) {
  const {
    name,
    description,
    price,
    originalPrice,
    buttonText,
    buttonVariant = 'secondary',
    features,
    isPopular = false,
  } = plan;

  const cardContent = (
    <>
      <div className="flex flex-col gap-3">
        <h3 className="text-foreground text-2xl font-semibold">{name}</h3>
        <p className="text-muted-foreground line-clamp-2 text-base whitespace-pre-wrap">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-end gap-1">
          {originalPrice && (
            <p className="text-foreground text-4xl font-bold line-through opacity-50">
              {originalPrice}
            </p>
          )}
          <p className="text-foreground text-4xl font-bold">{price}</p>
          <p className="text-muted-foreground text-lg">/month</p>
        </div>
      </div>

      <Button
        variant={isPopular ? 'landing-primary' : buttonVariant}
        className="h-11 rounded-full"
      >
        {buttonText}
      </Button>

      <div className="flex flex-col gap-3">
        {features.map((feature, index) => (
          <FeatureItem key={index} text={feature} />
        ))}
      </div>
    </>
  );

  return (
    <div className={cn('relative flex flex-col sm:pt-7', className)}>
      {isPopular ? (
        <div className="relative h-[calc(100%+1.75rem+4px)] flex-col rounded-2xl bg-gradient-to-r from-white to-blue-600 p-1 pb-[calc(1.75rem+4px)] sm:-mt-[calc(1.75rem+4px)]">
          <div className="absolute -top-0 right-0 left-0 z-10 flex items-center justify-center rounded-t-2xl px-0 py-1.5">
            <p className="text-primary-foreground text-sm font-bold">
              MOST POPULAR
            </p>
          </div>
          <div className="relative top-7 z-0 flex h-full flex-1 flex-col gap-6 rounded-xl bg-zinc-900 p-7">
            {cardContent}
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col gap-6 rounded-xl border bg-zinc-900 p-7">
          <div className="flex flex-1 flex-col gap-6">{cardContent}</div>
        </div>
      )}
    </div>
  );
}
