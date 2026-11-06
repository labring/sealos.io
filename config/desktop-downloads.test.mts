import assert from 'node:assert/strict';
import test from 'node:test';
import { pickDesktopDownload } from './desktop-downloads.ts';

const device = (
  userAgent: string,
  platform: string,
  extra: { maxTouchPoints?: number; mobile?: boolean; architecture?: string } = {},
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
  assert.equal(device('Mozilla/5.0 (X11; Linux x86_64)', 'Linux x86_64'), 'linuxX64');
  assert.equal(
    device('Mozilla/5.0 (X11; Linux aarch64)', 'Linux aarch64'),
    'linuxArm64',
  );
});
