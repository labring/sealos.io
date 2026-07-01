import { AnimateElement } from '@/components/ui/animated-wrapper';
import { ClockIcon, ShieldCheckIcon } from '@/components/animated-icons';
import { languagesType } from '@/lib/i18n';
import { AlertCircle, Zap } from 'lucide-react';

const translations = {
  en: {
    title: 'The Development Environment Crisis',
    subtitle:
      "Traditional development setups are holding back innovation. Here's what's broken:",
    problems: [
      {
        title: 'Hours Lost on Environment Setup',
        description:
          'Developers waste 6+ hours setting up each new environment, dealing with dependency conflicts and "works on my machine" issues.',
        impact: 'Lost productivity & frustrated onboarding',
      },
      {
        title: 'Development Environment Rot',
        description:
          'Projects become unbuildable over time due to software drift, system updates, and missing dependencies.',
        impact: 'Technical debt & maintenance overhead',
      },
      {
        title: 'Context Switching Tax',
        description:
          'Managing multiple projects with conflicting dependencies on local machines creates "dependency hell" and cognitive overhead.',
        impact: 'Reduced focus & slower delivery',
      },
      {
        title: 'Security & Compliance Risks',
        description:
          'IT struggles to manage diverse developer workstations, apply security policies, and protect sensitive code.',
        impact: 'Increased attack surface & compliance gaps',
      },
    ],
  },
  'zh-cn': {
    title: '开发环境危机',
    subtitle: '传统的开发设置正在阻碍创新。以下是问题所在：',
    problems: [
      {
        title: '环境设置浪费数小时',
        description:
          '开发人员在设置每个新环境时浪费6+小时，处理依赖冲突和"在我机器上能运行"的问题。',
        impact: '生产力损失和挫败感',
      },
      {
        title: '开发环境腐化',
        description:
          '由于软件漂移、系统更新和缺失依赖项，项目随时间变得无法构建。',
        impact: '技术债务和维护开销',
      },
      {
        title: '上下文切换税',
        description:
          '在本地机器上管理具有冲突依赖项的多个项目会造成"依赖地狱"和认知开销。',
        impact: '注意力分散和交付速度下降',
      },
      {
        title: '安全和合规风险',
        description:
          'IT部门难以管理多样化的开发人员工作站、应用安全策略和保护敏感代码。',
        impact: '攻击面增加和合规差距',
      },
    ],
  },
};

const problemIcons = [
  <ClockIcon size={32} />,
  <AlertCircle className="h-8 w-8 text-orange-500" />,
  <Zap className="h-8 w-8 text-yellow-500" />,
  <ShieldCheckIcon size={32} />,
];

interface ProblemsProps {
  lang: languagesType;
}

export default function Problems({ lang }: ProblemsProps) {
  const t = translations[lang] || translations.en;

  return (
    <section className="py-4 sm:py-8">
      <AnimateElement type="slideUp">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-medium text-white sm:text-4xl md:text-5xl">
            {t.title}
          </h2>
          <p className="mx-auto max-w-3xl text-base leading-7 text-zinc-400 sm:text-xl">
            {t.subtitle}
          </p>
        </div>
      </AnimateElement>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
        {t.problems.map((problem, index) => (
          <AnimateElement key={index} type="slideUp" delay={index * 0.1}>
            <div className="inset-shadow-bubble flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur transition-colors hover:border-blue-400/40 sm:p-6">
              <div className="mb-4 flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-300">
                  {problemIcons[index]}
                </div>
                <div className="flex-grow">
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {problem.title}
                  </h3>
                  <p className="leading-7 text-zinc-400">
                    {problem.description}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex justify-start">
                <div className="inline-flex items-center rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-sm font-medium text-red-200">
                  {problem.impact}
                </div>
              </div>
            </div>
          </AnimateElement>
        ))}
      </div>
    </section>
  );
}
