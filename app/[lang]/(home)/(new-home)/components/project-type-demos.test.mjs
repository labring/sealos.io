import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(__dirname, 'project-type-demos.tsx'), 'utf8');

const checks = [
  ['database canvas screen', /screen: 'canvas'/],
  ['database logs screen', /screen: 'logs'/],
  ['expand button target', /clickTarget: 'expandButton'/],
  ['card configure target', /clickTarget: 'dbCard'/],
  ['metrics target', /clickTarget: 'metricsButton'/],
  ['terminal target', /clickTarget: 'terminalButton'/],
  ['logs target', /clickTarget: 'logsButton'/],
  ['canvas renderer', /function DatabaseCanvas/],
  ['logs renderer', /function DatabaseLogsScreen/],
  ['terminal keeps metrics panel', /showMetricsPanel[\s\S]*showTerminalPanel/],
  ['extended database demo prop', /extended\?: boolean/],
  [
    'base database demo keeps old loop',
    /const baseDatabaseSteps = databaseSteps\.slice\(0, 11\)/,
  ],
  [
    'extended database demo skips mode picker',
    /const extendedDatabaseSteps = databaseSteps\.slice\(2\)/,
  ],
  ['database demo thin chrome prop', /shellChrome\?: 'browser' \| 'thin'/],
  ['database demo forwards shell chrome', /shellChrome=\{shellChrome\}/],
  [
    'select trigger keeps stable background',
    /border-white\/\[0\.08\] bg-black\/20[\s\S]*pressed \|\| ready/,
  ],
  [
    'configure form uses app title',
    /title=\{isMetrics \? 'orders-api Metrics' : 'Orders-api'\}/,
  ],
  [
    'configure form sections',
    /Replicas & Resources[\s\S]*Storage[\s\S]*Connection Address/,
  ],
  [
    'terminal panel is bottom widget',
    /right-0 bottom-0 left-0 z-40 h-\[267px\] border-t/,
  ],
  [
    'expand button is 32px icon only',
    /aria-label="Expand database card"[\s\S]*top-0 -left-9[\s\S]*size-8/,
  ],
  ['canvas shifts farther for form panels', /x: panelOpen \? -220 : 0/],
  [
    'database side panel uses shared floating panel dimensions',
    /top-\[46px\] right-0 bottom-0 z-20 w-full max-w-lg overflow-hidden rounded-t-xl rounded-r-none border-t border-l/,
  ],
  [
    'metrics use area charts',
    /function MetricAreaChart[\s\S]*<svg[\s\S]*MetricStorageCard/,
  ],
  ['storage bar is tall', /h-\[24px\][\s\S]*w-\[33%\]/],
  [
    'logs screen is full screen',
    /flex h-full flex-col[\s\S]*bg-\[#0A0A0A\][\s\S]*Logs[\s\S]*orders-api[\s\S]*Search[\s\S]*grid h-9 grid-cols-\[145px_1fr_76px_86px\]/,
  ],
  [
    'logs use canvas gradient background',
    /radial-gradient\(50%_50%_at_50%_50%,rgba\(29,78,216,0\.2\)_0%,rgba\(10,10,10,0\.2\)_100%\)/,
  ],
  ['logs chart has wave path', /C70 28 92 18 152 22/],
  ['logs final hold is 3s', /duration: 3000,[\s\S]*screen: 'logs'/],
];

for (const [name, pattern] of checks) {
  assert.match(source, pattern, name);
}

console.log(
  `project-type-demos checks passed: ${checks.length}/${checks.length}`,
);
