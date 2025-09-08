'use client';

import React from 'react';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { RocketIcon } from '@/components/animated-icons';
import {
  CheckCircle,
  Clock,
  ArrowRight,
  Code,
  Package,
  RefreshCwIcon,
  Star,
  Zap,
} from 'lucide-react';
import { languagesType } from '@/lib/i18n';
import { appDomain } from '@/config/site';
import { cn } from '@/lib/utils';
import { Particles } from '@/components/ui/particles';
import { BorderBeam } from '@/components/ui/border-beam';
import { CustomButton } from '@/components/ui/button-custom';

const translations = {
  en: {
    title: 'Your Complete DevBox Journey',
    subtitle:
      'From project creation to production deployment - experience the streamlined workflow',
    cta: {
      title: 'Ready to transform your development workflow?',
      button: 'Start Free – No Credit Card',
      subtext:
        'Join 10,000+ developers building faster with cloud-native development',
    },
    timeline: [
      {
        time: 'Step 1',
        emoji: '🚀',
        icon: Zap,
        title: 'Create Your Project in Seconds',
        description:
          'Choose your framework, click create. DevBox instantly provisions a cloud development environment with all dependencies pre-installed.',
        comparison: {
          before:
            'Previously: Hours installing Node, Python, Docker, configuring environments',
          after: 'Now: Select template, click create, start coding immediately',
        },
        metrics: {
          value: '30',
          unit: 'seconds',
          label: 'to create project',
        },
        details: [
          'Choose from 20+ framework templates',
          'All dependencies pre-installed',
          'Git repository auto-initialized',
        ],
      },
      {
        time: 'Step 2',
        emoji: '💻',
        icon: Code,
        title: 'Code with Your Favorite IDE',
        description:
          'Connect VS Code, Cursor, or JetBrains directly to your cloud environment. Code runs in the cloud while you work from any device.',
        comparison: {
          before: 'Previously: Heavy local setup, works on my machine issues',
          after:
            'Now: Cloud environment accessible from anywhere, identical for all',
        },
        metrics: {
          value: '100%',
          unit: 'consistent',
          label: 'environments',
        },
        details: [
          'Remote development with local IDE',
          'Real-time preview with public URL',
          'Code saved in cloud, access anywhere',
        ],
      },
      {
        time: 'Step 3',
        emoji: '📦',
        icon: Package,
        title: 'Package & Release (Image)',
        description:
          'When ready, package your app into a standard container image. DevBox bundles code, dependencies, and runtime.',
        comparison: {
          before:
            'Previously: Complex Docker builds, dependency management nightmares',
          after: 'Now: One-click release with automatic packaging',
        },
        metrics: {
          value: '1',
          unit: 'click',
          label: 'to create release',
        },
        details: [
          'Automatic image creation',
          'Version management built-in',
          'Shareable with team or registry',
        ],
      },
      {
        time: 'Step 4',
        emoji: '🚀',
        icon: RocketIcon,
        title: 'Deploy to Production',
        description:
          'One-click deploy your release to Sealos App Launchpad. Configure resources, environment variables, and networking — then go live.',
        comparison: {
          before:
            'Previously: Complex Kubernetes configs, CI/CD pipeline setup',
          after: 'Now: Visual deployment with auto-scaling built-in',
        },
        metrics: {
          value: '2',
          unit: 'minutes',
          label: 'to production',
        },
        details: [
          'Deploy directly from DevBox',
          'Auto-configure Kubernetes resources',
          'Public URL automatically assigned',
        ],
      },
      {
        time: 'Step 5',
        emoji: '🔄',
        icon: RefreshCwIcon,
        title: 'Iterate and Update',
        description:
          'Need changes? Update code in DevBox, create new release, deploy update. The entire cycle takes minutes, not hours.',
        comparison: {
          before:
            'Previously: Long release cycles, complex rollback procedures',
          after: 'Now: Rapid iteration with instant rollback if needed',
        },
        metrics: {
          value: '10x',
          unit: 'faster',
          label: 'iteration cycles',
        },
        details: [
          'Hot reload during development',
          'Version control for releases',
          'One-click production updates',
        ],
      },
      {
        time: 'Bonus',
        emoji: '🎯',
        icon: Star,
        title: 'Focus on What Matters',
        description:
          'With DevBox handling environments, packaging, and deployment, you focus purely on writing great code and building features.',
        comparison: {
          before: 'Previously: 50% time on environment and deployment issues',
          after: 'Now: 90% time on actual development',
        },
        metrics: {
          value: '3x',
          unit: 'more',
          label: 'productive',
        },
        details: [
          'No environment maintenance',
          'No deployment complexity',
          'Pure development focus',
        ],
      },
    ],
  },
  'zh-cn': {
    title: '您的完整 DevBox 之旅',
    subtitle: '从项目创建到生产部署 - 体验简化的工作流程',
    cta: {
      title: '准备好改变您的开发工作流了吗？',
      button: '免费开始（无需信用卡）',
      subtext: '加入 10,000+ 使用云原生开发更快构建的开发者',
    },
    timeline: [
      {
        time: '步骤 1',
        emoji: '🚀',
        icon: Zap,
        title: '几秒钟内创建您的项目',
        description:
          '选择您的框架，点击创建。DevBox 立即配置一个云开发环境，所有依赖项都已预安装。',
        comparison: {
          before: '以前：花费数小时安装 Node、Python、Docker，配置环境',
          after: '现在：选择模板，点击创建，立即开始编码',
        },
        metrics: {
          value: '30',
          unit: '秒',
          label: '创建项目',
        },
        details: [
          '从 20+ 框架模板中选择',
          '所有依赖项预安装',
          'Git 仓库自动初始化',
        ],
      },
      {
        time: '步骤 2',
        emoji: '💻',
        icon: Code,
        title: '使用您喜欢的 IDE 编码',
        description:
          '将 VS Code、Cursor 或 JetBrains 直接连接到您的云环境。代码在云中运行，而您可以从任何设备工作。',
        comparison: {
          before: '以前：繁重的本地设置，"在我的机器上能运行"的问题',
          after: '现在：可从任何地方访问的云环境，对所有人来说都是相同的',
        },
        metrics: {
          value: '100%',
          unit: '一致',
          label: '环境',
        },
        details: [
          '使用本地 IDE 进行远程开发',
          '使用公共 URL 实时预览',
          '代码保存在云中，可随时访问',
        ],
      },
      {
        time: '步骤 3',
        emoji: '📦',
        icon: Package,
        title: '打包并发布（镜像）',
        description:
          '准备就绪后，将应用打包为标准容器镜像。DevBox 会打包代码、依赖与运行时。',
        comparison: {
          before: '以前：复杂的 Docker 构建，依赖管理噩梦',
          after: '现在：一键发布，自动打包',
        },
        metrics: {
          value: '1',
          unit: '点击',
          label: '创建发布',
        },
        details: ['自动镜像创建', '内置版本管理', '可与团队或注册表共享'],
      },
      {
        time: '步骤 4',
        emoji: '🚀',
        icon: RocketIcon,
        title: '部署到生产环境',
        description:
          '一键将发布部署到 Sealos App Launchpad。配置资源、环境变量与网络——然后上线。',
        comparison: {
          before: '以前：复杂的 Kubernetes 配置，CI/CD 管道设置',
          after: '现在：可视化部署，内置自动扩展',
        },
        metrics: {
          value: '2',
          unit: '分钟',
          label: '到生产',
        },
        details: [
          '直接从 DevBox 部署',
          '自动配置 Kubernetes 资源',
          '自动分配公共 URL',
        ],
      },
      {
        time: '步骤 5',
        emoji: '🔄',
        icon: RefreshCwIcon,
        title: '迭代和更新',
        description:
          '需要更改？在 DevBox 中更新代码，创建新版本，部署更新。整个周期只需几分钟，而不是几小时。',
        comparison: {
          before: '以前：漫长的发布周期，复杂的回滚程序',
          after: '现在：快速迭代，需要时即时回滚',
        },
        metrics: {
          value: '10倍',
          unit: '更快',
          label: '迭代周期',
        },
        details: ['开发期间的热重载', '发布版本控制', '一键生产更新'],
      },
      {
        time: '奖励',
        emoji: '🎯',
        icon: Star,
        title: '专注于重要的事情',
        description:
          '有了 DevBox 处理环境、打包和部署，您可以纯粹专注于编写优秀的代码和构建功能。',
        comparison: {
          before: '以前：50% 的时间花在环境和部署问题上',
          after: '现在：90% 的时间用于实际开发',
        },
        metrics: {
          value: '3倍',
          unit: '更多',
          label: '生产力',
        },
        details: ['无需环境维护', '无需部署复杂性', '纯粹的开发专注'],
      },
    ],
  },
};

interface WorkflowProps {
  lang: languagesType;
}

export default function Workflow({ lang }: WorkflowProps) {
  const t = translations[lang] || translations.en;

  return (
    <section className="relative py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-gray-50 to-white" />
      {/* Gradient border overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-gray-200), var(--color-white))',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'xor',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          padding: '2px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4">
        <AnimateElement type="slideUp">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
              {t.title}
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {t.subtitle}
            </p>
          </div>
        </AnimateElement>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line for desktop */}
          <div className="absolute top-0 bottom-0 left-1/2 hidden w-0.5 -translate-x-1/2 bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 lg:block" />

          <div className="space-y-12 lg:space-y-20">
            {t.timeline.map((event, index) => {
              const isEven = index % 2 === 0;
              const IconComponent = event.icon;

              return (
                <AnimateElement key={index} type="slideUp" delay={index * 0.1}>
                  <div
                    className={cn(
                      'relative flex flex-col lg:flex-row lg:items-center',
                      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse',
                    )}
                  >
                    {/* Content */}
                    <div
                      className={cn(
                        'flex-1',
                        isEven ? 'lg:pr-20 lg:text-right' : 'lg:pl-20',
                      )}
                    >
                      <div
                        className={cn(
                          'relative overflow-hidden rounded-2xl bg-white p-8 shadow-xl',
                          'border-gray-100 transition-colors hover:border-blue-200',
                        )}
                      >
                        {/* Time Badge */}
                        <div
                          className={cn(
                            'mb-4 flex items-center gap-3',
                            isEven ? 'lg:justify-end' : '',
                          )}
                        >
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-500">
                            {event.time}
                          </span>
                        </div>

                        {/* Title with Icon */}
                        <div
                          className={cn(
                            'mb-4 flex items-center gap-3',
                            isEven ? 'lg:flex-row-reverse lg:justify-end' : '',
                          )}
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <IconComponent size={24} />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {event.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="mb-6 text-lg text-gray-600">
                          {event.description}
                        </p>

                        {/* Before/After Comparison */}
                        <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
                          <div className="flex items-start gap-3">
                            <span className="mt-1.5 block h-2 w-2 flex-shrink-0 rounded-full bg-red-400" />
                            <div className="flex-1">
                              <p
                                className={cn(
                                  'text-sm text-gray-600',
                                  isEven ? 'lg:text-left' : '',
                                )}
                              >
                                <span className="font-medium text-red-600">
                                  Before:{' '}
                                </span>
                                {event.comparison.before.replace(
                                  'Previously: ',
                                  '',
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <span className="mt-1.5 block h-2 w-2 flex-shrink-0 rounded-full bg-green-400" />
                            <div className="flex-1">
                              <p
                                className={cn(
                                  'text-sm text-gray-600',
                                  isEven ? 'lg:text-left' : '',
                                )}
                              >
                                <span className="font-medium text-green-600">
                                  After:{' '}
                                </span>
                                {event.comparison.after.replace('Now: ', '')}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="mb-6 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                          <div className="text-center">
                            <div className="flex items-baseline justify-center gap-1">
                              <span className="text-3xl font-bold text-gray-900">
                                {event.metrics.value}
                              </span>
                              <span className="text-lg font-medium text-gray-700">
                                {event.metrics.unit}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {event.metrics.label}
                            </div>
                          </div>
                        </div>

                        {/* Details */}
                        <ul className="space-y-2">
                          {event.details.map((detail, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-sm text-gray-700"
                            >
                              <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                              <span
                                className={cn(isEven ? 'lg:text-left' : '')}
                              >
                                {detail}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* Add BorderBeam effect for highlighted cards */}
                        {index === 0 && (
                          <BorderBeam
                            size={200}
                            duration={12}
                            delay={0}
                            colorFrom="#3b82f6"
                            colorTo="#a855f7"
                            borderWidth={2}
                          />
                        )}
                      </div>
                    </div>

                    {/* Timeline dot */}
                    <div className="relative z-10 my-8 lg:absolute lg:top-1/2 lg:left-1/2 lg:my-0 lg:-translate-x-1/2 lg:-translate-y-1/2">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-white">
                        <div
                          className={cn(
                            'flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-2xl',
                            index === 0 && 'from-blue-500 to-indigo-600',
                            index === 1 && 'from-purple-500 to-pink-600',
                            index === 2 && 'from-green-500 to-emerald-600',
                            index === 3 && 'from-orange-500 to-red-600',
                            index === 4 && 'from-pink-500 to-rose-600',
                            index === 5 && 'from-indigo-500 to-purple-600',
                          )}
                        >
                          {event.emoji}
                        </div>
                      </div>
                    </div>

                    {/* Spacer for desktop */}
                    <div className="hidden flex-1 lg:block" />
                  </div>
                </AnimateElement>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <AnimateElement type="slideUp" delay={0.8}>
          <div className="relative mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-center text-white">
            <Particles
              className="absolute inset-0"
              quantity={50}
              ease={80}
              color="#ffffff"
              size={0.8}
              staticity={60}
            />
            <div className="relative z-10">
              <h3 className="mb-4 text-3xl font-bold">{t.cta.title}</h3>
              <p className="mb-8 text-lg opacity-90">{t.cta.subtext}</p>
              <CustomButton
                className="group inline-flex items-center rounded-lg border-2 border-white/70 bg-transparent px-8 py-4 font-semibold text-white transition-all hover:bg-white hover:text-blue-600 hover:shadow-xl"
                title={t.cta.button}
                href={`${appDomain}/?openapp=system-devbox`}
                location="workflow-cta"
                newWindow={false}
              >
                <Zap className="mr-2 h-5 w-5" />
                {t.cta.button}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </CustomButton>
            </div>
          </div>
        </AnimateElement>
      </div>
    </section>
  );
}
