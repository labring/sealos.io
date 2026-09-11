import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { setTimeout } from 'node:timers/promises';

const require = createRequire(import.meta.url);

// Poll from Node because page timers are disabled in the static-content scenario.
async function waitForBrowserCheck(check, message) {
  for (let attempt = 0; attempt < 1200; attempt++) {
    if (await check()) return;
    await setTimeout(100);
  }
  assert.fail(message);
}

// APP_STORE_PREVIEW_URL=http://localhost:3410 node --test scripts/eaglercraft-browser.test.mjs
test('Eaglercraft hosting explains the first join and monthly resource plan', async (t) => {
  const base = process.env.APP_STORE_PREVIEW_URL;
  if (!base) return t.skip('Set APP_STORE_PREVIEW_URL to a running preview.');
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL,
  });
  t.after(() => browser.close());
  const page = await browser.newPage({ javaScriptEnabled: false });
  page.setDefaultTimeout(120_000);
  assert.equal(
    (
      await page.goto(`${base}/products/app-store/eaglercraft-server/`)
    ).status(),
    200,
  );
  assert.equal(
    await page.locator('h1').innerText(),
    'Eaglercraft Server Hosting',
  );
  assert.equal(
    await page
      .getByRole('button', { name: 'Deploy Eaglercraft', exact: true })
      .count(),
    2,
  );
  assert.equal(
    await page
      .getByRole('link', { name: 'See how to join' })
      .getAttribute('href'),
    '#how-to-join',
  );
  for (const width of [1440, 1101, 1100, 900, 801, 800, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const steps = page.locator('#how-to-join ol > li');
    assert.equal(await steps.count(), 4);
    for (const [index, [heading, content]] of [
      ['Choose your version and Administrator Password', ['rcon_password']],
      [
        'Deploy and open the admin console',
        ['/admin', 'Administrator Password'],
      ],
      [
        'Wait for Paper, then join',
        [
          'Paper is ready',
          '/register <player-password>',
          '/login <player-password>',
        ],
      ],
      ['Invite a friend', ['Browser Play Link', 'Player Account']],
    ].entries()) {
      const details = steps.nth(index).locator('details');
      const summary = details.locator('summary');
      assert.ok((await summary.innerText()).includes(heading));
      assert.equal(
        await details.evaluate((element) => element.open),
        index === 0,
      );
      if (index > 0) await summary.press('Enter');
      for (const text of content) {
        assert.ok((await details.innerText()).includes(text), text);
      }
      await summary.press('Space');
      assert.equal(await details.evaluate((element) => element.open), false);
      if (index === 0) await summary.press('Enter');
    }

    const capabilities = page.locator(
      '[aria-labelledby="world-title"] details',
    );
    assert.deepEqual(
      await capabilities.evaluateAll((elements) =>
        elements.map((element) => element.open),
      ),
      [true, false, false, false, false, false],
    );
    for (const [index, [heading, text]] of [
      ['Browser Play Link', 'Friends can play while your browser is closed'],
      ['WebSocket Server Address', 'wss://'],
      ['Administrator Password', '/admin'],
      ['Player Account', 'Register once'],
      ['Persistent World', 'preserve the same volume'],
      ['A separate recovery copy', 'separate backup'],
    ].entries()) {
      const details = capabilities.nth(index);
      const summary = details.locator('summary');
      assert.ok((await summary.innerText()).includes(heading));
      if (index > 0) await summary.press('Enter');
      assert.deepEqual(
        await capabilities.evaluateAll((elements) =>
          elements.map((element) => element.open),
        ),
        Array.from({ length: 6 }, (_, current) => current === index),
      );
      assert.ok((await details.innerText()).includes(text), text);
    }
    await capabilities.first().locator('summary').press('Enter');
    const consoleImage = page.getByRole('img', {
      name: /Sealos deployment admin console/,
    });
    await consoleImage.scrollIntoViewIfNeeded();
    await waitForBrowserCheck(
      () =>
        consoleImage.evaluate((img) => img.complete && img.naturalWidth > 0),
      'The console screenshot must finish loading',
    );
    assert.ok(await consoleImage.isVisible());
    assert.ok(
      await page.getByText(/Template-maintainer screenshot/).isVisible(),
    );
    if (width === 390) {
      const viewport = page.locator('[aria-describedby="console-caption"]');
      await viewport.press('ArrowRight');
      await waitForBrowserCheck(
        () => viewport.evaluate((element) => element.scrollLeft > 0),
        'The focused console screenshot must scroll with the keyboard',
      );
    }
    assert.ok(
      await page
        .getByRole('img', {
          name: /browser through a game server to a persistent world/,
        })
        .isVisible(),
    );
    const pricing = page.locator('#hosting-cost');
    for (const text of [
      'Server Allocation',
      'Resource Plan',
      '0.2 vCPU',
      '1 GiB',
      '$7',
      '$34',
      'first paid-plan purchase',
      '2026-09-10',
      'Cost Center',
      '7-day',
    ]) {
      assert.ok((await pricing.innerText()).includes(text), text);
    }
    assert.equal(await page.locator('#faq h3').count(), 6);
    assert.ok(await page.locator('#faq p').first().isVisible());
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}`,
    );
  }
  assert.equal(
    await page.title(),
    'Eaglercraft Server Hosting: Deploy & Play | Sealos',
  );
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute('href'),
    'https://sealos.io/products/app-store/eaglercraft-server/',
  );
  assert.equal(await page.locator('h1').count(), 1);
  const headings = await page
    .locator('main h1, main h2, main h3, main h4, main h5, main h6')
    .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName[1])));
  assert.ok(
    headings.every((level, i) => i === 0 || level <= headings[i - 1] + 1),
  );
  const schemas = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).flatMap((text) => JSON.parse(text));
  const appSchema = schemas.find(
    (schema) =>
      schema['@type'] === 'SoftwareApplication' &&
      schema.name === 'EaglerCraft Server',
  );
  assert.equal(appSchema.applicationCategory, 'GameApplication');
  assert.equal(appSchema.offers, undefined);
  assert.equal(
    appSchema.description,
    await page.locator('meta[name="description"]').getAttribute('content'),
  );
  assert.ok(schemas.some((schema) => schema['@type'] === 'BreadcrumbList'));
  assert.ok(!schemas.some((schema) => schema['@type'] === 'FAQPage'));
  await page.getByRole('link', { name: 'See how to join' }).focus();
  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).hash, '#how-to-join');
  for (const [name, href] of [
    ['View current plans', 'https://sealos.io/pricing/'],
    [
      'EaglerXserver implementation',
      'https://github.com/yangchuansheng/eaglerXserver',
    ],
    [
      'Release v2.2.7',
      'https://github.com/yangchuansheng/eaglerXserver/releases/tag/v2.2.7',
    ],
    [
      'Current template documentation',
      'https://github.com/labring-actions/templates/blob/kb-0.9/template/eaglercraft-server/README.md',
    ],
  ]) {
    assert.equal(
      await page.getByRole('link', { name, exact: true }).getAttribute('href'),
      href,
    );
  }

  await page.goto(`${base}/zh-cn/products/app-store/eaglercraft-server/`);
  assert.equal(await page.locator('h1').innerText(), 'EaglerCraft Server');
  assert.equal(await page.locator('#how-to-join').count(), 0);
  await waitForBrowserCheck(
    () => page.getByRole('heading', { name: /How to deploy/ }).isVisible(),
    'The Chinese deployment guide must remain visible',
  );

  // Only the external authentication boundary is simulated; the UI and handoff run normally.
  for (const signedIn of [false, true]) {
    const context = await browser.newContext();
    const interactive = await context.newPage();
    interactive.setDefaultTimeout(120_000);
    await context.route('**/api/auth/verifySharedToken', (route) =>
      route.fulfill({
        status: signedIn ? 200 : 401,
        contentType: 'application/json',
        body: JSON.stringify(
          signedIn
            ? {
                code: 200,
                data: { userId: 'test-owner', userUid: 'test-owner' },
              }
            : { code: 401 },
        ),
      }),
    );
    await context.route('**/*', async (route) => {
      const request = route.request();
      if (
        request.isNavigationRequest() &&
        new URL(request.url()).origin !== new URL(base).origin
      ) {
        return route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: '<title>External deployment boundary</title>',
        });
      }
      return route.fallback();
    });
    await interactive.goto(
      `${base}/products/app-store/eaglercraft-server/?sea_attr=c01-browser-check`,
    );
    await interactive
      .getByRole('button', { name: 'Deploy Eaglercraft', exact: true })
      .first()
      .click();
    const dialog = interactive.getByRole('dialog');
    await dialog.getByRole('combobox').click();
    await interactive.getByRole('option', { name: '1.8', exact: true }).click();
    await dialog
      .getByLabel('rcon_password', { exact: false })
      .fill('C01-browser-only-password');
    await dialog
      .getByRole('button', { name: 'Deploy App', exact: true })
      .click();
    if (!signedIn) {
      await interactive
        .getByRole('heading', { name: 'Welcome to Sealos' })
        .waitFor();
      await interactive
        .getByRole('button', { name: 'Github', exact: true })
        .click();
    }
    await interactive.waitForURL((url) => url.origin !== new URL(base).origin);
    const target = new URL(interactive.url());
    assert.equal(target.searchParams.get('templateName'), 'eaglercraft-server');
    assert.equal(target.searchParams.get('openapp'), 'system-brain');
    assert.equal(target.searchParams.get('sea_attr'), 'c01-browser-check');
    assert.deepEqual(JSON.parse(target.searchParams.get('templateForm')), {
      minecraft_version: '1.8',
      rcon_password: 'C01-browser-only-password',
    });
    await context.close();
  }
});
