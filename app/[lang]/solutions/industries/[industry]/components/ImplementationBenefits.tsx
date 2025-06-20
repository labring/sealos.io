'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { IndustryBenefit } from '@/config/industries';

interface ImplementationBenefitsProps {
  benefits: IndustryBenefit[];
}

export default function ImplementationBenefits({
  benefits,
}: ImplementationBenefitsProps) {
  return (
    <AnimateElement type="slideUp">
      <section className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Implementation Made Simple
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Get started quickly with our industry-focused platform designed for
            ease of use and rapid deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <AnimateElement key={index} type="slideUp">
              <div className="flex h-full min-h-[200px] flex-col rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mb-4 flex justify-center">
                  <DynamicIcon
                    name={benefit.iconName}
                    className={`h-6 w-6 ${benefit.iconColor}`}
                  />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="flex-1 text-sm text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </AnimateElement>
          ))}
        </div>
      </section>
    </AnimateElement>
  );
}
