'use client';

import { languagesType } from '@/lib/i18n';
import Link from 'next/link';
import { useState } from 'react';

const translations = {
  'en': {
    title: 'All success stories with Sealos',
    readNow: 'Read Now',
    filterByIndustry: 'By Industry',
    filterByUseCase: 'By Use Case',
    clearFilters: 'Clear Filters',
    filterTitle: 'Filters',
    caseDescription: 'Learn about {company} success story, including how they achieved business growth and technical innovation with Sealos.',
    noResults: 'No cases found matching your criteria. Please try different filters.',
    industries: [
      'All',
      'Cloud Infrastructure',
      'E-commerce',
      'AI & Machine Learning',
      'FinTech',
      'Healthcare',
      'Education',
      'Media & Entertainment'
    ],
    useCases: [
      'All',
      'Cost Optimization',
      'Scalability',
      'DevOps',
      'Kubernetes',
      'AI Development',
      'Microservices',
      'Cloud Migration'
    ],
    cases: [
    ]
  },
  'zh-cn': {
    title: 'Sealos的所有成功案例',
    readNow: '立即阅读',
    filterByIndustry: '按行业',
    filterByUseCase: '按用例',
    clearFilters: '清除筛选',
    filterTitle: '筛选条件',
    caseDescription: '了解{company}的成功案例，包括如何通过Sealos实现业务增长和技术创新。',
    noResults: '没有找到符合条件的案例，请尝试其他筛选条件。',
    industries: [
      '全部',
      '低代码',
      '电子商务',
      'AI与机器学习',
      '金融科技',
      '医疗健康',
      '教育',
      '媒体与娱乐'
    ],
    useCases: [
      '全部',
      '成本优化',
      '可扩展性',
      'DevOps',
      'Kubernetes',
      'AI开发',
      '微服务',
      '云迁移'
    ],
    cases: [
      {
        logo: '/images/customers/teable.svg',
        industry: '低代码',
        useCase: '成本优化',
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
        useCase: 'AI开发',
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
        useCase: '可扩展性',
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

export default function CaseGrid({ lang }: { lang: languagesType }) {
  const t = translations[lang];
  const [selectedIndustry, setSelectedIndustry] = useState(t.industries[0]);
  const [selectedUseCase, setSelectedUseCase] = useState(t.useCases[0]);

  const filteredCases = t.cases.filter(caseItem => {
    const industryMatch = selectedIndustry === t.industries[0] || caseItem.industry === selectedIndustry;
    const useCaseMatch = selectedUseCase === t.useCases[0] || (caseItem.useCase && caseItem.useCase === selectedUseCase);
    return industryMatch && useCaseMatch;
  });

  const clearFilters = () => {
    setSelectedIndustry(t.industries[0]);
    setSelectedUseCase(t.useCases[0]);
  };

  return (
    <section className="py-24">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-black md:text-4xl">
        {t.title}
      </h2>

      <div
        className="mb-12 rounded-xl bg-white p-4 shadow-lg sm:p-6 md:p-8"
        style={{
          boxShadow: '0 10px 30px -5px rgba(0, 120, 212, 0.08), 0 0 5px rgba(0, 120, 212, 0.03)',
          background: 'linear-gradient(135deg, #FFFFFF, #F8FBFF)'
        }}
      >
        <div className="flex flex-col space-y-6 md:space-y-8">
          {/* Mobile filter title */}
          <h3 className="text-center text-lg font-bold text-gray-800 md:hidden">{t.filterTitle}</h3>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span className="text-sm font-semibold text-gray-800 sm:mr-2">{t.filterByIndustry}:</span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:pb-0">
              {t.industries.map((industry, index) => (
                <button
                  key={index}
                  className={`group relative rounded-md px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium transition-all duration-300 ${
                    selectedIndustry === industry
                      ? 'border border-primary/50 bg-gradient-to-r from-primary/90 to-primary text-white shadow-md'
                      : 'border border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:text-primary hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedIndustry(industry)}
                  style={selectedIndustry === industry ? { boxShadow: '0 4px 6px -1px rgba(0, 120, 212, 0.2), 0 2px 4px -1px rgba(0, 120, 212, 0.1)' } : {}}
                >
                  {/* Add hover effect background element */}
                  <span className={`absolute inset-0 rounded-md bg-primary/10 opacity-0 transition-opacity duration-300 ${selectedIndustry !== industry ? 'group-hover:opacity-30' : ''}`}></span>

                  {/* Add selection indicator */}
                  {selectedIndustry === industry && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}

                  <span className="relative">{industry}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span className="text-sm font-semibold text-gray-800 sm:mr-2">{t.filterByUseCase}:</span>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:pb-0">
              {t.useCases.map((useCase, index) => (
                <button
                  key={index}
                  className={`group relative rounded-md px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-medium transition-all duration-300 ${
                    selectedUseCase === useCase
                      ? 'border border-primary/50 bg-gradient-to-r from-primary/90 to-primary text-white shadow-md'
                      : 'border border-gray-200 bg-white text-gray-700 hover:border-primary/30 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 hover:text-primary hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedUseCase(useCase)}
                  style={selectedUseCase === useCase ? { boxShadow: '0 4px 6px -1px rgba(0, 120, 212, 0.2), 0 2px 4px -1px rgba(0, 120, 212, 0.1)' } : {}}
                >
                  {/* Add hover effect background element */}
                  <span className={`absolute inset-0 rounded-md bg-primary/10 opacity-0 transition-opacity duration-300 ${selectedUseCase !== useCase ? 'group-hover:opacity-30' : ''}`}></span>

                  {/* Add selection indicator */}
                  {selectedUseCase === useCase && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}

                  <span className="relative">{useCase}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {(selectedIndustry !== t.industries[0] || selectedUseCase !== t.useCases[0]) && (
          <div className="mt-6 flex justify-end">
            <button
              className="group flex items-center rounded-md border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-all duration-300 hover:border-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:shadow-md"
              onClick={clearFilters}
              style={{ boxShadow: '0 2px 4px -1px rgba(220, 38, 38, 0.1), 0 1px 2px -1px rgba(220, 38, 38, 0.05)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="relative">
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                {t.clearFilters}
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredCases.length > 0 ? (
          filteredCases.map((caseItem, index) => (
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

              {/* Content area */}
              <div className="flex flex-1 flex-col p-4 sm:p-6 md:p-8">
                <div className="mb-6 flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div className="h-10">
                    <img
                      src={caseItem.logo}
                      alt={caseItem.title}
                      className="h-full object-contain"
                    />
                  </div>
                  <div className="inline-block whitespace-nowrap rounded-md border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 px-3 py-1.5 text-xs font-medium tracking-wide text-primary shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow">
                    {caseItem.industry}
                  </div>
                </div>

                <h3 className="mb-5 text-xl font-bold leading-tight text-gray-800 transition-colors duration-300 group-hover:text-primary">
                  {caseItem.title}
                </h3>

                <p className="mb-6 flex-grow text-sm text-gray-600 line-clamp-3">
                  {/* Add a brief case description */}
                  {t.caseDescription.replace('{company}', lang === 'en' ? caseItem.title.split(' ').slice(1).join(' ') : caseItem.title)}
                </p>
              </div>

              {/* Bottom action area - enhanced visual guidance */}
              <div className="mt-auto border-t border-gray-100 bg-gradient-to-r from-white to-blue-50 p-6">
                <Link
                  href={`/case/${caseItem.slug}`}
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
          ))
        ) : (
          <div className="col-span-full rounded-xl bg-white/90 p-12 text-center shadow-md" style={{ boxShadow: '0 4px 12px -2px rgba(0, 120, 212, 0.06), 0 0 4px rgba(0, 120, 212, 0.03)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium text-gray-600">{t.noResults}</p>
          </div>
        )}
      </div>
    </section>
  );
}
