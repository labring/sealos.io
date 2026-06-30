'use client';

import { type ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import {
  CheckCircle2,
  ChevronDown,
  Database,
  PanelsTopLeft,
  Rocket,
  SquarePen,
  Upload,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

import BytebaseIcon from '/public/images/apps/bytebase.svg';
import GrafanaIcon from '/public/images/apps/grafana-otel.svg';
import OpenClawIcon from '/public/images/apps/openclaw.svg';
import FastGPTIcon from '@/assets/aiagent-appicons/fastgpt.svg';
import N8NIcon from '@/assets/aiagent-appicons/n8n.svg';
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
  useDemoPlayback,
  type CursorStep,
} from './deploy-demo-common';

type DatabaseField = 'replicas';
type TemplateField = 'rootPassword' | 'sandboxUrl' | 'sandboxToken';
type ProjectScreen = 'mode' | 'form';
type SelectOption = {
  icon?: StaticImageData | string;
  label: string;
};

type DatabaseStep = CursorStep & {
  screen: ProjectScreen;
  activeField?: DatabaseField;
  clickTarget?: 'databaseCard' | 'databaseType' | 'databasePreset' | 'deploy';
  databaseType?: boolean;
  preset?: boolean;
  typed?: Partial<Record<DatabaseField, string>>;
  deploying?: boolean;
  success?: boolean;
};

type TemplateStep = CursorStep & {
  screen: ProjectScreen;
  activeField?: TemplateField;
  clickTarget?: 'templateCard' | 'templateSelect' | 'deploy';
  selected?: boolean;
  parameters?: boolean;
  typed?: Partial<Record<TemplateField, string>>;
  deploying?: boolean;
  success?: boolean;
};

const databaseFinalValues: Record<DatabaseField, string> = {
  replicas: '3',
};

const templateFinalValues: Record<TemplateField, string> = {
  rootPassword: 'sealos-root-2026',
  sandboxUrl: 'https://agent-sandbox.sealos.run',
  sandboxToken: 'sk-live-fastgpt-demo',
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

const templateOptions: SelectOption[] = [
  { label: 'FastGPT', icon: FastGPTIcon },
  { label: 'ByteBase', icon: BytebaseIcon },
  { label: 'Grafana OpenTelemetry Stack', icon: GrafanaIcon },
  { label: 'OpenClaw', icon: OpenClawIcon },
  { label: 'N8N', icon: N8NIcon },
];

const databaseSteps: DatabaseStep[] = [
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
];

const templateSteps: TemplateStep[] = [
  { duration: 1200, screen: 'mode', cursor: { x: 50, y: 18 } },
  {
    duration: 900,
    screen: 'mode',
    cursor: { x: 48, y: 41 },
    clickTarget: 'templateCard',
  },
  { duration: 700, screen: 'form', cursor: { x: 50, y: 28 }, holdCursor: true },
  {
    duration: 1800,
    screen: 'form',
    cursor: { x: 50, y: 29 },
    clickTarget: 'templateSelect',
  },
  {
    duration: 900,
    screen: 'form',
    cursor: { x: 50, y: 29 },
    selected: true,
    holdCursor: true,
  },
  {
    duration: 1300,
    screen: 'form',
    cursor: { x: 44, y: 58 },
    selected: true,
    parameters: true,
    activeField: 'rootPassword',
    typed: { rootPassword: templateFinalValues.rootPassword },
  },
  {
    duration: 1500,
    screen: 'form',
    cursor: { x: 44, y: 68 },
    selected: true,
    parameters: true,
    activeField: 'sandboxUrl',
    typed: { sandboxUrl: templateFinalValues.sandboxUrl },
  },
  {
    duration: 1300,
    screen: 'form',
    cursor: { x: 44, y: 78 },
    selected: true,
    parameters: true,
    activeField: 'sandboxToken',
    typed: { sandboxToken: templateFinalValues.sandboxToken },
  },
  {
    duration: 800,
    screen: 'form',
    cursor: { x: 50, y: 88 },
    selected: true,
    parameters: true,
    clickTarget: 'deploy',
  },
  {
    duration: 900,
    screen: 'form',
    cursor: { x: 50, y: 88 },
    selected: true,
    parameters: true,
    deploying: true,
  },
  {
    duration: 1600,
    screen: 'form',
    cursor: { x: 62, y: 20 },
    selected: true,
    parameters: true,
    success: true,
  },
];

export function DatabaseDemo() {
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
    getTargetId: getDatabaseTarget,
    steps: databaseSteps,
  });
  const replicas = reduceMotion
    ? databaseFinalValues.replicas
    : getFieldText(
        'replicas',
        effectiveIndex,
        actionProgress,
        databaseSteps,
        databaseFinalValues,
      );
  const activeField = actionReady
    ? step.activeField
    : step.clickTarget === 'deploy' || step.deploying || step.success
      ? undefined
      : getPreviousField(effectiveIndex, databaseSteps);

  return (
    <DemoStageShell
      activeSidebar="database"
      cursorPosition={cursorPosition}
      dataAttribute="data-database-demo"
      reduceMotion={reduceMotion}
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
        ) : (
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
              typePressed={hoverReady && step.clickTarget === 'databaseType'}
              typeReady={selectReady && step.clickTarget === 'databaseType'}
            />
          </DemoMotion>
        )}
      </AnimatePresence>
    </DemoStageShell>
  );
}

export function TemplateDemo() {
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
    getTargetId: getTemplateTarget,
    steps: templateSteps,
  });
  const activeField = actionReady
    ? step.activeField
    : step.clickTarget === 'deploy' || step.deploying || step.success
      ? undefined
      : getPreviousField(effectiveIndex, templateSteps);
  const fieldText = (field: TemplateField) =>
    reduceMotion
      ? templateFinalValues[field]
      : getFieldText(
          field,
          effectiveIndex,
          actionProgress,
          templateSteps,
          templateFinalValues,
        );

  return (
    <DemoStageShell
      activeSidebar="template"
      cursorPosition={cursorPosition}
      dataAttribute="data-template-demo"
      reduceMotion={reduceMotion}
      stageRef={stageRef}
      step={step}
    >
      <AnimatePresence mode="wait">
        {step.screen === 'mode' ? (
          <DemoMotion key="template-mode" direction="left">
            <ModeSelectionScreen
              activeCard="Templates"
              pressed={hoverReady && step.clickTarget === 'templateCard'}
            />
          </DemoMotion>
        ) : (
          <DemoMotion key="template-form" direction="right">
            <TemplateForm
              activeField={activeField}
              deployPressed={actionReady && step.clickTarget === 'deploy'}
              deploying={step.deploying}
              parametersVisible={reduceMotion || Boolean(step.parameters)}
              rootPassword={fieldText('rootPassword')}
              sandboxToken={fieldText('sandboxToken')}
              sandboxUrl={fieldText('sandboxUrl')}
              selected={reduceMotion || Boolean(step.selected)}
              success={step.success}
              templatePressed={
                hoverReady && step.clickTarget === 'templateSelect'
              }
              templateReady={
                selectReady && step.clickTarget === 'templateSelect'
              }
            />
          </DemoMotion>
        )}
      </AnimatePresence>
    </DemoStageShell>
  );
}

function getFieldText<TField extends string>(
  field: TField,
  index: number,
  progress: number,
  steps: Array<{
    activeField?: TField;
    typed?: Partial<Record<TField, string>>;
  }>,
  finalValues: Record<TField, string>,
) {
  const step = steps[index];
  const target = getLatestFieldValue(field, index, steps);

  if (step.activeField !== field || step.typed?.[field] === undefined) {
    return target;
  }

  const previous = getLatestFieldValue(field, index - 1, steps);
  const next = step.typed[field] ?? finalValues[field];
  const localProgress = Math.min(1, Math.max(0, progress));

  if (next.startsWith(previous)) {
    const added = next.slice(previous.length);
    return previous + added.slice(0, Math.round(added.length * localProgress));
  }

  return next.slice(0, Math.round(next.length * localProgress));
}

function getLatestFieldValue<TField extends string>(
  field: TField,
  index: number,
  steps: Array<{ typed?: Partial<Record<TField, string>> }>,
) {
  for (let i = index; i >= 0; i -= 1) {
    const value = steps[i]?.typed?.[field];
    if (value !== undefined) return value;
  }

  return '';
}

function getPreviousField<TField extends string>(
  index: number,
  steps: Array<{ activeField?: TField }>,
) {
  for (let i = index - 1; i >= 0; i -= 1) {
    const field = steps[i]?.activeField;
    if (field) return field;
  }
}

function getDatabaseTarget(step: DatabaseStep) {
  if (step.clickTarget) return step.clickTarget;
  if (step.activeField) return step.activeField;
  if (step.deploying || step.success) return 'deploy';
}

function getTemplateTarget(step: TemplateStep) {
  if (step.clickTarget) return step.clickTarget;
  if (step.activeField) return step.activeField;
  if (step.deploying || step.success) return 'deploy';
}

function DemoMotion({
  children,
  direction,
}: {
  children: ReactNode;
  direction: 'left' | 'right';
}) {
  const x = direction === 'left' ? -16 : 24;

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, x, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x, filter: 'blur(8px)' }}
      transition={screenTransition}
    >
      {children}
    </motion.div>
  );
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

function TemplateForm({
  activeField,
  deployPressed,
  deploying,
  parametersVisible,
  rootPassword,
  sandboxToken,
  sandboxUrl,
  selected,
  success,
  templatePressed,
  templateReady,
}: {
  activeField?: TemplateField;
  deployPressed: boolean;
  deploying?: boolean;
  parametersVisible: boolean;
  rootPassword: string;
  sandboxToken: string;
  sandboxUrl: string;
  selected: boolean;
  success?: boolean;
  templatePressed: boolean;
  templateReady: boolean;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden p-5">
      <FormHeader
        Icon={PanelsTopLeft}
        title="Create New Project"
        description="Select the project creation method."
      />

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="space-y-3">
          <DemoPanel>
            <SectionTitle
              Icon={PanelsTopLeft}
              title="Template"
              description="Choose a ready-to-run app stack."
            />
            <SelectDisplay
              className="mt-3"
              label={selected ? 'FastGPT' : 'Select template'}
              muted={!selected}
              options={templateOptions}
              pressed={templatePressed}
              ready={templateReady}
              target="templateSelect"
            />
            <AnimatePresence>
              {selected && (
                <motion.p
                  className="mt-2 text-[11px] leading-4 text-zinc-500"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={screenTransition}
                >
                  FastGPT is an open-source AI knowledge base and workflow
                  platform with RAG retrieval, model orchestration, MCP access,
                  and plugin extensibility.
                </motion.p>
              )}
            </AnimatePresence>
          </DemoPanel>

          <AnimatePresence initial={false}>
            {parametersVisible && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={screenTransition}
              >
                <DemoPanel>
                  <SectionTitle
                    Icon={SquarePen}
                    title="Parameters"
                    description="Provide template parameters before deploying."
                  />
                  <div className="mt-3 space-y-3">
                    <DemoField
                      active={activeField === 'rootPassword'}
                      label="root_password"
                      placeholder="Root account password"
                      target="rootPassword"
                      value={rootPassword}
                    />
                    <DemoField
                      active={activeField === 'sandboxUrl'}
                      label="agent_sandbox_baseurl"
                      placeholder="Hosted agent sandbox base URL"
                      target="sandboxUrl"
                      value={sandboxUrl}
                    />
                    <DemoField
                      active={activeField === 'sandboxToken'}
                      label="agent_sandbox_token"
                      placeholder="Hosted agent sandbox access token"
                      target="sandboxToken"
                      value={sandboxToken}
                    />
                  </div>
                </DemoPanel>
              </motion.div>
            )}
          </AnimatePresence>

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

function DemoPanel({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-lg border border-white/[0.07] bg-[#1E2026] p-3">
      {children}
    </section>
  );
}

function SelectDisplay({
  className,
  fieldLabel,
  label,
  muted = false,
  options,
  pressed = false,
  ready = false,
  target,
}: {
  className?: string;
  fieldLabel?: string;
  label: string;
  muted?: boolean;
  options: SelectOption[];
  pressed?: boolean;
  ready?: boolean;
  target: string;
}) {
  const selectedOption = options.find((option) => option.label === label);

  return (
    <div className={cn('relative', className)}>
      {fieldLabel && (
        <span className="mb-1 block text-[10px] text-zinc-400">
          {fieldLabel}
        </span>
      )}
      <button
        data-demo-target={target}
        className={cn(
          'flex h-8 w-full items-center justify-between gap-2 rounded-md border px-3 text-left text-[11px] transition-colors',
          pressed
            ? 'border-blue-400/60 bg-blue-500/10 text-zinc-100 shadow-[0_0_0_3px_rgba(59,130,246,0.14)]'
            : 'border-white/[0.08] bg-black/20 text-zinc-100',
          muted && 'text-zinc-600',
        )}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-2">
          {selectedOption?.icon && (
            <Image
              alt=""
              className="size-4 shrink-0 rounded-sm"
              src={selectedOption.icon}
            />
          )}
          <span className="truncate">{label}</span>
        </span>
        <ChevronDown className="size-3.5 shrink-0 text-zinc-500" aria-hidden />
      </button>
      <AnimatePresence>
        {pressed && (
          <motion.div
            className="absolute right-0 left-0 z-20 mt-1 overflow-hidden rounded-md border border-white/[0.08] bg-[#11131A] p-1 shadow-[0_14px_40px_rgba(0,0,0,0.32)]"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={screenTransition}
          >
            {options.map((option, index) => (
              <div
                key={option.label}
                className={cn(
                  'flex h-7 items-center gap-2 rounded-sm px-2 text-[11px]',
                  ready && index === 0
                    ? 'bg-blue-500/15 text-blue-200'
                    : 'text-zinc-400',
                )}
              >
                {option.icon && (
                  <Image
                    alt=""
                    className="size-4 shrink-0 rounded-sm"
                    src={option.icon}
                  />
                )}
                <span className="truncate">{option.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeployAction({
  deploying,
  pressed,
  success,
}: {
  deploying?: boolean;
  pressed: boolean;
  success?: boolean;
}) {
  return (
    <button
      data-demo-target="deploy"
      className={cn(
        'flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-blue-500 text-[12px] font-medium text-white shadow-lg shadow-blue-500/20',
        pressed && 'bg-blue-400',
        success && 'bg-emerald-500 shadow-emerald-500/20',
      )}
      type="button"
    >
      {success ? (
        <CheckCircle2 className="size-3.5" aria-hidden />
      ) : (
        <Rocket className="size-3.5" aria-hidden />
      )}
      {deploying ? 'Deploying...' : success ? 'Deployed' : 'Deploy'}
    </button>
  );
}
