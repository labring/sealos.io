import Image from 'next/image';
import { GodRays } from '@/new-components/GodRays';
import {
  ArrowRightIcon,
  CheckIcon,
  LoopIcon,
  PaperPlaneIcon,
  CodeIcon,
} from '@radix-ui/react-icons';
import {
  COMPATIBILITY,
  DEPLOY_COMMAND,
  DEPLOY_PATH,
  DIRECT_DEPLOY_COMMAND,
  INSTALL_COMMAND,
  PIPELINE_NOTES,
  RUN_STATES,
  UPDATE_PATH,
} from './content';
import { CopyCommandButton } from './copy-command';
import { EmptyPreview, ErrorPreview, SkeletonPreview } from './state-previews';
import {
  AgentLogoStack,
  type AgentLogoKey,
  CodeGlyph,
  CommandStrip,
  Eyebrow,
  ICONS,
  RepositoryLink,
  SectionShell,
  SkillCommandCard,
  StateBadge,
  TextLink,
  WarningIcon,
} from './shared';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-36 pb-32">
      <GodRays
        sources={[
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 20,
            count: 12,
            color: '220, 220, 220',
            opacityMin: 0.24,
            opacityMax: 0.25,
            minWidth: 120,
            maxWidth: 180,
          },
          {
            x: -0.05,
            y: -0.05,
            angle: 60,
            spread: 8,
            count: 6,
            color: '255, 255, 255',
            opacityMin: 0.89,
            opacityMax: 0.9,
            minWidth: 12,
            maxWidth: 24,
          },
          {
            x: 0.25,
            y: -0.06,
            angle: 50,
            spread: 20,
            count: 6,
            color: '180, 180, 180',
            opacityMin: 0.14,
            opacityMax: 0.15,
            minWidth: 60,
            maxWidth: 120,
          },
        ]}
        speed={0}
        maxWidth={48}
        minLength={1200}
        maxLength={2000}
        blur={8}
      />
      <div className="relative z-10 container">
        <div className="pointer-events-none absolute inset-x-4 top-24 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="max-w-3xl min-w-0">
            <div className="mb-8 flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Sealos"
                width={40}
                height={40}
                priority
              />
              <span className="text-sm font-semibold tracking-[0.22em] text-zinc-100 uppercase">
                Sealos <span className="text-[#4CAFE1]">Skills</span>
              </span>
            </div>
            <Eyebrow className="mb-6">
              Agent deploy plugin for Sealos Cloud
            </Eyebrow>
            <h1 className="max-w-[760px] text-[4rem] leading-[0.98] font-medium text-balance text-zinc-100 sm:text-7xl lg:text-[5.45rem]">
              Deploy from your agent
            </h1>
            <p className="mt-8 max-w-[62ch] text-base leading-7 text-pretty text-zinc-400 sm:text-xl sm:leading-8">
              Sealos Skills is an open-source deploy plugin that gives AI
              coding agents a concrete path from source code to Sealos Cloud. It
              lets an agent inspect a local repo or GitHub URL, create the right
              Docker and Sealos template artifacts, deploy to Sealos Cloud, then
              verify the running app.
            </p>
            <div className="mt-10 grid min-w-0 gap-4 sm:max-w-2xl">
              <CommandStrip />
              <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <SkillCommandCard />
                <RepositoryLink label="View source" />
              </div>
            </div>
          </div>
          <HeroTerminal />
        </div>
      </div>
    </section>
  );
}

export function CompatibilitySection() {
  return (
    <SectionShell className="py-16 sm:py-24" id="compatibility">
      <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
        <div className="relative rounded-[2rem] border border-white/10 bg-[#080A0C]/82 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_36px_100px_rgba(0,26,41,0.42)] transition duration-300 hover:border-white/16">
          <div className="absolute inset-y-8 left-4 hidden w-10 border-r border-white/10 lg:block">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium tracking-[0.13em] whitespace-nowrap text-zinc-400">
              file + terminal access
            </span>
          </div>
          <div className="overflow-hidden rounded-[1.45rem] border border-white/8 bg-[#090B0D] lg:ml-12">
            {COMPATIBILITY.map(({ name, note, vendor, icon, logos }, index) => {
              const Icon = ICONS[icon];
              return (
                <div
                  key={name}
                  className="group grid gap-4 border-b border-white/10 p-5 transition duration-300 last:border-b-0 hover:bg-white/[0.025] sm:grid-cols-[72px_1fr_1fr] sm:items-center sm:p-7"
                >
                  <AgentLogoStack
                    fallbackIcon={Icon}
                    logos={logos as readonly AgentLogoKey[]}
                  />
                  <div>
                    <p className="mb-2 text-xs font-medium tracking-[0.12em] text-zinc-500 uppercase">
                      {String(index + 1).padStart(2, '0')} / {vendor}
                    </p>
                    <h3 className="text-3xl font-light text-zinc-100 sm:text-4xl">
                      {name}
                    </h3>
                  </div>
                  <div className="text-sm leading-6 text-zinc-400">
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium tracking-[0.13em] text-[#4CAFE1] uppercase">
                      <span className="size-2 rounded-full bg-[#4CAFE1] shadow-[0_0_0_4px_rgba(76,175,225,0.12)]" />{' '}
                      Supported
                    </div>
                    {note}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="lg:pl-8">
          <Eyebrow className="mb-7 text-zinc-500">Install once</Eyebrow>
          <h2 className="text-5xl leading-none font-light text-balance text-zinc-100 sm:text-6xl">
            Works where agents work
          </h2>
          <p className="mt-8 max-w-[36ch] text-lg leading-8 text-pretty text-zinc-400">
            The repository ships both plugin packaging and direct skill entry
            points, so the same deploy logic can travel across agent hosts.
          </p>
          <TextLink
            label="Read install notes"
            href="#setup"
            className="mt-10"
          />
        </div>
      </div>
    </SectionShell>
  );
}

export function PipelineSection() {
  return (
    <SectionShell className="py-16 sm:py-28" id="pipeline">
      <div className="max-w-4xl">
        <Eyebrow className="mb-5">Deploy intelligence</Eyebrow>
        <h2 className="text-5xl leading-none font-semibold text-balance text-zinc-100 sm:text-7xl">
          One command, two clean paths
        </h2>
        <p className="mt-6 max-w-[58ch] text-base leading-7 text-zinc-400 sm:text-lg">
          The skill chooses deploy or update after preflight instead of asking
          the agent to guess what kind of project it is handling.
        </p>
      </div>
      <div className="mt-16 overflow-hidden rounded-[2rem] border border-white/10 bg-[#07090B]/88 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_35px_100px_rgba(0,23,36,0.5)] sm:p-8">
        <div className="scrollbar-hide mb-9 inline-flex max-w-full items-center gap-3 overflow-x-auto rounded-xl border border-white/15 bg-white/[0.035] px-4 py-4 font-mono text-sm text-zinc-100">
          <CodeIcon className="size-5 shrink-0 text-[#4CAFE1]" />
          <span className="whitespace-nowrap">{DEPLOY_COMMAND}</span>
          <CopyCommandButton
            value={DEPLOY_COMMAND}
            label="Copy deploy command"
            className="min-h-8 rounded-lg px-2"
          />
        </div>
        <PipelineLane
          icon={PaperPlaneIcon}
          label="Deploy path"
          items={[...DEPLOY_PATH]}
        />
        <div className="my-8 border-t border-dashed border-white/12" />
        <PipelineLane
          icon={LoopIcon}
          label="Update path"
          items={[...UPDATE_PATH]}
        />
        <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 lg:grid-cols-3">
          {PIPELINE_NOTES.map((item) => (
            <div key={item.title} className="border-l border-white/12 pl-4">
              <h3 className="text-sm font-medium text-zinc-100">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-left sm:text-center">
          <TextLink label="Read the pipeline" href="#pipeline" />
        </div>
      </div>
      <RunStatesPanel />
    </SectionShell>
  );
}

function HeroTerminal() {
  const installLines = [
    'Reading plugin metadata',
    'Registering $sealos command',
    'Checking Sealos auth helpers',
    'Linking deploy skill',
    'Ready for project analysis',
  ];

  return (
    <div className="relative min-h-[330px] min-w-0 lg:min-h-[500px]">
      <div className="absolute inset-x-8 top-0 h-52 rounded-full bg-[#4CAFE1]/10 blur-3xl" />
      <div className="absolute -top-2 right-10 hidden h-24 w-px bg-gradient-to-b from-transparent via-[#4CAFE1]/40 to-transparent lg:block" />
      <div className="relative mt-12 rounded-[2rem] border border-white/12 bg-[#0A0C0E]/92 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_40px_120px_rgba(0,15,25,0.72)] transition duration-300 hover:-translate-y-1 hover:border-white/20 lg:mt-28 lg:rotate-[-1.5deg] lg:hover:rotate-[-1deg]">
        <div className="rounded-[1.45rem] border border-white/8 bg-[linear-gradient(145deg,#101315,#060809)] p-5 sm:p-8">
          <div className="mb-7 flex items-center justify-between gap-4 border-b border-white/10 pb-5">
            <span className="truncate font-mono text-sm text-[#4CAFE1]">
              $ {INSTALL_COMMAND}
            </span>
            <StateBadge state="Ready" />
          </div>
          {installLines.map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-3 py-1.5 font-mono text-sm text-zinc-300"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <CheckIcon className="size-4 text-[#4CAFE1]" />
              <span>{item}</span>
            </div>
          ))}
          <div className="mt-8 grid gap-5 border-t border-white/10 pt-7 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <Image
                src="/logo.svg"
                alt=""
                width={48}
                height={48}
                className="mb-4"
              />
              <p className="text-lg font-medium tracking-[0.16em] text-zinc-100 uppercase">
                Sealos Skills
              </p>
              <p className="mt-2 text-xs font-medium tracking-[0.18em] text-zinc-500 uppercase">
                agent-owned deploy
              </p>
            </div>
            <div className="flex items-center gap-2 font-mono text-sm text-[#4CAFE1]">
              <span>Run {DIRECT_DEPLOY_COMMAND}</span>
              <CopyCommandButton
                value={DIRECT_DEPLOY_COMMAND}
                label="Copy direct deploy command"
                className="min-h-8 rounded-lg px-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineLane({
  icon: Icon,
  label,
  items,
}: {
  icon: React.ForwardRefExoticComponent<
    React.ComponentProps<typeof PaperPlaneIcon>
  >;
  label: string;
  items: string[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-[180px_1fr] lg:items-center">
      <div className="flex items-center gap-3 text-2xl text-zinc-100">
        <Icon className="size-7 text-[#4CAFE1]" />
        {label}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none lg:items-center">
        {items.map((item, index) => (
          <div key={item} className="relative flex items-center gap-3">
            <div className="flex min-h-14 w-full items-center justify-center rounded-full border border-white/22 bg-[#0D1113]/70 px-5 text-sm font-medium text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-[#4CAFE1]/45 hover:bg-white/[0.045] active:translate-y-px">
              {item}
            </div>
            {index < items.length - 1 && (
              <ArrowRightIcon className="hidden size-5 shrink-0 text-zinc-500 lg:block" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RunStatesPanel() {
  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
      <div className="rounded-[1.65rem] border border-white/10 bg-white/[0.025] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
        <Eyebrow className="mb-4 text-zinc-500">Operational states</Eyebrow>
        <h3 className="text-3xl leading-tight font-medium text-balance text-zinc-100">
          Finished screens include the in-between moments
        </h3>
        <p className="mt-5 text-sm leading-7 text-zinc-500">
          Loading, empty, and error states are shown as first-class deploy
          moments, not hidden behind a generic spinner.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-[1.05fr_0.9fr_1.05fr]">
        {RUN_STATES.map((state) => (
          <div
            key={state.kind}
            className="rounded-[1.45rem] border border-white/10 bg-[#080B0D]/84 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition duration-300 hover:-translate-y-0.5 hover:border-white/18"
            aria-label={`${state.status}: ${state.title}`}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <StateBadge state={state.status} />
              {state.kind === 'error' ? <WarningIcon /> : <CodeGlyph />}
            </div>
            {state.kind === 'loading' && <SkeletonPreview />}
            {state.kind === 'empty' && <EmptyPreview />}
            {state.kind === 'error' && <ErrorPreview />}
            <h4 className="mt-5 text-sm font-medium text-zinc-100">
              {state.title}
            </h4>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              {state.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
