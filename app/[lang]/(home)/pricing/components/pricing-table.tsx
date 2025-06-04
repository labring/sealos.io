'use client';

import { useState } from 'react';
import { Cpu, MemoryStick, HardDrive, Cable, Globe } from 'lucide-react';
import {
  formatPrice,
  calculatePrice,
  getPeriodLabel,
  PricingPeriod,
} from '@/config/pricing';

interface PricingItem {
  name: string;
  unit: string;
  price: number;
  description?: string;
  icon?: string;
}

interface Region {
  id: string;
  name: string;
  code: string;
  compute: PricingItem[];
  network: PricingItem[];
}

const getIconComponent = (iconName: string) => {
  const iconMap = {
    Cpu: Cpu,
    MemoryStick: MemoryStick,
    HardDrive: HardDrive,
    Cable: Cable,
    Globe: Globe,
  };
  const IconComponent = iconMap[iconName as keyof typeof iconMap];
  return IconComponent ? (
    <IconComponent className="h-5 w-5 text-slate-600" />
  ) : null;
};

export function PricingTable({ region }: { region: Region }) {
  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('hourly');

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Table Header with Region Dropdown and Period Toggle */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 px-8 py-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Resource Pricing
          </h2>
          <div className="flex items-center space-x-4">
            {/* Period Toggle */}
            <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
              <button
                onClick={() => setPricingPeriod('hourly')}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  pricingPeriod === 'hourly'
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Hourly
              </button>
              <button
                onClick={() => setPricingPeriod('daily')}
                className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                  pricingPeriod === 'daily'
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Daily
              </button>
            </div>

            {/* Region Dropdown */}
            <div className="relative">
              <select className="appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2 pr-8 text-sm font-medium text-slate-700 hover:border-blue-500 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="usw">US West (USW)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg
                  className="h-4 w-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-4 text-left text-sm font-semibold tracking-wider text-slate-900 uppercase">
                  Resource
                </th>
                <th className="w-32 px-6 py-4 text-left text-sm font-semibold tracking-wider text-slate-900 uppercase">
                  Unit
                </th>
                <th className="w-40 px-6 py-4 text-right text-sm font-semibold tracking-wider text-slate-900 uppercase">
                  Price <br />({getPeriodLabel(pricingPeriod)})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* Compute Resources Section */}
              <tr className="bg-blue-50">
                <td
                  colSpan={3}
                  className="bg-blue-100 px-8 py-3 text-sm font-semibold text-blue-900"
                >
                  Compute Resources
                </td>
              </tr>
              {region.compute.map((item, index) => (
                <tr
                  key={index}
                  className="transition-colors duration-150 hover:bg-slate-50"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {getIconComponent(item.icon || '')}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="w-32 px-6 py-4 text-sm text-slate-600">
                    {item.unit}
                  </td>
                  <td className="w-40 px-6 py-4 text-right">
                    <span className="text-lg font-bold text-blue-600">
                      {formatPrice(calculatePrice(item.price, pricingPeriod))}
                    </span>
                  </td>
                </tr>
              ))}

              {/* Network Resources Section */}
              <tr className="bg-green-50">
                <td
                  colSpan={3}
                  className="bg-green-100 px-8 py-3 text-sm font-semibold text-green-900"
                >
                  Network Resources
                </td>
              </tr>
              {region.network.map((item, index) => (
                <tr
                  key={`network-${index}`}
                  className="transition-colors duration-150 hover:bg-slate-50"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">
                        {getIconComponent(item.icon || '')}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="w-32 px-6 py-4 text-sm text-slate-600">
                    {item.unit}
                  </td>
                  <td className="w-40 px-6 py-4 text-right">
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(calculatePrice(item.price, pricingPeriod))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-8 py-4">
          <p className="text-center text-xs text-slate-500">
            All prices are in USD. Prices are for reference and the latest
            pricing is available in Cost Center module.
          </p>
        </div>
      </div>
    </div>
  );
}
