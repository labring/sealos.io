'use client';

import { useState, type KeyboardEvent } from 'react';
import { Check, FileCheck2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import {
  AGENT_TARGETS,
  PAGE_COPY,
  WORKFLOW_SCENARIOS,
  type WorkflowScenarioId,
} from './content';
import { CopyCommandButton } from './copy-command';
import { AgentMark, TrackedLink } from './shared';

type PrimaryInstallId = 'codex' | 'claude';
type AgentTarget = (typeof AGENT_TARGETS)[number];
type PrimaryInstallTarget = Extract<
  AgentTarget,
  { readonly id: PrimaryInstallId }
>;

const PRIMARY_INSTALL_IDS: readonly PrimaryInstallId[] = ['codex', 'claude'];

function isPrimaryInstallTarget(
  agent: AgentTarget,
): agent is PrimaryInstallTarget {
  return agent.id === 'codex' || agent.id === 'claude';
}

function handleTabKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  index: number,
  onSelect: (id: string) => void,
) {
  const tabList = event.currentTarget.parentElement;
  const tabs = Array.from(
    tabList?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
  );

  if (tabs.length === 0) return;

  let nextIndex: number | undefined;

  if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
  if (event.key === 'ArrowLeft') {
    nextIndex = (index - 1 + tabs.length) % tabs.length;
  }
  if (event.key === 'Home') nextIndex = 0;
  if (event.key === 'End') nextIndex = tabs.length - 1;
  if (nextIndex === undefined) return;

  event.preventDefault();
  const nextTab = tabs[nextIndex];
  onSelect(nextTab.dataset.tabId ?? '');
  nextTab.focus();
}

export function WorkflowTabs() {
  const [activeId, setActiveId] = useState<WorkflowScenarioId>('deploy');
  const activeScenario =
    WORKFLOW_SCENARIOS.find((scenario) => scenario.id === activeId) ??
    WORKFLOW_SCENARIOS[0];

  return (
    <div className="overflow-hidden rounded-lg border border-[#F5F2F8]/10 bg-[#15121E]">
      <div
        role="tablist"
        aria-label="Sealos Skills workflow examples"
        className="flex max-w-full gap-1 overflow-x-auto border-b border-[#F5F2F8]/10 bg-[#191624] p-2"
      >
        {WORKFLOW_SCENARIOS.map((scenario, index) => (
          <button
            key={scenario.id}
            type="button"
            role="tab"
            id={`workflow-tab-${scenario.id}`}
            aria-controls={`workflow-panel-${scenario.id}`}
            aria-selected={activeId === scenario.id}
            tabIndex={activeId === scenario.id ? 0 : -1}
            data-tab-id={scenario.id}
            onClick={() => setActiveId(scenario.id)}
            onKeyDown={(event) =>
              handleTabKeyDown(event, index, (id) =>
                setActiveId(id as WorkflowScenarioId),
              )
            }
            className={cn(
              'min-h-10 shrink-0 rounded-md px-4 text-sm font-semibold text-[#918B9B] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none motion-reduce:transition-none',
              activeId === scenario.id && 'bg-[#4CAFE1] text-[#0D1720]',
            )}
          >
            {scenario.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`workflow-panel-${activeScenario.id}`}
        aria-labelledby={`workflow-tab-${activeScenario.id}`}
        className="grid min-h-[430px] lg:grid-cols-[0.82fr_1.18fr]"
      >
        <div className="border-b border-[#F5F2F8]/10 p-5 sm:p-7 lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between gap-4">
            <span className="font-mono text-xs text-[#4CAFE1]">
              Your prompt
            </span>
            <CopyCommandButton
              value={activeScenario.prompt}
              label="Copy prompt"
              showStatus
              tone="quiet"
            />
          </div>
          <pre className="mt-5 min-w-0 overflow-x-auto rounded-md border border-[#F5F2F8]/10 bg-[#100E18] p-4 font-mono text-xs leading-6 whitespace-pre-wrap text-[#D8D2E0]">
            <code>{activeScenario.prompt}</code>
          </pre>
          <h3 className="mt-8 text-sm font-semibold text-[#F5F2F8]">
            What Sealos Skills does
          </h3>
          <ol className="mt-4 space-y-4">
            {activeScenario.action.map((action) => (
              <li
                key={action}
                className="flex gap-3 text-sm leading-6 text-[#AAA4B4]"
              >
                <Check
                  className="mt-1 size-4 shrink-0 text-[#4CAFE1]"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col p-5 sm:p-7">
          <div className="flex items-center gap-3 text-[#F5F2F8]">
            <FileCheck2
              className="size-5 text-[#4CAFE1]"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <h3 className="text-sm font-semibold">Evidence you get</h3>
          </div>
          <div className="mt-5 border-t border-[#F5F2F8]/10">
            {activeScenario.evidence.map((evidence) => (
              <div
                key={evidence}
                className="flex min-h-12 items-center gap-3 border-b border-[#F5F2F8]/8 font-mono text-xs text-[#C8C2D0]"
              >
                <span className="text-[#4CAFE1]">&gt;</span>
                <span>{evidence}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#F5F2F8]/10 pt-6">
            <span className="text-sm text-[#8F899B]">Verified result</span>
            <span className="flex items-center gap-2 rounded-sm border border-[#4CAFE1]/35 bg-[#4CAFE1]/10 px-3 py-2 text-sm font-semibold text-[#BFE8F7]">
              <Check className="size-4" strokeWidth={1.8} aria-hidden="true" />
              {activeScenario.result}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InstallTabs() {
  const [activeId, setActiveId] = useState<PrimaryInstallId>('codex');
  const primaryTargets = AGENT_TARGETS.filter(isPrimaryInstallTarget);
  const activeTarget = primaryTargets.find((agent) => agent.id === activeId)!;
  const moreTargets = AGENT_TARGETS.filter(
    (agent) => !PRIMARY_INSTALL_IDS.includes(agent.id as PrimaryInstallId),
  );

  return (
    <div className="overflow-hidden rounded-lg border border-[#F5F2F8]/10 bg-[#15121E]">
      <div
        role="tablist"
        aria-label="Sealos Skills install paths"
        className="flex max-w-full gap-1 overflow-x-auto border-b border-[#F5F2F8]/10 bg-[#191624] p-2"
      >
        {primaryTargets.map((agent, index) => (
          <button
            key={agent.id}
            type="button"
            role="tab"
            id={`install-tab-${agent.id}`}
            aria-controls={`install-panel-${agent.id}`}
            aria-selected={activeId === agent.id}
            tabIndex={activeId === agent.id ? 0 : -1}
            data-tab-id={agent.id}
            onClick={() => setActiveId(agent.id)}
            onKeyDown={(event) =>
              handleTabKeyDown(event, index, (id) =>
                setActiveId(id as PrimaryInstallId),
              )
            }
            className={cn(
              'flex min-h-11 shrink-0 items-center gap-2 rounded-md px-4 text-sm font-semibold text-[#918B9B] transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none motion-reduce:transition-none',
              activeId === agent.id && 'bg-[#4CAFE1] text-[#0D1720]',
            )}
          >
            {agent.name}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`install-panel-${activeId}`}
        aria-labelledby={`install-tab-${activeId}`}
        className="p-5 sm:p-8"
      >
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-w-0">
            <div className="flex items-center gap-4">
              <AgentMark icon={activeTarget.icon} />
              <div>
                <h3 className="text-lg font-semibold text-[#F5F2F8]">
                  {activeTarget.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-[#4CAFE1]">
                  {activeTarget.integration}
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-[#AAA4B4]">
              {activeTarget.installNote}
            </p>
            <pre className="mt-6 min-w-0 overflow-x-auto rounded-md border border-[#F5F2F8]/10 bg-[#100E18] p-4 font-mono text-xs leading-6 whitespace-pre text-[#D8D2E0]">
              <code>{activeTarget.install}</code>
            </pre>
            {'compatibilityCommand' in activeTarget &&
              activeTarget.compatibilityCommand && (
                <div className="mt-4 text-xs leading-6 text-[#8F899B]">
                  <span className="mr-2">Cross-host installer</span>
                  <code className="font-mono text-[#C8C2D0]">
                    {activeTarget.compatibilityCommand}
                  </code>
                </div>
              )}
            <p className="mt-5 font-mono text-sm text-[#4CAFE1]">
              Start with {activeTarget.invocation}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 lg:flex-col lg:items-end">
            <CopyCommandButton
              value={activeTarget.install}
              label={
                activeTarget.id === 'codex'
                  ? 'Install in Codex'
                  : 'Copy install'
              }
              showStatus
              tone="accent"
              className="min-w-[148px]"
              tracking={{
                id: activeTarget.installTrackingId,
                location: 'sealos_skills_install',
                destination: `clipboard_${activeTarget.id}_install`,
              }}
            />
            <TrackedLink
              href={activeTarget.guideHref}
              className="min-h-0 border-0 px-0 py-1 text-xs font-medium text-[#AAA4B4] hover:bg-transparent hover:text-[#F5F2F8]"
              tracking={{
                id: activeTarget.guideTrackingId,
                location: 'sealos_skills_install',
                destination: `github_sealos_skills_${activeTarget.id}`,
              }}
            >
              Open install guide
            </TrackedLink>
          </div>
        </div>
      </div>

      <div className="border-t border-[#F5F2F8]/10 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-[#F5F2F8]">
              {PAGE_COPY.install.moreTitle}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#8F899B]">
              {PAGE_COPY.install.moreDescription}
            </p>
          </div>
          <span className="font-mono text-xs text-[#4CAFE1]">
            {PAGE_COPY.install.moreCount}
          </span>
        </div>

        <Accordion
          type="single"
          collapsible
          className="mt-6 border-t border-[#F5F2F8]/10"
        >
          {moreTargets.map((agent) => (
            <AccordionItem
              key={agent.id}
              value={agent.id}
              className="border-[#F5F2F8]/10"
            >
              <AccordionTrigger className="gap-4 py-4 text-left hover:no-underline focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:outline-none [&>svg]:text-[#7F798A] [&[data-state=open]>svg]:text-[#4CAFE1]">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <AgentMark icon={agent.icon} />
                  <div className="min-w-0">
                    <p className="font-semibold text-[#F5F2F8]">{agent.name}</p>
                    <p className="mt-1 font-mono text-[11px] text-[#8F899B]">
                      {agent.integration}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6 pl-0 sm:pl-16">
                <p className="max-w-2xl text-sm leading-6 text-[#AAA4B4]">
                  {agent.installNote}
                </p>
                <pre className="mt-4 min-w-0 overflow-x-auto rounded-md border border-[#F5F2F8]/10 bg-[#100E18] p-4 font-mono text-xs leading-6 whitespace-pre text-[#D8D2E0]">
                  <code>{agent.install}</code>
                </pre>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                  <p className="font-mono text-xs text-[#4CAFE1]">
                    Start with {agent.invocation}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <CopyCommandButton
                      value={agent.install}
                      label="Copy install"
                      showStatus
                      tone="quiet"
                      tracking={{
                        id: agent.installTrackingId,
                        location: 'sealos_skills_install_more_paths',
                        destination: `clipboard_${agent.id}_install`,
                      }}
                    />
                    <TrackedLink
                      href={agent.guideHref}
                      className="min-h-0 border-0 px-0 py-1 text-xs font-medium text-[#AAA4B4] hover:bg-transparent hover:text-[#F5F2F8]"
                      tracking={{
                        id: agent.guideTrackingId,
                        location: 'sealos_skills_install_more_paths',
                        destination: `github_sealos_skills_${agent.id}`,
                      }}
                    >
                      Open install guide
                    </TrackedLink>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
