import Image from 'next/image';
import {
  Blocks,
  Boxes,
  Check,
  Container,
  Database,
  HardDrive,
  PanelsTopLeft,
  Rocket,
  ScanSearch,
  type LucideIcon,
} from 'lucide-react';
import { CopyCommandButton } from './copy-command';
import {
  CODEX_INSTALL_COMMAND,
  PAGE_COPY,
  PROOF_ITEMS,
  REPO_URL,
  SKILL_CATALOG,
  type SkillIconName,
} from './content';
import {
  AnchorAlias,
  SectionHeading,
  SectionShell,
  TrackedLink,
} from './shared';
import { cn } from '@/lib/utils';

const SKILL_ICONS: Record<SkillIconName, LucideIcon> = {
  rocket: Rocket,
  database: Database,
  storage: HardDrive,
  canvas: PanelsTopLeft,
  blocks: Blocks,
  readiness: ScanSearch,
  container: Container,
  compose: Boxes,
};

export function HeroSection() {
  return (
    <section id="skills" className="relative scroll-mt-24 pt-24 pb-8 sm:pb-20">
      <SectionShell>
        <div className="grid items-center gap-6 sm:gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <div className="max-w-xl">
            <p className="mb-4 font-mono text-xs font-semibold text-[#4CAFE1] uppercase sm:mb-6">
              {PAGE_COPY.hero.eyebrow}
            </p>
            <h1
              className="text-[42px] leading-[46px] font-medium text-balance text-[#F5F2F8] lg:text-[56px] lg:leading-[60px]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {PAGE_COPY.hero.title}
            </h1>
            <p className="mt-4 max-w-[58ch] text-base leading-7 text-[#AAA4B4] sm:mt-6 sm:text-lg sm:leading-8">
              {PAGE_COPY.hero.description}
            </p>
            <div className="mt-6 grid grid-cols-[0.9fr_1.1fr] gap-3 sm:mt-8 sm:flex sm:flex-wrap">
              <CopyCommandButton
                value={CODEX_INSTALL_COMMAND}
                label={PAGE_COPY.hero.primaryCta}
                showStatus
                tone="accent"
                className="min-w-0 px-3 text-xs sm:min-w-[148px] sm:px-4 sm:text-sm"
                tracking={{
                  id: 'skills_hero_copy_codex_install',
                  location: 'sealos_skills_hero',
                  destination: 'clipboard_codex_install',
                }}
              />
              <TrackedLink
                href={REPO_URL}
                className="min-w-0 px-3 text-xs sm:px-4 sm:text-sm"
                tracking={{
                  id: 'skills_hero_view_github',
                  location: 'sealos_skills_hero',
                  destination: 'github_sealos_skills',
                }}
              >
                {PAGE_COPY.hero.secondaryCta}
              </TrackedLink>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-lg border border-[#F5F2F8]/12 bg-[#0F0D17] shadow-[0_28px_80px_rgba(8,7,14,0.42)]">
            <div className="grid grid-cols-[104px_1fr] items-start gap-2 border-b border-[#F5F2F8]/10 px-3 py-2 sm:grid-cols-[150px_1fr] sm:gap-3 sm:px-5 sm:py-4">
              <span className="font-mono text-[11px] font-semibold text-[#4CAFE1] sm:text-xs">
                {PAGE_COPY.hero.commandLabel}
              </span>
              <pre className="min-w-0 overflow-x-auto font-mono text-[10px] leading-5 whitespace-pre text-[#D8D2E0] sm:text-xs">
                <code>{CODEX_INSTALL_COMMAND}</code>
              </pre>
            </div>
            <div className="bg-[#191624] p-1.5 sm:p-3">
              <Image
                src="/images/sealos-skills/codex-sealos.png"
                alt="Codex plugin picker showing Sealos Skills"
                width={2922}
                height={1888}
                priority
                sizes="(max-width: 1023px) 100vw, 680px"
                className="h-[86px] w-full rounded-md border border-[#F5F2F8]/10 object-contain sm:h-auto"
              />
            </div>
            <div className="hidden border-t border-[#F5F2F8]/10 px-4 py-3 font-mono text-xs text-[#AAA4B4] sm:block sm:px-5">
              {PAGE_COPY.hero.invocation}
            </div>
          </div>
        </div>

        <div className="mt-4 flex overflow-x-auto border-y border-[#F5F2F8]/10 sm:mt-14 sm:grid sm:grid-cols-2 sm:overflow-visible lg:mt-20 lg:grid-cols-4">
          {PROOF_ITEMS.map((proof) => (
            <div
              key={proof.label}
              className="min-w-[158px] flex-1 border-r border-[#F5F2F8]/10 px-4 py-3 last:border-r-0 sm:min-w-0 sm:border-b sm:py-6 lg:border-b-0 lg:[&:last-child]:border-r-0 sm:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r sm:[&:nth-child(3)]:border-b-0"
            >
              <p className="font-mono text-lg font-semibold text-[#F5F2F8] sm:text-xl">
                {proof.value}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#8F899B] sm:text-sm">
                {proof.label}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}

export function CapabilitiesSection() {
  return (
    <SectionShell id="runtime" className="py-16 sm:py-24">
      <AnchorAlias id="repository" />
      <SectionHeading
        eyebrow={PAGE_COPY.capabilities.eyebrow}
        title={PAGE_COPY.capabilities.title}
        description={PAGE_COPY.capabilities.description}
      />
      <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {SKILL_CATALOG.map((skill) => {
          const Icon = SKILL_ICONS[skill.icon];

          return (
            <article
              key={skill.id}
              className={cn(
                'flex min-h-[250px] flex-col rounded-lg border p-5 sm:p-6',
                skill.span === 'wide' && 'lg:col-span-2',
                skill.span === 'full' && 'lg:col-span-4',
                skill.surface === 'accent' &&
                  'border-[#4CAFE1]/35 bg-[#162630]',
                skill.surface === 'panel' && 'border-[#F5F2F8]/10 bg-[#191624]',
                skill.surface === 'code' && 'border-[#F5F2F8]/10 bg-[#100E18]',
              )}
            >
              <div
                className={cn(
                  'flex h-full flex-col',
                  skill.span === 'full' &&
                    'sm:grid sm:grid-cols-[auto_1fr_0.8fr] sm:items-center sm:gap-6',
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-md border border-[#F5F2F8]/12 bg-[#F5F2F8]/[0.04] text-[#4CAFE1]">
                  <Icon
                    className="size-5"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </span>
                <div
                  className={cn(
                    skill.span === 'full' ? 'mt-5 sm:mt-0' : 'mt-8',
                  )}
                >
                  <p className="font-mono text-xs text-[#4CAFE1]">
                    {skill.name}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-[#F5F2F8]">
                    {skill.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-sm leading-6 text-[#AAA4B4]">
                    {skill.description}
                  </p>
                </div>
                <div
                  className={cn(
                    'mt-auto flex items-start gap-2 border-t border-[#F5F2F8]/10 pt-5 text-sm leading-6 text-[#D8D2E0]',
                    skill.span === 'full' &&
                      'mt-6 sm:mt-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6',
                  )}
                >
                  <Check
                    className="mt-1 size-4 shrink-0 text-[#4CAFE1]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <span>{skill.output}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionShell>
  );
}
