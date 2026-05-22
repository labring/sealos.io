import { figmaDetailHeadingClassName } from './SectionHeading';
import type { AppDetailConfig } from './app-detail-utils';
import ReadmeMarkdownWindow from './ReadmeMarkdownWindow';

interface ReadmePreviewProps {
  app: AppDetailConfig;
}

export default function ReadmePreview({ app }: ReadmePreviewProps) {
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

          <ReadmeMarkdownWindow app={app} />
        </div>
      </div>
    </section>
  );
}
