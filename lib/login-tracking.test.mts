import assert from 'node:assert/strict';
import test from 'node:test';
import { setTokenLoginTracking } from './login-tracking.ts';

test('sets login metadata without replacing the token or other redirect parameters', () => {
  const target = new URL(
    'https://usw-1.sealos.io/oauth?token=secret&openapp=system-brain',
  );
  target.searchParams.append('login_source', 'untrusted');

  setTokenLoginTracking(target, 'email', true);

  assert.equal(target.searchParams.get('token'), 'secret');
  assert.equal(target.searchParams.get('openapp'), 'system-brain');
  assert.deepEqual(target.searchParams.getAll('login_source'), ['email']);
  assert.equal(target.searchParams.get('login_user_type'), 'new');

  setTokenLoginTracking(target, 'google_one_tap', false);

  assert.deepEqual(target.searchParams.getAll('login_source'), [
    'google_one_tap',
  ]);
  assert.equal(target.searchParams.get('login_user_type'), 'existing');
});
