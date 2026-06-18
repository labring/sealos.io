'use client';

import { RocketIcon } from 'lucide-react';

import { StarBorder } from '@/components/ui/star-border';
import { useGTM } from '@/hooks/use-gtm';
import { useAuthRedirect } from '@/hooks/use-auth-redirect';
import { getOpenBrainParam } from '@/lib/utils/brain';
import { GradientText } from '@/new-components/GradientText';

import styles from './cta-section.module.css';

export function CTASection() {
  const { trackButton } = useGTM();
  const handleAuthRedirect = useAuthRedirect();

  return (
    <section className="px-4 pt-16 pb-28 text-white sm:px-6 lg:px-16 lg:pt-20 lg:pb-32">
      <div className="mx-auto flex max-w-[1312px] flex-col items-center gap-16 text-center">
        <div className="flex flex-col items-center gap-6">
          <h2 className="max-w-[553px] text-4xl leading-tight font-semibold text-balance sm:text-5xl">
            <GradientText>Stop configuring. Start shipping.</GradientText>
          </h2>
          <p className="max-w-[618px] text-base leading-6 text-zinc-500">
            Free 7-day trial. No credit card. From idea to URL in under a
            minute.
          </p>
        </div>

        <div className={`${styles.breathe} relative`}>
          <div
            className="absolute inset-x-2 -bottom-2 h-8 rounded-full bg-white/20 blur-xl"
            aria-hidden="true"
          />
          <StarBorder
            color="white"
            contentClassName="h-10 gap-2 border border-white bg-gradient-to-b from-white via-zinc-100 to-zinc-300 px-4 text-sm font-medium text-zinc-900 shadow-lg"
            onClick={() => {
              trackButton('Deploy for free', 'home_cta', 'auth-form', '');
              handleAuthRedirect({ openapp: getOpenBrainParam() });
            }}
            speed="5s"
            thickness={1}
            type="button"
          >
            <RocketIcon size={16} aria-hidden="true" />
            <span>Deploy for free</span>
          </StarBorder>
        </div>
      </div>
    </section>
  );
}
