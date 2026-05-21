import type { ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import type { IconProps } from '@radix-ui/react-icons/dist/types';
import {
  ArrowRightIcon,
  BoxIcon,
  CheckIcon,
  CodeIcon,
  ContainerIcon,
  CrossCircledIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  FileTextIcon,
  GitHubLogoIcon,
  GlobeIcon,
  LightningBoltIcon,
  LoopIcon,
  PaperPlaneIcon,
  ReaderIcon,
  ReloadIcon,
  SymbolIcon,
} from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import OpenAILogo from '@/assets/aiagent-appicons/openai.svg';
import GitHubLogo from '@/assets/github.svg';
import GeminiLogo from '@/assets/aiagent-appicons/gemini.svg';
import QwenLogo from '@/assets/aiagent-appicons/qwen.svg';
import ClaudeCodeLogo from '@/assets/stacks-appicons/claude-code.svg';
import DockerLogo from '@/assets/stacks-appicons/docker.svg';
import KubernetesLogo from '@/assets/stacks-appicons/kubernetes.svg';
import SealosLogo from '@/assets/shared-icons/sealos.svg';
import { FALLBACK_INSTALL_COMMAND, INSTALL_COMMAND, REPO_URL } from './content';
import { CopyCommandButton } from './copy-command';

export type IconKey =
  | 'agent'
  | 'box'
  | 'cloud'
  | 'container'
  | 'error'
  | 'file'
  | 'folder'
  | 'github'
  | 'globe'
  | 'loop'
  | 'package'
  | 'reader'
  | 'reload'
  | 'terminal';

export const ICONS: Record<
  IconKey,
  React.ForwardRefExoticComponent<IconProps>
> = {
  agent: SymbolIcon,
  box: BoxIcon,
  cloud: PaperPlaneIcon,
  container: ContainerIcon,
  error: CrossCircledIcon,
  file: FileTextIcon,
  folder: CubeIcon,
  github: GitHubLogoIcon,
  globe: GlobeIcon,
  loop: LoopIcon,
  package: CheckIcon,
  reader: ReaderIcon,
  reload: ReloadIcon,
  terminal: CodeIcon,
};

export type AgentLogoKey = 'claudeCode' | 'gemini' | 'openai' | 'qwen';

export type StackLogoKey = 'docker' | 'github' | 'kubernetes' | 'sealos';

const STACK_LOGOS: Record<
  StackLogoKey,
  {
    alt: string;
    className?: string;
    src: StaticImageData;
  }
> = {
  docker: {
    alt: 'Docker',
    src: DockerLogo,
  },
  github: {
    alt: 'GitHub',
    className: 'brightness-0 invert',
    src: GitHubLogo,
  },
  kubernetes: {
    alt: 'Kubernetes',
    src: KubernetesLogo,
  },
  sealos: {
    alt: 'Sealos',
    src: SealosLogo,
  },
};

const AGENT_LOGOS: Record<
  AgentLogoKey,
  {
    alt: string;
    className?: string;
    src: StaticImageData;
  }
> = {
  claudeCode: {
    alt: 'Claude Code',
    src: ClaudeCodeLogo,
  },
  gemini: {
    alt: 'Gemini',
    className: 'opacity-90',
    src: GeminiLogo,
  },
  openai: {
    alt: 'OpenAI',
    className: 'opacity-95',
    src: OpenAILogo,
  },
  qwen: {
    alt: 'Qwen',
    className: 'opacity-95',
    src: QwenLogo,
  },
};

export function StackLogoMark({
  fallbackIcon: FallbackIcon,
  logo,
}: {
  fallbackIcon: React.ForwardRefExoticComponent<IconProps>;
  logo?: StackLogoKey;
}) {
  if (!logo) {
    return (
      <div className="flex size-14 items-center justify-center rounded-2xl bg-white/8 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
        <FallbackIcon className="size-7" />
      </div>
    );
  }

  const item = STACK_LOGOS[logo];

  return (
    <div className="flex size-14 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.045] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 group-hover:border-[#4CAFE1]/30">
      <Image
        src={item.src}
        alt={item.alt}
        width={32}
        height={32}
        loading="eager"
        className={cn('size-8 object-contain', item.className)}
      />
    </div>
  );
}

export function AgentLogoStack({
  fallbackIcon: FallbackIcon,
  logos,
}: {
  fallbackIcon: React.ForwardRefExoticComponent<IconProps>;
  logos: readonly AgentLogoKey[];
}) {
  if (logos.length === 0) {
    return (
      <div className="flex size-14 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 group-hover:border-[#4CAFE1]/30">
        <FallbackIcon className="size-7" />
      </div>
    );
  }

  return (
    <div className="flex size-14 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition duration-300 group-hover:border-[#4CAFE1]/30">
      <div className="flex items-center justify-center -space-x-2">
        {logos.map((logo) => {
          const item = AGENT_LOGOS[logo];

          return (
            <span
              key={logo}
              className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-[#101315] shadow-[0_10px_24px_rgba(0,0,0,0.22)] transition duration-300 group-hover:-translate-y-0.5"
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={24}
                height={24}
                className={cn('size-6 object-contain', item.className)}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function SectionShell({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        'relative z-10 mx-auto box-border w-full max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-sm font-medium tracking-[0.16em] text-[#4CAFE1] uppercase',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function CommandStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'group flex min-h-16 min-w-0 items-center gap-3 rounded-2xl border border-[#159BFF]/45 bg-[#080B0D]/85 px-4 font-mono text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_60px_rgba(0,58,92,0.22)] backdrop-blur transition duration-300 ease-out hover:border-[#6CC7F1]/65 active:translate-y-px sm:gap-4 sm:px-6 sm:text-base',
        className,
      )}
      aria-label={INSTALL_COMMAND}
    >
      <CodeIcon className="size-5 shrink-0 text-[#4CAFE1]" />
      <span className="scrollbar-hide min-w-0 flex-1 overflow-x-auto whitespace-nowrap text-zinc-100">
        <span className="text-zinc-500">npx plugins add </span>
        <span className="text-[#4CAFE1]">
          <span className="sm:hidden">labring/sealos…</span>
          <span className="hidden sm:inline">
            https://github.com/labring/sealos-skills
          </span>
        </span>
      </span>
      <CopyCommandButton
        value={INSTALL_COMMAND}
        label="Copy install command"
        className="min-h-10 rounded-xl border-white/10 bg-white/[0.035] px-3"
      />
    </div>
  );
}

export function SkillCommandCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-4',
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3 text-xs font-medium tracking-[0.13em] text-zinc-500 uppercase">
        <span className="flex min-w-0 items-center gap-2">
          <LightningBoltIcon className="size-4 shrink-0 text-[#4CAFE1]" />
          <span className="truncate">Direct skill fallback</span>
        </span>
        <CopyCommandButton
          value={FALLBACK_INSTALL_COMMAND}
          label="Copy direct skill command"
          className="min-h-8 rounded-lg px-2"
        />
      </div>
      <code className="scrollbar-hide block overflow-x-auto font-mono text-sm whitespace-nowrap text-zinc-300">
        {FALLBACK_INSTALL_COMMAND}
      </code>
    </div>
  );
}

export function RepositoryLink({ label }: { label: string }) {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full px-1 text-sm font-medium text-[#4CAFE1] underline decoration-[#4CAFE1]/50 underline-offset-8 transition duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-[#4CAFE1]/70 focus-visible:outline-none active:translate-y-px"
    >
      <GitHubLogoIcon className="size-5" /> {label}
    </a>
  );
}

export function TextLink({
  label,
  className,
  boxed,
  href = REPO_URL,
}: {
  label: string;
  className?: string;
  boxed?: boolean;
  href?: string;
}) {
  const external = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'inline-flex items-center gap-2 text-base font-medium text-[#4CAFE1] transition duration-300 hover:text-white focus-visible:ring-2 focus-visible:ring-[#4CAFE1]/70 focus-visible:outline-none active:translate-y-px sm:text-lg',
        boxed &&
          'min-h-14 rounded-xl border border-white/20 px-7 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-[#4CAFE1]/60 hover:text-[#4CAFE1]',
        !boxed && 'underline decoration-dotted underline-offset-8',
        className,
      )}
    >
      {label} <ArrowRightIcon className="size-5" />
    </a>
  );
}

export function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-md underline underline-offset-4 transition duration-300 hover:text-[#4CAFE1] focus-visible:ring-2 focus-visible:ring-[#4CAFE1]/70 focus-visible:outline-none active:translate-y-px"
    >
      {children} <ArrowRightIcon className="size-4" />
    </a>
  );
}

export function StateBadge({
  state,
}: {
  state: 'Loading' | 'Empty' | 'Error' | 'Warning' | 'Ready';
}) {
  const style = {
    Loading: 'border-[#4CAFE1]/45 bg-[#4CAFE1]/8 text-[#6CC7F1]',
    Empty: 'border-zinc-500/45 bg-zinc-500/8 text-zinc-400',
    Error: 'border-[#D8B25D]/45 bg-[#D8B25D]/8 text-[#D8B25D]',
    Warning: 'border-[#D8B25D]/45 bg-[#D8B25D]/8 text-[#D8B25D]',
    Ready: 'border-[#81C784]/45 bg-[#81C784]/8 text-[#81C784]',
  }[state];

  return (
    <span
      className={cn(
        'rounded-full border px-3 py-1 font-mono text-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]',
        style,
      )}
    >
      {state}
    </span>
  );
}

export function WarningIcon({ className }: { className?: string }) {
  return (
    <ExclamationTriangleIcon
      className={cn('size-4 text-[#D8B25D]', className)}
    />
  );
}

export function CodeGlyph({ className }: { className?: string }) {
  return <CodeIcon className={cn('size-4 text-[#4CAFE1]', className)} />;
}
