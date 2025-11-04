'use client';

import React from 'react';
import { Code, Package, Rocket, Play } from 'lucide-react';
import { BentoCard } from './workflow/bentogrid';
import { ReleaseAnimation } from './workflow/release-animation';
import { Integrations } from './workflow/integrations';
import { LogoCluster } from './workflow/logocluster';

interface WorkflowShowcaseProps {
  lang: 'en' | 'zh-cn';
}

const translations = {
  en: {
    title: 'From Code to Production in 3 Simple Steps',
    subtitle: 'See how Sealos transforms the entire development lifecycle',
    steps: [
      {
        number: '01',
        icon: Code,
        title: 'Develop in DevBox',
        subtitle: 'Cloud-based development environment',
        description:
          "Code in your favorite IDE (VSCode, Cursor) while running everything in a consistent cloud environment. No more 'works on my machine' problems.",
        features: [
          'Instant cloud workspaces',
          'Pre-configured templates',
          'Team collaboration built-in',
          'Zero setup time',
        ],
        demo: 'Start coding in 30 seconds',
      },
      {
        number: '02',
        icon: Package,
        title: 'Release with Snapshots',
        subtitle: 'One-click versioned deployments',
        description:
          'Create immutable, versioned snapshots of your entire application. Built on standard OCI containers for maximum portability.',
        features: [
          'Immutable versioning',
          'Instant rollbacks',
          'Standard Docker containers',
          'Zero configuration',
        ],
        demo: 'Release v1.0 in 1 click',
      },
      {
        number: '03',
        icon: Rocket,
        title: 'Deploy via App Launchpad',
        subtitle: 'Production-ready in minutes',
        description:
          'Deploy your snapshot to production with automatic SSL, scaling, and monitoring. From code to live URL in a matter of minutes.',
        features: [
          'Automatic SSL certificates',
          'Built-in auto-scaling',
          'Real-time monitoring',
          'Flexible resource allocation',
        ],
        demo: 'Live in just minutes',
      },
    ],
  },
  'zh-cn': {
    title: '从代码到生产环境的 3 个简单步骤',
    subtitle: '看看 Sealos 如何转变整个开发生命周期',
    steps: [
      {
        number: '01',
        icon: Code,
        title: '在 DevBox 中开发',
        subtitle: '基于云的开发环境',
        description:
          "在您喜欢的 IDE（VSCode、Cursor）中编码，同时在一致的云环境中运行所有内容。不再有'在我机器上工作'的问题。",
        features: ['即时云工作区', '预配置模板', '内置团队协作', '零设置时间'],
        demo: '30 秒内开始编码',
      },
      {
        number: '02',
        icon: Package,
        title: '使用快照发布',
        subtitle: '一键版本化部署',
        description:
          '创建整个应用程序的不可变、版本化快照。基于标准 OCI 容器，具有最大的可移植性。',
        features: ['不可变版本控制', '即时回滚', '标准 Docker 容器', '零配置'],
        demo: '一键发布 v1.0',
      },
      {
        number: '03',
        icon: Rocket,
        title: '通过应用启动台部署',
        subtitle: '几分钟内就绪生产',
        description:
          '将您的快照部署到生产环境，具有自动 SSL、扩展和监控。从代码到实时 URL 只需几分钟。',
        features: ['自动 SSL 证书', '内置自动扩展', '实时监控', '灵活资源分配'],
        demo: '几分钟内上线',
      },
    ],
  },
};

export default function WorkflowShowcase({ lang }: WorkflowShowcaseProps) {
  const t = translations[lang];

  return (
    <div>
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">{t.title}</h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">{t.subtitle}</p>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:gap-12 2xl:grid-cols-3">
        <BentoCard
          eyebrow={t.steps[0].subtitle}
          title={t.steps[0].title}
          description={t.steps[0].description}
          graphic={<Integrations />}
          className="lg:col-span-1"
        />
        <BentoCard
          eyebrow={t.steps[1].subtitle}
          title={t.steps[1].title}
          description={t.steps[1].description}
          graphic={<ReleaseAnimation />}
          className="lg:col-span-1"
        />
        <BentoCard
          eyebrow={t.steps[2].subtitle}
          title={t.steps[2].title}
          description={t.steps[2].description}
          graphic={<LogoCluster />}
          className="lg:col-span-1"
        />
      </div>
    </div>
  );
}
