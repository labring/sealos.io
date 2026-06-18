import { CheckIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';

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
    <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 pt-0 text-zinc-200 sm:flex-row sm:justify-center sm:gap-10">
      <div
        className="absolute top-3 right-0 left-0 hidden h-px bg-gradient-to-r from-white/0 via-white/40 to-white/0 sm:block"
        aria-hidden="true"
      />
      {guarantees.map((label) => (
        <div
          key={label}
          className="relative z-10 flex flex-col items-center gap-2"
        >
          <span className="flex size-6 items-center justify-center rounded-full border border-zinc-950 bg-white text-zinc-950 ring-1 ring-white/40 ring-offset-2 ring-offset-black">
            <CheckIcon size={16} aria-hidden="true" />
          </span>
          <span className="text-center text-base leading-none">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function HeroAdoptionStrip() {
  const marqueeItems = [...adopters, ...adopters];

  return (
    <div className="space-y-9">
      <p className="text-center text-base text-zinc-500">
        Trusted by{' '}
        <span className="bg-gradient-to-r from-white to-blue-500 bg-clip-text text-2xl leading-8 font-semibold text-transparent">
          200,000+
        </span>{' '}
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
