import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { AppIcon } from '@/components/ui/app-icon';
import type { languagesType } from '@/lib/i18n';
import AppPreviewPanel from './AppPreviewPanel';
import { figmaDetailHeadingClassName } from './SectionHeading';
import {
  formatAppCount,
  getDeployCount,
  type AppDetailConfig,
} from './app-detail-utils';

interface RelatedTemplatesProps {
  apps: AppDetailConfig[];
  lang: languagesType;
}

export default function RelatedTemplates({ apps, lang }: RelatedTemplatesProps) {
  if (apps.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className={figmaDetailHeadingClassName()}>
            Related templates
          </h2>
          <p className="mt-6 text-sm leading-6 text-zinc-500">
            Explore more production-ready templates.
          </p>
        </div>
        <Link
          href={`/${lang}/products/app-store`}
          className="inline-flex items-center gap-2 text-sm text-zinc-200 transition hover:text-[#69a3ff]"
        >
          More
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-[34%] bg-gradient-to-l from-background to-transparent lg:block" />
        <div className="snap-x snap-mandatory overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max gap-6 pr-20">
            {apps.map((app) => {
              const deployCount = getDeployCount(app);
              const hasDeployCount = typeof app.source?.deployCount === 'number';

              return (
                <article
                  key={app.slug}
                  className="group flex w-[82vw] max-w-[386px] min-w-[310px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.055]"
                >
                  <Link
                    href={`/${lang}/products/app-store/${app.slug}`}
                    className="block h-[135px] overflow-hidden"
                    aria-label={`View ${app.name} details`}
                  >
                    <div className="origin-center scale-[0.68] opacity-80 transition duration-300 group-hover:scale-[0.7]">
                      <AppPreviewPanel app={app} compact />
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col gap-5 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <Link
                        href={`/${lang}/products/app-store/${app.slug}`}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-100 shadow-sm transition duration-200 group-hover:scale-[1.03]"
                      >
                        <AppIcon
                          src={app.icon}
                          alt={`${app.name} icon`}
                          width={48}
                          height={48}
                          className="h-10 w-10 rounded-md object-contain"
                          fallbackClassName="h-7 w-7 text-zinc-700"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center justify-between gap-3">
                          <Link
                            href={`/${lang}/products/app-store/${app.slug}`}
                            className="truncate text-base font-semibold text-zinc-100 transition hover:text-white"
                          >
                            {app.name}
                          </Link>
                          <div className="flex shrink-0 items-center gap-1.5">
                            {hasDeployCount && (
                              <span className="inline-flex h-6 items-center gap-1 rounded-full bg-white/[0.055] px-2 text-xs text-zinc-400">
                                <Star className="h-3 w-3 fill-[#8fd44e] text-[#8fd44e]" />
                                {formatAppCount(deployCount)}
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
                      <Link
                        href={`/${lang}/products/app-store/${app.slug}`}
                        className="ml-auto inline-flex h-9 items-center gap-2 rounded-full px-1 text-sm font-medium text-[#69a3ff] transition hover:text-white"
                      >
                        View Template
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
