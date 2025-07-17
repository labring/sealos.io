'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import { Icon } from '@/components/ui/icon-mapper';
import { IndustryBenefit } from '@/config/industries';

interface IndividualImplementationProps {
  benefits: IndustryBenefit[];
  industryName: string;
}

export default function IndividualImplementation({
  benefits,
  industryName,
}: IndividualImplementationProps) {
  return (
    <AnimateElement type="slideUp">
      <section className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Implementation Made Simple for {industryName} Professionals
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Get started quickly with our platform designed specifically for
            individual
            {industryName.toLowerCase()} professionals - no complex setup or
            enterprise overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <AnimateElement key={index} type="slideUp">
              <div className="flex h-full min-h-[200px] flex-col rounded-xl border border-gray-100 bg-white p-6 text-center shadow-sm">
                <div className="mb-4 flex justify-center">
                  <Icon name={benefit.iconName} className={`h-6 w-6 ${benefit.iconColor}`} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {benefit.title}
                </h3>
                <p className="flex-1 text-sm text-gray-600">
                  For individual {industryName.toLowerCase()} professionals:{' '}
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
