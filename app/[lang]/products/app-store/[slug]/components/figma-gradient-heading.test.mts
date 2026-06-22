import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const componentDir = dirname(fileURLToPath(import.meta.url));

const sectionHeadingSource = readFileSync(
  join(componentDir, 'SectionHeading.tsx'),
  'utf8',
);
const heroSource = readFileSync(
  join(componentDir, 'AppDetailHero.tsx'),
  'utf8',
);
const pageSource = readFileSync(join(componentDir, '../page.tsx'), 'utf8');
const appPreviewSource = readFileSync(
  join(componentDir, 'AppPreviewPanel.tsx'),
  'utf8',
);
const readmeSource = readFileSync(
  join(componentDir, 'ReadmePreview.tsx'),
  'utf8',
);
const readmeWindowSource = readFileSync(
  join(componentDir, 'ReadmeMarkdownWindow.tsx'),
  'utf8',
);
const relatedSource = readFileSync(
  join(componentDir, 'RelatedTemplates.tsx'),
  'utf8',
);
const whyDeploySource = readFileSync(
  join(componentDir, 'WhyDeployOnSealos.tsx'),
  'utf8',
);
const wholeStackSource = readFileSync(
  join(componentDir, 'WholeStackSection.tsx'),
  'utf8',
);

test('section headings use a single Figma gradient text layer instead of split blue text', () => {
  assert.doesNotMatch(sectionHeadingSource, /blueText/);
  assert.match(sectionHeadingSource, /figmaDetailHeadingClassName/);
  assert.match(sectionHeadingSource, /GradientText/);
  assert.match(sectionHeadingSource, /w-fit/);
  assert.match(sectionHeadingSource, /to-\[#146DFF\]/);
});

test('README uses the Figma early-blue gradient stop on the wide Figma text layer', () => {
  assert.match(readmeSource, /figmaDetailHeadingClassName/);
  assert.match(readmeSource, /earlyBlue: true/);
  assert.match(readmeSource, /wideLayer: true/);
  assert.match(relatedSource, /figmaDetailHeadingClassName/);
});

test('README section renders a real GitHub markdown preview window', () => {
  assert.match(readmeSource, /ReadmeMarkdownWindow/);
  assert.match(readmeWindowSource, /ReactMarkdown/);
  assert.match(readmeWindowSource, /remarkGfm/);
  assert.match(readmeWindowSource, /fetchReadme/);
  assert.match(readmeWindowSource, /raw\.githubusercontent\.com/);
  assert.match(readmeWindowSource, /overflow-y-auto/);
  assert.doesNotMatch(readmeSource, /showChrome=\{false\}/);
  assert.doesNotMatch(readmeSource, /variant="readme"/);
});

test('README markdown preview resolves GitHub images and relative links', () => {
  assert.match(readmeWindowSource, /normalizeGitHubMarkdown/);
  assert.match(readmeWindowSource, /<img\\b/);
  assert.match(readmeWindowSource, /resolveMarkdownUrl/);
  assert.match(readmeWindowSource, /ReadmeCandidate/);
  assert.match(readmeWindowSource, /rawAssetBaseUrl/);
  assert.match(readmeWindowSource, /blobBaseUrl/);
});

test('README markdown preview tries docs README before falling back to the screenshot', () => {
  assert.match(readmeWindowSource, /README_DIRECTORIES = \['', 'docs'\]/);
  assert.match(readmeWindowSource, /sourcePath: pathParts\.join\('\/'\)/);
  assert.match(
    readmeWindowSource,
    /const screenshot = app\.screenshots\?\.\[0\]/,
  );
  assert.match(readmeWindowSource, /alt=\{`\$\{app\.name\} screenshot`\}/);
  assert.doesNotMatch(readmeWindowSource, /README preview unavailable/);
  assert.doesNotMatch(
    readmeWindowSource,
    /README\.md was not found in the GitHub repository/,
  );
});

test('README markdown preview prefers the readme URL stored on the app config', () => {
  assert.match(readmeWindowSource, /buildDirectReadmeSource/);
  assert.match(
    readmeWindowSource,
    /Pick<AppDetailConfig, 'readme' \| 'github' \| 'website'>/,
  );
  assert.match(
    readmeWindowSource,
    /getReadmeSource\(\{[\s\S]*readme: app\.readme,[\s\S]*github: app\.github,[\s\S]*website: app\.website,[\s\S]*\}\)/,
  );
  assert.match(readmeWindowSource, /export async function loadReadmeMarkdown/);
});

test('README markdown preview does not render the source metadata row', () => {
  assert.doesNotMatch(readmeWindowSource, /Rendered from/);
  assert.doesNotMatch(readmeWindowSource, /readmeSource\.repoLabel/);
  assert.doesNotMatch(readmeWindowSource, /readmeSource\.repoUrl/);
});

test('README markdown is loaded before rendering the static app detail page', () => {
  assert.doesNotMatch(readmeWindowSource, /'use client'/);
  assert.doesNotMatch(readmeWindowSource, /useEffect/);
  assert.doesNotMatch(readmeWindowSource, /useState/);
  assert.doesNotMatch(readmeWindowSource, /Loading README from GitHub/);
  assert.match(readmeWindowSource, /export async function loadReadmeMarkdown/);
  assert.match(pageSource, /const readme = await loadReadmeMarkdown\(app\)/);
  assert.match(pageSource, /<ReadmePreview app=\{app\} readme=\{readme\} \/>/);
});

test('README browser bar is labeled README.md', () => {
  assert.doesNotMatch(readmeSource, /import \{ Globe \} from 'lucide-react'/);
  assert.doesNotMatch(
    readmeSource,
    /<Globe className="h-2\.5 w-2\.5 text-zinc-400" \/>/,
  );
  assert.match(readmeSource, /README\.md/);
  assert.match(appPreviewSource, /displayUrl\?: string/);
  assert.match(
    appPreviewSource,
    /displayUrl \|\| app\.website \|\| app\.github \|\| `\/\$\{app\.slug\}`/,
  );
});

test('app preview chrome uses a globe icon and the Sealos URL', () => {
  assert.match(appPreviewSource, /import \{ Globe \} from 'lucide-react'/);
  assert.match(
    appPreviewSource,
    /<Globe className="h-2\.5 w-2\.5 text-zinc-400" \/>/,
  );
  assert.match(appPreviewSource, /sealos\.io/);
  assert.doesNotMatch(appPreviewSource, /\{app\.name\}\.yaml/);
});

test('hero app preview uses the first app screenshot before falling back to generated content', () => {
  assert.match(appPreviewSource, /import Image from 'next\/image'/);
  assert.match(
    appPreviewSource,
    /const primaryScreenshot = app\.screenshots\?\.\[0\]/,
  );
  assert.match(appPreviewSource, /heroScreenshotImageClassName/);
  assert.match(appPreviewSource, /variant === 'hero' && primaryScreenshot/);
  assert.match(appPreviewSource, /src=\{primaryScreenshot\}/);
  assert.match(appPreviewSource, /alt=\{`\$\{app\.name\} screenshot`\}/);
  assert.match(appPreviewSource, /className=\{heroScreenshotImageClassName\}/);
  assert.match(appPreviewSource, /-translate-y-\[5%\]/);
  assert.match(appPreviewSource, /scale-\[1\.28\]/);
});

test('related template cards show category labels instead of deploy counts', () => {
  assert.match(relatedSource, /\{app\.category\}/);
  assert.doesNotMatch(relatedSource, /getDeployCount/);
  assert.doesNotMatch(relatedSource, /formatAppCount/);
  assert.doesNotMatch(relatedSource, /\bdeployCount\b/);
  assert.doesNotMatch(relatedSource, /\bhasDeployCount\b/);
});

test('related templates more link turns blue on hover', () => {
  assert.match(
    relatedSource,
    /className="inline-flex items-center gap-2 text-sm text-zinc-200 transition hover:text-\[#69a3ff\]"/,
  );
});

test('hero title applies a continuous gradient over app name, on, and Sealos', () => {
  assert.match(heroSource, /heroTitleAccentClassName/);
  assert.match(heroSource, /\{app\.name\}/);
  assert.match(heroSource, /\{app\.name\} on Sealos/);
  assert.doesNotMatch(heroSource, /\{app\.name\}<\/span> on/);
});

test('hero title uses the smaller Figma detail-page heading scale', () => {
  assert.match(heroSource, /sm:text-\[36px\]/);
  assert.match(heroSource, /lg:text-\[36px\]/);
  assert.match(heroSource, /lg:leading-\[1\.18\]/);
  assert.doesNotMatch(heroSource, /lg:text-\[52px\]/);
  assert.doesNotMatch(heroSource, /sm:text-5xl/);
});

test('official website link is white by default and blue on hover', () => {
  assert.match(
    heroSource,
    /textLinkClassName\(variant: 'primary' \| 'default'/,
  );
  assert.match(
    heroSource,
    /primary'\s*\?\s*'text-white hover:text-\[#69a3ff\]'/,
  );
  assert.match(heroSource, /className=\{textLinkClassName\('primary'\)\}/);
});

test('hero README link jumps to the README section on the current page', () => {
  assert.doesNotMatch(heroSource, /getReadmeUrl/);
  assert.match(heroSource, /href="#readme"/);
  assert.doesNotMatch(
    heroSource,
    /target=\{app\.github \? '_blank' : undefined\}/,
  );
  assert.doesNotMatch(
    heroSource,
    /rel=\{app\.github \? 'noopener noreferrer' : undefined\}/,
  );
});

test('hero action row does not render the trailing tag pill', () => {
  assert.doesNotMatch(heroSource, /getTagLabel/);
  assert.doesNotMatch(
    heroSource,
    /inline-flex rounded-full bg-white\/\[\0\.045\]/,
  );
});

test('hero metadata row does not render a deploy count pill', () => {
  assert.doesNotMatch(heroSource, /getDeployCount/);
  assert.doesNotMatch(heroSource, /formatAppCount\(deployCount\)/);
  assert.doesNotMatch(heroSource, /hasDeployCount/);
  assert.doesNotMatch(heroSource, /<Star className="h-3 w-3/);
});

test('hero uses the Figma center-logo composition on desktop', () => {
  assert.match(heroSource, /heroCenterLogoClassName/);
  assert.match(heroSource, /left-\[609px\]/);
  assert.match(heroSource, /top-9/);
  assert.match(heroSource, /hidden lg:flex/);
  assert.match(heroSource, /rounded-\[5\.235px\]/);
  assert.match(heroSource, /border-\[0\.5px\]/);
  assert.match(heroSource, /border-transparent/);
  assert.match(heroSource, /heroCenterLogoBorderStyle/);
  assert.match(heroSource, /linear-gradient\(#0A0A0A, #0A0A0A\) padding-box/);
  assert.match(
    heroSource,
    /linear-gradient\(109\.08deg, #FFFFFF 0\.55%, rgba\(255, 255, 255, 0\) 26\.65%\) border-box/,
  );
  assert.match(
    heroSource,
    /linear-gradient\(285\.16deg, #FFFFFF 0%, rgba\(255, 255, 255, 0\) 8\.87%\) border-box/,
  );
  assert.match(
    heroSource,
    /linear-gradient\(0deg, rgba\(255, 255, 255, 0\.15\), rgba\(255, 255, 255, 0\.15\)\) border-box/,
  );
  assert.match(heroSource, /variant="hero"/);
  assert.match(heroSource, /<div className="relative z-10 mx-auto grid/);
  assert.match(heroSource, /mb-7 flex items-center gap-5 lg:hidden/);
  assert.match(heroSource, /mt-6 flex flex-wrap items-center gap-2/);
});

test('hero uses compact Figma spacing before the next detail section', () => {
  assert.match(heroSource, /pb-16/);
  assert.match(heroSource, /md:pb-20/);
  assert.match(heroSource, /lg:pb-20/);
  assert.doesNotMatch(heroSource, /lg:min-h-\[820px\]/);
  assert.doesNotMatch(heroSource, /md:pb-28/);
});

test('hero does not draw the blue connector line between logo and preview', () => {
  assert.doesNotMatch(heroSource, /heroConnectorClassName/);
  assert.doesNotMatch(heroSource, /border-\[#146DFF\]\/25/);
  assert.doesNotMatch(heroSource, /border-b border-l/);
});

test('hero preview panel uses a compact Figma browser ratio', () => {
  assert.match(appPreviewSource, /variant\?: 'default' \| 'hero' \| 'readme'/);
  assert.match(appPreviewSource, /heroPanelClassName/);
  assert.match(appPreviewSource, /heroTitleClassName/);
});

test('why deploy diagram uses the Sealos logo at the center', () => {
  assert.match(whyDeploySource, /import Image from 'next\/image'/);
  assert.match(
    whyDeploySource,
    /import SealosLogo from '@\/assets\/shared-icons\/sealos\.svg'/,
  );
  assert.match(whyDeploySource, /alt="Sealos logo"/);
  assert.doesNotMatch(whyDeploySource, /\bNetwork\b/);
});

test('why deploy diagram does not add an outer background mask', () => {
  assert.doesNotMatch(
    whyDeploySource,
    /bg-\[radial-gradient\(circle_at_48%_42%,rgba\(20,109,255,0\.18\),transparent_44%\)\]/,
  );
  assert.doesNotMatch(
    whyDeploySource,
    /rounded-2xl border border-white\/10 bg-white\/\[0\.025\]/,
  );
  assert.doesNotMatch(
    whyDeploySource,
    /shadow-\[inset_0_1px_0_rgba\(255,255,255,0\.04\)\]/,
  );
});

test('why deploy diagram cards use the Figma gradient border treatment', () => {
  assert.match(whyDeploySource, /gradientBorderStyle/);
  assert.match(whyDeploySource, /diagramCardClassName/);
  assert.match(whyDeploySource, /diagramTopCardClassName/);
  assert.match(whyDeploySource, /diagramResourceGridClassName/);
  assert.match(whyDeploySource, /diagramLiveCardClassName/);
  assert.match(whyDeploySource, /border-\[0\.5px\] border-transparent/);
  assert.match(
    whyDeploySource,
    /linear-gradient\(#0A0A0A, #0A0A0A\) padding-box/,
  );
  assert.match(
    whyDeploySource,
    /linear-gradient\(109\.08deg, #FFFFFF 0\.55%, rgba\(255, 255, 255, 0\) 26\.65%\) border-box/,
  );
  assert.match(
    whyDeploySource,
    /linear-gradient\(285\.16deg, #FFFFFF 0%, rgba\(255, 255, 255, 0\) 8\.87%\) border-box/,
  );
  assert.match(
    whyDeploySource,
    /linear-gradient\(0deg, rgba\(255, 255, 255, 0\.15\), rgba\(255, 255, 255, 0\.15\)\) border-box/,
  );
  assert.match(
    whyDeploySource,
    /index > 0 \? 'border-l border-white\/10' : ''/,
  );
  assert.match(whyDeploySource, /className=\{diagramResourceGridClassName\}/);
  assert.match(
    whyDeploySource,
    /className="flex h-10 items-center gap-3 px-4 text-sm font-semibold text-white"/,
  );
  assert.doesNotMatch(whyDeploySource, /resourceIcons\.map\(\(item\) =>/);
  assert.doesNotMatch(
    whyDeploySource,
    /className=\{`\$\{diagramCardClassName\} flex min-h-\[74px\]/,
  );
  assert.doesNotMatch(
    whyDeploySource,
    /flex h-10 items-center gap-3 rounded-lg bg-white\/\[0\.055\]/,
  );
  assert.doesNotMatch(
    whyDeploySource,
    /border border-white\/10 bg-white\/\[0\.035\]/,
  );
  assert.doesNotMatch(
    whyDeploySource,
    /border border-white\/10 bg-white\/\[0\.04\]/,
  );
});

test('detail sections use Figma-like vertical rhythm instead of stacked wide padding', () => {
  for (const source of [
    whyDeploySource,
    wholeStackSource,
    readmeSource,
    relatedSource,
  ]) {
    assert.doesNotMatch(source, /lg:py-28/);
  }

  assert.match(
    whyDeploySource,
    /className="mx-auto max-w-7xl px-6 pt-14 pb-16 lg:px-8 lg:pt-16 lg:pb-24"/,
  );
  assert.match(
    wholeStackSource,
    /className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:px-8 lg:pt-14 lg:pb-24"/,
  );
  assert.match(
    readmeSource,
    /className="mx-auto max-w-\[1300px\] px-6 pt-12 pb-16 lg:px-8 lg:pt-16 lg:pb-24"/,
  );
  assert.match(
    relatedSource,
    /className="mx-auto max-w-7xl px-6 pt-12 pb-16 lg:px-8 lg:pt-14 lg:pb-20"/,
  );
});

test('why deploy step icons are white by default and blue on hover', () => {
  assert.match(whyDeploySource, /className="group grid gap-5 py-7/);
  assert.match(
    whyDeploySource,
    /text-white transition-colors group-hover:text-\[#69a3ff\]/,
  );
  assert.doesNotMatch(
    whyDeploySource,
    /justify-center rounded-lg bg-white\/\[\0\.055\] text-\[#69a3ff\]/,
  );
});

test('why deploy step icons match the Figma icon set', () => {
  for (const iconName of [
    'MousePointerClick',
    'GlobeLock',
    'DatabaseZap',
    'LayoutGrid',
  ]) {
    assert.match(whyDeploySource, new RegExp(`\\b${iconName}\\b`));
  }

  assert.match(
    whyDeploySource,
    /import K8sLogo from '@\/assets\/stacks-appicons\/kubernetes\.svg'/,
  );
  assert.match(whyDeploySource, /iconType: 'k8s'/);
  assert.doesNotMatch(whyDeploySource, /\bGauge\b/);
  assert.doesNotMatch(whyDeploySource, /\bLayers\b/);
  assert.doesNotMatch(
    whyDeploySource,
    /title: 'One-Click Deployment'[\s\S]*icon: Grid2X2/,
  );
});

test('why deploy live status uses the Figma green CircleCheckBig icon', () => {
  assert.match(whyDeploySource, /CircleCheckBig/);
  assert.match(
    whyDeploySource,
    /<CircleCheckBig className="h-6 w-6 text-\[#22C55E\]" \/>/,
  );
  assert.doesNotMatch(
    whyDeploySource,
    /<GradientLucideIcon[\s\S]*Your Application is Live/,
  );
});

test('whole stack summary bullets use tick icons', () => {
  assert.match(wholeStackSource, /GradientLucideIcon/);
  assert.match(wholeStackSource, /CircleCheck/);
  assert.match(
    wholeStackSource,
    /<GradientLucideIcon Icon=\{CircleCheck\} className="h-4 w-4 shrink-0" \/>/,
  );
  assert.doesNotMatch(
    wholeStackSource,
    /h-3 w-3 rounded-full border border-\[#69a3ff\]\/60/,
  );
});

test('detail page confirmation ticks reuse the homepage gradient check style', () => {
  for (const source of [heroSource, wholeStackSource]) {
    assert.match(
      source,
      /import \{ GradientLucideIcon \} from '@\/new-components\/GradientLucideIcon'/,
    );
    assert.match(source, /CircleCheck/);
  }

  assert.doesNotMatch(
    heroSource,
    /<CheckCircle2 className="h-3\.5 w-3\.5 text-\[#69a3ff\]"/,
  );
  assert.doesNotMatch(
    wholeStackSource,
    /<CheckCircle2 className="h-4 w-4 text-\[#69a3ff\]"/,
  );
  assert.doesNotMatch(whyDeploySource, /<CheckCircle2 className="h-4 w-4" \/>/);
});

test('whole stack card icons are white until their card is hovered', () => {
  assert.match(wholeStackSource, /className=\{cn\(/);
  assert.match(
    wholeStackSource,
    /'group min-h-\[236px\] border-white\/10 bg-white\/\[0\.025\] p-7 transition hover:bg-white\/\[0\.045\]'/,
  );
  assert.match(
    wholeStackSource,
    /text-white transition-colors group-hover:text-\[#69a3ff\]/,
  );
  assert.doesNotMatch(
    wholeStackSource,
    /justify-center rounded-lg bg-white\/\[\0\.055\] text-\[#69a3ff\]/,
  );
});

test('whole stack card borders account for two-column and three-column layouts separately', () => {
  assert.match(
    wholeStackSource,
    /index % 2 === 0 \? 'sm:border-r' : 'sm:border-r-0'/,
  );
  assert.match(
    wholeStackSource,
    /index % 3 !== 2 \? 'lg:border-r' : 'lg:border-r-0'/,
  );
  assert.doesNotMatch(wholeStackSource, /\[&:nth-child\(2n\)\]:sm:border-r-0/);
});
