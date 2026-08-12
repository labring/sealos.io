import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  FileCheck2,
  Info,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { languagesType } from '@/lib/i18n';
import { CopyCommandButton } from '../copy-command';
import {
  AGENT_GUIDES,
  DEPLOYMENT_EVIDENCE,
  REPO_URL,
  type AgentGuide,
} from '../content';
import {
  AgentMark,
  SectionHeading,
  SectionShell,
  SkillsPageShell,
  TrackedLink,
} from '../shared';
import { AgentGuideNav } from './agent-guide-nav';

function getLocalizedHubPath(lang: languagesType) {
  return lang === 'zh-cn' ? '/zh-cn/sealos-skills' : '/sealos-skills';
}

function getLocalizedAgentPath(agent: AgentGuide, lang: languagesType) {
  return lang === 'zh-cn' ? `/zh-cn${agent.path}` : agent.path;
}

export function AgentGuidePage({
  agent,
  lang,
}: {
  agent: AgentGuide;
  lang: languagesType;
}) {
  const relatedAgents = agent.related
    .map((id) => AGENT_GUIDES.find((candidate) => candidate.id === id))
    .filter((candidate): candidate is AgentGuide => Boolean(candidate));

  return (
    <SkillsPageShell>
      <section className="relative pt-24 pb-12 sm:pb-16">
        <SectionShell className="pt-8 sm:pt-12 lg:pt-16">
          <a
            href={getLocalizedHubPath(lang)}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none motion-reduce:transition-none"
          >
            <ArrowLeft
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
            All Agent guides
          </a>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-start lg:gap-14">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4">
                <AgentMark icon={agent.icon} />
                <p className="font-mono text-xs font-semibold text-blue-400 uppercase">
                  {agent.name} + Sealos Skills
                </p>
              </div>
              <h1 className="mt-7 text-[42px] leading-[46px] font-medium tracking-normal text-balance text-zinc-100 lg:text-[56px] lg:leading-[60px]">
                Deploy to Sealos Cloud with {agent.name}
              </h1>
              <p className="mt-6 max-w-[58ch] text-base leading-7 text-pretty text-zinc-400 sm:text-lg sm:leading-8">
                {agent.productDescription}
              </p>
              <p className="mt-4 max-w-[62ch] text-sm leading-7 text-pretty text-zinc-500">
                {agent.integrationDescription}
              </p>
              {agent.availabilityNote && (
                <div className="mt-6 flex max-w-2xl gap-3 border-l-2 border-blue-500 bg-[#13151C] px-4 py-3 text-sm leading-6 text-zinc-300">
                  <Info
                    className="mt-0.5 size-4 shrink-0 text-blue-400"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <p>{agent.availabilityNote}</p>
                </div>
              )}
            </div>

            <div className="min-w-0 overflow-hidden rounded-lg border border-white/10 bg-[#101219] shadow-[0_28px_80px_rgba(3,7,18,0.28)]">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                <span className="font-mono text-xs font-semibold text-blue-400">
                  {agent.installSummary}
                </span>
                <span className="text-xs text-zinc-500">
                  {agent.integration}
                </span>
              </div>
              <pre className="min-w-0 overflow-x-auto bg-[#080A11] p-5 font-mono text-xs leading-7 whitespace-pre text-zinc-200 sm:p-6 sm:text-sm">
                <code>{agent.install}</code>
              </pre>
              <div className="grid gap-3 border-t border-white/10 p-5 sm:grid-cols-2">
                <CopyCommandButton
                  value={agent.install}
                  label="Copy install path"
                  showStatus
                  tone="accent"
                  tracking={{
                    id: `skills_agent_copy_${agent.id}`,
                    location: `sealos_skills_${agent.id}_hero`,
                    destination: `clipboard_${agent.id}_install`,
                  }}
                />
                <TrackedLink
                  href={REPO_URL}
                  tracking={{
                    id: agent.guideTrackingId,
                    location: `sealos_skills_${agent.id}_hero`,
                    destination: 'github_sealos_skills',
                  }}
                >
                  View source
                </TrackedLink>
              </div>
              <p className="border-t border-white/10 px-5 py-4 font-mono text-xs leading-5 text-zinc-500">
                Start with{' '}
                <span className="text-blue-300">{agent.invocation}</span>
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      <AgentGuideNav agentName={agent.name} />

      <SectionShell id="quick-start" className="py-16 sm:py-24">
        <SectionHeading
          eyebrow={`${agent.name} QUICK START`}
          title={`Install Sealos Skills in ${agent.name}`}
          description="Three steps take you from the supported install path to reviewable deployment evidence."
        />
        <ol
          className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 lg:grid-cols-3"
          data-agent-quick-start-grid
        >
          {agent.quickStart.map((step, index) => (
            <li
              key={step.title}
              className="flex min-h-[280px] min-w-0 flex-col bg-[#101219] p-5 transition-colors duration-200 hover:bg-[#161923] motion-reduce:transition-none sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs font-semibold text-blue-400">
                  STEP {index + 1}
                </span>
                <span className="flex size-7 items-center justify-center rounded-full border border-blue-400/35 bg-blue-400/10 font-mono text-xs text-blue-200">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-8 text-xl font-semibold tracking-normal text-zinc-100">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-pretty text-zinc-400">
                {step.description}
              </p>
              {step.command && (
                <pre className="mt-auto min-w-0 overflow-x-auto border-t border-white/10 pt-5 font-mono text-xs leading-6 whitespace-pre-wrap text-blue-300">
                  <code>{step.command}</code>
                </pre>
              )}
            </li>
          ))}
        </ol>
      </SectionShell>

      <SectionShell id="evidence" className="py-16 sm:py-24">
        <SectionHeading
          eyebrow="VERIFIED DEPLOYMENT"
          title="What Sealos Skills verifies"
          description="The workflow returns inspectable evidence from the real deployment and saves the target for the next update or Canvas inspection."
        />
        <div
          className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3"
          data-agent-evidence-grid
        >
          {DEPLOYMENT_EVIDENCE.map((item) => (
            <article
              key={item.title}
              className="flex min-h-[170px] gap-4 bg-[#101219] p-5 transition-colors duration-200 hover:bg-[#161923] motion-reduce:transition-none sm:p-6"
            >
              <FileCheck2
                className="mt-0.5 size-5 shrink-0 text-blue-400"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <div>
                <h3 className="text-base font-semibold text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-pretty text-zinc-500">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="prompts" className="py-16 sm:py-24">
        <SectionHeading
          eyebrow={`${agent.name} PROMPTS`}
          title="Start with a concrete cloud outcome"
          description={`Use these prompts in ${agent.name} after the install path is complete.`}
        />
        <div
          className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2"
          data-agent-prompt-grid
        >
          {agent.prompts.map((prompt) => (
            <article
              key={prompt.id}
              className="flex min-h-[210px] min-w-0 flex-col bg-[#101219] p-5 transition-colors duration-200 hover:bg-[#161923] motion-reduce:transition-none sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-zinc-100">
                  {prompt.label}
                </h3>
                <CopyCommandButton
                  value={prompt.prompt}
                  label="Copy prompt"
                  showStatus
                  tone="quiet"
                  tracking={{
                    id: `skills_agent_prompt_${agent.id}_${prompt.id}`,
                    location: `sealos_skills_${agent.id}_prompts`,
                    destination: `clipboard_${agent.id}_${prompt.id}`,
                  }}
                />
              </div>
              <pre className="mt-6 min-w-0 overflow-x-auto border-t border-white/10 pt-5 font-mono text-xs leading-6 whitespace-pre-wrap text-zinc-300">
                <code>{prompt.prompt}</code>
              </pre>
            </article>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="resources" className="py-16 sm:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="QUESTIONS"
              title={`${agent.name} installation FAQ`}
              description="Install location, invocation, and updates for this integration path."
            />
            <Accordion
              type="single"
              collapsible
              className="mt-8 border-t border-white/10"
            >
              {agent.faq.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className="border-white/10"
                >
                  <AccordionTrigger className="gap-5 py-5 text-left text-base font-semibold text-zinc-100 hover:no-underline focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none [&>svg]:text-zinc-500 [&[data-state=open]>svg]:text-blue-400">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-zinc-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div>
            <p className="font-mono text-xs font-semibold text-blue-400 uppercase">
              Resources
            </p>
            <div className="mt-5 border-t border-white/10">
              {[
                {
                  label: `${agent.name} documentation`,
                  href: agent.officialDocsUrl,
                },
                {
                  label: 'Sealos integration manifest',
                  href: agent.manifestUrl,
                },
                { label: 'Sealos Skills source', href: REPO_URL },
                {
                  label: `${agent.name} icon source`,
                  href: agent.iconSourceUrl,
                },
              ].map((resource) => (
                <a
                  key={resource.label}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-14 items-center justify-between gap-4 border-b border-white/10 py-4 text-sm font-semibold text-zinc-300 transition-colors hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none motion-reduce:transition-none"
                >
                  {resource.label}
                  <ExternalLink
                    className="size-4 shrink-0"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>

            <p className="mt-12 font-mono text-xs font-semibold text-blue-400 uppercase">
              Related Agent guides
            </p>
            <div className="mt-5 border-t border-white/10">
              {relatedAgents.map((related) => (
                <a
                  key={related.id}
                  href={getLocalizedAgentPath(related, lang)}
                  className="flex min-h-16 items-center justify-between gap-4 border-b border-white/10 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:text-blue-300 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none motion-reduce:transition-none"
                >
                  <span className="flex items-center gap-3">
                    <AgentMark icon={related.icon} />
                    {related.name}
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="py-20 sm:py-28">
        <div className="border-t border-white/10 pt-20 text-center sm:pt-28">
          <Check
            className="mx-auto size-8 text-blue-400"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          <h2 className="mx-auto mt-6 max-w-3xl text-[40px] leading-[46px] font-medium tracking-normal text-balance text-zinc-100 sm:text-[52px] sm:leading-[58px]">
            Deploy with {agent.name}. Keep the evidence.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
            Install Sealos Skills, run the first workflow, and review the live
            result before handoff.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CopyCommandButton
              value={agent.install}
              label="Copy install path"
              showStatus
              tone="accent"
              tracking={{
                id: agent.installTrackingId,
                location: `sealos_skills_${agent.id}_final`,
                destination: `clipboard_${agent.id}_install`,
              }}
            />
            <TrackedLink
              href={REPO_URL}
              tracking={{
                id: `skills_agent_source_${agent.id}`,
                location: `sealos_skills_${agent.id}_final`,
                destination: 'github_sealos_skills',
              }}
            >
              GitHub source
            </TrackedLink>
          </div>
        </div>
      </SectionShell>
    </SkillsPageShell>
  );
}
