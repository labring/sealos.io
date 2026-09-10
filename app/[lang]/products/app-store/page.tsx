// App Store listing page entry with semantic theme and marketplace browsing.
import type { CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '@/new-components/Footer';
import { Header } from '@/new-components/Header';
import BottomLightImage from '@/assets/bottom-light.svg';
import { generatePageMetadata } from '@/lib/utils/metadata';
import StructuredDataComponent from '@/components/structured-data';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '@/lib/utils/structured-data';
import { siteConfig } from '@/config/site';
import { appsConfig } from '@/config/apps';
import { getLanguageSlug, type languagesType, LANGUAGES } from '@/lib/i18n';
import AppStoreContent from './components/app-store-content';
import AppStoreFAQ from './components/app-store-faq';
import {
  APP_STORE_DESCRIPTION,
  APP_STORE_PATHNAME,
  APP_STORE_TITLE,
  appStoreFaqItems,
  appStoreKeywords,
  generateAppStoreCollectionSchema,
  generateAppStoreSoftwareSchema,
} from './app-store-seo';

const translations = {
  en: {
    title: {
      main: 'Ready-to-use, One-Click Deployment',
      sub: APP_STORE_DESCRIPTION,
    },
  },
  'zh-cn': {
    title: {
      main: '一键部署应用程序',
      sub: '通过 Sealos 应用商店一键部署自托管开源应用、数据库和开发者工具，获得自动 HTTPS 与 Kubernetes 云基础设施。',
    },
  },
};

const appStoreBackgroundVars = {
  '--background': '0 0% 3.9%',
  '--card': '0 0% 3.9%',
  '--popover': '0 0% 3.9%',
} as CSSProperties;

export async function generateStaticParams() {
  return LANGUAGES.map((lang) => ({
    lang,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { lang: languagesType };
}) {
  const t = translations[params.lang] || translations.en;
  return generatePageMetadata({
    title: APP_STORE_TITLE,
    description: t.title.sub,
    keywords: appStoreKeywords,
    pathname: APP_STORE_PATHNAME,
    lang: params.lang,
  });
}

export default function AppStorePage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      { name: 'Home', url: `${siteConfig.url.base}/` },
      {
        name: 'App Store',
        url: `${siteConfig.url.base}${APP_STORE_PATHNAME}/`,
      },
    ],
    params.lang,
  );
  const faqSchema = generateFAQSchema(
    appStoreFaqItems[params.lang] || appStoreFaqItems.en,
    params.lang,
  );
  const collectionSchema = generateAppStoreCollectionSchema(
    params.lang,
    appsConfig,
  );
  const softwareSchema = generateAppStoreSoftwareSchema(params.lang);

  return (
    <>
      <StructuredDataComponent
        data={[softwareSchema, collectionSchema, breadcrumbSchema, faqSchema]}
      />
      <div
        data-theme="app-store"
        style={appStoreBackgroundVars}
        className="bg-background text-foreground isolate min-h-[100dvh]"
      >
        <div className="sticky top-0 z-50 w-full">
          <Header lang={params.lang} />
        </div>

        <main className="bg-background relative z-10">
          <AppStoreContent lang={params.lang} />
          <section
            className="mx-auto max-w-7xl px-6 pb-12 lg:px-8"
            aria-label={
              params.lang === 'zh-cn' ? '全部应用模板' : 'All app templates'
            }
          >
            <details className="rounded-xl border border-white/10 px-6 py-5">
              <summary className="cursor-pointer text-base font-medium text-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7fa8ff]">
                {params.lang === 'zh-cn'
                  ? '浏览全部模板'
                  : 'Browse all templates'}{' '}
                ({appsConfig.length})
              </summary>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                {[...appsConfig]
                  .sort((a, b) => a.name.localeCompare(b.name, 'en'))
                  .map((app) => (
                    <li key={app.slug}>
                      <Link
                        href={`${getLanguageSlug(params.lang)}${APP_STORE_PATHNAME}/${app.slug.toLowerCase()}/`}
                        className="text-sm text-zinc-300 underline-offset-4 hover:text-[#7fa8ff] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7fa8ff]"
                      >
                        {app.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </details>
          </section>
          <AppStoreFAQ lang={params.lang} />
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
