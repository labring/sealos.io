'use client';

import { AnimatePresence, motion } from 'motion/react';
import { PanelsTopLeft, SquarePen } from 'lucide-react';

import BytebaseIcon from '/public/images/apps/bytebase.svg';
import GrafanaIcon from '/public/images/apps/grafana-otel.svg';
import OpenClawIcon from '/public/images/apps/openclaw.svg';
import FastGPTIcon from '@/assets/aiagent-appicons/fastgpt.svg';
import N8NIcon from '@/assets/aiagent-appicons/n8n.svg';
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
import { DeploymentTimeline, templateTimeline } from './deployment-timeline';
import {
  DemoMotion,
  DemoPanel,
  DeployAction,
  SelectDisplay,
  getFieldText,
  getPreviousField,
  type SelectOption,
} from './project-type-demo-common';

type TemplateField = 'rootPassword' | 'sandboxUrl' | 'sandboxToken';
type ProjectScreen = 'mode' | 'form' | 'ready';

type TemplateStep = CursorStep & {
  screen: ProjectScreen;
  activeField?: TemplateField;
  clickTarget?: 'templateCard' | 'templateSelect' | 'deploy';
  selected?: boolean;
  parameters?: boolean;
  typed?: Partial<Record<TemplateField, string>>;
  deploying?: boolean;
  formClosed?: boolean;
  success?: boolean;
  readyStage?: number;
};
const templateFinalValues: Record<TemplateField, string> = {
  rootPassword: 'sealos-root-2026',
  sandboxUrl: 'https://agent-sandbox.sealos.run',
  sandboxToken: 'sk-live-fastgpt-demo',
};

const templateOptions: SelectOption[] = [
  { label: 'FastGPT', icon: FastGPTIcon },
  { label: 'ByteBase', icon: BytebaseIcon },
  { label: 'Grafana OpenTelemetry Stack', icon: GrafanaIcon },
  { label: 'OpenClaw', icon: OpenClawIcon },
  { label: 'N8N', icon: N8NIcon },
];

const templateSteps: TemplateStep[] = shortenDemoSteps<TemplateStep>([
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
    duration: 700,
    screen: 'ready',
    cursor: { x: 58, y: 48 },
    selected: true,
    parameters: true,
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
    cursor: { x: 58, y: 64 },
    readyStage: 4,
    holdCursor: true,
  },
  {
    duration: 800,
    screen: 'ready',
    cursor: { x: 58, y: 64 },
    readyStage: 5,
    holdCursor: true,
  },
  {
    duration: 800,
    screen: 'ready',
    cursor: { x: 58, y: 64 },
    readyStage: 6,
    holdCursor: true,
  },
  {
    duration: 800,
    screen: 'ready',
    cursor: { x: 58, y: 72 },
    readyStage: 7,
    holdCursor: true,
  },
  {
    duration: 900,
    screen: 'ready',
    cursor: { x: 58, y: 72 },
    readyStage: 8,
    holdCursor: true,
  },
  {
    duration: 1400,
    screen: 'ready',
    cursor: { x: 58, y: 72 },
    formClosed: true,
    readyStage: 8,
    holdCursor: true,
  },
]);

export const templateDemoDurationMs = templateSteps.reduce(
  (total, step) => total + step.duration,
  0,
);

export function TemplateDemo({ active = true }: { active?: boolean }) {
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
  const readyStage = reduceMotion
    ? templateTimeline.doneStage
    : step.readyStage;

  return (
    <DemoStageShell
      activeSidebar="template"
      background={
        step.screen === 'ready' ? (
          <DeploymentCanvas
            readyStage={readyStage ?? 0}
            shifted={!step.formClosed}
            variant="template"
          />
        ) : undefined
      }
      cursorPosition={cursorPosition}
      dataAttribute="data-template-demo"
      floatingPanelOpen={!step.formClosed}
      hideProjects={step.screen === 'ready'}
      maskVisible={!active}
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
        ) : step.screen === 'form' ? (
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
              templatePressed={step.clickTarget === 'templateSelect'}
              templateReady={
                selectReady && step.clickTarget === 'templateSelect'
              }
            />
          </DemoMotion>
        ) : (
          <DemoMotion key="template-ready" direction="right">
            <DeploymentTimeline
              config={templateTimeline}
              readyStage={readyStage ?? 0}
            />
          </DemoMotion>
        )}
      </AnimatePresence>
    </DemoStageShell>
  );
}

function getTemplateTarget(step: TemplateStep) {
  if (step.clickTarget) return step.clickTarget;
  if (step.activeField) return step.activeField;
  if (step.deploying || step.success) return 'deploy';
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
