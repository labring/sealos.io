import { languagesType } from '@/lib/i18n';
import { appDomain } from '@/config/site';

const translations = {
  'en': {
    title: 'Customer Success Stories',
    description: 'Discover how industry leaders and technology pioneers leverage our platform to power up their applications and accelerate business growth.',
    getStarted: 'Get Started Free',
    scrollForMore: 'Scroll for more',
  },
  'zh-cn': {
    title: '客户成功案例',
    description: '了解行业领导者和技术先驱如何利用我们的平台为其应用提供动力并加速业务增长。',
    getStarted: '免费开始使用',
    scrollForMore: '向下滚动查看更多',
  }
};

export default function Hero({ lang }: { lang: languagesType }) {
  const t = translations[lang];

  return (
    <section className="relative overflow-hidden bg-[#001529] py-24 text-white">
      {/* Background decorative elements */}
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>

      <div className="container mx-auto flex flex-col items-start px-4 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
        {/* Left content */}
        <div className="mb-12 max-w-2xl md:mb-0 md:w-1/2">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {t.title}
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-gray-300 md:text-xl">
            {t.description}
          </p>
          <a href={appDomain} target="_blank" rel="noopener noreferrer">
            <div
              className="relative flex cursor-pointer items-center justify-center gap-[6px] overflow-hidden rounded-md bg-[#b2e3ff] px-4 py-2 text-[#005b9c] shadow-button hover:bg-[#97D9FF] sm:px-5 sm:py-3 w-fit"
            >
              <div className="z-10">{t.getStarted}</div>
              <svg xmlns="http://www.w3.org/2000/svg" className="relative h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </a>
        </div>

        {/* Right illustration */}
        <div className="relative md:w-1/2">
          <img
            src="/images/customers/case-banner.png"
            alt="Cloud Technology Illustration"
            className="relative z-10 w-full max-w-lg"
            width={500}
            height={400}
          />
          {/* Glowing effect behind illustration */}
          <div className="absolute -right-10 -top-10 z-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 z-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl"></div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center justify-center">
        <div className="mb-2 text-sm font-medium text-gray-300 opacity-80">{t.scrollForMore}</div>
        <div className="animate-bounce rounded-full bg-white/10 p-2 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
