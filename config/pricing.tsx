import { Cable, Cpu, Globe, HardDrive, MemoryStick } from 'lucide-react';

export interface PricingItem {
  name: string;
  unit: string;
  price: number;
  description?: string;
  icon?: React.ReactNode;
}

export interface Region {
  id: string;
  name: string;
  code: string;
  compute: PricingItem[];
  network: PricingItem[];
}

export const pricingData: Region[] = [
  {
    id: 'usw',
    name: 'US West',
    code: 'USW',
    compute: [
      {
        name: 'CPU',
        unit: 'Core',
        price: 0.010417,
        description: 'High-performance compute cores',
        icon: <Cpu size="100%" />,
      },
      {
        name: 'Memory',
        unit: 'GB',
        price: 0.005208,
        description: 'Fast RAM for your applications',
        icon: <MemoryStick size="100%" />,
      },
      {
        name: 'Storage',
        unit: 'GB',
        price: 0.000347,
        description: 'Optimized persistent storage',
        icon: <HardDrive size="100%" />,
      },
      {
        name: 'Port',
        unit: 'Port',
        price: 0.006944,
        description: 'Network port',
        icon: <Cable size="100%" />,
      },
    ],
    network: [
      {
        name: 'Network',
        unit: 'M',
        price: 0.000098,
        description: 'Data transfer charges',
        icon: <Globe size="100%" />,
      },
    ],
  },
];

export type PricingPeriod = 'hourly' | 'daily';

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(6)}`;
};

export const calculatePrice = (
  hourlyPrice: number,
  period: PricingPeriod,
): number => {
  return period === 'daily' ? hourlyPrice * 24 : hourlyPrice;
};

export const getPeriodLabel = (period: PricingPeriod): string => {
  return period === 'daily' ? 'Daily' : 'Hourly';
};
