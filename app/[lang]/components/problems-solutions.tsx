import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ProblemsSolutionsProps {
  lang: 'en' | 'zh-cn';
}

const translations = {
  en: {
    title: 'Why Developers Are Leaving Traditional Cloud Platforms',
    subtitle:
      "The current cloud landscape is broken. Here's how Sealos fixes it.",
    problems: {
      title: 'The Problems',
      items: [
        {
          title: 'Crushing Costs',
          description:
            'Traditional cloud bills can reach tens of thousands per month for simple apps. Complex pricing leads to surprise charges.',
        },
        {
          title: 'Kubernetes Complexity',
          description:
            'Writing 100+ lines of YAML for a simple deployment. Hiring expensive DevOps specialists.',
        },
        {
          title: 'Vendor Lock-in',
          description:
            'Proprietary buildpacks and APIs make migration painful. Your code becomes hostage.',
        },
        {
          title: 'Slow Time-to-Market',
          description:
            "Weeks to set up environments. 'Works on my machine' debugging. Manual scaling headaches.",
        },
      ],
    },
    solutions: {
      title: 'The Sealos Solution',
      items: [
        {
          title: '90% Cost Reduction',
          description:
            'Predictable subscription pricing. No hidden fees. Free SSL, monitoring, and basic features included.',
          benefit: 'Save significantly vs traditional platforms',
        },
        {
          title: 'Zero Kubernetes Knowledge Required',
          description:
            'Deploy with clicks, not YAML. Sealos Cloud OS abstracts all complexity while giving you full power.',
          benefit: 'No DevOps team needed',
        },
        {
          title: 'Built on Open Standards',
          description:
            'Standard Docker containers and Kubernetes underneath. Migrate anywhere, anytime.',
          benefit: 'Your code, your freedom',
        },
        {
          title: 'Deploy in Minutes',
          description:
            'From code to production in just minutes. Consistent environments from dev to prod.',
          benefit: '10x faster time-to-market',
        },
      ],
    },
  },
  'zh-cn': {
    title: '为什么开发者正在离开传统云平台',
    subtitle: '当前的云计算格局已经破碎。以下是 Sealos 如何修复它。',
    problems: {
      title: '问题所在',
      items: [
        {
          title: '成本高昂',
          description:
            '传统云平台简单应用的账单每月可达数万美元。复杂定价导致意外费用。',
        },
        {
          title: 'Kubernetes 复杂性',
          description: '简单部署需要 100+ 行 YAML。雇佣昂贵的 DevOps 专家。',
        },
        {
          title: '供应商锁定',
          description: '专有构建包和 API 使迁移痛苦。您的代码成为人质。',
        },
        {
          title: '上市时间慢',
          description:
            "设置环境需要数周。'在我机器上工作'的调试。手动扩展的麻烦。",
        },
      ],
    },
    solutions: {
      title: 'Sealos 解决方案',
      items: [
        {
          title: '成本降低 90%',
          description:
            '可预测的订阅制定价。无隐藏费用。免费 SSL、监控和基础功能。',
          benefit: '相比传统平台显著节省成本',
        },
        {
          title: '无需 Kubernetes 知识',
          description:
            '点击部署，无需 YAML。Sealos 云操作系统抽象了所有复杂性，同时给您完整的能力。',
          benefit: '无需 DevOps 团队',
        },
        {
          title: '基于开放标准构建',
          description: '底层使用标准 Docker 容器和 Kubernetes。随时随地迁移。',
          benefit: '您的代码，您的自由',
        },
        {
          title: '几分钟内部署',
          description: '从代码到生产环境只需几分钟。从开发到生产的一致环境。',
          benefit: '10倍更快的上市时间',
        },
      ],
    },
  },
};

export default function ProblemsAndSolutions({ lang }: ProblemsSolutionsProps) {
  const t = translations[lang];

  return (
    <div>
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-900">{t.title}</h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">{t.subtitle}</p>
      </div>

      <div className="grid gap-16 lg:grid-cols-2">
        {/* Problems */}
        <div>
          <div className="mb-8 flex items-center">
            <div className="mr-3 h-2 w-2 rounded-full bg-gray-400"></div>
            <h3 className="text-2xl font-bold text-gray-900">
              {t.problems.title}
            </h3>
          </div>
          <div className="space-y-4">
            {t.problems.items.map((problem, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-lg"
              >
                <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-gray-400 to-gray-600"></div>
                <div className="relative">
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900">
                      {problem.title}
                    </h4>
                  </div>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {problem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Solutions */}
        <div>
          <div className="mb-8 flex items-center">
            <div className="mr-3 h-2 w-2 rounded-full bg-[#44BCFF]"></div>
            <h3 className="text-2xl font-bold text-gray-900">
              {t.solutions.title}
            </h3>
          </div>
          <div className="space-y-4">
            {t.solutions.items.map((solution, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#44BCFF] to-[#0090FF]"></div>
                <div className="relative">
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-900">
                      {solution.title}
                    </h4>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {solution.description}
                  </p>
                  <div className="flex items-center rounded-lg border border-blue-200 bg-white/70 p-3">
                    <ArrowRight className="mr-2 h-4 w-4 text-[#44BCFF]" />
                    <span className="text-sm font-medium text-[#44BCFF]">
                      {solution.benefit}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
