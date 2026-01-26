export type PlanAction =
  | { type: 'auth'; params: Record<string, string> }
  | { type: 'direct'; url: string };

export interface PricingPlan {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  buttonText: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost';
  features: string[];
  isPopular?: boolean;
  action: PlanAction;
}

export const mainPricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    description:
      'For beginners deploying existing images. Not for development work.',
    price: '$7',
    originalPrice: '$34',
    buttonText: 'Get Started',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3Dstarter',
    },
    features: [
      '2 vCPU ',
      '2Gi RAM',
      '10Gi Disk',
      '10GB Traffic',
      '4 Nodeport',
      '100 AI Credit',
    ],
  },
  {
    name: 'Hobby',
    description:
      'For hobbyists building side projects. Not for production use.',
    price: '$25',
    originalPrice: '$70',
    buttonText: 'Get Started',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3Dhobby',
    },
    features: [
      '4 vCPU ',
      '4Gi RAM',
      '20Gi Disk',
      '50GB Traffic',
      '8 Nodeport',
      '300 AI Credits',
      'All Starter Features',
    ],
    isPopular: true,
  },
  {
    name: 'Standard',
    description:
      'For growing startups and apps. The ideal balance of performance and scale.',
    price: '$128',
    buttonText: 'Get Started',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3dcreate',
    },
    features: [
      '8 vCPU',
      '16Gi RAM',
      '50Gi Disk',
      '300GB Traffic',
      '16 Nodeport',
      '800 AI Credits',
      'Priority Support',
      'All Hobby Features',
      '99.99% SLA',
    ],
  },
  {
    name: 'Pro',
    description:
      'For professional and team workloads. Expanded capacity for scaling projects.',
    price: '$512',
    buttonText: 'Get Started',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3Dpro',
    },
    features: [
      '16 vCPU ',
      '32Gi RAM',
      '200Gi Disk',
      '1TB Traffic',
      '32 Nodeport',
      '1000 AI Credits',
      '24/7 Dedicated Support',
      'All Standard Features',
      'Custom Contracts',
    ],
  },
];

export const morePlans: PricingPlan[] = [
  {
    name: 'Team',
    description:
      '64 vCPU + 128Gi RAM + 500Gi Disk + 3TB Traffic + 64 Nodeport + 1500 AI Credits',
    price: '$2030/month',
    buttonText: 'Get Started',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3Dcreate%26plan%3Dteam',
    },
    features: [],
  },
  {
    name: 'Enterprise',
    description:
      '256 vCPU + 1024Gi RAM + 1024Gi Disk + 10TB Traffic + 128 Nodeport + 2000 AI Credits',
    price: '$12451/month',
    buttonText: 'Get Started',
    action: {
      type: 'direct',
      url: 'https://os.sealos.io/?openapp=system-costcenter?mode%3dcreate',
    },
    features: [],
  },
  {
    name: 'Customized',
    description: '',
    price: 'Contact Us',
    buttonText: 'Get Started',
    action: {
      type: 'direct',
      url: 'https://forms.sealos.in/form/po5b21Si',
    },
    features: [],
  },
];
