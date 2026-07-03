import { CircleCheckBigIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';

import { GradientText } from '@/new-components/GradientText';
import styles from './hero-supporting-proof.module.css';

const guarantees = [
  '7 days free trial',
  'No credit card required to get started',
  'Cancel anytime',
];

const adopters = [
  'Sealos',
  'FastGPT',
  'DevBox',
  'App Store',
  'Databases',
  'Templates',
  'Cloud IDE',
  'Object Storage',
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
  const marqueeItems = [...adopters, ...adopters];

  return (
    <div className="w-full space-y-9">
      <p className="text-center text-base text-zinc-500">
        Trusted by{' '}
        <GradientText className="to-blue-500 text-2xl leading-8 font-semibold">
          200,000+
        </GradientText>{' '}
        developers and teams shipping on Sealos
      </p>
      <div className={`${styles.marqueeShell} h-11 overflow-hidden rounded-xl`}>
        <div className={`${styles.marqueeTrack} flex h-full items-center`}>
          {marqueeItems.map((name, index) => (
            <div
              key={`${name}-${index}`}
              className="flex min-w-48 items-center gap-3 px-3 text-base font-medium text-white"
            >
              <Image
                src="/logo.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 rounded-full"
                aria-hidden="true"
              />
              <span className="truncate">{name}</span>
            </div>
          ))}
        </div>
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
        — CTO, FastGPT
      </figcaption>
    </figure>
  );
}
