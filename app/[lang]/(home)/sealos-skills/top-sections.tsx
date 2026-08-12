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
  AGENT_TARGETS,
  CODEX_INSTALL_COMMAND,
  PAGE_COPY,
  PROOF_ITEMS,
  REPO_URL,
  SKILL_CATALOG,
  type SkillIconName,
} from './content';
import {
  AgentMark,
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
    <section id="skills" className="relative scroll-mt-24 pt-24 pb-14 sm:pb-20">
      <SectionShell>
        <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <div className="max-w-xl">
            <p className="mb-6 font-mono text-xs font-semibold text-[#4CAFE1] uppercase">
              {PAGE_COPY.hero.eyebrow}
            </p>
            <h1
              className="text-[42px] leading-[46px] font-medium text-balance text-[#F5F2F8] lg:text-[56px] lg:leading-[60px]"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {PAGE_COPY.hero.title}
            </h1>
            <p className="mt-6 max-w-[58ch] text-base leading-7 text-[#AAA4B4] sm:text-lg sm:leading-8">
              {PAGE_COPY.hero.description}
            </p>
            <div className="mt-8 grid grid-cols-[0.9fr_1.1fr] gap-3 sm:flex sm:flex-wrap">
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
            <div className="grid gap-3 border-b border-[#F5F2F8]/10 px-4 py-4 sm:grid-cols-[150px_1fr] sm:items-start sm:px-5">
              <span className="font-mono text-[11px] font-semibold text-[#4CAFE1] sm:text-xs">
                {PAGE_COPY.hero.commandLabel}
              </span>
              <pre className="min-w-0 overflow-x-auto font-mono text-[11px] leading-5 whitespace-pre text-[#D8D2E0] sm:text-xs">
                <code>{CODEX_INSTALL_COMMAND}</code>
              </pre>
            </div>
            <div className="bg-[#191624] p-2 sm:p-3">
              <Image
                src="/images/sealos-skills/codex-sealos.png"
                alt="Codex plugin picker showing Sealos Skills"
                width={2922}
                height={1888}
                priority
                sizes="(max-width: 1023px) 100vw, 680px"
                className="h-[140px] w-full rounded-md border border-[#F5F2F8]/10 object-contain sm:h-auto"
              />
            </div>
            <div className="hidden border-t border-[#F5F2F8]/10 px-4 py-3 font-mono text-xs text-[#AAA4B4] sm:block sm:px-5">
              {PAGE_COPY.hero.invocation}
            </div>
          </div>
        </div>

        <div className="mt-6 grid border-y border-[#F5F2F8]/10 sm:mt-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {PROOF_ITEMS.map((proof) => (
            <div
              key={proof.label}
              className="border-b border-[#F5F2F8]/10 px-4 py-6 last:border-b-0 sm:border-r lg:border-b-0 lg:[&:last-child]:border-r-0 sm:[&:nth-child(2)]:border-r-0 lg:[&:nth-child(2)]:border-r sm:[&:nth-child(3)]:border-b-0"
            >
              <p className="font-mono text-xl font-semibold text-[#F5F2F8]">
                {proof.value}
              </p>
              <p className="mt-1 text-sm text-[#8F899B]">{proof.label}</p>
            </div>
          ))}
        </div>
      </SectionShell>
    </section>
  );
}

export function AgentDirectorySection() {
  return (
    <SectionShell id="compatibility" className="py-16 sm:py-24">
      <SectionHeading
        title={PAGE_COPY.directory.title}
        description={PAGE_COPY.directory.description}
      />

      <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        {AGENT_TARGETS.map((agent, index) => (
          <article
            key={agent.id}
            className={cn(
              'flex min-h-[310px] min-w-0 flex-col rounded-lg border border-[#F5F2F8]/10 bg-[#191624] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-[#4CAFE1]/45 motion-reduce:transform-none motion-reduce:transition-none',
              index >= 8 && 'lg:col-span-2',
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <AgentMark icon={agent.icon} name={agent.name} />
              <span className="rounded-sm border border-[#F5F2F8]/12 px-2 py-1 font-mono text-[11px] text-[#AAA4B4]">
                {agent.integration}
              </span>
            </div>
            <p className="mt-5 text-xs text-[#7F798A]">{agent.vendor}</p>
            <h3 className="mt-1 text-xl font-semibold text-[#F5F2F8]">
              {agent.name}
            </h3>
            <p className="mt-3 font-mono text-xs text-[#4CAFE1]">
              {agent.installSummary}
            </p>
            <p className="mt-2 min-h-[42px] text-sm leading-6 text-[#AAA4B4]">
              {agent.installNote}
            </p>
            <pre className="mt-4 min-h-[64px] min-w-0 overflow-x-auto rounded-md border border-[#F5F2F8]/10 bg-[#100E18] p-3 font-mono text-[11px] leading-5 whitespace-pre text-[#D8D2E0]">
              <code>{agent.install}</code>
            </pre>
            <p className="mt-3 min-h-[40px] font-mono text-xs leading-5 text-[#4CAFE1]">
              Start with: {agent.invocation}
            </p>
            <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
              <CopyCommandButton
                value={agent.install}
                label="Copy install"
                showStatus
                tone="quiet"
                className="w-full"
                tracking={{
                  id: agent.copyTrackingId,
                  location: 'sealos_skills_agent_directory',
                  destination: `clipboard_${agent.id}_install`,
                }}
              />
              <TrackedLink
                href={agent.guideHref}
                className="min-h-9 w-full px-3 text-xs"
                tracking={{
                  id: agent.guideTrackingId,
                  location: 'sealos_skills_agent_directory',
                  destination: `github_sealos_skills_${agent.id}`,
                }}
              >
                Open guide
              </TrackedLink>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

export function SupportMatrixSection() {
  return (
    <SectionShell id="support" className="py-16 sm:py-24">
      <SectionHeading
        title={PAGE_COPY.support.title}
        description={PAGE_COPY.support.description}
      />
      <div
        className="mt-10 overflow-x-auto rounded-lg border border-[#F5F2F8]/10 bg-[#15121E] focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none"
        tabIndex={0}
        role="region"
        aria-label="Sealos Skills host support matrix"
      >
        <table className="w-full min-w-[1080px] border-collapse text-left">
          <caption className="sr-only">
            Installation and capability support for Sealos Skills agent hosts
          </caption>
          <thead className="bg-[#211D2B]">
            <tr>
              {[
                'Agent',
                'Integration',
                'Install path',
                'Start with',
                'Notes',
              ].map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  className={cn(
                    'border-b border-[#F5F2F8]/12 px-4 py-4 font-mono text-xs font-medium text-[#AAA4B4]',
                    index === 0 &&
                      'sticky left-0 z-[1] min-w-[160px] bg-[#211D2B]',
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AGENT_TARGETS.map((agent) => (
              <tr key={agent.id} className="group">
                <th
                  scope="row"
                  className="sticky left-0 z-[1] border-b border-[#F5F2F8]/8 bg-[#15121E] px-4 py-4 text-sm font-semibold text-[#F5F2F8] group-hover:bg-[#1A1723]"
                >
                  {agent.name}
                </th>
                <td className="border-b border-[#F5F2F8]/8 px-4 py-4 text-sm text-[#C3BDCC]">
                  {agent.integration}
                </td>
                <td className="border-b border-[#F5F2F8]/8 px-4 py-4 text-sm text-[#AAA4B4]">
                  <code className="block max-w-[420px] text-xs leading-5 whitespace-pre-wrap text-[#D8D2E0]">
                    {agent.install}
                  </code>
                  <span className="mt-2 block text-xs text-[#7F798A]">
                    {agent.installSummary}
                  </span>
                </td>
                <td className="border-b border-[#F5F2F8]/8 px-4 py-4 font-mono text-xs text-[#4CAFE1]">
                  {agent.invocation}
                </td>
                <td className="max-w-[320px] border-b border-[#F5F2F8]/8 px-4 py-4 text-sm leading-6 text-[#AAA4B4]">
                  {agent.installNote}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionShell>
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
