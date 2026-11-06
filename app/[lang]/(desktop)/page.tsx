import type { Metadata } from 'next';
import type { languagesType } from '@/lib/i18n';
import { getLanguageSlug } from '@/lib/i18n';
import { generatePageMetadata } from '@/lib/utils/metadata';
import { getDesktopDownloadLinks } from '@/config/desktop-downloads';
import { getHomeCopy } from './content';
import { HomeNav } from './components/nav';
import { HeroSection } from './sections/hero';
import { FeatureRows } from './sections/feature-rows';
import { ShipSection } from './sections/ship';
import { DeployAnySection } from './sections/deploy-any';
import { DutySection } from './sections/duty';
import { DependsSection } from './sections/depends';
import { FaqSection } from './sections/faq';
import { CtaSection } from './sections/cta';
import { HomeFooter } from './sections/footer';

interface PageProps {
  params: { lang: languagesType };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const copy = getHomeCopy(params.lang);
  return generatePageMetadata({
    title: copy.meta.title,
    description: copy.meta.description,
    keywords: [
      'Sealos',
      'ops agent',
      'AIOps',
      'deploy full-stack apps',
      'vibe coding deploy',
      'managed databases',
      'AI gateway',
      'desktop app',
    ],
    pathname: '/',
    lang: params.lang,
  });
}

export default async function DesktopHomePage({ params }: PageProps) {
  const lang = params.lang;
  const copy = getHomeCopy(lang);
  const downloadLinks = await getDesktopDownloadLinks();
  const prefix = getLanguageSlug(lang);
  const localize = (href: string) =>
    href.startsWith('/') ? `${prefix}${href}` : href;

  return (
    <>
      <HomeNav copy={copy} downloadLinks={downloadLinks} lang={lang} />
      <main>
        <HeroSection
          copy={copy}
          downloadLinks={downloadLinks}
          skillsHref={localize('/sealos-skills')}
        />
        <FeatureRows copy={copy} />
        <ShipSection copy={copy} />
        <DeployAnySection copy={copy} />
        <DutySection copy={copy} />
        <DependsSection copy={copy} />
        <FaqSection copy={copy} />
        <CtaSection copy={copy} downloadLinks={downloadLinks} />
      </main>
      <HomeFooter copy={copy} lang={lang} localize={localize} />
    </>
  );
}
