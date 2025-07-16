'use client';

import { languagesType } from '@/lib/i18n';
import { Counter } from '@/components/ui/counter';
import { Marquee } from './marquee';

// Define translations for different languages
const translations = {
  en: {
    title: 'Trusted by developers worldwide',
    keyPartners: 'From startups to teams at global companies',
    metrics: [
      { value: '10,000+', label: 'Developers' },
      { value: '50,000+', label: 'Applications' },
      { value: '99.9%', label: 'Uptime' },
    ],
    companies: [
      {
        name: 'GitHub',
        url: '/images/logos/github.svg',
        width: 120,
        height: 40,
        featured: true,
      },
      {
        name: 'FastGPT',
        url: '/images/logos/fastgpt.svg',
        width: 140,
        height: 40,
        featured: true,
      },
      {
        name: 'Tikttok',
        url: '/images/logos/tiktok.svg',
        width: 120,
        height: 40,
        featured: true,
      },
      {
        name: 'JetBrains',
        url: '/images/logos/jetbrains.svg',
        width: 140,
        height: 40,
        featured: true,
      },
    ],
  },
  'zh-cn': {
    title: '全球领先企业的信赖之选',
    keyPartners: '重点合作伙伴',
    metrics: [
      { value: '10,000+', label: '开发者' },
      { value: '50,000+', label: '应用程序' },
      { value: '99.9%', label: '运行时间' },
    ],
    companies: [
      {
        name: 'Teable',
        url: '/images/customers/teable.svg',
        width: 120,
        height: 40,
        featured: true,
      },
      {
        name: 'FastGPT',
        url: '/images/logos/fastgpt.svg',
        width: 140,
        height: 40,
        featured: true,
      },
      {
        name: '三诺生物',
        url: '/images/customers/sinocare.png',
        width: 120,
        height: 40,
        featured: true,
      },
      {
        name: 'JetBrains',
        url: '/images/logos/jetbrains.svg',
        width: 140,
        height: 40,
        featured: true,
      },
    ],
  },
};

export default function Logos({ lang = 'en' as languagesType }) {
  const t = translations[lang];
  const featuredCompanies = t.companies.filter((company) => company.featured);

  return (
    <div id="logos">
      <div className="container mx-auto px-4 md:px-8">
        {/* Trust metrics */}
        <div className="mb-10 flex flex-col items-center">
          <h2 className="mb-8 text-center text-xl font-bold text-black sm:text-3xl">
            {t.title}
          </h2>

          <div
            id="metrics-container"
            className="flex w-full flex-wrap justify-evenly gap-y-8 md:gap-y-16"
          >
            <div className="flex w-1/2 flex-col items-center sm:w-auto md:w-1/3">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                <Counter end={10000} suffix="+" duration={1000} />
              </span>
              <span className="mt-1 text-sm text-gray-600">
                {t.metrics[0].label}
              </span>
            </div>
            <div className="flex w-1/2 flex-col items-center md:w-1/3">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                <Counter end={50000} suffix="+" duration={1000} />
              </span>
              <span className="mt-1 text-sm text-gray-600">
                {t.metrics[1].label}
              </span>
            </div>
            <div className="flex w-1/2 flex-col items-center md:w-1/3">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                <Counter end={99.9} decimals={1} suffix="%" duration={1000} />
              </span>
              <span className="mt-1 text-sm text-gray-600">
                {t.metrics[2].label}
              </span>
            </div>
          </div>
        </div>

        {/* Featured partners section */}
        <div className="mb-8">
          <h3 className="mb-6 text-center text-sm font-semibold tracking-wider text-gray-500 uppercase">
            {t.keyPartners}
          </h3>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {featuredCompanies.map((company, idx) => (
              <div
                key={idx}
                className="flex h-20 w-32 items-center justify-center rounded-lg bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg md:h-24 md:w-40"
                style={{
                  background: 'linear-gradient(135deg, white, #F8FBFF)',
                }}
              >
                <img
                  src={company.url}
                  alt={company.name}
                  width={company.width}
                  height={company.height}
                  className="max-h-12 max-w-full transform opacity-100 transition-all duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>

        {/* All partners marquee */}
        <Marquee className="max-w-full [--duration:40s]">
          <div className="relative mt-10">
            {t.companies
              .filter((company) => !company.featured)
              .map((company, idx) => (
                <img
                  key={idx}
                  src={company.url}
                  width={company.width}
                  height={company.height}
                  className="h-10 w-28 opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 dark:brightness-0 dark:invert"
                  alt={company.name}
                />
              ))}
          </div>
        </Marquee>
      </div>
    </div>
  );
}
