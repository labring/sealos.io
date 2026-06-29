'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Box,
  Brain,
  ChevronDown,
  Container,
  Database,
  FileClock,
  FileCog,
  Github,
  HardDrive,
  MoreHorizontal,
  Network,
  PanelRightClose,
  PanelsTopLeft,
  Pin,
  Plus,
  Rocket,
  Search,
  SendHorizontal,
  SquareTerminal,
  Trash2,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

type Screen = 'mode' | 'form';
type FieldId =
  | 'image'
  | 'command'
  | 'args'
  | 'runtimeKey'
  | 'runtimeValue'
  | 'port';

type DemoStep = {
  duration: number;
  screen: Screen;
  cursor: { x: number; y: number };
  activeField?: FieldId;
  clickTarget?: 'dockerCard' | 'runtimeAdd' | 'deploy';
  typed?: Partial<Record<FieldId, string>>;
  expandedRuntime?: boolean;
  holdCursor?: boolean;
  deploying?: boolean;
  success?: boolean;
};

const finalTypedValues: Record<FieldId, string> = {
  image: 'ghcr.io/labring/demo-api:latest',
  command: '/app/server',
  args: '--config /etc/app/config.yaml',
  runtimeKey: 'NODE_ENV',
  runtimeValue: 'production',
  port: '80',
};

const CURSOR_SETTLE_MS = 560;
const HOVER_SETTLE_MS = CURSOR_SETTLE_MS + 120;

const demoSteps: DemoStep[] = [
  { duration: 1400, screen: 'mode', cursor: { x: 54, y: 18 } },
  {
    duration: 900,
    screen: 'mode',
    cursor: { x: 48, y: 24 },
    clickTarget: 'dockerCard',
  },
  { duration: 700, screen: 'form', cursor: { x: 56, y: 60 }, holdCursor: true },
  {
    duration: 1900,
    screen: 'form',
    cursor: { x: 48, y: 25 },
    activeField: 'image',
    typed: { image: finalTypedValues.image },
  },
  {
    duration: 1300,
    screen: 'form',
    cursor: { x: 48, y: 40 },
    activeField: 'command',
    typed: { command: finalTypedValues.command },
  },
  {
    duration: 1700,
    screen: 'form',
    cursor: { x: 48, y: 48 },
    activeField: 'args',
    typed: { args: finalTypedValues.args },
  },
  {
    duration: 700,
    screen: 'form',
    cursor: { x: 66, y: 58 },
    clickTarget: 'runtimeAdd',
  },
  {
    duration: 700,
    screen: 'form',
    cursor: { x: 66, y: 58 },
    expandedRuntime: true,
    holdCursor: true,
  },
  {
    duration: 1000,
    screen: 'form',
    cursor: { x: 40, y: 63 },
    expandedRuntime: true,
    activeField: 'runtimeKey',
    typed: { runtimeKey: finalTypedValues.runtimeKey },
  },
  {
    duration: 1200,
    screen: 'form',
    cursor: { x: 55, y: 63 },
    expandedRuntime: true,
    activeField: 'runtimeValue',
    typed: { runtimeValue: finalTypedValues.runtimeValue },
  },
  {
    duration: 800,
    screen: 'form',
    cursor: { x: 40, y: 82 },
    expandedRuntime: true,
    activeField: 'port',
    typed: { port: finalTypedValues.port },
  },
  {
    duration: 700,
    screen: 'form',
    cursor: { x: 48, y: 91 },
    expandedRuntime: true,
    clickTarget: 'deploy',
  },
  {
    duration: 1200,
    screen: 'form',
    cursor: { x: 48, y: 91 },
    expandedRuntime: true,
    deploying: true,
  },
  {
    duration: 1800,
    screen: 'form',
    cursor: { x: 60, y: 18 },
    expandedRuntime: true,
    success: true,
  },
];

const modeCards = [
  {
    title: 'GitHub',
    description: 'Import repository from URL or GitHub authorization.',
    Icon: Github,
  },
  {
    title: 'Templates',
    description: 'Quickly import from application templates.',
    Icon: PanelsTopLeft,
  },
  {
    title: 'Docker Image',
    description: 'Create and run a project using an existing image.',
    Icon: Container,
    active: true,
  },
  {
    title: 'Database',
    description: 'Set up a database project or data service first.',
    Icon: Database,
  },
];

export function DockerImageDemo() {
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  }>();
  const effectiveIndex = reduceMotion ? demoSteps.length - 1 : stepIndex;
  const step = demoSteps[effectiveIndex];
  const targetId = getStepTarget(step);
  const actionProgress = reduceMotion
    ? 1
    : getActionProgress(progress, step.duration);
  const actionReady =
    reduceMotion || progress * step.duration >= CURSOR_SETTLE_MS;
  const hoverReady =
    reduceMotion || progress * step.duration >= HOVER_SETTLE_MS;
  const focusedField = getFocusedField(effectiveIndex, actionReady);

  useEffect(() => {
    if (reduceMotion) return;

    const startedAt = performance.now();
    const duration = demoSteps[stepIndex].duration;
    setProgress(0);

    const interval = window.setInterval(() => {
      setProgress(Math.min(1, (performance.now() - startedAt) / duration));
    }, 50);
    const timeout = window.setTimeout(() => {
      setProgress(0);
      setStepIndex((index) => (index + 1) % demoSteps.length);
    }, duration);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [reduceMotion, stepIndex]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let frame = 0;

    const measureCursor = () => {
      frame = window.requestAnimationFrame(() => {
        const stageRect = stage.getBoundingClientRect();
        const target = targetId
          ? stage.querySelector(`[data-demo-target="${targetId}"]`)
          : undefined;

        if (target instanceof HTMLElement) {
          const targetRect = target.getBoundingClientRect();
          setCursorPosition({
            x: targetRect.left - stageRect.left + targetRect.width / 2,
            y: targetRect.top - stageRect.top + targetRect.height / 2,
          });
          return;
        }

        if (step.holdCursor) return;

        setCursorPosition({
          x: (stageRect.width * step.cursor.x) / 100,
          y: (stageRect.height * step.cursor.y) / 100,
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

  const fieldText = (field: FieldId) =>
    reduceMotion
      ? finalTypedValues[field]
      : getFieldText(field, effectiveIndex, actionProgress);

  return (
    <div
      data-docker-image-demo
      className="relative container mx-auto aspect-[1312/812] overflow-hidden rounded-[18px] border border-white/10 bg-[#080a11] p-0 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
    >
      <div
        ref={stageRef}
        className="relative size-full min-h-[560px] w-full overflow-hidden md:min-h-[430px]"
      >
        <BrowserChrome />

        <div className="absolute inset-x-[1.2%] top-[6.2%] bottom-[2%] overflow-hidden rounded-b-[14px] border border-white/[0.06] bg-[#080a11]">
          <Sidebar />
          <div className="absolute inset-y-0 right-0 left-[46px] flex">
            <div
              data-project-canvas
              className="relative min-w-0 flex-1 overflow-hidden bg-[#080a11]"
            >
              <CanvasBackdrop />
              <ProjectList />
              <FloatingProjectPanel>
                <AnimatePresence mode="wait">
                  {step.screen === 'mode' ? (
                    <motion.div
                      key="mode"
                      className="h-full"
                      initial={{ opacity: 0, x: -16, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: -20, filter: 'blur(8px)' }}
                      transition={screenTransition}
                    >
                      <ModeSelectionScreen
                        pressed={
                          hoverReady && step.clickTarget === 'dockerCard'
                        }
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="form"
                      className="h-full"
                      initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, x: 20, filter: 'blur(8px)' }}
                      transition={screenTransition}
                    >
                      <DockerFormScreen
                        activeField={focusedField}
                        args={fieldText('args')}
                        command={fieldText('command')}
                        deploying={step.deploying}
                        expandedRuntime={
                          step.expandedRuntime ||
                          Boolean(
                            fieldText('runtimeKey') ||
                              fieldText('runtimeValue'),
                          )
                        }
                        image={fieldText('image')}
                        port={fieldText('port')}
                        runtimeKey={fieldText('runtimeKey')}
                        runtimeValue={fieldText('runtimeValue')}
                        runtimeAddPressed={
                          actionReady && step.clickTarget === 'runtimeAdd'
                        }
                        deployPressed={
                          actionReady && step.clickTarget === 'deploy'
                        }
                        success={step.success}
                        targetId={targetId}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </FloatingProjectPanel>
            </div>
            <ChatPanel />
          </div>
        </div>

        {!reduceMotion && <Cursor position={cursorPosition} step={step} />}
      </div>
    </div>
  );
}

const screenTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1],
} as const;

function getFieldText(field: FieldId, index: number, progress: number) {
  const step = demoSteps[index];
  const target = getLatestTypedValue(field, index);

  if (step.activeField !== field || step.typed?.[field] === undefined) {
    return target;
  }

  const previous = getLatestTypedValue(field, index - 1);
  const next = step.typed[field] ?? '';
  const localProgress = Math.min(1, Math.max(0, progress));

  if (next.startsWith(previous)) {
    const added = next.slice(previous.length);
    return previous + added.slice(0, Math.round(added.length * localProgress));
  }

  return next.slice(0, Math.round(next.length * localProgress));
}

function getActionProgress(progress: number, duration: number) {
  const actionStart = Math.min(0.85, CURSOR_SETTLE_MS / duration);

  return Math.min(1, Math.max(0, (progress - actionStart) / (1 - actionStart)));
}

function getLatestTypedValue(field: FieldId, index: number) {
  for (let i = index; i >= 0; i -= 1) {
    const value = demoSteps[i]?.typed?.[field];
    if (value !== undefined) return value;
  }

  return '';
}

function getFocusedField(index: number, actionReady: boolean) {
  const step = demoSteps[index];

  if (actionReady && step.activeField) return step.activeField;

  for (let i = index - 1; i >= 0; i -= 1) {
    const field = demoSteps[i]?.activeField;
    if (field) return field;
  }
}

function getStepTarget(step: DemoStep) {
  if (step.clickTarget) return step.clickTarget;
  if (step.activeField) return step.activeField;
  if (step.deploying || step.success) return 'deploy';
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

function Sidebar() {
  const items = [Brain, SquareTerminal, Database, PanelsTopLeft, Container];

  return (
    <aside className="absolute inset-y-0 left-0 flex w-[46px] flex-col items-center gap-3 border-r border-white/[0.06] bg-[#13151C] pt-4">
      {items.map((Icon, index) => (
        <span
          key={index}
          className={cn(
            'flex size-8 items-center justify-center rounded-lg text-zinc-500',
            index === 4 && 'bg-blue-500/15 text-blue-300',
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_16%,rgba(59,130,246,0.18),transparent_30%),linear-gradient(90deg,rgba(8,10,17,0.08),rgba(8,10,17,0.58)_88%)]" />
      <div
        data-project-grid
        className="absolute inset-0 [background-image:radial-gradient(circle,rgba(148,163,184,0.38)_1px,transparent_1px)] [background-size:32px_32px] opacity-80"
      />
    </>
  );
}

function ProjectList() {
  const projects = [
    { name: 'orders-api', date: '18 Jun 2026', active: true },
    { name: 'web-console', date: '12 Jun 2026' },
    { name: 'billing-worker', date: '08 Jun 2026' },
  ];

  return (
    <aside
      data-project-list
      className="absolute top-0 bottom-0 left-0 z-10 w-[300px] overflow-hidden max-lg:w-[250px] max-sm:w-[210px]"
    >
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-[20%] bg-gradient-to-b from-transparent to-[#183485]" />
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
              className={cn(
                'flex h-[57px] items-center gap-3 rounded-lg px-4 backdrop-blur-xl',
              )}
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

function FloatingProjectPanel({ children }: { children: ReactNode }) {
  return (
    <div
      data-floating-project-panel
      className="absolute top-[46px] right-0 bottom-0 left-[300px] z-20 overflow-hidden rounded-t-xl rounded-r-none border-t border-l border-white/[0.08] bg-[#13151C] shadow-[0_24px_80px_rgba(0,0,0,0.46)] max-lg:left-[250px] max-sm:right-auto max-sm:left-[72px] max-sm:w-[300px]"
    >
      {children}
    </div>
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

function ModeSelectionScreen({ pressed }: { pressed: boolean }) {
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
            pressed={card.active === true && pressed}
            target={card.active ? 'dockerCard' : undefined}
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
  const highlighted = card.active === true && pressed;

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

function DockerFormScreen({
  activeField,
  args,
  command,
  deployPressed,
  deploying,
  expandedRuntime,
  image,
  port,
  runtimeAddPressed,
  runtimeKey,
  runtimeValue,
  success,
  targetId,
}: {
  activeField?: FieldId;
  args: string;
  command: string;
  deployPressed: boolean;
  deploying?: boolean;
  expandedRuntime: boolean;
  image: string;
  port: string;
  runtimeAddPressed: boolean;
  runtimeKey: string;
  runtimeValue: string;
  success?: boolean;
  targetId?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formY, setFormY] = useState(0);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const content = contentRef.current;
    if (!targetId) return;

    const target = content?.querySelector(`[data-demo-target="${targetId}"]`);
    if (!viewport || !content || !(target instanceof HTMLElement)) return;

    const targetCenter = target.offsetTop + target.offsetHeight / 2;
    const targetBottom = target.offsetTop + target.offsetHeight;
    const maxUp = Math.min(0, viewport.clientHeight - content.scrollHeight);
    const nextY =
      targetId === 'deploy'
        ? Math.min(0, viewport.clientHeight - 32 - targetBottom)
        : Math.min(
            0,
            Math.max(maxUp, viewport.clientHeight * 0.45 - targetCenter),
          );

    setFormY(nextY);
  }, [expandedRuntime, targetId]);

  return (
    <div className="relative flex h-full flex-col overflow-hidden p-5">
      <div className="mb-4 flex shrink-0 items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Container className="size-3.5 text-blue-300" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Create New Project
            </h3>
          </div>
          <p className="mt-1.5 text-[11px] leading-4 text-zinc-500">
            Provide a project name and select the project creation method.
          </p>
        </div>
        <button
          className="flex size-7 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500"
          type="button"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div
        ref={viewportRef}
        className="relative min-h-0 flex-1 overflow-hidden"
      >
        <motion.div
          ref={contentRef}
          className="relative min-h-full w-full rounded-xl"
          animate={{ y: success ? formY - 8 : formY }}
          transition={screenTransition}
        >
          <div className="space-y-3">
            <FormSection
              Icon={Box}
              title="Image"
              description="Choose the container image to run."
            >
              <DemoField
                active={activeField === 'image'}
                placeholder="ghcr.io/org/image:tag"
                target="image"
                value={image}
              />
            </FormSection>

            <FormSection
              Icon={SquareTerminal}
              title="Launch"
              description="Override the image default startup process."
            >
              <div className="grid gap-3">
                <DemoField
                  active={activeField === 'command'}
                  label="Command"
                  multiline
                  placeholder="/app/server"
                  target="command"
                  value={command}
                />
                <DemoField
                  active={activeField === 'args'}
                  label="Args"
                  multiline
                  placeholder="--config /etc/app/config.yaml"
                  target="args"
                  value={args}
                />
              </div>
            </FormSection>

            <RuntimeSection
              activeField={activeField}
              expanded={expandedRuntime}
              keyValue={runtimeKey}
              pressed={runtimeAddPressed}
              value={runtimeValue}
            />

            <CollapsedAddSection
              Icon={FileCog}
              title="Config Files"
              description="No config files."
            />

            <CollapsedAddSection
              Icon={HardDrive}
              title="Storage"
              description="No storage mounts."
            />

            <FormSection
              Icon={Network}
              title="Network"
              description="Request public routing to the port where the app listens."
            >
              <div className="grid grid-cols-2 gap-3">
                <DemoField
                  active={activeField === 'port'}
                  label="App Listening Port"
                  placeholder="80"
                  target="port"
                  value={port}
                />
                <DemoField
                  label="Public Address"
                  placeholder="Auto-generated Public Address"
                  value={success ? 'demo-api.cloud.sealos.io' : ''}
                />
              </div>
            </FormSection>

            <motion.button
              data-demo-target="deploy"
              className={cn(
                'flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 text-sm font-medium text-white shadow-lg shadow-blue-500/20',
                !image && 'opacity-50',
                deployPressed && 'bg-blue-400',
                success && 'bg-emerald-500 shadow-emerald-500/20',
              )}
              type="button"
            >
              <Rocket className="size-4" aria-hidden="true" />
              {deploying ? 'Deploying...' : success ? 'Deployed' : 'Deploy'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FormSection({
  children,
  description,
  Icon,
  title,
}: {
  children: ReactNode;
  description: string;
  Icon: LucideIcon;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-white/[0.07] bg-[#1E2026] p-3">
      <div className="mb-3 flex items-start gap-2">
        <Icon className="mt-0.5 size-3.5 shrink-0 text-zinc-300" aria-hidden />
        <div>
          <h4 className="text-[11px] font-medium text-zinc-100">{title}</h4>
          <p className="mt-1 text-[10px] leading-3.5 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function RuntimeSection({
  activeField,
  expanded,
  keyValue,
  pressed,
  value,
}: {
  activeField?: FieldId;
  expanded: boolean;
  keyValue: string;
  pressed: boolean;
  value: string;
}) {
  return (
    <section className="rounded-lg border border-white/[0.07] bg-white/[0.045] p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <FileClock
            className="mt-0.5 size-3.5 shrink-0 text-zinc-300"
            aria-hidden
          />
          <div>
            <h4 className="text-[11px] font-medium text-zinc-100">Runtime</h4>
            <p className="mt-1 text-[10px] leading-3.5 text-zinc-500">
              {expanded
                ? 'Set direct environment variables for startup.'
                : 'No environment variables.'}
            </p>
          </div>
        </div>
        <AddButton pressed={pressed} target="runtimeAdd" />
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="mt-2 grid grid-cols-[1fr_1fr_28px] gap-2 overflow-hidden p-1"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={screenTransition}
          >
            <DemoField
              active={activeField === 'runtimeKey'}
              placeholder="NEW_VARIABLE"
              target="runtimeKey"
              value={keyValue}
            />
            <DemoField
              active={activeField === 'runtimeValue'}
              placeholder="value"
              target="runtimeValue"
              value={value}
            />
            <button
              className="flex size-7 items-center justify-center rounded-md bg-white/[0.04] text-zinc-500"
              type="button"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CollapsedAddSection({
  description,
  Icon,
  title,
}: {
  description: string;
  Icon: LucideIcon;
  title: string;
}) {
  return (
    <section className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.035] p-3">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 size-3.5 shrink-0 text-zinc-400" aria-hidden />
        <div>
          <h4 className="text-[11px] font-medium text-zinc-200">{title}</h4>
          <p className="mt-1 text-[10px] leading-3.5 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      <AddButton />
    </section>
  );
}

function AddButton({
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

function DemoField({
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

function TypingCaret({ visible }: { visible: boolean }) {
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
  step: DemoStep;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute z-30 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)]"
      animate={{
        left: position ? position.x : `${step.cursor.x}%`,
        top: position ? position.y : `${step.cursor.y}%`,
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
