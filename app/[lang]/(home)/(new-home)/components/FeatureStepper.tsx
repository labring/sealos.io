import { Check } from 'lucide-react';

interface Feature {
  label: string;
}

interface FeatureStepperProps {
  features?: Feature[];
}

const defaultFeatures: Feature[] = [
  { label: '7 days free trial' },
  { label: 'No credit card required to get started' },
  { label: 'Cancel anytime' },
];

export function FeatureStepper({
  features = defaultFeatures,
}: FeatureStepperProps) {
  return (
    <div className="flex justify-center gap-8 lg:gap-20">
      {/* Line */}
      <div className="absolute top-[2.625rem] w-full max-w-4xl">
        <div className="mx-auto h-px w-3/4 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>

      {features.map((feature, index) => (
        <div key={index} className="flex max-w-4xl flex-col items-center gap-2">
          <div
            className="flex size-5 items-center justify-center rounded-full bg-slate-200 text-zinc-950 outline-1 outline-offset-3 outline-zinc-500"
            aria-hidden="true"
          >
            <Check size={16} />
          </div>
          <span
            className="text-center text-sm text-zinc-200 sm:text-base 2xl:text-lg"
            aria-label={'Sealos feature: ' + feature.label}
          >
            {feature.label}
          </span>
        </div>
      ))}
    </div>
  );
}
