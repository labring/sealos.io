'use client';

import { Marquee } from './marquee';
import { languagesType } from '@/lib/i18n';
import { Counter } from '@/components/ui/counter';

// Define translations for different languages
const translations = {
  'en': {
    title: 'Trusted by leading companies worldwide',
    keyPartners: 'Featured Partners',
    metrics: [
      { value: '10,000+', label: 'Developers' },
      { value: '50,000+', label: 'Applications' },
      { value: '99.9%', label: 'Uptime' }
    ]
  },
  'zh-cn': {
    title: '全球领先企业的信赖之选',
    keyPartners: '重点合作伙伴',
    metrics: [
      { value: '10,000+', label: '开发者' },
      { value: '50,000+', label: '应用程序' },
      { value: '99.9%', label: '运行时间' }
    ]
  }
};

// Add featured flag to highlight key partners
const companies = [
  {
    name: 'Teable',
    url: '/images/customers/teable.svg',
    width: 97,
    height: 22,
    featured: true
  },
  {
    name: 'FastGPT',
    url: '/images/logos/fastgpt.svg',
    width: 2000,
    height: 491,
    featured: true
  },
  {
    name: 'Sinocare',
    url: '/images/customers/sinocare.png',
    width: 731,
    height: 137,
    featured: true
  },
  {
    name: 'JetBrains',
    url: '/images/logos/jetbrains.svg',
    width: 298,
    height: 64,
    featured: true
  },
];

export default function Logos({ lang = 'en' as languagesType }) {
  const t = translations[lang];
  const featuredCompanies = companies.filter(company => company.featured);

  return (
    <section id="logos" className="py-12">
      <div className="container mx-auto px-4 md:px-8">
        {/* Trust metrics */}
        <div className="mb-10 flex flex-col items-center">
          <h2 className="text-center text-xl font-bold text-black sm:text-3xl mb-8">
            {t.title}
          </h2>

          <div id="metrics-container" className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] bg-clip-text text-transparent">
                <Counter end={10000} suffix="+" duration={1000} />
              </span>
              <span className="text-sm text-gray-600 mt-1">{t.metrics[0].label}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] bg-clip-text text-transparent">
                <Counter end={50000} suffix="+" duration={1000} />
              </span>
              <span className="text-sm text-gray-600 mt-1">{t.metrics[1].label}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] bg-clip-text text-transparent">
                <Counter end={99.9} decimals={1} suffix="%" duration={1000} />
              </span>
              <span className="text-sm text-gray-600 mt-1">{t.metrics[2].label}</span>
            </div>
          </div>
        </div>

        {/* Featured partners section */}
        <div className="mb-8">
          <h3 className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500 mb-6">
            {t.keyPartners}
          </h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {featuredCompanies.map((company, idx) => (
              <div
                key={idx}
                className="flex h-20 w-32 md:h-24 md:w-40 items-center justify-center rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, white, #F8FBFF)'
                }}
              >
                <img
                  src={company.url}
                  alt={company.name}
                  className="max-h-12 max-w-full transform opacity-100 transition-all duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>

        {/* All partners marquee */}
        <div className="relative mt-10">
          <Marquee className="max-w-full [--duration:40s]">
            {companies.filter(company => !company.featured).map((company, idx) => (
              <img
                key={idx}
                src={company.url}
                className="h-10 w-28 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 dark:brightness-0 dark:invert"
                alt={company.name}
              />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
