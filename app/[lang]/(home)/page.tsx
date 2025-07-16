import dynamic from 'next/dynamic';
import Trusted from './components/trusted';
import WhyChooseUs from './components/why-choose-us';
import ProblemsAndSolutions from './components/problems-solutions';
import HeroBenefits from './components/hero-benefits';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Hero from '@/components/header/hero';
import { TailwindIndicator } from '@/components/tailwind-indicator';
import { appDomain } from '@/config/site';
import RedirectSuggest from '@/components/redirectSuggest';
import { languagesType } from '@/lib/i18n';
import ScrollProgressWrapper from '@/components/scroll-progress-wrapper';
import { CallToActionSection } from '@/components/ui/call-to-action-section';

// Dynamic imports for heavy components
const Desktop = dynamic(() => import('./components/desktop'), {
  loading: () => <div className="min-h-[600px] flex items-center justify-center"><div className="animate-pulse text-gray-500">Loading desktop experience...</div></div>,
  ssr: false
});

const FAQ = dynamic(() => import('./components/faq'), {
  loading: () => <div className="min-h-[400px]" />
});

const WorkflowShowcase = dynamic(() => import('./components/workflow-showcase'), {
  loading: () => <div className="min-h-[400px]" />
});

// Define translations only for strings used directly in this component
const translations = {
  en: {
    title: {
      main: 'End Cloud Complexity. Start Building.',
      sub: 'Enterprise-grade infrastructure as simple as your desktop',
    },
    desktop: {
      title: 'Experience Sealos Cloud OS',
      description:
        'Try Sealos interactive desktop experience. Click on modules to explore their features, drag windows around, and resize them just like a real desktop environment.',
    },
  },
  'zh-cn': {
    title: {
      main: '终结云复杂性，开始构建',
      sub: '企业级基础设施，如桌面般简单',
    },
    desktop: {
      title: '体验 Sealos 云操作系统',
      description:
        '尝试 Sealos 的交互式桌面体验。点击模块探索其功能，拖拽窗口，就像真实的桌面环境一样调整大小。',
    },
  },
};

export default function HomePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang] || translations.en;

  return (
    <div className="h-full bg-[#EBF2FF]">
      <Header lang={params.lang} />
      <ScrollProgressWrapper />

      <main className="custom-container px-8 pt-14 pb-20 md:px-[15%]">
        <Hero
          title={t.title}
          mainTitleEmphasis={2}
          getStartedLink={appDomain}
          lang={params.lang}
        >
          <div className="mx-auto hidden max-w-7xl sm:block">
            <Desktop />
          </div>

          <div className="mt-12">
            <HeroBenefits lang={params.lang} />
          </div>
        </Hero>
      </main>

      <div className="space-y-20">
        <div className="custom-container px-8 md:px-[15%]">
          <ProblemsAndSolutions lang={params.lang} />
        </div>

        <div className="custom-container px-8 md:px-[15%]">
          <Trusted lang={params.lang} />
        </div>

        <div className="custom-container px-8 md:px-[15%]">
          <WorkflowShowcase lang={params.lang} />
        </div>

        <div className="custom-container px-8 md:px-[15%]">
          <WhyChooseUs lang={params.lang} />
        </div>

        <div className="custom-container px-8 md:px-[15%]">
          <FAQ lang={params.lang} />
        </div>

        <div className="custom-container px-8 md:px-[15%]">
          <CallToActionSection
            title="Develop, Build, Deploy, and Scale Without Limits"
            buttonText="Get Started"
          />
        </div>
      </div>

      <div className="mt-[140px] h-[1px] bg-[#DDE7F7]"></div>
      <Footer lang={params.lang} />
      <TailwindIndicator />
      <RedirectSuggest />
    </div>
  );
}
