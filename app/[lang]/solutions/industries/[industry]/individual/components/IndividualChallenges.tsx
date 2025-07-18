'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import { IndustryChallenge } from '@/config/industries';

interface IndividualChallengesProps {
  challenges: IndustryChallenge[];
  industryName: string;
}

export default function IndividualChallenges({
  challenges,
  industryName,
}: IndividualChallengesProps) {
  return (
    <AnimateElement type="slideUp">
      <section className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Challenges for Individual {industryName} Professionals
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            As an individual professional in the {industryName.toLowerCase()}{' '}
            sector, you face unique technology challenges that can limit your
            productivity and growth potential.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge, index) => (
            <AnimateElement key={index} type="slideUp">
              <div className="flex h-full min-h-[200px] flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`h-6 w-6 ${challenge.iconColor}`}>
                      {challenge.icon}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {challenge.title}
                    </h3>
                    <p className="flex-1 leading-relaxed text-gray-600">
                      For individual {industryName.toLowerCase()} professionals:{' '}
                      {challenge.description}
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
