'use client';

import { AnimateElement } from '@/components/ui/animated-wrapper';
import { HovermeButton } from '@/components/ui/button-hoverme';
import Link from 'next/link';
import AnimatedVisual from '../../components/AnimatedVisual';
import PromoBanner from './PromoBanner';
import { IndustryPromoBanner } from '@/config/industries';

interface IndividualOverviewProps {
  industryName: string;
  industrySlug: string;
  title: string;
  overviewParagraphs: string[];
  ctaText?: string;
  ctaUrl?: string;
  description?: string;
  introText?: string;
  centralIcon?: React.ReactNode;
  promoBanner?: IndustryPromoBanner;
}

export default function IndividualOverview({
  industryName,
  industrySlug,
  title,
  overviewParagraphs,
  ctaText,
  ctaUrl,
  description,
  introText,
  centralIcon,
  promoBanner,
}: IndividualOverviewProps) {
  return (
    <AnimateElement type="slideUp">
      <section>
        <div className="mx-auto max-w-7xl">
          {/* Full-width header section */}
          <div className="mb-12 space-y-6">
            <div className="inline-flex items-center rounded-full bg-purple-50 px-4 py-2 text-sm font-medium text-purple-600">
              <span className="mr-2 h-2 w-2 rounded-full bg-purple-400"></span>
              <Link
                href={`/solutions/industries/${industrySlug}`}
                className="transition-colors hover:text-purple-700 hover:underline"
                title={`Back to ${industryName} Industry Solutions`}
              >
                Industry Focus: {industryName}
              </Link>
              <svg
                className="mx-2 h-3 w-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
              <span>Individual Solutions</span>
            </div>

            <h1 className="text-4xl leading-tight font-bold text-gray-900 lg:text-5xl">
              {title}
            </h1>

            <p className="rounded-r-lg border-l-4 border-purple-200 bg-purple-50 py-4 pl-6 text-xl leading-relaxed font-medium text-purple-600">
              {introText}
            </p>
          </div>

          {/* Promo Banner */}
          {promoBanner && (
            <div className="mb-12">
              <PromoBanner banner={promoBanner} />
            </div>
          )}

          <div className="grid items-start gap-12 lg:grid-cols-2">
            {/* Content Section - Left Side */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-lg leading-relaxed text-gray-600">
                  As an individual professional in the{' '}
                  {industryName.toLowerCase()} sector, you need powerful,
                  flexible cloud solutions that can scale with your projects
                  without breaking the bank. Whether you're freelancing,
                  consulting, or working on personal projects, Sealos provides
                  the enterprise-grade infrastructure you need at
                  individual-friendly prices.
                </p>
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
                      location="individual-overview"
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

              {/* Key Highlights for Individuals */}
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Pay-as-You-Use
                    </h4>
                    <p className="text-sm text-gray-600">
                      Individual-friendly pricing
                    </p>
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Instant Setup
                    </h4>
                    <p className="text-sm text-gray-600">
                      Start coding immediately
                    </p>
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
