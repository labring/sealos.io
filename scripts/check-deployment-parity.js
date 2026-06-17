#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REQUIRED_TARGETS = [
  'Vercel production',
  'Vercel preview',
  'Cloudflare Pages production',
  'Cloudflare Pages preview',
  'Docker/Nginx',
  'GHCR/Kubernetes',
];

const REQUIRED_DIMENSIONS = [
  'install command',
  'build command',
  'Node/runtime',
  'environment source',
  'artifact',
  'static output location',
  'serving layer',
  'redirects',
  'headers',
  'cache policy',
  'route support',
  'native dependency assumptions',
  'credentials/secrets touched',
  'safe validation command',
];

const GATE_DEFINITIONS = [
  {
    name: 'PHASE9_RUN_LOCKED_BUILD',
    opens:
      'Node 20 locked-dependency lint, build, analyzer, and generated diff stages.',
    skip:
      'Closed by default because accepted build/analyzer evidence requires Node 20 and installed locked dependencies.',
  },
  {
    name: 'PHASE9_RUN_DOCKER_SMOKE',
    opens: 'Disposable Docker image, Nginx container, and local HTTP probes.',
    skip:
      'Closed by default because Docker crosses package install, native library, daemon, image, and serving boundaries.',
  },
  {
    name: 'PHASE9_RUN_HOSTED_PROBES',
    opens: 'Hosted preview or production header, redirect, and route probes.',
    skip:
      'Closed by default because hosted probes require network access and deployment URLs.',
  },
  {
    name: 'PHASE9_RUN_BROWSER_TRACE',
    opens: 'Browser automation or trace capture for later UI/runtime validation.',
    skip:
      'Closed by default because browser traces require automation runtime and target URLs.',
  },
  {
    name: 'PHASE9_RUN_NETWORK_REFRESH',
    opens: 'Remote catalog refreshes or external service fetches.',
    skip:
      'Closed by default because network refreshes can be slow and can change generated artifacts.',
  },
  {
    name: 'PHASE9_RUN_DEPLOY',
    opens: 'Credentialed deploy commands.',
    skip:
      'Closed by default because deploys require credentials and can mutate hosted environments.',
  },
  {
    name: 'PHASE9_ACCEPT_GENERATED_CHANGES',
    opens: 'Reviewed generated App Store artifact mutation acceptance.',
    skip:
      'Closed by default because generated changes require explicit review.',
  },
];

const PACKAGE_SCRIPT_EXPECTATIONS = {
  'deployment:check': 'node scripts/check-deployment-parity.js',
  'static-routes:check': 'node scripts/check-static-export-routes.js',
  'static-output:check': 'node scripts/check-static-output.js',
  'docker:smoke': 'node scripts/smoke-docker-nginx.js',
  'native-rendering:check': 'node scripts/check-native-rendering-policy.js',
  'validate:deployment':
    'node scripts/check-deployment-parity.js --validate-deployment',
  'deployment:locked-validation':
    'node scripts/check-deployment-parity.js --locked-validation',
};

const SOURCE_EXPECTATIONS = [
  {
    label: 'Vercel production',
    file: '.github/workflows/deploy.yml',
    tokens: [
      'node-version: 20',
      'npm install',
      'vercel@latest',
      'vercel pull',
      '--environment=preview',
      'npm run app-store:refresh',
      'vercel build --prod --local-config ./vercel.json',
      'vercel deploy --prod',
      '--prebuilt',
    ],
  },
  {
    label: 'Vercel preview',
    file: '.github/workflows/preview.yml',
    tokens: [
      'node-version: 20',
      'npm install',
      'vercel@latest',
      'vercel pull',
      'npm run app-store:refresh',
      'vercel build --local-config ./vercel.json',
      'vercel-action',
      '--prebuilt',
    ],
  },
  {
    label: 'Cloudflare Pages production',
    file: '.github/workflows/deploy-cloudflare.yml',
    tokens: [
      'node-version: 20',
      'npm ci',
      'npm run app-store:refresh',
      'npm run build',
      'pages deploy ./out',
    ],
  },
  {
    label: 'Cloudflare Pages preview',
    file: '.github/workflows/preview-cloudflare.yml',
    tokens: [
      'node-version: 20',
      'npm ci',
      'npm run app-store:refresh',
      'npm run build',
      'actions/upload-artifact',
      'actions/download-artifact',
      'path: out',
      'pages deploy ./out',
    ],
  },
  {
    label: 'Docker/Nginx',
    file: 'Dockerfile',
    tokens: [
      'node:20-bookworm-slim',
      'libcairo2-dev',
      'DOCKER_BUILD=true',
      'npm ci && npm run build',
      'nginx:1.27-alpine',
      '/app/out',
      '/usr/share/nginx/html',
    ],
  },
  {
    label: 'GHCR/Kubernetes',
    file: '.github/workflows/build-image.yml',
    tokens: [
      'REGISTRY: ghcr.io',
      'node-version: 20',
      'npm run app-store:refresh',
      'docker/build-push-action@v5',
      'file: ./Dockerfile',
      'platforms: linux/amd64',
      'set image deployment/sealos-docs',
      'annotate deployment/sealos-docs',
    ],
  },
];

function readTextFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJsonFile(filePath) {
  return JSON.parse(readTextFile(filePath));
}

function normalizeForTokenSearch(text) {
  return text.replace(/\s+/g, ' ');
}

function hasToken(text, token) {
  return normalizeForTokenSearch(text).includes(normalizeForTokenSearch(token));
}

function parseGateState(env = process.env) {
  return GATE_DEFINITIONS.map((definition) => {
    const isOpen = env[definition.name] === '1';
    return {
      ...definition,
      isOpen,
      status: isOpen ? 'OPEN' : 'CLOSED',
      value: isOpen ? '1' : '',
    };
  });
}

function validateChecklistTokens(docText) {
  return {
    missingTargets: REQUIRED_TARGETS.filter((target) => !docText.includes(target)),
    missingDimensions: REQUIRED_DIMENSIONS.filter(
      (dimension) => !docText.includes(dimension),
    ),
    missingGates: GATE_DEFINITIONS.map((gate) => gate.name).filter(
      (name) => !docText.includes(name),
    ),
  };
}

function validatePackageScripts(pkg) {
  const scripts = pkg.scripts || {};
  const missingScripts = [];
  const invalidScripts = [];

  for (const [name, expected] of Object.entries(PACKAGE_SCRIPT_EXPECTATIONS)) {
    if (!scripts[name]) {
      missingScripts.push(name);
      continue;
    }

    if (scripts[name] !== expected) {
      invalidScripts.push({
        name,
        expected,
        actual: scripts[name],
      });
    }
  }

  for (const name of [
    'app-store:diff',
    'build:timed',
    'build:analyze:timed',
  ]) {
    if (!scripts[name]) {
      missingScripts.push(name);
    }
  }

  return {
    missingScripts,
    invalidScripts,
  };
}

function validateDeploymentSources({ rootDir = process.cwd() } = {}) {
  const checks = SOURCE_EXPECTATIONS.map((expectation) => {
    const filePath = path.join(rootDir, expectation.file);
    const exists = fs.existsSync(filePath);
    const text = exists ? readTextFile(filePath) : '';
    const missingTokens = exists
      ? expectation.tokens.filter((token) => !hasToken(text, token))
      : expectation.tokens;

    return {
      label: expectation.label,
      file: expectation.file,
      exists,
      missingTokens,
    };
  });
  const failures = checks.flatMap((check) => {
    if (!check.exists) {
      return [`${check.file} is missing`];
    }

    return check.missingTokens.map(
      (token) => `${check.file} missing token: ${token}`,
    );
  });

  return {
    checks,
    failures,
  };
}

function getLockedValidationStages({
  cwd = process.cwd(),
  env = process.env,
  nodeVersion = process.versions.node,
} = {}) {
  const gate = parseGateState(env).find(
    (item) => item.name === 'PHASE9_RUN_LOCKED_BUILD',
  );
  const nvmrcPath = path.join(cwd, '.nvmrc');
  const expectedNodeMajor = fs.existsSync(nvmrcPath)
    ? readTextFile(nvmrcPath).trim().replace(/^v/, '').split('.')[0]
    : null;
  const actualNodeMajor = nodeVersion.replace(/^v/, '').split('.')[0];
  const hasNodeModules = fs.existsSync(path.join(cwd, 'node_modules'));
  const caveats = [];

  if (!expectedNodeMajor) {
    caveats.push('.nvmrc is missing');
  } else if (actualNodeMajor !== expectedNodeMajor) {
    caveats.push(
      `active Node major ${actualNodeMajor} differs from .nvmrc ${expectedNodeMajor}`,
    );
  }

  if (!hasNodeModules) {
    caveats.push('node_modules is unavailable');
  }

  const stages = [
    { name: 'pre generated diff guard', command: 'npm run app-store:diff' },
    { name: 'typecheck', command: 'npm run lint' },
    { name: 'timed production build', command: 'npm run build:timed' },
    { name: 'post build generated diff guard', command: 'npm run app-store:diff' },
    {
      name: 'timed analyzer build',
      command: 'npm run build:analyze:timed',
    },
    {
      name: 'post analyzer generated diff guard',
      command: 'npm run app-store:diff',
    },
  ];

  return {
    gate,
    expectedNodeMajor,
    actualNodeMajor,
    hasNodeModules,
    caveats,
    ready: gate.isOpen && caveats.length === 0,
    stages,
  };
}

function runLockedValidationPlan({
  cwd = process.cwd(),
  env = process.env,
  spawn = spawnSync,
  nodeVersion = process.versions.node,
} = {}) {
  const plan = getLockedValidationStages({ cwd, env, nodeVersion });

  if (!plan.gate.isOpen) {
    return {
      ...plan,
      status: 'SKIPPED_WITH_CAVEAT',
      exitCode: 0,
    };
  }

  if (!plan.ready) {
    return {
      ...plan,
      status: 'BLOCKED',
      exitCode: 1,
    };
  }

  const results = [];
  for (const stage of plan.stages) {
    const [command, ...args] = stage.command.split(' ');
    const result = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: false,
      env,
    });
    const status = result.status ?? 1;
    results.push({ ...stage, status });

    if (status !== 0) {
      return {
        ...plan,
        status: 'FAIL',
        results,
        exitCode: status,
      };
    }
  }

  return {
    ...plan,
    status: 'PASS',
    results,
    exitCode: 0,
  };
}

function runNpmScript({
  script,
  cwd = process.cwd(),
  env = process.env,
  spawn = spawnSync,
} = {}) {
  const result = spawn('npm', ['run', script], {
    cwd,
    stdio: 'inherit',
    shell: false,
    env,
  });

  return result.status ?? 1;
}

function writeLine(stream, line) {
  stream.write(`${line}\n`);
}

function printLockedValidationSummary(result, stdout = process.stdout) {
  writeLine(
    stdout,
    `[deployment-parity] runLockedValidationPlan status: ${result.status}`,
  );
  writeLine(
    stdout,
    `[deployment-parity] PHASE9_RUN_LOCKED_BUILD: ${result.gate.status}`,
  );
  writeLine(
    stdout,
    `[deployment-parity] Node major: ${result.actualNodeMajor}; expected: ${
      result.expectedNodeMajor || 'unknown'
    }`,
  );
  writeLine(
    stdout,
    `[deployment-parity] node_modules: ${
      result.hasNodeModules ? 'present' : 'absent'
    }`,
  );

  for (const caveat of result.caveats || []) {
    writeLine(stdout, `[deployment-parity] caveat: ${caveat}`);
  }

  writeLine(stdout, '[deployment-parity] locked validation stages');
  for (const stage of result.stages || []) {
    const executed = (result.results || []).find(
      (item) => item.command === stage.command,
    );
    const status = executed
      ? executed.status === 0
        ? 'PASS'
        : 'FAIL'
      : result.ready
        ? 'PENDING'
        : 'SKIPPED_WITH_CAVEAT';
    writeLine(stdout, `  ${status}: ${stage.command} (${stage.name})`);
  }
}

function validateDeploymentParity({ rootDir = process.cwd(), env = process.env } = {}) {
  const docPath = path.join(rootDir, 'docs/deployment-parity.md');
  const pkgPath = path.join(rootDir, 'package.json');
  const docText = readTextFile(docPath);
  const pkg = readJsonFile(pkgPath);
  const checklist = validateChecklistTokens(docText);
  const sources = validateDeploymentSources({ rootDir });
  const scripts = validatePackageScripts(pkg);
  const gates = parseGateState(env);
  const lockedValidation = getLockedValidationStages({ cwd: rootDir, env });
  const failures = [
    ...checklist.missingTargets.map((item) => `missing checklist target: ${item}`),
    ...checklist.missingDimensions.map(
      (item) => `missing checklist dimension: ${item}`,
    ),
    ...checklist.missingGates.map((item) => `missing checklist gate: ${item}`),
    ...sources.failures,
    ...scripts.missingScripts.map((item) => `missing package script: ${item}`),
    ...scripts.invalidScripts.map(
      (item) =>
        `invalid package script ${item.name}: expected "${item.expected}", got "${item.actual}"`,
    ),
  ];

  return {
    checklist,
    sources,
    scripts,
    gates,
    lockedValidation,
    failures,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
  };
}

function printDeploymentParitySummary(
  result,
  stdout = process.stdout,
  stderr = process.stderr,
) {
  writeLine(stdout, '[deployment-parity] checklist');
  writeLine(stdout, `  targets missing: ${result.checklist.missingTargets.length}`);
  writeLine(
    stdout,
    `  dimensions missing: ${result.checklist.missingDimensions.length}`,
  );
  writeLine(stdout, `  gates missing: ${result.checklist.missingGates.length}`);
  writeLine(stdout, '[deployment-parity] sources');
  for (const check of result.sources.checks) {
    const status = check.exists && check.missingTokens.length === 0 ? 'PASS' : 'FAIL';
    writeLine(stdout, `  ${status}: ${check.label} (${check.file})`);
  }
  writeLine(stdout, '[deployment-parity] package scripts');
  writeLine(stdout, `  missing: ${result.scripts.missingScripts.length}`);
  writeLine(stdout, `  invalid: ${result.scripts.invalidScripts.length}`);
  writeLine(stdout, '[deployment-parity] unsafe gates');
  for (const gate of result.gates) {
    writeLine(
      stdout,
      `  ${gate.status}: ${gate.name} - ${gate.isOpen ? gate.opens : gate.skip}`,
    );
  }

  const locked = result.lockedValidation;
  if (locked.gate.isOpen) {
    if (locked.ready) {
      writeLine(stdout, '[deployment-parity] PHASE9_RUN_LOCKED_BUILD open and ready');
    } else {
      writeLine(
        stdout,
        `[deployment-parity] PHASE9_RUN_LOCKED_BUILD blocked: ${locked.caveats.join('; ')}`,
      );
    }
  } else {
    writeLine(
      stdout,
      `[deployment-parity] SKIPPED_WITH_CAVEAT: ${locked.gate.name} closed; ${locked.gate.skip}`,
    );
  }

  for (const failure of result.failures) {
    writeLine(stderr, `[deployment-parity] FAIL: ${failure}`);
  }
}

function runDeploymentValidation({
  cwd = process.cwd(),
  env = process.env,
  spawn = spawnSync,
  nodeVersion = process.versions.node,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  writeLine(stdout, '[deployment-parity] validate deployment mode');
  const sourceResult = validateDeploymentParity({ rootDir: cwd, env });
  printDeploymentParitySummary(sourceResult, stdout, stderr);

  if (sourceResult.failures.length > 0) {
    writeLine(stderr, '[deployment-parity] FAIL: deployment parity source check');
    return {
      status: 'FAIL',
      exitCode: 1,
      sourceResult,
    };
  }

  writeLine(stdout, '[deployment-parity] PASS: deployment parity source check');

  if (env.PHASE9_RUN_LOCKED_BUILD === '1') {
    const lockedResult = runLockedValidationPlan({
      cwd,
      env,
      spawn,
      nodeVersion,
    });
    printLockedValidationSummary(lockedResult, stdout);

    if (lockedResult.exitCode !== 0) {
      return {
        status: lockedResult.status,
        exitCode: lockedResult.exitCode,
        sourceResult,
        lockedResult,
      };
    }
  } else {
    const diffStatus = runNpmScript({
      script: 'app-store:diff',
      cwd,
      env,
      spawn,
    });

    if (diffStatus !== 0) {
      writeLine(stderr, '[deployment-parity] FAIL: npm run app-store:diff');
      return {
        status: 'FAIL',
        exitCode: diffStatus,
        sourceResult,
      };
    }
  }

  for (const script of [
    'native-rendering:check',
    'static-output:check',
    'docker:smoke',
  ]) {
    const status = runNpmScript({ script, cwd, env, spawn });
    if (status !== 0) {
      writeLine(stderr, `[deployment-parity] FAIL: npm run ${script}`);
      return {
        status: 'FAIL',
        exitCode: status,
        sourceResult,
      };
    }
  }

  writeLine(stdout, '[deployment-parity] PASS: validate deployment');

  return {
    status: 'PASS',
    exitCode: 0,
    sourceResult,
  };
}

function runCli({
  argv = process.argv.slice(2),
  cwd = process.cwd(),
  env = process.env,
  spawn = spawnSync,
  nodeVersion = process.versions.node,
  stdout = process.stdout,
  stderr = process.stderr,
} = {}) {
  try {
    if (argv.includes('--locked-validation')) {
      writeLine(stdout, '[deployment-parity] locked validation mode');
      const result = runLockedValidationPlan({
        cwd,
        env,
        spawn,
        nodeVersion,
      });
      printLockedValidationSummary(result, stdout);
      return result;
    }

    if (argv.includes('--validate-deployment')) {
      return runDeploymentValidation({
        cwd,
        env,
        spawn,
        nodeVersion,
        stdout,
        stderr,
      });
    }

    const result = validateDeploymentParity({ rootDir: cwd, env });
    printDeploymentParitySummary(result, stdout, stderr);
    return {
      status: result.failures.length === 0 ? 'PASS' : 'FAIL',
      exitCode: result.failures.length === 0 ? 0 : 1,
      result,
    };
  } catch (error) {
    writeLine(stderr, `[deployment-parity] FAIL: ${error.message}`);
    return {
      status: 'FAIL',
      exitCode: 1,
      error,
    };
  }
}

if (require.main === module) {
  const result = runCli();
  process.exitCode = result.exitCode;
}

module.exports = {
  GATE_DEFINITIONS,
  PACKAGE_SCRIPT_EXPECTATIONS,
  REQUIRED_DIMENSIONS,
  REQUIRED_TARGETS,
  getLockedValidationStages,
  parseGateState,
  readJsonFile,
  readTextFile,
  runCli,
  runDeploymentValidation,
  runLockedValidationPlan,
  validateChecklistTokens,
  validateDeploymentParity,
  validateDeploymentSources,
  validatePackageScripts,
};
