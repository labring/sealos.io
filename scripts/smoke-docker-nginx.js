#!/usr/bin/env node

const { spawnSync } = require('child_process');

const DEFAULT_PORT = 18080;
const REQUIRED_DOCKERFILE_TOKENS = [
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
];

function getDockerGate(env = process.env) {
  const isOpen = env.PHASE9_RUN_DOCKER_SMOKE === '1';

  return {
    name: 'PHASE9_RUN_DOCKER_SMOKE',
    isOpen,
    status: isOpen ? 'OPEN' : 'SKIPPED_WITH_CAVEAT',
    reason: isOpen
      ? 'PHASE9_RUN_DOCKER_SMOKE=1 opens disposable Docker/Nginx smoke validation.'
      : 'PHASE9_RUN_DOCKER_SMOKE is closed; Docker build, container runtime, and local HTTP probes are skipped by default.',
  };
}

function createCommand(command, args, options = {}) {
  return {
    command,
    args,
    optional: Boolean(options.optional),
    label: options.label || [command, ...args].join(' '),
  };
}

function getDockerSmokePlan({
  runId = `${Date.now()}-${process.pid}`,
  port = DEFAULT_PORT,
} = {}) {
  const normalizedRunId = String(runId).replace(/[^a-zA-Z0-9_.-]/g, '-');
  const imageName = `phase9-sealos-nginx-${normalizedRunId}`;
  const containerName = `phase9-sealos-nginx-${normalizedRunId}`;
  const baseUrl = `http://127.0.0.1:${port}`;
  const probes = [
    { path: '/', label: 'root static page' },
    { path: '/en/', label: 'localized static page' },
    { path: '/mtc.js', label: 'cache/header static file' },
    { path: '/robots.txt', label: 'redirect or static robots surface' },
    { path: '/_next/static/', label: 'representative Next static asset path' },
  ];
  const commands = [
    createCommand('docker', ['version'], { label: 'Docker CLI and daemon check' }),
    createCommand('npm', ['run', 'app-store:diff'], {
      label: 'pre Docker generated diff guard',
    }),
    createCommand(
      'node',
      [
        '-e',
        `const fs=require('fs');const s=fs.readFileSync('Dockerfile','utf8');for(const token of ${JSON.stringify(REQUIRED_DOCKERFILE_TOKENS)}){if(!s.includes(token))throw new Error('Dockerfile missing '+token);}`,
      ],
      {
        label:
          'verify Dockerfile Node 20 native library and static output evidence',
      },
    ),
    createCommand('npm', ['run', 'native-rendering:check'], {
      label: 'native rendering source policy and dependency contract check',
    }),
    createCommand('npm', ['run', 'native-rendering:benchmark'], {
      label: 'native rendering gated fixture benchmark command',
    }),
    createCommand('docker', ['build', '-t', imageName, '-f', 'Dockerfile', '.'], {
      label: 'build disposable image from Dockerfile',
    }),
    createCommand(
      'docker',
      [
        'run',
        '-d',
        '--rm',
        '--name',
        containerName,
        '-p',
        `${port}:80`,
        imageName,
      ],
      { label: 'run disposable Nginx container' },
    ),
    createCommand(
      'docker',
      ['run', '--rm', imageName, 'test', '-d', '/usr/share/nginx/html'],
      { label: 'verify /app/out copied to /usr/share/nginx/html' },
    ),
    createCommand(
      'docker',
      ['run', '--rm', imageName, 'test', '-e', '/usr/share/nginx/html/index.html'],
      { label: 'verify static index exists in Nginx root' },
    ),
    ...probes.map((probe) =>
      createCommand('curl', ['-fsSI', `${baseUrl}${probe.path}`], {
        label: `probe ${probe.label}`,
        optional: probe.path === '/_next/static/',
      }),
    ),
    createCommand('npm', ['run', 'app-store:diff'], {
      label: 'post Docker generated diff guard',
    }),
  ];
  const cleanup = [
    createCommand('docker', ['rm', '-f', containerName], {
      label: 'remove disposable container',
      optional: true,
    }),
    createCommand('docker', ['rmi', '-f', imageName], {
      label: 'remove disposable image',
      optional: true,
    }),
  ];

  return {
    imageName,
    containerName,
    port,
    baseUrl,
    probes,
    commands,
    cleanup,
  };
}

function runCommand(commandRunner, command) {
  return commandRunner(command.command, command.args, {
    stdio: 'inherit',
    shell: false,
  });
}

function defaultCommandRunner(command, args, options) {
  return spawnSync(command, args, options);
}

function runDockerSmoke({
  env = process.env,
  commandRunner = defaultCommandRunner,
  runId,
} = {}) {
  const gate = getDockerGate(env);

  if (!gate.isOpen) {
    return {
      gate,
      status: gate.status,
      reason: gate.reason,
      exitCode: 0,
    };
  }

  const dockerCheck = commandRunner('docker', ['version'], {
    stdio: 'pipe',
    shell: false,
  });
  if ((dockerCheck.status ?? 1) !== 0) {
    return {
      gate,
      status: 'BLOCKED',
      reason:
        'Docker CLI or daemon is unavailable; run in a Docker-capable environment.',
      exitCode: 1,
    };
  }

  const plan = getDockerSmokePlan({ runId });
  const results = [];
  let exitCode = 0;

  try {
    for (const command of plan.commands.slice(1)) {
      const result = runCommand(commandRunner, command);
      const status = result.status ?? 1;
      results.push({ label: command.label, status });

      if (status !== 0 && !command.optional) {
        exitCode = status;
        return {
          gate,
          plan,
          results,
          status: 'FAIL',
          reason: `${command.label} failed`,
          exitCode,
        };
      }
    }

    return {
      gate,
      plan,
      results,
      status: 'PASS',
      reason: 'Docker/Nginx smoke completed.',
      exitCode: 0,
    };
  } finally {
    for (const command of plan.cleanup) {
      commandRunner(command.command, command.args, {
        stdio: 'inherit',
        shell: false,
      });
    }
  }
}

function formatGateSummary(gate) {
  if (gate.isOpen) {
    return `[docker:smoke] ${gate.name} open - ${gate.reason}`;
  }

  return `[docker:smoke] ${gate.name} closed - ${gate.reason}`;
}

function printDockerSmokeSummary(result) {
  console.log(formatGateSummary(result.gate));
  console.log(`[docker:smoke] status: ${result.status}`);
  console.log(`[docker:smoke] reason: ${result.reason}`);

  if (result.plan) {
    console.log(`[docker:smoke] image: ${result.plan.imageName}`);
    console.log(`[docker:smoke] container: ${result.plan.containerName}`);
  }

  for (const item of result.results || []) {
    console.log(`[docker:smoke] ${item.status === 0 ? 'PASS' : 'FAIL'}: ${item.label}`);
  }
}

function main() {
  const result = runDockerSmoke();
  printDockerSmokeSummary(result);
  process.exitCode = result.exitCode;
}

if (require.main === module) {
  main();
}

module.exports = {
  DEFAULT_PORT,
  REQUIRED_DOCKERFILE_TOKENS,
  formatGateSummary,
  getDockerGate,
  getDockerSmokePlan,
  runDockerSmoke,
};
