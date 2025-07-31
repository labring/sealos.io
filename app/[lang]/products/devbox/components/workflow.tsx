import { AnimateElement } from '@/components/ui/animated-wrapper';
import { Code, Hammer, Rocket, TrendingUp, ArrowRight } from 'lucide-react';
import { languagesType } from '@/lib/i18n';
import { appDomain } from '@/config/site';

const translations = {
  en: {
    title: 'Your Complete Development Journey',
    subtitle: 'From idea to production in four seamless steps',
    steps: [
      {
        title: 'Develop',
        description:
          'Write code in your favorite IDE with instant, pre-configured environments',
        details: [
          'VS Code, IntelliJ, or any IDE',
          'Pre-installed dependencies',
          'Hot reload & debugging',
        ],
        duration: 'Instant setup',
      },
      {
        title: 'Build',
        description:
          'Automated builds with optimized cloud resources and caching',
        details: [
          'Consistent build environments',
          'Intelligent caching',
          'Multi-architecture support',
        ],
        duration: 'Faster builds',
      },
      {
        title: 'Deploy',
        description:
          'One-click deployment to production with zero configuration',
        details: [
          'Automated CI/CD',
          'Rolling deployments',
          'Zero downtime releases',
        ],
        duration: 'Deploy in seconds',
      },
      {
        title: 'Scale',
        description:
          'Auto-scaling infrastructure that grows with your application',
        details: [
          'Horizontal auto-scaling',
          'Load balancing',
          'Global edge deployment',
        ],
        duration: 'Scale to millions',
      },
    ],
  },
  'zh-cn': {
    title: '您的完整开发之旅',
    subtitle: '从想法到生产的四个无缝步骤',
    steps: [
      {
        title: '开发',
        description: '在您喜欢的IDE中编写代码，享受即时、预配置的环境',
        details: ['VS Code、IntelliJ或任何IDE', '预安装依赖项', '热重载和调试'],
        duration: '即时设置',
      },
      {
        title: '构建',
        description: '使用优化的云资源和缓存进行自动化构建',
        details: ['一致的构建环境', '智能缓存', '多架构支持'],
        duration: '更快构建',
      },
      {
        title: '部署',
        description: '一键部署到生产环境，零配置',
        details: ['自动化CI/CD', '滚动部署', '零停机发布'],
        duration: '秒级部署',
      },
      {
        title: '扩展',
        description: '随应用程序增长的自动扩展基础设施',
        details: ['水平自动扩展', '负载均衡', '全球边缘部署'],
        duration: '扩展到数百万用户',
      },
    ],
  },
};

const stepIcons = [
  <Code className="h-12 w-12" />,
  <Hammer className="h-12 w-12" />,
  <Rocket className="h-12 w-12" />,
  <TrendingUp className="h-12 w-12" />,
];

const stepColors = [
  'text-blue-600 bg-blue-100',
  'text-green-600 bg-green-100',
  'text-purple-600 bg-purple-100',
  'text-orange-600 bg-orange-100',
];

interface WorkflowProps {
  lang: languagesType;
}

export default function Workflow({ lang }: WorkflowProps) {
  const t = translations[lang] || translations.en;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        <AnimateElement type="slideUp">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">{t.title}</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-600">
              {t.subtitle}
            </p>
          </div>
        </AnimateElement>

        {/* Horizontal workflow */}
        <div className="relative">
          {/* Connection lines */}
          <div className="absolute top-24 right-0 left-0 z-0 hidden h-0.5 bg-gray-200 lg:block" />

          <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-4">
            {t.steps.map((step, index) => (
              <AnimateElement key={index} type="slideUp" delay={index * 0.2}>
                <div className="relative flex h-full flex-col rounded-xl border border-gray-100 bg-white p-8 text-center shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 transform items-center justify-center rounded-full border-4 border-gray-200 bg-white text-sm font-bold text-gray-600">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`mb-6 inline-flex items-center justify-center rounded-full p-4 ${stepColors[index]}`}
                  >
                    {stepIcons[index]}
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mb-4 flex-grow text-gray-600">
                    {step.description}
                  </p>

                  {/* Details */}
                  <ul className="mb-6 space-y-2">
                    {step.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-center gap-2 text-sm text-gray-500"
                      >
                        <div className="h-1 w-1 rounded-full bg-gray-400" />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {/* Duration badge */}
                  <div className="mt-auto flex justify-center">
                    <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                      {step.duration}
                    </div>
                  </div>

                  {/* Arrow for desktop */}
                  {index < t.steps.length - 1 && (
                    <div className="absolute top-1/2 -right-6 hidden -translate-y-1/2 transform text-gray-300 lg:block">
                      <ArrowRight className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </AnimateElement>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <AnimateElement type="slideUp" delay={0.8}>
          <div className="mt-16 text-center">
            <p className="mb-6 text-lg text-gray-600">
              {lang === 'zh-cn'
                ? '准备好体验无缝的开发工作流程了吗？'
                : 'Ready to experience seamless development workflow?'}
            </p>
            <a
              href={`${appDomain}/?openapp=system-devbox`}
              className="group inline-flex transform items-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700"
            >
              {lang === 'zh-cn' ? '立即开始开发' : 'Start Developing Now'}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </AnimateElement>
      </div>
    </section>
  );
}
