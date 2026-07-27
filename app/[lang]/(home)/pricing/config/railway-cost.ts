export const RAILWAY_RATE_CARD = {
  minimumMonthlySpend: 5,
  cpuPerVcpuMonth: 20,
  ramPerGbMonth: 10,
  volumePerGbMonth: 0.15,
  egressPerGb: 0.05,
  sourceUrl: 'https://docs.railway.com/pricing/plans',
  faqUrl: 'https://docs.railway.com/pricing/faqs',
  costControlUrl: 'https://docs.railway.com/pricing/cost-control',
  verifiedAt: '2026-07-24',
} as const;

export interface RailwayCostInput {
  averageVcpu: number;
  averageRamGb: number;
  volumeGb: number;
  egressGb: number;
}

export interface RailwayCostEstimate {
  cpu: number;
  ram: number;
  volume: number;
  egress: number;
  usageSubtotal: number;
  total: number;
  minimumApplied: boolean;
}

const clampToZero = (value: number) => Math.max(0, value);

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

export const estimateRailwayMonthlyCost = (
  input: RailwayCostInput,
): RailwayCostEstimate => {
  const cpu =
    clampToZero(input.averageVcpu) * RAILWAY_RATE_CARD.cpuPerVcpuMonth;
  const ram = clampToZero(input.averageRamGb) * RAILWAY_RATE_CARD.ramPerGbMonth;
  const volume =
    clampToZero(input.volumeGb) * RAILWAY_RATE_CARD.volumePerGbMonth;
  const egress = clampToZero(input.egressGb) * RAILWAY_RATE_CARD.egressPerGb;
  const usageSubtotal = cpu + ram + volume + egress;
  const total = Math.max(RAILWAY_RATE_CARD.minimumMonthlySpend, usageSubtotal);

  return {
    cpu: roundCurrency(cpu),
    ram: roundCurrency(ram),
    volume: roundCurrency(volume),
    egress: roundCurrency(egress),
    usageSubtotal: roundCurrency(usageSubtotal),
    total: roundCurrency(total),
    minimumApplied: usageSubtotal < RAILWAY_RATE_CARD.minimumMonthlySpend,
  };
};

export const calculateBreakEvenUtilization = ({
  sealosMonthlyPrice,
  cpu,
  ram,
  volume,
  egress,
}: {
  sealosMonthlyPrice: number;
  cpu: number;
  ram: number;
  volume: number;
  egress: number;
}): number | null => {
  const fixedUsageCost =
    clampToZero(volume) * RAILWAY_RATE_CARD.volumePerGbMonth +
    clampToZero(egress) * RAILWAY_RATE_CARD.egressPerGb;
  const fullComputeCost =
    clampToZero(cpu) * RAILWAY_RATE_CARD.cpuPerVcpuMonth +
    clampToZero(ram) * RAILWAY_RATE_CARD.ramPerGbMonth;

  if (fullComputeCost === 0) return null;

  return Math.max(
    0,
    Math.min(
      100,
      ((sealosMonthlyPrice - fixedUsageCost) / fullComputeCost) * 100,
    ),
  );
};

export const calculateCostDifference = (
  sealosMonthlyPrice: number,
  railwayMonthlyEstimate: number,
) => {
  const amount = roundCurrency(
    Math.abs(railwayMonthlyEstimate - sealosMonthlyPrice),
  );
  const percentage =
    railwayMonthlyEstimate === 0
      ? 0
      : Math.round((amount / railwayMonthlyEstimate) * 100);

  return {
    amount,
    percentage,
    lowerCost:
      railwayMonthlyEstimate === sealosMonthlyPrice
        ? ('equal' as const)
        : railwayMonthlyEstimate > sealosMonthlyPrice
          ? ('sealos' as const)
          : ('railway' as const),
  };
};

export const formatUsd = (value: number): string => {
  const rounded = roundCurrency(value);
  return `$${rounded.toLocaleString('en-US', {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
};
