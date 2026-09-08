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
  runtime: string;
  estimatedReadingTime?: string;
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

const STAGE_ORDER: Record<TutorialStage, number> = {
  beginner: 1,
  advanced: 2,
  production: 3,
};

export function getTutorialStageLabel(stage: TutorialStage): string {
  return STAGE_LABELS[stage] ?? stage;
}

export function getTutorialPage(
  slug: string[],
  lang: string,
): TutorialPage | undefined {
  if (lang !== TUTORIAL_DETAIL_LANG) return undefined;
  return tutorials.getPage(slug, TUTORIAL_DETAIL_LANG) ?? undefined;
}

export function getSortedTutorials() {
  return [...tutorials.getPages(TUTORIAL_DETAIL_LANG)].sort((a, b) => {
    const frameworkCompare = a.data.framework.localeCompare(b.data.framework);
    if (frameworkCompare !== 0) return frameworkCompare;
    return STAGE_ORDER[a.data.stage] - STAGE_ORDER[b.data.stage];
  });
}

export function toTutorialSummary(page: TutorialPage): TutorialSummary {
  const slug = page.slugs.join('/');
  return {
    title: page.data.title,
    description: page.data.description,
    url: page.data.slug,
    slug,
    stage: page.data.stage,
    stageLabel: getTutorialStageLabel(page.data.stage),
    framework: page.data.framework,
    runtime: page.data.runtime,
    estimatedReadingTime: page.data.estimatedReadingTime,
  };
}

function toAdjacentTutorial(
  page: TutorialPage | undefined,
): AdjacentTutorial | undefined {
  if (!page) return undefined;
  return { name: page.data.title, url: page.data.slug };
}

export function getAdjacentTutorials(page: TutorialPage): AdjacentTutorials {
  const pages = getSortedTutorials();
  const previous = pages.find(
    (candidate) => candidate.data.next === page.data.slug,
  );
  const next = pages.find(
    (candidate) => candidate.data.slug === page.data.next,
  );

  return {
    previous: toAdjacentTutorial(previous),
    next: toAdjacentTutorial(next),
  };
}

export function getRelatedTutorials(page: TutorialPage): TutorialSummary[] {
  const allTutorials = getSortedTutorials();
  const byPath = new Map(
    allTutorials.map((candidate) => [candidate.data.slug, candidate]),
  );

  return page.data.related
    .map((path) => byPath.get(path))
    .filter((candidate): candidate is TutorialPage => Boolean(candidate))
    .map(toTutorialSummary);
}

export function getTutorialKeywords(page: TutorialPage): string[] {
  return Array.from(
    new Set([
      page.data.title,
      ...page.data.tags,
      page.data.framework,
      `${page.data.framework} deployment`,
      'Sealos Tutorials',
    ]),
  );
}
