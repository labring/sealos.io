'use client';

import { CustomButton } from '@/components/ui/button-custom';
import { ExternalLink } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function FooterCta() {
  const primaryCtaClassName = cn(
    buttonVariants({ variant: 'landing-primary' }),
    'h-11 gap-2 px-8',
  );

  return (
    <section>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 p-12 text-center text-white shadow-2xl shadow-black/40">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 h-20 w-20 rounded-full bg-white/30 blur-xl"></div>
          <div className="absolute top-32 right-20 h-16 w-16 rounded-full bg-white/30 blur-xl"></div>
          <div className="absolute bottom-20 left-32 h-12 w-12 rounded-full bg-white/30 blur-xl"></div>
          <div className="absolute right-10 bottom-10 h-24 w-24 rounded-full bg-white/30 blur-xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="mb-6 text-4xl font-bold md:text-5xl">
            Ready to Deploy Your First App?
          </h2>
          <p className="mb-8 text-xl text-white/80 md:text-2xl">
            Join thousands of developers who deploy applications in minutes, not
            weeks. Experience the power of Kubernetes without the complexity.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <CustomButton
              className={primaryCtaClassName}
              title="Browse App Store"
              location="footer-cta"
              href="#featured-apps"
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
              <div className="text-3xl font-bold text-white">&lt; 30 secs</div>
              <div className="text-white/70">From click to running app</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">100+</div>
              <div className="text-white/70">Ready-to-deploy templates</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-white/70">Deployment success rate</div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 border-t border-white/25 pt-8">
            <p className="mb-4 text-white/70">
              Trusted by developers at startups and Fortune 500 companies
            </p>
            <div className="flex justify-center space-x-8 opacity-80">
              <div className="text-sm text-white/90">No vendor lock-in</div>
              <div className="text-sm text-white/90">•</div>
              <div className="text-sm text-white/90">Open source friendly</div>
              <div className="text-sm text-white/90">•</div>
              <div className="text-sm text-white/90">Production ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary CTA section */}
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-white/5">
          <h3 className="mb-4 text-2xl font-bold text-foreground">
            Custom Application Templates
          </h3>
          <p className="mb-6 text-muted-foreground">
            Need a specific application template? Our team can help you create
            custom deployment templates tailored to your organization's needs.
          </p>
          <a
            href="https://github.com/labring-actions/templates"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Contribute on GitHub
            <span className="ml-2">→</span>
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-white/5">
          <h3 className="mb-4 text-2xl font-bold text-foreground">
            Enterprise Solutions
          </h3>
          <p className="mb-6 text-muted-foreground">
            Private app stores, custom integrations, and dedicated support for
            enterprise teams. Get white-glove service for mission-critical
            deployments.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Contact Sales
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
