import type { ReactNode } from 'react';

import {
  Bot,
  CheckCircle2,
  Code2,
  Database,
  GalleryVerticalEnd,
  PencilLine,
  Rocket,
  SquareTerminal,
  type LucideIcon,
} from 'lucide-react';

import { GradientText } from '@/new-components/GradientText';
import { CopyCommandButton } from '../../../sealos-skills/copy-command';
import { TerminalCardStack } from './terminal-agent-card-stack';

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const visualCards = [
  {
    icon: Code2,
    title: 'GitHub Import',
    lines: [
      'repo: github.com/labring/brain',
      'branch: main',
      'auth: connected',
    ],
  },
  {
    icon: Rocket,
    title: 'Docker Deploy',
    lines: [
      'image: nginx:latest',
      'cpu: 0.5 vCPU  mem: 512Mi',
      'port: 80 -> public',
    ],
  },
  {
    icon: Database,
    title: 'Database',
    lines: ['engine: postgres 16', 'replicas: 3 (HA)', 'storage: 20Gi SSD'],
  },
];

const featureCards: FeatureCard[] = [
  {
    icon: CheckCircle2,
    title: 'Scored Assessment Pipeline',
    description:
      'Executes a capability scan scoring deploy readiness from 0-12. Automatically detects frameworks, active package managers, assigned ports, and runtime environment variables without guessing parameters.',
  },
  {
    icon: PencilLine,
    title: 'Inspectable Local Blueprints',
    description:
      'Maintains total visibility. Every run generates real, local files under the .sealos repository footprint, keeping build metrics and target workspace definitions ready for direct human verification.',
  },
  {
    icon: GalleryVerticalEnd,
    title: 'Intelligent Routing Paths',
    description:
      'Differentiates tasks post-preflight: switches automatically to a Deploy Path or an Update Path for state configuration tracking and image patch rollouts.',
  },
];

const SEALOS_SKILLS_INSTALL_COMMAND =
  'npx plugins add https://github.com/labring/sealos-skills';

export function TerminalAgentSection() {
  return (
    <section className="relative container overflow-hidden py-20 text-white sm:px-6 lg:py-28">
      <img
        src="/images/home/aiagent-bg1.svg"
        alt=""
        className="pointer-events-none absolute top-0 right-0 hidden h-[322px] w-[min(72vw,960px)] object-cover object-right opacity-90 lg:block"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-[1312px] flex-col gap-16">
        <header className="flex max-w-[756px] flex-col items-start gap-6 text-left">
          <GradientText
            as="h2"
            className="to-blue-500 text-3xl leading-tight font-semibold text-balance sm:text-4xl"
          >
            Converse, Click, or Build from Your Terminal.
          </GradientText>
          <p className="max-w-[756px] text-base leading-6 text-zinc-500">
            Whether you prefer our visual dashboard, our built-in natural
            language agent, or spinning up infrastructure using standard
            terminal workflows, you&apos;re always in complete control.
          </p>
        </header>

        <WorkflowRow
          icon={Bot}
          title="1. Click, chat, or import"
          description="Click the visual rail icons manually, or describe what you want and let the built-in agent figure it out. The AI renders a structured form for you to approve, not an unverified wall of text."
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {visualCards.map((card) => (
              <VisualCard key={card.title} card={card} />
            ))}
          </div>
        </WorkflowRow>

        <WorkflowRow
          align="right"
          icon={SquareTerminal}
          title="2. Terminal Automation (Sealos Skills)"
          description="Give your AI coding assistants a concrete path from source code to Sealos Cloud. Ship applications with verifiable local artifacts, automated pipeline tracking, and live deployment state management."
        >
          <TerminalCardStack />
        </WorkflowRow>

        <div className="grid gap-6 lg:grid-cols-3">
          {featureCards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>

        <EngineCard />
      </div>
    </section>
  );
}

function WorkflowRow({
  align = 'left',
  icon: Icon,
  title,
  description,
  children,
}: {
  align?: 'left' | 'right';
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div
        className={
          align === 'right'
            ? 'grid gap-8 lg:grid-cols-[1fr_220px]'
            : 'grid gap-8 lg:grid-cols-[220px_1fr]'
        }
      >
        <AgentChip
          Icon={Icon}
          className={align === 'right' ? 'lg:order-2' : ''}
        />
        <div
          className={
            align === 'right'
              ? 'flex flex-col items-center justify-center gap-3 text-center lg:items-end lg:text-right'
              : 'flex flex-col justify-center gap-3'
          }
        >
          <h3 className="text-2xl leading-8 font-medium text-zinc-200">
            {title}
          </h3>
          <p className="max-w-3xl text-sm leading-6 text-zinc-500">
            {description}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}

function AgentChip({
  Icon,
  className = '',
}: {
  Icon: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={`relative mx-auto flex h-36 w-full max-w-[220px] items-center justify-center ${className}`}
    >
      <div
        className="absolute inset-x-0 top-1/2 h-px bg-linear-to-r from-transparent via-blue-500/60 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex size-20 items-center justify-center rounded-2xl border border-white/20 bg-linear-to-b from-zinc-800 to-zinc-950 shadow-[0_0_28px_rgba(20,109,255,0.25)]">
        <Icon className="size-10 text-blue-400" aria-hidden="true" />
      </div>
    </div>
  );
}

function VisualCard({
  card,
}: {
  card: { icon: LucideIcon; title: string; lines: string[] };
}) {
  const Icon = card.icon;

  return (
    <article className="rounded-xl border border-transparent bg-white/[0.045] p-6 transition-colors hover:border-white/10">
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <Icon className="size-5 text-blue-400" aria-hidden="true" />
        </div>
        <div>
          <h4 className="text-base font-medium text-zinc-100">{card.title}</h4>
          <p className="mt-2 text-sm leading-5 text-zinc-500">
            Auto-detect framework, build, expose.
          </p>
        </div>
      </div>
      <div className="mt-6 space-y-2 rounded-lg bg-black/35 p-4 font-mono text-xs leading-5 text-zinc-300">
        {card.lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </article>
  );
}

function FeatureCard({ card }: { card: FeatureCard }) {
  const Icon = card.icon;

  return (
    <article className="rounded-xl bg-white/[0.045] p-8">
      <div className="flex items-center gap-3">
        <Icon className="size-6 text-blue-400" aria-hidden="true" />
        <h4 className="text-xl leading-7 font-medium text-zinc-100">
          {card.title}
        </h4>
      </div>
      <p className="mt-5 text-sm leading-6 text-zinc-500">{card.description}</p>
    </article>
  );
}

function EngineCard() {
  return (
    <article className="bg-background rounded-xl border border-white/10 p-5 shadow-[0_-4px_26px_rgba(8,10,17,0.9)]">
      <div className="flex gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <Rocket className="size-6 text-blue-400" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl leading-7 font-medium text-zinc-200">
            Universal Agent Deployment Engine
          </h3>
          <p className="mt-4 text-sm leading-6 text-zinc-500">
            Compatible with Claude Code, Codex CLI, OpenAI agent hosts, or
            standard shell installations. Mount the universal skill pack
            directly via your ecosystem plugin configurations.{' '}
            <a
              href="/sealos-skills/"
              className="text-blue-400 underline underline-offset-4"
            >
              Learn more about Sealos Skills
            </a>
          </p>
          <div className="relative mt-6 overflow-hidden rounded-xl p-px shadow-[0_0_24px_rgba(37,99,235,0.18)]">
            <style>{`
              @keyframes terminal-agent-border-top {
                0% {
                  opacity: 1;
                  transform: translateX(-140%);
                }
                47.5% {
                  opacity: 1;
                  transform: translateX(420%);
                }
                48.5%,
                100% {
                  opacity: 0;
                  transform: translateX(420%);
                }
              }

              @keyframes terminal-agent-border-right {
                0%,
                46.5% {
                  opacity: 0;
                  transform: translateY(-140%);
                }
                47.5% {
                  opacity: 1;
                  transform: translateY(-140%);
                }
                50% {
                  opacity: 1;
                  transform: translateY(420%);
                }
                51%,
                100% {
                  opacity: 0;
                  transform: translateY(420%);
                }
              }

              @keyframes terminal-agent-border-bottom {
                0%,
                49% {
                  opacity: 0;
                  transform: translateX(420%);
                }
                50% {
                  opacity: 1;
                  transform: translateX(420%);
                }
                97.5% {
                  opacity: 1;
                  transform: translateX(-140%);
                }
                98.5%,
                100% {
                  opacity: 0;
                  transform: translateX(-140%);
                }
              }

              @keyframes terminal-agent-border-left {
                0%,
                96.5% {
                  opacity: 0;
                  transform: translateY(420%);
                }
                97.5% {
                  opacity: 1;
                  transform: translateY(420%);
                }
                100% {
                  opacity: 1;
                  transform: translateY(-140%);
                }
              }
            `}</style>
            <span
              className="absolute inset-x-0 top-0 h-px overflow-hidden"
              aria-hidden="true"
            >
              <span className="absolute top-0 left-0 block h-full w-1/4 animate-[terminal-agent-border-top_5s_linear_infinite] bg-linear-to-r from-transparent via-blue-300 to-transparent shadow-[0_0_12px_#60a5fa] will-change-transform motion-reduce:animate-none" />
              <span className="absolute top-0 left-0 block h-full w-1/4 animate-[terminal-agent-border-top_5s_linear_infinite] bg-linear-to-r from-transparent via-blue-300 to-transparent shadow-[0_0_12px_#60a5fa] will-change-transform [animation-delay:-2.5s] motion-reduce:animate-none" />
            </span>
            <span
              className="absolute inset-y-0 right-0 w-px overflow-hidden"
              aria-hidden="true"
            >
              <span className="absolute top-0 left-0 block h-1/4 w-full animate-[terminal-agent-border-right_5s_linear_infinite] bg-linear-to-b from-transparent via-blue-300 to-transparent shadow-[0_0_12px_#60a5fa] will-change-transform motion-reduce:animate-none" />
              <span className="absolute top-0 left-0 block h-1/4 w-full animate-[terminal-agent-border-right_5s_linear_infinite] bg-linear-to-b from-transparent via-blue-300 to-transparent shadow-[0_0_12px_#60a5fa] will-change-transform [animation-delay:-2.5s] motion-reduce:animate-none" />
            </span>
            <span
              className="absolute inset-x-0 bottom-0 h-px overflow-hidden"
              aria-hidden="true"
            >
              <span className="absolute top-0 left-0 block h-full w-1/4 animate-[terminal-agent-border-bottom_5s_linear_infinite] bg-linear-to-r from-transparent via-blue-300 to-transparent shadow-[0_0_12px_#60a5fa] will-change-transform motion-reduce:animate-none" />
              <span className="absolute top-0 left-0 block h-full w-1/4 animate-[terminal-agent-border-bottom_5s_linear_infinite] bg-linear-to-r from-transparent via-blue-300 to-transparent shadow-[0_0_12px_#60a5fa] will-change-transform [animation-delay:-2.5s] motion-reduce:animate-none" />
            </span>
            <span
              className="absolute inset-y-0 left-0 w-px overflow-hidden"
              aria-hidden="true"
            >
              <span className="absolute top-0 left-0 block h-1/4 w-full animate-[terminal-agent-border-left_5s_linear_infinite] bg-linear-to-b from-transparent via-blue-300 to-transparent shadow-[0_0_12px_#60a5fa] will-change-transform motion-reduce:animate-none" />
              <span className="absolute top-0 left-0 block h-1/4 w-full animate-[terminal-agent-border-left_5s_linear_infinite] bg-linear-to-b from-transparent via-blue-300 to-transparent shadow-[0_0_12px_#60a5fa] will-change-transform [animation-delay:-2.5s] motion-reduce:animate-none" />
            </span>
            <div className="relative flex h-12 items-center gap-3 rounded-[11px] border border-white/10 bg-[#10131b] px-5 font-mono text-sm text-zinc-200">
              <Code2
                className="size-4 shrink-0 text-blue-400"
                aria-hidden="true"
              />
              <span className="scrollbar-hide min-w-0 flex-1 overflow-x-auto whitespace-nowrap">
                {SEALOS_SKILLS_INSTALL_COMMAND}
              </span>
              <CopyCommandButton
                value={SEALOS_SKILLS_INSTALL_COMMAND}
                label="Copy Sealos Skills install command"
                className="min-h-8 px-2"
                iconClassName="size-4"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
