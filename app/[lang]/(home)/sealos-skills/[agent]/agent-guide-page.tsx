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
  TrackedLink,
} from '../shared';

function getLocalizedHubPath(lang: languagesType) {
  return lang === 'zh-cn' ? '/zh-cn/sealos-skills' : '/sealos-skills';
}

function getLocalizedAgentPath(agent: AgentGuide, lang: languagesType) {
  return lang === 'zh-cn' ? `/zh-cn${agent.path}` : agent.path;
}

const ANCHOR_ITEMS = [
  { label: 'Quick Start', href: '#quick-start' },
  { label: 'What gets verified', href: '#evidence' },
  { label: 'Example prompts', href: '#prompts' },
  { label: 'Resources', href: '#resources' },
] as const;

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
    <main className="-mt-24 min-w-0 overflow-x-clip bg-[#13111C] text-[#F5F2F8] selection:bg-[#4CAFE1] selection:text-[#0D1720]">
      <section className="relative pt-24 pb-12 sm:pb-16">
        <SectionShell className="pt-8 sm:pt-12 lg:pt-16">
          <a
            href={getLocalizedHubPath(lang)}
            className="inline-flex items-center gap-2 text-sm text-[#8F899B] transition-colors hover:text-[#F5F2F8] focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none motion-reduce:transition-none"
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
                <p className="font-mono text-xs font-semibold text-[#4CAFE1] uppercase">
                  {agent.name} + Sealos Skills
                </p>
              </div>
              <h1
                className="mt-7 text-[42px] leading-[46px] font-medium text-balance text-[#F5F2F8] lg:text-[56px] lg:leading-[60px]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Deploy to Sealos Cloud with {agent.name}
              </h1>
              <p className="mt-6 max-w-[58ch] text-base leading-7 text-[#AAA4B4] sm:text-lg sm:leading-8">
                {agent.productDescription}
              </p>
              <p className="mt-4 max-w-[62ch] text-sm leading-7 text-[#8F899B]">
                {agent.integrationDescription}
              </p>
              {agent.availabilityNote && (
                <div className="mt-6 flex max-w-2xl gap-3 border-l-2 border-[#4CAFE1] bg-[#191624] px-4 py-3 text-sm leading-6 text-[#C8C2D0]">
                  <Info
                    className="mt-0.5 size-4 shrink-0 text-[#4CAFE1]"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <p>{agent.availabilityNote}</p>
                </div>
              )}
            </div>

            <div className="min-w-0 overflow-hidden rounded-lg border border-[#F5F2F8]/12 bg-[#191624]">
              <div className="flex items-center justify-between gap-4 border-b border-[#F5F2F8]/10 px-5 py-4">
                <span className="font-mono text-xs font-semibold text-[#4CAFE1]">
                  {agent.installSummary}
                </span>
                <span className="text-xs text-[#777181]">
                  {agent.integration}
                </span>
              </div>
              <pre className="min-w-0 overflow-x-auto bg-[#100E18] p-5 font-mono text-xs leading-6 whitespace-pre text-[#D8D2E0]">
                <code>{agent.install}</code>
              </pre>
              <div className="grid gap-3 border-t border-[#F5F2F8]/10 p-5 sm:grid-cols-2">
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
              <p className="border-t border-[#F5F2F8]/10 px-5 py-4 font-mono text-xs leading-5 text-[#8F899B]">
                Start with{' '}
                <span className="text-[#BFE8F7]">{agent.invocation}</span>
              </p>
            </div>
          </div>
        </SectionShell>
      </section>

      <div className="sticky top-16 z-30 border-y border-[#F5F2F8]/10 bg-[#13111C]/95 backdrop-blur-md">
        <nav
          aria-label={`${agent.name} guide sections`}
          className="mx-auto flex max-w-[1180px] gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8"
        >
          {ANCHOR_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="min-h-9 shrink-0 rounded-md px-3 py-2 text-xs font-semibold text-[#8F899B] transition-colors hover:bg-[#F5F2F8]/[0.05] hover:text-[#F5F2F8] focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none motion-reduce:transition-none"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <SectionShell id="quick-start" className="py-16 sm:py-24">
        <SectionHeading
          eyebrow={`${agent.name} QUICK START`}
          title={`Install Sealos Skills in ${agent.name}`}
          description="Three steps take you from the supported install path to reviewable deployment evidence."
        />
        <ol className="mt-10 grid gap-3 lg:grid-cols-3">
          {agent.quickStart.map((step, index) => (
            <li
              key={step.title}
              className="flex min-h-[280px] min-w-0 flex-col rounded-lg border border-[#F5F2F8]/10 bg-[#191624] p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-xs font-semibold text-[#4CAFE1]">
                  STEP {index + 1}
                </span>
                <span className="flex size-7 items-center justify-center rounded-full border border-[#4CAFE1]/35 bg-[#4CAFE1]/10 font-mono text-xs text-[#BFE8F7]">
                  {index + 1}
                </span>
              </div>
              <h3 className="mt-8 text-xl font-semibold text-[#F5F2F8]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#AAA4B4]">
                {step.description}
              </p>
              {step.command && (
                <pre className="mt-auto min-w-0 overflow-x-auto border-t border-[#F5F2F8]/10 pt-5 font-mono text-xs leading-6 whitespace-pre-wrap text-[#BFE8F7]">
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
        <div className="mt-10 grid border-t border-[#F5F2F8]/10 md:grid-cols-2 lg:grid-cols-3">
          {DEPLOYMENT_EVIDENCE.map((item) => (
            <article
              key={item.title}
              className="flex min-h-[170px] gap-4 border-r border-b border-[#F5F2F8]/10 p-5 sm:p-6 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0"
            >
              <FileCheck2
                className="mt-0.5 size-5 shrink-0 text-[#4CAFE1]"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              <div>
                <h3 className="text-base font-semibold text-[#F5F2F8]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#8F899B]">
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
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {agent.prompts.map((prompt) => (
            <article
              key={prompt.id}
              className="flex min-h-[210px] min-w-0 flex-col rounded-lg border border-[#F5F2F8]/10 bg-[#191624] p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-[#F5F2F8]">
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
              <pre className="mt-6 min-w-0 overflow-x-auto border-t border-[#F5F2F8]/10 pt-5 font-mono text-xs leading-6 whitespace-pre-wrap text-[#C8C2D0]">
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
              className="mt-8 border-t border-[#F5F2F8]/10"
            >
              {agent.faq.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className="border-[#F5F2F8]/10"
                >
                  <AccordionTrigger className="gap-5 py-5 text-left text-base font-semibold text-[#F5F2F8] hover:no-underline focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none [&>svg]:text-[#7F798A] [&[data-state=open]>svg]:text-[#4CAFE1]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-sm leading-7 text-[#AAA4B4]">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div>
            <p className="font-mono text-xs font-semibold text-[#4CAFE1] uppercase">
              Resources
            </p>
            <div className="mt-5 border-t border-[#F5F2F8]/10">
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
                  className="flex min-h-14 items-center justify-between gap-4 border-b border-[#F5F2F8]/10 py-4 text-sm font-semibold text-[#D8D2E0] transition-colors hover:text-[#4CAFE1] focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none motion-reduce:transition-none"
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

            <p className="mt-12 font-mono text-xs font-semibold text-[#4CAFE1] uppercase">
              Related Agent guides
            </p>
            <div className="mt-5 border-t border-[#F5F2F8]/10">
              {relatedAgents.map((related) => (
                <a
                  key={related.id}
                  href={getLocalizedAgentPath(related, lang)}
                  className="flex min-h-16 items-center justify-between gap-4 border-b border-[#F5F2F8]/10 py-3 text-sm font-semibold text-[#D8D2E0] transition-colors hover:text-[#4CAFE1] focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none motion-reduce:transition-none"
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
        <div className="border-t border-[#F5F2F8]/10 pt-20 text-center sm:pt-28">
          <Check
            className="mx-auto size-8 text-[#4CAFE1]"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          <h2
            className="mx-auto mt-6 max-w-3xl text-[40px] leading-[46px] font-medium text-balance text-[#F5F2F8] sm:text-[52px] sm:leading-[58px]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Deploy with {agent.name}. Keep the evidence.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#AAA4B4] sm:text-lg">
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
    </main>
  );
}
