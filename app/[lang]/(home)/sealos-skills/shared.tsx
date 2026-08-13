import type { ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { ArrowUpRight, Bot, Code2, Github, Terminal } from 'lucide-react';
import OpenAILogo from '@/assets/aiagent-appicons/openai.svg';
import ClaudeLogo from '@/assets/aiagent-appicons/claude.svg';
import GeminiLogo from '@/assets/aiagent-appicons/gemini.svg';
import QwenLogo from '@/assets/aiagent-appicons/qwen.svg';
import OpenClawLogo from '@/public/images/apps/openclaw.svg';
import AmpLogo from '@/public/images/sealos-skills/agent-icons/amp.svg';
import CodeBuddyLogo from '@/public/images/sealos-skills/agent-icons/codebuddy.svg';
import KimiLogo from '@/public/images/sealos-skills/agent-icons/kimi.svg';
import QoderLogo from '@/public/images/sealos-skills/agent-icons/qoder.svg';
import {
  getRybbitCtaProps,
  type RybbitCtaTracking,
} from '@/lib/analytics/rybbit-cta';
import { cn } from '@/lib/utils';
import type { AgentIconKey } from './content';

export function SkillsPageShell({ children }: { children: ReactNode }) {
  return (
    <main className="bg-background -mt-24 min-w-0 overflow-x-clip text-zinc-100 selection:bg-blue-500 selection:text-white">
      {children}
    </main>
  );
}

type LogoIconKey = Exclude<AgentIconKey, 'bot' | 'terminal' | 'code'>;

const AGENT_LOGOS: Record<
  LogoIconKey,
  { src: StaticImageData; className?: string }
> = {
  openai: { src: OpenAILogo },
  claude: { src: ClaudeLogo },
  qoder: { src: QoderLogo },
  gemini: { src: GeminiLogo },
  qwen: { src: QwenLogo },
  codebuddy: { src: CodeBuddyLogo },
  openclaw: { src: OpenClawLogo },
  amp: { src: AmpLogo },
  kimi: { src: KimiLogo },
};

const FALLBACK_ICONS = {
  bot: Bot,
  terminal: Terminal,
  code: Code2,
} as const;

function isLogoIcon(icon: AgentIconKey): icon is LogoIconKey {
  return icon in AGENT_LOGOS;
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
        'relative mx-auto box-border w-full max-w-[1180px] scroll-mt-24 px-4 sm:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  className,
  description,
  eyebrow,
  title,
}: {
  className?: string;
  description: string;
  eyebrow?: string;
  title: string;
}) {
  return (
    <header className={cn('max-w-3xl', className)}>
      {eyebrow && (
        <p className="mb-5 font-mono text-xs font-semibold text-blue-400 uppercase">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[36px] leading-[42px] font-medium tracking-normal text-balance text-zinc-100 sm:text-[44px] sm:leading-[50px]">
        {title}
      </h2>
      <p className="mt-5 max-w-[62ch] text-base leading-7 text-pretty text-zinc-400 sm:text-lg sm:leading-8">
        {description}
      </p>
    </header>
  );
}

export function AgentMark({ icon }: { icon: AgentIconKey }) {
  return (
    <span
      className="flex size-12 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.04]"
      aria-hidden="true"
    >
      <AgentLogo icon={icon} />
    </span>
  );
}

export function AgentLogo({
  className,
  icon,
}: {
  className?: string;
  icon: AgentIconKey;
}) {
  if (isLogoIcon(icon)) {
    const logo = AGENT_LOGOS[icon];

    return (
      <Image
        src={logo.src}
        alt=""
        width={logo.src.width}
        height={logo.src.height}
        className={cn('size-7 object-contain', logo.className, className)}
      />
    );
  }

  const Icon = FALLBACK_ICONS[icon];

  return (
    <Icon
      className={cn('size-6 text-zinc-300', className)}
      strokeWidth={1.6}
      aria-hidden="true"
    />
  );
}

export function TrackedLink({
  children,
  className,
  href,
  tracking,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  tracking?: RybbitCtaTracking;
}) {
  const external = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cn(
        'focus-visible:ring-offset-background inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-white/15 px-4 text-sm font-semibold whitespace-nowrap text-zinc-100 transition duration-200 hover:border-blue-400/60 hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-px motion-reduce:transition-none',
        className,
      )}
      {...(tracking ? getRybbitCtaProps(tracking) : {})}
    >
      {children}
      {external ? (
        href.includes('github.com') ? (
          <Github className="size-4" strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <ArrowUpRight
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        )
      ) : null}
    </a>
  );
}

export function AnchorAlias({ id }: { id: string }) {
  return <span id={id} className="absolute top-0 scroll-mt-24" aria-hidden />;
}
