import { AnimateElement } from '@/components/ui/animated-wrapper';
import { CheckCircle, Rocket, Users, DollarSign } from 'lucide-react';
import { languagesType } from '@/lib/i18n';

const translations = {
  en: {
    title: 'How Sealos DevBox Solves Everything',
    subtitle:
      'Cloud-native development environments that eliminate friction and accelerate innovation',
    solutions: [
      {
        title: 'Ready-to-Code in Under 60 Seconds',
        description:
          'Pre-configured cloud workstations eliminate setup time. Click, code, ship.',
        benefits: [
          'Instant environment provisioning',
          'Zero dependency conflicts',
          'Consistent across all team members',
        ],
        metric: '95% faster setup time',
      },
      {
        title: 'Reproducible & Isolated Environments',
        description:
          'Each project gets its own isolated environment that never degrades or conflicts.',
        benefits: [
          'No more "works on my machine"',
          'Version-controlled environments',
          'Snapshot & restore capabilities',
        ],
        metric: '100% reproducibility guarantee',
      },
      {
        title: 'Seamless Team Collaboration',
        description:
          'Standardized environments ensure every developer has the exact same setup.',
        benefits: [
          'Unified development experience',
          'Easier code reviews',
          'Faster onboarding',
        ],
        metric: '45% increase in developer satisfaction',
      },
      {
        title: 'Enterprise Security & Cost Control',
        description:
          'Centralized management with auto-scaling and security policies built-in.',
        benefits: [
          'Automated cost optimization',
          'Enhanced security posture',
          'Simplified IT management',
        ],
        metric: '40% reduction in IT overhead',
      },
    ],
  },
  'zh-cn': {
    title: 'Sealos DevBox 如何解决所有问题',
    subtitle: '云原生开发环境，消除摩擦，加速创新',
    solutions: [
      {
        title: '60秒内即可开始编码',
        description: '预配置的云工作站消除设置时间。点击、编码、发布。',
        benefits: ['即时环境配置', '零依赖冲突', '所有团队成员保持一致'],
        metric: '设置时间快95%',
      },
      {
        title: '可重现和隔离的环境',
        description: '每个项目都有自己的隔离环境，永不降级或冲突。',
        benefits: [
          '不再有"在我机器上能运行"的问题',
          '版本控制的环境',
          '快照和恢复功能',
        ],
        metric: '100% 可重现性保证',
      },
      {
        title: '无缝团队协作',
        description: '标准化环境确保每个开发人员都有完全相同的设置。',
        benefits: ['统一的开发体验', '更容易的代码审查', '更快的入职'],
        metric: '开发人员满意度提升45%',
      },
      {
        title: '企业安全和成本控制',
        description: '集中管理，内置自动扩展和安全策略。',
        benefits: ['自动成本优化', '增强的安全态势', '简化的IT管理'],
        metric: 'IT开销减少40%',
      },
    ],
  },
};

const solutionIcons = [
  <Rocket className="h-8 w-8 text-blue-500" />,
  <CheckCircle className="h-8 w-8 text-green-500" />,
  <Users className="h-8 w-8 text-purple-500" />,
  <DollarSign className="h-8 w-8 text-emerald-500" />,
];

interface SolutionsProps {
  lang: languagesType;
}

export default function Solutions({ lang }: SolutionsProps) {
  const t = translations[lang] || translations.en;

  return (
    <section className="py-16">
      <AnimateElement type="slideUp">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900">{t.title}</h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            {t.subtitle}
          </p>
        </div>
      </AnimateElement>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
        {t.solutions.map((solution, index) => (
          <AnimateElement key={index} type="slideUp" delay={index * 0.1}>
            <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex-shrink-0 rounded-lg bg-gray-50 p-3">
                  {solutionIcons[index]}
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-semibold text-gray-900">
                    {solution.title}
                  </h3>
                  <p className="text-lg text-gray-600">
                    {solution.description}
                  </p>
                </div>
              </div>

              <div className="mb-6 flex-grow space-y-3">
                {solution.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex justify-center">
                <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                  {solution.metric}
                </div>
              </div>
            </div>
          </AnimateElement>
        ))}
      </div>
    </section>
  );
}
