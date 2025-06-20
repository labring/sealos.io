'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import DynamicIcon from '@/components/ui/dynamic-icon';
import { IndustryBenefit } from '@/config/industries';

interface IndividualBenefitsProps {
  benefits: IndustryBenefit[];
  industryName: string;
}

export default function IndividualBenefits({
  benefits,
  industryName,
}: IndividualBenefitsProps) {
  return (
    <AnimateElement type="slideUp">
      <section className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Why Individual {industryName} Professionals Choose Sealos
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Sealos provides a comprehensive cloud platform specifically designed
            to empower individual professionals in the{' '}
            {industryName.toLowerCase()} sector, offering enterprise-grade
            capabilities at individual-friendly pricing.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
          {benefits.map((benefit, index) => (
            <AnimateElement key={index} type="slideUp">
              <div className="flex h-full min-h-[180px] flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-md transition-shadow hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <DynamicIcon
                      name={benefit.iconName}
                      className={`h-8 w-8 ${benefit.iconColor}`}
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-3 text-xl font-semibold text-gray-900">
                      {benefit.title}
                    </h3>
                    <p className="flex-1 leading-relaxed text-gray-600">
                      Perfect for individual {industryName.toLowerCase()}{' '}
                      professionals: {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimateElement>
          ))}
        </div>
      </section>
    </AnimateElement>
  );
}
