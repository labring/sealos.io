import assert from 'node:assert/strict';
import test from 'node:test';
import {
  DESKTOP_RELEASES_URL,
  getDesktopDownloadLinks,
  getLatestDesktopDownloadLinks,
  parseDesktopManifest,
  pickDesktopDownload,
} from './desktop-downloads.ts';

const device = (
  userAgent: string,
  platform: string,
  extra: {
    maxTouchPoints?: number;
    mobile?: boolean;
    architecture?: string;
  } = {},
) => pickDesktopDownload({ userAgent, platform, maxTouchPoints: 0, ...extra });

test('phones and tablets cannot install the desktop app', () => {
  assert.equal(
    device(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15',
      'iPhone',
      { maxTouchPoints: 5 },
    ),
    null,
  );
  assert.equal(
    device(
      'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Mobile',
      'Linux armv8l',
      { maxTouchPoints: 5, mobile: true },
    ),
    null,
  );
  // iPadOS Safari reports a desktop Mac; only touch support gives it away.
  assert.equal(
    device(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
      'MacIntel',
      { maxTouchPoints: 5 },
    ),
    null,
  );
});

test('desktops get the build for their platform', () => {
  assert.equal(
    device('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'MacIntel'),
    'macArm64',
  );
  assert.equal(
    device('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'macOS', {
      architecture: 'x86',
    }),
    'macX64',
  );
  assert.equal(
    device('Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Win32'),
    'windowsX64',
  );
  assert.equal(
    device('Mozilla/5.0 (X11; Linux x86_64)', 'Linux x86_64'),
    'linuxX64',
  );
  assert.equal(
    device('Mozilla/5.0 (X11; Linux aarch64)', 'Linux aarch64'),
    'linuxArm64',
  );
});

const FEED = 'https://sealox-global.oss-us-west-1.aliyuncs.com/app/';

const manifest = (urls: string[], notes = '') =>
  [
    'version: 0.10.3',
    'files:',
    ...urls.flatMap((url) => [
      `  - url: ${url}`,
      '    sha512: abc==',
      '    size: 1',
    ]),
    `path: ${urls[0]}`,
    'releaseName: Sealos 0.10.3',
    'releaseNotes: |-',
    notes,
  ].join('\n');

test('macOS manifest yields the dmg for each architecture', () => {
  const links = parseDesktopManifest(
    manifest([
      'releases/0.10.3/Sealos-0.10.3-mac-arm64.zip',
      'releases/0.10.3/Sealos-0.10.3-mac-arm64.dmg',
      'releases/0.10.3/Sealos-0.10.3-mac-x64.zip',
      'releases/0.10.3/Sealos-0.10.3-mac-x64.dmg',
    ]),
  );
  assert.deepEqual(links, {
    macArm64: `${FEED}releases/0.10.3/Sealos-0.10.3-mac-arm64.dmg`,
    macX64: `${FEED}releases/0.10.3/Sealos-0.10.3-mac-x64.dmg`,
  });
});

test('Windows and Linux manifests yield the exe and AppImage builds', () => {
  assert.deepEqual(
    parseDesktopManifest(
      manifest(['releases/0.10.3/Sealos-0.10.3-win-x64.exe']),
    ),
    { windowsX64: `${FEED}releases/0.10.3/Sealos-0.10.3-win-x64.exe` },
  );
  assert.deepEqual(
    parseDesktopManifest(
      manifest([
        'releases/0.10.3/Sealos-0.10.3-linux-x86_64.AppImage',
        'releases/0.10.3/Sealos-0.10.3-linux-amd64.deb',
        'releases/0.10.3/Sealos-0.10.3-linux-x86_64.rpm',
      ]),
    ),
    { linuxX64: `${FEED}releases/0.10.3/Sealos-0.10.3-linux-x86_64.AppImage` },
  );
  assert.deepEqual(
    parseDesktopManifest(
      manifest([
        'releases/0.10.3/Sealos-0.10.3-linux-arm64.AppImage',
        'releases/0.10.3/Sealos-0.10.3-linux-arm64.deb',
        'releases/0.10.3/Sealos-0.10.3-linux-aarch64.rpm',
      ]),
    ),
    { linuxArm64: `${FEED}releases/0.10.3/Sealos-0.10.3-linux-arm64.AppImage` },
  );
});

test('release notes and foreign paths are never read as installers', () => {
  const links = parseDesktopManifest(
    manifest(
      [
        'https://evil.example/Sealos-mac-arm64.dmg',
        'releases/0.10.3/Sealos Setup 0.10.3.exe',
      ],
      '  - url: releases/0.0.1/Sealos-0.0.1-mac-x64.dmg',
    ),
  );
  assert.deepEqual(links, {
    windowsX64: `${FEED}releases/0.10.3/Sealos%20Setup%200.10.3.exe`,
  });
});

test('an empty or broken manifest yields no links', () => {
  assert.deepEqual(parseDesktopManifest(''), {});
  assert.deepEqual(parseDesktopManifest('<Error>NoSuchKey</Error>'), {});
});

test('builds whose manifest cannot be read fall back to the releases page', async () => {
  const realFetch = globalThis.fetch;
  const realWarn = console.warn;
  const warnings: string[] = [];
  console.warn = (message: string) => warnings.push(message);
  globalThis.fetch = (async (url: URL) => {
    if (String(url).endsWith('/latest.yml')) {
      return new Response(
        manifest(['releases/0.10.3/Sealos-0.10.3-win-x64.exe']),
      );
    }
    if (String(url).endsWith('/latest-mac.yml')) {
      return new Response('NoSuchKey', { status: 404 });
    }
    throw new Error('timeout');
  }) as typeof fetch;
  try {
    assert.deepEqual(await getDesktopDownloadLinks(), {
      macArm64: DESKTOP_RELEASES_URL,
      macX64: DESKTOP_RELEASES_URL,
      windowsX64: `${FEED}releases/0.10.3/Sealos-0.10.3-win-x64.exe`,
      linuxX64: DESKTOP_RELEASES_URL,
      linuxArm64: DESKTOP_RELEASES_URL,
    });
    assert.equal(warnings.length, 4);
  } finally {
    globalThis.fetch = realFetch;
    console.warn = realWarn;
  }
});

test('browser refresh reads only the visitor manifest and never throws', async () => {
  const realFetch = globalThis.fetch;
  const requested: string[] = [];
  globalThis.fetch = (async (url: URL) => {
    requested.push(String(url).split('/').pop() ?? '');
    if (String(url).endsWith('/latest-mac.yml')) {
      return new Response(
        manifest([
          'releases/0.10.4/Sealos-0.10.4-mac-arm64.dmg',
          'releases/0.10.4/Sealos-0.10.4-mac-x64.dmg',
        ]),
      );
    }
    throw new TypeError('Failed to fetch');
  }) as typeof fetch;
  try {
    assert.deepEqual(await getLatestDesktopDownloadLinks('macX64'), {
      macArm64: `${FEED}releases/0.10.4/Sealos-0.10.4-mac-arm64.dmg`,
      macX64: `${FEED}releases/0.10.4/Sealos-0.10.4-mac-x64.dmg`,
    });
    // Both Mac builds share one manifest request.
    await getLatestDesktopDownloadLinks('macArm64');
    // A blocked request (no CORS headers) leaves the build-time links alone.
    assert.deepEqual(await getLatestDesktopDownloadLinks('linuxArm64'), {});
    assert.deepEqual(requested, ['latest-mac.yml', 'latest-linux-arm64.yml']);
  } finally {
    globalThis.fetch = realFetch;
  }
});
