'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Sparkles, Zap, Crown, Rocket } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
// Removed PricingSwitch: pricing is monthly-only now
import { TimelineContent } from './timeline-animation';
import NumberFlow from '@number-flow/react';
import { MorePlansSelector } from './more-plans-selector';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  oldMonthlyPrice?: number;
  oldYearlyPrice?: number;
  highlighted?: boolean;
  badge?: string;
  icon: React.ReactNode;
  features: string[];
  limitations?: string[];
  color?: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description:
      'For beginners deploying existing images. Not for development work.',
    oldMonthlyPrice: 34,
    oldYearlyPrice: 34 * 12,
    monthlyPrice: 7,
    yearlyPrice: Math.floor(7 * 12 * 0.8),
    icon: <Zap className="h-6 w-6" />,
    features: ['2 vCPU', '2Gi RAM', '1Gi Disk', '10 GB Traffic'],
    color: 'emerald',
  },
  {
    id: 'hobby',
    name: 'Hobby',
    description:
      'For hobbyists building side projects. Not for production use.',
    oldMonthlyPrice: 70,
    oldYearlyPrice: 70 * 12,
    monthlyPrice: 25,
    yearlyPrice: Math.floor(25 * 12 * 0.8),
    highlighted: true,
    badge: 'Most Popular',
    icon: <Sparkles className="h-6 w-6" />,
    features: ['4 vCPU', '4Gi RAM', '10Gi Disk', '5 GB Traffic'],
    color: 'orange',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and teams shipping production apps.',
    monthlyPrice: 512,
    yearlyPrice: Math.floor(512 * 12 * 0.8),
    icon: <Crown className="h-6 w-6" />,
    features: ['16 vCPU', '32Gi RAM', '200Gi Disk', '1 TB Traffic'],
    color: 'orange',
  },
  {
    id: 'team',
    name: 'Team',
    description:
      'For large teams with compliance needs. Built for collaboration.',
    monthlyPrice: 2030,
    yearlyPrice: Math.floor(2030 * 12 * 0.8),
    icon: <Rocket className="h-6 w-6" />,
    features: ['64 vCPU', '128Gi RAM', '500Gi Disk', '3 TB Traffic'],
    color: 'green',
  },
];

export function SubscriptionPricing() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isMorePlansSelected, setIsMorePlansSelected] = useState(false);

  useEffect(() => {
    // Prevent flicker - ensure animations only after component fully loads
    setIsLoaded(true);
  }, []);

  return (
    <div className="w-full">
      {/* Pricing Switch removed: monthly-only */}

      {/* Pricing Cards */}
      <LayoutGroup>
        <div
          className={cn(
            'mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4',
            !isLoaded && 'opacity-0',
          )}
        >
          <AnimatePresence mode="wait">
            {pricingTiers.map((tier, index) => (
              <TimelineContent
                key={tier.id}
                delay={index * 0.1}
                variant="fadeUp"
              >
                <motion.div
                  layout
                  layoutId={tier.id}
                  whileHover={!isMorePlansSelected ? { scale: 1.02 } : {}}
                  whileTap={!isMorePlansSelected ? { scale: 0.98 } : {}}
                  className={cn(
                    'relative flex h-full flex-col rounded-2xl p-6 transition-all duration-300',
                    'backdrop-blur-sm',
                    isMorePlansSelected
                      ? 'pointer-events-none border border-gray-200 bg-gray-50 opacity-50 grayscale'
                      : tier.highlighted
                        ? 'border-2 border-orange-400/60 bg-gradient-to-br from-orange-50/95 via-amber-50/90 to-yellow-50/80 shadow-2xl shadow-orange-300/40'
                        : 'border border-stone-200/60 bg-gradient-to-b from-white/95 to-stone-50/50 hover:border-emerald-300/50 hover:shadow-xl hover:shadow-emerald-100/30',
                    'group',
                  )}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 transform"
                    >
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="inline-block rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-1 text-xs leading-none font-semibold whitespace-nowrap text-white shadow-lg shadow-orange-300/50"
                      >
                        {tier.badge}
                      </motion.span>
                    </motion.div>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <div className="mb-4 flex items-center gap-3">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          'rounded-xl p-2.5',
                          tier.highlighted
                            ? 'bg-gradient-to-br from-orange-100 to-amber-100 text-orange-600'
                            : 'bg-gradient-to-br from-stone-50 to-stone-100 text-stone-600 transition-colors group-hover:from-emerald-50 group-hover:to-teal-50 group-hover:text-emerald-600',
                        )}
                      >
                        {tier.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {tier.name}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {tier.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mt-auto mb-6">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      {/* a trick to prevent inconsistent line wrapping under xl size */}
                      <div className="flex w-auto flex-nowrap items-baseline gap-3 xl:w-full 2xl:w-auto">
                        {tier.oldMonthlyPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            ${tier.oldMonthlyPrice}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-gray-900">
                          $
                          <NumberFlow
                            value={tier.monthlyPrice}
                            format={{
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }}
                            animated
                            transformTiming={{
                              duration: 400,
                              easing: 'ease-out',
                            }}
                          />
                        </span>
                      </div>

                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="mb-8 space-y-3">
                    {tier.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className={cn(
                            'mt-0.5 h-5 w-5 flex-shrink-0 rounded-full p-0.5',
                            tier.highlighted
                              ? 'bg-orange-100 text-orange-500'
                              : 'bg-emerald-100 text-emerald-500',
                          )}
                        >
                          <Check className="h-full w-full" />
                        </motion.div>
                        <span className="text-sm leading-relaxed text-gray-700">
                          {feature}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Limitations */}
                  {tier.limitations && (
                    <ul className="mb-8 space-y-2 border-t border-gray-200/50 pt-4 pb-8">
                      {tier.limitations.map((limitation, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                          className="flex items-start gap-3 text-sm text-gray-500"
                        >
                          <span className="text-gray-400">•</span>
                          {limitation}
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {/* CTA Button */}
                  <motion.a
                    href={`https://usw.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3D${tier.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                      'group relative block overflow-hidden text-center',
                      tier.highlighted
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-300/50 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-lg',
                    )}
                  >
                    <span className="relative z-10">
                      {tier.highlighted ? 'Start Free Trial' : 'Get Started'}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 transition-opacity group-hover:opacity-20"
                      initial={false}
                    />
                  </motion.a>
                </motion.div>
              </TimelineContent>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      {/* More Plans Selector */}
      <div className="mt-8">
        <MorePlansSelector onCheckboxChange={setIsMorePlansSelected} />
      </div>
    </div>
  );
}
