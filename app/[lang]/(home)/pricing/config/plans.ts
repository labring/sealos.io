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
      type: 'auth',
      params: {
        openapp: 'system-costcenter?mode=create&plan=starter',
      },
    },
    features: [
      '2 vCPU ',
      '2Gi RAM',
      '1Gi Disk',
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
      type: 'auth',
      params: {
        openapp: 'system-costcenter?mode=create&plan=hobby',
      },
    },
    features: [
      '4 vCPU ',
      '4Gi RAM',
      '30Gi Disk',
      '50GB Traffic',
      '8 Nodeport',
      '300 AI Credits',
      'All Starter Features',
    ],
    isPopular: true,
  },
  {
    name: 'Pro',
    description: 'For professionals and teams shipping production apps.',
    price: '$512',
    buttonText: 'Get Started',
    action: {
      type: 'auth',
      params: {
        openapp: 'system-costcenter?mode=create&plan=pro',
      },
    },
    features: [
      '16 vCPU ',
      '32Gi RAM',
      '200Gi Disk',
      '1TB Traffic',
      '32 Nodeport',
      '1000 AI Credits',
      'Priority support',
      'All Hobby features',
      '99.99% SLA',
    ],
  },
  {
    name: 'Team',
    description:
      'For large teams with compliance needs. Built for collaboration.',
    price: '$2030',
    buttonText: 'Get Started',
    action: {
      type: 'auth',
      params: {
        openapp: 'system-costcenter?mode=create&plan=team',
      },
    },
    features: [
      '64 vCPU ',
      '128Gi RAM',
      '500Gi Disk',
      '3TB Traffic',
      '64 Nodeport',
      '1500 AI Credits',
      '24/7 dedicated support',
      'All Pro Features',
      'Custom Contracts',
    ],
  },
];

export const morePlans: PricingPlan[] = [
  {
    name: 'Standard',
    description:
      '8 vCPU + 16Gi RAM + 50Gi Disk + 300 GB Traffic + 16 Nodeport + 800 AI Credits',
    price: '$128/month',
    buttonText: 'Get Started',
    action: {
      type: 'auth',
      params: {
        openapp: 'system-costcenter?mode=create',
      },
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
      type: 'auth',
      params: {
        openapp: 'system-costcenter?mode=create',
      },
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
