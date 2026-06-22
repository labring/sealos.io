import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import Link from 'next/link';

import { ArrowUpRight, Sparkles, Star } from 'lucide-react';

import DifyIcon from '/public/images/apps/dify.svg';
import AppsmithIcon from '/public/images/apps/appsmith.png';
import FastgptIcon from '/public/images/apps/fastgpt.svg';
import N8nIcon from '/public/images/apps/n8n.svg';
import SupabaseIcon from '/public/images/apps/supabase.png';
import WordpressIcon from '/public/images/apps/wordpress.svg';
import AzureIcon from '@/assets/aiagent-appicons/azure.svg';
import ClaudeIcon from '@/assets/aiagent-appicons/claude.svg';
import DeepseekIcon from '@/assets/aiagent-appicons/deepseek.svg';
import GeminiIcon from '@/assets/aiagent-appicons/gemini.svg';
import OpenaiIcon from '@/assets/aiagent-appicons/openai.svg';
import QwenIcon from '@/assets/aiagent-appicons/qwen.svg';
import DatabaseIcon from '@/assets/sealos-appicons/database.svg';
import DevboxIcon from '@/assets/sealos-appicons/devbox.svg';
import { GradientText } from '@/new-components/GradientText';

type AppCard = {
  name: string;
  description: string;
  icon: StaticImageData | string;
  href: string;
};

const appCards: AppCard[] = [
  {
    name: 'Dify',
    description: 'Open-source LLM app development platform.',
    icon: DifyIcon,
    href: '/products/app-store/dify',
  },
  {
    name: 'Appsmith',
    description: 'Build internal tools with pre-wired services.',
    icon: AppsmithIcon,
    href: '/products/app-store/appsmith',
  },
  {
    name: 'FastGPT',
    description: 'Knowledge-base AI workflows ready to deploy.',
    icon: FastgptIcon,
    href: '/products/app-store/fastgpt',
  },
  {
    name: 'n8n',
    description: 'Automation workflows with managed dependencies.',
    icon: N8nIcon,
    href: '/products/app-store/n8n',
  },
  {
    name: 'Supabase',
    description: 'Postgres, auth, and APIs in one-click setup.',
    icon: SupabaseIcon,
    href: '/products/app-store/supabase',
  },
];

const logoRows = [
  [OpenaiIcon, AzureIcon, ClaudeIcon, GeminiIcon, QwenIcon, DeepseekIcon],
  [DifyIcon, FastgptIcon, N8nIcon, DatabaseIcon, DevboxIcon, WordpressIcon],
  [SupabaseIcon, AppsmithIcon, N8nIcon, DifyIcon, FastgptIcon, DatabaseIcon],
];

export function AppsSection() {
  return (
    <section className="overflow-hidden px-4 pt-16 pb-24 text-white sm:px-6 lg:px-16 lg:pt-20 lg:pb-28">
      <div className="mx-auto flex max-w-[1312px] flex-col gap-20">
        <div className="relative flex min-h-[300px] items-end justify-center overflow-hidden">
          <AppLogoCloud />
          <SectionHeading />
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {appCards.map((app) => (
            <AppCard key={app.name} app={app} />
          ))}
          <MoreAppsCard />
        </div>
      </div>
    </section>
  );
}

function SectionHeading() {
  return (
    <div className="relative z-10 w-full">
      <div
        className="absolute inset-x-0 bottom-0 h-64 backdrop-blur-md"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-[812px] flex-col items-center gap-6 text-center">
        <GradientText
          as="h2"
          className="to-blue-500 text-4xl leading-tight font-semibold text-balance sm:text-5xl"
        >
          One-click Apps for the stack you're already building.
        </GradientText>
        <p className="max-w-[618px] text-base leading-6 text-zinc-500">
          Deploy major production dependencies and web open-source tools with
          pre-configured internal networking rules.
        </p>
      </div>
    </div>
  );
}

function AppLogoCloud() {
  return (
    <div className="pointer-events-none absolute inset-x-1/2 top-0 w-[1312px] -translate-x-1/2 opacity-55">
      <div
        className="absolute inset-0 z-10 bg-gradient-to-r from-black via-transparent to-black"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-3 blur-[0.2px]">
        {logoRows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="flex justify-center gap-3"
            style={{ transform: `translateX(${rowIndex % 2 ? 38 : -38}px)` }}
          >
            {[...row, ...row, ...row].map((icon, index) => (
              <div
                key={`${rowIndex}-${index}`}
                className="flex size-16 items-center justify-center rounded-xl border border-white/5 bg-white/5 shadow-inner"
              >
                <Image src={icon} alt="" width={32} height={32} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function AppCard({ app }: { app: AppCard }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-transparent bg-zinc-950 transition-colors hover:border-white/10 hover:bg-zinc-900">
      <AppPreview />
      <div className="space-y-5 p-5">
        <div className="flex items-start gap-4">
          <Image
            src={app.icon}
            alt=""
            width={48}
            height={48}
            className="size-12 rounded-lg bg-zinc-200 object-contain p-1"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <h3 className="truncate text-xl font-semibold text-zinc-100">
                {app.name}
              </h3>
              <AppBadges />
            </div>
            <p className="mt-2 truncate text-base text-zinc-500">
              {app.description}
            </p>
          </div>
        </div>

        <Link
          href={app.href}
          className="flex h-9 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/15"
        >
          Deploy
        </Link>
      </div>
    </article>
  );
}

function MoreAppsCard() {
  return (
    <article className="overflow-hidden rounded-xl bg-zinc-950">
      <div className="flex h-[135px] items-center justify-center overflow-hidden">
        <div className="grid grid-cols-6 gap-2 opacity-70">
          {logoRows.flat().map((icon, index) => (
            <div
              key={index}
              className="flex size-12 items-center justify-center rounded-xl border border-white/5 bg-white/5"
            >
              <Image src={icon} alt="" width={24} height={24} />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-5 p-5">
        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-zinc-100">200+ More</h3>
            <AppBadges />
          </div>
          <p className="mt-2 text-base text-zinc-500">
            Browse the full app catalog.
          </p>
        </div>

        <Link
          href="/products/app-store"
          className="flex h-9 items-center justify-center gap-2 rounded-full bg-white/10 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/15"
        >
          Browse All
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function AppPreview() {
  return (
    <div className="relative h-34 overflow-hidden">
      <AppPreviewPlaceholder />
    </div>
  );
}

function AppPreviewPlaceholder() {
  return (
    <div className="absolute -top-5 -right-10 -left-2 rotate-[-6deg] rounded border border-white/10 bg-black p-3 opacity-70 shadow-2xl transition-all duration-300 ease-out group-hover:inset-0 group-hover:rotate-0 group-hover:rounded-none">
      <div className="mb-3 flex h-4 items-center gap-2 rounded bg-white/5 px-2 text-[6px] text-zinc-500">
        <span className="size-1 rounded-full bg-zinc-500" />
        acme.com
      </div>
      <div className="grid grid-cols-[96px_1fr] gap-3">
        <div className="space-y-2 text-[6px] text-zinc-600">
          <div>LAYOUTS</div>
          <div>Nested Layouts</div>
          <div>Grouped Layouts</div>
          <div>Streaming with Suspense</div>
          <div>FILE CONVENTIONS</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {['Nested Layouts', 'Grouped Layouts'].map((item) => (
            <div
              key={item}
              className="h-16 rounded border border-white/5 bg-white/5 p-2"
            >
              <div className="mb-2 text-[7px] text-zinc-400">{item}</div>
              <div className="h-1 w-20 rounded bg-white/10" />
              <div className="mt-1 h-1 w-14 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppBadges() {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <span className="inline-flex h-6 items-center gap-1 rounded-full bg-white/5 px-2 text-xs text-zinc-400">
        <Sparkles className="size-3 text-blue-500" aria-hidden="true" />
        AI
      </span>
      <span className="inline-flex h-6 items-center gap-1 rounded-full bg-white/5 px-2 text-xs text-zinc-400">
        <Star
          className="size-3 fill-lime-400 text-lime-400"
          aria-hidden="true"
        />
        2.4k
      </span>
    </div>
  );
}
