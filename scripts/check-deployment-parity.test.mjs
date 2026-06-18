import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  getLockedValidationStages,
  parseGateState,
  runCli,
  validateChecklistTokens,
  validateDeploymentSources,
  validatePackageScripts,
} from './check-deployment-parity.js';

const DEPLOYMENT_DOC = `
# Deployment Parity

| Target | install command | build command | Node/runtime | environment source | artifact | static output location | serving layer | redirects | headers | cache policy | route support | native dependency assumptions | credentials/secrets touched | safe validation command |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Vercel production | npm install | npm run app-store:diff; vercel build --prod --local-config ./vercel.json | Node 20 | Vercel secrets | prebuilt Vercel output | Vercel output | Vercel hosting | vercel.json | vercel.json | Cache-Control | App Router prebuilt | Vercel native runtime | VERCEL_TOKEN | npm run deployment:check |
| Vercel preview | npm install | npm run app-store:diff; vercel build --local-config ./vercel.json | Node 20 | Vercel preview secrets | preview output | Vercel output | Vercel preview | vercel.json | vercel.json | Cache-Control | preview routes | Vercel native runtime | VERCEL_ORG_ID | npm run deployment:check |
| Cloudflare Pages production | npm ci | npm run app-store:diff; npm run build | Node 20 | Cloudflare secrets | ./out | ./out | Cloudflare Pages | public/_redirects | public/_headers | immutable | static export | no Docker native runtime | CLOUDFLARE_API_TOKEN | npm run static-output:check |
| Cloudflare Pages preview | npm ci | npm run app-store:diff; npm run build | Node 20 | Cloudflare preview secrets | cloudflare-pages-out | ./out | Cloudflare Pages preview | public/_redirects | public/_headers | immutable | static export | no Docker native runtime | CF_API_TOKEN | npm run static-output:check |
| Docker/Nginx | npm ci | npm ci && npm run build | node:20-bookworm-slim / nginx:1.27-alpine | Docker build args | /app/out | /usr/share/nginx/html | Nginx | static files | Nginx defaults | Nginx defaults | static export files | Cairo Sharp canvas native packages | build args | npm run docker:smoke |
| GHCR/Kubernetes | npm ci; npm run app-store:diff | docker/build-push-action@v5 | linux/amd64 image | GitHub secrets | GHCR image | /usr/share/nginx/html | Kubernetes deployment/sealos-docs | ingress | ingress | cluster CDN | Docker/Nginx static assumptions | KUBE_CONFIG | npm run docker:smoke |

PHASE9_RUN_LOCKED_BUILD
PHASE9_RUN_DOCKER_SMOKE
PHASE9_RUN_HOSTED_PROBES
PHASE9_RUN_BROWSER_TRACE
PHASE9_RUN_NETWORK_REFRESH
PHASE9_RUN_DEPLOY
PHASE9_ACCEPT_GENERATED_CHANGES
`;

test('validateChecklistTokens requires six targets and required dimensions', () => {
  const result = validateChecklistTokens(DEPLOYMENT_DOC);

  assert.deepEqual(result.missingTargets, []);
  assert.deepEqual(result.missingDimensions, []);
});

test('validatePackageScripts requires Phase 9 command wiring', () => {
  const pkg = {
    scripts: {
      'app-store:diff': 'node scripts/check-generated-app-assets.js',
      'build:timed': 'node scripts/measure-build-pipeline.js --mode=build',
      'build:analyze:timed':
        'node scripts/measure-build-pipeline.js --mode=analyze',
      'deployment:check': 'node scripts/check-deployment-parity.js',
      'static-routes:check': 'node scripts/check-static-export-routes.js',
      'static-output:check': 'node scripts/check-static-output.js',
      'docker:smoke': 'node scripts/smoke-docker-nginx.js',
      'validate:deployment':
        'node scripts/check-deployment-parity.js --validate-deployment',
      'deployment:locked-validation':
        'node scripts/check-deployment-parity.js --locked-validation',
      'native-rendering:check': 'node scripts/check-native-rendering-policy.js',
    },
  };

  const result = validatePackageScripts(pkg);

  assert.deepEqual(result.missingScripts, []);
  assert.deepEqual(result.invalidScripts, []);
});

test('validatePackageScripts requires Phase 10 static route policy wiring', () => {
  const pkg = {
    scripts: {
      'app-store:diff': 'node scripts/check-generated-app-assets.js',
      'build:timed': 'node scripts/measure-build-pipeline.js --mode=build',
      'build:analyze:timed':
        'node scripts/measure-build-pipeline.js --mode=analyze',
      'deployment:check': 'node scripts/check-deployment-parity.js',
      'static-routes:check': 'node scripts/check-static-export-routes.js',
      'static-output:check': 'node scripts/check-static-output.js',
      'docker:smoke': 'node scripts/smoke-docker-nginx.js',
      'validate:deployment':
        'node scripts/check-deployment-parity.js --validate-deployment',
      'deployment:locked-validation':
        'node scripts/check-deployment-parity.js --locked-validation',
      'native-rendering:check': 'node scripts/check-native-rendering-policy.js',
    },
  };

  assert.deepEqual(validatePackageScripts(pkg).invalidScripts, []);

  pkg.scripts['static-routes:check'] = 'node scripts/other.js';
  assert.deepEqual(validatePackageScripts(pkg).invalidScripts, [
    {
      name: 'static-routes:check',
      expected: 'node scripts/check-static-export-routes.js',
      actual: 'node scripts/other.js',
    },
  ]);

  pkg.scripts['static-routes:check'] =
    'node scripts/check-static-export-routes.js';
  pkg.scripts['native-rendering:check'] = 'node scripts/other-native.js';
  assert.deepEqual(validatePackageScripts(pkg).invalidScripts, [
    {
      name: 'native-rendering:check',
      expected: 'node scripts/check-native-rendering-policy.js',
      actual: 'node scripts/other-native.js',
    },
  ]);
});

test('parseGateState reports closed unsafe defaults', () => {
  const gates = parseGateState({});
  const byName = Object.fromEntries(gates.map((gate) => [gate.name, gate]));

  for (const name of [
    'PHASE9_RUN_LOCKED_BUILD',
    'PHASE9_RUN_DOCKER_SMOKE',
    'PHASE9_RUN_HOSTED_PROBES',
    'PHASE9_RUN_BROWSER_TRACE',
    'PHASE9_RUN_NETWORK_REFRESH',
    'PHASE9_RUN_DEPLOY',
    'PHASE9_ACCEPT_GENERATED_CHANGES',
  ]) {
    assert.equal(byName[name].isOpen, false);
    assert.equal(byName[name].status, 'CLOSED');
  }
});

test('getLockedValidationStages plans guarded Node 20 build/analyzer stages', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase9-lock-'));

  try {
    await writeFile(join(dir, '.nvmrc'), '20\n');
    await mkdir(join(dir, 'node_modules'));
    const result = getLockedValidationStages({
      cwd: dir,
      env: { PHASE9_RUN_LOCKED_BUILD: '1' },
      nodeVersion: '20.11.1',
    });

    assert.equal(result.gate.isOpen, true);
    assert.equal(result.ready, true);
    assert.deepEqual(
      result.stages.map((stage) => stage.command),
      [
        'npm run app-store:diff',
        'npm run lint',
        'npm run build:timed',
        'npm run app-store:diff',
        'npm run build:analyze:timed',
        'npm run app-store:diff',
      ],
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('--locked-validation runs the ordered locked stages with injected Node 20', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase9-cli-lock-'));
  const commands = [];
  const lines = [];

  try {
    await writeFile(join(dir, '.nvmrc'), '20\n');
    await mkdir(join(dir, 'node_modules'));

    const result = runCli({
      argv: ['--locked-validation'],
      cwd: dir,
      env: { PHASE9_RUN_LOCKED_BUILD: '1' },
      nodeVersion: '20.11.1',
      spawn: (command, args) => {
        commands.push([command, ...args].join(' '));
        return { status: 0 };
      },
      stdout: { write: (line) => lines.push(line) },
      stderr: { write: (line) => lines.push(line) },
    });

    assert.equal(result.exitCode, 0);
    assert.deepEqual(commands, [
      'npm run app-store:diff',
      'npm run lint',
      'npm run build:timed',
      'npm run app-store:diff',
      'npm run build:analyze:timed',
      'npm run app-store:diff',
    ]);
    assert.match(lines.join(''), /runLockedValidationPlan/);
    assert.match(lines.join(''), /PASS/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('--validate-deployment reaches locked validation before static output when gate is open', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase9-cli-validate-'));
  const commands = [];
  const lines = [];

  try {
    await writeFile(join(dir, '.nvmrc'), '20\n');
    await mkdir(join(dir, 'node_modules'));
    await writeDeploymentFixture(dir);

    const result = runCli({
      argv: ['--validate-deployment'],
      cwd: dir,
      env: { PHASE9_RUN_LOCKED_BUILD: '1' },
      nodeVersion: '20.11.1',
      spawn: (command, args) => {
        commands.push([command, ...args].join(' '));
        return { status: 0 };
      },
      stdout: { write: (line) => lines.push(line) },
      stderr: { write: (line) => lines.push(line) },
    });

    assert.equal(result.exitCode, 0);
    assert.deepEqual(commands, [
      'npm run app-store:diff',
      'npm run lint',
      'npm run build:timed',
      'npm run app-store:diff',
      'npm run build:analyze:timed',
      'npm run app-store:diff',
      'npm run native-rendering:check',
      'npm run static-output:check',
      'npm run docker:smoke',
    ]);
    assert.ok(
      commands.indexOf('npm run build:timed') <
        commands.indexOf('npm run static-output:check'),
    );
    assert.match(lines.join(''), /runLockedValidationPlan/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('--validate-deployment preserves default deterministic safe checks', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase9-cli-safe-'));
  const commands = [];
  const lines = [];

  try {
    await writeFile(join(dir, '.nvmrc'), '20\n');
    await writeDeploymentFixture(dir);

    const result = runCli({
      argv: ['--validate-deployment'],
      cwd: dir,
      env: {},
      nodeVersion: '24.13.0',
      spawn: (command, args) => {
        commands.push([command, ...args].join(' '));
        return { status: 0 };
      },
      stdout: { write: (line) => lines.push(line) },
      stderr: { write: (line) => lines.push(line) },
    });

    assert.equal(result.exitCode, 0);
    assert.deepEqual(commands, [
      'npm run app-store:diff',
      'npm run native-rendering:check',
      'npm run static-output:check',
      'npm run docker:smoke',
    ]);
    assert.match(lines.join(''), /deployment parity source check/);
    assert.match(lines.join(''), /SKIPPED_WITH_CAVEAT/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('--validate-deployment blocks from locked runner before static output caveats', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase9-cli-block-'));
  const commands = [];
  const lines = [];

  try {
    await writeFile(join(dir, '.nvmrc'), '20\n');
    await writeDeploymentFixture(dir);

    const result = runCli({
      argv: ['--validate-deployment'],
      cwd: dir,
      env: { PHASE9_RUN_LOCKED_BUILD: '1' },
      nodeVersion: '24.13.0',
      spawn: (command, args) => {
        commands.push([command, ...args].join(' '));
        return { status: 0 };
      },
      stdout: { write: (line) => lines.push(line) },
      stderr: { write: (line) => lines.push(line) },
    });

    assert.equal(result.exitCode, 1);
    assert.deepEqual(commands, []);
    assert.match(lines.join(''), /runLockedValidationPlan/);
    assert.match(lines.join(''), /BLOCKED/);
    assert.doesNotMatch(lines.join(''), /out is absent/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('validateDeploymentSources verifies deployment source facts', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase9-sources-'));

  try {
    await writeDeploymentFixture(dir);

    const result = validateDeploymentSources({ rootDir: dir });

    assert.deepEqual(result.failures, []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

async function writeDeploymentFixture(dir) {
  await mkdir(join(dir, '.github/workflows'), { recursive: true });
  await mkdir(join(dir, 'docs'), { recursive: true });
  await writeFile(join(dir, 'docs/deployment-parity.md'), DEPLOYMENT_DOC);
  await writeFile(
    join(dir, 'package.json'),
    JSON.stringify(
      {
        scripts: {
          'app-store:diff': 'node scripts/check-generated-app-assets.js',
          'build:timed': 'node scripts/measure-build-pipeline.js --mode=build',
          'build:analyze:timed':
            'node scripts/measure-build-pipeline.js --mode=analyze',
          'deployment:check': 'node scripts/check-deployment-parity.js',
          'static-routes:check': 'node scripts/check-static-export-routes.js',
          'static-output:check': 'node scripts/check-static-output.js',
          'docker:smoke': 'node scripts/smoke-docker-nginx.js',
          'validate:deployment':
            'node scripts/check-deployment-parity.js --validate-deployment',
          'deployment:locked-validation':
            'node scripts/check-deployment-parity.js --locked-validation',
          'native-rendering:check':
            'node scripts/check-native-rendering-policy.js',
        },
      },
      null,
      2,
    ),
  );
  await writeFile(
    join(dir, '.github/workflows/deploy.yml'),
    [
      'node-version: 20',
      'run: npm install',
      'run: npm install --global vercel@latest',
      'run: vercel pull --yes --environment=preview',
      'run: npm run app-store:diff',
      'run: vercel build --prod --local-config ./vercel.json',
      'run: vercel deploy --prod --local-config ./vercel.json --prebuilt',
    ].join('\n'),
  );
  await writeFile(
    join(dir, '.github/workflows/preview.yml'),
    [
      'pull_request:',
      'node-version: 20',
      'run: npm install',
      'run: npm install --global vercel@latest',
      'run: vercel pull --yes --environment=preview',
      'run: npm run app-store:diff',
      'run: vercel build --local-config ./vercel.json',
      'uses: amondnet/vercel-action@v25',
      'vercel-args: --local-config ./vercel.json --archive=tgz --prebuilt',
    ].join('\n'),
  );
  await writeFile(
    join(dir, '.github/workflows/deploy-cloudflare.yml'),
    [
      'node-version: 20',
      'npm ci',
      'npm run app-store:diff',
      'npm run build',
      'pages deploy ./out',
    ].join('\n'),
  );
  await writeFile(
    join(dir, '.github/workflows/preview-cloudflare.yml'),
    [
      'node-version: 20',
      'npm ci',
      'npm run app-store:diff',
      'npm run build',
      'actions/upload-artifact@v4',
      'actions/download-artifact@v4',
      'path: out',
      'pages deploy ./out',
    ].join('\n'),
  );
  await writeFile(
    join(dir, '.github/workflows/build-image.yml'),
    [
      'REGISTRY: ghcr.io',
      'node-version: 20',
      'npm ci',
      'npm run app-store:diff',
      'docker/build-push-action@v5',
      'file: ./Dockerfile',
      'platforms: linux/amd64',
      'kubectl',
      'set image deployment/sealos-docs',
      'annotate deployment/sealos-docs',
    ].join('\n'),
  );
  await writeFile(
    join(dir, 'Dockerfile'),
    [
      'FROM node:20-bookworm-slim AS builder',
      'RUN apt-get update && apt-get install -y libcairo2-dev',
      'ENV DOCKER_BUILD=true',
      'RUN npm ci && npm run build',
      'FROM nginx:1.27-alpine AS runner',
      'COPY --from=builder /app/out /usr/share/nginx/html',
    ].join('\n'),
  );
}
