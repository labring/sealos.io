import { languagesType } from '@/lib/i18n';
import { GetStartedButton } from '@/components/ui/button-shiny';
import { appDomain } from '@/config/site';

const translations = {
  en: {
    title: 'Start to build your apps today',
    description:
      'Use our unified cloud platform to accelerate your application development and deployment process.',
    getStarted: 'Get Started Free',
    readDocs: 'Read Docs',
  },
  'zh-cn': {
    title: '立即构建您的应用',
    description: '使用我们的统一云平台，加速您的应用开发和部署过程。',
    getStarted: '免费开始使用',
    readDocs: '阅读文档',
  },
};

export default function CallToAction({ lang }: { lang: languagesType }) {
  const t = translations[lang];

  return (
    <section
      className="my-12 overflow-hidden rounded-xl p-8 text-center shadow-xl sm:my-16 sm:p-12 md:my-24 md:p-16"
      style={{
        background:
          'linear-gradient(135deg, rgba(82, 174, 255, 0.2), rgba(255, 248, 240, 0.6), rgba(82, 174, 255, 0.15))',
        boxShadow:
          '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 30px -15px rgba(82, 174, 255, 0.25)',
      }}
    >
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl"></div>
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-yellow-500/10 blur-3xl"></div>
        <div className="bg-primary/15 absolute top-1/3 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full blur-xl"></div>

        <h2 className="relative mb-4 text-xl font-bold tracking-tight text-gray-900 sm:mb-6 sm:text-2xl md:mb-8 md:text-3xl lg:text-4xl">
          <span className="relative inline-block">
            {t.title}
            <span className="bg-primary/20 absolute bottom-1 left-0 h-2 w-full sm:h-3"></span>
          </span>
        </h2>

        <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-gray-700 sm:mb-8 sm:text-base md:mb-10 md:text-lg">
          {t.description}
        </p>

        <div className="relative z-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <a href={appDomain} target="_blank" rel="noopener noreferrer">
            <div className="shadow-button relative flex cursor-pointer items-center justify-center gap-[6px] overflow-hidden rounded-md bg-[#b2e3ff] px-6 py-3 text-[#005b9c] hover:bg-[#97D9FF] sm:px-8 sm:py-3 sm:text-base md:px-8 md:py-4">
              <div className="z-10">{t.getStarted}</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="relative h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </a>

          <a
            href={`/docs`}
            className="border-primary text-primary rounded-md border-2 bg-white/80 px-6 py-3 text-sm font-medium shadow-sm transition-all hover:bg-white hover:shadow-md sm:px-8 sm:py-3 sm:text-base md:px-8 md:py-4"
          >
            {t.readDocs}
          </a>
        </div>
      </div>
    </section>
  );
}
