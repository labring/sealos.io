'use client';

import { useState, type KeyboardEvent } from 'react';
import { Check, FileCheck2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WORKFLOW_SCENARIOS, type WorkflowScenarioId } from './content';
import { CopyCommandButton } from './copy-command';

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
