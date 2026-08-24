export type RailwayPlanId = 'hobby' | 'pro';
export type RailwayPlanSelection = RailwayPlanId | 'auto';

export interface RailwayPlanLimits {
  maxCpuVcpu: number;
  maxRamGb: number;
  maxVolumeGb: number;
}

export interface RailwayPlan {
  id: RailwayPlanId;
  name: string;
  monthlySubscription: number;
  includedUsage: number;
  limits: RailwayPlanLimits;
  sourceUrl: string;
}

const RAILWAY_PLANS_SOURCE_URL = 'https://docs.railway.com/pricing/plans';

export const RAILWAY_PLANS: Record<RailwayPlanId, RailwayPlan> = {
  hobby: {
    id: 'hobby',
    name: 'Hobby',
    monthlySubscription: 5,
    includedUsage: 5,
    limits: {
      maxCpuVcpu: 48,
      maxRamGb: 48,
      maxVolumeGb: 5,
    },
    sourceUrl: RAILWAY_PLANS_SOURCE_URL,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthlySubscription: 20,
    includedUsage: 20,
    limits: {
      maxCpuVcpu: 1000,
      maxRamGb: 1024,
      maxVolumeGb: 1024,
    },
    sourceUrl: RAILWAY_PLANS_SOURCE_URL,
  },
};

export const RAILWAY_RATE_CARD = {
  plans: RAILWAY_PLANS,
  hobbyMonthlySubscription: RAILWAY_PLANS.hobby.monthlySubscription,
  hobbyIncludedUsage: RAILWAY_PLANS.hobby.includedUsage,
  proMonthlySubscription: RAILWAY_PLANS.pro.monthlySubscription,
  proIncludedUsage: RAILWAY_PLANS.pro.includedUsage,
  cpuPerVcpuMonth: 20,
  ramPerGbMonth: 10,
  volumePerGbMonth: 0.15,
  egressPerGb: 0.05,
  sourceUrl: RAILWAY_PLANS_SOURCE_URL,
  volumeSourceUrl: 'https://docs.railway.com/volumes/reference',
  faqUrl: 'https://docs.railway.com/pricing/faqs',
  costControlUrl: 'https://docs.railway.com/pricing/cost-control',
  deploymentSourceUrl: 'https://docs.railway.com/guides',
  verifiedAt: '2026-08-21',
} as const;

export const DEFAULT_RAILWAY_UTILIZATION = 50;

export interface RailwayCostInput {
  averageVcpu: number;
  averageRamGb: number;
  volumeGb: number;
  egressGb: number;
}

export type RailwayResourceKey = 'averageVcpu' | 'averageRamGb' | 'volumeGb';

export interface RailwayResourceFailure {
  resource: RailwayResourceKey;
  value: number;
  limit: number;
}

export interface RailwayResourceEligibility {
  eligible: boolean;
  failures: RailwayResourceFailure[];
}

export type RailwayValidationStatus = 'valid' | 'requires-plan' | 'unsupported';

export interface RailwayValidationResult {
  valid: boolean;
  status: RailwayValidationStatus;
  message: string;
  requiredPlan: RailwayPlanId | null;
}

export interface RailwayCostEstimate {
  selectedPlan: RailwayPlanId;
  requiredPlan: RailwayPlanId | null;
  planMinimum: number;
  planIncludedUsage: number;
  resourceEligibility: RailwayResourceEligibility;
  validationResult: RailwayValidationResult;
  cpu: number;
  ram: number;
  volume: number;
  egress: number;
  usageSubtotal: number;
  billedTotal: number;
  total: number;
  minimumApplied: boolean;
}

const railwayPlanOrder: RailwayPlanId[] = ['hobby', 'pro'];

const clampToZero = (value: number) => Math.max(0, value);

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

const getResourceEligibility = (
  input: RailwayCostInput,
  plan: RailwayPlan,
): RailwayResourceEligibility => {
  const checks: Array<[RailwayResourceKey, number, number]> = [
    ['averageVcpu', clampToZero(input.averageVcpu), plan.limits.maxCpuVcpu],
    ['averageRamGb', clampToZero(input.averageRamGb), plan.limits.maxRamGb],
    ['volumeGb', clampToZero(input.volumeGb), plan.limits.maxVolumeGb],
  ];
  const failures = checks.reduce<RailwayResourceFailure[]>(
    (result, [resource, value, limit]) => {
      if (value > limit) result.push({ resource, value, limit });
      return result;
    },
    [],
  );

  return { eligible: failures.length === 0, failures };
};

const findEligiblePlan = (
  input: RailwayCostInput,
  startAfter: RailwayPlanId,
): RailwayPlanId | null => {
  const startIndex = railwayPlanOrder.indexOf(startAfter) + 1;
  return (
    railwayPlanOrder
      .slice(startIndex)
      .find(
        (planId) =>
          getResourceEligibility(input, RAILWAY_PLANS[planId]).eligible,
      ) ?? null
  );
};

const resourceLabels: Record<RailwayResourceKey, string> = {
  averageVcpu: 'average CPU',
  averageRamGb: 'average RAM',
  volumeGb: 'volume',
};

const formatResourceLimit = (resource: RailwayResourceKey, limit: number) =>
  `${limit} ${resource === 'averageVcpu' ? 'vCPU' : 'GB'}`;

const resolvePlan = (
  input: RailwayCostInput,
  selection: RailwayPlanSelection,
) => {
  const hobbyEligibility = getResourceEligibility(input, RAILWAY_PLANS.hobby);
  const selectedPlanId =
    selection === 'auto'
      ? hobbyEligibility.eligible
        ? 'hobby'
        : 'pro'
      : selection;
  const selectedPlan = RAILWAY_PLANS[selectedPlanId];
  const resourceEligibility = getResourceEligibility(input, selectedPlan);
  const requiredPlanFailures =
    selectedPlanId === 'hobby'
      ? resourceEligibility.failures
      : hobbyEligibility.failures;
  const requirementPlanName =
    selectedPlanId === 'hobby' ? selectedPlan.name : RAILWAY_PLANS.hobby.name;
  const requiredPlan = resourceEligibility.eligible
    ? selection === 'auto' && selectedPlanId !== 'hobby'
      ? selectedPlanId
      : null
    : findEligiblePlan(input, selectedPlanId);
  const requirementReason = requiredPlanFailures.length
    ? `because Railway ${requirementPlanName}'s ${requiredPlanFailures
        .map(
          ({ resource, limit }) =>
            `${resourceLabels[resource]} limit is ${formatResourceLimit(resource, limit)}`,
        )
        .join(' and ')}`
    : 'for this workload';

  let status: RailwayValidationStatus = 'valid';
  let message = `Railway ${selectedPlan.name} supports this workload.`;
  if (!resourceEligibility.eligible) {
    status = requiredPlan ? 'requires-plan' : 'unsupported';
    message = requiredPlan
      ? `Railway ${RAILWAY_PLANS[requiredPlan].name} is required ${requirementReason}.`
      : `This workload exceeds Railway ${selectedPlan.name} resource limits.`;
  } else if (requiredPlan) {
    message = `Railway ${selectedPlan.name} is required ${requirementReason}.`;
  }

  return {
    selectedPlan,
    requiredPlan,
    resourceEligibility,
    validationResult: {
      valid: resourceEligibility.eligible,
      status,
      message,
      requiredPlan,
    },
  };
};

export const estimateRailwayMonthlyCost = (
  input: RailwayCostInput,
  selection: RailwayPlanSelection = 'auto',
): RailwayCostEstimate => {
  const { selectedPlan, requiredPlan, resourceEligibility, validationResult } =
    resolvePlan(input, selection);
  const cpu =
    clampToZero(input.averageVcpu) * RAILWAY_RATE_CARD.cpuPerVcpuMonth;
  const ram = clampToZero(input.averageRamGb) * RAILWAY_RATE_CARD.ramPerGbMonth;
  const volume =
    clampToZero(input.volumeGb) * RAILWAY_RATE_CARD.volumePerGbMonth;
  const egress = clampToZero(input.egressGb) * RAILWAY_RATE_CARD.egressPerGb;
  const usageSubtotal = roundCurrency(cpu + ram + volume + egress);
  const billedTotal = roundCurrency(
    Math.max(selectedPlan.monthlySubscription, usageSubtotal),
  );

  return {
    selectedPlan: selectedPlan.id,
    requiredPlan,
    planMinimum: selectedPlan.monthlySubscription,
    planIncludedUsage: selectedPlan.includedUsage,
    resourceEligibility,
    validationResult,
    cpu: roundCurrency(cpu),
    ram: roundCurrency(ram),
    volume: roundCurrency(volume),
    egress: roundCurrency(egress),
    usageSubtotal,
    billedTotal,
    total: billedTotal,
    minimumApplied: usageSubtotal < selectedPlan.monthlySubscription,
  };
};

export const calculateBreakEvenUtilization = ({
  sealosMonthlyPrice,
  cpu,
  ram,
  volume,
  egress,
  railwayPlan = 'hobby',
}: {
  sealosMonthlyPrice: number;
  cpu: number;
  ram: number;
  volume: number;
  egress: number;
  railwayPlan?: RailwayPlanId;
}): number | null => {
  const fixedUsageCost =
    clampToZero(volume) * RAILWAY_RATE_CARD.volumePerGbMonth +
    clampToZero(egress) * RAILWAY_RATE_CARD.egressPerGb;
  const fullComputeCost =
    clampToZero(cpu) * RAILWAY_RATE_CARD.cpuPerVcpuMonth +
    clampToZero(ram) * RAILWAY_RATE_CARD.ramPerGbMonth;
  const planMinimum = RAILWAY_PLANS[railwayPlan].monthlySubscription;

  if (fullComputeCost === 0) return null;

  const baselineCost = Math.max(planMinimum, fixedUsageCost);
  if (sealosMonthlyPrice <= baselineCost) return 0;

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
  const higherCost = Math.max(sealosMonthlyPrice, railwayMonthlyEstimate);
  const percentage =
    higherCost === 0 ? 0 : Math.round((amount / higherCost) * 100);

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
