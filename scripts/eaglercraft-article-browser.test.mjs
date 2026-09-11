import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { setTimeout } from 'node:timers/promises';

const require = createRequire(import.meta.url);

test('Eaglercraft article guides friends from setup through a retained world', async (t) => {
  const base = process.env.APP_STORE_PREVIEW_URL;
  if (!base) return t.skip('Set APP_STORE_PREVIEW_URL to a production export.');
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL,
  });
  t.after(() => browser.close());
  const page = await browser.newPage({ javaScriptEnabled: false });
  assert.equal(
    (await page.goto(`${base}/blog/eaglercraft-server/`)).status(),
    200,
  );
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(
    await page.locator('h1').innerText(),
    'How to Host an Eaglercraft Server for Friends: From Setup to First Join',
  );
  const title = await page.locator('h1').innerText();
  const description =
    'Set up an Eaglercraft server on Sealos, create your player account, invite friends with a browser link, and check that your world survives a restart.';
  assert.equal(await page.title(), `${title} | Sealos Blog`);
  assert.equal(
    await page.locator('meta[name="description"]').getAttribute('content'),
    description,
  );
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute('href'),
    'https://sealos.io/blog/eaglercraft-server/',
  );
  const article = page.locator('.article-content');
  assert.deepEqual(await article.locator('h2').allTextContents(), [
    'Choose a Hosting Path',
    'Before You Deploy',
    'Deploy Your Eaglercraft Server on Sealos',
    'Invite a Friend to the Same World',
    'Restart and Check Your Saved World',
    'Understand the Client, Gateway, and Game Server',
    'Fix Common Join Problems',
    'Continue with Manual Hosting',
    'FAQ',
  ]);
  assert.deepEqual(
    (await article.locator('h3').allTextContents()).slice(0, 5),
    [
      '1. Choose the version and Administrator Password',
      '2. Open the admin console and wait for Paper',
      '3. Open the browser client and set your player name',
      '4. Register your Player Account',
      '5. Leave and return with the same identity',
    ],
  );
  const levels = await page
    .locator('article h1, article h2, article h3')
    .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName[1])));
  assert.ok(levels.every((level, i) => i === 0 || level <= levels[i - 1] + 1));
  const body = await article.innerText();
  for (const text of [
    'Shared World',
    'minecraft_version',
    'rcon_password',
    'Canvas',
    'Paper is ready',
    'Edit Profile',
    'Multiplayer',
    'Join Server',
    '3–16',
    '6–32',
    '30 seconds',
    '/register <player-password>',
    '/login <player-password>',
    'Successfully registered',
    'Successfully logged in',
    'Browser Play Link',
    'WebSocket Server Address',
    'Administrator Password',
    'Player Account',
    'RiverBuilder',
    'StoneExplorer',
    'same Mac and network',
    'save-all',
    'preserving the original persistent volume',
    'Recovery Copy',
    '$7/month',
    '$34/month',
    'eligible first paid-plan purchases',
    'Cost Center',
    '1.12',
    'unverified',
    '2.2.7',
  ])
    assert.ok(body.includes(text), text);

  const anchors = await page
    .locator('#nd-toc a[href^="#"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  assert.ok(anchors.length >= 13);
  for (const hash of anchors) {
    assert.equal(
      await page.locator(`[id="${decodeURIComponent(hash.slice(1))}"]`).count(),
      1,
      hash,
    );
  }
  const invitation = article.locator(
    'a[href="#invite-a-friend-to-the-same-world"]',
  );
  await invitation.focus();
  await page.keyboard.press('Enter');
  assert.equal(new URL(page.url()).hash, '#invite-a-friend-to-the-same-world');

  const links = await article
    .locator('a[href]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')));
  assert.equal(
    links.filter(
      (href) =>
        href === 'https://sealos.io/products/app-store/eaglercraft-server/',
    ).length,
    2,
  );
  for (const href of [
    'https://sealos.io/pricing/',
    'https://github.com/yangchuansheng/eaglerXserver',
    'https://github.com/yangchuansheng/eaglerXserver/tree/v2.2.7',
    'https://github.com/labring-actions/templates/blob/kb-0.9/template/eaglercraft-server/README.md',
  ])
    assert.ok(links.includes(href), href);
  for (const href of new Set(
    links.filter(
      (href) => href.startsWith('/') || href.startsWith('https://sealos.io/'),
    ),
  )) {
    const pathname = new URL(href, base).pathname;
    assert.equal(
      (await page.request.get(`${base}${pathname}`)).status(),
      200,
      href,
    );
  }

  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    const images = article.locator('img');
    assert.equal(await images.count(), 5);
    for (const img of await images.all()) {
      assert.ok((await img.getAttribute('alt')).length > 30);
      await img.scrollIntoViewIfNeeded();
      for (let attempt = 0; attempt < 100; attempt++) {
        if (await img.evaluate((el) => el.complete && el.naturalWidth > 0))
          break;
        await setTimeout(100);
      }
      assert.ok(await img.evaluate((el) => el.complete && el.naturalWidth > 0));
    }
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}`,
    );
    assert.ok(
      (await article.innerText()).includes('/register <player-password>'),
    );
  }

  const schemas = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).flatMap(JSON.parse);
  const articleSchema = schemas.find((schema) => schema['@type'] === 'Article');
  assert.equal(articleSchema.headline, title);
  assert.equal(articleSchema.description, description);
  assert.equal(articleSchema.url, 'https://sealos.io/blog/eaglercraft-server/');
  assert.equal(articleSchema.datePublished, '2025-11-20T00:00:00.000Z');
  const faq = schemas.find((schema) => schema['@type'] === 'FAQPage');
  assert.equal(faq.mainEntity.length, 6);

  // The existing shared FAQ uses hydrated disclosures; the full procedure above is static.
  const interactive = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  await interactive.goto(`${base}/blog/eaglercraft-server/`);
  for (const item of faq.mainEntity) {
    const button = interactive.getByRole('button', {
      name: item.name,
      exact: true,
    });
    await button.focus();
    await button.press('Enter');
    const answer = interactive.locator(
      `[id="${await button.getAttribute('aria-controls')}"]`,
    );
    await answer.waitFor({ state: 'visible' });
    assert.equal((await answer.innerText()).trim(), item.acceptedAnswer.text);
  }
  assert.equal(
    await page
      .locator('meta[property="article:modified_time"]')
      .getAttribute('content'),
    articleSchema.dateModified,
  );
  // The shared date formatting also applies to existing blog articles.
  await page.goto(`${base}/blog/what-is-sealos/`);
  const existingSchemas = (
    await page.locator('script[type="application/ld+json"]').allTextContents()
  ).flatMap(JSON.parse);
  assert.equal(
    await page
      .locator('meta[property="article:modified_time"]')
      .getAttribute('content'),
    existingSchemas.find((schema) => schema['@type'] === 'Article')
      .dateModified,
  );
  // Fumadocs derives this from the article's real Git commit time.
  assert.ok(
    Date.parse(articleSchema.dateModified) >=
      Date.parse('2026-09-11T16:00:00Z'),
  );
});
