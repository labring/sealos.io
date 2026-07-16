import { CircleCheckBigIcon, StarIcon } from 'lucide-react';

import { GradientText } from '@/new-components/GradientText';

import LogoLoop, { type LogoItem } from './logo-loop';

const guarantees = [
  '7 days free trial',
  'No credit card required to get started',
  'Cancel anytime',
];

const adopters: LogoItem[] = [
  {
    src: '/images/logos/github.svg',
    alt: 'GitHub',
    title: 'GitHub',
  },
  {
    src: '/images/logos/fastgpt.svg',
    alt: 'FastGPT',
    title: 'FastGPT',
  },
  {
    src: '/images/logos/jetbrains.svg',
    alt: 'JetBrains',
    title: 'JetBrains',
  },
  {
    src: '/images/logos/teable.svg',
    alt: 'Teable',
    title: 'Teable',
  },
];

export function HeroGuarantees() {
  return (
    <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 pt-0 text-zinc-200 sm:gap-10">
      {guarantees.map((label) => (
        <div key={label} className="flex items-center gap-2">
          <CircleCheckBigIcon
            size={20}
            className="size-5 shrink-0 text-blue-500"
            aria-hidden="true"
          />
          <span className="text-base leading-none whitespace-nowrap">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function HeroAdoptionStrip() {
  return (
    <div className="w-full space-y-9">
      <p className="text-center text-base text-zinc-500">
        Trusted by{' '}
        <GradientText className="to-blue-500 text-2xl leading-8 font-semibold">
          200,000+
        </GradientText>{' '}
        developers and teams shipping on Sealos
      </p>
      <div
        className="h-11 overflow-hidden rounded-xl"
        style={{ contain: 'paint' }}
      >
        <LogoLoop
          logos={adopters}
          speed={90}
          direction="left"
          logoHeight={32}
          gap={72}
          hoverSpeed={0}
          fadeOut
          fadeOutColor="#0a0a0a"
          scaleOnHover
          ariaLabel="Trusted partner logos"
        />
      </div>
    </div>
  );
}

export function HeroRating() {
  return (
    <figure className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
      <div className="flex gap-1.5 text-blue-400" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <StarIcon
            key={index}
            size={16}
            className="text-blue-400"
            fill="currentColor"
            stroke="currentColor"
          />
        ))}
      </div>
      <blockquote className="text-base leading-6 text-zinc-500">
        "Sealos replaced our entire staging infrastructure. Our DevOps ticket
        volume dropped by 80% and we cut our cloud bill in half because we
        stopped over-provisioning."
      </blockquote>
      <figcaption className="text-base text-zinc-500">
        - CTO, FastGPT
      </figcaption>
    </figure>
  );
}
