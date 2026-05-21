'use client';

import { useEffect, useMemo, useState, type ComponentType } from 'react';
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Rocket,
  Sparkles,
  Star,
} from 'lucide-react';
import { languagesType } from '@/lib/i18n';
import { AppIcon } from '@/components/ui/app-icon';
import { type AppConfig } from '@/config/apps-loader';
import { cn } from '@/lib/utils';
import { useOpenDeployModal } from '@/new-components/DeployModal';
import {
  ALL_CATEGORY,
  getCategoryCounts,
  getDeployCount,
  getVisibleApps,
  type SortOption,
} from '@/app/[lang]/products/app-store/components/app-store-browser-utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AppGridProps {
  lang: languagesType;
  initialApps: AppConfig[];
  query?: string;
  onQueryChange?: (query: string) => void;
}

const PAGE_SIZE = 12;

const sortOptions: Array<{
  value: SortOption;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { value: 'deploy-count', label: 'Most deployed', icon: Star },
  { value: 'name-asc', label: 'Name A-Z', icon: ArrowDownAZ },
  { value: 'name-desc', label: 'Name Z-A', icon: ArrowUpAZ },
];

const preferredCategoryOrder = [
  ALL_CATEGORY,
  'AI',
  'Low-Code',
  'Tools',
  'Database',
  'Monitoring',
  'Blog',
  'DevOps',
  'Storage',
];

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}

function getPageItems(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, currentPage]);
  if (currentPage > 1) {
    pages.add(currentPage - 1);
  }
  if (currentPage < totalPages) {
    pages.add(currentPage + 1);
  }

  return Array.from(pages).sort((a, b) => a - b);
}

function getPrimaryTag(app: AppConfig) {
  return app.tags?.[0]?.replace(/-/g, ' ') || app.category;
}

function AppCard({
  app,
  lang,
  index,
  onDeploy,
}: {
  app: AppConfig;
  lang: languagesType;
  index: number;
  onDeploy: (app: AppConfig) => void;
}) {
  const deployCount = getDeployCount(app);
  const hasDeployCount = typeof app.source?.deployCount === 'number';

  return (
    <article
      className="group flex min-h-[275px] flex-col overflow-hidden rounded-2xl bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.055]"
      style={{ animationDelay: `${Math.min(index, 11) * 35}ms` }}
    >
      <a
        href={`/${lang}/products/app-store/${app.slug}`}
        className="relative block h-[135px] overflow-hidden"
        aria-label={`View ${app.name} details`}
      >
        <div className={cn('absolute inset-0 bg-gradient-to-br', app.gradient)} />
        <div className="absolute inset-0 bg-background/65" />
        <div className="absolute inset-x-6 top-8 h-36 rotate-[-5deg] rounded-lg border border-white/10 bg-zinc-950/75 shadow-2xl shadow-black/40 transition duration-300 group-hover:rotate-[-3deg]">
          <div className="flex h-7 items-center gap-1.5 border-b border-white/10 px-3">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/15" />
            <span className="h-2 w-2 rounded-full bg-white/10" />
          </div>
          <div className="space-y-2 p-4">
            <div className="h-3 w-28 rounded bg-white/14" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-8 rounded border border-white/10 bg-white/[0.03]" />
              <div className="h-8 rounded border border-white/10 bg-white/[0.03]" />
            </div>
            <div className="h-3 w-40 rounded bg-white/10" />
          </div>
        </div>
      </a>

      <div className="flex flex-1 flex-col gap-5 px-5 py-4">
        <div className="flex items-start gap-3">
          <a
            href={`/${lang}/products/app-store/${app.slug}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 shadow-sm transition duration-200 group-hover:scale-[1.03]"
            aria-label={`View ${app.name} details`}
          >
            <AppIcon
              src={app.icon}
              alt={`${app.name} icon`}
              width={48}
              height={48}
              className="h-10 w-10 rounded-md object-contain"
              fallbackClassName="h-7 w-7 text-zinc-700"
            />
          </a>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <a
                href={`/${lang}/products/app-store/${app.slug}`}
                className="truncate text-base font-semibold text-zinc-100 transition hover:text-white"
              >
                {app.name}
              </a>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="inline-flex h-6 items-center gap-1 rounded-full bg-white/[0.055] px-2 text-xs text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#6ea2ff]" />
                  {app.category}
                </span>
                {hasDeployCount && (
                  <span className="inline-flex h-6 items-center gap-1 rounded-full bg-white/[0.055] px-2 text-xs text-zinc-400">
                    <Star className="h-3 w-3 fill-[#8fd44e] text-[#8fd44e]" />
                    {formatCount(deployCount)}
                  </span>
                )}
              </div>
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-zinc-400">
              {app.description}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2">
          <span className="min-w-0 truncate rounded-full bg-white/[0.045] px-3 py-1 text-xs capitalize text-zinc-500">
            {getPrimaryTag(app)}
          </span>
          <button
            type="button"
            onClick={() => onDeploy(app)}
            className="ml-auto inline-flex h-9 min-w-[120px] items-center justify-center rounded-full bg-white/[0.055] px-4 text-sm font-medium text-zinc-100 transition duration-200 hover:bg-white/[0.12] active:scale-[0.98]"
            data-technology={app.name}
            data-category={app.category}
          >
            Deploy
          </button>
        </div>
      </div>
    </article>
  );
}

export default function AppGrid({
  lang,
  initialApps,
  query: controlledQuery,
  onQueryChange,
}: AppGridProps) {
  const openDeployModal = useOpenDeployModal();
  const apps = initialApps;
  const [localQuery, setLocalQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORY);
  const [sort, setSort] = useState<SortOption>('deploy-count');
  const [page, setPage] = useState(1);
  const query = controlledQuery ?? localQuery;
  const setQuery = onQueryChange ?? setLocalQuery;

  const categoryCounts = useMemo(() => getCategoryCounts(apps), [apps]);
  const categories = useMemo(
    () => [
      ...preferredCategoryOrder.filter((category) => category in categoryCounts),
      ...Object.keys(categoryCounts)
        .filter((category) => !preferredCategoryOrder.includes(category))
        .sort((a, b) => a.localeCompare(b)),
    ],
    [categoryCounts],
  );
  const activeSort = sortOptions.find((option) => option.value === sort)!;
  const visible = useMemo(
    () =>
      getVisibleApps({
        apps,
        query,
        category: selectedCategory,
        sort,
        page,
        pageSize: PAGE_SIZE,
      }),
    [apps, page, query, selectedCategory, sort],
  );

  useEffect(() => {
    setPage(1);
  }, [query, selectedCategory, sort]);

  useEffect(() => {
    if (page !== visible.currentPage) {
      setPage(visible.currentPage);
    }
  }, [page, visible.currentPage]);

  const pageItems = getPageItems(visible.currentPage, visible.totalPages);
  let previousRenderedPage = 0;

  return (
    <section id="featured-apps" className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-3 overflow-x-auto pb-2 [scrollbar-width:none] lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'h-11 shrink-0 rounded-lg px-5 text-sm font-medium transition duration-200 active:scale-[0.98]',
                  isActive
                    ? 'bg-white/[0.18] text-white'
                    : 'text-zinc-400 hover:bg-white/[0.055] hover:text-zinc-100',
                )}
              >
                {category}
                <span className="ml-2 text-xs text-zinc-500">
                  {categoryCounts[category] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-11 w-fit shrink-0 items-center justify-center gap-2 rounded-lg border border-white/15 bg-transparent px-4 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.055]">
            <activeSort.icon className="h-4 w-4" />
            Sort: {activeSort.label}
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-white/10 bg-zinc-950 text-zinc-100"
          >
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => setSort(option.value)}
                className="cursor-pointer gap-2 focus:bg-white/10 focus:text-white"
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-500">
        <span>
          Showing {visible.apps.length} of {visible.totalItems} apps
        </span>
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="text-zinc-300 transition hover:text-white"
          >
            Clear search
          </button>
        )}
      </div>

      {visible.apps.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {visible.apps.map((app, index) => (
            <AppCard
              key={app.slug}
              app={app}
              lang={lang}
              index={index}
              onDeploy={(selectedApp) => openDeployModal(selectedApp.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-6 text-center">
          <Sparkles className="mb-4 h-8 w-8 text-[#6ea2ff]" />
          <h3 className="text-xl font-semibold text-white">No apps found</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
            Try a different search term or browse all categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedCategory(ALL_CATEGORY);
            }}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-full bg-white/[0.08] px-5 text-sm font-medium text-white transition hover:bg-white/[0.15]"
          >
            <Rocket className="h-4 w-4" />
            Reset filters
          </button>
        </div>
      )}

      {visible.totalPages > 1 && (
        <nav
          aria-label="App Store pagination"
          className="mt-16 flex items-center justify-center gap-1 text-sm font-medium text-zinc-100"
        >
          <button
            type="button"
            disabled={visible.currentPage === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="inline-flex h-10 items-center gap-1 rounded-md px-3 transition hover:bg-white/[0.06] disabled:pointer-events-none disabled:opacity-[0.35]"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {pageItems.map((pageNumber) => {
            const needsEllipsis = pageNumber - previousRenderedPage > 1;
            previousRenderedPage = pageNumber;

            return (
              <span key={pageNumber} className="inline-flex items-center gap-1">
                {needsEllipsis && (
                  <span className="flex h-10 w-10 items-center justify-center text-zinc-500">
                    ...
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  aria-current={
                    pageNumber === visible.currentPage ? 'page' : undefined
                  }
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-md transition',
                    pageNumber === visible.currentPage
                      ? 'border border-white/15 bg-white/[0.035] text-white'
                      : 'hover:bg-white/[0.06]',
                  )}
                >
                  {pageNumber}
                </button>
              </span>
            );
          })}

          <button
            type="button"
            disabled={visible.currentPage === visible.totalPages}
            onClick={() =>
              setPage((current) => Math.min(visible.totalPages, current + 1))
            }
            className="inline-flex h-10 items-center gap-1 rounded-md px-3 transition hover:bg-white/[0.06] disabled:pointer-events-none disabled:opacity-[0.35]"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </nav>
      )}
    </section>
  );
}
