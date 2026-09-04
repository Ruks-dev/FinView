import test from 'node:test';
import assert from 'node:assert/strict';

import { generateSessionToken, verifySessionToken } from './auth.js';

test('session token is generated and validated for a user', () => {
  const user = { user_id: 42, email: 'demo@example.com' };
  const token = generateSessionToken(user);

  assert.ok(token);
  const payload = verifySessionToken(token);
  assert.equal(payload.user_id, 42);
  assert.equal(payload.email, 'demo@example.com');
});

test('tampered session token is rejected', () => {
  const user = { user_id: 7, email: 'tamper@example.com' };
  const token = generateSessionToken(user);
  const tampered = `${token.slice(0, -1)}X`;

  assert.equal(verifySessionToken(tampered), null);
});
