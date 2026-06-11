import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatGateSummary,
  getDockerGate,
  getDockerSmokePlan,
  runDockerSmoke,
} from './smoke-docker-nginx.js';

test('Docker smoke gate is closed by default with skip rationale', () => {
  const gate = getDockerGate({});

  assert.equal(gate.isOpen, false);
  assert.equal(gate.status, 'SKIPPED_WITH_CAVEAT');
  assert.match(gate.reason, /PHASE9_RUN_DOCKER_SMOKE/);
  assert.match(formatGateSummary(gate), /closed/);
});

test('Docker smoke reports blocked when CLI or daemon is unavailable', () => {
  const result = runDockerSmoke({
    env: { PHASE9_RUN_DOCKER_SMOKE: '1' },
    commandRunner: () => ({ status: 127, stdout: '', stderr: 'missing docker' }),
  });

  assert.equal(result.status, 'BLOCKED');
  assert.match(result.reason, /Docker CLI/);
});

test('Docker smoke plan uses disposable image, container, probes, and cleanup', () => {
  const plan = getDockerSmokePlan({ runId: 'test123' });
  const commands = plan.commands.map((command) =>
    [command.command, ...command.args].join(' '),
  );
  const commandText = commands.join('\n');

  assert.match(plan.imageName, /phase9-sealos-nginx-test123/);
  assert.match(plan.containerName, /phase9-sealos-nginx-test123/);
  assert(commands.some((command) => command.includes('docker build')));
  for (const token of [
    'node:20-bookworm-slim',
    'libcairo2-dev',
    'libjpeg62-turbo-dev',
    'libpango1.0-dev',
    'libgif-dev',
    'librsvg2-dev',
    'libfreetype6-dev',
    'libharfbuzz-dev',
    'libfribidi-dev',
    'fontconfig',
    'npm ci && npm run build',
    '/app/out',
    '/usr/share/nginx/html',
  ]) {
    assert.match(commandText, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert(commands.some((command) => command.includes('native-rendering:check')));
  assert(commands.some((command) => command.includes('native-rendering:benchmark')));
  assert(plan.probes.some((probe) => probe.path === '/'));
  assert(plan.probes.some((probe) => probe.path === '/mtc.js'));
  assert(plan.probes.some((probe) => probe.path === '/robots.txt'));
  assert(plan.cleanup.some((command) => command.args.includes(plan.containerName)));
  assert(plan.cleanup.some((command) => command.args.includes(plan.imageName)));
});

test('Docker smoke runs generated diff guards around Docker work', () => {
  const seen = [];
  const result = runDockerSmoke({
    env: { PHASE9_RUN_DOCKER_SMOKE: '1' },
    commandRunner: (command, args) => {
      seen.push([command, args]);
      return { status: 0, stdout: 'ok', stderr: '' };
    },
    runId: 'stub',
  });

  assert.equal(result.status, 'PASS');
  assert.equal(seen[0][0], 'docker');
  assert.deepEqual(seen[1], ['npm', ['run', 'app-store:diff']]);
  assert.ok(
    seen.some(
      ([command, args]) =>
        command === 'npm' && args.join(' ') === 'run native-rendering:check',
    ),
  );
  assert.ok(
    seen.some(
      ([command, args]) =>
        command === 'npm' && args.join(' ') === 'run native-rendering:benchmark',
    ),
  );
  assert.deepEqual(seen.at(-3), ['npm', ['run', 'app-store:diff']]);
});
