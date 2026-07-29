const assert = require('node:assert/strict');
const test = require('node:test');

const {
  DEFAULT_RAILWAY_UTILIZATION,
  RAILWAY_RATE_CARD,
  calculateBreakEvenUtilization,
  calculateCostDifference,
  estimateRailwayMonthlyCost,
} = require('../app/[lang]/(home)/pricing/config/railway-cost.ts');

const estimatePlan = ({ cpu, ram, disk, traffic }, utilization) =>
  estimateRailwayMonthlyCost({
    averageVcpu: cpu * utilization,
    averageRamGb: ram * utilization,
    volumeGb: disk,
    egressGb: traffic,
  }).total;

test('uses the verified Railway rate card', () => {
  assert.deepEqual(
    {
      hobbySubscription: RAILWAY_RATE_CARD.hobbyMonthlySubscription,
      hobbyIncludedUsage: RAILWAY_RATE_CARD.hobbyIncludedUsage,
      cpu: RAILWAY_RATE_CARD.cpuPerVcpuMonth,
      ram: RAILWAY_RATE_CARD.ramPerGbMonth,
      volume: RAILWAY_RATE_CARD.volumePerGbMonth,
      egress: RAILWAY_RATE_CARD.egressPerGb,
    },
    {
      hobbySubscription: 5,
      hobbyIncludedUsage: 5,
      cpu: 20,
      ram: 10,
      volume: 0.15,
      egress: 0.05,
    },
  );
  assert.equal(DEFAULT_RAILWAY_UTILIZATION, 50);
});

test('estimates Starter at 10%, 25%, 50%, and 100% utilization', () => {
  const starter = { cpu: 2, ram: 2, disk: 10, traffic: 10 };
  assert.deepEqual(
    [0.1, 0.25, 0.5, 1].map((utilization) =>
      estimatePlan(starter, utilization),
    ),
    [8, 17, 32, 62],
  );
});

test('estimates Hobby at 10%, 25%, 50%, and 100% utilization', () => {
  const hobby = { cpu: 4, ram: 4, disk: 20, traffic: 50 };
  assert.deepEqual(
    [0.1, 0.25, 0.5, 1].map((utilization) => estimatePlan(hobby, utilization)),
    [17.5, 35.5, 65.5, 125.5],
  );
});

test('applies the Railway Hobby subscription minimum', () => {
  const estimate = estimateRailwayMonthlyCost({
    averageVcpu: 0,
    averageRamGb: 0,
    volumeGb: 0,
    egressGb: 0,
  });
  assert.equal(estimate.total, 5);
  assert.equal(estimate.minimumApplied, true);
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
    })?.toFixed(1),
    '16.3',
  );
});
