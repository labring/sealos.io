import StructuredDataComponent from '@/components/structured-data';
import { ContentIndexHeader } from '@/components/content-index-header';
import type { languagesType } from '@/lib/i18n';
import {
  generatePageMetadata,
  getBaseUrl,
  getPageUrl,
} from '@/lib/utils/metadata';
import {
  generateBreadcrumbSchema,
  type StructuredData,
} from '@/lib/utils/structured-data';
import {
  getSortedTutorials,
  type TutorialSummary,
  toTutorialSummary,
} from '@/lib/utils/tutorial-utils';
import { PageTopRays } from '@/new-components/SideRays';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import {
  TutorialFrameworkMatrix,
  TutorialRequestPanel,
} from './TutorialFrameworkMatrix';
import { TutorialJourneyRail } from './TutorialJourneyRail';
import { TUTORIAL_STAGES } from './tutorial-growth-data';

const TUTORIALS_PATHNAME = '/tutorials';
const TUTORIALS_PAGE_TITLE = 'Sealos Deployment Tutorials';
const TUTORIALS_PAGE_DESCRIPTION =
  'Deploy Django on Sealos with a qualified Core tutorial, then explore planned framework, PostgreSQL, and production deployment guides.';

const TUTORIALS_PAGE_KEYWORDS = [
  'Sealos tutorials',
  'Next.js deployment tutorials',
  'React deployment tutorials',
  'Node.js deployment tutorials',
  'FastAPI deployment tutorials',
  'Django deployment tutorials',
  'Next.js deployment guide',
  'deploy Next.js on Sealos',
  'deploy React on Sealos',
  'deploy Node.js on Sealos',
  'deploy FastAPI on Sealos',
  'deploy Django on Sealos',
  'Sealos Skills',
  'Next.js PostgreSQL deployment',
  'React PostgreSQL deployment',
  'Node.js PostgreSQL deployment',
  'FastAPI PostgreSQL deployment',
  'Django PostgreSQL deployment',
  'Next.js production deployment',
  'FastAPI production deployment',
  'Django production deployment',
];

function getTutorialsStructuredData(
  tutorials: TutorialSummary[],
): StructuredData[] {
  const pageUrl = getPageUrl('en', TUTORIALS_PATHNAME);
  const baseUrl = getBaseUrl('en');

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: TUTORIALS_PAGE_TITLE,
      description: TUTORIALS_PAGE_DESCRIPTION,
      url: pageUrl,
      inLanguage: 'en-US',
      isPartOf: {
        '@type': 'WebSite',
        name: 'Sealos',
        url: baseUrl,
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: tutorials.length,
        itemListElement: tutorials.map((tutorial, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: getPageUrl('en', tutorial.url),
          name: tutorial.title,
          description: tutorial.description,
        })),
      },
    },
    generateBreadcrumbSchema(
      [
        { name: 'Home', url: baseUrl },
        { name: 'Tutorials', url: pageUrl },
      ],
      'en',
    ),
  ];
}

export function generateMetadata({
  params,
}: {
  params: { lang: languagesType };
}): Metadata {
  const metadata = generatePageMetadata({
    title: TUTORIALS_PAGE_TITLE,
    description: TUTORIALS_PAGE_DESCRIPTION,
    keywords: TUTORIALS_PAGE_KEYWORDS,
    pathname: TUTORIALS_PATHNAME,
    section: 'Tutorials',
    languageAlternates: false,
  });

  if (params.lang !== 'en') {
    return {
      ...metadata,
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      },
    };
  }

  return metadata;
}

export default function TutorialsPage({
  params,
}: {
  params: { lang: languagesType };
}) {
  const tutorials = getSortedTutorials().map(toTutorialSummary);
  const tutorialBySlug = new Map(
    tutorials.map((tutorial) => [tutorial.slug, tutorial]),
  );
  const firstTutorial = tutorialBySlug.get(TUTORIAL_STAGES[0].availableSlug);
  const structuredData = getTutorialsStructuredData(tutorials);
  const shouldRenderStructuredData = params.lang === 'en';

  return (
    <>
      {shouldRenderStructuredData && (
        <StructuredDataComponent data={structuredData} />
      )}

      <PageTopRays />

      <main>
        <section className="container -mt-24 pt-44 pb-14">
          <ContentIndexHeader
            prefix="Sealos tutorials for"
            accent="app deployment"
            description="Start with the published Django Core guide, then request the framework, PostgreSQL, or production path your app needs."
            action={
              <Button variant="landing-primary" className="h-10" asChild>
                <Link href={firstTutorial?.url ?? '/tutorials/django/deploy/'}>
                  Start with Django Core
                  <ArrowRight size={16} className="ml-2" aria-hidden="true" />
                </Link>
              </Button>
            }
          />
        </section>

        <section className="container">
          <TutorialJourneyRail tutorialBySlug={tutorialBySlug} />
          <TutorialFrameworkMatrix />
          <TutorialRequestPanel />
        </section>
      </main>
    </>
  );
}
