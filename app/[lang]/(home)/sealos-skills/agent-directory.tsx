import { ArrowRight, Terminal } from 'lucide-react';
import type { languagesType } from '@/lib/i18n';
import { CopyCommandButton } from './copy-command';
import {
  AGENT_GUIDES,
  PAGE_COPY,
  SKILLS_SH_TARGET,
  type AgentGuide,
} from './content';
import {
  AgentMark,
  AnchorAlias,
  SectionHeading,
  SectionShell,
  TrackedLink,
} from './shared';

function getLocalizedAgentPath(agent: AgentGuide, lang: languagesType) {
  return lang === 'zh-cn' ? `/zh-cn${agent.path}` : agent.path;
}

export function AgentDirectorySection({ lang }: { lang: languagesType }) {
  return (
    <SectionShell id="install" className="pt-4 pb-16 sm:py-24">
      <AnchorAlias id="compatibility" />
      <AnchorAlias id="support" />
      <SectionHeading
        eyebrow={PAGE_COPY.install.eyebrow}
        title={PAGE_COPY.install.title}
        description={PAGE_COPY.install.description}
      />
      <p className="mt-5 font-mono text-xs text-[#4CAFE1]">
        {PAGE_COPY.install.proof}
      </p>

      <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {AGENT_GUIDES.map((agent) => (
          <article
            key={agent.id}
            className="group flex min-h-[276px] flex-col rounded-lg border border-[#F5F2F8]/10 bg-[#191624] p-5 transition-colors duration-200 hover:border-[#4CAFE1]/45 motion-reduce:transition-none sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <AgentMark icon={agent.icon} />
              <span className="font-mono text-[11px] text-[#777181]">
                {agent.integration}
              </span>
            </div>
            <div className="mt-7">
              <p className="text-xs font-medium text-[#8F899B]">
                {agent.vendor}
              </p>
              <h3 className="mt-1 text-xl font-semibold text-[#F5F2F8]">
                {agent.name}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#AAA4B4]">
                {agent.installNote}
              </p>
            </div>
            <TrackedLink
              href={getLocalizedAgentPath(agent, lang)}
              className="mt-auto min-h-0 justify-start border-0 px-0 pt-7 pb-0 text-sm text-[#BFE8F7] hover:bg-transparent"
              tracking={{
                id: `skills_agent_guide_${agent.id}`,
                location: 'sealos_skills_agent_directory',
                destination: `sealos_skills_${agent.id}`,
              }}
            >
              View {agent.name} guide
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </TrackedLink>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 border-y border-[#F5F2F8]/10 py-7 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex min-w-0 gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md border border-[#F5F2F8]/12 bg-[#F5F2F8]/[0.04] text-[#D8D2E0]">
            <Terminal className="size-5" strokeWidth={1.7} aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-[#F5F2F8]">
              {PAGE_COPY.install.distributionTitle}
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8F899B]">
              {PAGE_COPY.install.distributionDescription} Start with{' '}
              <code className="font-mono text-[#BFE8F7]">
                {SKILLS_SH_TARGET.invocation}
              </code>
              .
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <CopyCommandButton
            value={SKILLS_SH_TARGET.install}
            label="Copy skills.sh install"
            showStatus
            tracking={{
              id: SKILLS_SH_TARGET.installTrackingId,
              location: 'sealos_skills_distribution',
              destination: 'clipboard_skills_sh_install',
            }}
          />
          <TrackedLink
            href={SKILLS_SH_TARGET.guideHref}
            tracking={{
              id: SKILLS_SH_TARGET.guideTrackingId,
              location: 'sealos_skills_distribution',
              destination: 'github_sealos_skills_skills_sh',
            }}
          >
            Open skills.sh guide
          </TrackedLink>
        </div>
      </div>
    </SectionShell>
  );
}
