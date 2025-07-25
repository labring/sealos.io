'use client';

import {
  Zap,
  Package,
  Rocket,
  Code2,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { languagesType } from '@/lib/i18n';
import { CustomButton } from '@/components/ui/button-custom';
import TypewriterCode from '@/components/ui/typewriter-code';
import TerminalAnimation, {
  TerminalAnimationRef,
} from '@/components/ui/terminal-animation';
import AnimatedCounter from '@/components/ui/animated-counter';

// Lazy load the AnimateElement component
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

// Icon map with enhanced styling
const iconMap = {
  zap: (className: string) => <Zap className={className} />,
  package: (className: string) => <Package className={className} />,
  rocket: (className: string) => <Rocket className={className} />,
};

export default function DevBoxShowcase({ lang = 'en' as languagesType }) {
  const t = translations[lang];
  const terminalStartedRef = useRef(false);
  const terminalComponentRef = useRef<TerminalAnimationRef | null>(null);

  // Handle progress from TypewriterCode
  const handleCodeProgress = (lineIndex: number) => {
    // Start terminal when we reach line 7 (// 3. Develop in Cloud Environment)
    if (lineIndex >= 7 && !terminalStartedRef.current) {
      terminalStartedRef.current = true;
      // Directly call the terminal component's start method
      if (terminalComponentRef.current) {
        terminalComponentRef.current.startAnimation();
      }
    }
  };

  // Enhanced Features component with 3D effects and animations
  const Features = () => (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-8">
      {t.features.map((feature, index) => (
        <motion.div
          key={index}
          className="group relative flex h-full overflow-hidden rounded-xl border border-blue-100/50 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 p-4 backdrop-blur-sm xl:rounded-2xl xl:p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.2,
            duration: 0.6,
            y: { duration: 0.2 },
            scale: { duration: 0.2 },
            boxShadow: { duration: 0.2 },
          }}
          whileHover={{
            y: -8,
            scale: 1.02,
            boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.25)',
          }}
        >
          {/* Dynamic background decoration */}
          <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-cyan-400/5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

          {/* Border glow effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 blur-sm transition-opacity duration-200 group-hover:opacity-100" />

          <div className="relative z-10 flex h-full flex-col xl:h-auto">
            <div className="grid grid-cols-[auto_1fr] items-center gap-4 xl:grid-cols-1 xl:gap-0">
              {/* Enhanced icon container */}
              <motion.div
                className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl xl:mb-6 xl:h-16 xl:w-16 xl:bg-gradient-to-br xl:from-white xl:to-blue-50 xl:shadow-lg"
                whileHover={{
                  rotate: [0, -5, 5, 0],
                  scale: 1.1,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Icon glow effect */}
                <div className="absolute inset-0 rounded-xl bg-blue-400/20 opacity-0 blur-md transition-opacity duration-200 group-hover:opacity-100" />

                <motion.div
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                >
                  {iconMap[feature.icon as keyof typeof iconMap](
                    'h-8 w-8 text-[#44BCFF] relative z-10',
                  )}
                </motion.div>
              </motion.div>

              <div>
                <h3 className="mb-1 text-xl font-bold text-gray-900 xl:mb-3">
                  {feature.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Enhanced main content component with advanced visual effects
  const Content = () => (
    <section
      className="relative overflow-hidden bg-gradient-to-b from-transparent via-blue-50/20 to-transparent py-20"
      data-mouse-light-container
    >
      {/* Enhanced background decoration */}
      <div className="absolute inset-0">
        {/* Main light effects */}
        <motion.div
          className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <motion.div
          className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-cyan-200/20 to-blue-200/20 blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-blue-400/20"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Mouse follow light effect */}

      <div className="relative px-8">
        {/* Title Section */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-blue-100 px-4 py-2">
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
        <div className="mt-20 grid grid-cols-1 gap-12 xl:grid-cols-2 xl:items-center">
          {/* Left: Capabilities */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              {t.capabilities.title}
            </h3>
            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-1">
              {t.capabilities.items.map((item, index) => (
                <li key={index} className="flex">
                  <CheckCircle className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-[#44BCFF]" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>

            {/* Enhanced animated stats */}
            <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-3 sm:gap-6">
              <AnimatedCounter
                value="95%"
                label="Faster Setup"
                icon={<Zap className="h-4 w-4" />}
                delay={0}
              />
              <AnimatedCounter
                value="45%"
                label="Higher Satisfaction"
                icon={<TrendingUp className="h-4 w-4" />}
                delay={1}
              />
              <AnimatedCounter
                value="40%"
                label="Less IT Overhead"
                icon={<Shield className="h-4 w-4" />}
                delay={2}
              />
            </div>

            {/* Enhanced CTA Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 xl:justify-start">
              <motion.div
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <CustomButton
                  href={`${lang === 'zh-cn' ? 'https://cloud.sealos.run' : 'https://os.sealos.io'}/?openapp=system-devbox`}
                  className="relative inline-flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-[#44BCFF] to-[#0090FF] px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:from-[#0090FF] hover:to-[#0070CC] hover:shadow-xl"
                  title={t.cta.primary}
                  actionType="url"
                  location="devbox-showcase-primary-cta"
                >
                  <span className="relative z-10 flex items-center">
                    {t.cta.primary}
                    <motion.div
                      className="ml-2"
                      animate={{ x: [0, 3, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </span>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#44BCFF]/40 to-[#0090FF]/40 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-50" />
                </CustomButton>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <CustomButton
                  href={`/${lang === 'zh-cn' ? 'zh-cn/' : ''}products/devbox`}
                  className="relative inline-flex items-center overflow-hidden rounded-xl border-2 border-blue-100 bg-gradient-to-r from-white to-blue-50/30 px-8 py-4 font-semibold text-gray-700 shadow-lg transition-all duration-300 hover:border-[#44BCFF]/30 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100/50 hover:text-[#44BCFF] hover:shadow-xl"
                  title={t.cta.secondary}
                  actionType="url"
                  location="devbox-showcase-secondary-cta"
                >
                  <span className="relative z-10 flex items-center">
                    {t.cta.secondary}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </CustomButton>
              </motion.div>
            </div>
          </div>

          {/* Right: Enhanced Demo with Real Code Editor Interface */}
          <div className="relative">
            {/* Main editor window */}
            <motion.div
              className="relative rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-1 shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.2 }}
            >
              {/* Window glow effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 blur-sm" />

              <div className="relative overflow-hidden rounded-lg bg-gray-900">
                {/* Enhanced title bar */}
                <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <span className="ml-4 text-sm text-gray-300">
                      Local IDE - Remote DevBox
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="h-2 w-2 rounded-full bg-green-400"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs text-green-400">Connected</span>
                  </div>
                </div>

                {/* Code area with typewriter effect */}
                <div className="scrollbar-hide min-h-[160px] p-3 font-mono text-sm sm:min-h-[200px] sm:p-4">
                  <TypewriterCode onProgress={handleCodeProgress} />
                </div>

                {/* Terminal area */}
                <div className="scrollbar-hide h-[160px] border-t border-gray-700 bg-black/50 p-3 sm:h-[160px] sm:p-4">
                  <TerminalAnimation ref={terminalComponentRef} />
                </div>
              </div>
            </motion.div>

            {/* Floating status card */}
            <motion.div
              className="absolute -right-6 -bottom-6 rounded-lg border border-gray-100 bg-white p-4 shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.2 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#44BCFF] to-[#0090FF]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  <Rocket className="h-5 w-5 text-white" />
                </motion.div>
                <div>
                  <div className="text-xs text-gray-500">DevBox Status</div>
                  <motion.div
                    className="space-y-1 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.2 }}
                  >
                    <div className="text-green-600">✓ Environment Ready</div>
                    <div className="text-green-600">✓ IDE Connected</div>
                    <div className="text-blue-600">→ Developing...</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Sealos DevBox',
              applicationCategory: 'DeveloperApplication',
              description: t.subtitle,
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
            }),
          }}
        />
      </div>
    </section>
  );

  return (
    <Suspense
      fallback={
        <div className="mt-[140px] flex min-h-[600px] items-center justify-center">
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
  );
}
