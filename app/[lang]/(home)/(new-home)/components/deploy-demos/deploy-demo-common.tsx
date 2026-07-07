'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Brain,
  ChevronDown,
  Container,
  Database,
  Github,
  MoreHorizontal,
  PanelRightClose,
  PanelsTopLeft,
  Pin,
  Plus,
  Rocket,
  Search,
  SendHorizontal,
  SquareTerminal,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { LayoutGroup, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

export type CursorStep = {
  cursor: { x: number; y: number };
  clickTarget?: string;
  duration: number;
  holdCursor?: boolean;
};

const DEMO_STEP_DURATION_SCALE = 0.42;

export const CURSOR_SETTLE_MS = 240;
export const HOVER_SETTLE_MS = CURSOR_SETTLE_MS + 80;
export const SELECT_SETTLE_MS = HOVER_SETTLE_MS + 140;

export const screenTransition = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1],
} as const;

export function shortenDemoSteps<TStep extends CursorStep>(
  steps: TStep[],
): TStep[] {
  return steps.map((step) => ({
    ...step,
    duration: Math.max(
      80,
      Math.round(step.duration * DEMO_STEP_DURATION_SCALE),
    ),
  }));
}

const inertDemoProps = {
  'aria-hidden': true,
  inert: '' as unknown as boolean,
} as const;

export function getElementScale(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return {
    x: rect.width / element.offsetWidth || 1,
    y: rect.height / element.offsetHeight || 1,
  };
}

const modeCards = [
  {
    title: 'GitHub',
    description: 'Import repository from URL or GitHub authorization.',
    Icon: Github,
    target: 'githubCard',
  },
  {
    title: 'Templates',
    description: 'Quickly import from application templates.',
    Icon: PanelsTopLeft,
    target: 'templateCard',
  },
  {
    title: 'Docker Image',
    description: 'Create and run a project using an existing image.',
    Icon: Container,
    target: 'dockerCard',
  },
  {
    title: 'Database',
    description: 'Set up a database project or data service first.',
    Icon: Database,
    target: 'databaseCard',
  },
];

export function useDemoPlayback<TStep extends CursorStep>({
  active = true,
  getTargetId,
  steps,
}: {
  active?: boolean;
  getTargetId: (step: TStep) => string | undefined;
  steps: TStep[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>();
  const reduceMotion = mounted && Boolean(prefersReducedMotion);
  const effectiveIndex = reduceMotion ? steps.length - 1 : stepIndex;
  const step = steps[effectiveIndex];
  const targetId = getTargetId(step);
  const actionProgress = reduceMotion
    ? 1
    : getActionProgress(progress, step.duration);
  const actionReady =
    reduceMotion || progress * step.duration >= CURSOR_SETTLE_MS;
  const hoverReady =
    reduceMotion || progress * step.duration >= HOVER_SETTLE_MS;
  const selectReady =
    reduceMotion || progress * step.duration >= SELECT_SETTLE_MS;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active && !reduceMotion) {
      setStepIndex(0);
      setProgress(0);
    }
  }, [active, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !active) return;

    const startedAt = performance.now();
    const duration = steps[stepIndex].duration;
    setProgress(0);

    const interval = window.setInterval(() => {
      setProgress(Math.min(1, (performance.now() - startedAt) / duration));
    }, 50);
    const timeout = window.setTimeout(() => {
      setProgress(0);
      setStepIndex((index) => (index + 1) % steps.length);
    }, duration);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [active, reduceMotion, stepIndex, steps]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let frame = 0;

    const measureCursor = () => {
      frame = window.requestAnimationFrame(() => {
        const stageRect = stage.getBoundingClientRect();
        const stageScale = getElementScale(stage);
        const target = targetId
          ? stage.querySelector(`[data-demo-target="${targetId}"]`)
          : undefined;

        if (target instanceof HTMLElement) {
          const targetRect = target.getBoundingClientRect();
          const targetCenterX =
            targetRect.left - stageRect.left + targetRect.width / 2;
          const targetCenterY =
            targetRect.top - stageRect.top + targetRect.height / 2;

          setCursorPosition({
            x: targetCenterX / stageScale.x,
            y: targetCenterY / stageScale.y,
          });
          return;
        }

        if (step.holdCursor) return;

        setCursorPosition({
          x: (stage.offsetWidth * step.cursor.x) / 100,
          y: (stage.offsetHeight * step.cursor.y) / 100,
        });
      });
    };

    measureCursor();
    const timeout = window.setTimeout(measureCursor, 320);
    window.addEventListener('resize', measureCursor);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.removeEventListener('resize', measureCursor);
    };
  }, [step, targetId, progress]);

  return {
    actionProgress,
    actionReady,
    cursorPosition,
    effectiveIndex,
    elapsedMs: progress * step.duration,
    hoverReady,
    reduceMotion,
    selectReady,
    stageRef,
    step,
    targetId,
  };
}

export function getActionProgress(progress: number, duration: number) {
  const actionStart = Math.min(0.85, CURSOR_SETTLE_MS / duration);

  return Math.min(1, Math.max(0, (progress - actionStart) / (1 - actionStart)));
}

export function DemoStageShell({
  activeSidebar = 'docker',
  background,
  children,
  childrenMode = 'floatingPanel',
  cursorPosition,
  dataAttribute,
  floatingPanelOpen = true,
  hideProjects = false,
  maskVisible = false,
  reduceMotion,
  shellChrome = 'browser',
  showGithubTabs = false,
  stageMode = 'full',
  stageRef,
  step,
}: {
  activeSidebar?: 'database' | 'docker' | 'github' | 'template';
  background?: ReactNode;
  children: ReactNode;
  childrenMode?: 'canvas' | 'floatingPanel';
  cursorPosition?: { x: number; y: number };
  dataAttribute:
    | 'data-database-demo'
    | 'data-docker-image-demo'
    | 'data-github-import-demo'
    | 'data-template-demo';
  floatingPanelOpen?: boolean;
  hideProjects?: boolean;
  maskVisible?: boolean;
  reduceMotion: boolean;
  shellChrome?: 'browser' | 'thin';
  showGithubTabs?: boolean;
  stageMode?: 'full' | 'sidebarOnly';
  stageRef: React.RefObject<HTMLDivElement>;
  step: CursorStep;
}) {
  return (
    <LayoutGroup>
      <div
        {...inertDemoProps}
        {...{ [dataAttribute]: true }}
        className={cn(
          'relative container mx-auto aspect-[1312/812] overflow-hidden rounded-[18px] bg-[#080a11] p-0 shadow-[0_30px_90px_rgba(0,0,0,0.45)]',
          shellChrome === 'thin'
            ? 'border-4 border-white/10'
            : 'border border-white/10',
        )}
      >
        <div
          ref={stageRef}
          className="relative size-full min-h-[560px] w-full overflow-hidden md:min-h-[430px]"
        >
          {shellChrome === 'browser' && <BrowserChrome />}

          <div
            className={cn(
              'absolute overflow-hidden border border-white/[0.06] bg-[#080a11]',
              shellChrome === 'thin'
                ? 'inset-0 rounded-[14px] border-0'
                : 'inset-x-[1.2%] top-[6.2%] bottom-[2%] rounded-b-[14px]',
            )}
          >
            <DemoSidebar active={activeSidebar} />
            {stageMode === 'full' && (
              <div className="absolute inset-y-0 right-0 left-[46px] flex">
                <div
                  data-project-canvas
                  className="relative min-w-0 flex-1 overflow-hidden bg-[#080a11]"
                >
                  <CanvasBackdrop />
                  <ProjectList hidden={hideProjects} />
                  {background}
                  {showGithubTabs && <GithubTabBar />}
                  {childrenMode === 'canvas' ? (
                    <div className="absolute inset-0 z-20">{children}</div>
                  ) : (
                    <FloatingProjectPanel open={floatingPanelOpen}>
                      {children}
                    </FloatingProjectPanel>
                  )}
                </div>
                <ChatPanel />
              </div>
            )}
            {stageMode === 'sidebarOnly' && (
              <div className="absolute inset-y-0 right-0 left-[46px] overflow-hidden">
                {children}
              </div>
            )}
          </div>

          {!reduceMotion && <Cursor position={cursorPosition} step={step} />}
          <div
            className={cn(
              'pointer-events-none absolute inset-0 z-40 bg-[linear-gradient(to_bottom,rgba(8,10,17,0)_0%,rgba(8,10,17,0.86)_62%,#080A11_100%)] transition-opacity duration-500',
              maskVisible ? 'opacity-100' : 'opacity-0',
            )}
            aria-hidden="true"
          />
        </div>
      </div>
    </LayoutGroup>
  );
}

function BrowserChrome() {
  return (
    <div className="absolute inset-x-[1.2%] top-[1%] flex h-[4%] items-center rounded-t-[14px] px-2">
      <div className="flex gap-2">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
      </div>
      <div className="mx-auto flex h-[26px] w-[29%] items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.035] text-[11px] text-zinc-500">
        cloud.sealos.io
      </div>
    </div>
  );
}

export function DemoSidebar({
  active = 'docker',
}: {
  active?: 'database' | 'docker' | 'github' | 'template';
}) {
  const items = [Brain, SquareTerminal, Database, PanelsTopLeft, Container];
  const activeIndex =
    active === 'github'
      ? 1
      : active === 'database'
        ? 2
        : active === 'template'
          ? 3
          : 4;

  return (
    <aside className="absolute inset-y-0 left-0 flex w-[46px] flex-col items-center gap-3 border-r border-white/[0.06] bg-[#13151C] pt-4">
      {items.map((Icon, index) => (
        <span
          key={index}
          className={cn(
            'flex size-8 items-center justify-center rounded-lg text-zinc-500',
            index === activeIndex && 'bg-blue-500/15 text-blue-300',
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
      ))}
    </aside>
  );
}

function CanvasBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(29,78,216,0.2)_0%,rgba(10,10,10,0.2)_100%)]" />
      <div
        data-project-grid
        className="absolute inset-0 [background-image:radial-gradient(circle,rgba(148,163,184,0.38)_1px,transparent_1px)] [background-size:32px_32px] opacity-80"
      />
    </>
  );
}

function ProjectList({ hidden = false }: { hidden?: boolean }) {
  const projects = [
    { name: 'orders-api', date: '18 Jun 2026', active: true },
    { name: 'web-console', date: '12 Jun 2026' },
    { name: 'billing-worker', date: '08 Jun 2026' },
  ];

  return (
    <aside
      data-project-list
      className={cn(
        'absolute top-0 right-[32rem] bottom-0 left-0 z-10 overflow-hidden transition-opacity max-sm:right-[300px]',
        hidden && 'pointer-events-none opacity-0',
      )}
    >
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[30%] bg-gradient-to-b from-transparent to-[#183485]" />
      <div className="relative z-10 flex h-full flex-col gap-4 px-7 py-11 max-lg:px-5 max-sm:px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="size-5 text-zinc-200" aria-hidden />
            <h3 className="text-xl font-semibold text-zinc-100">Projects</h3>
          </div>
        </div>

        <div className="text-xs text-zinc-500">
          View existing projects or create a new one.
        </div>

        <div className="flex w-full gap-2">
          <div className="flex h-8 w-full items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 text-sm text-zinc-500">
            <Search className="size-4" aria-hidden />
            Search
          </div>

          <button
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-zinc-100"
            type="button"
          >
            <Plus className="size-4" aria-hidden />
          </button>
        </div>

        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.name}
              className="flex h-[57px] items-center gap-3 rounded-lg px-4 backdrop-blur-xl"
            >
              <div
                className={cn(
                  'size-3 rounded-full ring-4',
                  project.active
                    ? 'bg-emerald-400 ring-emerald-400/20'
                    : 'bg-zinc-600 ring-zinc-600/20',
                )}
                aria-hidden
              />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="w-[74px] truncate text-sm font-medium text-zinc-100">
                  {project.name}
                </span>
                <span className="w-[70px] truncate text-xs text-zinc-500">
                  {project.date}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-zinc-100">
                <Pin className="size-3.5" aria-hidden />
                <MoreHorizontal className="size-4" aria-hidden />
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function FloatingProjectPanel({
  children,
  open,
}: {
  children: ReactNode;
  open: boolean;
}) {
  return (
    <motion.div
      data-floating-project-panel
      className="absolute top-[46px] right-0 bottom-0 z-20 w-full max-w-lg overflow-hidden rounded-t-xl rounded-r-none border-t border-l border-white/[0.08] bg-[#13151C] shadow-[0_24px_80px_rgba(0,0,0,0.46)] max-sm:right-auto max-sm:left-[72px] max-sm:w-[300px]"
      animate={{ opacity: open ? 1 : 0, x: open ? 0 : 360 }}
      transition={screenTransition}
    >
      {children}
    </motion.div>
  );
}

function ChatPanel() {
  const tools = [Github, Wrench, Container, Database, PanelsTopLeft];

  return (
    <aside className="relative z-30 flex w-[31%] max-w-[370px] min-w-[270px] flex-col border-l border-white/[0.07] bg-[#13151C] max-sm:hidden">
      <div className="flex h-[46px] items-center justify-between border-b border-white/[0.05] px-3">
        <button
          className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-200"
          type="button"
        >
          <span className="truncate">Chat-Name-2026</span>
          <ChevronDown className="size-3.5 text-zinc-500" aria-hidden />
        </button>
        <div className="flex items-center gap-1">
          <button
            className="flex size-8 items-center justify-center rounded-md bg-white/[0.04] text-zinc-400"
            type="button"
          >
            <Plus className="size-4" aria-hidden />
          </button>
          <button
            className="flex size-8 items-center justify-center rounded-md bg-white/[0.04] text-zinc-400"
            type="button"
          >
            <PanelRightClose className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1" />
      <div className="m-2 rounded-lg border border-white/[0.07] bg-white/[0.035] p-2 shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
        <div className="h-12 text-xs leading-5 text-zinc-500 max-sm:text-[0px]">
          Tell me your project ideas here...
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center">
            {tools.map((Icon, index) => (
              <button
                key={index}
                className="flex size-8 items-center justify-center rounded-md text-zinc-500 hover:bg-white/[0.04]"
                type="button"
              >
                <Icon className="size-4" aria-hidden />
              </button>
            ))}
          </div>
          <button
            className="flex size-8 shrink-0 items-center justify-center rounded-md bg-blue-500 text-white"
            type="button"
          >
            <SendHorizontal className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </aside>
  );
}

function GithubTabBar() {
  return (
    <div className="absolute top-0 left-[54px] z-30 flex h-[46px] items-center gap-2 text-xs text-zinc-300 max-sm:hidden">
      <div className="flex h-9 items-center gap-2 rounded-md bg-white/[0.11] px-3">
        <span>orders-api</span>
        <ChevronDown className="size-3.5 text-zinc-500" aria-hidden />
      </div>
      <div className="flex h-9 items-center gap-2 rounded-md bg-white/[0.13] px-3">
        <Github className="size-3.5 text-blue-300" aria-hidden />
        Github Deployment
        <span className="size-2 rounded-full bg-blue-500" />
        <X className="size-3.5 text-zinc-500" aria-hidden />
      </div>
    </div>
  );
}

export function ModeSelectionScreen({
  activeCard = 'Docker Image',
  pressed,
}: {
  activeCard?: string;
  pressed: boolean;
}) {
  return (
    <div className="h-full overflow-hidden px-4 py-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Plus className="size-4 text-zinc-300" aria-hidden="true" />
            <h3 className="text-base font-semibold text-zinc-100">
              Create New Project
            </h3>
          </div>
          <p className="mt-2 text-xs text-zinc-500">
            Select the project creation method.
          </p>
        </div>
        <button
          className="flex size-8 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500"
          type="button"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="space-y-2.5">
        {modeCards.map((card) => (
          <ModeCard
            key={card.title}
            card={card}
            pressed={card.title === activeCard && pressed}
            target={card.title === activeCard ? card.target : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function ModeCard({
  card,
  pressed = false,
  target,
}: {
  card: (typeof modeCards)[number];
  pressed?: boolean;
  target?: string;
}) {
  const Icon = card.Icon;
  const highlighted = pressed;

  return (
    <motion.article
      data-demo-target={target}
      className={cn(
        'relative rounded-lg border p-3 text-left shadow-[0_12px_40px_rgba(0,0,0,0.2)]',
        highlighted
          ? 'border-zinc-400/40 bg-zinc-500/[0.1]'
          : 'border-white/[0.06] bg-white/[0.035]',
        pressed && 'border-zinc-300/70 bg-zinc-500/[0.16]',
      )}
      transition={{ duration: 0.16 }}
    >
      <div className="mb-1.5 flex items-center gap-2.5">
        <span className="flex size-7 items-center justify-center rounded-md bg-white/10">
          <Icon
            className={cn(
              'size-4 text-zinc-300',
              highlighted && 'text-blue-300',
            )}
            aria-hidden="true"
          />
        </span>
        <h4 className="text-sm font-medium text-zinc-100">{card.title}</h4>
      </div>
      <p className="line-clamp-1 text-xs leading-5 text-zinc-500">
        {card.description}
      </p>
      {highlighted && (
        <div className="absolute top-4 right-4 size-2 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.8)]" />
      )}
    </motion.article>
  );
}

export function FormHeader({
  description,
  Icon,
  title,
}: {
  description: string;
  Icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="mb-4 flex shrink-0 items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="size-3.5 text-blue-300" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        </div>
        <p className="mt-1.5 text-[11px] leading-4 text-zinc-500">
          {description}
        </p>
      </div>
      <button
        className="flex size-7 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500"
        type="button"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

export function SectionTitle({
  description,
  Icon,
  title,
}: {
  description: string;
  Icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-zinc-300" aria-hidden />
      <div>
        <h4 className="text-[11px] font-medium text-zinc-100">{title}</h4>
        <p className="mt-1 text-[10px] leading-3.5 text-zinc-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export function DeployButton({
  pressed = false,
  target,
}: {
  pressed?: boolean;
  target?: string;
}) {
  return (
    <button
      data-demo-target={target}
      className={cn(
        'flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-blue-500 px-3 text-[11px] font-medium text-white',
        pressed && 'bg-blue-400',
      )}
      type="button"
    >
      <Rocket className="size-3.5" aria-hidden />
      Deploy
    </button>
  );
}

export function AddButton({
  pressed = false,
  target,
}: {
  pressed?: boolean;
  target?: string;
}) {
  return (
    <motion.button
      data-demo-target={target}
      className={cn(
        'flex h-7 items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 text-[11px] font-medium text-zinc-200 transition-colors hover:bg-[#e5e5e5] hover:text-[#0a0a0a]',
        pressed && 'bg-[#e5e5e5] text-[#0a0a0a]',
      )}
      type="button"
    >
      <Plus className="size-3.5" aria-hidden="true" />
      Add
    </motion.button>
  );
}

export function DemoField({
  active = false,
  label,
  multiline = false,
  placeholder,
  target,
  value,
}: {
  active?: boolean;
  label?: string;
  multiline?: boolean;
  placeholder: string;
  target?: string;
  value: string;
}) {
  return (
    <label className="block min-w-0" data-demo-target={target}>
      {label && (
        <span className="mb-1 block text-[10px] text-zinc-400">{label}</span>
      )}
      <span
        className={cn(
          'flex min-w-0 rounded-md border bg-black/20 px-2.5 py-1.5 font-mono text-[11px] text-zinc-100',
          multiline ? 'h-11 items-start' : 'h-7 items-center',
          active
            ? 'border-blue-400/70 shadow-[0_0_0_3px_rgba(59,130,246,0.14)]'
            : 'border-white/[0.08]',
        )}
      >
        <span className="min-w-0 truncate">
          {value || <span className="text-zinc-600">{placeholder}</span>}
          <TypingCaret visible={active} />
        </span>
      </span>
    </label>
  );
}

export function TypingCaret({ visible }: { visible: boolean }) {
  const className = 'ml-0.5 inline-block h-4 w-px translate-y-0.5';

  if (!visible) return <span className={className} />;

  return (
    <motion.span
      className={cn(className, 'bg-blue-300')}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.9, repeat: Infinity }}
    />
  );
}

function Cursor({
  position,
  step,
}: {
  position?: { x: number; y: number };
  step: { cursor: { x: number; y: number }; clickTarget?: string };
}) {
  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 z-30 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)] will-change-transform"
      animate={{
        x: position ? position.x : `${step.cursor.x}%`,
        y: position ? position.y : `${step.cursor.y}%`,
      }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div animate={{ opacity: step.clickTarget ? 0.75 : 1 }}>
        <svg
          className="h-[23px] w-[22px]"
          viewBox="0 0 22 23"
          fill="none"
          aria-hidden="true"
        >
          <g filter="url(#docker-demo-cursor-shadow)">
            <path
              fill="#eff6ff"
              d="M6.75 18.67 2.09 2.32a1.02 1.02 0 0 1 1.43-1.2l15.44 7.4c.82.39.76 1.57-.1 1.87l-6.35 2.25q-.35.13-.54.45L8.63 18.9c-.45.79-1.64.64-1.88-.23"
            />
          </g>
          <defs>
            <filter
              id="docker-demo-cursor-shadow"
              width="21.59"
              height="22.48"
              x="0"
              y="0"
              colorInterpolationFilters="sRGB"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                result="hardAlpha"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="1.02" />
              <feGaussianBlur stdDeviation="1.02" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.08 0" />
              <feBlend
                in2="BackgroundImageFix"
                result="effect1_dropShadow_5852_19628"
              />
              <feBlend
                in="SourceGraphic"
                in2="effect1_dropShadow_5852_19628"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
}
