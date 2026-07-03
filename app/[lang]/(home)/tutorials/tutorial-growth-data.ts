export type TutorialGrowthStage = 'deploy' | 'postgresql' | 'production';
export type TutorialInventoryStatus = 'available' | 'coming_next' | 'planned';

export interface TutorialStageDefinition {
  id: TutorialGrowthStage;
  label: string;
  shortLabel: string;
  title: string;
  intent: string;
  outcome: string;
  availableSlug: string;
  availableCta: string;
  requestCta: string;
  sourceStage: 'beginner' | 'advanced' | 'production';
}

export interface TutorialFrameworkDefinition {
  key: string;
  name: string;
  pathNote: string;
}

export interface TutorialInventoryItem {
  framework: string;
  frameworkKey: string;
  stage: TutorialGrowthStage;
  stageLabel: string;
  slug: string;
  status: TutorialInventoryStatus;
  title: string;
  requestCta: string;
}

export interface TutorialFrameworkMatrixRow {
  framework: TutorialFrameworkDefinition;
  items: TutorialInventoryItem[];
}

export const TUTORIAL_STAGES = [
  {
    id: 'deploy',
    label: 'Deploy',
    shortLabel: 'Deploy',
    title: 'Deploy an app',
    intent: 'I have a framework project and need a live URL.',
    outcome:
      'Analyze the project, set deployment artifacts, and launch on Sealos.',
    availableSlug: 'deploy-nextjs-sealos',
    availableCta: 'Start the deployment path',
    requestCta: 'Request a deployment guide',
    sourceStage: 'beginner',
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    shortLabel: 'Postgres',
    title: 'Add PostgreSQL',
    intent: 'I need the app to run with a managed database.',
    outcome:
      'Connect database settings, environment variables, migrations, and checks.',
    availableSlug: 'nextjs-postgresql-sealos',
    availableCta: 'Connect PostgreSQL',
    requestCta: 'Request a PostgreSQL guide',
    sourceStage: 'advanced',
  },
  {
    id: 'production',
    label: 'Production',
    shortLabel: 'Prod',
    title: 'Go production',
    intent: 'I need release readiness before real users arrive.',
    outcome:
      'Check ports, logs, domains, HTTPS, rollback, and deployment state.',
    availableSlug: 'nextjs-production-deployment-sealos',
    availableCta: 'Prepare production rollout',
    requestCta: 'Request a production guide',
    sourceStage: 'production',
  },
] as const satisfies readonly TutorialStageDefinition[];

export const TUTORIAL_FRAMEWORKS = [
  { key: 'nextjs', name: 'Next.js', pathNote: 'Complete public path' },
  { key: 'react', name: 'React', pathNote: 'High-demand frontend path' },
  { key: 'nodejs', name: 'Node.js', pathNote: 'Common full-stack runtime' },
  { key: 'fastapi', name: 'FastAPI', pathNote: 'API and AI service path' },
  { key: 'django', name: 'Django', pathNote: 'Backend product path' },
  { key: 'go', name: 'Go', pathNote: 'Production backend path' },
  { key: 'spring-boot', name: 'Spring Boot', pathNote: 'Enterprise service path' },
  { key: 'angular', name: 'Angular', pathNote: 'Frontend framework path' },
  { key: 'astro', name: 'Astro', pathNote: 'Content and static app path' },
  { key: 'flask', name: 'Flask', pathNote: 'Python service path' },
  { key: 'laravel', name: 'Laravel', pathNote: 'PHP application path' },
  { key: 'nestjs', name: 'NestJS', pathNote: 'Node backend framework path' },
  { key: 'nuxt', name: 'Nuxt', pathNote: 'Vue meta-framework path' },
  { key: 'rails', name: 'Rails', pathNote: 'Ruby product path' },
  { key: 'remix', name: 'Remix', pathNote: 'Full-stack React path' },
  { key: 'rust', name: 'Rust', pathNote: 'Systems service path' },
  { key: 'svelte', name: 'Svelte', pathNote: 'Frontend framework path' },
  { key: 'vue', name: 'Vue', pathNote: 'Frontend framework path' },
] as const satisfies readonly TutorialFrameworkDefinition[];

export const AVAILABLE_FRAMEWORK_KEYS = new Set([
  'nextjs',
  'react',
  'nodejs',
]);

const COMING_NEXT_FRAMEWORK_KEYS = new Set([
  'fastapi',
  'django',
  'go',
  'spring-boot',
]);

export const STATUS_LABELS: Record<TutorialInventoryStatus, string> = {
  available: 'Available',
  coming_next: 'Coming next',
  planned: 'Planned',
};

function getTutorialSlug(
  framework: TutorialFrameworkDefinition,
  stage: TutorialStageDefinition,
): string {
  if (framework.key === 'nextjs') return stage.availableSlug;
  if (stage.id === 'deploy') return `deploy-${framework.key}-sealos`;
  if (stage.id === 'postgresql') return `${framework.key}-postgresql-sealos`;
  return `${framework.key}-production-deployment-sealos`;
}

function getInventoryStatus(
  framework: TutorialFrameworkDefinition,
): TutorialInventoryStatus {
  if (AVAILABLE_FRAMEWORK_KEYS.has(framework.key)) return 'available';
  if (COMING_NEXT_FRAMEWORK_KEYS.has(framework.key)) return 'coming_next';
  return 'planned';
}

function getInventoryTitle(
  framework: TutorialFrameworkDefinition,
  stage: TutorialStageDefinition,
): string {
  if (stage.id === 'deploy') return `Deploy ${framework.name} on Sealos`;
  if (stage.id === 'postgresql') return `${framework.name} with PostgreSQL on Sealos`;
  return `${framework.name} production deployment on Sealos`;
}

export function getTutorialInventoryItem(
  framework: TutorialFrameworkDefinition,
  stage: TutorialStageDefinition,
): TutorialInventoryItem {
  return {
    framework: framework.name,
    frameworkKey: framework.key,
    stage: stage.id,
    stageLabel: stage.label,
    slug: getTutorialSlug(framework, stage),
    status: getInventoryStatus(framework),
    title: getInventoryTitle(framework, stage),
    requestCta: stage.requestCta,
  };
}

export function getTutorialFrameworkMatrix(): TutorialFrameworkMatrixRow[] {
  return TUTORIAL_FRAMEWORKS.map((framework) => ({
    framework,
    items: TUTORIAL_STAGES.map((stage) =>
      getTutorialInventoryItem(framework, stage),
    ),
  }));
}

export function getTutorialInventory(): TutorialInventoryItem[] {
  return getTutorialFrameworkMatrix().flatMap((row) => row.items);
}

export const TUTORIAL_INVENTORY_TOTAL =
  TUTORIAL_FRAMEWORKS.length * TUTORIAL_STAGES.length;
