import { Globe } from 'lucide-react';
import { AppIcon } from '@/components/ui/app-icon';
import type { AppDetailConfig } from './app-detail-utils';

export default function AppTemplateCardPreview({
  app,
}: {
  app: AppDetailConfig;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#101218] shadow-2xl shadow-black/40">
      <div className="flex h-8 items-center justify-between border-b border-white/10 bg-white/[0.035] px-3">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
          <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.04] px-8 py-1 text-[10px] text-zinc-300">
          <Globe className="h-2.5 w-2.5 text-zinc-400" aria-hidden="true" />
          sealos.io
        </div>
        <span className="w-[34px]" aria-hidden="true" />
      </div>
      <div className="relative min-h-[260px] overflow-hidden bg-[#d8d8d8] p-8 text-zinc-950 sm:min-h-[330px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(20,109,255,0.16),transparent_34%)]" />
        <div className="relative flex h-full min-h-[220px] flex-col justify-between sm:min-h-[280px]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <div className="text-[52px] leading-none font-semibold tracking-normal sm:text-[76px] lg:text-[96px]">
                {app.name}
              </div>
              <p className="mt-5 max-w-[410px] text-base leading-6 text-zinc-800 lg:text-lg lg:leading-7">
                Build production-ready {app.category.toLowerCase()} templates
                with Sealos.
              </p>
            </div>
            <div className="hidden shrink-0 rounded-2xl border border-black/10 bg-white/75 p-3 shadow-xl sm:block">
              <AppIcon
                src={app.icon}
                alt=""
                width={72}
                height={72}
                className="h-16 w-16 rounded-xl object-contain"
                fallbackClassName="h-12 w-12 text-zinc-700"
              />
            </div>
          </div>
          <div className="flex items-end justify-between gap-4">
            <span className="truncate text-base text-zinc-900">
              {app.website || app.github || `/${app.slug}`}
            </span>
            <span className="text-4xl leading-none font-semibold">
              deploy <span className="text-[#073edc]">now</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
