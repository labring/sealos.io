import { getAppBySlug, appsConfig } from '@/config/apps';
import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { languagesType } from '@/lib/i18n';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Metadata } from 'next';
import Hero from '@/components/header/hero';

import AppHeader from './components/Header';
import AppDescription from './components/Description';
import WhyThisSoftware from './components/WhyThisSoftware';
import SealosAdvantages from './components/SealosAdvantages';
import AppFeatures from './components/Features';
import AppUseCases from './components/UseCases';
import AppScreenshots from './components/Screenshots';

interface AppDeployPageProps {
  params: {
    slug: string;
    lang: languagesType;
  };
}

// Generate static params for all apps
export async function generateStaticParams() {
  return appsConfig.map((app) => ({
    slug: app.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: AppDeployPageProps): Promise<Metadata> {
  const app = getAppBySlug(params.slug);

  if (!app) {
    return {
      title: 'App Not Found',
    };
  }

  return generatePageMetadata({
    title: `Deploy ${app.name}`,
    description: app.description,
    keywords: app.tags,
  });
}

// Translations
const translations = {
  en: {
    deploy: 'Deploy',
    oneClickDeploy: 'One-Click Deploy',
    features: 'Key Features',
    benefits: 'Why Choose This Solution',
    sealosAdvantages: 'Sealos Cloud Advantages',
    useCases: 'Perfect For',
    sourceCode: 'Source Code',
    website: 'Official Website',
    category: 'Category',
    deployNow: 'Deploy Now',
    learnMore: 'Learn More',
    getStarted: 'Get Started in 60 Seconds',
    deploymentBenefits: 'Deploy on Sealos Cloud',
    whyThisSoftware: 'Why This Software',
  },
  'zh-cn': {
    deploy: '部署',
    oneClickDeploy: '一键部署',
    features: '主要功能',
    benefits: '为什么选择此解决方案',
    sealosAdvantages: 'Sealos 云优势',
    useCases: '适用场景',
    sourceCode: '源代码',
    website: '官方网站',
    category: '分类',
    deployNow: '立即部署',
    learnMore: '了解更多',
    getStarted: '60 秒内开始使用',
    deploymentBenefits: '在 Sealos 云上部署',
    whyThisSoftware: '为什么选择此软件',
  },
};

export default function AppDeployPage({ params }: AppDeployPageProps) {
  const app = getAppBySlug(params.slug);
  const t = translations[params.lang] || translations.en;

  if (!app) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lang={params.lang} />

      <main className="container mx-auto max-w-6xl px-4 py-8">
        <div className="max-w-none">
          {/* Main Content */}
          <div>
            <Hero
              title={{
                main: t.deploy + ' ' + app.name,
                sub: app.name + ' Managed Hosting',
              }}
              mainTitleEmphasis={1}
              lang={params.lang}
            />

            <AppHeader app={app} translations={t} lang={params.lang} />
            <AppDescription app={app} />
            <WhyThisSoftware app={app} translations={t} />
            <SealosAdvantages translations={t} />
            <AppFeatures app={app} translations={t} />
            <AppUseCases app={app} translations={t} />
            <AppScreenshots app={app} />
          </div>
        </div>
      </main>
      <Footer lang={params.lang} />
    </div>
  );
}
