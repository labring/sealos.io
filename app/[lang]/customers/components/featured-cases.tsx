import { languagesType } from '@/lib/i18n';
import Link from 'next/link';

const translations = {
  'en': {
    title: 'Featured Customer Stories',
    readNow: 'Read Now',
    caseDescription: 'Learn about {company} success story, including how they achieved business growth and technical innovation with Sealos.',
    featuredCases: [
    ]
  },
  'zh-cn': {
    title: '精选客户案例',
    readNow: '立即阅读',
    caseDescription: '了解{company}的成功案例，包括如何通过Sealos实现业务增长和技术创新。',
    featuredCases: [
      {
        logo: '/images/customers/teable.svg',
        industry: '低代码',
        title: 'Teable 通过 Sealos 降低了 80% 的基础设施成本',
        slug: 'teable',
        metrics: [
          { value: '80%', label: '基础设施成本降低' },
          { value: '3倍', label: '部署速度提升' },
          { value: '99.9%', label: '系统可用性' }
        ]
      },
      {
        logo: '/images/customers/sinocare.png',
        industry: '医疗健康',
        title: '三诺生物使用 Sealos 加速 AI 创新，构建慢病健康普惠新路径',
        slug: 'sinocare',
        metrics: [
          { value: '20%', label: '客服效率提升' },
          { value: '50%', label: '资源成本降低' },
          { value: '10倍', label: '开发效率提升' }
        ]
      },
      {
        logo: '/images/customers/igettool.png',
        industry: '教育',
        title: '少年得到使用 Sealos 开启 AI 教育新范式',
        slug: 'igettool',
        metrics: [
          { value: '50%', label: '开发效率提升' },
          { value: '60%', label: '资源成本降低' },
          { value: '1-3 天', label: '项目上线周期' }
        ]
      }
    ]
  }
};

export default function FeaturedCases({ lang }: { lang: languagesType }) {
  const t = translations[lang];

  return (
    <section className="py-24">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-black md:text-4xl">{t.title}</h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        {t.featuredCases.map((caseStudy, index) => (
          <div
            key={index}
            className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white p-0 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
              boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(to bottom, white, #FAFCFF)'
            }}
          >
            {/* Decorative element */}
            <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-primary/5"></div>

            {/* Metrics area - placed at the top to highlight key data */}
            <div className="flex flex-col border-b border-gray-100 bg-gradient-to-r from-white to-blue-50/80 sm:flex-row">
              {caseStudy.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className={`flex-1 p-4 text-center ${idx < caseStudy.metrics.length - 1 ? 'border-b sm:border-b-0 sm:border-r' : ''} border-gray-100`}
                >
                  <div
                    className="text-2xl font-bold transition-all duration-300 group-hover:scale-110"
                    style={{ color: '#0078D4' }}
                  >
                    {metric.value}
                  </div>
                  <div className="mt-1 text-xs font-medium text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Content area */}
            <div className="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
              <div className="mb-6 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div className="h-10">
                  <img
                    src={caseStudy.logo}
                    alt={caseStudy.title}
                    className="h-full object-contain"
                  />
                </div>
                <div className="inline-block whitespace-nowrap rounded-md border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 px-3 py-1.5 text-xs font-medium tracking-wide text-primary shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow">
                  {caseStudy.industry}
                </div>
              </div>

              <h3 className="mb-5 text-xl font-bold leading-tight text-gray-800 transition-colors duration-300 group-hover:text-primary">
                {caseStudy.title}
              </h3>

              <p className="mb-6 flex-grow text-sm text-gray-600 line-clamp-3">
                {/* Add a brief case description */}
                {t.caseDescription.replace('{company}', caseStudy.title)}
              </p>
            </div>

            {/* Bottom action area - enhanced visual guidance */}
            <div className="mt-auto border-t border-gray-100 bg-gradient-to-r from-white to-blue-50 p-6">
              <Link
                href={`/customers/${caseStudy.slug}`}
                className="group/button flex w-full items-center justify-center rounded-lg border border-primary/30 bg-white px-5 py-2.5 font-medium text-primary shadow-md transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:translate-y-[-1px]"
                style={{ boxShadow: '0 4px 6px -1px rgba(0, 120, 212, 0.1), 0 2px 4px -1px rgba(0, 120, 212, 0.06)' }}
              >
                <span className="mr-2">{t.readNow}</span>
                <span className="relative flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-primary/10 transition-all duration-300 group-hover/button:bg-primary/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
