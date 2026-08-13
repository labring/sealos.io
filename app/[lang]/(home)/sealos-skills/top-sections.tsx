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
import { AgentLogoRotator } from './agent-logo-rotator';
import {
  AGENT_GUIDES,
  CODEX_INSTALL_COMMAND,
  PAGE_COPY,
  PROOF_ITEMS,
  REPO_URL,
  SKILL_CATALOG,
  type SkillIconName,
} from './content';
import {
  AgentLogo,
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
      <SectionShell className="flex flex-col items-center text-center">
        <p className="font-mono text-xs font-semibold text-blue-400 uppercase">
          {PAGE_COPY.hero.eyebrow}
        </p>
        <h1 className="mt-5 max-w-5xl text-[42px] leading-[46px] font-medium tracking-normal text-balance text-zinc-100 lg:text-[56px] lg:leading-[60px]">
          <span className="sr-only">{PAGE_COPY.hero.title}</span>
          <span aria-hidden="true">
            Deploy from your{' '}
            <AgentLogoRotator icons={AGENT_GUIDES.map(({ icon }) => icon)} />
            <span className="-ml-2">.</span> See the proof.
          </span>
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-pretty text-zinc-400 sm:text-lg sm:leading-8">
          {PAGE_COPY.hero.description}
        </p>

        <div
          className="mt-8 w-full max-w-[860px] overflow-hidden rounded-lg border border-white/10 bg-[#101219] text-left shadow-[0_28px_80px_rgba(3,7,18,0.32)] sm:mt-12"
          data-skills-hero-command
        >
          <div className="flex min-h-14 items-center gap-4 border-b border-white/10 bg-[#13151C] px-4 sm:px-5">
            <span className="flex shrink-0 gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
              <span className="size-2.5 rounded-full bg-white/20" />
            </span>
            <span className="min-w-0 flex-1 font-mono text-[11px] font-semibold text-blue-400 sm:text-xs">
              {PAGE_COPY.hero.commandLabel}
            </span>
            <CopyCommandButton
              value={CODEX_INSTALL_COMMAND}
              label={PAGE_COPY.hero.primaryCta}
              showStatus
              tone="quiet"
              className="min-h-9 px-2.5 text-[11px] sm:px-3 sm:text-xs"
              tracking={{
                id: 'skills_hero_copy_codex_install',
                location: 'sealos_skills_hero',
                destination: 'clipboard_codex_install',
              }}
            />
          </div>
          <div className="bg-[#080A11] px-5 py-4 sm:px-8 sm:py-12">
            <pre className="min-w-0 overflow-x-auto font-mono text-xs leading-7 whitespace-pre text-zinc-200 sm:text-sm sm:leading-8">
              <code>{CODEX_INSTALL_COMMAND}</code>
            </pre>
          </div>
          <div className="border-t border-white/10 px-5 py-4 font-mono text-xs leading-5 text-zinc-400 sm:px-6">
            {PAGE_COPY.hero.invocation}
          </div>
        </div>

        <TrackedLink
          href={REPO_URL}
          className="mt-3 min-h-0 border-0 px-0 text-sm text-zinc-500 hover:bg-transparent hover:text-zinc-100 sm:mt-5"
          tracking={{
            id: 'skills_hero_view_github',
            location: 'sealos_skills_hero',
            destination: 'github_sealos_skills',
          }}
        >
          {PAGE_COPY.hero.secondaryCta}
        </TrackedLink>

        <nav
          aria-label="Jump to Agent guide"
          className="mt-6 flex w-full max-w-[620px] flex-wrap justify-center gap-2 sm:mt-11 sm:grid sm:grid-cols-9 sm:gap-3"
          data-agent-logo-nav
        >
          {AGENT_GUIDES.map((agent) => (
            <a
              key={agent.id}
              href={`#agent-${agent.id}`}
              aria-label={`Jump to ${agent.name} guide`}
              title={agent.name}
              className="group flex aspect-square w-[calc((100%_-_2rem)/5)] items-center justify-center rounded-md border border-white/10 bg-[#101219] transition-colors duration-200 hover:border-blue-400/60 hover:bg-[#161923] focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none motion-reduce:transition-none sm:w-auto"
              data-agent-logo-id={agent.id}
            >
              <AgentLogo
                icon={agent.icon}
                className="size-8 transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none sm:size-9"
              />
            </a>
          ))}
        </nav>

        <div
          className="mt-12 grid w-full grid-cols-2 overflow-hidden border-y border-white/10 sm:mt-14 lg:mt-20 lg:grid-cols-4"
          data-skills-proof-grid
        >
          {PROOF_ITEMS.map((proof) => (
            <div
              key={proof.label}
              className="min-w-0 border-r border-b border-white/10 px-4 py-5 sm:px-5 sm:py-6 lg:border-b-0 lg:last:border-r-0 [&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r [&:nth-child(n+3)]:border-b-0"
            >
              <p className="font-mono text-base font-semibold break-words text-zinc-100 tabular-nums sm:text-xl">
                {proof.value}
              </p>
              <p className="mt-1 text-xs leading-5 text-pretty text-zinc-500 sm:text-sm">
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
      <div
        className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4"
        data-skills-capability-grid
      >
        {SKILL_CATALOG.map((skill) => {
          const Icon = SKILL_ICONS[skill.icon];

          return (
            <article
              key={skill.id}
              className={cn(
                'flex min-h-[250px] flex-col p-5 transition-colors duration-200 hover:bg-[#161923] motion-reduce:transition-none sm:p-6',
                skill.span === 'wide' && 'lg:col-span-2',
                skill.span === 'full' && 'lg:col-span-4',
                skill.surface === 'accent' && 'bg-[#13151C]',
                skill.surface === 'panel' && 'bg-[#101219]',
                skill.surface === 'code' && 'bg-[#080A11]',
              )}
            >
              <div
                className={cn(
                  'flex h-full flex-col',
                  skill.span === 'full' &&
                    'sm:grid sm:grid-cols-[auto_1fr_0.8fr] sm:items-center sm:gap-6',
                )}
              >
                <span className="flex size-11 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] text-blue-400">
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
                  <p className="font-mono text-xs text-blue-400">
                    {skill.name}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold tracking-normal text-zinc-100">
                    {skill.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-sm leading-6 text-pretty text-zinc-400">
                    {skill.description}
                  </p>
                </div>
                <div
                  className={cn(
                    'mt-auto flex items-start gap-2 border-t border-white/10 pt-5 text-sm leading-6 text-zinc-300',
                    skill.span === 'full' &&
                      'mt-6 sm:mt-0 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6',
                  )}
                >
                  <Check
                    className="mt-1 size-4 shrink-0 text-blue-400"
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
