'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  CheckCircle2,
  Copy,
  MessageCircle,
  Rocket,
  TextSearch,
  X,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

import { screenTransition } from './deploy-demo-common';

type TimelineStatus = 'pending' | 'running' | 'success';

type TimelineEvent = {
  text: string;
  time?: string;
};

type TimelineSection = {
  events: TimelineEvent[];
  runningStage: number;
  successStage: number;
  title: string;
};

type TimelineResource = TimelineSection & {
  name: string;
  pendingSummary: string;
  runningSummary: string;
  successSummary: string;
};

export type DeploymentTimelineConfig = {
  doneLabel: string;
  doneStage: number;
  headerIcon: LucideIcon;
  runningLabel: string;
  sections: TimelineSection[];
  resources: TimelineResource[];
};

const eventTime = '2026-06-22...';

export const dockerImageTimeline: DeploymentTimelineConfig = {
  doneLabel: 'Completed - Completed',
  doneStage: 8,
  headerIcon: Rocket,
  runningLabel: 'Applying - Apply',
  sections: [
    {
      title: 'Validate settings',
      runningStage: 0,
      successStage: 1,
      events: [
        { time: eventTime, text: 'Validating direct deployment settings.' },
        { time: eventTime, text: 'Direct deployment settings are ready.' },
      ],
    },
    {
      title: 'Create resources',
      runningStage: 2,
      successStage: 3,
      events: [
        { time: eventTime, text: 'Applying deployment artifacts.' },
        {
          time: eventTime,
          text: 'Required deployment result resources are running.',
        },
      ],
    },
  ],
  resources: [
    {
      name: 'ap-jfwfzw',
      title: 'Container',
      pendingSummary: 'Container Required Pending, 0/1 replicas ready',
      runningSummary: 'Container Required Updating, 0/1 replicas ready',
      successSummary: 'Container Required 1/1 replicas ready',
      runningStage: 4,
      successStage: 6,
      events: [
        {
          time: eventTime,
          text: 'Container ap-jfwfzw result resource was created.',
        },
        {
          time: eventTime,
          text: 'Container workload is Updating with 0/1 ready replicas.',
        },
        { time: eventTime, text: 'Container workload has 1/1 ready replicas.' },
      ],
    },
    {
      name: 'Public access',
      title: 'Public access',
      pendingSummary: 'Public access Optional pending',
      runningSummary: 'Public access Optional provisioning',
      successSummary: 'Public access Optional accessible',
      runningStage: 7,
      successStage: 8,
      events: [{ time: eventTime, text: 'Public Address is accessible.' }],
    },
  ],
};

export const databaseTimeline: DeploymentTimelineConfig = {
  doneLabel: 'Completed - Completed',
  doneStage: 6,
  headerIcon: Rocket,
  runningLabel: 'Applying - Apply',
  sections: [
    {
      title: 'Validate settings',
      runningStage: 0,
      successStage: 1,
      events: [
        { time: eventTime, text: 'Validating direct deployment settings.' },
        { time: eventTime, text: 'Direct deployment settings are ready.' },
      ],
    },
    {
      title: 'Create resources',
      runningStage: 2,
      successStage: 3,
      events: [
        { time: eventTime, text: 'Applying deployment artifacts.' },
        { time: eventTime, text: 'Required database resources are running.' },
      ],
    },
  ],
  resources: [
    {
      name: 'db-detovp',
      title: 'DB',
      pendingSummary: 'DB Required Pending',
      runningSummary: 'DB Required Creating',
      successSummary: 'DB Required Running',
      runningStage: 4,
      successStage: 6,
      events: [
        {
          time: eventTime,
          text: 'DB Service db-detovp result resource was created.',
        },
        { time: eventTime, text: 'DB Service is Creating.' },
        { time: eventTime, text: 'DB Service is Running.' },
      ],
    },
  ],
};

export const templateTimeline: DeploymentTimelineConfig = {
  doneLabel: 'Completed - Completed',
  doneStage: 8,
  headerIcon: Rocket,
  runningLabel: 'Applying - Apply',
  sections: [
    {
      title: 'Prepare template',
      runningStage: 0,
      successStage: 1,
      events: [
        { time: eventTime, text: 'Preparing template deployment.' },
        { time: eventTime, text: 'Template deployment is ready.' },
      ],
    },
    {
      title: 'Create resources',
      runningStage: 2,
      successStage: 3,
      events: [
        { time: eventTime, text: 'Applying deployment artifacts.' },
        { time: eventTime, text: 'Required template resources are running.' },
      ],
    },
  ],
  resources: [
    {
      name: 'fastgpt-jwfjfh',
      title: 'Deployment',
      pendingSummary: 'Deployment Required Pending, 0/1 replicas ready',
      runningSummary: 'Deployment Required Progressing, 0/1 replicas ready',
      successSummary: 'Deployment Required Running, 1/1 replicas ready',
      runningStage: 4,
      successStage: 6,
      events: [
        {
          time: eventTime,
          text: 'Deployment fastgpt-jwfjfh result resource was created.',
        },
        {
          time: eventTime,
          text: 'Template workload is Progressing with 0/1 ready replicas.',
        },
        { time: eventTime, text: 'Template workload has 1/1 ready replicas.' },
      ],
    },
    {
      name: 'fastgpt-jwfjfh-plugin',
      title: 'Deployment',
      pendingSummary: 'Deployment Required Pending, 0/1 replicas ready',
      runningSummary: 'Deployment Required Progressing, 0/1 replicas ready',
      successSummary: 'Deployment Required Running, 1/1 replicas ready',
      runningStage: 7,
      successStage: 8,
      events: [
        {
          time: eventTime,
          text: 'Deployment fastgpt-jwfjfh-plugin result resource was created.',
        },
        {
          time: eventTime,
          text: 'Template workload is Progressing with 0/1 ready replicas.',
        },
        { time: eventTime, text: 'Template workload has 1/1 ready replicas.' },
      ],
    },
  ],
};

export function DeploymentTimeline({
  config,
  readyStage,
}: {
  config: DeploymentTimelineConfig;
  readyStage: number;
}) {
  const done = readyStage >= config.doneStage;
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [timelineY, setTimelineY] = useState(0);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!viewport || !content) return;

    const current = content.querySelector('[data-current-resource]');
    if (!(current instanceof HTMLElement)) {
      setTimelineY(0);
      return;
    }

    const targetBottom = current.offsetTop + current.offsetHeight;
    const maxUp = Math.min(0, viewport.clientHeight - content.scrollHeight);
    setTimelineY(
      Math.max(maxUp, Math.min(0, viewport.clientHeight - 16 - targetBottom)),
    );
  }, [readyStage]);

  return (
    <div
      data-ready-stage={readyStage}
      className="flex h-full flex-col overflow-hidden px-2 py-4"
    >
      <TimelineHeader Icon={config.headerIcon} />

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-blue-400 bg-white/[0.05] p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="flex h-full flex-col overflow-hidden">
          <div className="shrink-0 pb-3.5">
            <div className="mb-2 flex items-center gap-2">
              <Rocket className="size-3 text-zinc-100" aria-hidden="true" />
              <span className="text-xs font-medium text-zinc-100">
                Deployment Timeline
              </span>
            </div>

            <div className="mb-2 flex h-8 items-center justify-between rounded-md border border-white/10 bg-white/[0.05] px-3 text-xs text-zinc-400">
              <div className="flex min-w-0 items-center gap-2">
                <span>Task ID：</span>
                <span className="truncate font-mono">xJUVYucmToX5sd8F</span>
              </div>
              <Copy className="size-3 shrink-0 text-zinc-400" aria-hidden />
            </div>

            <TimelineTaskStatus
              done={done}
              doneLabel={config.doneLabel}
              runningLabel={config.runningLabel}
            />
          </div>

          <div
            ref={viewportRef}
            data-timeline-viewport
            className="relative min-h-0 flex-1 overflow-hidden pr-1"
          >
            <motion.div
              ref={contentRef}
              data-timeline-content
              className="space-y-3.5"
              animate={{ y: timelineY }}
              transition={screenTransition}
            >
              {config.sections.map((section) => (
                <TimelineStep
                  key={section.title}
                  readyStage={readyStage}
                  section={section}
                />
              ))}
              {config.resources.map((resource) => (
                <TimelineResourceCard
                  key={resource.name}
                  readyStage={readyStage}
                  resource={resource}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <TimelineActions />
    </div>
  );
}

function TimelineHeader({ Icon }: { Icon: LucideIcon }) {
  return (
    <div className="mb-4 flex shrink-0 items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-blue-300" aria-hidden="true" />
          <h3 className="text-base leading-none font-semibold text-zinc-100">
            Deployment Timeline
          </h3>
        </div>
        <p className="mt-2 text-xs leading-[18px] text-zinc-400">
          This process may take{' '}
          <span className="text-zinc-100">10-20 minutes</span>, please do not
          leave and we will get everything done!
        </p>
      </div>
      <button
        className="flex size-8 items-center justify-center rounded-lg text-zinc-400"
        type="button"
      >
        <X className="size-3" aria-hidden="true" />
      </button>
    </div>
  );
}

function TimelineTaskStatus({
  done,
  doneLabel,
  runningLabel,
}: {
  done: boolean;
  doneLabel: string;
  runningLabel: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 text-xs leading-[18px] text-zinc-400">
      <StatusDot status={done ? 'success' : 'running'} />
      {done ? doneLabel : runningLabel}
    </div>
  );
}

function TimelineStep({
  readyStage,
  section,
}: {
  readyStage: number;
  section: TimelineSection;
}) {
  const status = getStatus(
    readyStage,
    section.runningStage,
    section.successStage,
  );
  const visibleEvents = getVisibleEvents(section.events, status);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={screenTransition}
    >
      <div className="flex items-center gap-2">
        <StatusDot status={status} />
        <span className="min-w-0 truncate text-xs leading-[18px] text-zinc-100">
          {section.title}
        </span>
      </div>
      <TimelineEvents events={visibleEvents} />
    </motion.div>
  );
}

function TimelineResourceCard({
  readyStage,
  resource,
}: {
  readyStage: number;
  resource: TimelineResource;
}) {
  const status = getStatus(
    readyStage,
    resource.runningStage,
    resource.successStage,
  );
  if (status === 'pending') return null;

  const visibleEvents = getVisibleEvents(resource.events, status);
  const current = status === 'running';
  const summary =
    status === 'success'
      ? resource.successSummary
      : current
        ? resource.runningSummary
        : resource.pendingSummary;

  return (
    <motion.div
      data-current-resource={current ? true : undefined}
      className="rounded-lg border border-white/10 bg-white/[0.05] p-3.5"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={screenTransition}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <StatusDot status={status} />
          <span className="min-w-0 truncate text-xs font-medium text-zinc-100">
            {resource.name}
          </span>
        </div>
        <span className="text-zinc-500" aria-hidden>
          ^
        </span>
      </div>
      <p className="mb-2 truncate text-xs leading-[18px] text-zinc-400">
        {summary}
      </p>
      <TimelineEvents divider events={visibleEvents} />
    </motion.div>
  );
}

function TimelineEvents({
  divider = false,
  events,
}: {
  divider?: boolean;
  events: TimelineEvent[];
}) {
  if (events.length === 0) return null;

  return (
    <div
      className={cn(
        'mt-2 flex gap-1',
        divider && 'border-t border-white/10 pt-2',
      )}
    >
      <div className="ml-[5.5px] w-px shrink-0 bg-white/10" />
      <div className="space-y-1 text-[10.5px] leading-[14px]">
        <AnimatePresence initial={false}>
          {events.map((event, index) => (
            <motion.div
              key={event.text}
              className="flex min-w-0 gap-1"
              initial={{ opacity: 0, y: 4, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -2, filter: 'blur(2px)' }}
              transition={{
                ...screenTransition,
                delay: Math.min(index * 0.04, 0.12),
              }}
            >
              <span className="w-[62px] shrink-0 truncate text-zinc-500">
                {event.time ?? eventTime}
              </span>
              <span className="min-w-0 truncate text-zinc-100">
                {event.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function getStatus(
  readyStage: number,
  runningStage: number,
  successStage: number,
): TimelineStatus {
  if (readyStage >= successStage) return 'success';
  if (readyStage >= runningStage) return 'running';
  return 'pending';
}

function getVisibleEvents(events: TimelineEvent[], status: TimelineStatus) {
  if (status === 'pending') return [];
  if (status === 'running')
    return events.slice(0, Math.max(1, events.length - 1));
  return events;
}

function StatusDot({ status }: { status: TimelineStatus }) {
  if (status === 'success') {
    return <CheckCircle2 className="size-3 shrink-0 text-emerald-400" />;
  }

  return (
    <span
      className="flex size-3 shrink-0 items-center justify-center"
      aria-hidden
    >
      <span
        className={cn(
          'size-1.5 rounded-full ring-[1.5px]',
          status === 'running'
            ? 'bg-blue-500 ring-blue-500/30'
            : 'bg-zinc-500 ring-zinc-500/30',
        )}
      />
    </span>
  );
}

function TimelineActions() {
  return (
    <div className="mt-4 flex shrink-0 justify-end gap-1.5">
      <TimelineAction Icon={X}>Cancel Deployment</TimelineAction>
      <TimelineAction Icon={MessageCircle}>Discord Support</TimelineAction>
      <TimelineAction Icon={TextSearch}>AI Analysis</TimelineAction>
    </div>
  );
}

function TimelineAction({
  children,
  Icon,
}: {
  children: ReactNode;
  Icon: LucideIcon;
}) {
  return (
    <button
      className="flex h-8 items-center justify-center gap-2 rounded-lg bg-white/[0.05] px-3 text-xs font-medium text-zinc-100"
      type="button"
    >
      <Icon className="size-3" aria-hidden="true" />
      {children}
    </button>
  );
}
