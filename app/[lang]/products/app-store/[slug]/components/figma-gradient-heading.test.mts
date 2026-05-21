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
const heroSource = readFileSync(join(componentDir, 'AppDetailHero.tsx'), 'utf8');
const appPreviewSource = readFileSync(
  join(componentDir, 'AppPreviewPanel.tsx'),
  'utf8',
);
const readmeSource = readFileSync(
  join(componentDir, 'ReadmePreview.tsx'),
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
  assert.match(sectionHeadingSource, /w-fit/);
  assert.match(sectionHeadingSource, /from-white to-\[#146DFF\]/);
});

test('README uses the Figma early-blue gradient stop on the wide Figma text layer', () => {
  assert.match(readmeSource, /figmaDetailHeadingClassName/);
  assert.match(readmeSource, /earlyBlue: true/);
  assert.match(readmeSource, /wideLayer: true/);
  assert.match(relatedSource, /figmaDetailHeadingClassName/);
});

test('README fallback app preview does not render a nested mac chrome', () => {
  assert.match(readmeSource, /showChrome=\{false\}/);
  assert.match(readmeSource, /variant="readme"/);
  assert.match(appPreviewSource, /showChrome\?: boolean/);
  assert.match(appPreviewSource, /showChrome = true/);
});

test('README fallback app preview uses the taller Figma readme ratio', () => {
  assert.match(appPreviewSource, /variant\?: 'default' \| 'hero' \| 'readme'/);
  assert.match(appPreviewSource, /readmePanelClassName/);
  assert.match(appPreviewSource, /aspect-\[1253\/671\]/);
  assert.match(appPreviewSource, /min-h-\[520px\]/);
  assert.match(readmeSource, /p-5 sm:p-6/);
});

test('README browser bar is labeled README.md while its preview uses the Sealos URL', () => {
  assert.doesNotMatch(readmeSource, /import \{ Globe \} from 'lucide-react'/);
  assert.doesNotMatch(readmeSource, /<Globe className="h-2\.5 w-2\.5 text-zinc-400" \/>/);
  assert.match(readmeSource, /README\.md/);
  assert.match(readmeSource, /displayUrl="https:\/\/sealos\.io"/);
  assert.match(appPreviewSource, /displayUrl\?: string/);
  assert.match(
    appPreviewSource,
    /displayUrl \|\| app\.website \|\| app\.github \|\| `\/\$\{app\.slug\}`/,
  );
});

test('README screenshot preview crops away the captured page chrome', () => {
  assert.match(readmeSource, /readmeScreenshotImageClassName/);
  assert.match(
    readmeSource,
    /relative aspect-\[16\/9\] min-h-\[260px\] overflow-hidden opacity-90/,
  );
  assert.match(readmeSource, /className=\{readmeScreenshotImageClassName\}/);
  assert.match(readmeSource, /-translate-y-\[/);
  assert.match(readmeSource, /scale-\[/);
  assert.doesNotMatch(readmeSource, /className="object-cover"/);
});

test('app preview chrome uses a globe icon and the Sealos URL', () => {
  assert.match(appPreviewSource, /import \{ Globe \} from 'lucide-react'/);
  assert.match(appPreviewSource, /<Globe className="h-2\.5 w-2\.5 text-zinc-400" \/>/);
  assert.match(appPreviewSource, /sealos\.io/);
  assert.doesNotMatch(appPreviewSource, /\{app\.name\}\.yaml/);
});

test('hero app preview uses the first app screenshot before falling back to generated content', () => {
  assert.match(appPreviewSource, /import Image from 'next\/image'/);
  assert.match(appPreviewSource, /const primaryScreenshot = app\.screenshots\?\.\[0\]/);
  assert.match(appPreviewSource, /heroScreenshotImageClassName/);
  assert.match(appPreviewSource, /variant === 'hero' && primaryScreenshot/);
  assert.match(appPreviewSource, /src=\{primaryScreenshot\}/);
  assert.match(appPreviewSource, /alt=\{`\$\{app\.name\} screenshot`\}/);
  assert.match(appPreviewSource, /className=\{heroScreenshotImageClassName\}/);
  assert.match(appPreviewSource, /-translate-y-\[5%\]/);
  assert.match(appPreviewSource, /scale-\[1\.28\]/);
});

test('related template cards do not show category labels', () => {
  assert.doesNotMatch(relatedSource, /getTagLabel/);
  assert.doesNotMatch(relatedSource, /\{app\.category\}/);
  assert.match(relatedSource, /formatAppCount\(deployCount\)/);
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
  assert.match(heroSource, /textLinkClassName\(variant: 'primary' \| 'default'/);
  assert.match(heroSource, /primary'\s*\?\s*'text-white hover:text-\[#69a3ff\]'/);
  assert.match(heroSource, /className=\{textLinkClassName\('primary'\)\}/);
});

test('hero README link points to the app GitHub README when available', () => {
  assert.match(heroSource, /getReadmeUrl/);
  assert.match(heroSource, /const readmeUrl = getReadmeUrl\(app\.github\)/);
  assert.match(heroSource, /href=\{readmeUrl\}/);
  assert.match(heroSource, /target=\{app\.github \? '_blank' : undefined\}/);
  assert.match(heroSource, /rel=\{app\.github \? 'noopener noreferrer' : undefined\}/);
  assert.doesNotMatch(heroSource, /<a href="#readme" className=\{textLinkClassName\(\)\}>/);
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
  assert.match(heroSource, /variant="hero"/);
  assert.match(heroSource, /<div className="relative z-10 mx-auto grid/);
  assert.match(heroSource, /mb-7 flex items-center gap-5 lg:hidden/);
  assert.match(heroSource, /mt-6 flex flex-wrap items-center gap-2/);
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
  for (const source of [heroSource, wholeStackSource, whyDeploySource]) {
    assert.match(
      source,
      /import \{ GradientLucideIcon \} from '@\/new-components\/GradientLucideIcon'/,
    );
    assert.match(source, /CircleCheck/);
  }

  assert.doesNotMatch(heroSource, /<CheckCircle2 className="h-3\.5 w-3\.5 text-\[#69a3ff\]"/);
  assert.doesNotMatch(wholeStackSource, /<CheckCircle2 className="h-4 w-4 text-\[#69a3ff\]"/);
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
  assert.doesNotMatch(
    wholeStackSource,
    /\[&:nth-child\(2n\)\]:sm:border-r-0/,
  );
});
