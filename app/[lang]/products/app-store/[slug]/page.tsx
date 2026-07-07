// App Store detail page with the redesigned marketplace layout.
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Footer } from '@/new-components/Footer';
import { Header } from '@/new-components/Header';
import BottomLightImage from '@/assets/bottom-light.svg';
import {
  appsConfig,
  getAppBySlug,
  getTemplateName,
  loadAllApps,
} from '@/config/apps';
import { generatePageMetadata } from '@/lib/utils/metadata';
import StructuredDataComponent from '@/components/structured-data';
import { generateBreadcrumbSchema } from '@/lib/utils/structured-data';
import { siteConfig } from '@/config/site';
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
import {
  APP_STORE_PATHNAME,
  generateAppDetailSoftwareSchema,
  getAppDetailMetadata,
  getAppDetailPathname,
} from '../app-store-seo';

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
    allApps.flatMap((app) =>
      [app.slug, ...(app.legacySlugs || [])].map((slug) => ({
        lang,
        slug,
      })),
    ),
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

  const metadata = getAppDetailMetadata(app);

  return generatePageMetadata({
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    pathname: getAppDetailPathname(app.slug),
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
  const canonicalPath = getAppDetailPathname(app.slug);
  const appSchema = generateAppDetailSoftwareSchema(app, params.lang);
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: siteConfig.url.base },
      { name: 'Products', url: `${siteConfig.url.base}/products` },
      { name: 'App Store', url: `${siteConfig.url.base}${APP_STORE_PATHNAME}` },
      { name: app.name, url: `${siteConfig.url.base}${canonicalPath}` },
    ],
    params.lang,
  );

  return (
    <>
      <StructuredDataComponent data={[appSchema, breadcrumbSchema]} />
      <div
        data-theme="app-store"
        style={appStoreDetailBackgroundVars}
        className="bg-background text-foreground isolate min-h-[100dvh]"
      >
        <div className="sticky top-0 z-50 container pt-4 sm:pt-8">
          <Header lang={params.lang} />
        </div>

        <main className="bg-background relative z-10 -mt-24 overflow-x-clip">
          <AppDetailHero
            app={app}
            lang={params.lang}
            templateName={getTemplateName(app)}
          />
          <WhyDeployOnSealos />
          <WholeStackSection />
          <ReadmePreview app={app} readme={readme} />
          <RelatedTemplates apps={relatedApps} lang={params.lang} />
        </main>

        <div className="relative mt-16 mb-48 h-[520px] sm:mt-[80px] sm:mb-[400px] sm:h-[800px]">
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
    </>
  );
}
