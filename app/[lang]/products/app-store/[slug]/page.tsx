// App Store detail page with the redesigned marketplace layout.
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Footer } from '@/new-components/Footer';
import { Header } from '@/new-components/Header';
import BottomLightImage from '@/assets/bottom-light.svg';
import { appsConfig, getAppBySlug, loadAllApps } from '@/config/apps';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { LANGUAGES, languagesType } from '@/lib/i18n';
import AppDetailHero from './components/AppDetailHero';
import ReadmePreview from './components/ReadmePreview';
import { loadReadmeMarkdown } from './components/ReadmeMarkdownWindow';
import RelatedTemplates from './components/RelatedTemplates';
import WholeStackSection from './components/WholeStackSection';
import WhyDeployOnSealos from './components/WhyDeployOnSealos';
import {
  getRelatedApps,
  type AppDetailConfig,
} from './components/app-detail-utils';

interface AppDeployPageProps {
  params: {
    slug: string;
    lang: languagesType;
  };
}

const appStoreDetailBackgroundVars = {
  '--background': '0 0% 3.9%',
  '--card': '0 0% 3.9%',
  '--popover': '0 0% 3.9%',
} as CSSProperties;

export async function generateStaticParams() {
  const allApps = await loadAllApps();

  return LANGUAGES.flatMap((lang) =>
    allApps.map((app) => ({
      lang,
      slug: app.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: AppDeployPageProps): Promise<Metadata> {
  const app = await getAppBySlug(params.slug);

  if (!app) {
    return {
      title: 'App Not Found',
    };
  }

  return generatePageMetadata({
    title: `Deploy ${app.name}`,
    description: app.description,
    keywords: app.tags,
    pathname: `/products/app-store/${params.slug}`,
    lang: params.lang,
    ogType: 'app',
  });
}

export default async function AppDeployPage({ params }: AppDeployPageProps) {
  const app = (await getAppBySlug(params.slug)) as AppDetailConfig | undefined;

  if (!app) {
    notFound();
  }

  const allApps = appsConfig as AppDetailConfig[];
  const relatedApps = getRelatedApps({
    apps: allApps,
    currentApp: app,
    limit: 3,
  });
  const readme = await loadReadmeMarkdown(app);

  return (
    <div
      data-theme="app-store"
      style={appStoreDetailBackgroundVars}
      className="isolate min-h-screen bg-background text-foreground"
    >
      <div className="sticky top-0 z-50 container pt-8">
        <Header lang={params.lang} />
      </div>

      <main className="-mt-24 overflow-x-clip">
        <AppDetailHero app={app} lang={params.lang} />
        <WhyDeployOnSealos />
        <WholeStackSection />
        <ReadmePreview app={app} readme={readme} />
        <RelatedTemplates apps={relatedApps} lang={params.lang} />
      </main>

      <div className="relative mt-[80px] mb-[400px] h-[800px]">
        <div className="w-full">
          <Image
            src={BottomLightImage}
            alt=""
            className="h-auto w-full object-cover select-none"
            priority
            fill
          />
        </div>
        <Footer lang={params.lang} />
      </div>
    </div>
  );
}
