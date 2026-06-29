'use client';

import { type ReactNode } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Github,
  Link2,
  Rocket,
  Search,
  User,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

import {
  DemoField,
  DemoStageShell,
  DeployButton,
  FormHeader,
  ModeSelectionScreen,
  SectionTitle,
  TypingCaret,
  screenTransition,
  useDemoPlayback,
  type CursorStep,
} from './deploy-demo-common';

type GithubScreen = 'mode' | 'form' | 'ready';
type GithubFieldId = 'repoUrl' | 'secret';

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
  repoUrl: 'github.com/sealos/demo-api',
  secret: 'sealos-demo-secret',
};

const githubSteps: GithubStep[] = [
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
    duration: 1500,
    screen: 'form',
    cursor: { x: 44, y: 60 },
    activeField: 'repoUrl',
    authorized: true,
    expanded: true,
    typed: { repoUrl: githubFinalValues.repoUrl },
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
    duration: 850,
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
    duration: 900,
    screen: 'ready',
    cursor: { x: 58, y: 58 },
    readyStage: 2,
    holdCursor: true,
  },
  {
    duration: 1300,
    screen: 'ready',
    cursor: { x: 47, y: 65 },
    readyStage: 3,
    activeField: 'secret',
    typed: { secret: githubFinalValues.secret },
  },
  {
    duration: 800,
    screen: 'ready',
    cursor: { x: 72, y: 65 },
    readyStage: 4,
    clickTarget: 'secretSubmit',
  },
  {
    duration: 900,
    screen: 'ready',
    cursor: { x: 72, y: 65 },
    readyStage: 5,
    holdCursor: true,
  },
  {
    duration: 1400,
    screen: 'ready',
    cursor: { x: 58, y: 44 },
    readyStage: 6,
    holdCursor: true,
  },
];

export function GitHubImportDemo() {
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
    getTargetId: getGithubStepTarget,
    steps: githubSteps,
  });
  const readyStage = reduceMotion ? 6 : step.readyStage;
  const repoUrl = reduceMotion
    ? githubFinalValues.repoUrl
    : getGithubFieldText('repoUrl', effectiveIndex, actionProgress);
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
              repoUrl={repoUrl}
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
  repoUrl,
}: {
  activeField?: GithubFieldId;
  authorizePressed: boolean;
  authorized: boolean;
  expanded: boolean;
  repoDeployPressed: boolean;
  repoUrl: string;
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
            Icon={Link2}
            title="Repository URL"
            description="Paste a repository URL directly."
          >
            <DemoField
              active={activeField === 'repoUrl'}
              placeholder="github.com/org/repository"
              target="repoUrl"
              value={repoUrl}
            />
          </CollapsiblePanel>

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
  return (
    <div
      data-ready-stage={readyStage}
      className="flex h-full flex-col overflow-hidden p-5"
    >
      <FormHeader
        Icon={Rocket}
        title="Will get ready soon.."
        description="This process may take 10-20 minutes, please do not leave and we will get everything done!"
      />

      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-white/[0.07] bg-[#1E2026] p-4">
        <div className="space-y-4">
          <TimelineStep
            status={readyStage >= 1 ? 'success' : 'running'}
            title="Prepare repository"
            description="Reading source tree and deployment metadata."
            visible={readyStage >= 0}
          />
          <TimelineStep
            status={
              readyStage < 2
                ? 'pending'
                : readyStage < 5
                  ? 'warning'
                  : readyStage < 6
                    ? 'running'
                    : 'success'
            }
            title="Required environment"
            description="AUTH_SECRET is required before the build can continue."
            visible={readyStage >= 1}
          >
            {readyStage >= 2 && (
              <div className="mt-3 grid grid-cols-[1fr_72px] gap-2">
                <label
                  className="flex h-8 min-w-0 items-center rounded-md border border-amber-400/50 bg-black/20 px-2.5 font-mono text-[11px] text-zinc-100 shadow-[0_0_0_3px_rgba(251,191,36,0.12)]"
                  data-demo-target="secret"
                >
                  <span className="min-w-0 truncate">
                    {secret || (
                      <span className="text-zinc-600">AUTH_SECRET</span>
                    )}
                    <TypingCaret visible={activeField === 'secret'} />
                  </span>
                </label>
                <button
                  data-demo-target="secretSubmit"
                  className={cn(
                    'h-8 rounded-md bg-blue-500 text-[11px] font-medium text-white',
                    readyStage >= 6 && 'bg-emerald-500',
                    submitPressed && 'bg-blue-400',
                  )}
                  type="button"
                >
                  {readyStage >= 6 ? 'Done' : 'Confirm'}
                </button>
              </div>
            )}
          </TimelineStep>
          <TimelineStep
            status={
              readyStage >= 5
                ? 'success'
                : readyStage >= 4
                  ? 'running'
                  : 'pending'
            }
            title="Build container"
            description="Installing dependencies and preparing runtime image."
            visible={readyStage >= 3}
          />
          <TimelineStep
            status={
              readyStage >= 6
                ? 'success'
                : readyStage >= 5
                  ? 'running'
                  : 'pending'
            }
            title="Deploy application"
            description="Provisioning network, domain, and live service."
            visible={readyStage >= 4}
          />
        </div>
      </div>
    </div>
  );
}

type TimelineStatus = 'pending' | 'running' | 'warning' | 'success';

function TimelineStep({
  children,
  description,
  status,
  title,
  visible,
}: {
  children?: ReactNode;
  description: string;
  status: TimelineStatus;
  title: string;
  visible: boolean;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={screenTransition}
        >
          <StatusDot status={status} />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-zinc-100">{title}</div>
            <p className="mt-1 text-[11px] leading-4 text-zinc-500">
              {description}
            </p>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatusDot({ status }: { status: TimelineStatus }) {
  const icon =
    status === 'success' ? (
      <CheckCircle2 className="size-4" aria-hidden />
    ) : status === 'warning' ? (
      <AlertTriangle className="size-4" aria-hidden />
    ) : (
      <span className="size-2 rounded-full bg-current" />
    );

  return (
    <span
      className={cn(
        'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border',
        status === 'pending' && 'border-zinc-700 text-zinc-600',
        status === 'running' &&
          'border-blue-400/30 bg-blue-500/10 text-blue-300',
        status === 'warning' &&
          'border-amber-400/30 bg-amber-500/10 text-amber-300',
        status === 'success' &&
          'border-emerald-400/30 bg-emerald-500/10 text-emerald-300',
      )}
    >
      {icon}
    </span>
  );
}
