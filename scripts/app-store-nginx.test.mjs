import test from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';

// Run with: node --test scripts/app-store-nginx.test.mjs (requires nginx).
test('legacy app redirects preserve query strings and the public origin', async (t) => {
  if (spawnSync('nginx', ['-v']).error?.code === 'ENOENT') {
    t.skip('Install nginx to run the HTTP redirect regression.');
    return;
  }
  const directory = mkdtempSync(join(tmpdir(), 'app-store-nginx-'));
  const socket = createServer();
  socket.listen(0, '127.0.0.1');
  await once(socket, 'listening');
  const port = socket.address().port;
  await new Promise((resolve) => socket.close(resolve));
  const root = join(directory, 'html');
  mkdirSync(join(root, 'products/app-store/lobehub'), { recursive: true });
  writeFileSync(join(root, 'products/app-store/lobehub/index.html'), 'LobeHub');
  writeFileSync(join(root, 'index.html'), 'App Store');
  writeFileSync(join(root, '404.html'), 'Missing');
  const config = readFileSync(
    new URL('../config/nginx.conf', import.meta.url),
    'utf8',
  )
    .replace('listen 80;', `listen 127.0.0.1:${port};`)
    .replace('listen [::]:80;', '')
    .replace('/usr/share/nginx/html', root);
  const configPath = join(directory, 'nginx.conf');
  writeFileSync(
    configPath,
    `pid ${directory}/nginx.pid;\nerror_log stderr;\nevents {}\nhttp { access_log off; ${config} }`,
  );
  const nginx = spawn(
    'nginx',
    ['-p', directory, '-c', configPath, '-g', 'daemon off;'],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  let errors = '';
  nginx.stderr.on('data', (chunk) => {
    errors += chunk;
  });
  const exit = once(nginx, 'exit');
  t.after(async () => {
    if (nginx.exitCode === null && nginx.signalCode === null)
      nginx.kill('SIGQUIT');
    await exit;
    rmSync(directory, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      const response = await fetch(base, { signal: AbortSignal.timeout(1000) });
      await response.text();
      ready = response.ok;
      if (ready) break;
    } catch {}
    if (nginx.exitCode !== null) break;
    await delay(50);
  }
  assert.ok(ready, errors || 'Nginx did not start');
  for (const locale of ['', '/en']) {
    for (const slug of ['lobe-chat', 'lobe-chat-db']) {
      for (const slash of ['', '/']) {
        for (const query of [
          '',
          '?utm_source=partner&ref=guide',
          '?ref=a%2Fb%20c&tag=one&tag=two&empty=',
        ]) {
          for (const proxy of [false, true]) {
            for (const method of ['GET', 'HEAD']) {
              const path = `${locale}/products/app-store/${slug}${slash}${query}`;
              const response = await fetch(`${base}${path}`, {
                method,
                redirect: 'manual',
                headers: proxy
                  ? { Host: 'sealos.io', 'X-Forwarded-Proto': 'https' }
                  : {},
              });
              await response.text();
              assert.equal(response.status, 308, path);
              const location = response.headers.get('location');
              assert.equal(
                location,
                `/products/app-store/lobehub/${query}`,
                path,
              );
              assert.equal(
                new URL(location, `https://sealos.io${path}`).origin,
                'https://sealos.io',
              );
            }
          }
        }
      }
    }
  }
  assert.equal(
    (await fetch(`${base}/products/app-store/lobehub/`)).status,
    200,
  );
  assert.equal((await fetch(`${base}/unknown/`)).status, 404);
});
