'use client';

import { type ReactNode } from 'react';
import Image from 'next/image';
import {
  Activity,
  Box,
  CalendarClock,
  ChevronDown,
  Cpu,
  Database,
  Download,
  FileText,
  HardDrive,
  MemoryStick,
  Network,
  PanelRightClose,
  Play,
  Search,
  Server,
  Settings2,
  Sheet,
  SquarePen,
  SquareTerminal,
  Upload,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

import MongoIcon from '@/assets/db-appicons/mongoicon.svg';
import MySqlIcon from '@/assets/db-appicons/mysqlicon.svg';
import PostgreSqlIcon from '@/assets/db-appicons/pgicon.svg';
import {
  DemoField,
  DemoStageShell,
  FormHeader,
  ModeSelectionScreen,
  SectionTitle,
  screenTransition,
  shortenDemoSteps,
  useDemoPlayback,
  type CursorStep,
} from './deploy-demo-common';
import { DeploymentCanvas } from './deployment-canvas';
import { DeploymentTimeline, databaseTimeline } from './deployment-timeline';
import {
  DemoMotion,
  DemoPanel,
  DeployAction,
  SelectDisplay,
  getFieldText,
  getPreviousField,
  type SelectOption,
} from './project-type-demo-common';

type DatabaseField = 'replicas';
type DatabaseScreen = 'mode' | 'form' | 'canvas' | 'logs' | 'ready';

type DatabaseStep = CursorStep & {
  screen: DatabaseScreen;
  activeField?: DatabaseField;
  clickTarget?:
    | 'databaseCard'
    | 'databaseType'
    | 'databasePreset'
    | 'deploy'
    | 'dbCard'
    | 'expandButton'
    | 'metricsButton'
    | 'terminalButton'
    | 'logsButton';
  databaseType?: boolean;
  preset?: boolean;
  typed?: Partial<Record<DatabaseField, string>>;
  deploying?: boolean;
  formClosed?: boolean;
  success?: boolean;
  readyStage?: number;
  cardExpanded?: boolean;
  configurePanel?: boolean;
  metricsPanel?: boolean;
  terminalPanel?: boolean;
};
const databaseFinalValues: Record<DatabaseField, string> = {
  replicas: '3',
};

const databaseTypeOptions: SelectOption[] = [
  { label: 'MySQL', icon: MySqlIcon },
  { label: 'PostgreSQL', icon: PostgreSqlIcon },
  { label: 'MongoDB', icon: MongoIcon },
];

const presetOptions: SelectOption[] = [
  { label: 'Small' },
  { label: 'Medium' },
  { label: 'Large' },
];

const databaseSteps: DatabaseStep[] = shortenDemoSteps<DatabaseStep>([
  { duration: 1200, screen: 'mode', cursor: { x: 50, y: 18 } },
  {
    duration: 900,
    screen: 'mode',
    cursor: { x: 48, y: 58 },
    clickTarget: 'databaseCard',
  },
  { duration: 700, screen: 'form', cursor: { x: 50, y: 28 }, holdCursor: true },
  {
    duration: 1800,
    screen: 'form',
    cursor: { x: 50, y: 29 },
    clickTarget: 'databaseType',
  },
  {
    duration: 900,
    screen: 'form',
    cursor: { x: 50, y: 29 },
    databaseType: true,
    holdCursor: true,
  },
  {
    duration: 1800,
    screen: 'form',
    cursor: { x: 42, y: 52 },
    databaseType: true,
    clickTarget: 'databasePreset',
  },
  {
    duration: 900,
    screen: 'form',
    cursor: { x: 42, y: 52 },
    databaseType: true,
    preset: true,
    holdCursor: true,
  },
  {
    duration: 900,
    screen: 'form',
    cursor: { x: 64, y: 52 },
    databaseType: true,
    preset: true,
    activeField: 'replicas',
    typed: { replicas: databaseFinalValues.replicas },
  },
  {
    duration: 800,
    screen: 'form',
    cursor: { x: 50, y: 82 },
    databaseType: true,
    preset: true,
    clickTarget: 'deploy',
  },
  {
    duration: 900,
    screen: 'form',
    cursor: { x: 50, y: 82 },
    databaseType: true,
    preset: true,
    deploying: true,
  },
  {
    duration: 1600,
    screen: 'form',
    cursor: { x: 62, y: 20 },
    databaseType: true,
    preset: true,
    success: true,
  },
  {
    duration: 900,
    screen: 'canvas',
    cursor: { x: 58, y: 40 },
    holdCursor: true,
  },
  {
    duration: 650,
    screen: 'canvas',
    cursor: { x: 36, y: 30 },
    clickTarget: 'expandButton',
  },
  {
    duration: 900,
    screen: 'canvas',
    cursor: { x: 48, y: 31 },
    cardExpanded: true,
    holdCursor: true,
  },
  {
    duration: 700,
    screen: 'canvas',
    cursor: { x: 39, y: 35 },
    cardExpanded: true,
    clickTarget: 'dbCard',
  },
  {
    duration: 1100,
    screen: 'canvas',
    cursor: { x: 54, y: 40 },
    cardExpanded: true,
    configurePanel: true,
    holdCursor: true,
  },
  {
    duration: 650,
    screen: 'canvas',
    cursor: { x: 52, y: 51 },
    cardExpanded: true,
    configurePanel: true,
    clickTarget: 'metricsButton',
  },
  {
    duration: 1100,
    screen: 'canvas',
    cursor: { x: 72, y: 34 },
    cardExpanded: true,
    metricsPanel: true,
    holdCursor: true,
  },
  {
    duration: 650,
    screen: 'canvas',
    cursor: { x: 56, y: 51 },
    cardExpanded: true,
    metricsPanel: true,
    clickTarget: 'terminalButton',
  },
  {
    duration: 1200,
    screen: 'canvas',
    cursor: { x: 55, y: 70 },
    cardExpanded: true,
    metricsPanel: true,
    terminalPanel: true,
    holdCursor: true,
  },
  {
    duration: 650,
    screen: 'canvas',
    cursor: { x: 60, y: 51 },
    cardExpanded: true,
    metricsPanel: true,
    terminalPanel: true,
    clickTarget: 'logsButton',
  },
  {
    duration: 3000,
    screen: 'logs',
    cursor: { x: 65, y: 28 },
    holdCursor: true,
  },
]);
const databaseTimelineSteps: DatabaseStep[] = shortenDemoSteps<DatabaseStep>([
  {
    duration: 700,
    screen: 'ready',
    cursor: { x: 58, y: 48 },
    readyStage: 0,
    holdCursor: true,
  },
  {
    duration: 800,
    screen: 'ready',
    cursor: { x: 58, y: 48 },
    readyStage: 1,
    holdCursor: true,
  },
  {
    duration: 800,
    screen: 'ready',
    cursor: { x: 58, y: 58 },
    readyStage: 2,
    holdCursor: true,
  },
  {
    duration: 800,
    screen: 'ready',
    cursor: { x: 58, y: 58 },
    readyStage: 3,
    holdCursor: true,
  },
  {
    duration: 800,
    screen: 'ready',
    cursor: { x: 58, y: 62 },
    readyStage: 4,
    holdCursor: true,
  },
  {
    duration: 800,
    screen: 'ready',
    cursor: { x: 58, y: 62 },
    readyStage: 5,
    holdCursor: true,
  },
  {
    duration: 900,
    screen: 'ready',
    cursor: { x: 58, y: 62 },
    readyStage: 6,
    holdCursor: true,
  },
  {
    duration: 1400,
    screen: 'ready',
    cursor: { x: 58, y: 62 },
    formClosed: true,
    readyStage: 6,
    holdCursor: true,
  },
]);

const baseDatabaseSteps = [
  ...databaseSteps.slice(0, 10),
  ...databaseTimelineSteps,
];
const extendedDatabaseSteps = databaseSteps.slice(2);

export const databaseDemoDurationMs = baseDatabaseSteps.reduce(
  (total, step) => total + step.duration,
  0,
);
export function DatabaseDemo({
  active = true,
  extended = false,
  shellChrome = 'browser',
}: {
  active?: boolean;
  extended?: boolean;
  shellChrome?: 'browser' | 'thin';
} = {}) {
  const steps = extended ? extendedDatabaseSteps : baseDatabaseSteps;
  const {
    actionProgress,
    actionReady,
    cursorPosition,
    effectiveIndex,
    hoverReady,
    reduceMotion,
    selectReady,
    stageRef,
    step,
  } = useDemoPlayback({
    active,
    getTargetId: getDatabaseTarget,
    steps,
  });
  const replicas = reduceMotion
    ? databaseFinalValues.replicas
    : getFieldText(
        'replicas',
        effectiveIndex,
        actionProgress,
        steps,
        databaseFinalValues,
      );
  const activeField = actionReady
    ? step.activeField
    : step.clickTarget === 'deploy' || step.deploying || step.success
      ? undefined
      : getPreviousField(effectiveIndex, steps);
  const readyStage = reduceMotion
    ? databaseTimeline.doneStage
    : step.readyStage;

  return (
    <DemoStageShell
      activeSidebar="database"
      background={
        step.screen === 'ready' ? (
          <DeploymentCanvas
            readyStage={readyStage ?? 0}
            shifted={!step.formClosed}
            variant="database"
          />
        ) : undefined
      }
      childrenMode={
        step.screen === 'canvas' || step.screen === 'logs'
          ? 'canvas'
          : 'floatingPanel'
      }
      cursorPosition={cursorPosition}
      dataAttribute="data-database-demo"
      floatingPanelOpen={!step.formClosed}
      hideProjects={
        step.screen === 'canvas' ||
        step.screen === 'logs' ||
        step.screen === 'ready'
      }
      maskVisible={!active}
      reduceMotion={reduceMotion}
      shellChrome={shellChrome}
      stageRef={stageRef}
      step={step}
    >
      <AnimatePresence mode="wait">
        {step.screen === 'mode' ? (
          <DemoMotion key="database-mode" direction="left">
            <ModeSelectionScreen
              activeCard="Database"
              pressed={hoverReady && step.clickTarget === 'databaseCard'}
            />
          </DemoMotion>
        ) : step.screen === 'form' ? (
          <DemoMotion key="database-form" direction="right">
            <DatabaseForm
              activeField={activeField}
              databaseTypeSelected={reduceMotion || Boolean(step.databaseType)}
              deployPressed={actionReady && step.clickTarget === 'deploy'}
              deploying={step.deploying}
              presetPressed={
                hoverReady && step.clickTarget === 'databasePreset'
              }
              presetReady={selectReady && step.clickTarget === 'databasePreset'}
              presetSelected={reduceMotion || Boolean(step.preset)}
              replicas={replicas}
              success={step.success}
              typePressed={step.clickTarget === 'databaseType'}
              typeReady={selectReady && step.clickTarget === 'databaseType'}
            />
          </DemoMotion>
        ) : step.screen === 'canvas' ? (
          <DemoMotion key="database-canvas" direction="left">
            <DatabaseCanvas
              activeTool={step.clickTarget}
              cardExpanded={Boolean(step.cardExpanded)}
              configurePanel={Boolean(step.configurePanel)}
              metricsPanel={Boolean(step.metricsPanel)}
              showExpand={step.clickTarget === 'expandButton'}
              terminalPanel={Boolean(step.terminalPanel)}
            />
          </DemoMotion>
        ) : step.screen === 'logs' ? (
          <DemoMotion key="database-logs" direction="right">
            <DatabaseLogsScreen />
          </DemoMotion>
        ) : (
          <DemoMotion key="database-ready" direction="right">
            <DeploymentTimeline
              config={databaseTimeline}
              readyStage={readyStage ?? 0}
            />
          </DemoMotion>
        )}
      </AnimatePresence>
    </DemoStageShell>
  );
}

function getDatabaseTarget(step: DatabaseStep) {
  if (step.clickTarget) return step.clickTarget;
  if (step.activeField) return step.activeField;
  if (step.deploying || step.success) return 'deploy';
}

function DatabaseForm({
  activeField,
  databaseTypeSelected,
  deployPressed,
  deploying,
  presetPressed,
  presetReady,
  presetSelected,
  replicas,
  success,
  typePressed,
  typeReady,
}: {
  activeField?: DatabaseField;
  databaseTypeSelected: boolean;
  deployPressed: boolean;
  deploying?: boolean;
  presetPressed: boolean;
  presetReady: boolean;
  presetSelected: boolean;
  replicas: string;
  success?: boolean;
  typePressed: boolean;
  typeReady: boolean;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden p-5">
      <FormHeader
        Icon={Database}
        title="Create Database"
        description="Choose a managed database engine and instance size."
      />

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="space-y-3">
          <DemoPanel>
            <SectionTitle
              Icon={Database}
              title="Type"
              description="Choose a managed database engine for this workspace."
            />
            <SelectDisplay
              className="mt-3"
              label={databaseTypeSelected ? 'MySQL' : 'Select database type'}
              muted={!databaseTypeSelected}
              options={databaseTypeOptions}
              pressed={typePressed}
              ready={typeReady}
              target="databaseType"
            />
          </DemoPanel>

          <DemoPanel>
            <SectionTitle
              Icon={Upload}
              title="Instance"
              description="MySQL instance specifications and replica count."
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <SelectDisplay
                fieldLabel="Instance Preset"
                label={presetSelected ? 'Small' : 'Select preset'}
                muted={!presetSelected}
                options={presetOptions}
                pressed={presetPressed}
                ready={presetReady}
                target="databasePreset"
              />
              <DemoField
                active={activeField === 'replicas'}
                label="Replicas"
                placeholder="2"
                target="replicas"
                value={replicas}
              />
            </div>
            <AnimatePresence>
              {presetSelected && (
                <motion.p
                  className="mt-2 text-[10px] leading-4 text-zinc-500"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={screenTransition}
                >
                  *Up to 0.5 CPU · 512 Mi · 3 Gi storage
                </motion.p>
              )}
            </AnimatePresence>
          </DemoPanel>

          <DeployAction
            deploying={deploying}
            pressed={deployPressed}
            success={success}
          />
        </div>
      </div>
    </div>
  );
}

function DatabaseCanvas({
  activeTool,
  cardExpanded,
  configurePanel,
  metricsPanel,
  showExpand,
  terminalPanel,
}: {
  activeTool?: DatabaseStep['clickTarget'];
  cardExpanded: boolean;
  configurePanel: boolean;
  metricsPanel: boolean;
  showExpand: boolean;
  terminalPanel: boolean;
}) {
  const showMetricsPanel = metricsPanel;
  const showTerminalPanel = terminalPanel;
  const panelOpen = configurePanel || showMetricsPanel;

  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        className="absolute top-[28%] left-[33%]"
        animate={{
          x: panelOpen ? -220 : 0,
          y: showTerminalPanel ? -42 : 0,
        }}
        transition={screenTransition}
      >
        <AnimatePresence>
          {(showExpand || cardExpanded) && !cardExpanded && (
            <motion.button
              data-demo-target="expandButton"
              aria-label="Expand database card"
              className="absolute top-0 -left-9 z-20 grid size-8 place-items-center rounded-md border border-white/10 bg-white/[0.05] text-blue-300 shadow-[0_12px_34px_rgba(0,0,0,0.32)] backdrop-blur-lg"
              initial={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 6, filter: 'blur(6px)' }}
              transition={screenTransition}
              type="button"
            >
              <PanelRightClose className="size-3 -rotate-90" aria-hidden />
            </motion.button>
          )}
        </AnimatePresence>

        <DatabaseRuntimeCard activeTool={activeTool} expanded={cardExpanded} />
      </motion.div>

      <AnimatePresence>
        {(configurePanel || showMetricsPanel) && (
          <DatabaseSidePanel
            key={showMetricsPanel ? 'metrics' : 'configure'}
            mode={showMetricsPanel ? 'metrics' : 'configure'}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTerminalPanel && <DatabaseTerminalPanel key="terminal" />}
      </AnimatePresence>
    </div>
  );
}

function DatabaseRuntimeCard({
  activeTool,
  expanded,
}: {
  activeTool?: DatabaseStep['clickTarget'];
  expanded: boolean;
}) {
  return (
    <motion.article
      data-demo-target="dbCard"
      className={cn(
        'relative overflow-visible rounded-md border bg-white/[0.05] shadow-[0_22px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl',
        expanded
          ? 'w-[214px] border-blue-400/70 bg-white/[0.07] shadow-[0_0_0_3px_rgba(59,130,246,0.16),0_22px_70px_rgba(0,0,0,0.34)]'
          : 'w-[204px] border-white/10',
      )}
      animate={{ width: expanded ? 214 : 204 }}
      transition={screenTransition}
    >
      <div className="flex items-center gap-2 border-b border-white/10 p-2">
        <span className="grid size-7 place-items-center rounded-md bg-white/[0.06]">
          <Image alt="" className="size-4" src={PostgreSqlIcon} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] leading-4 text-zinc-100">
            orders-api
          </span>
          <span className="block truncate text-[11px] leading-4 text-zinc-500">
            Database PostgreSQL 16.4
          </span>
        </span>
        <button
          className="grid size-6 place-items-center rounded-md bg-white/10 text-zinc-400"
          type="button"
        >
          <SquarePen className="size-3.5" aria-hidden />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="space-y-2 p-2"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={screenTransition}
          >
            <ConnectionBlock
              label="Private Connection"
              value="postgresql://p******:******@pg.internal:5432/postgresql-db"
            />
            <div className="rounded-md bg-white/10 p-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  Public Connection
                </span>
                <span className="flex h-[17px] w-[31px] items-center rounded-full bg-white/20 px-0.5">
                  <span className="size-3.5 rounded-full bg-zinc-200" />
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-1">
              <CardToolButton
                Icon={Activity}
                active={activeTool === 'metricsButton'}
                target="metricsButton"
              />
              <CardToolButton
                Icon={SquareTerminal}
                active={activeTool === 'terminalButton'}
                target="terminalButton"
              />
              <CardToolButton
                Icon={FileText}
                active={activeTool === 'logsButton'}
                target="logsButton"
              />
              <CardToolButton Icon={Sheet} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-t border-white/10 p-2 text-[10px]">
        <MetricPill dot label="Running" value="" />
        <MetricPill Icon={Cpu} value="18%" />
        <MetricPill Icon={MemoryStick} value="28%" />
        <MetricPill Icon={HardDrive} value="28%" />
      </div>
    </motion.article>
  );
}

function CardToolButton({
  active = false,
  Icon,
  target,
}: {
  active?: boolean;
  Icon: typeof Activity;
  target?: string;
}) {
  return (
    <button
      data-demo-target={target}
      className={cn(
        'grid size-6 place-items-center rounded-md bg-white/10 text-zinc-300 transition-colors',
        active && 'bg-white/20 text-blue-200 ring-1 ring-blue-400/40',
      )}
      type="button"
    >
      <Icon className="size-3.5" aria-hidden />
    </button>
  );
}

function ConnectionBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white/10 p-2">
      <p className="mb-1.5 text-[11px] text-zinc-500">{label}</p>
      <p className="truncate font-mono text-[10px] text-zinc-200">{value}</p>
    </div>
  );
}

function MetricPill({
  dot,
  Icon,
  label,
  value,
}: {
  dot?: boolean;
  Icon?: typeof Cpu;
  label?: string;
  value: string;
}) {
  return (
    <span
      className={cn(
        'flex items-center gap-1 text-zinc-500',
        dot && 'text-emerald-400',
      )}
    >
      {dot && (
        <span className="grid size-2.5 place-items-center rounded-full bg-emerald-400/25">
          <span className="size-1.5 rounded-full bg-emerald-400" />
        </span>
      )}
      {Icon && <Icon className="size-3" aria-hidden />}
      {label}
      {value}
    </span>
  );
}

function DatabaseSidePanel({ mode }: { mode: 'configure' | 'metrics' }) {
  const isMetrics = mode === 'metrics';

  return (
    <motion.aside
      className="absolute top-[46px] right-0 bottom-0 z-20 w-full max-w-lg overflow-hidden rounded-t-xl rounded-r-none border-t border-l border-white/[0.08] bg-[#13151C] shadow-[0_24px_80px_rgba(0,0,0,0.46)] max-sm:right-auto max-sm:left-[72px] max-sm:w-[300px]"
      initial={{ opacity: 0, x: 28, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
      transition={screenTransition}
    >
      <div className="h-full overflow-y-auto p-[15px]">
        <DatabasePanelHeader
          Icon={isMetrics ? Activity : Database}
          title={isMetrics ? 'orders-api Metrics' : 'Orders-api'}
          description={
            isMetrics
              ? 'PostgreSQL 16.4 · Last 60 minutes'
              : 'This is a introduction placeholder.'
          }
        />
        {isMetrics ? <MetricsPanelContent /> : <ConfigurePanelContent />}
      </div>
    </motion.aside>
  );
}

function DatabasePanelHeader({
  description,
  Icon,
  title,
}: {
  description: string;
  Icon: typeof Database;
  title: string;
}) {
  return (
    <div className="mb-5 flex shrink-0 items-start justify-between">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-blue-300" aria-hidden />
          <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
        </div>
        <p className="mt-2 text-[11px] leading-4 text-zinc-500">
          {description}
        </p>
      </div>
      <button
        className="flex size-7 items-center justify-center rounded-lg bg-white/[0.04] text-zinc-500"
        type="button"
      >
        <span className="text-lg leading-none">×</span>
      </button>
    </div>
  );
}

function ConfigurePanelContent() {
  return (
    <div className="space-y-4">
      <ConfigureSection Icon={Settings2} title="Replicas & Resources">
        <SliderSetting
          label="Number of Replicas"
          max="10"
          min="1"
          value="7 Replicas"
        />
        <SliderSetting
          Icon={Cpu}
          label="CPU"
          max="16"
          min="0.5"
          value="2 Cores"
        />
        <SliderSetting
          Icon={MemoryStick}
          label="Memory"
          max="32 Gi"
          min="512 Mi"
          value="4 Gi"
        />
      </ConfigureSection>

      <ConfigureSection Icon={HardDrive} title="Storage">
        <SliderSetting
          Icon={HardDrive}
          label="Storage"
          max="500 Gi"
          min="20 Gi"
          value="200 Gi"
        />
      </ConfigureSection>

      <ConfigureSection Icon={Network} title="Connection Address">
        <ConnectionAddressBlock
          label="Private Connection"
          value="postgresql://p******:******@pg.internal:5432/postgresql-db-fkn129"
        />
        <div className="mt-2 rounded-md bg-white/[0.05] p-3">
          <div className="flex h-7 items-center justify-between text-[11px] text-zinc-500">
            <span>Public Connection</span>
            <span className="flex h-[18px] w-[34px] items-center rounded-full bg-white/20 px-0.5">
              <span className="size-3.5 rounded-full bg-zinc-200" />
            </span>
          </div>
        </div>
      </ConfigureSection>

      <div className="flex justify-end gap-2 pt-1">
        <button
          className="h-8 rounded-lg bg-white/[0.05] px-3 text-[11px] text-zinc-200"
          type="button"
        >
          Discard
        </button>
        <button
          className="flex h-8 items-center gap-1.5 rounded-lg bg-white/[0.05] px-3 text-[11px] text-zinc-100"
          type="button"
        >
          <Upload className="size-3.5" aria-hidden />
          Update
        </button>
      </div>
    </div>
  );
}

function ConfigureSection({
  children,
  Icon,
  title,
}: {
  children: ReactNode;
  Icon: typeof Database;
  title: string;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10">
      <div className="flex h-9 items-center gap-2 border-b border-white/10 px-3">
        <Icon className="size-3.5 text-zinc-300" aria-hidden />
        <h4 className="text-[11px] font-medium text-zinc-100">{title}</h4>
      </div>
      <div className="space-y-2 p-2">{children}</div>
    </section>
  );
}

function SliderSetting({
  Icon,
  label,
  max,
  min,
  value,
}: {
  Icon?: typeof Cpu;
  label: string;
  max: string;
  min: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-white/[0.05] p-3">
      <div className="mb-2 flex h-6 items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-zinc-500">
          {Icon && <Icon className="size-3.5" aria-hidden />}
          {label}
        </span>
        <span className="text-zinc-100">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/20">
        <div className="relative h-full w-[72%] rounded-full bg-gradient-to-r from-blue-950 to-blue-500">
          <span className="absolute top-1/2 right-0 size-3 -translate-y-1/2 rounded-full border-2 border-zinc-950 bg-blue-500" />
        </div>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function ConnectionAddressBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-white/[0.05] p-3">
      <p className="mb-2 text-[11px] text-zinc-500">{label}</p>
      <p className="truncate font-mono text-[11px] text-zinc-100">{value}</p>
    </div>
  );
}

function MetricsPanelContent() {
  return (
    <div className="space-y-[11px]">
      <MetricAreaChart
        Icon={Cpu}
        label="CPU"
        value="0.9 / 2"
        state="Stable"
        percent="45%"
      />
      <MetricAreaChart
        Icon={MemoryStick}
        label="Memory"
        value="1.8Gi / 4Gi"
        state="Stable"
        percent="45%"
      />
      <MetricStorageCard />
    </div>
  );
}

function MetricAreaChart({
  Icon,
  label,
  percent,
  state,
  value,
}: {
  Icon: typeof Cpu;
  label: string;
  percent: string;
  state: string;
  value: string;
}) {
  return (
    <div className="h-[166px] overflow-hidden rounded-md bg-white/[0.05] p-3">
      <div className="mb-[18px] space-y-1">
        <div className="flex items-center justify-between text-[11px] leading-4">
          <span className="flex items-center gap-1.5 font-medium text-zinc-100">
            <Icon className="size-3" aria-hidden />
            {label}
          </span>
          <span className="text-zinc-100">{value}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] leading-4">
          <span className="text-zinc-500">{state}</span>
          <span className="text-zinc-100">{percent}</span>
        </div>
      </div>
      <div className="relative h-[76px]">
        <div className="absolute inset-x-0 top-6 border-t border-white/10" />
        <div className="absolute inset-x-0 top-[50px] border-t border-white/10" />
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 436 76"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M0 42 C70 24 145 14 218 46 C292 76 342 28 436 39 L436 76 L0 76 Z"
            fill="rgba(59,130,246,0.42)"
          />
          <path
            d="M0 42 C70 24 145 14 218 46 C292 76 342 28 436 39"
            fill="none"
            stroke="#60a5fa"
            strokeWidth="1.2"
          />
        </svg>
      </div>
      <div className="mt-1 flex justify-between text-[11px] leading-4 text-zinc-500">
        <span>Now</span>
        <span>-60m</span>
      </div>
    </div>
  );
}

function MetricStorageCard() {
  return (
    <div className="rounded-md bg-white/[0.05] p-3">
      <div className="mb-[18px] space-y-1">
        <div className="flex items-center justify-between text-[11px] leading-4">
          <span className="flex items-center gap-1.5 font-medium text-zinc-100">
            <HardDrive className="size-3" aria-hidden />
            Storage
          </span>
          <span className="text-zinc-100">7.6Gi / 20Gi</span>
        </div>
        <div className="flex items-center justify-between text-[11px] leading-4">
          <span className="text-zinc-500">
            Mounted directory: /var/lib/orders
          </span>
          <span className="text-zinc-100">38%</span>
        </div>
      </div>
      <div className="h-[24px] overflow-hidden rounded bg-white/[0.05]">
        <div className="h-full w-[33%] rounded-r-md bg-blue-400/50" />
      </div>
    </div>
  );
}

function DatabaseTerminalPanel() {
  return (
    <motion.div
      className="absolute right-0 bottom-0 left-0 z-40 h-[267px] border-t border-white/10 bg-[#080a11] font-mono text-[11px] text-zinc-300 shadow-[0_-18px_60px_rgba(0,0,0,0.36)]"
      initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
      transition={screenTransition}
    >
      <div className="flex h-[43px] items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-2 text-zinc-200">
          <SquareTerminal className="size-3.5" aria-hidden />
          orders-api
        </div>
        <span className="text-[11px] text-zinc-500">PostgreSQL 16.4</span>
      </div>
      <div className="space-y-1 p-4">
        <p>sealai@orders-api:/app$ /bin/sh</p>
        <p>Using image ghcr.io/sealai/orders-api:2026.03.31</p>
        <p>Replicas 1 copy - 2 CPU / 4Gi</p>
        <p>env&gt; PORT=3000</p>
        <p>
          env&gt; DATABASE_URL=postgres://orders:****@pg-ha.internal:5432/orders
        </p>
        <p className="text-emerald-300">[ready] health check passed</p>
      </div>
      <div className="hidden">
        <SquareTerminal className="size-3.5" aria-hidden />
        terminal
      </div>
    </motion.div>
  );
}

function DatabaseLogsScreen() {
  const rows = [
    ['2026/06/03 16:39:27', 'INFO: Server started on port 3000'],
    ['2026/06/03 16:39:27', 'INFO: Server started on port 3000'],
    ['2026/06/03 16:39:27', 'INFO: Server started on port 3000'],
    ['2026/06/03 16:39:27', 'INFO: Server started on port 3000'],
    ['2026/06/03 16:39:27', 'INFO: Server started on port 3000...'],
  ];

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-[#0A0A0A] text-zinc-100">
      <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(29,78,216,0.2)_0%,rgba(10,10,10,0.2)_100%)]" />
      <div className="relative z-10 flex h-10 items-center justify-between border-b border-white/10 px-2">
        <div className="flex items-center gap-1.5 rounded px-2 py-1.5">
          <FileText className="size-4 text-blue-300" aria-hidden />
          <span className="text-sm font-semibold">Logs</span>
        </div>
        <span className="text-[11px] font-medium">orders-api</span>
        <button
          className="grid size-7 place-items-center rounded-md"
          type="button"
        >
          <X className="size-3.5 text-zinc-300" aria-hidden />
        </button>
      </div>

      <div className="relative z-10 flex-1 overflow-hidden p-3">
        <div className="mb-5 flex items-center gap-2">
          <LogsSelect Icon={Server} label="Pod" />
          <LogsSelect Icon={Box} label="Container" />
          <LogsSelect Icon={CalendarClock} label="Custom" />
          <div className="flex h-7 min-w-0 flex-1 items-center gap-2 rounded border border-white/10 px-2 text-[11px] text-zinc-500">
            <Search className="size-3.5" aria-hidden />
            Search
          </div>
          <IconAction Icon={Play} />
          <IconAction Icon={Download} />
        </div>

        <div className="relative mb-6 h-[92px] pl-8 text-[10px] text-zinc-500">
          <div className="absolute top-1 left-0">32</div>
          <div className="absolute top-8 left-0">16</div>
          <div className="absolute top-[58px] left-0">0</div>
          <div className="absolute top-3 right-0 left-7 border-t border-white/10" />
          <div className="absolute top-10 right-0 left-7 border-t border-white/10" />
          <svg
            className="absolute top-8 right-0 left-7 h-10 w-[calc(100%-1.75rem)] overflow-visible"
            viewBox="0 0 690 40"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0 30 C70 28 92 18 152 22 C218 26 242 8 302 14 C372 21 398 34 462 26 C528 18 558 12 620 19 C652 22 672 20 690 16"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1.2"
            />
          </svg>
          <div className="absolute top-[70px] right-0 left-7 flex justify-between text-[9px] tracking-[0.38px]">
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index}>11:00</span>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-t-md border border-white/10 border-b-transparent">
          <div className="grid h-9 grid-cols-[145px_1fr_76px_86px] bg-white/[0.05] text-[10px] font-medium text-zinc-500">
            <div className="flex items-center border-r border-white/10 px-3">
              Time
            </div>
            <div className="flex items-center border-r border-white/10 px-3">
              Message
            </div>
            <div className="flex items-center border-r border-white/10 px-3">
              Pod
            </div>
            <div className="flex items-center px-3">Container</div>
          </div>
          {rows.map(([time, message], index) => (
            <div
              key={`${time}-${index}`}
              className="grid h-10 grid-cols-[145px_1fr_76px_86px] border-b border-white/10 text-[9px] font-medium"
            >
              <div className="flex items-center border-r border-white/10 px-3">
                {time}
              </div>
              <div className="flex min-w-0 items-center border-r border-white/10 px-3">
                <span className="truncate">
                  <span className="text-blue-400">INFO:</span>
                  {message.slice(5)}
                </span>
              </div>
              <div className="flex items-center border-r border-white/10 px-3">
                runtime
              </div>
              <div className="flex items-center px-3">app</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogsSelect({ Icon, label }: { Icon: typeof Server; label: string }) {
  return (
    <button
      className="flex h-7 items-center gap-1.5 rounded border border-white/10 px-2.5 text-[11px] text-zinc-100"
      type="button"
    >
      <Icon className="size-3.5 text-zinc-300" aria-hidden />
      {label}
      <ChevronDown className="size-3.5 text-zinc-400" aria-hidden />
    </button>
  );
}

function IconAction({ Icon }: { Icon: typeof Play }) {
  return (
    <button
      className="grid size-7 place-items-center rounded-md bg-white/[0.05] text-zinc-300"
      type="button"
    >
      <Icon className="size-3.5" aria-hidden />
    </button>
  );
}
