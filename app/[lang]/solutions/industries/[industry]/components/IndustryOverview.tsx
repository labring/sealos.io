'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import { HovermeButton } from '@/components/ui/button-hoverme';
import Link from 'next/link';
import AnimatedVisual from './AnimatedVisual';
import IndividualBanner from './IndividualBanner';

interface IndustryOverviewProps {
  industryName: string;
  industrySlug: string;
  title: string;
  overviewParagraphs: string[];
  ctaText?: string;
  ctaUrl?: string;
  description?: string;
  introText?: string;
  centralIcon?: React.ReactNode;
}

export default function IndustryOverview({
  industryName,
  industrySlug,
  title,
  overviewParagraphs,
  ctaText,
  ctaUrl,
  description,
  introText,
  centralIcon,
}: IndustryOverviewProps) {
  return (
    <AnimateElement type="slideUp">
      <section>
        <div className="mx-auto max-w-7xl">
          {/* Full-width header section */}
          <div className="mb-12 space-y-6">
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
              <span className="mr-2 h-2 w-2 rounded-full bg-blue-400"></span>
              Industry Focus: {industryName}
            </div>

            {/* Individual Solutions Banner */}
            <IndividualBanner
              industrySlug={industrySlug}
              industryName={industryName}
            />

            <h1 className="text-4xl leading-tight font-bold text-gray-900 lg:text-5xl">
              {title}
            </h1>

            <p className="rounded-r-lg border-l-4 border-blue-200 bg-blue-50 py-4 pl-6 text-xl leading-relaxed font-medium text-blue-600">
              {introText}
            </p>
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Content Section - Left Side */}
            <div className="space-y-8">
              <div className="space-y-6">
                {overviewParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-lg leading-relaxed text-gray-600"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* CTA Buttons */}
              {(ctaText || ctaUrl) && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 py-6">
                    <HovermeButton
                      text={ctaText || 'Get Started'}
                      href={ctaUrl}
                      location="industry-overview"
                    />
                    <Link
                      href="/contact"
                      className="inline-flex items-center rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
                    >
                      Contact Us
                    </Link>
                  </div>
                  {description && (
                    <p className="text-sm text-gray-500 italic">
                      {description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Visual Section - Right Side */}
            <div className="relative space-y-8 lg:pl-8">
              <AnimatedVisual centralIcon={centralIcon} />

              {/* Key Highlights */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                    <svg
                      className="h-5 w-5 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Rapid Deployment
                    </h4>
                    <p className="text-sm text-gray-600">Deploy in minutes</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <svg
                      className="h-5 w-5 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Enterprise Performance
                    </h4>
                    <p className="text-sm text-gray-600">Optimized for scale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimateElement>
  );
}
