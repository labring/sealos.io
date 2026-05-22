import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleCheck,
  ExternalLink,
  Github,
} from 'lucide-react';
import { GodRays } from '@/new-components/GodRays';
import { GradientLucideIcon } from '@/new-components/GradientLucideIcon';
import { AppIcon } from '@/components/ui/app-icon';
import { languagesType } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { DeployButton } from './DeployButton';
import AppPreviewPanel from './AppPreviewPanel';
import {
  getDisplayDescription,
  getReadmeUrl,
  type AppDetailConfig,
} from './app-detail-utils';

interface AppDetailHeroProps {
  app: AppDetailConfig;
  lang: languagesType;
}

const proofPoints = [
  'Easy to deploy and manage',
  'Self-hosted solution',
  'Open source and free',
  'Community supported',
];

const heroTitleAccentClassName =
  'bg-gradient-to-r from-white to-[#146DFF] bg-clip-text text-transparent';

const heroCenterLogoClassName =
  'hidden lg:flex absolute left-[609px] top-9 z-20 h-[130px] w-[130px] -translate-x-1/2 items-center justify-center rounded-[10px] border-[7px] border-[#25272c] bg-[#d8d8d8] p-5 shadow-2xl shadow-black/40';

function textLinkClassName(variant: 'primary' | 'default' = 'default') {
  return cn(
    'inline-flex items-center gap-1.5 text-xs transition',
    variant === 'primary'
      ? 'text-white hover:text-[#69a3ff]'
      : 'text-zinc-400 hover:text-white',
  );
}

export default function AppDetailHero({ app, lang }: AppDetailHeroProps) {
  const readmeUrl = getReadmeUrl(app.github);

  return (
    <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20 lg:pt-[132px] lg:pb-20">
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-background"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 z-[3]">
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
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-12 px-6 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:px-8">
        <div className={heroCenterLogoClassName}>
          <AppIcon
            src={app.icon}
            alt={`${app.name} icon`}
            width={92}
            height={92}
            className="h-[92px] w-[92px] rounded-md object-contain"
            fallbackClassName="h-16 w-16 text-zinc-700"
          />
        </div>

        <div className="relative z-20 min-w-0 lg:pt-2">
          <Link
            href={`/${lang}/products/app-store`}
            className="mb-12 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-zinc-200 lg:mb-[92px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to templates
          </Link>

          <div className="mb-7 flex items-center gap-5 lg:hidden">
            <div className="flex h-[84px] w-[84px] items-center justify-center rounded-xl border border-white/15 bg-zinc-100 p-3 shadow-2xl shadow-black/40">
              <AppIcon
                src={app.icon}
                alt={`${app.name} icon`}
                width={64}
                height={64}
                className="h-16 w-16 rounded-lg object-contain"
                fallbackClassName="h-12 w-12 text-zinc-700"
              />
            </div>
          </div>

          <h1 className="max-w-[720px] text-[34px] leading-[1.12] font-semibold text-white sm:text-[36px] lg:max-w-[500px] lg:text-[36px] lg:leading-[1.18]">
            Deploy{' '}
            <span className={heroTitleAccentClassName}>
              {app.name} on Sealos
            </span>
          </h1>
          <p className="mt-6 max-w-[600px] text-sm leading-6 text-zinc-400">
            {getDisplayDescription(app)}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-white/[0.055] px-2 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6ea2ff]" />
              {app.category}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-zinc-400">
            {(app.benefits.length ? app.benefits : proofPoints)
              .slice(0, 4)
              .map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <GradientLucideIcon
                    Icon={CircleCheck}
                    className="h-3.5 w-3.5 shrink-0"
                  />
                  {item}
                </span>
              ))}
          </div>

          <div className="mt-10">
            <DeployButton
              templateName={app.slug}
              appName={app.name}
              category={app.category}
              className="h-10 gap-2 px-6 text-sm"
            >
              Deploy Now
              <ArrowRight className="h-4 w-4" />
            </DeployButton>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            {app.website && (
              <a
                href={app.website}
                target="_blank"
                rel="noopener noreferrer"
                className={textLinkClassName('primary')}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Official Website
              </a>
            )}
            {app.github && (
              <a
                href={app.github}
                target="_blank"
                rel="noopener noreferrer"
                className={textLinkClassName()}
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            <a
              href={readmeUrl}
              target={app.github ? '_blank' : undefined}
              rel={app.github ? 'noopener noreferrer' : undefined}
              className={textLinkClassName()}
            >
              <BookOpen className="h-3.5 w-3.5" />
              README
            </a>
          </div>
        </div>

        <div className="relative z-20 hidden min-w-0 lg:block lg:pt-[150px]">
          <div className="absolute -inset-10 bg-[radial-gradient(circle_at_45%_40%,rgba(20,109,255,0.18),transparent_54%)]" />
          <div className="relative translate-x-14">
            <AppPreviewPanel app={app} variant="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}
