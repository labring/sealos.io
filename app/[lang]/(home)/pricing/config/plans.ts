export type PlanAction =
  | { type: 'auth'; params: Record<string, string> }
  | { type: 'direct'; url: string };

export type PricingPlanId =
  | 'starter'
  | 'hobby'
  | 'standard'
  | 'pro'
  | 'team'
  | 'enterprise'
  | 'customized';

export interface PlanResources {
  cpu: number;
  ram: number;
  disk: number;
  traffic: number;
  nodeports: number;
  aiCredits: number;
}

export interface PricingPlan {
  planId: PricingPlanId;
  name: string;
  description: string;
  price: string;
  monthlyPrice?: number;
  originalPrice?: string;
  buttonText: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  features: string[];
  resources?: PlanResources;
  isPopular?: boolean;
  action: PlanAction;
}

const buildResourceFeatures = (resources: PlanResources): string[] => [
  `${resources.cpu} vCPU`,
  `${resources.ram}Gi RAM`,
  `${resources.disk}Gi Disk`,
  `${resources.traffic >= 1000 ? `${resources.traffic / 1000}TB` : `${resources.traffic}GB`} Traffic`,
  `${resources.nodeports} NodePort${resources.nodeports === 1 ? '' : 's'}`,
  `${resources.aiCredits} AI Credits`,
];

const starterResources: PlanResources = {
  cpu: 2,
  ram: 2,
  disk: 10,
  traffic: 10,
  nodeports: 4,
  aiCredits: 100,
};

const hobbyResources: PlanResources = {
  cpu: 4,
  ram: 4,
  disk: 20,
  traffic: 50,
  nodeports: 8,
  aiCredits: 300,
};

const standardResources: PlanResources = {
  cpu: 8,
  ram: 16,
  disk: 50,
  traffic: 300,
  nodeports: 16,
  aiCredits: 800,
};

const proResources: PlanResources = {
  cpu: 16,
  ram: 32,
  disk: 200,
  traffic: 1000,
  nodeports: 32,
  aiCredits: 1000,
};

const allPricingPlans: PricingPlan[] = [
  {
    planId: 'starter',
    name: 'Starter',
    description: 'For lightweight apps and existing container images.',
    price: '$7',
    monthlyPrice: 7,
    buttonText: 'Choose Starter',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3Dstarter',
    },
    resources: starterResources,
    features: buildResourceFeatures(starterResources),
  },
  {
    planId: 'hobby',
    name: 'Hobby',
    description: 'For side projects, demos, and personal services.',
    price: '$25',
    monthlyPrice: 25,
    buttonText: 'Choose Hobby',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3Dhobby',
    },
    resources: hobbyResources,
    features: [
      ...buildResourceFeatures(hobbyResources),
      'All Starter features',
    ],
    isPopular: true,
  },
  {
    planId: 'standard',
    name: 'Standard',
    description: 'For production apps and growing startups.',
    price: '$128',
    monthlyPrice: 128,
    buttonText: 'Choose Standard',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3Dstandard',
    },
    resources: standardResources,
    features: [
      ...buildResourceFeatures(standardResources),
      'Priority support',
      '99.99% SLA',
    ],
  },
  {
    planId: 'pro',
    name: 'Pro',
    description: 'For multi-service production workloads and teams.',
    price: '$512',
    monthlyPrice: 512,
    buttonText: 'Choose Pro',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3Dpro',
    },
    resources: proResources,
    features: [
      ...buildResourceFeatures(proResources),
      '24/7 dedicated support',
    ],
  },
  {
    planId: 'team',
    name: 'Team',
    description: '64 vCPU, 128Gi RAM, 500Gi Disk, and 3TB Traffic.',
    price: '$2,030',
    monthlyPrice: 2030,
    buttonText: 'Choose Team',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3Dteam',
    },
    resources: {
      cpu: 64,
      ram: 128,
      disk: 500,
      traffic: 3000,
      nodeports: 64,
      aiCredits: 1500,
    },
    features: [],
  },
  {
    planId: 'enterprise',
    name: 'Enterprise',
    description: '256 vCPU, 1024Gi RAM, 1024Gi Disk, and 10TB Traffic.',
    price: '$12,451',
    monthlyPrice: 12451,
    buttonText: 'Choose Enterprise',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3Denterprise',
    },
    resources: {
      cpu: 256,
      ram: 1024,
      disk: 1024,
      traffic: 10000,
      nodeports: 128,
      aiCredits: 2000,
    },
    features: [],
  },
  {
    planId: 'customized',
    name: 'Customized',
    description: 'A resource package and support plan built around your needs.',
    price: 'Contact us',
    buttonText: 'Contact sales',
    action: {
      type: 'direct',
      url: 'https://forms.sealos.in/form/po5b21Si',
    },
    features: [],
  },
];

export const mainPricingPlans = allPricingPlans.filter(({ planId }) =>
  ['starter', 'hobby', 'standard'].includes(planId),
);

export const morePlans = allPricingPlans.filter(({ planId }) =>
  ['pro', 'team', 'enterprise', 'customized'].includes(planId),
);

export const railwayComparablePlans = allPricingPlans.filter(
  (
    plan,
  ): plan is PricingPlan & {
    monthlyPrice: number;
    resources: PlanResources;
  } =>
    ['starter', 'hobby', 'standard', 'pro'].includes(plan.planId) &&
    plan.monthlyPrice !== undefined &&
    plan.resources !== undefined,
);

export const getPricingPlan = (planId: PricingPlanId) =>
  allPricingPlans.find((plan) => plan.planId === planId);
