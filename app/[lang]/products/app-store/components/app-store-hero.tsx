'use client';

import { Search } from 'lucide-react';
import { GodRays } from '@/new-components/GodRays';
import { GradientText } from '@/new-components/GradientText';
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
  return apps.filter((app) => Boolean(app.icon)).slice(0, HERO_ICON_COUNT);
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
    <section className="relative overflow-x-clip pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-36 md:pb-28">
      <div
        className="bg-background pointer-events-none absolute inset-0 z-0"
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
        <div className="max-w-[760px] min-w-0">
          <GradientText
            as="h1"
            className="block max-w-[760px] to-[#146DFF] text-[32px] leading-[1.12] font-semibold sm:text-[36px] lg:text-[36px] xl:text-[36px]"
          >
            Ready-to-use,{' '}
            <span className="whitespace-nowrap">One-Click Deployment</span>
          </GradientText>
          <p className="mt-6 max-w-[680px] text-base leading-7 text-zinc-400 sm:text-lg">
            Discover top-tier open-source applications and run them through the
            Sealos automation engine without writing Kubernetes YAML.
          </p>

          <label
            htmlFor="hero-app-search"
            className="mt-10 flex min-h-[56px] w-full max-w-[700px] items-center gap-3 rounded-lg border border-[#46464A] bg-[#121214] px-5 text-[#6B6B72] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition focus-within:border-[#6B6B72] hover:border-[#5A5A60]"
          >
            <Search className="h-5 w-5 shrink-0 text-[#6B6B72]" />
            <input
              id="hero-app-search"
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              aria-label="Search app templates"
              placeholder={`Search ${formattedCount}+ open-source application templates (e.g., AI, databases, blogs)...`}
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-[#6B6B72]"
            />
          </label>
        </div>

        <div className="relative mx-auto hidden h-[300px] w-full max-w-[540px] overflow-hidden lg:block">
          <div className="from-background absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent" />
          <div className="from-background absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(40,98,190,0.2),transparent_42%)]" />
          <div className="grid h-full grid-cols-6 gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_78%,transparent)] opacity-80">
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
