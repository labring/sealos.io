'use client';

import React from 'react';
import { AnimateElement } from '@/components/ui/animated-wrapper';
import { languagesType } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { BorderBeam } from '@/components/ui/border-beam';
import { MagicCard } from '@/components/ui/magic-card';
import {
  ShieldCheckIcon,
  RocketIcon,
  TrendingDownIcon,
  ClockIcon,
  XIcon,
  CircleCheckIcon,
} from '@/components/animated-icons';
import { Zap } from 'lucide-react';

const translations = {
  en: {
    title: 'Transform Your Development Experience',
    subtitle: 'Real stories from developers who switched to DevBox',
    viewDetails: 'See how it works',
    stories: [
      {
        id: 'onboarding',
        icon: ClockIcon,
        color: 'blue',
        tagline: 'Setup Revolution',
        title: 'From 3-Day Setup Hell to 60-Second Magic',
        story:
          "Remember your last job's first week? Installing Node, Python, Docker, databases, configuring environment variables, debugging version conflicts... It was a nightmare that took days.",
        transformation:
          "With DevBox, new team members push their first commit within 10 minutes of joining. One link, one click, and they're coding.",
        before: {
          title: 'The Old Way',
          items: [
            'Day 1: Installing dependencies',
            'Day 2: Fixing version conflicts',
            'Day 3: Still debugging setup',
          ],
          metric: '72 hours',
          metricLabel: 'average setup time',
        },
        after: {
          title: 'The DevBox Way',
          items: [
            'Click the project link',
            'Environment ready in 60 seconds',
            'Start coding immediately',
          ],
          metric: '60 seconds',
          metricLabel: 'to first line of code',
        },
        proof: {
          metric: '95%',
          label: 'faster onboarding',
          source: 'Based on 500+ teams',
        },
      },
      {
        id: 'reliability',
        icon: ShieldCheckIcon,
        color: 'green',
        tagline: 'Zero Conflicts',
        title: 'End the "Works on My Machine" Era Forever',
        story:
          'How many hours have you wasted in meetings where someone says "but it works on my machine"? Different OS versions, missing dependencies, environment variables...',
        transformation:
          'DevBox gives everyone the exact same environment. Every dependency, every configuration, every time. Your code works everywhere because everywhere is identical.',
        before: {
          title: 'The Chaos',
          items: [
            'Debugging environment differences',
            'Maintaining setup documentation',
            'Losing work to system crashes',
          ],
          metric: '8 hours/week',
          metricLabel: 'wasted on env issues',
        },
        after: {
          title: 'Perfect Harmony',
          items: [
            'Identical environments for all',
            'Version-controlled configs',
            'Instant restore from snapshots',
          ],
          metric: '100%',
          metricLabel: 'environment parity',
        },
        proof: {
          metric: 'Zero',
          label: 'environment conflicts',
          source: 'Guaranteed isolation',
        },
      },
      {
        id: 'deployment',
        icon: RocketIcon,
        color: 'purple',
        tagline: 'Ship Fearlessly',
        title: 'From Deployment Anxiety to One-Click Confidence',
        story:
          'Remember the last production deployment? The checklist, the manual steps, the prayer circle, staying late "just in case"...',
        transformation:
          'With DevBox, deployment is just another push. Automated pipelines handle everything. If something goes wrong, auto-rollback kicks in. You can deploy on Friday afternoon.',
        before: {
          title: 'Deployment Dread',
          items: [
            'Manual deployment checklists',
            'Late night emergency fixes',
            'Fear of Friday deployments',
          ],
          metric: '2-4 hours',
          metricLabel: 'per deployment',
        },
        after: {
          title: 'Push & Relax',
          items: [
            'Git push triggers everything',
            'Auto-rollback on failures',
            'Deploy anytime, anywhere',
          ],
          metric: '10x',
          metricLabel: 'faster deployments',
        },
        proof: {
          metric: '99.99%',
          label: 'deployment success',
          source: 'With auto-rollback',
        },
      },
      {
        id: 'costs',
        icon: TrendingDownIcon,
        color: 'emerald',
        tagline: 'Smart Economics',
        title: 'Turn Your Laptop into a Supercomputer (Without Buying One)',
        story:
          'High-end developer laptops cost $3000+. They still struggle with large builds. Your fans sound like a jet engine. Battery life? What battery life?',
        transformation:
          'DevBox turns any device into a development powerhouse. Code on a Chromebook with 32-core cloud power. Your laptop stays cool, your battery lasts all day, and you save thousands.',
        before: {
          title: 'Hardware Hunger',
          items: [
            '$3000+ per developer laptop',
            'Constant hardware upgrades',
            'IT overhead and maintenance',
          ],
          metric: '$5000/year',
          metricLabel: 'per developer',
        },
        after: {
          title: 'Cloud Efficiency',
          items: [
            'Use any device to code',
            'Pay only when coding',
            'Zero maintenance overhead',
          ],
          metric: '40%',
          metricLabel: 'cost reduction',
        },
        proof: {
          metric: '$2M',
          label: 'saved annually',
          source: 'Fortune 500 client',
        },
      },
    ],
  },
  'zh-cn': {
    title: '改变您的开发体验',
    subtitle: '来自转向 DevBox 的开发者的真实故事',
    viewDetails: '查看工作原理',
    stories: [
      {
        id: 'onboarding',
        icon: ClockIcon,
        color: 'blue',
        tagline: '环境配置革命',
        title: '从3天配置地狱到60秒魔法',
        story:
          '还记得上一份工作的第一周吗？安装 Node、Python、Docker、数据库，配置环境变量，调试版本冲突...这是一个耗时数天的噩梦。',
        transformation:
          '使用 DevBox，新团队成员在加入后10分钟内就能提交第一个代码。一个链接，一次点击，就能开始编码。',
        before: {
          title: '传统方式',
          items: [
            '第1天：安装依赖',
            '第2天：修复版本冲突',
            '第3天：仍在调试配置',
          ],
          metric: '72小时',
          metricLabel: '平均配置时间',
        },
        after: {
          title: 'DevBox 方式',
          items: ['点击项目链接', '60秒环境就绪', '立即开始编码'],
          metric: '60秒',
          metricLabel: '写下第一行代码',
        },
        proof: {
          metric: '95%',
          label: '更快的入职',
          source: '基于500+团队',
        },
      },
      {
        id: 'reliability',
        icon: ShieldCheckIcon,
        color: 'green',
        tagline: '零冲突',
        title: '永远结束"在我机器上能运行"的时代',
        story:
          '有多少小时浪费在有人说"但在我机器上能运行"的会议上？不同的操作系统版本、缺失的依赖、环境变量...',
        transformation:
          'DevBox 给每个人提供完全相同的环境。每个依赖、每个配置、每一次都一样。您的代码在任何地方都能运行，因为每个地方都是相同的。',
        before: {
          title: '混乱状态',
          items: ['调试环境差异', '维护配置文档', '系统崩溃丢失工作'],
          metric: '8小时/周',
          metricLabel: '浪费在环境问题上',
        },
        after: {
          title: '完美和谐',
          items: ['所有人环境相同', '版本控制的配置', '从快照即时恢复'],
          metric: '100%',
          metricLabel: '环境一致性',
        },
        proof: {
          metric: '零',
          label: '环境冲突',
          source: '保证隔离',
        },
      },
      {
        id: 'deployment',
        icon: RocketIcon,
        color: 'purple',
        tagline: '无畏发布',
        title: '从部署焦虑到一键信心',
        story:
          '还记得上次生产部署吗？检查清单、手动步骤、祈祷圈、"以防万一"加班...',
        transformation:
          '使用 DevBox，部署只是另一次推送。自动化管道处理一切。如果出现问题，自动回滚启动。您可以在周五下午部署。',
        before: {
          title: '部署恐惧',
          items: ['手动部署清单', '深夜紧急修复', '害怕周五部署'],
          metric: '2-4小时',
          metricLabel: '每次部署',
        },
        after: {
          title: '推送并放松',
          items: ['Git推送触发一切', '失败时自动回滚', '随时随地部署'],
          metric: '10倍',
          metricLabel: '更快的部署',
        },
        proof: {
          metric: '99.99%',
          label: '部署成功率',
          source: '带自动回滚',
        },
      },
      {
        id: 'costs',
        icon: TrendingDownIcon,
        color: 'emerald',
        tagline: '智能经济',
        title: '将您的笔记本变成超级计算机（无需购买）',
        story:
          '高端开发笔记本售价3000美元以上。它们仍然在大型构建时吃力。风扇声音像喷气发动机。电池寿命？什么电池寿命？',
        transformation:
          'DevBox 将任何设备变成开发强国。在 Chromebook 上使用32核云计算能力编码。您的笔记本保持凉爽，电池持续一整天，您节省数千美元。',
        before: {
          title: '硬件饥渴',
          items: ['每位开发者3000美元+笔记本', '持续硬件升级', 'IT开销和维护'],
          metric: '5000美元/年',
          metricLabel: '每位开发者',
        },
        after: {
          title: '云效率',
          items: ['使用任何设备编码', '仅在编码时付费', '零维护开销'],
          metric: '40%',
          metricLabel: '成本降低',
        },
        proof: {
          metric: '200万美元',
          label: '年度节省',
          source: '财富500强客户',
        },
      },
    ],
  },
};

interface SolutionsProps {
  lang: languagesType;
}

export default function Solutions({ lang }: SolutionsProps) {
  const t = translations[lang] || translations.en;

  return (
    <section className="overflow-hidden py-20">
      <div className="mx-auto max-w-7xl px-4">
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

        <div className="grid gap-16 lg:gap-20">
          {t.stories.map((story, index) => {
            const Icon = story.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-indigo-600',
              green: 'from-green-500 to-emerald-600',
              purple: 'from-purple-500 to-pink-600',
              emerald: 'from-emerald-500 to-teal-600',
            };

            return (
              <AnimateElement key={story.id} type="slideUp" delay={index * 0.1}>
                <div className="relative">
                  {/* Story Header */}
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-4">
                      <div
                        className={cn(
                          'flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg',
                          colorClasses[
                            story.color as keyof typeof colorClasses
                          ],
                        )}
                      >
                        <Icon size={32} />
                      </div>
                      <span className="text-sm font-semibold tracking-wider text-gray-500 uppercase">
                        {story.tagline}
                      </span>
                    </div>
                    <h3 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                      {story.title}
                    </h3>
                    <p className="mb-4 text-lg leading-relaxed text-gray-600">
                      {story.story}
                    </p>
                    <p className="text-lg font-medium text-gray-800">
                      {story.transformation}
                    </p>
                  </div>

                  {/* Before/After Comparison */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Before Card */}
                    <MagicCard
                      className="rounded-2xl"
                      gradientColor="rgba(239, 68, 68, 0.1)"
                      gradientFrom="#ef4444"
                      gradientTo="#dc2626"
                    >
                      <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-6">
                        <div className="mb-4 flex items-center gap-3">
                          <XIcon className="h-6 w-6 text-red-500" size={24} />
                          <h4 className="text-xl font-semibold text-gray-900">
                            {story.before.title}
                          </h4>
                        </div>
                        <ul className="mb-6 space-y-3">
                          {story.before.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="mt-1.5 block h-2 w-2 rounded-full bg-red-400" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="rounded-lg bg-white p-4 text-center">
                          <div className="text-3xl font-bold text-red-600">
                            {story.before.metric}
                          </div>
                          <div className="text-sm text-gray-600">
                            {story.before.metricLabel}
                          </div>
                        </div>
                      </div>
                    </MagicCard>

                    {/* After Card */}
                    <div className="relative">
                      <MagicCard
                        className="overflow-hidden rounded-2xl"
                        gradientColor="rgba(34, 197, 94, 0.1)"
                        gradientFrom="#22c55e"
                        gradientTo="#16a34a"
                      >
                        <div className="relative rounded-2xl border-2 border-green-100 bg-green-50 p-6">
                          <div className="mb-4 flex items-center gap-3">
                            <CircleCheckIcon
                              className="h-6 w-6 text-green-500"
                              size={24}
                            />
                            <h4 className="text-xl font-semibold text-gray-900">
                              {story.after.title}
                            </h4>
                          </div>
                          <ul className="mb-6 space-y-3">
                            {story.after.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span className="mt-1.5 block h-2 w-2 rounded-full bg-green-400" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="rounded-lg bg-white p-4 text-center">
                            <div className="text-3xl font-bold text-green-600">
                              {story.after.metric}
                            </div>
                            <div className="text-sm text-gray-600">
                              {story.after.metricLabel}
                            </div>
                          </div>
                        </div>
                      </MagicCard>
                      {/* BorderBeam outside of card */}
                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                        <BorderBeam
                          size={150}
                          duration={12}
                          delay={index * 2}
                          colorFrom="#22c55e"
                          colorTo="#16a34a"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Proof Badge */}
                  <div className="mt-8 flex justify-center">
                    <div className="relative">
                      <div className="inline-flex items-center gap-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3">
                        <Zap className="h-5 w-5 text-blue-600" />
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {story.proof.metric}
                          </span>
                          <span className="font-medium text-gray-700">
                            {story.proof.label}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {story.proof.source}
                        </span>
                      </div>
                      {/* BorderBeam wrapper with proper overflow */}
                      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                        <BorderBeam
                          size={80}
                          duration={8}
                          delay={index * 1.5}
                          colorFrom="#3b82f6"
                          colorTo="#a855f7"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateElement>
            );
          })}
        </div>
      </div>
    </section>
  );
}
