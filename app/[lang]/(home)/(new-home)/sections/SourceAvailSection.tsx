'use client';

import { useOpenAuthForm } from '@/new-components/AuthForm/AuthFormContext';
import { getOpenBrainParam } from '@/lib/utils/brain';
import { memo, useRef } from 'react';
import { useGTM } from '@/hooks/use-gtm';
import { StatsCards } from '../components/StatsCards';
import { WhySourceAvailableMatters } from '../components/WhySourceAvailableMatters';
import { GodRays } from '@/new-components/GodRays';
import { GradientText } from '@/new-components/GradientText';
import { GradientGitHub } from '../components/GradientIcon';
import { CodeXmlIcon } from 'lucide-react';
import { useInView } from 'motion/react';

interface SourceAvailSectionProps {
  lang?: string;
}

export default memo(function SourceAvailSection({
  lang = 'en',
}: SourceAvailSectionProps) {
  const { trackButton } = useGTM();
  const openAuthForm = useOpenAuthForm();

  const translations = {
    en: {
      badge: '100% source available',
      title: 'Open Source at Core, ',
      titleHighlight: 'Freedom by Design',
      description:
        "Don't bet your business on a black box. Choose the cloud OS that lets you run anywhere—from our managed cloud to your own infrastructure.",
      viewSourceCode: 'View Source Code',
      startForFree: 'Get Started Free',
    },
    'zh-cn': {
      badge: '100% 开源可用',
      title: '核心开源，',
      titleHighlight: '设计自由。',
      description:
        '别把你的业务押注在黑盒子上。选择一个允许你在任何地方运行的云操作系统——无论是我们的托管云，还是你自己的基础设施。',
      viewSourceCode: '查看源代码',
      startForFree: '免费开始',
    },
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="relative w-screen overflow-x-clip pt-28 pb-32"
    >
      {/* GodRays 效果 - only render when in view */}
      {isInView && (
        <GodRays
          sources={[
            {
              x: 0.4,
              y: -0.2,
              angle: 60,
              spread: 30,
              count: 15,
              color: '220, 220, 220',
            },
            {
              x: 0.85,
              y: -0.15,
              angle: 60,
              spread: 25,
              count: 13,
              color: '225, 225, 225',
            },
          ]}
          speed={0.0019}
          maxWidth={90}
          minLength={1100}
          maxLength={1700}
          blur={17}
        />
      )}

      {/* 顶部渐变遮罩 - 在 GodRays 上方 */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-96 w-screen -translate-x-1/2"
        style={{
          background:
            'linear-gradient(to bottom, rgba(30, 30, 30, 0.6) 0%, rgba(20, 20, 20, 0.4) 40%, transparent 100%)',
        }}
      />

      <div className="container">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Main content */}
          <div className="relative z-10 h-auto w-full">
            <div className="flex flex-col items-start justify-between pb-10 lg:flex-row">
              {/* Left side - Main content */}
              <div className="w-full max-w-6xl">
                {/* Badge */}
                <div className="mb-6">
                  <div className="inline-flex h-10 items-center justify-center gap-1 rounded-full border border-white/5 bg-white/5 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                    {/* Icon */}
                    <GradientGitHub className="size-5" />

                    {/* Text */}
                    <span className="text-base leading-none font-medium whitespace-nowrap text-white">
                      {t.badge}
                    </span>
                  </div>
                </div>

                {/* Main heading */}
                <div className="flex flex-col pb-10">
                  <h2
                    className="text-2xl leading-tight sm:text-4xl md:text-4xl"
                    aria-label="Built for the Modern Application."
                  >
                    <span>{t.title}</span>&nbsp;
                    <GradientText>{t.titleHighlight}</GradientText>
                  </h2>
                  <p className="mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
                    {t.description}
                  </p>
                </div>
              </div>

              {/* Right side - Action buttons */}
              <div className="ml-0 flex h-10 items-end justify-end gap-3 lg:mt-16 lg:ml-8">
                {/* View Source Code */}
                <a
                  href="https://github.com/labring/sealos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-44 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 shadow-sm"
                >
                  <CodeXmlIcon className="size-4" />
                  <span className="h-5 text-sm leading-5 font-medium whitespace-nowrap text-white">
                    {t.viewSourceCode}
                  </span>
                </a>

                <button
                  className="flex h-10 items-center justify-center gap-2 rounded-full border border-white bg-gradient-to-br from-white to-gray-300 px-4 py-2 shadow-lg"
                  onClick={() => {
                    trackButton('Get Started', 'oss-section', 'auth-form', '');
                    openAuthForm({ openapp: getOpenBrainParam() });
                  }}
                >
                  <span className="text-sm leading-5 font-medium whitespace-nowrap text-zinc-900">
                    {t.startForFree}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards Section (80px gap from hero) */}
        <StatsCards />

        {/* Why Source Available Matters Section */}
        <WhySourceAvailableMatters />
      </div>
    </section>
  );
});
