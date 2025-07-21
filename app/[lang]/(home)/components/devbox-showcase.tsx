'use client';

import { Suspense, useRef, useMemo, memo } from 'react';
import dynamic from 'next/dynamic';
import { motion, useInView } from 'framer-motion';
import { languagesType } from '@/lib/i18n';
import { CustomButton } from '@/components/ui/button-custom';
import OptimizedIcon from '@/components/ui/optimized-icon';
import LazyIntersection from '@/components/ui/lazy-intersection';
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
  Code2,
} from 'lucide-react';

// Lazy load components for better performance
const AnimateElement = dynamic(
  () =>
    import('@/components/ui/animated-wrapper').then((mod) => ({
      default: mod.AnimateElement,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="mt-[140px] flex min-h-[600px] items-center justify-center">
        <div className="animate-pulse text-gray-400">
          Loading DevBox showcase...
        </div>
      </div>
    ),
  },
);

const AnimatedCounter = dynamic(
  () => import('@/components/ui/animated-counter'),
  { ssr: false },
);

const TerminalDemo = dynamic(() => import('./devbox-terminal'), {
  ssr: false,
  loading: () => (
    <div className="relative min-h-[280px] lg:min-h-[320px]">
      <div className="h-full rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-1">
        <div className="h-full rounded-lg bg-gray-900 p-4">
          <div className="mb-3 flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-gray-700"></div>
            <div className="h-3 w-3 rounded-full bg-gray-700"></div>
            <div className="h-3 w-3 rounded-full bg-gray-700"></div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 animate-pulse rounded bg-gray-800"></div>
            <div className="h-2 w-1/2 animate-pulse rounded bg-gray-800"></div>
            <div className="h-2 w-full animate-pulse rounded bg-gray-800"></div>
            <div className="mt-4 h-32 w-full animate-pulse rounded bg-gray-800"></div>
          </div>
        </div>
      </div>
    </div>
  ),
});

// Define translations
const translations = {
  en: {
    title: 'Focus on Your Code, Not Configuration',
    subtitle:
      'Eliminate development environment friction with ready-to-code cloud workstations. Instant setup, perfect isolation, enterprise security.',
    features: [
      {
        icon: 'zap',
        title: 'Ready in 60 Seconds',
        description: 'Pre-configured cloud workstations eliminate setup time',
      },
      {
        icon: 'package',
        title: '100% Reproducible',
        description: 'Isolated environments that never degrade or conflict',
      },
      {
        icon: 'rocket',
        title: 'One-Click Deploy',
        description: 'From development to production with zero configuration',
      },
    ],
    capabilities: {
      title: 'How Sealos DevBox Solves Everything',
      items: [
        'Instant environment provisioning',
        'Zero dependency conflicts',
        'Version-controlled environments',
        'Unified development experience',
        'Automated cost optimization',
        'Enhanced security posture',
      ],
    },
    stats: {
      setup: '95% faster setup',
      satisfaction: '45% higher satisfaction',
      cost: '40% less IT overhead',
    },
    cta: {
      primary: 'Start Developing Now',
      secondary: 'Learn More',
    },
  },
  'zh-cn': {
    title: '专注代码，无需配置',
    subtitle:
      '使用即开即用的云工作站消除开发环境摩擦。即时设置，完美隔离，企业级安全。',
    features: [
      {
        icon: 'zap',
        title: '60秒内就绪',
        description: '预配置的云工作站消除设置时间',
      },
      {
        icon: 'package',
        title: '100% 可重现',
        description: '永不降级或冲突的隔离环境',
      },
      {
        icon: 'rocket',
        title: '一键部署',
        description: '从开发到生产，零配置',
      },
    ],
    capabilities: {
      title: 'Sealos DevBox 如何解决所有问题',
      items: [
        '即时环境配置',
        '零依赖冲突',
        '版本控制的环境',
        '统一的开发体验',
        '自动成本优化',
        '增强的安全态势',
      ],
    },
    stats: {
      setup: '设置时间快95%',
      satisfaction: '满意度提升45%',
      cost: 'IT开销减少40%',
    },
    cta: {
      primary: '立即开始开发',
      secondary: '观看演示',
    },
  },
};

// Pre-calculate structured data to avoid re-computation
const getStructuredData = (subtitle: string) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Sealos DevBox',
  applicationCategory: 'DeveloperApplication',
  description: subtitle,
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '2000',
  },
  featureList: [
    'Instant environment provisioning',
    'Zero dependency conflicts',
    'Version-controlled environments',
    'One-click deployment',
    'Auto-scaling infrastructure',
  ],
});

function DevBoxShowcase({ lang = 'en' as languagesType }) {
  const t = translations[lang];

  // Memoize structured data to avoid recalculation
  const structuredData = useMemo(
    () => getStructuredData(t.subtitle),
    [t.subtitle],
  );

  // Memoized Features component for better performance
  const Features = memo(() => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    return (
      <div ref={ref} className="grid gap-8 lg:grid-cols-3">
        {t.features.map((feature, index) => (
          <motion.div
            key={feature.icon}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative h-full overflow-hidden rounded-2xl border border-gray-200/50 bg-white/60 p-8 shadow-sm backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:border-blue-200 hover:bg-white/80 hover:shadow-lg">
              {/* Simplified background with CSS animation */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-purple-400/0 to-blue-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.05]" />

              {/* Static decoration - no continuous animation */}
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-blue-100/20 to-purple-100/20 opacity-50 transition-all duration-500 group-hover:opacity-100" />

              <div className="relative z-10">
                {/* Simplified icon container */}
                <div className="mb-6 inline-flex rounded-xl bg-blue-50/50 p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100/50">
                  <OptimizedIcon
                    icon={feature.icon as 'Zap' | 'Package' | 'Rocket'}
                    className="h-8 w-8 text-[#44BCFF]"
                  />
                </div>

                <h3 className="mb-3 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#44BCFF]">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>

                {/* CSS-based progress bar */}
                <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#44BCFF] to-purple-500 transition-all duration-500 group-hover:w-full" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  });
  Features.displayName = 'Features';

  // Main content component
  const Content = () => (
    <section className="relative overflow-hidden py-20">
      {/* Background decoration - subtle gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-[#44BCFF] opacity-10 blur-3xl"></div>
      </div>

      <div className="relative px-4 sm:px-6 lg:px-8">
        {/* Title Section */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-50/50 px-4 py-2 backdrop-blur-sm">
            <Code2 className="mr-2 h-4 w-4 text-[#44BCFF]" />
            <span className="text-sm font-medium text-[#44BCFF]">DevBox</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-gray-900">{t.title}</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            {t.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <Features />

        {/* Demo Section */}
        <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Capabilities */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              {t.capabilities.title}
            </h3>
            <ul className="space-y-4">
              {t.capabilities.items.map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-[#44BCFF]" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            {/* Optimized Stats Section */}
            <LazyIntersection>
              <div className="mt-8 overflow-hidden rounded-2xl bg-gray-50/50 p-6">
                <div className="grid grid-cols-3 gap-6">
                  {/* Setup Time */}
                  <div className="text-center transition-transform hover:scale-105">
                    <div className="mb-2 inline-flex rounded-full bg-white p-2 shadow-md">
                      <Zap className="h-5 w-5 text-[#44BCFF]" />
                    </div>
                    <div className="text-3xl font-bold text-[#44BCFF]">
                      <AnimatedCounter value={95} suffix="%" duration={2000} />
                    </div>
                    <div className="mt-1 text-xs font-medium text-gray-600">
                      Faster Setup
                    </div>
                  </div>

                  {/* Developer Satisfaction */}
                  <div className="text-center transition-transform hover:scale-105">
                    <div className="mb-2 inline-flex rounded-full bg-white p-2 shadow-md">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="text-3xl font-bold text-purple-500">
                      <AnimatedCounter
                        value={45}
                        suffix="%"
                        prefix="+"
                        duration={2000}
                        delay={300}
                      />
                    </div>
                    <div className="mt-1 text-xs font-medium text-gray-600">
                      Satisfaction
                    </div>
                  </div>

                  {/* IT Overhead */}
                  <div className="text-center transition-transform hover:scale-105">
                    <div className="mb-2 inline-flex rounded-full bg-white p-2 shadow-md">
                      <Shield className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-500">
                      <AnimatedCounter
                        value={40}
                        suffix="%"
                        prefix="-"
                        duration={2000}
                        delay={600}
                      />
                    </div>
                    <div className="mt-1 text-xs font-medium text-gray-600">
                      IT Overhead
                    </div>
                  </div>
                </div>
              </div>
            </LazyIntersection>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <CustomButton
                href={`${lang === 'zh-cn' ? 'https://cloud.sealos.run' : 'https://os.sealos.io'}/?openapp=system-devbox`}
                className="inline-flex items-center justify-center rounded-md bg-[#44BCFF] px-6 py-3 text-white shadow-lg transition-all hover:bg-[#0090FF] hover:shadow-xl"
                title={t.cta.primary}
                actionType="url"
                location="devbox-showcase-primary-cta"
              >
                {t.cta.primary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </CustomButton>
              <CustomButton
                href={`/${lang === 'zh-cn' ? 'zh-cn/' : ''}products/devbox`}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50"
                title={t.cta.secondary}
                actionType="url"
                location="devbox-showcase-secondary-cta"
              >
                {t.cta.secondary}
                <ArrowRight className="ml-2 h-4 w-4" />
              </CustomButton>
            </div>
          </div>

          {/* Right: Terminal Demo */}
          <div className="relative flex items-center">
            <TerminalDemo />
          </div>
        </div>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </div>
    </section>
  );

  return (
    <div className="relative">
      <Suspense
        fallback={
          <div className="flex min-h-[600px] items-center justify-center">
            <div className="text-center text-gray-500">
              Loading DevBox showcase...
            </div>
          </div>
        }
      >
        <AnimateElement type="slideUp">
          <Content />
        </AnimateElement>
      </Suspense>
    </div>
  );
}

// Export with memo for optimal performance
export default memo(DevBoxShowcase);
