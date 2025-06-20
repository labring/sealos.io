'use client';

import { appDomain } from '@/config/site';

export default function FooterCta() {
  return (
    <section>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-12 text-center text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-white"></div>
          <div className="absolute top-32 right-20 h-16 w-16 rounded-full bg-white"></div>
          <div className="absolute bottom-20 left-32 h-12 w-12 rounded-full bg-white"></div>
          <div className="absolute right-10 bottom-10 h-24 w-24 rounded-full bg-white"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Ready to Scale Your Data?
          </h2>
          <p className="mb-8 text-xl text-blue-100 md:text-2xl">
            Deploy production-ready databases in seconds, not weeks. Get started
            today and scale as you grow.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={`${appDomain}/?openapp=system-database`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl"
            >
              Deploy Your First Database
            </a>
            {/* <a
              href="/docs/guides/databases"
              className="rounded-xl border-2 border-white px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-white hover:text-blue-600"
            >
              View Documentation
            </a> */}
          </div>

          {/* Feature highlights */}
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-3xl font-bold">~5 secs</div>
              <div className="text-blue-200">Average deployment time</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-blue-200">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-blue-200">Monitoring & support</div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 border-t border-blue-400 pt-8">
            <p className="mb-4 text-blue-200">
              Trusted by thousands of developers worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Secondary CTA section */}
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Need Custom Solutions?
          </h3>
          <p className="mb-6 text-gray-600">
            Enterprise customers get dedicated support, custom configurations,
            and SLA guarantees tailored to their specific requirements.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700"
          >
            Contact Us
            <span className="ml-2">→</span>
          </a>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Migration Support
          </h3>
          <p className="mb-6 text-gray-600">
            Moving from another provider? Our migration team helps you
            transition seamlessly with zero downtime and data integrity
            guarantees.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700"
          >
            Contact Us
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
