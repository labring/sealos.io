import test from 'node:test';
import assert from 'node:assert/strict';
import {
  collectEnvironmentContext,
  getLocalNextCommand,
  getStagesForMode,
  parseArgs,
  runMeasuredStage,
  runPipeline,
} from './measure-build-pipeline.js';

test('collectEnvironmentContext records runtime and locked dependency versions', () => {
  const context = collectEnvironmentContext({
    execFile: () => '10.9.0\n',
  });

  assert.match(context.node, /^v\d+\./);
  assert.equal(context.npm, '10.9.0');
  assert.equal(context.nvmrc, '20');
  assert.equal(context.lockfileVersion, 3);

  for (const name of [
    'next',
    '@next/bundle-analyzer',
    '@next/mdx',
    'fumadocs-mdx',
    'fumadocs-ui',
    'typescript',
  ]) {
    assert.ok(Object.hasOwn(context.dependencyVersions, name), name);
  }
});

test('refresh mode stages generated guards around explicit refresh', () => {
  const stages = getStagesForMode('refresh', ['--json-summary']);

  assert.deepEqual(
    stages.map((stage) => stage.name),
    [
      'pre generated diff guard',
      'explicit App Store refresh',
      'post generated diff guard',
    ],
  );
  assert.deepEqual(stages[1].args, [
    'run',
    'app-store:refresh',
    '--',
    '--json-summary',
  ]);
  assert.deepEqual(stages[2].args, [
    'run',
    'app-store:diff',
    '--',
    '--allow-changes',
  ]);
});

test('build mode separates Next build from root locale normalization', () => {
  const stages = getStagesForMode('build');

  assert.deepEqual(
    stages.map((stage) => stage.name),
    [
      'pre generated diff guard',
      'Next production build',
      'root locale normalization',
      'post generated diff guard',
    ],
  );
  assert.equal(stages[1].command, getLocalNextCommand());
  assert.deepEqual(stages[1].args, ['build']);
  assert.deepEqual(stages[2].args, ['scripts/normalize-root-locale.js']);
});

test('analyze mode scopes ANALYZE=true to the Next build stage', () => {
  const stages = getStagesForMode('analyze');

  assert.deepEqual(
    stages.map((stage) => stage.name),
    [
      'pre generated diff guard',
      'Next analyzer build',
      'root locale normalization',
      'post generated diff guard',
    ],
  );
  assert.equal(stages[1].env.ANALYZE, 'true');
  assert.equal(stages[2].env, undefined);
});

test('runMeasuredStage reports nonzero status and duration', () => {
  const result = runMeasuredStage(
    {
      name: 'failing stage',
      command: 'node',
      args: ['-e', 'process.exit(7)'],
    },
    {
      spawn: () => ({
        status: 7,
      }),
    },
  );

  assert.equal(result.status, 7);
  assert.equal(result.name, 'failing stage');
  assert.equal(typeof result.durationMs, 'number');
});

test('runPipeline stops after failed stage and returns completed timings', () => {
  const seen = [];
  const result = runPipeline(
    {
      mode: 'build',
    },
    {
      execFile: () => '10.9.0\n',
      spawn: (command, args) => {
        seen.push([command, args]);
        return {
          status: seen.length === 2 ? 2 : 0,
        };
      },
    },
  );

  assert.equal(result.exitCode, 2);
  assert.equal(result.results.length, 2);
  assert.deepEqual(seen[0], ['npm', ['run', 'app-store:diff']]);
  assert.deepEqual(seen[1], [getLocalNextCommand(), ['build']]);
});

test('parseArgs defaults to build mode and passes extra refresh args through', () => {
  assert.equal(parseArgs([]).mode, 'build');
  assert.deepEqual(parseArgs(['--mode=refresh', '--json-summary']), {
    mode: 'refresh',
    passthrough: ['--json-summary'],
  });
  assert.throws(() => parseArgs(['--mode=deploy']), /unsupported mode/);
});
