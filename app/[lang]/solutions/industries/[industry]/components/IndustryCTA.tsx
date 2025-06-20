'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import { ArrowRight, Star } from 'lucide-react';
import { IndustryConfig } from '@/config/industries';
import { appDomain } from '@/config/site';
import { CustomButton } from '@/components/ui/button-custom';

interface IndustryCTAProps {
  config: IndustryConfig;
}

export default function IndustryCTA({ config }: IndustryCTAProps) {
  return (
    <AnimateElement type="slideUp">
      <section className="mb-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white lg:p-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-3xl font-bold">{config.cta.title}</h2>
          <p className="mb-8 text-xl opacity-90">{config.cta.description}</p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CustomButton
              title={config.hero.ctaText || 'Get Started'}
              href={config.hero.ctaUrl || appDomain}
              className="inline-flex cursor-pointer items-center rounded-lg border border-white/20 px-6 py-3 text-white transition-colors hover:bg-white/10"
              location="cta"
            >
              {config.hero.ctaText || 'Get Started'}{' '}
              <ArrowRight className="ml-2 h-4 w-4" />
            </CustomButton>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm opacity-75">
            <Star className="h-4 w-4" />
            <span>{config.cta.features}</span>
          </div>
        </div>
      </section>
    </AnimateElement>
  );
}
