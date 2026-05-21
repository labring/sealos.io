import Image from 'next/image';
import { Globe } from 'lucide-react';
import { AppIcon } from '@/components/ui/app-icon';
import type { AppDetailConfig } from './app-detail-utils';

interface AppPreviewPanelProps {
  app: AppDetailConfig;
  compact?: boolean;
  displayUrl?: string;
  showChrome?: boolean;
  variant?: 'default' | 'hero' | 'readme';
}

export default function AppPreviewPanel({
  app,
  compact = false,
  displayUrl,
  showChrome = true,
  variant = 'default',
}: AppPreviewPanelProps) {
  const primaryScreenshot = app.screenshots?.[0];
  const readmePanelClassName =
    'relative aspect-[1253/671] min-h-[520px] overflow-hidden bg-[#d8d8d8] p-8 text-zinc-950 sm:p-10 lg:p-12';
  const heroPanelClassName =
    'relative aspect-[586/390] min-h-[300px] overflow-hidden bg-[#d8d8d8] p-6 text-zinc-950 sm:min-h-[340px] lg:p-8';
  const defaultPanelClassName =
    'relative min-h-[260px] overflow-hidden bg-[#d8d8d8] p-8 text-zinc-950 sm:min-h-[330px]';
  const contentMinHeightClassName =
    variant === 'readme'
      ? 'min-h-[456px] sm:min-h-[500px] lg:min-h-[575px]'
      : variant === 'hero'
        ? 'min-h-[252px] sm:min-h-[292px]'
        : 'min-h-[220px] sm:min-h-[280px]';
  const heroTitleClassName =
    'max-w-[360px] text-[46px] leading-[0.98] font-semibold tracking-normal sm:text-[58px] lg:text-[66px]';
  const defaultTitleClassName =
    'text-[52px] leading-none font-semibold tracking-normal sm:text-[76px] lg:text-[96px]';
  const titleClassName =
    variant === 'hero' ? heroTitleClassName : defaultTitleClassName;
  const heroScreenshotImageClassName =
    'object-cover -translate-y-[5%] scale-[1.28]';

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#101218] shadow-2xl shadow-black/40">
      {showChrome && (
        <div className="flex h-8 items-center justify-between border-b border-white/10 bg-white/[0.035] px-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
            <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
            <span className="h-2 w-2 rounded-full bg-[#28c840]" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.04] px-8 py-1 text-[10px] text-zinc-300">
            <Globe className="h-2.5 w-2.5 text-zinc-400" />
            sealos.io
          </div>
          <span className="w-[34px]" aria-hidden="true" />
        </div>
      )}

      {variant === 'hero' && primaryScreenshot ? (
        <div className="relative aspect-[586/390] min-h-[300px] overflow-hidden bg-[#d8d8d8] sm:min-h-[340px]">
          <Image
            src={primaryScreenshot}
            alt={`${app.name} screenshot`}
            fill
            className={heroScreenshotImageClassName}
            sizes="(max-width: 1024px) 100vw, 586px"
            priority
          />
        </div>
      ) : (
        <div
          className={
            variant === 'readme'
              ? readmePanelClassName
              : variant === 'hero'
                ? heroPanelClassName
                : defaultPanelClassName
          }
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(20,109,255,0.16),transparent_34%)]" />
          <div
            className={`relative flex h-full flex-col justify-between ${contentMinHeightClassName}`}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className={titleClassName}>{app.name}</div>
                <p className="mt-5 max-w-[410px] text-base leading-6 text-zinc-800 lg:text-lg lg:leading-7">
                  Build production-ready {app.category.toLowerCase()} templates
                  with Sealos.
                </p>
              </div>
              <div className="hidden shrink-0 rounded-2xl border border-black/10 bg-white/75 p-3 shadow-xl sm:block">
                <AppIcon
                  src={app.icon}
                  alt={`${app.name} icon`}
                  width={72}
                  height={72}
                  className="h-16 w-16 rounded-xl object-contain"
                  fallbackClassName="h-12 w-12 text-zinc-700"
                />
              </div>
            </div>

            {!compact && (
              <div className="grid gap-3 sm:grid-cols-3">
                {(app.features.length ? app.features : app.benefits)
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item}
                      className="rounded-lg border border-black/10 bg-white/55 p-3 text-xs leading-5 text-zinc-700"
                    >
                      {item}
                    </div>
                  ))}
              </div>
            )}

            <div className="flex items-end justify-between gap-4">
              <span className="truncate text-base text-zinc-900">
                {displayUrl || app.website || app.github || `/${app.slug}`}
              </span>
              <span className="text-4xl leading-none font-semibold">
                deploy <span className="text-[#073edc]">now</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
