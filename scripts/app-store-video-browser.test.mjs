import assert from 'node:assert/strict';
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const catalogPath = new URL('../config/apps.json', import.meta.url);
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
const thumbnail =
  '<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="480" height="360" fill="#333"/></svg>';

const fixtures = [
  ['https://youtube.com/watch?v=-tuMrj63-6g', '-tuMrj63-6g'],
  ['https://youtu.be/x-NrQq3C84Q?si=example', 'x-NrQq3C84Q'],
  [undefined],
  [' \t\n '],
  [123],
  ['malformed'],
  ['https://foreign.example/watch?v=-tuMrj63-6g'],
  ['https://www.youtube.com.evil.example/watch?v=-tuMrj63-6g'],
  ['https://user:password@youtube.com/watch?v=-tuMrj63-6g'],
  ['https://youtube.com/watch?v=short'],
  ['https://youtube.com/watch?v=-tuMrj63-6g%0A'],
  ['http://youtube.com/watch?v=-tuMrj63-6g'],
  ['https://youtube.com/shorts/-tuMrj63-6g'],
  ['https://youtube.com/embed/-tuMrj63-6g'],
  ['https://youtube.com/playlist?list=-tuMrj63-6g'],
  ['https://youtu.be/x-NrQq3C84Q/extra'],
  ['https://youtube.com:444/watch?v=-tuMrj63-6g'],
  ['https://youtube.com/watch?v=1234567890!'],
];

async function startFixturePreview(t, base) {
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
  const root = fileURLToPath(new URL('../', import.meta.url));
  const directory = mkdtempSync(join(tmpdir(), 'sealos-template-video-'));
  let server;
  t.after(async () => {
    if (server?.pid && server.exitCode === null && server.signalCode === null) {
      const exited = once(server, 'exit');
      server.kill('SIGTERM');
      await exited;
    }
    rmSync(directory, { recursive: true, force: true });
  });
  for (const name of [
    'app',
    'config',
    'lib',
    'components',
    'new-components',
    'hooks',
    'types',
    'source.config.ts',
    'next.config.mjs',
    'tsconfig.json',
    'mdx-components.tsx',
    'postcss.config.js',
    'prettier.config.js',
    'package.json',
    'tokens.css',
  ]) {
    cpSync(join(root, name), join(directory, name), { recursive: true });
  }
  for (const name of ['node_modules', 'content', 'public', 'assets', 'fonts']) {
    symlinkSync(join(root, name), join(directory, name));
  }
  const apps = fixtures.flatMap(([youtube], index) =>
    [true, false].map((screenshot) => ({
      ...catalog.find((app) => app.slug === 'excalidraw'),
      slug: `video-fixture-${index}-${screenshot}`,
      legacySlugs: [],
      templateName: undefined,
      github: undefined,
      website: undefined,
      readme: undefined,
      screenshots: screenshot ? ['/images/apps/excalidraw.png'] : [],
      youtube,
    })),
  );
  writeFileSync(
    join(directory, 'config/apps.json'),
    JSON.stringify([...catalog, ...apps], null, 2),
  );
  server = spawn(
    process.execPath,
    [
      join(root, 'node_modules/next/dist/bin/next'),
      'dev',
      '--hostname',
      '127.0.0.1',
      '--port',
      new URL(base).port,
    ],
    {
      cwd: directory,
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Fixture dev server startup timed out')),
      30_000,
    );
    let output = '';
    server.stdout.on('data', (chunk) => {
      output += chunk;
      if (output.includes('Ready in')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.stderr.on('data', (chunk) => {
      output += chunk;
    });
    server.once('exit', () => {
      clearTimeout(timeout);
      reject(new Error(output));
    });
    server.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

// APP_STORE_PREVIEW_URL=http://localhost:3570 node --test scripts/app-store-video-browser.test.mjs
// Reuse PLAYWRIGHT_MODULE / BROWSER_CHANNEL. APP_STORE_VIDEO_FIXTURES=1 temporarily
// starts an isolated fixture dev server on the supplied free localhost port.
test('Template Previews preserve safe video selection, activation, and fallbacks', async (t) => {
  const base = process.env.APP_STORE_PREVIEW_URL;
  if (!base) return t.skip('Set APP_STORE_PREVIEW_URL to a running preview.');
  if (process.env.APP_STORE_VIDEO_FIXTURES === '1')
    await startFixturePreview(t, base);
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL,
  });
  t.after(() => browser.close());
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const requests = [];
  let failHighResolutionThumbnail = false;
  let failThumbnail = false;
  let failPlayer = false;
  await context.route('**/*', (route) => {
    const url = new URL(route.request().url());
    if (url.origin === new URL(base).origin) return route.continue();
    if (url.hostname === 'www.youtube-nocookie.com') {
      requests.push(url.href);
      return failPlayer
        ? route.abort()
        : route.fulfill({
            contentType: 'text/html',
            body: '<button>Player control</button>',
          });
    }
    if (url.hostname === 'i.ytimg.com') {
      requests.push(url.href);
      if (failThumbnail) return route.abort();
      if (
        failHighResolutionThumbnail &&
        url.pathname.endsWith('/maxresdefault.jpg')
      ) {
        return route.fulfill({ status: 404, body: '' });
      }
    }
    if (route.request().resourceType() === 'image') {
      return route.fulfill({ contentType: 'image/svg+xml', body: thumbnail });
    }
    return route.abort();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60_000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const visit = async (path) => {
    requests.length = 0;
    assert.equal(
      (
        await page.goto(`${base}${path}`, {
          waitUntil: 'load',
          timeout: 120_000,
        })
      ).status(),
      200,
    );
  };

  await t.test(
    'ordinary and featured video dialogs open and close on desktop, portrait, and landscape screens',
    async () => {
      for (const [width, height] of [
        [1440, 1000],
        [390, 844],
        [844, 390],
      ]) {
        await page.setViewportSize({ width, height });
        for (const [slug, id, activation] of [
          ['excalidraw', '-tuMrj63-6g', 'click'],
          ['open-webui', 'x-NrQq3C84Q', 'Enter'],
          ['eaglercraft-server', '6ANuRL-c5Fs', 'Space'],
        ]) {
          const app = catalog.find((app) => app.slug === slug);
          for (const locale of ['', '/zh-cn']) {
            await visit(`${locale}/products/app-store/${slug}/`);
            const play = page.getByRole('button', {
              name: `Play ${app.name} template video`,
              exact: true,
              includeHidden: true,
            });
            await play.waitFor();
            const preview = page.locator('figure').filter({ has: play });
            assert.equal(await preview.locator('figcaption').count(), 0);
            assert.equal(
              await preview
                .getByRole('img', {
                  name: `${app.name} template preview`,
                  exact: true,
                })
                .count(),
              0,
            );
            assert.equal(
              await play.locator('img').getAttribute('src'),
              `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
            );
            await play.scrollIntoViewIfNeeded();
            const before = await play.boundingBox();
            assert.ok(Math.abs(before.width / before.height - 16 / 9) < 0.02);
            assert.ok(before.x >= 0 && before.x + before.width <= width);
            assert.equal(await preview.locator('iframe').count(), 0);
            assert.equal(
              requests.filter((url) => url.includes('youtube-nocookie.com'))
                .length,
              0,
            );
            if (activation === 'click') {
              await play.click();
            } else {
              await play.focus();
              await page.keyboard.press('Tab');
              await page.keyboard.press('Shift+Tab');
              assert.ok(
                await play.evaluate(
                  (button) =>
                    button.matches(':focus-visible') &&
                    getComputedStyle(button).outlineStyle !== 'none',
                ),
              );
              await page.keyboard.press(activation);
            }
            const dialog = page.getByRole('dialog', {
              name: `${app.name} template video`,
              exact: true,
            });
            await dialog.waitFor({ timeout: 5000 });
            const close = dialog.getByRole('button', { name: 'Close video' });
            const player = dialog.locator('iframe');
            await player.waitFor();
            assert.equal(await player.count(), 1);
            assert.equal(await play.count(), 1);
            const cover = await play.boundingBox();
            assert.equal(cover.width, before.width);
            assert.equal(cover.height, before.height);
            assert.equal(
              await player.getAttribute('src'),
              `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
            );
            assert.equal(await player.getAttribute('allowfullscreen'), '');
            assert.match(await player.getAttribute('allow'), /autoplay/);
            assert.equal(
              await player.getAttribute('referrerpolicy'),
              'strict-origin-when-cross-origin',
            );
            const after = await player.boundingBox();
            assert.ok(Math.abs(after.width / after.height - 16 / 9) < 0.02);
            assert.ok(after.x >= 0 && after.x + after.width <= width);
            assert.ok(after.y >= 0 && after.y + after.height <= height);
            const closeBox = await close.boundingBox();
            assert.ok(
              closeBox.y >= 0 && closeBox.y + closeBox.height <= height,
            );
            assert.ok(
              await close.evaluate(
                (button) => button === document.activeElement,
              ),
            );
            await page.keyboard.press('Tab');
            assert.ok(
              await player.evaluate(
                (frame) => frame === document.activeElement,
              ),
            );
            await page.keyboard.press('Shift+Tab');
            assert.ok(
              await close.evaluate(
                (button) => button === document.activeElement,
              ),
            );
            assert.ok(
              requests.some(
                (url) =>
                  url ===
                  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
              ),
            );
            if (activation === 'click') await close.click();
            else await page.keyboard.press('Escape');
            await dialog.waitFor({ state: 'hidden' });
            assert.equal(
              await page.locator('iframe[src*="youtube"]').count(),
              0,
            );
            assert.ok(
              await play.evaluate(
                (button) => button === document.activeElement,
              ),
            );
            await play.click();
            await dialog.waitFor();
            // Wait for the opening transition before exercising the backdrop.
            await close.hover();
            await page.mouse.click(2, 2);
            await dialog.waitFor({ state: 'hidden' });
            assert.equal(
              await page.locator('iframe[src*="youtube"]').count(),
              0,
            );
            assert.ok(
              await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
              ),
            );
            if (slug === 'eaglercraft-server') {
              const art = page.getByRole('img', {
                name: /Illustrated voxel village/,
              });
              const oldSource = await art.getAttribute('src');
              const day = page.getByRole('button', {
                name: 'Day',
                exact: true,
              });
              await day.click();
              assert.equal(await day.getAttribute('aria-pressed'), 'true');
              assert.notEqual(await art.getAttribute('src'), oldSource);
              const guide = page.locator(locale ? '#readme' : '#how-to-join');
              assert.equal(await guide.count(), 1);
              await page
                .getByRole('button', {
                  name: locale ? 'Deploy now' : 'Deploy Eaglercraft',
                  exact: true,
                })
                .first()
                .click();
              await page.getByRole('dialog').waitFor();
              await page.keyboard.press('Escape');
              await page.getByRole('dialog').waitFor({ state: 'hidden' });
            }
          }
        }
      }
    },
  );

  await t.test(
    'missing high-resolution covers fall back to the standard thumbnail',
    async () => {
      failHighResolutionThumbnail = true;
      await visit('/products/app-store/excalidraw/');
      const play = page.getByRole('button', {
        name: 'Play Excalidraw template video',
      });
      await play.waitFor();
      await page.waitForFunction(() => {
        const img = document.querySelector('button img[src*="i.ytimg.com"]');
        return (
          img?.src.endsWith('/hqdefault.jpg') &&
          img.complete &&
          img.naturalWidth > 0
        );
      });
      assert.deepEqual(
        requests.filter((url) => url.includes('i.ytimg.com')),
        [
          'https://i.ytimg.com/vi/-tuMrj63-6g/maxresdefault.jpg',
          'https://i.ytimg.com/vi/-tuMrj63-6g/hqdefault.jpg',
        ],
      );
      failHighResolutionThumbnail = false;
    },
  );

  await t.test(
    'failed thumbnails and restricted players keep usable viewing controls',
    async () => {
      failThumbnail = true;
      failPlayer = true;
      await visit('/products/app-store/excalidraw/');
      const play = page.getByRole('button', {
        name: 'Play Excalidraw template video',
      });
      await play.waitFor();
      await page.waitForFunction(() => {
        const img = document.querySelector('button img[src*="i.ytimg.com"]');
        return (
          img?.src.endsWith('/hqdefault.jpg') &&
          img.complete &&
          img.naturalWidth === 0
        );
      });
      assert.equal(
        requests.filter((url) => url.includes('i.ytimg.com')).length,
        2,
      );
      assert.ok(await play.isVisible());
      await play.click();
      await page.locator('iframe[title="Excalidraw template video"]').waitFor();
      await page.getByRole('button', { name: 'Close video' }).click();
      await page.getByRole('dialog').waitFor({ state: 'hidden' });
      assert.ok(await play.isVisible());
      failThumbnail = false;
      failPlayer = false;
    },
  );

  await t.test(
    'existing screenshot previews and legacy URLs retain their media',
    async () => {
      for (const slug of ['n8n', 'Reactive-Resume']) {
        await visit(`/products/app-store/${slug}/`);
        const app = catalog.find(
          (app) => app.slug === slug || app.legacySlugs?.includes(slug),
        );
        const image = page.getByRole('img', {
          name: `${app.name} template preview`,
          exact: true,
        });
        await image.waitFor();
        assert.equal(await image.getAttribute('src'), app.screenshots[0]);
        assert.equal(
          await page
            .getByRole('link', { name: 'Watch on YouTube', exact: true })
            .count(),
          0,
        );
        assert.equal(requests.length, 0);
      }
    },
  );

  await t.test(
    'server-rendered video covers and page content remain visible with JavaScript disabled',
    async (t) => {
      if (process.env.APP_STORE_VIDEO_FIXTURES === '1')
        return t.skip(
          'Verify JavaScript-disabled HTML against the production export; Next dev streams Suspense boundaries.',
        );
      const staticPage = await browser.newPage({ javaScriptEnabled: false });
      await staticPage.route('**/*', (route) =>
        new URL(route.request().url()).origin === new URL(base).origin
          ? route.continue()
          : route.abort(),
      );
      for (const path of [
        '/products/app-store/excalidraw/',
        '/zh-cn/products/app-store/eaglercraft-server/',
      ]) {
        await staticPage.goto(`${base}${path}`, {
          waitUntil: 'load',
        });
        await staticPage.locator('button img[src*="i.ytimg.com"]').waitFor();
        assert.equal(await staticPage.locator('h1').count(), 1);
        assert.equal(
          await staticPage.locator('iframe[src*="youtube"]').count(),
          0,
        );
        assert.ok(await staticPage.locator('#readme').isVisible());
      }
      await staticPage.close();
    },
  );

  await t.test(
    'untrusted template metadata selects video, screenshot, or identity on real detail pages',
    async (t) => {
      if (process.env.APP_STORE_VIDEO_FIXTURES !== '1')
        return t.skip(
          'Set APP_STORE_VIDEO_FIXTURES=1 with a local dev server to exercise catalog fixtures.',
        );
      for (const [index, [, id]] of fixtures.entries()) {
        for (const screenshot of [true, false]) {
          await visit(
            `/products/app-store/video-fixture-${index}-${screenshot}/`,
          );
          await page
            .getByRole('heading', { name: 'Excalidraw', exact: true, level: 1 })
            .waitFor();
          const play = page.getByRole('button', {
            name: 'Play Excalidraw template video',
            exact: true,
          });
          const image = page.getByRole('img', {
            name: 'Excalidraw template preview',
            exact: true,
          });
          const preview = page
            .locator('figure')
            .filter(id ? { has: play } : { hasText: 'Template preview' });
          assert.equal(await preview.locator('figcaption').count(), id ? 0 : 1);
          assert.equal(await play.count(), id ? 1 : 0);
          assert.equal(await image.count(), !id && screenshot ? 1 : 0);
          if (id) {
            await play.click();
            const dialog = page.getByRole('dialog', {
              name: 'Excalidraw template video',
            });
            const player = dialog.locator('iframe');
            await player.waitFor();
            assert.equal(
              await player.getAttribute('src'),
              `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
            );
            await dialog.getByRole('button', { name: 'Close video' }).click();
            await dialog.waitFor({ state: 'hidden' });
          } else {
            assert.equal(
              await preview
                .getByRole('link', { name: 'Watch on YouTube' })
                .count(),
              0,
            );
            if (!screenshot)
              assert.ok((await preview.innerText()).includes('Excalidraw'));
            assert.equal(requests.length, 0);
          }
          assert.equal(
            await preview
              .getByRole('link', { name: 'Full screenshot' })
              .count(),
            !id && screenshot ? 1 : 0,
          );
        }
      }
    },
  );
  assert.deepEqual(errors, []);
});
