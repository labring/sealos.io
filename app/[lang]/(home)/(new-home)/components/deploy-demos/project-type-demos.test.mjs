import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, 'project-type-demos.tsx'), 'utf8');
const databaseSource = readFileSync(
  join(__dirname, 'database-demo.tsx'),
  'utf8',
);
const templateSource = readFileSync(
  join(__dirname, 'template-demo.tsx'),
  'utf8',
);
const dockerSource = readFileSync(
  join(__dirname, 'docker-image-demo.tsx'),
  'utf8',
);
const githubSource = readFileSync(
  join(__dirname, 'github-import-demo.tsx'),
  'utf8',
);
const commonSource = readFileSync(
  join(__dirname, 'project-type-demo-common.tsx'),
  'utf8',
);
const demoShellSource = readFileSync(
  join(__dirname, 'deploy-demo-common.tsx'),
  'utf8',
);
const canvasSource = readFileSync(
  join(__dirname, 'deployment-canvas.tsx'),
  'utf8',
);
const timelineSource = readFileSync(
  join(__dirname, 'deployment-timeline.tsx'),
  'utf8',
);

const checks = [
  ['database demo re-export', /export \{ DatabaseDemo/],
  ['template demo re-export', /export \{ TemplateDemo/],
  ['database canvas screen', /screen: 'canvas'/, databaseSource],
  ['database logs screen', /screen: 'logs'/, databaseSource],
  ['expand button target', /clickTarget: 'expandButton'/, databaseSource],
  ['card configure target', /clickTarget: 'dbCard'/, databaseSource],
  ['metrics target', /clickTarget: 'metricsButton'/, databaseSource],
  ['terminal target', /clickTarget: 'terminalButton'/, databaseSource],
  ['logs target', /clickTarget: 'logsButton'/, databaseSource],
  ['canvas renderer', /function DatabaseCanvas/, databaseSource],
  ['logs renderer', /function DatabaseLogsScreen/, databaseSource],
  [
    'terminal keeps metrics panel',
    /showMetricsPanel[\s\S]*showTerminalPanel/,
    databaseSource,
  ],
  ['extended database demo prop', /extended\?: boolean/, databaseSource],
  [
    'base database demo enters timeline',
    /const baseDatabaseSteps = \[[\s\S]*databaseTimelineSteps/,
    databaseSource,
  ],
  [
    'extended database demo skips mode picker',
    /const extendedDatabaseSteps = databaseSteps\.slice\(2\)/,
    databaseSource,
  ],
  [
    'database demo thin chrome prop',
    /shellChrome\?: 'browser' \| 'thin'/,
    databaseSource,
  ],
  [
    'database demo forwards shell chrome',
    /shellChrome=\{shellChrome\}/,
    databaseSource,
  ],
  [
    'select trigger keeps stable background',
    /border-white\/\[0\.08\] bg-black\/20[\s\S]*pressed \|\| ready/,
    commonSource,
  ],
  [
    'configure form uses app title',
    /title=\{isMetrics \? 'orders-api Metrics' : 'Orders-api'\}/,
    databaseSource,
  ],
  [
    'configure form sections',
    /Replicas & Resources[\s\S]*Storage[\s\S]*Connection Address/,
    databaseSource,
  ],
  [
    'terminal panel is bottom widget',
    /right-0 bottom-0 left-0 z-40 h-\[267px\] border-t/,
    databaseSource,
  ],
  [
    'expand button is 32px icon only',
    /aria-label="Expand database card"[\s\S]*top-0 -left-9[\s\S]*size-8/,
    databaseSource,
  ],
  [
    'canvas shifts farther for form panels',
    /x: panelOpen \? -220 : 0/,
    databaseSource,
  ],
  [
    'database side panel uses shared floating panel dimensions',
    /top-\[46px\] right-0 bottom-0 z-20 w-full max-w-lg overflow-hidden rounded-t-xl rounded-r-none border-t border-l/,
    databaseSource,
  ],
  [
    'metrics use area charts',
    /function MetricAreaChart[\s\S]*<svg[\s\S]*MetricStorageCard/,
    databaseSource,
  ],
  ['storage bar is tall', /h-\[24px\][\s\S]*w-\[33%\]/, databaseSource],
  [
    'logs screen is full screen',
    /flex h-full flex-col[\s\S]*bg-\[#0A0A0A\][\s\S]*Logs[\s\S]*orders-api[\s\S]*Search[\s\S]*grid h-9 grid-cols-\[145px_1fr_76px_86px\]/,
    databaseSource,
  ],
  [
    'logs use canvas gradient background',
    /radial-gradient\(50%_50%_at_50%_50%,rgba\(29,78,216,0\.2\)_0%,rgba\(10,10,10,0\.2\)_100%\)/,
    databaseSource,
  ],
  ['logs chart has wave path', /C70 28 92 18 152 22/, databaseSource],
  [
    'logs final hold is 3s',
    /duration: 3000,[\s\S]*screen: 'logs'/,
    databaseSource,
  ],
  ['docker enters timeline after deploy', /screen: 'ready'/, dockerSource],
  [
    'database enters timeline after deploy',
    /DeploymentTimeline[\s\S]*databaseTimeline/,
    databaseSource,
  ],
  [
    'template enters timeline after deploy',
    /DeploymentTimeline[\s\S]*templateTimeline/,
    templateSource,
  ],
  [
    'docker timeline has Figma resource',
    /Container workload has 1\/1 ready replicas/,
    timelineSource,
  ],
  [
    'database timeline has Figma resource',
    /DB Service is Creating\./,
    timelineSource,
  ],
  [
    'template timeline has Figma resource',
    /fastgpt-jwfjfh-plugin/,
    timelineSource,
  ],
  [
    'demo shell accepts background canvas',
    /background\?: ReactNode[\s\S]*\{background\}/,
    demoShellSource,
  ],
  [
    'demo shell can slide form panel closed',
    /floatingPanelOpen = true[\s\S]*animate=\{\{ opacity: open \? 1 : 0, x: open \? 0 : 360 \}\}/,
    demoShellSource,
  ],
  [
    'github ready screen uses deployment canvas',
    /DeploymentCanvas[\s\S]*readyStage=\{readyStage \?\? 0\}[\s\S]*shifted=\{!step\.formClosed\}[\s\S]*variant="github"/,
    githubSource,
  ],
  [
    'docker ready screen uses deployment canvas',
    /DeploymentCanvas[\s\S]*readyStage=\{readyStage \?\? 0\}[\s\S]*shifted=\{!step\.formClosed\}[\s\S]*variant="docker"/,
    dockerSource,
  ],
  [
    'database ready screen uses deployment canvas',
    /DeploymentCanvas[\s\S]*readyStage=\{readyStage \?\? 0\}[\s\S]*shifted=\{!step\.formClosed\}[\s\S]*variant="database"/,
    databaseSource,
  ],
  [
    'template ready screen uses deployment canvas',
    /DeploymentCanvas[\s\S]*readyStage=\{readyStage \?\? 0\}[\s\S]*shifted=\{!step\.formClosed\}[\s\S]*variant="template"/,
    templateSource,
  ],
  [
    'demos close timeline form at final step',
    /formClosed: true/,
    githubSource + dockerSource + databaseSource + templateSource,
  ],
  [
    'demos pass final form close to shell',
    /floatingPanelOpen=\{!step\.formClosed\}/,
    githubSource + dockerSource + databaseSource + templateSource,
  ],
  [
    'canvas has Figma card names',
    /open-seo-nzbmvj[\s\S]*orders-api[\s\S]*fastgpt-jwfifh/,
    canvasSource,
  ],
  [
    'canvas stages follow timeline',
    /showRuntime = readyStage >= 4[\s\S]*showAccess = accessStage !== undefined && readyStage >= accessStage/,
    canvasSource,
  ],
  [
    'canvas uses free fixed coordinate plane',
    /absolute inset-0[\s\S]*h-\[601px\] w-\[744px\][\s\S]*style=\{\{ left: config\.runtime\.x, top: config\.runtime\.y \}\}/,
    canvasSource,
  ],
  [
    'canvas connectors use Figma coordinates',
    /data-deployment-connector[\s\S]*style=\{\{ left: config\.line\.x, top: config\.line\.y \}\}/,
    canvasSource,
  ],
  [
    'canvas shifts left while form is open',
    /shifted\?: boolean[\s\S]*animate=\{\{ x: shifted \? -220 : 0 \}\}/,
    canvasSource,
  ],
];

for (const [name, pattern, target = source] of checks) {
  assert.match(target, pattern, name);
}

console.log(
  `project-type-demos checks passed: ${checks.length}/${checks.length}`,
);
