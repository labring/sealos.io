import type { TutorialSummary } from '@/lib/utils/tutorial-utils';

export const TUTORIAL_TASKS = [
  {
    id: 'deploy',
    label: 'Core deployment',
  },
  {
    id: 'integration',
    label: 'Service integration',
  },
  {
    id: 'production',
    label: 'Production operations',
  },
  {
    id: 'troubleshooting',
    label: 'Troubleshooting',
  },
  {
    id: 'migrate',
    label: 'Application migration',
  },
  {
    id: 'data-migration',
    label: 'Data migration',
  },
] as const;

// Public coverage names only. Availability always comes from published MDX.
export const TUTORIAL_STACKS = [
  { name: 'React + Vite', runtime: 'Browser' },
  { name: 'Next.js', runtime: 'Node.js' },
  { name: 'Express', runtime: 'Node.js' },
  { name: 'Django', runtime: 'Python' },
  { name: 'FastAPI', runtime: 'Python' },
  { name: 'Laravel', runtime: 'PHP' },
  { name: 'Spring Boot', runtime: 'Java' },
  { name: 'Rails', runtime: 'Ruby' },
  { name: 'Go net/http', runtime: 'Go' },
  { name: 'Axum', runtime: 'Rust' },
] as const;

export type TutorialTask = (typeof TUTORIAL_TASKS)[number]['id'];
export type CatalogTutorial = TutorialSummary & { displayTitle?: string };

export function getTutorialTask(url: string): TutorialTask {
  const [, family, task] = url.split('/').filter(Boolean);
  if (family === 'migrate' || family === 'data-migration') return family;
  if (
    task === 'deploy' ||
    task === 'production' ||
    task === 'troubleshooting'
  ) {
    return task;
  }
  return 'integration';
}

export function getTutorialRuntime(tutorial: TutorialSummary): string {
  // ponytail: Extend the first-cohort mapping when publishing another framework.
  return (
    TUTORIAL_STACKS.find((stack) => stack.name === tutorial.framework)
      ?.runtime ?? tutorial.runtime
  );
}

export function filterTutorials(
  tutorials: CatalogTutorial[],
  task: TutorialTask | 'all',
  runtime = 'all',
): CatalogTutorial[] {
  return tutorials.filter(
    (tutorial) =>
      (task === 'all' || getTutorialTask(tutorial.url) === task) &&
      (runtime === 'all' || getTutorialRuntime(tutorial) === runtime),
  );
}

export function hasMultipleTutorialRuntimes(tutorials: CatalogTutorial[]) {
  return new Set(tutorials.map(getTutorialRuntime)).size > 1;
}

export function getTutorialGroups(
  tutorials: CatalogTutorial[],
  task: TutorialTask | 'all',
  runtime = 'all',
) {
  const visible = filterTutorials(tutorials, task);
  return Array.from(
    new Set([
      ...TUTORIAL_STACKS.map((stack) => stack.runtime),
      ...tutorials.map(getTutorialRuntime),
    ]),
  )
    .filter((name) => runtime === 'all' || name === runtime)
    .map((name) => {
      const frameworks = Array.from(
        new Set([
          ...TUTORIAL_STACKS.filter((stack) => stack.runtime === name).map(
            (stack) => stack.name,
          ),
          ...tutorials
            .filter((tutorial) => getTutorialRuntime(tutorial) === name)
            .map((tutorial) => tutorial.framework),
        ]),
      );
      return {
        name,
        frameworks: frameworks
          .map((framework) => ({
            name: framework,
            guides: visible.filter(
              (guide) =>
                guide.framework === framework &&
                getTutorialRuntime(guide) === name,
            ),
          }))
          .filter(
            (framework) =>
              framework.guides.length > 0 ||
              !tutorials.some((guide) => guide.framework === framework.name),
          )
          .sort(
            (a, b) => Number(b.guides.length > 0) - Number(a.guides.length > 0),
          ),
      };
    })
    .filter((group) => group.frameworks.length > 0)
    .sort(
      (a, b) =>
        Number(b.frameworks.some((framework) => framework.guides.length > 0)) -
        Number(a.frameworks.some((framework) => framework.guides.length > 0)),
    );
}
