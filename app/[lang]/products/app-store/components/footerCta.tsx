'use client';

import { CustomButton } from '@/components/ui/button-custom';
import { templateDomain } from '@/config/site';
import { ExternalLink } from 'lucide-react';

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
            Ready to Deploy Your First App?
          </h2>
          <p className="mb-8 text-xl text-blue-100 md:text-2xl">
            Join thousands of developers who deploy applications in minutes, not
            weeks. Experience the power of Kubernetes without the complexity.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CustomButton
              className="cursor-pointer rounded-xl bg-white px-8 py-4 text-lg font-bold text-blue-600 shadow-lg transition-all duration-300 hover:bg-blue-50 hover:shadow-xl"
              title="Browse App Store"
              newWindow={true}
              location="footer-cta"
              href={templateDomain}
            >
              <span className="inline-flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Browse App Store
              </span>
            </CustomButton>
            {/* <a
              href="/docs/guides/app-store"
              className="rounded-xl border-2 border-white px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:bg-white hover:text-blue-600"
            >
              View Documentation
            </a> */}
          </div>

          {/* Feature highlights */}
          <div className="grid gap-8 text-center md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-3xl font-bold">&lt; 30 secs</div>
              <div className="text-blue-200">From click to running app</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-blue-200">Ready-to-deploy templates</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-blue-200">Deployment success rate</div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 border-t border-blue-400 pt-8">
            <p className="mb-4 text-blue-200">
              Trusted by developers at startups and Fortune 500 companies
            </p>
            <div className="flex justify-center space-x-8 opacity-70">
              <div className="text-sm">No vendor lock-in</div>
              <div className="text-sm">•</div>
              <div className="text-sm">Open source friendly</div>
              <div className="text-sm">•</div>
              <div className="text-sm">Production ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary CTA section */}
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Custom Application Templates
          </h3>
          <p className="mb-6 text-gray-600">
            Need a specific application template? Our team can help you create
            custom deployment templates tailored to your organization's needs.
          </p>
          <a
            href="https://github.com/labring-actions/templates"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700"
          >
            Contribute on GitHub
            <span className="ml-2">→</span>
          </a>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Enterprise Solutions
          </h3>
          <p className="mb-6 text-gray-600">
            Private app stores, custom integrations, and dedicated support for
            enterprise teams. Get white-glove service for mission-critical
            deployments.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center font-medium text-blue-600 hover:text-blue-700"
          >
            Contact Sales
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
