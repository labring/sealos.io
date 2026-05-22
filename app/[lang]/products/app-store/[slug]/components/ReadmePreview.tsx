import Image from 'next/image';
import AppPreviewPanel from './AppPreviewPanel';
import { figmaDetailHeadingClassName } from './SectionHeading';
import type { AppDetailConfig } from './app-detail-utils';

interface ReadmePreviewProps {
  app: AppDetailConfig;
}

export default function ReadmePreview({ app }: ReadmePreviewProps) {
  const primaryScreenshot = app.screenshots?.[0];
  const readmeScreenshotImageClassName =
    'object-cover -translate-y-[11%] scale-[1.22]';

  return (
    <section
      id="readme"
      className="mx-auto max-w-[1300px] px-6 pt-12 pb-16 lg:px-8 lg:pt-16 lg:pb-24"
    >
      <h2
        className={figmaDetailHeadingClassName({
          earlyBlue: true,
          wideLayer: true,
        })}
      >
        README
      </h2>

      <div className="mt-6 overflow-hidden rounded-xl bg-[#0a0a0a] p-3 shadow-2xl shadow-black/50">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#101218]">
          <div className="flex h-9 items-center justify-between border-b border-white/10 bg-white/[0.035] px-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
              <span className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
              <span className="h-2 w-2 rounded-full bg-[#28c840]" />
            </div>
            <div className="rounded-md bg-white/[0.04] px-10 py-1 text-[10px] text-zinc-300">
              README.md
            </div>
            <span className="w-[42px]" aria-hidden="true" />
          </div>

          {primaryScreenshot ? (
            <div className="relative aspect-[16/9] min-h-[260px] overflow-hidden opacity-90">
              <Image
                src={primaryScreenshot}
                alt={`${app.name} screenshot`}
                fill
                className={readmeScreenshotImageClassName}
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          ) : (
            <div className="p-5 sm:p-6">
              <AppPreviewPanel
                app={app}
                displayUrl="https://sealos.io"
                showChrome={false}
                variant="readme"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
