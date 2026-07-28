import { cn } from '@/lib/utils';

const includedCapabilities = [
  'Application deployment',
  'Managed databases',
  'S3-compatible storage',
  'Custom domains and SSL',
  'App Store templates',
  'Kubernetes-native infrastructure',
];

interface FeaturesSectionProps {
  className?: string;
}

export function FeaturesSection({ className }: FeaturesSectionProps) {
  return (
    <section className={cn('border-y border-white/10 py-16', className)}>
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-16">
          <div className="max-w-md">
            <p className="flex items-center gap-2 text-sm font-medium text-blue-400">
              <span className="size-1.5 bg-blue-400" aria-hidden="true" />
              Available on every paid plan
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-balance">
              Deploy apps, databases, and storage from one platform
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              These services use the resources included in your plan.
            </p>
          </div>

          <ul className="grid grid-cols-1 border-t border-white/10 sm:grid-cols-2">
            {includedCapabilities.map((label, index) => (
              <li
                key={label}
                className={cn(
                  'flex items-center gap-3 border-b border-white/10 py-4 text-sm font-medium',
                  index % 2 === 0 ? 'sm:pr-6' : 'sm:border-l sm:pl-6',
                )}
              >
                <span className="size-1.5 shrink-0 bg-blue-400" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
