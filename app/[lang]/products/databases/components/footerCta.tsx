'use client';

import { appDomain } from '@/config/site';

export default function FooterCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] p-6 text-center text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur sm:p-8 lg:p-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/35 to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="mb-6 text-3xl leading-tight font-medium md:text-5xl">
            Ready to Scale Your Data?
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-base leading-7 text-zinc-400 md:text-xl">
            Deploy production-ready databases in seconds, not weeks. Get started
            today and scale as you grow.
          </p>

          <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row lg:mb-12">
            <a
              href={`${appDomain}/?openapp=system-database`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white bg-white px-8 text-base font-semibold text-zinc-950 shadow-[0_10px_30px_rgba(255,255,255,0.14)] transition-all duration-300 hover:bg-zinc-200 sm:w-auto"
            >
              Deploy Your First Database
            </a>
          </div>

          <div className="grid gap-4 text-center md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5">
              <div className="text-3xl font-bold">~5 secs</div>
              <div className="mt-2 text-sm text-zinc-400">
                Average deployment time
              </div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="mt-2 text-sm text-zinc-400">Uptime</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.035] p-5">
              <div className="text-3xl font-bold">24/7</div>
              <div className="mt-2 text-sm text-zinc-400">
                Monitoring & support
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-8 lg:mt-12">
            <p className="mb-4 text-zinc-400">
              Trusted by thousands of developers worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:mt-8">
        <div className="rounded-xl border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur sm:p-8">
          <h3 className="mb-4 text-2xl font-semibold text-white">
            Need Custom Solutions?
          </h3>
          <p className="mb-6 text-sm leading-6 text-zinc-400 sm:text-base">
            Enterprise customers get dedicated support, custom configurations,
            and SLA guarantees tailored to their specific requirements.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center font-medium text-zinc-100 hover:text-white"
          >
            Contact Us
            <span className="ml-2">→</span>
          </a>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.035] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur sm:p-8">
          <h3 className="mb-4 text-2xl font-semibold text-white">
            Migration Support
          </h3>
          <p className="mb-6 text-sm leading-6 text-zinc-400 sm:text-base">
            Moving from another provider? Our migration team helps you
            transition seamlessly with zero downtime and data integrity
            guarantees.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center font-medium text-zinc-100 hover:text-white"
          >
            Contact Us
            <span className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
