import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  collectShellSurfaceEvidence,
  validateShellBundleBaseline,
} from './check-shell-bundle-baseline.js';

test('collectShellSurfaceEvidence reports every Phase 11 shell surface', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase11-shell-surfaces-'));

  try {
    await writePassingShellFixture(dir);
    const evidence = collectShellSurfaceEvidence({ rootDir: dir, env: {} });
    const surfaceIds = evidence.surfaces.map((surface) => surface.id);

    assert.deepEqual(surfaceIds.sort(), [
      'analytics-loader',
      'auth-dialog',
      'auth-provider',
      'deploy-dialog',
      'deploy-provider',
      'docs-search',
      'gtm-body',
      'legacy-footer',
      'legacy-header',
      'locale-shell',
      'new-footer',
      'new-header',
    ].sort());
    assert.equal(evidence.environment.node, process.version);
    assert.equal(evidence.environment.nvmrc, '20');
    assert.equal(evidence.environment.nodeModules, 'absent');
    assert.equal(evidence.environment.out, 'absent');
    assert.equal(evidence.analyzer.status, 'SKIPPED_WITH_CAVEAT');
    assert.ok(
      evidence.requiredCommands.includes('npm run build:analyze:timed'),
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('validateShellBundleBaseline accepts lazy-boundary fixture source', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase11-shell-pass-'));

  try {
    await writePassingShellFixture(dir);
    const result = validateShellBundleBaseline({ rootDir: dir, env: {} });

    assert.equal(result.status, 'PASS');
    assert.deepEqual(result.failures, []);
    assert.equal(result.analyzer.status, 'SKIPPED_WITH_CAVEAT');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('validateShellBundleBaseline catches eager search, auth, deploy, and template-source reach', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase11-shell-fail-'));

  try {
    await writePassingShellFixture(dir);

    await writeFile(
      join(dir, 'app/[lang]/layout.tsx'),
      [
        "import { DefaultSearchDialog } from '@/components/docs/Search';",
        "import { AuthForm } from '@/new-components/AuthForm';",
        "import { DeployModal } from '@/new-components/DeployModal';",
        '<AuthForm />',
        '<DeployModal />',
      ].join('\n'),
    );
    await writeFile(
      join(dir, 'new-components/AuthForm/index.tsx'),
      "import { AuthFormInner } from './AuthFormInner';\nexport function AuthForm() { return <AuthFormInner />; }\n",
    );
    await writeFile(
      join(dir, 'new-components/DeployModal/index.tsx'),
      "import { DeployModalInner } from './DeployModalInner';\nexport function DeployModal() { return <DeployModalInner />; }\n",
    );
    await writeFile(
      join(dir, 'new-components/DeployModal/DeployModalContext.tsx'),
      "import { useTemplateSource } from '@/hooks/use-template-source';\nconst { fetchTemplateSource } = useTemplateSource();\n",
    );
    await writeFile(
      join(dir, 'hooks/use-template-source.ts'),
      "import templateSourcesData from '@/config/template-sources.json';\nexport function useTemplateSource() { return templateSourcesData; }\n",
    );

    const result = validateShellBundleBaseline({ rootDir: dir, env: {} });
    const failures = result.failures.join('\n');

    assert.equal(result.status, 'FAIL');
    assert.match(failures, /locale shell imports docs search directly/);
    assert.match(failures, /auth facade imports AuthFormInner eagerly/);
    assert.match(failures, /deploy facade imports DeployModalInner eagerly/);
    assert.match(failures, /DeployModalContext imports useTemplateSource eagerly/);
    assert.match(failures, /use-template-source statically imports template-sources\.json/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('analyzer discovery skips absent artifacts by default and fails closed when required', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase11-analyzer-'));

  try {
    await writePassingShellFixture(dir);

    let result = validateShellBundleBaseline({ rootDir: dir, env: {} });
    assert.equal(result.analyzer.status, 'SKIPPED_WITH_CAVEAT');
    assert.equal(result.status, 'PASS');

    result = validateShellBundleBaseline({
      rootDir: dir,
      env: { PHASE11_REQUIRE_ANALYZER: '1' },
    });
    assert.equal(result.status, 'FAIL');
    assert.equal(result.analyzer.status, 'FAIL');
    assert.match(
      result.failures.join('\n'),
      /analyzer artifacts are absent and PHASE11_REQUIRE_ANALYZER=1/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('guard output names runtime caveats and required Phase 8-10 commands', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'phase11-output-'));

  try {
    await writePassingShellFixture(dir);
    const result = validateShellBundleBaseline({ rootDir: dir, env: {} });
    const report = JSON.stringify(result, null, 2);

    for (const token of [
      'node',
      '.nvmrc',
      'node_modules',
      'out',
      'analyzer artifacts',
      'npm run app-store:diff',
      'npm run build:analyze:timed',
      'npm run static-output:check',
      'npm run validate:deployment',
    ]) {
      assert.ok(report.includes(token), `missing ${token}`);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

async function writePassingShellFixture(rootDir) {
  const files = {
    '.nvmrc': '20\n',
    'app/[lang]/layout.tsx': [
      "import { LazySearchDialog } from '@/components/docs/LazySearchDialog';",
      "import { Analytics } from '@/components/analytics';",
      "import { GTMBody } from '@/components/analytics/gtm-body';",
      "import { AuthFormProvider } from '@/new-components/AuthForm/AuthFormProvider';",
      "import { AuthForm } from '@/new-components/AuthForm';",
      "import { DeployModalProvider, DeployModal } from '@/new-components/DeployModal';",
      '<Analytics />',
      '<GTMBody />',
      '<AuthFormProvider>',
      '<DeployModalProvider>',
      'RootProvider',
      'SearchDialog: LazySearchDialog',
      '<AuthForm />',
      '<DeployModal />',
    ].join('\n'),
    'components/analytics/index.tsx':
      "export function Analytics() { return null; }\n",
    'components/analytics/gtm-body.tsx':
      "export function GTMBody() { return null; }\n",
    'components/docs/Search.tsx':
      "import { useDocsSearch } from 'fumadocs-core/search/client';\nimport { createTokenizer } from '@orama/tokenizers/mandarin';\nexport function DefaultSearchDialog() { return null; }\n",
    'new-components/AuthForm/AuthFormProvider.tsx':
      'export function AuthFormProvider({ children }) { return children; }\n',
    'new-components/AuthForm/index.tsx':
      "const loadInner = () => import('./AuthFormInner');\nexport function AuthForm() { return null; }\n",
    'new-components/DeployModal/index.tsx':
      "const loadInner = () => import('./DeployModalInner');\nexport function DeployModal() { return null; }\nexport { DeployModalProvider } from './DeployModalContext';\n",
    'new-components/DeployModal/DeployModalContext.tsx':
      "const loadTemplateSource = () => import('@/hooks/use-template-source');\nexport function DeployModalProvider({ children }) { return children; }\nexport function openDeployModal() { return loadTemplateSource(); }\n",
    'hooks/use-template-source.ts':
      "export async function loadTemplateSources() { return import('@/config/template-sources.json'); }\n",
    'new-components/Header.tsx': "'use client';\nexport function Header() { return null; }\n",
    'new-components/Footer/index.tsx':
      "import { StartBuildingButton } from './StartBuildingButton';\nexport function Footer() { return null; }\n",
    'components/header/index.tsx':
      "'use client';\nexport function Header() { return null; }\n",
    'components/footer/index.tsx':
      'export function Footer() { return null; }\n',
  };

  for (const [filePath, content] of Object.entries(files)) {
    const absolutePath = join(rootDir, filePath);
    await mkdir(join(absolutePath, '..'), { recursive: true });
    await writeFile(absolutePath, content);
  }
}
