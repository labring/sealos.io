// Homepage Hero component with theme variants and CTA styling.
'use client';

import { GetStartedButton } from '@/components/ui/button-shiny';
import { TestimonialBadge } from '@/components/ui/testimonial-badge';
import { ReactNode } from 'react';
import { languagesType } from '@/lib/i18n';
import { CustomButton } from '../ui/button-custom';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

type HeroVariant = 'default' | 'app-store';

interface HeroProps {
  children?: ReactNode;
  title: {
    main: string;
    sub: string;
  };
  mainTitleEmphasis: number;
  getStartedLink?: string;
  getStartedText?: string;
  getStartedClassName?: string;
  ctaGlowClassName?: string;
  ctaWrapperClassName?: string;
  variant?: HeroVariant;
  lang?: languagesType;
  testimonial?: boolean;
  videoCta?: boolean;
  secondaryCta?: {
    title: string;
    href: string;
  };
}

export default function Hero({
  children,
  title,
  mainTitleEmphasis,
  getStartedLink,
  getStartedText,
  getStartedClassName,
  ctaGlowClassName: ctaGlowClassNameProp,
  ctaWrapperClassName,
  variant = 'default',
  lang = 'en',
  testimonial = true,
  videoCta = true,
  secondaryCta,
}: HeroProps) {
  const { partialTitle, highlightTitle } = splitTitle(
    title.main,
    mainTitleEmphasis,
  );
  const isAppStore = variant === 'app-store';

  const translations = {
    en: {
      watchDemo: 'Watch demo',
      getStarted: 'Get Started',
      scrollDown: 'Scroll down to learn more',
      trustedBy: 'Trusted by leading companies worldwide',
    },
    'zh-cn': {
      watchDemo: '观看演示',
      getStarted: '免费开始 (无需信用卡)',
      scrollDown: '向下滚动了解更多',
      trustedBy: '全球领先企业的信赖之选',
    },
  };

  const t =
    translations[lang as keyof typeof translations] || translations['en'];
  const ctaLabel = getStartedText || t.getStarted;
  const subtitleClassName = isAppStore
    ? 'text-muted-foreground'
    : 'text-slate-600';
  const titleClassName = isAppStore ? 'text-foreground' : 'text-slate-900';
  const ctaBaseClassName = isAppStore
    ? cn(buttonVariants({ variant: 'landing-primary' }), 'h-11 gap-2 px-8')
    : 'relative flex w-auto items-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-10 py-5 text-lg leading-none font-bold text-white shadow-xl shadow-orange-500/25 transition-all hover:shadow-orange-500/40';
  const ctaGlowClassName = cn(isAppStore ? 'hidden' : '', ctaGlowClassNameProp);

  return (
    <section className="relative overflow-hidden pt-12 sm:pt-16">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10">
        <div className="animate-blob absolute top-0 -left-4 h-72 w-72 rounded-full bg-emerald-400 opacity-20 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-2000 absolute top-0 -right-4 h-72 w-72 rounded-full bg-orange-400 opacity-20 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 rounded-full bg-slate-600 opacity-10 mix-blend-multiply blur-xl filter"></div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto text-center">
          {/* Limited offer badge */}
          {/* <div className="mb-4 inline-flex animate-pulse items-center rounded-full border border-orange-500 bg-orange-400 px-4 py-1.5 text-sm font-bold text-orange-900 shadow-lg shadow-orange-500/20">
            <svg
              className="mr-1.5 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
            🔥 Limited Time: 50% OFF for First 100 Users
          </div> */}

          <p
            className={cn(
              'font-inter mx-auto max-w-3xl px-6 text-lg leading-relaxed',
              subtitleClassName,
            )}
          >
            {title.sub}
          </p>
          <h1
            className={cn(
              'font-pj mt-5 text-4xl leading-tight font-bold sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight whitespace-pre-line',
              titleClassName,
            )}
          >
            {partialTitle}
            <span className="relative inline-flex sm:inline">
              <span className="absolute inset-0 h-full w-full animate-pulse bg-gradient-to-r from-white via-blue-400 to-blue-600 opacity-20 blur-lg"></span>
              <span className="relative bg-gradient-to-r from-white via-blue-400 to-blue-600 bg-clip-text text-transparent">
                {' '}
                {highlightTitle}
              </span>
            </span>
          </h1>

          {getStartedLink && (
            <>
              {/* CTA buttons */}
              <div className="animate-fade-in-up mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <div className={cn('group relative', ctaWrapperClassName)}>
                  <div
                    className={cn(
                      'animate-tilt absolute -inset-0.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 opacity-75 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200',
                      ctaGlowClassName,
                    )}
                  ></div>
                  <GetStartedButton
                    className={cn(ctaBaseClassName, getStartedClassName)}
                    link={getStartedLink}
                    title={ctaLabel}
                    location="hero"
                  />
                </div>
                {secondaryCta && (
                  <CustomButton
                    className="font-pj inline-flex items-center justify-center rounded-xl border-2 border-slate-300 bg-white px-8 py-4.5 text-lg font-medium text-slate-700 transition-all duration-300 hover:scale-105 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-xl hover:shadow-emerald-500/10 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
                    title={secondaryCta.title}
                    href={secondaryCta.href}
                    location="hero"
                  >
                    {videoCta && (
                      <svg
                        className="mr-2 h-5 w-5"
                        viewBox="0 0 18 18"
                        fill="none"
                        stroke="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.18003 13.4261C6.8586 14.3918 5 13.448 5 11.8113V5.43865C5 3.80198 6.8586 2.85821 8.18003 3.82387L12.5403 7.01022C13.6336 7.80916 13.6336 9.44084 12.5403 10.2398L8.18003 13.4261Z"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    {secondaryCta.title}
                  </CustomButton>
                )}
              </div>

              {testimonial && (
                <>
                  {/* Testimonial badge */}
                  <div className="animate-fade-in-up-delayed mt-8 flex flex-col items-center justify-center">
                    <TestimonialBadge count="10K+" lang={lang} />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-8">{children}</div>
    </section>
  );
}

function splitTitle(str: string, numLastWords: number) {
  const input = str.trim();
  // Collect positions of each word without destroying original whitespace/newlines
  const re = /\S+/g;
  const positions: { index: number; length: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    positions.push({ index: m.index, length: m[0].length });
  }

  if (positions.length === 0 || numLastWords <= 0) {
    return { partialTitle: input, highlightTitle: '' };
  }

  const count = Math.min(numLastWords, positions.length);
  const startIndex = positions[positions.length - count].index;

  return {
    // Preserve original whitespace (including newlines) before the highlighted chunk
    partialTitle: input.slice(0, startIndex).trimEnd(),
    highlightTitle: input.slice(startIndex).trimStart(),
  };
}
