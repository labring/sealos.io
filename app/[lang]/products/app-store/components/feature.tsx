'use client';

import { languagesType } from '@/lib/i18n';
import { useState } from 'react';
import {
  Zap,
  Settings,
  TrendingUp,
  Wrench,
  HardDrive,
  Globe,
} from 'lucide-react';

const translations = {
  en: {
    title: 'Why Choose Sealos App Store',
    subtitle: 'Experience the power of Kubernetes without the complexity',
    features: [
      {
        icon: <Zap className="h-8 w-8" />,
        title: 'One-Click Deployment',
        description:
          'Deploy complex applications with a single click. No YAML configuration, no container orchestration complexity - just point, click, and deploy.',
      },
      {
        icon: <Settings className="h-8 w-8" />,
        title: 'Easy Customization',
        description:
          'Configure environment variables, resource limits, and storage with intuitive forms. Customize your setup without touching a single line of code.',
      },
      {
        icon: <TrendingUp className="h-8 w-8" />,
        title: 'Auto-Scaling Built-In',
        description:
          'Your applications automatically scale up and down based on demand. Handle traffic spikes without manual intervention or complex configuration.',
      },
      {
        icon: <Wrench className="h-8 w-8" />,
        title: 'Zero Kubernetes Expertise Required',
        description:
          'Get all the benefits of Kubernetes - high availability, service discovery, and container orchestration - without becoming a Kubernetes expert.',
      },
      {
        icon: <HardDrive className="h-8 w-8" />,
        title: 'Persistent Storage Included',
        description:
          'Built-in persistent storage solutions ensure your data is safe and accessible across deployments and scaling events.',
      },
      {
        icon: <Globe className="h-8 w-8" />,
        title: 'Instant Public Access',
        description:
          'Each deployment gets an automatic public URL with SSL certificates. Share your applications instantly without complex networking setup.',
      },
    ],
  },
  'zh-cn': {
    title: '为什么选择 Sealos 应用商店',
    subtitle: '体验 Kubernetes 的强大功能，无需复杂配置',
    features: [
      {
        icon: <Zap className="h-8 w-8" />,
        title: '一键部署',
        description:
          '只需一键即可部署复杂应用。无需 YAML 配置，无需容器编排复杂性 - 只需点击即可部署。',
      },
      {
        icon: <Settings className="h-8 w-8" />,
        title: '轻松定制',
        description:
          '通过直观的表单配置环境变量、资源限制和存储。无需触碰一行代码即可自定义设置。',
      },
      {
        icon: <TrendingUp className="h-8 w-8" />,
        title: '内置自动扩缩容',
        description:
          '应用程序根据需求自动扩缩容。无需手动干预或复杂配置即可处理流量峰值。',
      },
      {
        icon: <Wrench className="h-8 w-8" />,
        title: '无需 Kubernetes 专业知识',
        description:
          '获得 Kubernetes 的所有优势 - 高可用性、服务发现和容器编排 - 无需成为 Kubernetes 专家。',
      },
      {
        icon: <HardDrive className="h-8 w-8" />,
        title: '包含持久化存储',
        description:
          '内置持久化存储解决方案确保您的数据在部署和扩缩容事件中安全且可访问。',
      },
      {
        icon: <Globe className="h-8 w-8" />,
        title: '即时公网访问',
        description:
          '每次部署都会获得带 SSL 证书的自动公网 URL。无需复杂的网络设置即可立即共享应用程序。',
      },
    ],
  },
};

export default function Feature() {
  // In a real implementation, this would be passed as a prop from the parent component
  // For now, we'll detect the language from the URL or use a default
  const [lang] = useState<languagesType>(
    typeof window !== 'undefined' && window.location.pathname.includes('/zh-cn')
      ? 'zh-cn'
      : 'en',
  );
  const t = translations[lang] || translations.en;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            {t.title}
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:shadow-2xl hover:shadow-white/10"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="text-zinc-300">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
