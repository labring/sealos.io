'use client';

import { Search } from 'lucide-react';
import { GodRays } from '@/new-components/GodRays';
import { AppIcon } from '@/components/ui/app-icon';
import { type AppConfig } from '@/config/apps';
import { getMinimumCountLabel } from './app-store-browser-utils';

interface AppStoreHeroProps {
  apps: AppConfig[];
  query: string;
  onQueryChange: (query: string) => void;
}

const HERO_ICON_COUNT = 30;
const MINIMUM_APP_COUNT_LABEL = 149;

function getHeroApps(apps: AppConfig[]) {
  return apps
    .filter((app) => Boolean(app.icon))
    .slice(0, HERO_ICON_COUNT);
}

export default function AppStoreHero({
  apps,
  query,
  onQueryChange,
}: AppStoreHeroProps) {
  const heroApps = getHeroApps(apps);
  const formattedCount = getMinimumCountLabel(
    apps.length,
    MINIMUM_APP_COUNT_LABEL,
  );

  return (
    <section className="relative overflow-x-clip pt-28 pb-20 md:pt-36 md:pb-28">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-background"
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0 z-[3]">
        <GodRays
          sources={[
            {
              x: -0.05,
              y: -0.05,
              angle: 60,
              spread: 20,
              count: 12,
              color: '220, 220, 220',
              opacityMin: 0.24,
              opacityMax: 0.25,
              minWidth: 120,
              maxWidth: 180,
            },
            {
              x: -0.05,
              y: -0.05,
              angle: 60,
              spread: 8,
              count: 6,
              color: '255, 255, 255',
              opacityMin: 0.89,
              opacityMax: 0.9,
              minWidth: 12,
              maxWidth: 24,
            },
            {
              x: 0.25,
              y: -0.06,
              angle: 50,
              spread: 20,
              count: 6,
              color: '180, 180, 180',
              opacityMin: 0.14,
              opacityMax: 0.15,
              minWidth: 60,
              maxWidth: 120,
            },
          ]}
          speed={0}
          maxWidth={48}
          minLength={1200}
          maxLength={2000}
          blur={8}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[minmax(0,700px)_minmax(0,1fr)] lg:px-8">
        <div className="min-w-0 max-w-[760px]">
          <h1 className="max-w-full text-[34px] leading-[1.08] font-semibold text-white sm:text-5xl lg:text-[52px] xl:text-[56px]">
            Ready-to-use,{' '}
            <span className="block text-[#6ea2ff] lg:inline">
              <span className="block whitespace-nowrap sm:inline">
                One-Click
              </span>{' '}
              <span className="block whitespace-nowrap sm:inline">
                Deployment
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-[680px] text-base leading-7 text-zinc-400 sm:text-lg">
            Discover top-tier open-source applications and run them through the
            Sealos automation engine without writing Kubernetes YAML.
          </p>

          <label
            htmlFor="hero-app-search"
            className="mt-10 flex min-h-[56px] w-full max-w-[700px] items-center gap-3 rounded-lg border border-white/10 bg-[#111318]/90 px-5 text-zinc-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus-within:border-white/25 focus-within:bg-[#13161c] hover:border-white/20"
          >
            <Search className="h-5 w-5 shrink-0 text-zinc-400" />
            <input
              id="hero-app-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              aria-label="Search app templates"
              placeholder={`Search ${formattedCount}+ open-source application templates (e.g., AI, databases, blogs)...`}
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-500"
            />
          </label>
        </div>

        <div className="relative mx-auto hidden h-[300px] w-full max-w-[540px] overflow-hidden lg:block">
          <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(40,98,190,0.2),transparent_42%)]" />
          <div className="grid h-full grid-cols-6 gap-4 opacity-80 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_78%,transparent)]">
            {heroApps.map((app) => (
              <div
                key={app.slug}
                className="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <AppIcon
                  src={app.icon}
                  alt={`${app.name} icon`}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-lg object-contain"
                  fallbackClassName="h-7 w-7 text-zinc-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
