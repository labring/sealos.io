'use client';

import React, { useEffect, useState } from 'react';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { TrendingUp, Clock, Users, Zap, DollarSign } from 'lucide-react';
import { languagesType } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BorderBeam } from '@/components/ui/border-beam';
import { MagicCard } from '@/components/ui/magic-card';

const translations = {
  en: {
    title: 'The DevBox Impact: By the Numbers',
    subtitle: 'Real results from real teams using DevBox every day',
    metrics: [
      {
        icon: Clock,
        label: 'Setup Time Saved',
        value: 95,
        unit: '%',
        description: 'From days to seconds',
        color: 'blue',
      },
      {
        icon: TrendingUp,
        label: 'Productivity Increase',
        value: 10,
        unit: 'x',
        description: 'Ship features faster',
        color: 'green',
      },
      {
        icon: Users,
        label: 'Happy Developers',
        value: 10000,
        unit: '+',
        description: 'And growing daily',
        color: 'purple',
      },
      {
        icon: DollarSign,
        label: 'Cost Reduction',
        value: 40,
        unit: '%',
        description: 'On infrastructure',
        color: 'emerald',
      },
    ],
    comparison: {
      title: 'Traditional vs DevBox Development',
      before: 'Traditional Setup',
      after: 'With DevBox',
      items: [
        {
          metric: 'Environment Setup',
          traditional: '2-3 days',
          devbox: '60 seconds',
          improvement: '99.9% faster',
        },
        {
          metric: 'Build Times',
          traditional: '15-30 minutes',
          devbox: '1-3 minutes',
          improvement: '10x faster',
        },
        {
          metric: 'Deployment Process',
          traditional: '1-2 hours',
          devbox: '5 minutes',
          improvement: '95% faster',
        },
        {
          metric: 'Environment Parity',
          traditional: '~70% similar',
          devbox: '100% identical',
          improvement: 'Perfect match',
        },
        {
          metric: 'Resource Utilization',
          traditional: '30% idle time',
          devbox: 'Pay per use',
          improvement: '40% savings',
        },
      ],
    },
  },
  'zh-cn': {
    title: 'DevBox 影响力：用数字说话',
    subtitle: '来自每天使用 DevBox 的真实团队的真实结果',
    metrics: [
      {
        icon: Clock,
        label: '节省的设置时间',
        value: 95,
        unit: '%',
        description: '从几天到几秒',
        color: 'blue',
      },
      {
        icon: TrendingUp,
        label: '生产力提升',
        value: 10,
        unit: '倍',
        description: '更快交付功能',
        color: 'green',
      },
      {
        icon: Users,
        label: '满意的开发者',
        value: 10000,
        unit: '+',
        description: '每天都在增长',
        color: 'purple',
      },
      {
        icon: DollarSign,
        label: '成本降低',
        value: 40,
        unit: '%',
        description: '基础设施成本',
        color: 'emerald',
      },
    ],
    comparison: {
      title: '传统开发 vs DevBox 开发',
      before: '传统设置',
      after: '使用 DevBox',
      items: [
        {
          metric: '环境设置',
          traditional: '2-3 天',
          devbox: '60 秒',
          improvement: '快 99.9%',
        },
        {
          metric: '构建时间',
          traditional: '15-30 分钟',
          devbox: '1-3 分钟',
          improvement: '快 10 倍',
        },
        {
          metric: '部署流程',
          traditional: '1-2 小时',
          devbox: '5 分钟',
          improvement: '快 95%',
        },
        {
          metric: '环境一致性',
          traditional: '~70% 相似',
          devbox: '100% 相同',
          improvement: '完美匹配',
        },
        {
          metric: '资源利用率',
          traditional: '30% 空闲时间',
          devbox: '按使用付费',
          improvement: '节省 40%',
        },
      ],
    },
  },
};

interface MetricsVisualizationProps {
  lang: languagesType;
}

function AnimatedNumber({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setDisplayValue(Math.floor(progress * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <>{displayValue}</>;
}

export default function MetricsVisualization({
  lang,
}: MetricsVisualizationProps) {
  const t = translations[lang] || translations.en;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600 text-blue-600 bg-blue-100',
    green: 'from-green-500 to-emerald-600 text-green-600 bg-green-100',
    purple: 'from-purple-500 to-pink-600 text-purple-600 bg-purple-100',
    emerald: 'from-emerald-500 to-teal-600 text-emerald-600 bg-emerald-100',
  };

  return (
    <section className="bg-gradient-to-b py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimateElement type="slideUp">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 sm:mb-4 sm:text-4xl md:text-5xl">
              {t.title}
            </h2>
            <p className="mx-auto max-w-3xl px-4 text-lg text-gray-600 sm:px-0 sm:text-xl">
              {t.subtitle}
            </p>
          </div>
        </AnimateElement>

        {/* Key Metrics Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 sm:mb-16 sm:grid-cols-2 sm:gap-8 lg:mb-20 lg:grid-cols-4">
          {t.metrics.map((metric, index) => {
            const Icon = metric.icon;
            const colors =
              colorClasses[metric.color as keyof typeof colorClasses];
            const gradientColors = {
              blue: { from: '#3b82f6', to: '#6366f1' },
              green: { from: '#10b981', to: '#059669' },
              purple: { from: '#a855f7', to: '#ec4899' },
              emerald: { from: '#10b981', to: '#14b8a6' },
            };
            const gradient =
              gradientColors[metric.color as keyof typeof gradientColors];

            return (
              <AnimateElement key={index} type="slideUp" delay={index * 0.1}>
                <MagicCard
                  className="relative h-full rounded-xl border-0 bg-white shadow-xl transition-all hover:-translate-y-2 hover:shadow-2xl"
                  gradientSize={250}
                  gradientColor={gradient.from}
                  gradientOpacity={0.15}
                  gradientFrom={gradient.from}
                  gradientTo={gradient.to}
                >
                  <div className="p-6 sm:p-8">
                    {/* Icon */}
                    <div
                      className={cn(
                        'mb-3 inline-flex rounded-lg p-2.5 sm:mb-4 sm:p-3',
                        colors.split(' ')[3],
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5 sm:h-6 sm:w-6',
                          colors.split(' ')[2],
                        )}
                      />
                    </div>

                    {/* Animated Value */}
                    <div className="mb-2 flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900 sm:text-4xl">
                        {isVisible && <AnimatedNumber value={metric.value} />}
                      </span>
                      <span className="ml-1 text-xl font-semibold text-gray-700 sm:text-2xl">
                        {metric.unit}
                      </span>
                    </div>

                    {/* Label */}
                    <div className="mb-1 text-sm font-semibold text-gray-900 sm:text-base">
                      {metric.label}
                    </div>

                    {/* Description */}
                    <div className="text-xs text-gray-600 sm:text-sm">
                      {metric.description}
                    </div>
                  </div>

                  <BorderBeam
                    size={150}
                    duration={10}
                    delay={0}
                    colorFrom={gradient.from}
                    colorTo={gradient.to}
                  />
                </MagicCard>
              </AnimateElement>
            );
          })}
        </div>

        {/* Detailed Comparison Table */}
        <AnimateElement type="slideUp">
          <MagicCard
            className="border-0 bg-white p-4 shadow-xl sm:p-6 lg:p-8"
            gradientSize={300}
            gradientColor="#3b82f6"
            gradientOpacity={0.1}
            gradientFrom="#3b82f6"
            gradientTo="#10b981"
          >
            <h3 className="mb-6 text-center text-xl font-bold text-gray-900 sm:mb-8 sm:text-2xl">
              {t.comparison.title}
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-900 sm:px-3 sm:py-3 sm:text-sm lg:px-4">
                      Metric
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-red-600 sm:px-3 sm:py-3 sm:text-sm lg:px-4">
                      {t.comparison.before}
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-green-600 sm:px-3 sm:py-3 sm:text-sm lg:px-4">
                      {t.comparison.after}
                    </th>
                    <th className="hidden px-2 py-2 text-center text-xs font-semibold text-blue-600 sm:table-cell sm:px-3 sm:py-3 sm:text-sm lg:px-4">
                      Improvement
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {t.comparison.items.map((item, index) => (
                    <tr
                      key={index}
                      className="group border-b border-gray-100 transition-all hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50"
                    >
                      <td className="px-2 py-3 text-xs font-medium text-gray-900 sm:px-3 sm:py-4 sm:text-sm lg:px-4">
                        {item.metric}
                      </td>
                      <td className="px-2 py-3 text-center text-gray-600 sm:px-3 sm:py-4 lg:px-4">
                        <span className="inline-block rounded-lg bg-red-50 px-2 py-0.5 text-xs transition-all group-hover:bg-red-100 sm:px-3 sm:py-1 sm:text-sm">
                          {item.traditional}
                        </span>
                      </td>
                      <td className="px-2 py-3 text-center text-gray-600 sm:px-3 sm:py-4 lg:px-4">
                        <span className="inline-block rounded-lg bg-green-50 px-2 py-0.5 text-xs font-medium transition-all group-hover:bg-green-100 sm:px-3 sm:py-1 sm:text-sm">
                          {item.devbox}
                        </span>
                      </td>
                      <td className="hidden px-2 py-3 text-center sm:table-cell sm:px-3 sm:py-4 lg:px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 transition-all group-hover:scale-105 group-hover:bg-blue-200 sm:px-3 sm:py-1 sm:text-sm">
                          <Zap className="h-3 w-3" />
                          {item.improvement}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Visual Progress Bars */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
              <div className="relative rounded-lg bg-gradient-to-r from-red-50 to-orange-50 p-3 sm:p-4">
                <div className="mb-1.5 text-xs font-semibold text-gray-700 sm:mb-2 sm:text-sm">
                  Traditional Development Efficiency
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white sm:h-4">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-1000"
                    style={{ width: isVisible ? '30%' : '0%' }}
                  />
                </div>
                <div className="mt-1 text-xs text-gray-600">30% efficiency</div>
              </div>

              <div className="relative rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4">
                <div className="mb-1.5 text-xs font-semibold text-gray-700 sm:mb-2 sm:text-sm">
                  DevBox Development Efficiency
                </div>
                <div className="relative">
                  <div className="h-3 overflow-hidden rounded-full bg-white sm:h-4">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-1000"
                      style={{ width: isVisible ? '95%' : '0%' }}
                    />
                  </div>
                  {/* Add animated glow effect for DevBox efficiency - outside progress bar */}
                  {isVisible && (
                    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                      <BorderBeam
                        size={30}
                        duration={8}
                        delay={0}
                        colorFrom="#10b981"
                        colorTo="#14b8a6"
                        borderWidth={1}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-600">95% efficiency</div>
              </div>
            </div>
          </MagicCard>
        </AnimateElement>
      </div>
    </section>
  );
}
