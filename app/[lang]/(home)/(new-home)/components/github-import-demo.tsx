'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Copy,
  Github,
  MessageCircle,
  Rocket,
  Search,
  TextSearch,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

import {
  DemoStageShell,
  DeployButton,
  FormHeader,
  ModeSelectionScreen,
  SectionTitle,
  TypingCaret,
  screenTransition,
  shortenDemoSteps,
  useDemoPlayback,
  type CursorStep,
} from './deploy-demo-common';

type GithubScreen = 'mode' | 'form' | 'ready';
type GithubFieldId = 'secret';

type GithubStep = CursorStep & {
  screen: GithubScreen;
  activeField?: GithubFieldId;
  clickTarget?: 'githubCard' | 'authorize' | 'repoDeploy' | 'secretSubmit';
  typed?: Partial<Record<GithubFieldId, string>>;
  authorized?: boolean;
  expanded?: boolean;
  readyStage?: number;
};

const githubFinalValues: Record<GithubFieldId, string> = {
  secret: 'bG9naW46cGFzc3dvcmQ=',
};

const githubSteps: GithubStep[] = shortenDemoSteps<GithubStep>([
  { duration: 1200, screen: 'mode', cursor: { x: 44, y: 18 } },
  {
    duration: 900,
    screen: 'mode',
    cursor: { x: 45, y: 16 },
    clickTarget: 'githubCard',
  },
  { duration: 800, screen: 'form', cursor: { x: 58, y: 33 }, holdCursor: true },
  {
    duration: 900,
    screen: 'form',
    cursor: { x: 52, y: 38 },
    clickTarget: 'authorize',
  },
  {
    duration: 900,
    screen: 'form',
    cursor: { x: 52, y: 38 },
    authorized: true,
    holdCursor: true,
  },
  {
    duration: 900,
    screen: 'form',
    cursor: { x: 78, y: 74 },
    authorized: true,
    expanded: true,
    clickTarget: 'repoDeploy',
  },
  {
    duration: 700,
    screen: 'ready',
    cursor: { x: 58, y: 48 },
    authorized: true,
    expanded: true,
    readyStage: 0,
    holdCursor: true,
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 58, y: 48 },
    readyStage: 1,
    holdCursor: true,
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 58, y: 58 },
    readyStage: 2,
    holdCursor: true,
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 58, y: 58 },
    readyStage: 3,
    holdCursor: true,
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 58, y: 58 },
    readyStage: 4,
    holdCursor: true,
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 58, y: 58 },
    readyStage: 5,
    holdCursor: true,
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 58, y: 58 },
    readyStage: 6,
    holdCursor: true,
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 58, y: 60 },
    readyStage: 7,
    holdCursor: true,
  },
  {
    duration: 900,
    screen: 'ready',
    cursor: { x: 58, y: 60 },
    readyStage: 8,
    holdCursor: true,
  },
  {
    duration: 1400,
    screen: 'ready',
    cursor: { x: 47, y: 65 },
    readyStage: 9,
    activeField: 'secret',
    typed: { secret: githubFinalValues.secret },
  },
  {
    duration: 800,
    screen: 'ready',
    cursor: { x: 72, y: 65 },
    readyStage: 10,
    clickTarget: 'secretSubmit',
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 72, y: 65 },
    readyStage: 11,
    holdCursor: true,
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 58, y: 46 },
    readyStage: 12,
    holdCursor: true,
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 58, y: 46 },
    readyStage: 13,
    holdCursor: true,
  },
  {
    duration: 850,
    screen: 'ready',
    cursor: { x: 58, y: 46 },
    readyStage: 14,
    holdCursor: true,
  },
  {
    duration: 1600,
    screen: 'ready',
    cursor: { x: 58, y: 46 },
    readyStage: 15,
    holdCursor: true,
  },
]);

export const githubImportDemoDurationMs = githubSteps.reduce(
  (total, step) => total + step.duration,
  0,
);

export function GitHubImportDemo({ active = true }: { active?: boolean }) {
  const {
    actionProgress,
    actionReady,
    cursorPosition,
    effectiveIndex,
    hoverReady,
    reduceMotion,
    stageRef,
    step,
    targetId,
  } = useDemoPlayback({
    active,
    getTargetId: getGithubStepTarget,
    steps: githubSteps,
  });
  const readyStage = reduceMotion ? 15 : step.readyStage;
  const secret = reduceMotion
    ? githubFinalValues.secret
    : getGithubFieldText('secret', effectiveIndex, actionProgress);
  const activeField = actionReady
    ? step.activeField
    : getPreviousGithubField(effectiveIndex);

  return (
    <DemoStageShell
      activeSidebar="github"
      cursorPosition={cursorPosition}
      dataAttribute="data-github-import-demo"
      hideProjects={step.screen === 'ready'}
      maskVisible={!active}
      reduceMotion={reduceMotion}
      showGithubTabs={step.screen === 'ready'}
      stageRef={stageRef}
      step={step}
    >
      <AnimatePresence mode="wait">
        {step.screen === 'mode' ? (
          <motion.div
            key="github-mode"
            className="h-full"
            initial={{ opacity: 0, x: -16, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
            transition={screenTransition}
          >
            <ModeSelectionScreen
              activeCard="GitHub"
              pressed={hoverReady && step.clickTarget === 'githubCard'}
            />
          </motion.div>
        ) : step.screen === 'form' ? (
          <motion.div
            key="github-form"
            className="h-full"
            initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
            transition={screenTransition}
          >
            <GithubImportForm
              activeField={activeField}
              authorized={Boolean(step.authorized)}
              expanded={Boolean(step.expanded)}
              authorizePressed={actionReady && step.clickTarget === 'authorize'}
              repoDeployPressed={
                actionReady && step.clickTarget === 'repoDeploy'
              }
            />
          </motion.div>
        ) : (
          <motion.div
            key="github-ready"
            className="h-full"
            initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
            transition={screenTransition}
          >
            <GithubReadyScreen
              activeField={activeField}
              readyStage={readyStage ?? 0}
              secret={secret}
              submitPressed={actionReady && step.clickTarget === 'secretSubmit'}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </DemoStageShell>
  );
}

function getGithubFieldText(
  field: GithubFieldId,
  index: number,
  progress: number,
) {
  const step = githubSteps[index];
  const target = getLatestGithubFieldValue(field, index);

  if (step.activeField !== field || step.typed?.[field] === undefined) {
    return target;
  }

  const previous = getLatestGithubFieldValue(field, index - 1);
  const next = step.typed[field] ?? '';
  const localProgress = Math.min(1, Math.max(0, progress));

  if (next.startsWith(previous)) {
    const added = next.slice(previous.length);
    return previous + added.slice(0, Math.round(added.length * localProgress));
  }

  return next.slice(0, Math.round(next.length * localProgress));
}

function getLatestGithubFieldValue(field: GithubFieldId, index: number) {
  for (let i = index; i >= 0; i -= 1) {
    const value = githubSteps[i]?.typed?.[field];
    if (value !== undefined) return value;
  }

  return '';
}

function getPreviousGithubField(index: number) {
  for (let i = index - 1; i >= 0; i -= 1) {
    const field = githubSteps[i]?.activeField;
    if (field) return field;
  }
}

function getGithubStepTarget(step: GithubStep) {
  if (step.clickTarget) return step.clickTarget;
  if (step.activeField) return step.activeField;
}

function GithubImportForm({
  activeField,
  authorizePressed,
  authorized,
  expanded,
  repoDeployPressed,
}: {
  activeField?: GithubFieldId;
  authorizePressed: boolean;
  authorized: boolean;
  expanded: boolean;
  repoDeployPressed: boolean;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden p-5">
      <FormHeader
        Icon={Github}
        title="Create New Project"
        description="Connect GitHub and choose a repository to deploy."
      />

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="space-y-3">
          <GithubPanel>
            <SectionTitle
              Icon={User}
              title="GitHub Account"
              description="Authorize access before selecting a repository."
            />
            <button
              data-demo-target="authorize"
              className={cn(
                'mt-3 flex h-9 w-full items-center justify-center gap-2 rounded-lg text-xs font-medium',
                authorized
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-blue-500 text-white shadow-lg shadow-blue-500/20',
                authorizePressed && 'bg-blue-400 text-white',
              )}
              type="button"
            >
              {authorized ? (
                <CheckCircle2 className="size-4" aria-hidden />
              ) : (
                <Github className="size-4" aria-hidden />
              )}
              {authorized ? 'Authorized' : 'Authorize GitHub'}
            </button>
          </GithubPanel>

          <CollapsiblePanel
            expanded={expanded}
            Icon={Search}
            title="Repository"
            description="Choose from repositories available to this account."
          >
            <div className="space-y-2">
              {['sealos/demo-api', 'sealos/cloud-ui'].map((repo, index) => (
                <div
                  key={repo}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-xs font-medium text-zinc-100">
                      {repo}
                    </div>
                    <div className="mt-1 text-[10px] text-zinc-500">
                      Updated {index === 0 ? '2m' : '1h'} ago
                    </div>
                  </div>
                  {index === 0 ? (
                    <DeployButton
                      pressed={repoDeployPressed}
                      target="repoDeploy"
                    />
                  ) : (
                    <button
                      className="h-8 rounded-lg bg-white/[0.05] px-3 text-[11px] font-medium text-zinc-500"
                      type="button"
                    >
                      Deploy
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CollapsiblePanel>
        </div>
      </div>
    </div>
  );
}

function GithubPanel({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/[0.07] bg-[#1E2026] p-3">
      {children}
    </section>
  );
}

function CollapsiblePanel({
  children,
  description,
  expanded,
  Icon,
  title,
}: {
  children: ReactNode;
  description: string;
  expanded: boolean;
  Icon: LucideIcon;
  title: string;
}) {
  return (
    <section
      className={cn(
        'rounded-lg border p-3 transition-colors',
        expanded
          ? 'border-white/[0.07] bg-[#1E2026]'
          : 'border-white/[0.05] bg-white/[0.035]',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <SectionTitle Icon={Icon} title={title} description={description} />
        <ChevronDown
          className={cn(
            'mt-1 size-3.5 shrink-0 text-zinc-500 transition-transform',
            expanded && 'rotate-180',
          )}
          aria-hidden
        />
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="mt-3 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={screenTransition}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function GithubReadyScreen({
  activeField,
  readyStage,
  secret,
  submitPressed,
}: {
  activeField?: GithubFieldId;
  readyStage: number;
  secret: string;
  submitPressed: boolean;
}) {
  const blocked = readyStage >= 8 && readyStage < 11;
  const done = readyStage >= 15;
  const secretValue = readyStage >= 11 ? maskSecret(secret) : secret;
  const timelineViewportRef = useRef<HTMLDivElement>(null);
  const timelineContentRef = useRef<HTMLDivElement>(null);
  const [timelineY, setTimelineY] = useState(0);

  useLayoutEffect(() => {
    const viewport = timelineViewportRef.current;
    const content = timelineContentRef.current;
    if (!viewport || !content) return;

    if (!blocked) {
      setTimelineY(0);
      return;
    }

    const target = content.querySelector('[data-timeline-config-form]');
    if (!(target instanceof HTMLElement)) return;

    const targetBottom = target.offsetTop + target.offsetHeight;
    const maxUp = Math.min(0, viewport.clientHeight - content.scrollHeight);
    setTimelineY(
      Math.max(maxUp, Math.min(0, viewport.clientHeight - 16 - targetBottom)),
    );
  }, [activeField, blocked, readyStage]);

  return (
    <div
      data-ready-stage={readyStage}
      className="flex h-full flex-col overflow-hidden px-2 py-4"
    >
      <TimelineHeader />

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

            <TaskStatus blocked={blocked} done={done} />
          </div>

          <div
            ref={timelineViewportRef}
            data-timeline-viewport
            className="relative min-h-0 flex-1 overflow-hidden pr-1"
          >
            <motion.div
              ref={timelineContentRef}
              data-timeline-content
              className="space-y-3.5"
              animate={{ y: timelineY }}
              transition={screenTransition}
            >
              <TimelineStep
                events={[
                  'Preparing deploy runtime.',
                  'Deployment workspace is ready.',
                ]}
                status={getStepStatus(readyStage, 0, 1, 2)}
                title="Prepare workspace"
              />
              <TimelineStep
                events={[
                  'Preparing deploy runtime.',
                  'Repository analysis is complete.',
                ]}
                status={getStepStatus(readyStage, 3, 4, 5)}
                title="Analyze repository"
              />
              <TimelineStep
                events={[
                  'Deployment output files are ready.',
                  'Generated Sealos template deployment artifact.',
                  'Deployment requires 1 configuration values.',
                ]}
                status={getGenerateStatus(readyStage)}
                title="Generate deployment"
              >
                <AnimatePresence initial={false}>
                  {blocked && (
                    <motion.div
                      data-timeline-config-form
                      className="mt-2.5 rounded-lg border border-white/10 bg-white/[0.05] p-3.5"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={screenTransition}
                    >
                      <div className="mb-3 flex items-center gap-2">
                        <AlertTriangle
                          className="size-3 text-amber-300"
                          aria-hidden
                        />
                        <span className="text-xs font-medium text-zinc-100">
                          Deployment configuration
                        </span>
                      </div>
                      <p className="mb-3 text-xs leading-[18px] text-zinc-400">
                        Required template values are missing. Submit them to
                        continue this deployment.
                      </p>
                      <label className="block text-xs text-zinc-100">
                        dataforseo_api_key{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <p className="mt-1.5 text-xs leading-[18px] text-zinc-400">
                        Base64-encoded DataForSEO login:password API credential.
                      </p>
                      <label
                        data-demo-target="secret"
                        className={cn(
                          'mt-2 flex h-8 min-w-0 items-center rounded-md border bg-white/[0.05] px-3 text-xs text-zinc-400',
                          activeField === 'secret'
                            ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.14)]'
                            : 'border-white/10',
                        )}
                      >
                        <span className="min-w-0 truncate">
                          {secretValue || 'Placeholder'}
                          <TypingCaret visible={activeField === 'secret'} />
                        </span>
                      </label>
                      <button
                        data-demo-target="secretSubmit"
                        className={cn(
                          'mt-3 flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 text-xs font-medium text-white',
                          submitPressed && 'bg-blue-400',
                        )}
                        type="button"
                      >
                        <Rocket className="size-3" aria-hidden />
                        Continue Deployment
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TimelineStep>
              <TimelineStep
                events={[
                  'Build container image.',
                  'Provision runtime resources.',
                  'Public endpoint is online.',
                ]}
                status={getStepStatus(readyStage, 13, 14, 15)}
                title="Create resources"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <TimelineActions />
    </div>
  );
}

function TimelineHeader() {
  return (
    <div className="mb-4 flex shrink-0 items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Github className="size-4 text-blue-300" aria-hidden="true" />
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

function maskSecret(secret: string) {
  if (!secret) return '';
  return `${secret.slice(0, 7)}••••••${secret.slice(-4)}`;
}

type TimelineStatus = 'pending' | 'running' | 'warning' | 'success';

function getStepStatus(
  readyStage: number,
  idleStage: number,
  runningStage: number,
  successStage: number,
): TimelineStatus {
  if (readyStage >= successStage) return 'success';
  if (readyStage >= runningStage) return 'running';
  if (readyStage >= idleStage) return 'pending';
  return 'pending';
}

function getGenerateStatus(readyStage: number): TimelineStatus {
  if (readyStage >= 12) return 'success';
  if (readyStage >= 11) return 'running';
  if (readyStage >= 8) return 'warning';
  if (readyStage >= 7) return 'running';
  if (readyStage >= 6) return 'pending';
  return 'pending';
}

function TimelineStep({
  children,
  events,
  status,
  title,
}: {
  children?: ReactNode;
  events: string[];
  status: TimelineStatus;
  title: string;
}) {
  const visibleEvents = getVisibleEvents(events, status);

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
          {title}
        </span>
      </div>

      {visibleEvents.length > 0 && (
        <div className="mt-2 flex gap-1">
          <div className="ml-[5.5px] w-px shrink-0 bg-white/10" />
          <div className="space-y-1 text-[10.5px] leading-[14px]">
            <AnimatePresence initial={false}>
              {visibleEvents.map((event, index) => (
                <motion.div
                  key={event}
                  className="flex min-w-0 gap-1"
                  initial={{ opacity: 0, y: 4, filter: 'blur(3px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -2, filter: 'blur(2px)' }}
                  transition={{
                    ...screenTransition,
                    delay: Math.min(index * 0.04, 0.12),
                  }}
                >
                  <span className="w-[48px] shrink-0 truncate text-zinc-500">
                    {getEventTime(title, event)}
                  </span>
                  <span className="min-w-0 truncate text-zinc-100">
                    {event}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
}

function getVisibleEvents(events: string[], status: TimelineStatus) {
  if (status === 'pending') return [];
  if (status === 'running')
    return events.slice(0, Math.max(1, events.length - 1));
  return events;
}

function getEventTime(title: string, event: string) {
  const times: Record<string, string[]> = {
    'Prepare workspace': ['09:41:04', '09:41:09'],
    'Analyze repository': ['09:41:16', '09:41:22'],
    'Generate deployment': ['09:41:31', '09:41:38', '09:41:44'],
    'Create resources': ['09:42:03', '09:42:15', '09:42:27'],
  };
  const index =
    title === 'Generate deployment'
      ? [
          'Deployment output files are ready.',
          'Generated Sealos template deployment artifact.',
          'Deployment requires 1 configuration values.',
        ].indexOf(event)
      : title === 'Create resources'
        ? [
            'Build container image.',
            'Provision runtime resources.',
            'Public endpoint is online.',
          ].indexOf(event)
        : event.includes('complete') || event.includes('ready.')
          ? 1
          : 0;

  return times[title]?.[index] ?? '09:41:00';
}

function StatusDot({ status }: { status: TimelineStatus }) {
  if (status === 'success') {
    return <CheckCircle2 className="size-3 shrink-0 text-emerald-400" />;
  }

  if (status === 'warning') {
    return <AlertTriangle className="size-3 shrink-0 text-yellow-400" />;
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
            ? 'bg-green-500 ring-green-500/30'
            : 'bg-blue-500 ring-blue-500/30',
        )}
      />
    </span>
  );
}

function TaskStatus({ blocked, done }: { blocked: boolean; done: boolean }) {
  const label = done
    ? 'Done - Publish-Service'
    : blocked
      ? 'Blocked - Conigure'
      : 'Running - Generate-Artifacts';

  return (
    <div className="flex shrink-0 items-center gap-2 text-xs leading-[18px] text-zinc-400">
      {blocked ? (
        <StatusDot status="warning" />
      ) : done ? (
        <StatusDot status="success" />
      ) : (
        <StatusDot status="running" />
      )}
      {label}
    </div>
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
