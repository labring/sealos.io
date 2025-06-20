'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import { ArrowRight, Star, Gift } from 'lucide-react';
import { IndustryPromoBanner } from '@/config/industries';
import { CustomButton } from '@/components/ui/button-custom';

interface PromoBannerProps {
  banner: IndustryPromoBanner;
}

export default function PromoBanner({ banner }: PromoBannerProps) {
  return (
    <AnimateElement type="slideUp">
      <section className="mb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Gift className="h-8 w-8" />
                </div>
              </div>

              {/* Title */}
              <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
                {banner.title}
              </h2>

              {/* Subtitle */}
              <p className="mb-8 text-lg opacity-90 lg:text-xl">
                {banner.subtitle}
              </p>

              {/* CTA Button */}
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <CustomButton
                  title={banner.cta}
                  href={banner.link}
                  location="promo-banner"
                  className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-lg font-semibold text-gray-900 transition-all hover:bg-gray-50 hover:shadow-lg"
                  additionalData={{
                    bannerTitle: banner.title,
                    source: 'individual-promo-banner',
                  }}
                >
                  {banner.cta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </CustomButton>
              </div>

              {/* Additional Info */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm opacity-75">
                <Star className="h-4 w-4" />
                <span>Limited time offer • No commitment required</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimateElement>
  );
}
