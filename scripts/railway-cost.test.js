const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');

const sourcePath = resolve(
  __dirname,
  '../app/[lang]/(home)/pricing/config/railway-cost.ts',
);
const compiledSource = ts.transpileModule(readFileSync(sourcePath, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
const railwayCost = {};
vm.compileFunction(compiledSource, ['exports'], { filename: sourcePath })(
  railwayCost,
);

const {
  DEFAULT_RAILWAY_UTILIZATION,
  RAILWAY_RATE_CARD,
  calculateBreakEvenUtilization,
  calculateCostDifference,
  estimateRailwayMonthlyCost,
} = railwayCost;

const estimatePlan = ({ cpu, ram, disk, traffic }, utilization) =>
  estimateRailwayMonthlyCost({
    averageVcpu: cpu * utilization,
    averageRamGb: ram * utilization,
    volumeGb: disk,
    egressGb: traffic,
  }).total;

test('uses the verified Railway rate card', () => {
  assert.equal(RAILWAY_RATE_CARD.verifiedAt, '2026-08-21');
  assert.deepEqual(
    {
      hobbySubscription: RAILWAY_RATE_CARD.hobbyMonthlySubscription,
      hobbyIncludedUsage: RAILWAY_RATE_CARD.hobbyIncludedUsage,
      proSubscription: RAILWAY_RATE_CARD.proMonthlySubscription,
      proIncludedUsage: RAILWAY_RATE_CARD.proIncludedUsage,
      cpu: RAILWAY_RATE_CARD.cpuPerVcpuMonth,
      ram: RAILWAY_RATE_CARD.ramPerGbMonth,
      volume: RAILWAY_RATE_CARD.volumePerGbMonth,
      egress: RAILWAY_RATE_CARD.egressPerGb,
    },
    {
      hobbySubscription: 5,
      hobbyIncludedUsage: 5,
      proSubscription: 20,
      proIncludedUsage: 20,
      cpu: 20,
      ram: 10,
      volume: 0.15,
      egress: 0.05,
    },
  );
  assert.deepEqual(RAILWAY_RATE_CARD.plans.hobby.limits, {
    maxCpuVcpu: 48,
    maxRamGb: 48,
    maxVolumeGb: 5,
  });
  assert.deepEqual(RAILWAY_RATE_CARD.plans.pro.limits, {
    maxCpuVcpu: 1000,
    maxRamGb: 1024,
    maxVolumeGb: 1024,
  });
  assert.equal(
    RAILWAY_RATE_CARD.plans.hobby.sourceUrl,
    'https://docs.railway.com/pricing/plans',
  );
  assert.equal(
    RAILWAY_RATE_CARD.plans.pro.sourceUrl,
    'https://docs.railway.com/pricing/plans',
  );
  assert.equal(
    RAILWAY_RATE_CARD.deploymentSourceUrl,
    'https://docs.railway.com/guides',
  );
  assert.equal(DEFAULT_RAILWAY_UTILIZATION, 50);
});

test('estimates Starter at 10%, 25%, 50%, and 100% utilization', () => {
  const starter = { cpu: 2, ram: 2, disk: 10, traffic: 10 };
  assert.deepEqual(
    [0.1, 0.25, 0.5, 1].map((utilization) =>
      estimatePlan(starter, utilization),
    ),
    [20, 20, 32, 62],
  );
});

test('estimates Hobby at 10%, 25%, 50%, and 100% utilization', () => {
  const hobby = { cpu: 4, ram: 4, disk: 20, traffic: 50 };
  assert.deepEqual(
    [0.1, 0.25, 0.5, 1].map((utilization) => estimatePlan(hobby, utilization)),
    [20, 35.5, 65.5, 125.5],
  );
});

test('applies the Railway Hobby and Pro subscription minimums', () => {
  const hobbyEstimate = estimateRailwayMonthlyCost(
    {
      averageVcpu: 0,
      averageRamGb: 0,
      volumeGb: 0,
      egressGb: 0,
    },
    'hobby',
  );
  assert.equal(hobbyEstimate.selectedPlan, 'hobby');
  assert.equal(hobbyEstimate.planMinimum, 5);
  assert.equal(hobbyEstimate.planIncludedUsage, 5);
  assert.equal(hobbyEstimate.billedTotal, 5);
  assert.equal(hobbyEstimate.minimumApplied, true);

  const proEstimate = estimateRailwayMonthlyCost(
    {
      averageVcpu: 0,
      averageRamGb: 0,
      volumeGb: 0,
      egressGb: 0,
    },
    'pro',
  );
  assert.equal(proEstimate.selectedPlan, 'pro');
  assert.equal(proEstimate.planMinimum, 20);
  assert.equal(proEstimate.planIncludedUsage, 20);
  assert.equal(proEstimate.billedTotal, 20);
  assert.equal(proEstimate.minimumApplied, true);
});

test('requires Railway Pro when Hobby cannot hold the workload', () => {
  const input = {
    averageVcpu: 0,
    averageRamGb: 0,
    volumeGb: 50,
    egressGb: 0,
  };
  const hobbyEstimate = estimateRailwayMonthlyCost(input, 'hobby');
  assert.equal(hobbyEstimate.selectedPlan, 'hobby');
  assert.equal(hobbyEstimate.resourceEligibility.eligible, false);
  assert.deepEqual(hobbyEstimate.resourceEligibility.failures, [
    { resource: 'volumeGb', value: 50, limit: 5 },
  ]);
  assert.equal(hobbyEstimate.requiredPlan, 'pro');
  assert.equal(hobbyEstimate.validationResult.status, 'requires-plan');
  assert.equal(hobbyEstimate.validationResult.valid, false);
  assert.equal(
    hobbyEstimate.validationResult.message,
    "Railway Pro is required because Railway Hobby's volume limit is 5 GB.",
  );

  const automaticEstimate = estimateRailwayMonthlyCost(input);
  assert.equal(automaticEstimate.selectedPlan, 'pro');
  assert.equal(automaticEstimate.requiredPlan, 'pro');
  assert.equal(automaticEstimate.resourceEligibility.eligible, true);
  assert.equal(automaticEstimate.validationResult.valid, true);
  assert.equal(
    automaticEstimate.validationResult.message,
    "Railway Pro is required because Railway Hobby's volume limit is 5 GB.",
  );
});

test('validates CPU and memory limits for each plan', () => {
  const hobbyEstimate = estimateRailwayMonthlyCost(
    {
      averageVcpu: 49,
      averageRamGb: 49,
      volumeGb: 0,
      egressGb: 0,
    },
    'hobby',
  );
  assert.deepEqual(hobbyEstimate.resourceEligibility.failures, [
    { resource: 'averageVcpu', value: 49, limit: 48 },
    { resource: 'averageRamGb', value: 49, limit: 48 },
  ]);
  assert.equal(hobbyEstimate.requiredPlan, 'pro');

  const proEstimate = estimateRailwayMonthlyCost(
    {
      averageVcpu: 1001,
      averageRamGb: 1025,
      volumeGb: 0,
      egressGb: 0,
    },
    'pro',
  );
  assert.equal(proEstimate.validationResult.status, 'unsupported');
  assert.equal(proEstimate.validationResult.valid, false);
});

test('estimates the Standard comparison profile on Railway Pro', () => {
  const estimate = estimateRailwayMonthlyCost({
    averageVcpu: 4,
    averageRamGb: 8,
    volumeGb: 50,
    egressGb: 300,
  });

  assert.deepEqual(
    {
      selectedPlan: estimate.selectedPlan,
      planMinimum: estimate.planMinimum,
      cpu: estimate.cpu,
      ram: estimate.ram,
      volume: estimate.volume,
      egress: estimate.egress,
      usageSubtotal: estimate.usageSubtotal,
      billedTotal: estimate.billedTotal,
      total: estimate.total,
      valid: estimate.validationResult.valid,
    },
    {
      selectedPlan: 'pro',
      planMinimum: 20,
      cpu: 80,
      ram: 80,
      volume: 7.5,
      egress: 15,
      usageSubtotal: 182.5,
      billedTotal: 182.5,
      total: 182.5,
      valid: true,
    },
  );
});

test('reports either platform as the lower-cost result', () => {
  assert.deepEqual(calculateCostDifference(25, 35.5), {
    amount: 10.5,
    percentage: 30,
    lowerCost: 'sealos',
  });
  assert.deepEqual(calculateCostDifference(25, 17.5), {
    amount: 7.5,
    percentage: 30,
    lowerCost: 'railway',
  });
  assert.deepEqual(calculateCostDifference(25, 25), {
    amount: 0,
    percentage: 0,
    lowerCost: 'equal',
  });
});

test('calculates the Starter and Hobby cost crossover points', () => {
  assert.equal(
    calculateBreakEvenUtilization({
      sealosMonthlyPrice: 7,
      cpu: 2,
      ram: 2,
      volume: 10,
      egress: 10,
    })?.toFixed(1),
    '8.3',
  );
  assert.equal(
    calculateBreakEvenUtilization({
      sealosMonthlyPrice: 25,
      cpu: 4,
      ram: 4,
      volume: 20,
      egress: 50,
    })?.toFixed(2),
    '16.25',
  );
  assert.equal(
    calculateBreakEvenUtilization({
      sealosMonthlyPrice: 10,
      cpu: 4,
      ram: 4,
      volume: 20,
      egress: 50,
      railwayPlan: 'pro',
    }),
    0,
  );
});
