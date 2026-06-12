#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SHELL_SURFACES = [
  {
    id: 'locale-shell',
    label: 'shared locale shell',
    file: 'app/[lang]/layout.tsx',
    tokens: ['RootProvider', 'AuthFormProvider', 'DeployModalProvider'],
  },
  {
    id: 'analytics-loader',
    label: 'analytics loader',
    file: 'components/analytics/index.tsx',
    tokens: ['Analytics'],
  },
  {
    id: 'gtm-body',
    label: 'GTM body fallback',
    file: 'components/analytics/gtm-body.tsx',
    tokens: ['GTMBody'],
  },
  {
    id: 'docs-search',
    label: 'docs search dialog',
    file: 'components/docs/Search.tsx',
    tokens: ['useDocsSearch'],
  },
  {
    id: 'auth-provider',
    label: 'auth command provider',
    file: 'new-components/AuthForm/AuthFormProvider.tsx',
    tokens: ['AuthFormProvider'],
  },
  {
    id: 'auth-dialog',
    label: 'auth dialog facade',
    file: 'new-components/AuthForm/index.tsx',
    tokens: ['AuthForm'],
  },
  {
    id: 'deploy-provider',
    label: 'deploy command provider',
    file: 'new-components/DeployModal/DeployModalContext.tsx',
    tokens: ['DeployModalProvider', 'openDeployModal'],
  },
  {
    id: 'deploy-dialog',
    label: 'deploy dialog facade',
    file: 'new-components/DeployModal/index.tsx',
    tokens: ['DeployModal'],
  },
  {
    id: 'new-header',
    label: 'new header chrome',
    file: 'new-components/Header.tsx',
    tokens: ['Header'],
  },
  {
    id: 'new-footer',
    label: 'new footer chrome',
    file: 'new-components/Footer/index.tsx',
    tokens: ['Footer'],
  },
  {
    id: 'legacy-header',
    label: 'legacy header chrome',
    file: 'components/header/index.tsx',
    tokens: ['Header'],
  },
  {
    id: 'legacy-footer',
    label: 'legacy footer chrome',
    file: 'components/footer/index.tsx',
    tokens: ['Footer'],
  },
];

const ANALYZER_ARTIFACTS = [
  '.next/analyze/client.html',
  '.next/analyze/nodejs.html',
  '.next/analyze/edge.html',
  'analyze/client.html',
  'analyze/nodejs.html',
  'analyze/edge.html',
];

const REQUIRED_COMMANDS = [
  'node --test scripts/check-shell-bundle-baseline.test.mjs',
  'npm run shell-bundle:check',
  'npm run app-store:diff',
  'npm run build:analyze:timed',
  'npm run static-output:check',
  'npm run validate:deployment',
];

const ANALYZER_GROUPS = [
  'shared locale shell',
  'route-local page entries',
  'analytics',
  'auth',
  'deploy',
  'docs search',
  'header',
  'footer',
];

function readTextIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, 'utf8');
}

function resolveInside(rootDir, relativePath) {
  const root = path.resolve(rootDir);
  const resolved = path.resolve(root, relativePath);

  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`${relativePath} resolves outside ${root}`);
  }

  return resolved;
}

function hasStaticImport(source, importedPath) {
  const escaped = importedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(
    `import\\s+(?:[\\s\\S]*?\\s+from\\s+)?['"]${escaped}['"]`,
  ).test(source);
}

function hasDynamicImport(source, importedPath) {
  const escaped = importedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`import\\(\\s*['"]${escaped}['"]\\s*\\)`).test(source);
}

function collectEnvironmentContext({ rootDir = process.cwd() } = {}) {
  const nvmrcPath = resolveInside(rootDir, '.nvmrc');
  const nodeModulesPath = resolveInside(rootDir, 'node_modules');
  const outPath = resolveInside(rootDir, 'out');
  const analyzerArtifacts = ANALYZER_ARTIFACTS.map((artifactPath) => {
    const absolutePath = resolveInside(rootDir, artifactPath);
    return {
      path: artifactPath,
      exists: fs.existsSync(absolutePath),
    };
  });

  return {
    node: process.version,
    '.nvmrc': readTextIfExists(nvmrcPath)?.trim() || 'missing',
    nvmrc: readTextIfExists(nvmrcPath)?.trim() || 'missing',
    node_modules: fs.existsSync(nodeModulesPath) ? 'present' : 'absent',
    nodeModules: fs.existsSync(nodeModulesPath) ? 'present' : 'absent',
    out: fs.existsSync(outPath) ? 'present' : 'absent',
    'analyzer artifacts': analyzerArtifacts.some((artifact) => artifact.exists)
      ? 'present'
      : 'absent',
    analyzerArtifacts,
  };
}

function collectSurfaceEvidence({ rootDir = process.cwd() } = {}) {
  return SHELL_SURFACES.map((surface) => {
    const source = readTextIfExists(resolveInside(rootDir, surface.file));
    const missingTokens =
      source === null
        ? surface.tokens
        : surface.tokens.filter((token) => !source.includes(token));

    return {
      ...surface,
      status:
        source !== null && missingTokens.length === 0 ? 'PRESENT' : 'MISSING',
      missingTokens,
    };
  });
}

function collectAnalyzerEvidence({
  rootDir = process.cwd(),
  env = process.env,
} = {}) {
  const artifacts = ANALYZER_ARTIFACTS.map((artifactPath) => {
    const absolutePath = resolveInside(rootDir, artifactPath);
    return {
      path: artifactPath,
      exists: fs.existsSync(absolutePath),
      bytes: fs.existsSync(absolutePath) ? fs.statSync(absolutePath).size : 0,
    };
  });
  const found = artifacts.filter((artifact) => artifact.exists);

  if (found.length > 0) {
    return {
      status: 'PASS',
      artifacts,
      groups: ANALYZER_GROUPS,
      caveat: null,
    };
  }

  const caveat =
    'analyzer artifacts are absent; SHELL-04 final movement evidence requires Node 20, installed locked dependencies, and npm run build:analyze:timed.';

  return {
    status: env.PHASE11_REQUIRE_ANALYZER === '1' ? 'FAIL' : 'SKIPPED_WITH_CAVEAT',
    artifacts,
    groups: ANALYZER_GROUPS,
    caveat:
      env.PHASE11_REQUIRE_ANALYZER === '1'
        ? `${caveat} analyzer artifacts are absent and PHASE11_REQUIRE_ANALYZER=1.`
        : caveat,
  };
}

function collectShellSurfaceEvidence({
  rootDir = process.cwd(),
  env = process.env,
} = {}) {
  return {
    status: 'COLLECTED',
    surfaces: collectSurfaceEvidence({ rootDir }),
    analyzer: collectAnalyzerEvidence({ rootDir, env }),
    environment: collectEnvironmentContext({ rootDir }),
    requiredCommands: REQUIRED_COMMANDS,
    phaseBoundaries: {
      phase12:
        'Phase 12 owns OG and blog thumbnail native rendering policy.',
      phase13:
        'Phase 13 owns representative browser trace closeout and final audit status updates.',
    },
    traceability: [
      'SHELL-01',
      'SHELL-02',
      'SHELL-03',
      'SHELL-04',
      'D-01',
      'D-02',
      'D-03',
      'D-04',
      'D-05',
      'D-06',
      'D-07',
      'D-08',
      'D-09',
      'D-10',
      'D-11',
      'D-12',
      'D-13',
      'D-14',
      'D-15',
      'D-16',
      'D-17',
      'D-18',
      'D-19',
      'D-20',
      'D-21',
      'D-22',
    ],
  };
}

function validateLazyBoundaryExpectations({ rootDir = process.cwd() } = {}) {
  const failures = [];
  const layout = readTextIfExists(resolveInside(rootDir, 'app/[lang]/layout.tsx'));
  const authFacade = readTextIfExists(
    resolveInside(rootDir, 'new-components/AuthForm/index.tsx'),
  );
  const deployFacade = readTextIfExists(
    resolveInside(rootDir, 'new-components/DeployModal/index.tsx'),
  );
  const deployContext = readTextIfExists(
    resolveInside(rootDir, 'new-components/DeployModal/DeployModalContext.tsx'),
  );
  const templateSource = readTextIfExists(
    resolveInside(rootDir, 'hooks/use-template-source.ts'),
  );

  if (layout === null) {
    failures.push('app/[lang]/layout.tsx is missing');
  } else {
    if (hasStaticImport(layout, '@/components/docs/Search')) {
      failures.push(
        'locale shell imports docs search directly; use a lazy Fumadocs search bridge before 11-02 can pass.',
      );
    }
    if (!layout.includes('SearchDialog')) {
      failures.push('locale shell does not wire a Fumadocs SearchDialog surface');
    }
  }

  if (authFacade === null) {
    failures.push('new-components/AuthForm/index.tsx is missing');
  } else if (hasStaticImport(authFacade, './AuthFormInner')) {
    failures.push(
      'auth facade imports AuthFormInner eagerly; D-05/D-06 require intent-loaded auth internals.',
    );
  }

  if (deployFacade === null) {
    failures.push('new-components/DeployModal/index.tsx is missing');
  } else if (hasStaticImport(deployFacade, './DeployModalInner')) {
    failures.push(
      'deploy facade imports DeployModalInner eagerly; D-05/D-07 require intent-loaded deploy internals.',
    );
  }

  if (deployContext === null) {
    failures.push('new-components/DeployModal/DeployModalContext.tsx is missing');
  } else if (hasStaticImport(deployContext, '@/hooks/use-template-source')) {
    failures.push(
      'DeployModalContext imports useTemplateSource eagerly; template-source loading must start from deploy intent.',
    );
  }

  if (templateSource === null) {
    failures.push('hooks/use-template-source.ts is missing');
  } else if (
    hasStaticImport(templateSource, '@/config/template-sources.json') ||
    hasStaticImport(templateSource, '../config/template-sources.json') ||
    hasStaticImport(templateSource, './config/template-sources.json')
  ) {
    failures.push(
      'use-template-source statically imports template-sources.json; D-07 requires template data reach behind deploy intent.',
    );
  } else if (
    templateSource.includes('template-sources.json') &&
    !hasDynamicImport(templateSource, '@/config/template-sources.json') &&
    !hasDynamicImport(templateSource, '../config/template-sources.json')
  ) {
    failures.push(
      'use-template-source references template-sources.json without a dynamic import boundary.',
    );
  }

  return failures;
}

function validateShellBundleBaseline({
  rootDir = process.cwd(),
  env = process.env,
} = {}) {
  const evidence = collectShellSurfaceEvidence({ rootDir, env });
  const failures = [];

  for (const surface of evidence.surfaces) {
    if (surface.status !== 'PRESENT') {
      failures.push(
        `${surface.file} missing ${surface.label} tokens: ${surface.missingTokens.join(', ')}`,
      );
    }
  }

  failures.push(...validateLazyBoundaryExpectations({ rootDir }));

  if (evidence.analyzer.status === 'FAIL') {
    failures.push(evidence.analyzer.caveat);
  }

  return {
    ...evidence,
    status: failures.length === 0 ? 'PASS' : 'FAIL',
    failures,
  };
}

function main() {
  const result = validateShellBundleBaseline();
  console.log(JSON.stringify(result, null, 2));

  if (result.status !== 'PASS') {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  collectShellSurfaceEvidence,
  validateShellBundleBaseline,
};
