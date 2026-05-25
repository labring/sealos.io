import type { AppConfig } from '@/config/apps';

export type AppDetailConfig = AppConfig & {
  longDescription?: string;
  screenshots?: string[];
};

export function getDisplayDescription(app: AppDetailConfig) {
  return app.longDescription || app.description;
}

export function getTagLabel(app: Pick<AppDetailConfig, 'category' | 'tags'>) {
  return app.tags?.[0]?.replace(/-/g, ' ') || app.category;
}

const genericBenefits = new Set([
  'Easy to deploy and manage',
  'Self-hosted solution',
  'Open source and free',
  'Community supported',
]);

const categoryBenefitTemplates: Record<string, string[]> = {
  AI: [
    'Launch a private {name} AI workspace with one-click deployment.',
    'Keep models, prompts, and workflow data in your own Sealos environment.',
    'Scale GPU or CPU resources as your AI workload grows.',
    'Use an open-source template without managing Kubernetes YAML.',
  ],
  Database: [
    'Run {name} with persistent storage provisioned by Sealos.',
    'Keep database administration close to your cloud applications.',
    'Scale compute and storage resources as data usage grows.',
    'Deploy without hand-writing StatefulSet, volume, or service YAML.',
  ],
  DevOps: [
    'Deploy {name} as part of your self-hosted platform toolchain.',
    'Use Kubernetes-backed reliability without maintaining deployment YAML.',
    'Connect the tool to your existing development and operations workflows.',
    'Scale resources from the Sealos console when team usage increases.',
  ],
  Monitoring: [
    'Start collecting operational signals with a ready-to-run {name} template.',
    'Keep observability data in your own self-hosted environment.',
    'Attach persistent storage for logs, metrics, or dashboards.',
    'Deploy monitoring infrastructure without manual Kubernetes setup.',
  ],
  Storage: [
    'Deploy {name} with durable storage on Sealos.',
    'Keep file and object data under your own cloud workspace.',
    'Scale storage capacity as application data grows.',
    'Avoid manual volume and ingress configuration.',
  ],
};

const defaultBenefitTemplates = [
  'Deploy {name} in a few clicks from the Sealos App Store.',
  'Run a self-hosted open-source service on Kubernetes-backed infrastructure.',
  'Get automatic HTTPS, routing, and resource management from Sealos.',
  'Avoid manual YAML while keeping control of the deployed workload.',
];

const categoryUseCaseTemplates: Record<string, string[]> = {
  AI: [
    'Private AI product prototypes',
    'Internal LLM and agent workflows',
    'Team AI experimentation environments',
    'Self-hosted AI services for production trials',
  ],
  Database: [
    'Application database provisioning',
    'Internal data administration',
    'Analytics and reporting backends',
    'Stateful service dependencies for full-stack apps',
  ],
  DevOps: [
    'Internal developer platforms',
    'CI/CD and release operations',
    'Container and infrastructure management',
    'Security and platform automation',
  ],
  Monitoring: [
    'Application observability',
    'Uptime and incident response',
    'Metrics and dashboard operations',
    'Log and trace analysis',
  ],
  Storage: [
    'Object and file storage services',
    'Application uploads and assets',
    'Backup and archive workflows',
    'Data services for self-hosted apps',
  ],
};

const defaultUseCaseTemplates = [
  'Self-hosted business applications',
  'Developer productivity workflows',
  'Team collaboration tools',
  'Production-ready open-source services',
];

function applyName(template: string, appName: string) {
  return template.replace('{name}', appName);
}

export function getAppBenefits(
  app: Pick<AppDetailConfig, 'name' | 'category' | 'benefits'>,
) {
  const hasSpecificBenefits = app.benefits.some(
    (benefit) => !genericBenefits.has(benefit),
  );

  if (hasSpecificBenefits) return app.benefits;

  const templates =
    categoryBenefitTemplates[app.category] || defaultBenefitTemplates;
  return templates.map((template) => applyName(template, app.name));
}

export function getAppUseCases(
  app: Pick<AppDetailConfig, 'category' | 'useCases'>,
) {
  const genericUseCases = [
    'Business Operations',
    'Development Workflow',
    'Data Management',
    'Team Collaboration',
  ];
  const isGeneric =
    app.useCases.length === genericUseCases.length &&
    app.useCases.every((useCase, index) => useCase === genericUseCases[index]);

  if (!isGeneric) return app.useCases;

  return categoryUseCaseTemplates[app.category] || defaultUseCaseTemplates;
}

export function getDeployCount(app: Pick<AppDetailConfig, 'source'>) {
  return app.source?.deployCount ?? 0;
}

export function formatAppCount(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);
}

export function getRelatedApps({
  apps,
  currentApp,
  limit = 3,
}: {
  apps: AppDetailConfig[];
  currentApp: AppDetailConfig;
  limit?: number;
}) {
  const candidates = apps.filter((app) => app.slug !== currentApp.slug);
  const sameCategory = candidates.filter(
    (app) => app.category === currentApp.category,
  );
  const fallback = candidates.filter(
    (app) => app.category !== currentApp.category,
  );
  const related = [...sameCategory, ...fallback];

  return related.slice(0, limit);
}
