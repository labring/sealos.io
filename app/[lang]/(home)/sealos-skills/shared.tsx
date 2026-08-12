import type { ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { ArrowUpRight, Bot, Code2, Github, Terminal } from 'lucide-react';
import OpenAILogo from '@/assets/aiagent-appicons/openai.svg';
import GeminiLogo from '@/assets/aiagent-appicons/gemini.svg';
import QwenLogo from '@/assets/aiagent-appicons/qwen.svg';
import ClaudeCodeLogo from '@/assets/stacks-appicons/claude-code.svg';
import CodeBuddyLogo from '@/assets/ide-icons/codebuddy.svg';
import QoderLogo from '@/assets/ide-icons/qoder.svg';
import {
  getRybbitCtaProps,
  type RybbitCtaTracking,
} from '@/lib/analytics/rybbit-cta';
import { cn } from '@/lib/utils';
import type { AgentIconKey } from './content';

type LogoIconKey = Exclude<AgentIconKey, 'bot' | 'terminal' | 'code'>;

const AGENT_LOGOS: Record<
  LogoIconKey,
  { src: StaticImageData; className?: string }
> = {
  openai: { src: OpenAILogo },
  claude: { src: ClaudeCodeLogo },
  qoder: { src: QoderLogo },
  gemini: { src: GeminiLogo },
  qwen: { src: QwenLogo },
  codebuddy: { src: CodeBuddyLogo },
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
        <p className="mb-5 font-mono text-xs font-semibold text-[#4CAFE1] uppercase">
          {eyebrow}
        </p>
      )}
      <h2
        className="text-[36px] leading-[42px] font-medium text-[#F5F2F8] sm:text-[44px] sm:leading-[50px]"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      >
        {title}
      </h2>
      <p className="mt-5 max-w-[62ch] text-base leading-7 text-[#AAA4B4] sm:text-lg sm:leading-8">
        {description}
      </p>
    </header>
  );
}

export function AgentMark({ icon }: { icon: AgentIconKey }) {
  if (isLogoIcon(icon)) {
    const logo = AGENT_LOGOS[icon];

    return (
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-md border border-[#F5F2F8]/12 bg-[#F5F2F8]/[0.04]"
        aria-hidden="true"
      >
        <Image
          src={logo.src}
          alt=""
          width={28}
          height={28}
          className={cn('size-7 object-contain', logo.className)}
        />
      </span>
    );
  }

  const Icon = FALLBACK_ICONS[icon];

  return (
    <span
      className="flex size-12 shrink-0 items-center justify-center rounded-md border border-[#F5F2F8]/12 bg-[#F5F2F8]/[0.04] text-[#D8D2E0]"
      aria-hidden="true"
    >
      <Icon className="size-6" strokeWidth={1.6} aria-hidden="true" />
    </span>
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
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#F5F2F8]/20 px-4 text-sm font-semibold whitespace-nowrap text-[#F5F2F8] transition duration-200 hover:border-[#4CAFE1]/60 hover:bg-[#F5F2F8]/[0.06] focus-visible:ring-2 focus-visible:ring-[#4CAFE1] focus-visible:ring-offset-2 focus-visible:ring-offset-[#13111C] focus-visible:outline-none active:translate-y-px motion-reduce:transition-none',
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
