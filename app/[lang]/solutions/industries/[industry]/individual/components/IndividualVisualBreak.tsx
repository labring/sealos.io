'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import { IndustryVisualBreak as IndustryVisualBreakConfig } from '@/config/industries';
import { ArrowRight } from 'lucide-react';

interface IndividualVisualBreakProps {
  config: IndustryVisualBreakConfig;
  industryName: string;
}

export default function IndividualVisualBreak({
  config,
  industryName,
}: IndividualVisualBreakProps) {
  return (
    <AnimateElement type="fadeIn">
      <section className="mb-20 py-16">
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 opacity-50"></div>

          {/* Content */}
          <div className="relative px-8 py-12">
            <div className="mb-12 text-center">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Empowering Individual {industryName} Professionals with Modern
                Cloud Technology
              </h3>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Experience the power of cloud-native infrastructure designed
                specifically for individual professionals in{' '}
                {industryName.toLowerCase()}, without the complexity of
                enterprise solutions
              </p>
            </div>

            {/* Icon Grid */}
            <div className="mb-8 grid grid-cols-2 gap-8 md:grid-cols-4">
              {config.icons.map((item, index) => (
                <AnimateElement key={index} type="slideUp" delay={index * 0.1}>
                  <div className="group flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
                      <div className={`h-8 w-8 ${item.color}`}>{item.icon}</div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.label}
                    </span>
                  </div>
                </AnimateElement>
              ))}
            </div>

            {/* Flow Arrow */}
            <div className="flex justify-center">
              <AnimateElement type="slideUp" delay={0.5}>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="h-px w-8 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                  <ArrowRight className="h-5 w-5" />
                  <div className="h-px w-8 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                </div>
              </AnimateElement>
            </div>

            {/* Bottom Text */}
            <div className="mt-8 text-center">
              <p className="mx-auto max-w-xl text-sm text-gray-500">
                From development to deployment, Sealos provides the complete
                infrastructure stack tailored for individual{' '}
                {industryName.toLowerCase()} professionals
              </p>
            </div>
          </div>
        </div>
      </section>
    </AnimateElement>
  );
}
