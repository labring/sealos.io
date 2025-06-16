import { languagesType } from '@/lib/i18n';

export interface CaseItem {
  logo: string;
  industry: string;
  useCase: string;
  title: string;
  slug: string;
  metrics: Array<{
    value: string;
    label: string;
  }>;
}

export interface CaseTranslations {
  title: string;
  readNow: string;
  filterByIndustry: string;
  filterByUseCase: string;
  clearFilters: string;
  filterTitle: string;
  caseDescription: string;
  noResults: string;
  industries: string[];
  useCases: string[];
  cases: CaseItem[];
}

export const caseTranslations: Record<languagesType, CaseTranslations> = {
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
    cases: []
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
