import { languagesType } from '@/lib/i18n';

const translations = {
  'en': {
    title: 'Companies succeed with Sealos',
    keyPartners: 'Key Partners',
    swipeToView: 'Swipe to view more partners'
  },
  'zh-cn': {
    title: '通过 Sealos 取得成功的企业',
    keyPartners: '重点合作伙伴',
    swipeToView: '左右滑动查看更多合作伙伴'
  }
};

// Add featured flag and category information
// Key customers are marked as featured: true
const companies = [
  { name: 'Teable', logo: '/images/customers/teable.svg', featured: true, category: 'Technology' },
  { name: '克诺尔', logo: '/images/customers/knorr-bremse.svg', featured: true, category: 'Technology' },
  { name: 'FastGPT', logo: '/images/logos/fastgpt.svg', featured: false, category: 'AI' },
  { name: '三诺生物', logo: '/images/customers/sinocare.png', featured: true, category: 'Hardware' },
  { name: 'JetBrains', logo: '/images/logos/jetbrains.svg', featured: false, category: 'Software' },
  { name: '少年得到', logo: '/images/customers/igettool.png', featured: false, category: 'Enterprise' },
  { name: 'Stripe', logo: '/images/logos/stripe.svg', featured: false, category: 'Finance' },
  { name: 'Open Source Initiative', logo: '/images/logos/open-source.webp', featured: false, category: 'Non-profit' },
  { name: '香港科技大学', logo: '/images/customers/hkust.svg', featured: false, category: 'Technology' },
  { name: '全耀物流', logo: '/images/customers/quanyaowuliu.jpg', featured: false, category: 'Technology' },
  { name: '武汉大学', logo: '/images/customers/wuhandaxue.png', featured: false, category: 'Technology' },
  { name: '北京邮电大学', logo: '/images/customers/beiyou.png', featured: false, category: 'Technology' },
  { name: '浪潮集团', logo: '/images/customers/inspur.svg', featured: false, category: 'Technology' },
  { name: '中天智慧', logo: '/images/customers/zsmarter.png', featured: false, category: 'Technology' },
  { name: '艾佳生活', logo: '/images/customers/aijia.png', featured: false, category: 'Technology' },
  { name: '华粤传动科技', logo: '/images/customers/cncdrives.png', featured: false, category: 'Technology' },
];

export default function TrustedCompanies({ lang }: { lang: languagesType }) {
  const t = translations[lang];

  // Get featured companies
  const featuredCompanies = companies.filter(company => company.featured);

  return (
    <section className="py-24">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-black md:text-4xl">
        {t.title}
      </h2>

      <div
        className="relative overflow-hidden rounded-xl p-10 shadow-lg"
        style={{
          background: 'linear-gradient(to right, #FFFFFF, #F8FBFF, #FFF8F0)',
          boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-500/5 blur-2xl"></div>
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-yellow-500/5 blur-2xl"></div>

        {/* Mobile-optimized irregular grid layout */}
        <div className="relative mx-auto max-w-6xl">
          {/* Mobile horizontal scroll container */}
          <div className="block md:hidden">
            <p className="mb-4 text-center text-sm text-gray-500">{t.swipeToView}</p>

            {/* Featured companies area */}
            <div className="mb-6">
              <h4 className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">{t.keyPartners}</h4>
              <div className="flex justify-center space-x-6">
                {featuredCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="flex h-24 w-36 items-center justify-center rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, white, #F8FBFF)'
                    }}
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-h-14 max-w-full transform opacity-100 transition-all duration-300 hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Other companies area */}
            <div className="overflow-x-auto pb-4">
              <div className="flex w-max space-x-4 px-4">
                {companies.filter(company => !company.featured).map((company, index) => (
                  <div
                    key={index}
                    className="flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-white/80 p-4 shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-h-12 max-w-full transform opacity-80 transition-all duration-300 hover:scale-110 hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop grid layout */}
          <div className="hidden md:block">
            {/* Featured companies area */}
            <div className="mb-12">
              <h4 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-gray-600">{t.keyPartners}</h4>
              <div className="flex justify-center space-x-12">
                {featuredCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="group relative flex h-32 w-48 items-center justify-center rounded-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{
                      background: 'linear-gradient(135deg, white, #F8FBFF)',
                      boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    {/* Decorative elements */}
                    <div className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-primary/5"></div>
                    <div className="absolute -left-2 -bottom-2 h-8 w-8 rounded-full bg-primary/10"></div>
                    {/* Featured indicator */}
                    <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="max-h-16 max-w-full transform transition-all duration-300 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Other companies grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {companies.filter(company => !company.featured).map((company, index) => (
                <div
                  key={index}
                  className={`group flex items-center justify-center rounded-lg p-4 transition-all duration-300 hover:bg-white hover:shadow-md ${index % 5 === 0 ? 'col-span-2' : ''}`}
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-12 max-w-full transform opacity-70 grayscale transition-all duration-300 hover:scale-110 hover:opacity-100 hover:grayscale-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
