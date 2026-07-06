import Image from 'next/image';
import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';

import { AppIcon } from '@/components/ui/app-icon';
import { appsConfig, type AppConfig } from '@/config/apps';
import { GradientText } from '@/new-components/GradientText';
import { AppLogoCloudCursor } from './app-logo-cloud-cursor';
import {
  type AppsSectionLogoItem,
  getAppsSectionCards,
  getAppsSectionLogoRows,
} from './apps-section-utils';

const appCards = getAppsSectionCards(appsConfig);
const logoRows = getAppsSectionLogoRows(appsConfig);

export function AppsSection() {
  return (
    <section className="container mx-auto overflow-x-clip pt-16 pb-24 text-white lg:pt-20 lg:pb-28">
      <div className="flex flex-col gap-20">
        <div className="relative flex min-h-[300px] items-end">
          <AppLogoCloud rows={logoRows} />
          <SectionHeading />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {appCards.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
          <MoreAppsCard rows={logoRows} />
        </div>
      </div>
    </section>
  );
}

function SectionHeading() {
  return (
    <div
      className="absolute top-0 left-0 z-10 w-full"
      data-apps-section-heading
    >
      <div className="absolute inset-x-0 bottom-0 h-64" aria-hidden="true" />
      <div className="relative flex max-w-[812px] flex-col items-start gap-6 text-left">
        <GradientText
          as="h2"
          className="to-blue-500 text-3xl leading-tight font-semibold text-balance sm:text-4xl lg:text-5xl"
        >
          One-click Apps for the stack you're already building.
        </GradientText>
        <p className="max-w-[618px] text-base leading-6 text-zinc-500">
          Deploy major production dependencies and web open-source tools with
          pre-configured internal networking rules.
        </p>
      </div>
    </div>
  );
}

function AppLogoCloud({ rows }: { rows: AppsSectionLogoItem[][] }) {
  return (
    <div
      className="pointer-events-none absolute inset-x-1/2 top-0 w-screen max-w-[1312px] -translate-x-1/2"
      aria-hidden="true"
    >
      <div className="opacity-55">
        <LogoMarqueeRows rows={rows} />
      </div>
      <AppLogoCloudCursor />
    </div>
  );
}

function AppCard({ app }: { app: AppConfig }) {
  const href = `/products/app-store/${app.slug.toLowerCase()}`;

  return (
    <article className="group flex min-h-[275px] flex-col overflow-hidden rounded-xl bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:bg-zinc-900">
      <AppPreview app={app} href={href} />
      <div className="space-y-5 p-5">
        <div className="flex items-start gap-4">
          <Link
            href={href}
            className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 shadow-sm transition duration-200 group-hover:scale-[1.03]"
            aria-label={`View ${app.name} details`}
          >
            <AppIcon
              src={app.icon}
              alt={`${app.name} icon`}
              width={48}
              height={48}
              className="size-10 rounded-md object-contain"
              fallbackClassName="size-7 text-zinc-700"
            />
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <Link
                href={href}
                className="truncate text-xl font-semibold text-zinc-100 transition hover:text-white"
              >
                {app.name}
              </Link>
              <AppCategory category={app.category} />
            </div>
            <p className="mt-2 line-clamp-2 h-[2lh] text-base leading-6 text-zinc-500">
              {app.description}
            </p>
          </div>
        </div>

        <Link
          href={href}
          className="flex h-9 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/15"
        >
          Deploy
        </Link>
      </div>
    </article>
  );
}

function MoreAppsCard({ rows }: { rows: AppsSectionLogoItem[][] }) {
  return (
    <article className="group flex min-h-[275px] flex-col overflow-hidden rounded-xl bg-zinc-950 transition duration-300 hover:-translate-y-1 hover:bg-zinc-900">
      <div className="relative h-[135px] overflow-hidden">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <LogoMarqueeRows rows={rows.slice(0, 3)} compact />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/70" />
      </div>
      <div className="space-y-5 p-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-zinc-100">200+ More</h3>
            <AppCategory category="Catalog" />
          </div>
          <p className="mt-2 line-clamp-2 h-[2lh] text-base text-zinc-500">
            Browse the full app catalog.
          </p>
        </div>

        <Link
          href="/products/app-store"
          className="flex h-9 items-center justify-center gap-2 rounded-full bg-white/10 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/15"
        >
          Browse All
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function LogoMarqueeRows({
  rows,
  compact = false,
}: {
  rows: AppsSectionLogoItem[][];
  compact?: boolean;
}) {
  return (
    <div
      className={`flex w-full flex-col blur-[0.2px] ${compact ? 'gap-2' : 'gap-3'}`}
    >
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="overflow-hidden">
          <div
            className="flex w-max gap-3"
            style={{
              animation: `${rowIndex % 2 ? 'apps-marquee-right' : 'apps-marquee-left'} ${compact ? 80 : 100 + rowIndex * 8}s linear infinite`,
            }}
          >
            {[...row, ...row].map((item, index) => (
              <LogoTile
                key={`${rowIndex}-${item.label}-${index}`}
                item={item}
                compact={compact}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function LogoTile({
  item,
  compact,
}: {
  item: AppsSectionLogoItem;
  compact: boolean;
}) {
  const sizeClassName = compact ? 'size-10' : 'size-16';

  if (item.isMore) {
    return (
      <div
        className={`${sizeClassName} flex shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/5 px-2 text-center text-xs leading-tight font-semibold text-zinc-300 shadow-inner`}
      >
        200+ More
      </div>
    );
  }

  return (
    <div
      className={`${sizeClassName} flex shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/5 shadow-inner`}
      data-app-logo-tile
      data-app-name={item.label}
    >
      <AppIcon
        src={item.icon ?? ''}
        alt=""
        width={compact ? 24 : 32}
        height={compact ? 24 : 32}
        className={`${compact ? 'size-6' : 'size-8'} rounded-md object-contain`}
        fallbackClassName={`${compact ? 'size-5' : 'size-7'} text-zinc-600`}
      />
    </div>
  );
}

function AppCategory({ category }: { category: string }) {
  return (
    <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-white/5 px-2 text-xs text-zinc-400">
      <span className="size-1.5 rounded-full bg-blue-400" />
      {category}
    </span>
  );
}

function AppPreview({ app, href }: { app: AppConfig; href: string }) {
  const primaryScreenshot = app.screenshots?.[0];

  return (
    <Link
      href={href}
      className="relative block h-[135px] overflow-hidden"
      aria-label={`View ${app.name} details`}
    >
      {primaryScreenshot ? (
        <div className="absolute top-[-0.37px] left-0 h-[136px] w-[110%] overflow-hidden">
          <div className="absolute top-[12px] left-[6.8%] h-[355px] w-[111.3%]">
            <div className="flex h-full items-center justify-center">
              <div className="relative h-[315px] w-[93%] rotate-[-6deg] overflow-hidden rounded-[5px] opacity-80 shadow-2xl shadow-black/40 transition duration-300 group-hover:scale-[1.02] group-hover:rotate-[-4deg] group-hover:opacity-95">
                <Image
                  src={primaryScreenshot}
                  alt={`${app.name} screenshot`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 93vw, (max-width: 1280px) 46vw, 400px"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <AppPreviewPlaceholder app={app} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
    </Link>
  );
}

function AppPreviewPlaceholder({ app }: { app: AppConfig }) {
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient}`} />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-x-6 top-8 h-36 rotate-[-5deg] rounded-lg border border-white/10 bg-zinc-950/75 shadow-2xl shadow-black/40 transition duration-300 group-hover:rotate-[-3deg]">
        <div className="flex h-7 items-center gap-1.5 border-b border-white/10 px-3">
          <span className="size-2 rounded-full bg-white/20" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/10" />
        </div>
        <div className="space-y-2 p-4">
          <div className="h-3 w-28 rounded bg-white/15" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 rounded border border-white/10 bg-white/[0.03]" />
            <div className="h-8 rounded border border-white/10 bg-white/[0.03]" />
          </div>
          <div className="h-3 w-40 rounded bg-white/10" />
        </div>
      </div>
    </>
  );
}
