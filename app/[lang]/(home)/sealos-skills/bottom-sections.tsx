import Image from 'next/image';
import { CheckIcon, CounterClockwiseClockIcon } from '@radix-ui/react-icons';
import { SETUP_ITEMS, REPOSITORY_ROWS, USE_CASES, REPO_URL } from './content';
import { CopyCommandButton } from './copy-command';
import {
  CommandStrip,
  Eyebrow,
  FooterLink,
  ICONS,
  SectionShell,
  StateBadge,
  type StackLogoKey,
  StackLogoMark,
  TextLink,
} from './shared';
import { cn } from '@/lib/utils';

export function SetupSection() {
  return (
    <SectionShell className="py-16 sm:py-28" id="setup">
      <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
        <div>
          <Eyebrow className="mb-7 text-zinc-500">Preflight</Eyebrow>
          <h2 className="text-5xl leading-tight font-light text-balance text-zinc-100 sm:text-6xl">
            Guided setup,
            <br /> not guesswork
          </h2>
          <p className="mt-7 max-w-[42ch] text-lg leading-8 text-pretty text-zinc-400">
            The skill separates hard blockers from optional accelerators, so the
            agent can continue when local builds are unnecessary.
          </p>
          <TextLink label="Open setup guide" className="mt-10" boxed />
        </div>
        <div className="space-y-4 lg:rotate-[-2deg]">
          {SETUP_ITEMS.map(({ title, detail, command, status, icon, logo }) => {
            const Icon = ICONS[icon];
            const required = status === 'Required';
            return (
              <div
                key={title}
                className="grid gap-4 rounded-[1.2rem] border border-white/10 bg-[#101315]/92 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_70px_rgba(0,20,31,0.36)] transition duration-300 hover:-translate-y-0.5 hover:border-[#4CAFE1]/35 active:translate-y-px sm:grid-cols-[76px_1fr_auto] sm:items-center sm:p-6"
              >
                <StackLogoMark
                  fallbackIcon={Icon}
                  logo={logo as StackLogoKey}
                />
                <div>
                  <h3 className="text-2xl font-medium text-zinc-100">
                    {title}
                  </h3>
                  <p className="mt-1 max-w-[42ch] text-sm leading-6 text-zinc-400">
                    {detail}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
                  <div
                    className={cn(
                      'mb-2 flex items-center gap-2 text-sm font-medium',
                      required ? 'text-[#4CAFE1]' : 'text-zinc-400',
                    )}
                  >
                    <span
                      className={cn(
                        'size-2 rounded-full',
                        required ? 'bg-[#4CAFE1]' : 'border border-zinc-400',
                      )}
                    />
                    {status}
                  </div>
                  <div className="flex max-w-full items-center gap-2">
                    <code className="scrollbar-hide min-w-0 overflow-x-auto font-mono text-sm whitespace-nowrap text-[#4CAFE1]">
                      {command}
                    </code>
                    <CopyCommandButton
                      value={command}
                      label={`Copy ${title} command`}
                      className="min-h-8 rounded-lg px-2"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

export function RepositorySection() {
  return (
    <SectionShell className="py-16 sm:py-28" id="repository">
      <div className="grid gap-12 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
        <div>
          <Eyebrow className="mb-8 text-zinc-500">Repository anatomy</Eyebrow>
          <h2 className="text-5xl leading-tight font-light text-balance text-[#E6E0D3] sm:text-7xl">
            A skill you can inspect
          </h2>
          <div className="mt-9 h-px w-16 bg-[#4CAFE1]" />
          <p className="mt-8 max-w-md text-xl leading-9 text-pretty text-zinc-400">
            The repo keeps instructions, modules, and scripts readable, with run
            artifacts stored under .sealos for repeatable updates.
          </p>
          <TextLink label="Browse repository" className="mt-10" />
        </div>
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[#DED5C4] p-5 text-[#171513] shadow-[0_40px_120px_rgba(0,18,28,0.48)] transition duration-300 hover:-translate-y-1 sm:p-8 lg:rotate-[1.5deg]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_30%_0%,rgba(255,255,255,0.85),transparent_55%)]" />
          <div className="relative">
            <div className="mb-7 flex items-center justify-between border-b border-black/25 pb-4 font-mono text-xs tracking-[0.12em] text-black/55 uppercase">
              <span>Sealos skill repository</span>
              <span>/ tree</span>
            </div>
            <div className="space-y-1">
              {REPOSITORY_ROWS.map(({ name, icon, active }) => {
                const Icon = ICONS[icon];
                return (
                  <div
                    key={name}
                    className="grid grid-cols-[28px_32px_1fr] items-center gap-4 border-b border-black/10 py-4 font-mono text-sm sm:text-lg"
                  >
                    <span className="h-px bg-black/35" />
                    <Icon className="size-6 text-black/70" />
                    <span
                      className={active ? 'text-[#087FB9]' : 'text-black/85'}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap justify-between gap-4 border-t border-black/25 pt-4 font-mono text-xs tracking-[0.12em] text-black/55 uppercase">
              <span>Mode: plugin + skill</span>
              <span>State: .sealos</span>
              <span>License: MIT</span>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function UseCasesSection() {
  return (
    <SectionShell className="py-16 sm:py-28" id="use-cases">
      <div className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#060809] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_40px_120px_rgba(0,15,25,0.55)] sm:p-10 lg:p-14">
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_20%_15%,rgba(255,255,255,0.22),transparent_22%),linear-gradient(115deg,transparent_0%,rgba(76,175,225,0.075)_50%,transparent_72%)] opacity-45" />
        <div className="relative grid gap-12 lg:grid-cols-[0.52fr_0.48fr] lg:items-center">
          <div>
            <Eyebrow className="mb-7">For agent-led shipping</Eyebrow>
            <h2 className="text-5xl leading-[1.04] font-medium text-balance text-zinc-100 sm:text-7xl">
              From prompt to verified rollout
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-9 text-pretty text-zinc-300">
              Use it when you want the agent to handle deployment details while
              keeping the artifacts visible enough for human review.
            </p>
            <TextLink
              label="See examples"
              href="#use-cases"
              className="mt-10"
            />
          </div>
          <div className="space-y-5">
            {USE_CASES.map(({ title, environment, result, time, icon }) => {
              const Icon = ICONS[icon];
              return (
                <div
                  key={title}
                  className="border border-white/12 bg-[#080B0D]/72 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-[#4CAFE1]/35 active:translate-y-px sm:p-6"
                >
                  <div className="mb-5 flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                    <div className="flex items-center gap-4">
                      <Icon className="size-8 text-zinc-200" />
                      <h3 className="text-xl font-medium text-zinc-100">
                        {title}
                      </h3>
                    </div>
                    <div className="text-right font-mono text-xs text-[#8BCB9C]">
                      <span className="mr-2 inline-block size-1.5 rounded-full bg-[#8BCB9C]" />
                      Ready
                      <div className="mt-1 text-zinc-500">{time}</div>
                    </div>
                  </div>
                  <div className="grid gap-3 text-sm text-zinc-400 sm:grid-cols-[120px_1fr]">
                    <span>Environment</span>
                    <span className="text-zinc-200">{environment}</span>
                    <span>Result</span>
                    <span className="text-[#4CAFE1]">{result}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

export function FinalCtaSection() {
  return (
    <SectionShell className="py-24 sm:py-36" id="install">
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-9 flex justify-center">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="" width={40} height={40} />
            <span className="text-sm font-semibold tracking-[0.22em] uppercase">
              Sealos <span className="text-[#4CAFE1]">Skills</span>
            </span>
          </div>
        </div>
        <h2 className="text-5xl leading-[1] font-semibold text-balance text-zinc-100 sm:text-7xl lg:text-8xl">
          Install the skill.
          <br /> Ship with evidence.
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-pretty text-zinc-400 sm:text-xl">
          Give your coding assistant a concrete path from source code to Sealos
          Cloud, including build artifacts, template output, and rollout checks.
        </p>
        <div className="mx-auto mt-12 grid max-w-4xl gap-4 text-left">
          <CommandStrip />
          <FinalStateSummary />
        </div>
        <div className="mt-9 flex flex-wrap justify-center gap-5 text-sm font-medium text-zinc-400 sm:gap-9">
          <FooterLink href={REPO_URL}>GitHub</FooterLink>
          <span className="text-zinc-700">|</span>
          <FooterLink href={`${REPO_URL}/blob/main/LICENSE`}>
            MIT License
          </FooterLink>
          <span className="text-zinc-700">|</span>
          <span className="underline underline-offset-4">plugin + skill</span>
        </div>
        <div className="mx-auto mt-12 max-w-2xl border-t border-white/10 pt-8 text-zinc-500">
          Built for the open agent skills ecosystem.
        </div>
      </div>
    </SectionShell>
  );
}

function FinalStateSummary() {
  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:grid-cols-3">
      {[
        ['Loading', 'Skeleton scan rows, no spinner'],
        ['Empty', 'Project path prompt and direct action'],
        ['Error', 'Inline recovery guidance'],
      ].map(([state, detail]) => (
        <div key={state} className="border-l border-white/12 pl-4 text-left">
          <div className="mb-3 flex items-center gap-2">
            {state === 'Loading' ? (
              <CounterClockwiseClockIcon className="size-4 text-[#4CAFE1]" />
            ) : (
              <CheckIcon className="size-4 text-[#4CAFE1]" />
            )}
            <StateBadge state={state as 'Loading' | 'Empty' | 'Error'} />
          </div>
          <p className="font-mono text-xs leading-5 text-zinc-500">{detail}</p>
        </div>
      ))}
    </div>
  );
}
