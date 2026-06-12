#!/usr/bin/env node

const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const DEPENDENCY_VERSION_NAMES = [
  'next',
  '@next/bundle-analyzer',
  '@next/mdx',
  'fumadocs-mdx',
  'fumadocs-ui',
  'typescript',
];

const MODES = new Set(['refresh', 'build', 'analyze']);

function parseArgs(argv = process.argv.slice(2)) {
  const modeArg = argv.find((arg) => arg.startsWith('--mode='));
  const mode = modeArg ? modeArg.slice('--mode='.length) : 'build';
  const passthrough = argv.filter((arg) => !arg.startsWith('--mode='));

  if (!MODES.has(mode)) {
    throw new Error(`unsupported mode: ${mode}`);
  }

  return {
    mode,
    passthrough,
  };
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function collectDependencyVersions(lock = readJsonIfExists('package-lock.json')) {
  const versions = {};
  const packages = lock?.packages || {};

  for (const name of DEPENDENCY_VERSION_NAMES) {
    const entry = packages[`node_modules/${name}`];
    versions[name] = entry?.version || null;
  }

  return versions;
}

function collectEnvironmentContext({
  execFile = execFileSync,
  cwd = process.cwd(),
} = {}) {
  const nvmrc = fs.existsSync(`${cwd}/.nvmrc`)
    ? fs.readFileSync(`${cwd}/.nvmrc`, 'utf8').trim()
    : null;
  const lock = readJsonIfExists(`${cwd}/package-lock.json`);
  let npmVersion = null;

  try {
    npmVersion = execFile('npm', ['--version'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    npmVersion = null;
  }

  const nodeMajor = process.versions.node.split('.')[0];
  const lockedDependenciesAvailable = fs.existsSync(`${cwd}/node_modules`);
  const expectedNodeMajor = nvmrc ? nvmrc.replace(/^v/, '').split('.')[0] : null;

  return {
    node: process.version,
    npm: npmVersion,
    nvmrc,
    lockfileVersion: lock?.lockfileVersion || null,
    dependencyVersions: collectDependencyVersions(lock),
    lockedDependenciesAvailable,
    nodeMajorMatchesNvmrc:
      expectedNodeMajor === null ? null : nodeMajor === expectedNodeMajor,
  };
}

function createStage(name, command, args, options = {}) {
  return {
    name,
    command,
    args,
    env: options.env,
  };
}

function getLocalNextCommand() {
  return process.platform === 'win32'
    ? 'node_modules\\.bin\\next.cmd'
    : 'node_modules/.bin/next';
}

function getStagesForMode(mode, passthrough = []) {
  if (mode === 'refresh') {
    return [
      createStage('pre generated diff guard', 'npm', ['run', 'app-store:diff']),
      createStage('explicit App Store refresh', 'npm', [
        'run',
        'app-store:refresh',
        '--',
        ...passthrough,
      ]),
      createStage('post generated diff guard', 'npm', [
        'run',
        'app-store:diff',
        '--',
        '--allow-changes',
      ]),
    ];
  }

  if (mode === 'analyze') {
    return [
      createStage('pre generated diff guard', 'npm', ['run', 'app-store:diff']),
      createStage('Next analyzer build', getLocalNextCommand(), ['build'], {
        env: {
          ANALYZE: 'true',
        },
      }),
      createStage('root locale normalization', 'node', [
        'scripts/normalize-root-locale.js',
      ]),
      createStage('post generated diff guard', 'npm', ['run', 'app-store:diff']),
    ];
  }

  return [
    createStage('pre generated diff guard', 'npm', ['run', 'app-store:diff']),
    createStage('Next production build', getLocalNextCommand(), ['build']),
    createStage('root locale normalization', 'node', [
      'scripts/normalize-root-locale.js',
    ]),
    createStage('post generated diff guard', 'npm', ['run', 'app-store:diff']),
  ];
}

function runMeasuredStage(stage, { spawn = spawnSync, cwd = process.cwd() } = {}) {
  const startedAt = process.hrtime.bigint();
  const result = spawn(stage.command, stage.args, {
    cwd,
    stdio: 'inherit',
    env: {
      ...process.env,
      ...(stage.env || {}),
    },
    shell: false,
  });
  const endedAt = process.hrtime.bigint();
  const durationMs = Number(endedAt - startedAt) / 1_000_000;
  const status = result.status ?? 1;

  return {
    name: stage.name,
    command: [stage.command, ...stage.args].join(' '),
    durationMs,
    status,
  };
}

function printEnvironmentContext(context) {
  console.log('[build-pipeline] environment');
  console.log(`  node: ${context.node}`);
  console.log(`  npm: ${context.npm || 'unavailable'}`);
  console.log(`  .nvmrc: ${context.nvmrc || 'missing'}`);
  console.log(`  lockfileVersion: ${context.lockfileVersion || 'missing'}`);
  console.log(
    `  lockedDependenciesAvailable: ${context.lockedDependenciesAvailable}`,
  );

  for (const [name, version] of Object.entries(context.dependencyVersions)) {
    console.log(`  ${name}: ${version || 'missing'}`);
  }

  if (context.nodeMajorMatchesNvmrc === false) {
    console.warn(
      '[build-pipeline] caveat: active Node major differs from .nvmrc; accepted build/analyzer timing requires Node 20.',
    );
  }

  if (!context.lockedDependenciesAvailable) {
    console.warn(
      '[build-pipeline] caveat: node_modules is unavailable; accepted build/analyzer timing requires installed locked dependencies.',
    );
  }
}

function printTimingSummary(results) {
  console.log('[build-pipeline] timing summary');

  for (const result of results) {
    console.log(
      `  ${result.name}: ${result.durationMs.toFixed(1)}ms (exit ${result.status})`,
    );
  }
}

function runPipeline({ mode, passthrough = [] }, options = {}) {
  const context = collectEnvironmentContext(options);
  const stages = getStagesForMode(mode, passthrough);
  const results = [];
  let exitCode = 0;

  printEnvironmentContext(context);

  for (const stage of stages) {
    console.log(`[build-pipeline] stage: ${stage.name}`);
    const result = runMeasuredStage(stage, options);
    results.push(result);

    if (result.status !== 0) {
      exitCode = result.status;
      break;
    }
  }

  printTimingSummary(results);

  return {
    context,
    stages,
    results,
    exitCode,
  };
}

function main() {
  try {
    const args = parseArgs();
    const result = runPipeline(args);
    process.exitCode = result.exitCode;
  } catch (error) {
    console.error(`[build-pipeline] failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  DEPENDENCY_VERSION_NAMES,
  parseArgs,
  collectEnvironmentContext,
  getLocalNextCommand,
  getStagesForMode,
  runMeasuredStage,
  runPipeline,
};
