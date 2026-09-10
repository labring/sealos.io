import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const apps = JSON.parse(
  readFileSync(new URL('../config/apps.json', import.meta.url), 'utf8'),
);

// APP_STORE_PREVIEW_URL=http://localhost:3000 node --test scripts/app-store-browser.test.mjs
// PLAYWRIGHT_MODULE and BROWSER_CHANNEL can select an existing browser installation.
test('app detail pages preserve visible content and native interactions', async (t) => {
  const base = process.env.APP_STORE_PREVIEW_URL;
  if (!base) {
    t.skip(
      'Set APP_STORE_PREVIEW_URL to a running preview to test rendered pages.',
    );
    return;
  }
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL,
  });
  t.after(() => browser.close());
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  for (const slug of ['eaglercraft-server', 'n8n', 'grafana']) {
    const app = apps.find((app) => app.slug === slug);
    assert.equal(
      (await page.goto(`${base}/products/app-store/${slug}/`)).status(),
      200,
    );
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('h1').innerText(), app.name);
    assert.ok(
      await page
        .getByRole('banner', { name: 'Sealos Logotype', exact: true })
        .isVisible(),
    );
    assert.ok(await page.locator('footer').isVisible());
    for (const name of [
      /Why deploy on\s*Sealos/i,
      /You Get the Whole Stack/i,
      /Related templates/i,
    ]) {
      assert.ok(await page.getByRole('heading', { name }).isVisible());
    }
    for (const name of [
      /How to deploy/,
      /Resources to plan for/,
      /Access after deployment/,
      /Hosting and billing/,
    ]) {
      assert.ok(await page.getByRole('heading', { name }).isVisible());
    }
    const details = page.locator('#readme details');
    const summary = details.locator('summary');
    assert.equal(await details.count(), 1);
    assert.equal(await details.getAttribute('open'), null);
    await summary.focus();
    await page.keyboard.press('Enter');
    assert.equal(await details.getAttribute('open'), '');
    const documentation = details.getByRole('region', {
      name: `${app.name} README content`,
    });
    assert.ok((await documentation.innerText()).length > 100);
    await page.keyboard.press('Space');
    assert.equal(await details.getAttribute('open'), null);
    if (slug !== 'eaglercraft-server') {
      assert.ok(
        await page
          .getByRole('heading', { name: 'Overview', exact: true })
          .isVisible(),
      );
      assert.ok(
        (await page.locator('#readme').innerText()).includes(app.description),
      );
    } else {
      const screenshot = page.getByRole('link', {
        name: 'Console screenshot',
        exact: true,
      });
      assert.equal(await screenshot.getAttribute('href'), app.screenshots[0]);
      assert.equal(await screenshot.getAttribute('target'), '_blank');
    }
  }
  const interactive = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  interactive.on('pageerror', (error) => errors.push(error.message));
  for (const slug of ['eaglercraft-server', 'n8n', 'grafana']) {
    await interactive.goto(`${base}/products/app-store/${slug}/`);
    if (slug === 'eaglercraft-server') {
      const day = interactive.getByRole('button', { name: 'Day', exact: true });
      const night = interactive.getByRole('button', {
        name: 'Night',
        exact: true,
      });
      const art = interactive.getByRole('img', {
        name: /Illustrated voxel village/,
      });
      const nightSource = await art.getAttribute('src');
      await day.click();
      assert.equal(await day.getAttribute('aria-pressed'), 'true');
      assert.notEqual(await art.getAttribute('src'), nightSource);
      await night.click();
      assert.equal(await night.getAttribute('aria-pressed'), 'true');
      assert.equal(await art.getAttribute('src'), nightSource);
    }
    await interactive
      .getByRole('button', { name: 'Deploy now', exact: true })
      .click();
    await interactive.getByRole('dialog').waitFor({ state: 'visible' });
    await interactive.keyboard.press('Escape');
    await interactive.getByRole('dialog').waitFor({ state: 'hidden' });
  }
  assert.deepEqual(errors, []);
  for (const width of [320, 390, 600, 601, 768, 800, 801, 1050, 1051, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const slug of ['eaglercraft-server', 'n8n', 'grafana', 'tolgee']) {
      await page.goto(`${base}/products/app-store/${slug}/`);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${slug} at ${width}px overflows`,
      );
      assert.ok(
        await page
          .locator('#readme ol:visible')
          .evaluate((element) => element.scrollWidth <= element.clientWidth),
        `${slug} deployment steps at ${width}px overflow`,
      );
    }
  }
});
