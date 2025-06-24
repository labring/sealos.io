'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { CustomButton } from '@/components/ui/button-custom';
import { IndustryProductRef } from '@/config/industries';
import { getAppBySlugSync } from '@/config/apps';

interface IndividualProductsProps {
  products: IndustryProductRef[];
  industryName: string;
}

// Helper function to truncate description
function truncateDescription(text: string, maxLength: number = 120): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + '...';
}

export default function IndividualProducts({
  products,
  industryName,
}: IndividualProductsProps) {
  // Get the actual app data for each product reference
  const appProducts = products
    .map((productRef) => getAppBySlugSync(productRef.slug))
    .filter((app) => app !== undefined);

  if (appProducts.length === 0) {
    return null;
  }

  return (
    <AnimateElement type="slideUp">
      <section className="mb-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            {industryName} Apps & Tools for Individuals
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Discover powerful applications and tools designed specifically for
            individual professionals in {industryName.toLowerCase()} to enhance
            productivity and accelerate your projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {appProducts.map((app, index) => (
            <AnimateElement key={index} type="slideUp">
              <div className="flex h-full min-h-[500px] flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={app.icon}
                    alt={app.name}
                    className="h-10 w-10 rounded-lg"
                  />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {app.name}
                  </h3>
                </div>

                <p className="mb-4 flex-1 leading-relaxed text-gray-600">
                  {truncateDescription(app.description)}
                </p>

                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Key Benefits for Individuals:
                  </h4>
                  <ul className="space-y-1">
                    {app.benefits.slice(0, 4).map((benefit: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Perfect for Individual {industryName} Professionals:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {app.useCases.slice(0, 4).map((useCase: string, idx: number) => (
                      <span
                        key={idx}
                        className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <CustomButton
                    title={`Deploy ${app.name}`}
                    href={app.deployUrl || '#'}
                    location={`individual-${industryName.toLowerCase()}-products`}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
                    additionalData={{
                      appName: app.name,
                      industry: industryName,
                      type: 'individual',
                      source: 'individual-products-section',
                    }}
                  >
                    Deploy Now <ArrowRight className="ml-2 h-4 w-4" />
                  </CustomButton>
                </div>
              </div>
            </AnimateElement>
          ))}
        </div>
      </section>
    </AnimateElement>
  );
}
