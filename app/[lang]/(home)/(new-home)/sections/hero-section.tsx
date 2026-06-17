'use client';

import { RocketIcon } from 'lucide-react';

import { StarBorder } from '@/components/ui/star-border';
import { useGTM } from '@/hooks/use-gtm';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getOpenBrainParam } from '@/lib/utils/brain';

import { HeroDemoCards } from '../components/hero-demo-cards';
import {
  HeroAdoptionStrip,
  HeroGuarantees,
  HeroRating,
} from '../components/hero-supporting-proof';

export function HeroSection() {
  return (
    <section className="px-4 pt-24 pb-20 text-white sm:px-6 lg:px-16 lg:pt-28 lg:pb-24">
      <div className="mx-auto flex max-w-7xl flex-col gap-20">
        <HeroHeadline />

        <div className="space-y-8">
          <HeroDemoCards />
          <HeroGuarantees />
        </div>

        <HeroAdoptionStrip />
        <HeroRating />
      </div>
    </section>
  );
}

function HeroHeadline() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-9 text-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="max-w-4xl bg-linear-to-r from-white to-blue-500 bg-clip-text text-center text-4xl leading-tight font-semibold text-balance text-transparent sm:text-5xl">
          Deploy anything from a repo, an image, or a sentence.
        </h1>
        <p className="max-w-2xl text-base leading-6 text-zinc-500">
          You describe it. Our AI builds, wires, and deploys it. No YAML. No
          CI/CD. Preview your deployment instantly, without a credit card or
          signup wall.
        </p>
      </div>

      <HeroGetStartedButton />
    </div>
  );
}

function HeroGetStartedButton() {
  const { trackButton } = useGTM();
  const handleAuthRedirect = useAuthRedirect();

  return (
    <div className="relative isolate">
      <div
        className="absolute -top-12 -left-32 -z-10 h-36 w-96 rounded-full bg-blue-700/35 blur-3xl"
        aria-hidden="true"
      />
      <StarBorder
        color="#3B82F6"
        contentClassName="h-10 gap-2 border border-blue-500/80 bg-gradient-to-b from-white via-zinc-100 to-zinc-300 px-4 text-sm font-medium text-zinc-900 shadow-lg"
        onClick={() => {
          trackButton('Get Started', 'hero', 'auth-form', '');
          handleAuthRedirect({ openapp: getOpenBrainParam() });
        }}
        speed="5s"
        thickness={2}
        type="button"
      >
        <RocketIcon size={16} aria-hidden="true" />
        <span className="bg-linear-to-r from-blue-600 to-zinc-950 bg-clip-text text-sm text-transparent">
          Get Started
        </span>
      </StarBorder>
    </div>
  );
}
