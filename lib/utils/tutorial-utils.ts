import { tutorials } from '@/lib/source';
import type { languagesType } from '@/lib/i18n';

export type TutorialPage = ReturnType<typeof tutorials.getPages>[number];

export type TutorialStage = 'beginner' | 'advanced' | 'production';

export interface TutorialSummary {
  title: string;
  description: string;
  url: string;
  slug: string;
  stage: TutorialStage;
  stageLabel: string;
  framework: string;
  seriesOrder: number;
  estimatedReadingTime?: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface AdjacentTutorial {
  name: string;
  url: string;
}

export interface AdjacentTutorials {
  previous: AdjacentTutorial | undefined;
  next: AdjacentTutorial | undefined;
}

const TUTORIAL_DETAIL_LANG: languagesType = 'en';

const STAGE_LABELS: Record<TutorialStage, string> = {
  beginner: 'Beginner',
  advanced: 'Database',
  production: 'Production',
};

export function getTutorialStageLabel(stage: TutorialStage): string {
  return STAGE_LABELS[stage] ?? stage;
}

export function getTutorialSlug(page: TutorialPage): string {
  return page.slugs[0] ?? '';
}

export function getTutorialPage(
  slug: string,
  lang: string = TUTORIAL_DETAIL_LANG,
): TutorialPage | undefined {
  if (lang !== TUTORIAL_DETAIL_LANG) return undefined;
  return tutorials.getPage([slug], TUTORIAL_DETAIL_LANG) ?? undefined;
}

export function getSortedTutorials(lang: string = TUTORIAL_DETAIL_LANG) {
  if (lang !== TUTORIAL_DETAIL_LANG) return [];

  return [...tutorials.getPages(TUTORIAL_DETAIL_LANG)].sort((a, b) => {
    const seriesCompare = a.data.series.localeCompare(b.data.series);
    if (seriesCompare !== 0) return seriesCompare;
    return a.data.seriesOrder - b.data.seriesOrder;
  });
}

export function toTutorialSummary(page: TutorialPage): TutorialSummary {
  const slug = getTutorialSlug(page);
  return {
    title: page.data.title,
    description: page.data.description,
    url: `/tutorials/${slug}`,
    slug,
    stage: page.data.stage,
    stageLabel: getTutorialStageLabel(page.data.stage),
    framework: page.data.framework,
    seriesOrder: page.data.seriesOrder,
    estimatedReadingTime: page.data.estimatedReadingTime,
    cta: page.data.cta,
  };
}

function toAdjacentTutorial(
  page: TutorialPage | undefined,
): AdjacentTutorial | undefined {
  if (!page) return undefined;
  return { name: page.data.title, url: `/tutorials/${getTutorialSlug(page)}` };
}

export function getAdjacentTutorials(page: TutorialPage): AdjacentTutorials {
  const series = getSortedTutorials().filter(
    (candidate) => candidate.data.series === page.data.series,
  );
  const index = series.findIndex(
    (candidate) => getTutorialSlug(candidate) === getTutorialSlug(page),
  );

  return {
    previous: toAdjacentTutorial(index > 0 ? series[index - 1] : undefined),
    next: toAdjacentTutorial(
      index >= 0 && index < series.length - 1 ? series[index + 1] : undefined,
    ),
  };
}

export function getRelatedTutorials(page: TutorialPage): TutorialSummary[] {
  const allTutorials = getSortedTutorials();
  const bySlug = new Map(
    allTutorials.map((candidate) => [getTutorialSlug(candidate), candidate]),
  );

  return page.data.relatedTutorials
    .map((slug) => bySlug.get(slug))
    .filter((candidate): candidate is TutorialPage => Boolean(candidate))
    .map(toTutorialSummary);
}

export function getTutorialKeywords(page: TutorialPage): string[] {
  return Array.from(
    new Set([
      page.data.primaryKeyword,
      ...page.data.targetKeywords,
      ...page.data.tags,
      page.data.framework,
      'Sealos Tutorials',
    ]),
  );
}
