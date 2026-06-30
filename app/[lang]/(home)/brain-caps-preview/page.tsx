'use client';

import {
  Box,
  Braces,
  CheckCircle2,
  CircleCheck,
  Cpu,
  Database,
  Ellipsis,
  HardDrive,
  MemoryStick,
  Plus,
  Router,
  Server,
  SquarePen,
  Upload,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

import {
  DemoStageShell,
  useDemoPlayback,
  type CursorStep,
} from '../(new-home)/components/deploy-demo-common';

type CanvasStep = CursorStep & {
  phase:
    | 'idle'
    | 'startLink'
    | 'dragLink'
    | 'targetHold'
    | 'dropLink'
    | 'form'
    | 'valueHover'
    | 'openSelect'
    | 'variables'
    | 'selected'
    | 'saved';
  clickTarget?:
    | 'ordersHandle'
    | 'webHandle'
    | 'valueBrace'
    | 'variableOption'
    | 'updateButton';
};

const canvasSteps: CanvasStep[] = [
  { duration: 900, phase: 'idle', cursor: { x: 45, y: 38 } },
  {
    duration: 800,
    phase: 'startLink',
    cursor: { x: 50, y: 33 },
    clickTarget: 'ordersHandle',
  },
  {
    duration: 1100,
    phase: 'dragLink',
    cursor: { x: 64, y: 48 },
    clickTarget: 'webHandle',
  },
  {
    duration: 250,
    phase: 'targetHold',
    cursor: { x: 68, y: 50 },
    clickTarget: 'webHandle',
  },
  {
    duration: 100,
    phase: 'dropLink',
    cursor: { x: 68, y: 50 },
    clickTarget: 'webHandle',
  },
  { duration: 100, phase: 'form', cursor: { x: 68, y: 50 }, holdCursor: true },
  {
    duration: 500,
    phase: 'valueHover',
    cursor: { x: 82, y: 43 },
    clickTarget: 'valueBrace',
  },
  {
    duration: 500,
    phase: 'openSelect',
    cursor: { x: 82, y: 43 },
    clickTarget: 'valueBrace',
  },
  {
    duration: 1000,
    phase: 'variables',
    cursor: { x: 68, y: 56 },
    clickTarget: 'variableOption',
  },
  {
    duration: 900,
    phase: 'selected',
    cursor: { x: 85, y: 76 },
    clickTarget: 'updateButton',
  },
  {
    duration: 1500,
    phase: 'saved',
    cursor: { x: 52, y: 16 },
    holdCursor: true,
  },
];

type Point = { x: number; y: number };

export default function BrainCapsPreviewPage() {
  return (
    <main className="min-h-screen bg-[#030712] text-white">
      <div className="container pt-10 pb-6">
        <p className="text-sm text-white/50">Temporary preview canvas</p>
        <h1 className="mt-2 text-3xl font-medium">
          Brain caps animation preview
        </h1>
      </div>

      <div className="container pb-20">
        <LiveCanvasDemo />
      </div>
    </main>
  );
}

function LiveCanvasDemo() {
  const {
    cursorPosition,
    effectiveIndex,
    elapsedMs,
    reduceMotion,
    stageRef,
    step,
  } = useDemoPlayback({
    getTargetId: (step) => step.clickTarget,
    steps: canvasSteps,
  });
  const phase = reduceMotion ? 'saved' : step.phase;
  const showPanel = [
    'form',
    'valueHover',
    'openSelect',
    'variables',
    'selected',
  ].includes(phase);
  const showMenu = phase === 'openSelect' || phase === 'variables';
  const menuHover = phase === 'variables' && elapsedMs >= 800;
  const hasSelectedValue = phase === 'selected' || phase === 'saved';
  const showToast = phase === 'saved';
  const linkDone = effectiveIndex > 4 || reduceMotion;
  const linkDragging = [
    'startLink',
    'dragLink',
    'targetHold',
    'dropLink',
  ].includes(phase);
  const showActiveLink =
    linkDone ||
    phase === 'dragLink' ||
    phase === 'targetHold' ||
    phase === 'dropLink' ||
    (phase === 'startLink' && elapsedMs >= 660);

  const canvasRef = useRef<HTMLDivElement>(null);
  const entryRightRef = useRef<HTMLSpanElement>(null);
  const ordersLeftRef = useRef<HTMLSpanElement>(null);
  const ordersRightRef = useRef<HTMLSpanElement>(null);
  const webLeftRef = useRef<HTMLSpanElement>(null);
  const points = useHandlePoints(
    canvasRef,
    entryRightRef,
    ordersLeftRef,
    ordersRightRef,
    webLeftRef,
  );
  const dragEnd =
    phase === 'dragLink' && cursorPosition
      ? getCanvasCursorPoint(canvasRef, stageRef, cursorPosition)
      : phase === 'targetHold' || phase === 'dropLink'
        ? points[3]
        : points[2];

  return (
    <DemoStageShell
      activeSidebar="github"
      childrenMode="canvas"
      cursorPosition={cursorPosition}
      dataAttribute="data-github-import-demo"
      hideProjects
      reduceMotion={reduceMotion}
      shellChrome="thin"
      stageRef={stageRef}
      step={step}
    >
      <div ref={canvasRef} className="relative h-full overflow-hidden">
        <div
          className={cn(
            'absolute inset-0 transition-transform duration-500 ease-out',
            showPanel && '-translate-x-[350px]',
          )}
        >
          <ConnectionSvg
            entryEnd={points[1]}
            entryStart={points[0]}
            linkEnd={
              linkDone ? points[3] : showActiveLink ? dragEnd : undefined
            }
            linkProgress={1}
            linkStart={points[2]}
          />

          <AccessDomainCard
            className="top-[390px] left-[180px]"
            rightHandleRef={entryRightRef}
          />
          <OrdersCard
            className="top-[202px] left-[410px]"
            leftHandleRef={ordersLeftRef}
            rightActive={linkDragging || linkDone}
            rightHandleRef={ordersRightRef}
          />
          <DatabaseCard
            className="top-[390px] left-[670px]"
            leftActive={
              phase === 'targetHold' || phase === 'dropLink' || linkDone
            }
            leftHandleRef={webLeftRef}
          />
        </div>

        <OrdersApiPanel
          hasSelectedValue={hasSelectedValue}
          menuHover={menuHover}
          show={showPanel}
          showMenu={showMenu}
          updateReady={phase === 'selected'}
        />

        <div
          className={cn(
            'absolute top-5 left-[70%] z-40 flex h-11 w-[237px] -translate-x-1/2 items-center gap-3 rounded-xl border border-white/10 bg-[#171a22]/95 px-4 text-sm shadow-2xl shadow-black/40 transition-all duration-300',
            showToast
              ? 'blur-0 translate-y-0 opacity-100'
              : '-translate-y-2 opacity-0 blur-md',
          )}
        >
          <CircleCheck className="size-5 text-emerald-400" />
          <span>Configuration updated</span>
        </div>
      </div>
    </DemoStageShell>
  );
}

function useHandlePoints(
  canvasRef: RefObject<HTMLDivElement>,
  ...refs: RefObject<HTMLElement>[]
) {
  const [points, setPoints] = useState<Point[]>([]);

  useLayoutEffect(() => {
    const measure = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      setPoints(
        refs.map((ref) => {
          const element = ref.current;
          if (!element) return { x: 0, y: 0 };

          const rect = element.getBoundingClientRect();
          return {
            x: rect.left - canvasRect.left + rect.width / 2,
            y: rect.top - canvasRect.top + rect.height / 2,
          };
        }),
      );
    };

    measure();
    const raf = window.requestAnimationFrame(measure);
    const timeouts = [120, 260, 520].map((delay) =>
      window.setTimeout(measure, delay),
    );
    window.addEventListener('resize', measure);

    return () => {
      window.cancelAnimationFrame(raf);
      timeouts.forEach(window.clearTimeout);
      window.removeEventListener('resize', measure);
    };
  }, [canvasRef, ...refs]);

  return points.length ? points : refs.map(() => ({ x: 0, y: 0 }));
}

function getCanvasCursorPoint(
  canvasRef: RefObject<HTMLDivElement>,
  stageRef: RefObject<HTMLDivElement>,
  cursorPosition: Point,
) {
  const canvas = canvasRef.current;
  const stage = stageRef.current;
  if (!canvas || !stage) return cursorPosition;

  const canvasRect = canvas.getBoundingClientRect();
  const stageRect = stage.getBoundingClientRect();
  return {
    x: stageRect.left - canvasRect.left + cursorPosition.x,
    y: stageRect.top - canvasRect.top + cursorPosition.y,
  };
}

function ConnectionSvg({
  entryEnd,
  entryStart,
  linkEnd,
  linkProgress,
  linkStart,
}: {
  entryEnd: Point;
  entryStart: Point;
  linkEnd?: Point;
  linkProgress: number;
  linkStart: Point;
}) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 size-full overflow-visible"
      aria-hidden="true"
    >
      <ConnectionPath end={entryEnd} start={entryStart} />
      {linkEnd && (
        <ConnectionPath
          active
          end={linkEnd}
          progress={linkProgress}
          start={linkStart}
        />
      )}
    </svg>
  );
}

function ConnectionPath({
  active,
  end,
  progress = 1,
  start,
}: {
  active?: boolean;
  end: Point;
  progress?: number;
  start: Point;
}) {
  const dx = Math.max(48, Math.abs(end.x - start.x) * 0.55);
  const path = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y} ${
    end.x - dx
  } ${end.y} ${end.x} ${end.y}`;

  if (!start.x || !end.x) return null;

  if (active) {
    return (
      <motion.path
        animate={{ d: path }}
        d={path}
        fill="none"
        pathLength="1"
        stroke="rgba(96,165,250,0.95)"
        strokeDasharray="0.07 0.045"
        strokeDashoffset={1 - progress}
        strokeLinecap="round"
        strokeWidth={2.5}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      />
    );
  }

  return (
    <path
      d={path}
      fill="none"
      pathLength="1"
      stroke="rgba(96,165,250,0.62)"
      strokeDasharray="0.05 0.04"
      strokeDashoffset={0}
      strokeLinecap="round"
      strokeWidth={2}
    />
  );
}

function AccessDomainCard({
  className,
  rightHandleRef,
}: {
  className: string;
  rightHandleRef: RefObject<HTMLSpanElement>;
}) {
  return (
    <div
      className={cn(
        'absolute z-10 w-[182px] overflow-visible rounded-[6px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/30 backdrop-blur-xl',
        className,
      )}
    >
      <span
        ref={rightHandleRef}
        className="absolute top-1/2 -right-[10px] z-20 size-1.5 -translate-y-1/2 rounded-full border border-white/35 bg-white/45 backdrop-blur-lg"
      />
      <div className="flex items-center gap-2 border-b border-white/10 p-2">
        <div className="grid size-6 place-items-center rounded-md bg-white/[0.06]">
          <Router className="size-3.5 text-blue-200" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] leading-4 text-zinc-100">
            orders.demo.sealos.run
          </p>
          <p className="text-[9px] leading-3 text-zinc-500">Access domain</p>
        </div>
        <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
      </div>
    </div>
  );
}

function OrdersCard({
  className,
  leftHandleRef,
  rightActive,
  rightHandleRef,
}: {
  className: string;
  leftHandleRef: RefObject<HTMLSpanElement>;
  rightActive: boolean;
  rightHandleRef: RefObject<HTMLSpanElement>;
}) {
  return (
    <div
      className={cn(
        'absolute z-10 w-[216px] overflow-visible rounded-[8px] border border-blue-400/60 bg-[#0f141f] shadow-[0_0_0_3px_rgba(59,130,246,0.16),0_24px_70px_rgba(0,0,0,0.38)]',
        className,
      )}
    >
      <Handle handleRef={leftHandleRef} side="left" />
      <Handle
        active={rightActive}
        handleRef={rightHandleRef}
        side="right"
        target="ordersHandle"
      />
      <CardHeader
        Icon={Box}
        description="Container Instance"
        title="orders-api"
      />
      <div className="mx-2.5 my-2 rounded-md bg-white/[0.04] p-2">
        <p className="text-[9px] tracking-[0.12em] text-zinc-500 uppercase">
          Image
        </p>
        <p className="truncate font-mono text-[11px] leading-4 text-zinc-200">
          ghcr.io/sealai/orders-api:2026.03.31
        </p>
      </div>
      <div className="flex items-center justify-end gap-1 border-b border-white/10 px-2.5 py-2">
        {[Plus, SquarePen, Ellipsis].map((Icon, index) => (
          <button
            key={index}
            className="grid size-6 place-items-center rounded-md bg-white/[0.045] text-zinc-400"
            type="button"
          >
            <Icon className="size-3.5" />
          </button>
        ))}
      </div>
      <MetricRow cpu="18%" memory="28%" storage="3" />
    </div>
  );
}

function DatabaseCard({
  className,
  leftActive,
  leftHandleRef,
}: {
  className: string;
  leftActive: boolean;
  leftHandleRef: RefObject<HTMLSpanElement>;
}) {
  return (
    <div
      className={cn(
        'absolute z-10 w-[182px] overflow-visible rounded-[6px] border border-white/10 bg-white/[0.05] shadow-2xl shadow-black/30 backdrop-blur-xl',
        className,
      )}
    >
      <Handle
        active={leftActive}
        handleRef={leftHandleRef}
        side="left"
        target="webHandle"
      />
      <CardHeader
        Icon={Database}
        description="Database PostgreSQL 16.4"
        title="orders-db"
      />
      <MetricRow cpu="18%" memory="28%" storage="28%" />
    </div>
  );
}

function CardHeader({
  description,
  Icon,
  title,
}: {
  description: string;
  Icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 p-2">
      <div className="grid size-6 place-items-center rounded-md bg-white/[0.06]">
        <Icon className="size-3.5 text-blue-200" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[12px] leading-4 text-zinc-100">{title}</p>
        <p className="truncate text-[10px] leading-3 text-zinc-500">
          {description}
        </p>
      </div>
      <Ellipsis className="size-3.5 text-zinc-500" />
    </div>
  );
}

function MetricRow({
  cpu,
  memory,
  storage,
}: {
  cpu: string;
  memory: string;
  storage: string;
}) {
  return (
    <div className="flex h-8 items-center justify-between px-2.5 text-[9px] text-zinc-400">
      <span className="flex items-center gap-1 text-emerald-400">
        <span className="size-2 rounded-full bg-emerald-400/30 p-[2px]">
          <span className="block size-full rounded-full bg-emerald-400" />
        </span>
        Running
      </span>
      <span className="flex items-center gap-1">
        <Cpu className="size-2.5" />
        {cpu}
      </span>
      <span className="flex items-center gap-1">
        <MemoryStick className="size-2.5" />
        {memory}
      </span>
      <span className="flex items-center gap-1">
        <HardDrive className="size-2.5" />
        {storage}
      </span>
    </div>
  );
}

function Handle({
  active = false,
  handleRef,
  side,
  target,
}: {
  active?: boolean;
  handleRef: RefObject<HTMLSpanElement>;
  side: 'left' | 'right';
  target?: string;
}) {
  return (
    <span
      ref={handleRef}
      data-demo-target={target}
      className={cn(
        'absolute top-1/2 z-20 grid -translate-y-1/2 place-items-center rounded-full backdrop-blur-lg transition-all duration-200',
        active
          ? 'size-2.5 border border-blue-400 bg-white/[0.05] text-blue-200 ring-[3px] ring-blue-400/20'
          : 'size-1.5 border border-white/35 bg-white/45',
        side === 'left'
          ? active
            ? '-left-[14px]'
            : '-left-[10px]'
          : active
            ? '-right-[14px]'
            : '-right-[10px]',
      )}
    >
      {active && <Plus className="size-[6px]" />}
    </span>
  );
}

function OrdersApiPanel({
  hasSelectedValue,
  menuHover,
  show,
  showMenu,
  updateReady,
}: {
  hasSelectedValue: boolean;
  menuHover: boolean;
  show: boolean;
  showMenu: boolean;
  updateReady: boolean;
}) {
  return (
    <div
      className={cn(
        'absolute top-[46px] right-0 bottom-0 z-30 w-[390px] overflow-hidden rounded-tl-xl border-t border-l border-white/[0.08] bg-[#13151C] shadow-[0_24px_80px_rgba(0,0,0,0.46)] transition-all duration-300',
        show
          ? 'blur-0 translate-x-0 opacity-100'
          : 'pointer-events-none translate-x-8 opacity-0 blur-md',
      )}
    >
      <div className="relative flex h-full flex-col overflow-hidden p-5">
        <div className="mb-4 flex shrink-0 items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Box className="size-3.5 text-blue-300" />
              <h3 className="text-sm font-semibold text-zinc-100">
                orders-api
              </h3>
            </div>
            <p className="mt-1.5 text-[11px] leading-4 text-zinc-500">
              Edit runtime configuration for the container instance.
            </p>
          </div>
          <button
            className="flex size-7 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500"
            type="button"
          >
            <X className="size-3.5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="space-y-3">
            <FormSection
              Icon={Server}
              description="Container image and runtime metadata."
              title="Image"
            >
              <div className="rounded-md border border-white/[0.08] bg-black/20 px-2.5 py-1.5 font-mono text-[11px] text-zinc-100">
                ghcr.io/sealai/orders-api:2026.03.31
              </div>
            </FormSection>

            <FormSection
              Icon={SquarePen}
              description="Use variables from connected resources."
              title="Environment Variables"
            >
              <div className="space-y-2.5">
                <div className="grid h-7 grid-cols-2 rounded-md bg-white/[0.045] p-0.5 text-[10px]">
                  <div className="grid place-items-center rounded-md bg-white/20 text-zinc-100">
                    List
                  </div>
                  <div className="grid place-items-center text-zinc-400">
                    Raw
                  </div>
                </div>
                <button
                  className="flex h-7 w-full items-center justify-center gap-2 rounded-md bg-white/[0.045] text-[11px] text-zinc-200"
                  type="button"
                >
                  <Plus className="size-3.5" />
                  Add
                </button>

                <div className="grid grid-cols-[1fr_1fr_28px] gap-1.5">
                  <div className="flex h-7 items-center rounded-md border border-white/[0.08] bg-black/20 px-2 text-[11px] text-zinc-100">
                    NEW_VARIABLE
                  </div>
                  <div
                    className={cn(
                      'relative flex h-7 min-w-0 items-center justify-between rounded-md border bg-black/20 px-2 text-[11px] text-zinc-100',
                      showMenu
                        ? 'border-blue-400/70 shadow-[0_0_0_3px_rgba(59,130,246,0.14)]'
                        : 'border-white/[0.08]',
                    )}
                  >
                    <span className="min-w-0 truncate">
                      {hasSelectedValue ? (
                        '${{orders-db.DATABASE_URL}}'
                      ) : (
                        <span className="text-zinc-600">Select variable</span>
                      )}
                    </span>
                    <button
                      data-demo-target="valueBrace"
                      className="ml-1 grid size-4 shrink-0 place-items-center rounded text-zinc-300"
                      type="button"
                    >
                      <Braces className="size-3.5" />
                    </button>
                  </div>
                  <button
                    className="grid size-7 place-items-center rounded-md bg-white/[0.045] text-zinc-200"
                    type="button"
                  >
                    <Ellipsis className="size-3.5" />
                  </button>
                </div>
              </div>
            </FormSection>

            <div className="flex items-center justify-between pl-2">
              <div className="flex items-center gap-2 text-[9px] text-zinc-500">
                <span className="size-1 rounded-full bg-zinc-400" />
                Unsaved change
              </div>
              <div className="flex gap-1.5">
                <button
                  className="h-8 rounded-lg bg-white/[0.05] px-3 text-[11px] text-zinc-300"
                  type="button"
                >
                  Discard
                </button>
                <button
                  data-demo-target="updateButton"
                  className={cn(
                    'flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] text-zinc-100',
                    updateReady
                      ? 'bg-blue-500 shadow-lg shadow-blue-500/20'
                      : 'bg-white/[0.05] opacity-50',
                  )}
                  type="button"
                >
                  {updateReady ? (
                    <Upload className="size-3.5" />
                  ) : (
                    <CheckCircle2 className="size-3.5" />
                  )}
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>

        <VariableMenu highlight={menuHover} show={showMenu} />
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
        <div className="grid size-7 place-items-center rounded-lg bg-white/[0.04] text-zinc-400">
          <Icon className="size-3.5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-[12px] font-medium text-zinc-100">{title}</h4>
          <p className="mt-1 text-[10px] leading-4 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function VariableMenu({
  highlight,
  show,
}: {
  highlight: boolean;
  show: boolean;
}) {
  return (
    <div
      className={cn(
        'absolute top-[368px] right-[82px] z-40 w-[203px] overflow-hidden rounded-md border border-white/[0.08] bg-[#11131A]/95 text-zinc-200 shadow-2xl shadow-black/45 backdrop-blur-xl transition-all duration-200',
        show
          ? 'blur-0 translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0 blur-md',
      )}
    >
      <div className="flex h-6 items-center border-b border-white/[0.08] px-2 text-[8px] text-zinc-500">
        Search
      </div>
      <div className="px-1.5 py-1 text-[8px]">
        <p className="px-1.5 py-1 text-zinc-500">orders-cache</p>
        <VariableItem name="REDIS_URL" description="Connection string" />
        <VariableItem name="REDIS_PASSWORD" description="Password secret" />
        <p className="px-1.5 py-1 text-zinc-500">orders-db</p>
        <VariableItem
          active={highlight}
          name="DATABASE_URL"
          description="Connection string"
          target="variableOption"
        />
        <VariableItem name="PG_USER" description="Username secret" />
      </div>
    </div>
  );
}

function VariableItem({
  active,
  name,
  description,
  target,
}: {
  active?: boolean;
  name: string;
  description: string;
  target?: string;
}) {
  return (
    <div
      data-demo-target={target}
      className={cn(
        'rounded-sm px-1.5 py-1',
        active && 'bg-blue-500/15 text-blue-100',
      )}
    >
      <p className="leading-3">{name}</p>
      <p className="leading-3 text-zinc-500">{description}</p>
    </div>
  );
}
