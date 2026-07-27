import {
  Boxes,
  Database,
  Globe2,
  HardDrive,
  LayoutGrid,
  Server,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const includedCapabilities = [
  { icon: Server, label: 'Application deployment' },
  { icon: Database, label: 'Managed databases' },
  { icon: HardDrive, label: 'S3-compatible storage' },
  { icon: Globe2, label: 'Custom domains and SSL' },
  { icon: LayoutGrid, label: 'App Store templates' },
  { icon: Boxes, label: 'Kubernetes-native infrastructure' },
];

interface FeaturesSectionProps {
  className?: string;
}

export function FeaturesSection({ className }: FeaturesSectionProps) {
  return (
    <section className={cn('border-y border-white/10 py-14', className)}>
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-sm">
            <p className="text-sm font-medium text-blue-400">
              Included with every paid plan
            </p>
            <h2 className="mt-3 text-2xl font-semibold">
              One platform for running your apps
            </h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Availability follows the resource limits shown on each plan.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:max-w-3xl lg:grid-cols-3">
            {includedCapabilities.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <Icon className="size-5 shrink-0 text-blue-400" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
