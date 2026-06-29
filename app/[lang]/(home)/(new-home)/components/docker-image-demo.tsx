'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  Box,
  Container,
  FileClock,
  FileCog,
  HardDrive,
  Network,
  Rocket,
  SquareTerminal,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

import {
  AddButton,
  DemoField,
  DemoStageShell,
  ModeSelectionScreen,
  screenTransition,
  useDemoPlayback,
  type CursorStep,
} from './deploy-demo-common';

type Screen = 'mode' | 'form';
type FieldId =
  | 'image'
  | 'command'
  | 'args'
  | 'runtimeKey'
  | 'runtimeValue'
  | 'port';

type DemoStep = CursorStep & {
  screen: Screen;
  activeField?: FieldId;
  clickTarget?: 'dockerCard' | 'runtimeAdd' | 'deploy';
  typed?: Partial<Record<FieldId, string>>;
  expandedRuntime?: boolean;
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

export function DockerImageDemo() {
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
    getTargetId: getStepTarget,
    steps: demoSteps,
  });
  const focusedField = getFocusedField(effectiveIndex, actionReady);
  const fieldText = (field: FieldId) =>
    reduceMotion
      ? finalTypedValues[field]
      : getFieldText(field, effectiveIndex, actionProgress);

  return (
    <DemoStageShell
      cursorPosition={cursorPosition}
      dataAttribute="data-docker-image-demo"
      reduceMotion={reduceMotion}
      stageRef={stageRef}
      step={step}
    >
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
              pressed={hoverReady && step.clickTarget === 'dockerCard'}
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
                Boolean(fieldText('runtimeKey') || fieldText('runtimeValue'))
              }
              image={fieldText('image')}
              port={fieldText('port')}
              runtimeKey={fieldText('runtimeKey')}
              runtimeValue={fieldText('runtimeValue')}
              runtimeAddPressed={
                actionReady && step.clickTarget === 'runtimeAdd'
              }
              deployPressed={actionReady && step.clickTarget === 'deploy'}
              success={step.success}
              targetId={targetId}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </DemoStageShell>
  );
}

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
