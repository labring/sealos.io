import { AnimateElement } from '@/components/ui/animated-wrapper';
import { ArrowRight, Code, Database, Globe } from 'lucide-react';
import { appDomain } from '@/config/site';
import { languagesType } from '@/lib/i18n';

const translations = {
  en: {
    title: 'Why Choose Sealos DevBox?',
    subtitle:
      "Join thousands of developers who've transformed their workflow with cloud-native development",
    features: [
      {
        title: 'Any IDE, Anywhere',
        description:
          'Work with VS Code, JetBrains, Vim, or any editor. Access from any device with web browser or native clients.',
        highlight: 'Universal compatibility',
      },
      {
        title: 'Managed Databases',
        description:
          'Instantly provision MySQL, PostgreSQL, MongoDB, Redis with automated backups and scaling.',
        highlight: 'Zero database setup',
      },
      {
        title: 'Global Performance',
        description:
          'High-performance computing with high-class infrastructure. Local-like experience even on slow connections.',
        highlight: 'Sub-second response times',
      },
    ],
    stats: [
      { value: '64%', label: 'Faster builds vs local' },
      { value: '95%', label: 'Reduction in setup time' },
      { value: '45%', label: 'Developer satisfaction increase' },
      { value: '40%', label: 'Lower IT overhead' },
    ],
    cta: {
      text: 'Ready to revolutionize your development workflow?',
      button: 'Start Coding Now',
      disclaimer: 'Free to start • No credit card required',
    },
  },
  'zh-cn': {
    title: '为什么选择 Sealos DevBox？',
    subtitle: '加入数千名通过云原生开发转变工作流程的开发人员',
    features: [
      {
        title: '任何IDE，随时随地',
        description:
          '使用VS Code、JetBrains、Vim或任何编辑器。通过网页浏览器或原生客户端从任何设备访问。',
        highlight: '通用兼容性',
      },
      {
        title: '托管数据库',
        description:
          '即时配置MySQL、PostgreSQL、MongoDB、Redis，具有自动备份和扩展功能。',
        highlight: '零数据库设置',
      },
      {
        title: '全球性能',
        description:
          '具有高级基础设施的高性能计算。即使在慢速连接上也能获得本地般的体验。',
        highlight: '亚秒级响应时间',
      },
    ],
    stats: [
      { value: '64%', label: '比本地构建更快' },
      { value: '95%', label: '设置时间减少' },
      { value: '45%', label: '开发人员满意度提升' },
      { value: '40%', label: 'IT开销降低' },
    ],
    cta: {
      text: '准备好革命性地改变您的开发工作流程了吗？',
      button: '立即开始编码',
      disclaimer: '免费开始 • 无需信用卡',
    },
  },
};

const featureIcons = [
  <Code className="h-12 w-12 text-blue-500" />,
  <Database className="h-12 w-12 text-green-500" />,
  <Globe className="h-12 w-12 text-purple-500" />,
];

interface WhyDevBoxProps {
  lang: languagesType;
}

export default function WhyDevBox({ lang }: WhyDevBoxProps) {
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

        {/* Stats */}
        <AnimateElement type="slideUp" delay={0.2}>
          <div className="mb-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {t.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-4xl font-bold text-blue-600">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </AnimateElement>

        {/* Features */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {t.features.map((feature, index) => (
            <AnimateElement key={index} type="slideUp" delay={index * 0.1}>
              <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-8 text-center transition-all hover:shadow-lg">
                <div className="mb-6 flex justify-center">
                  {featureIcons[index]}
                </div>
                <h3 className="mb-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mb-4 flex-grow text-gray-600">
                  {feature.description}
                </p>
                <div className="mt-auto flex justify-center">
                  <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    {feature.highlight}
                  </div>
                </div>
              </div>
            </AnimateElement>
          ))}
        </div>

        {/* CTA */}
        <AnimateElement type="slideUp" delay={0.4}>
          <div className="text-center">
            <p className="mb-8 text-xl text-gray-600">{t.cta.text}</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={`${appDomain}/?openapp=system-devbox`}
                className="group inline-flex items-center rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {t.cta.button}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
              <span className="text-gray-500">{t.cta.disclaimer}</span>
            </div>
          </div>
        </AnimateElement>
      </div>
    </section>
  );
}
