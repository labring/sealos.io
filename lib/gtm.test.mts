import assert from 'node:assert/strict';
import test from 'node:test';
import { gtmPush } from './gtm.ts';

test('queues login events before the GTM script initializes', () => {
  const originalWindow = globalThis.window;
  const browserWindow = {} as Window & typeof globalThis;
  globalThis.window = browserWindow;

  try {
    gtmPush({ event: 'login_start', module: 'auth', context: 'app' });
    assert.deepEqual(browserWindow.dataLayer, [
      { event: 'login_start', module: 'auth', context: 'app' },
    ]);
  } finally {
    globalThis.window = originalWindow;
  }
});
