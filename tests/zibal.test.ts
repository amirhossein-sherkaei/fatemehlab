import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isZibalDefinitiveFailure,
  isZibalInProgress,
  isZibalPaymentVerified,
  normalizeZibalTrackId,
  parseZibalState,
  zibalStartUrl,
} from '../src/lib/zibal';

test('normalizes only safe positive numeric track IDs', () => {
  assert.equal(normalizeZibalTrackId('123456'), '123456');
  assert.equal(normalizeZibalTrackId(123456), '123456');
  assert.equal(normalizeZibalTrackId('000123'), '123');
  assert.equal(normalizeZibalTrackId('0'), null);
  assert.equal(normalizeZibalTrackId('-1'), null);
  assert.equal(normalizeZibalTrackId('1e3'), null);
  assert.equal(normalizeZibalTrackId('not-a-track'), null);
  assert.equal(normalizeZibalTrackId('9007199254740992'), null);
});

test('builds only the official Zibal payment URL shape', () => {
  assert.equal(zibalStartUrl('123456'), 'https://gateway.zibal.ir/start/123456');
  assert.throws(() => zibalStartUrl('../123'));
});

test('parses payment response fields without accepting malformed integers', () => {
  const state = parseZibalState({ result: '100', status: '1', amount: '1250000', trackId: '98765', refNumber: 4567 });
  assert.deepEqual(state, {
    result: 100,
    status: 1,
    amount: 1250000,
    trackId: '98765',
    refNumber: '4567',
    message: '',
  });
  assert.equal(parseZibalState({ result: '1e2', amount: '1e3', trackId: '1e3' }).result, null);
});

test('settles only verified transactions with the exact Rial amount', () => {
  const verified = parseZibalState({ result: 100, status: 1, amount: 1250000, trackId: 98765 });
  assert.equal(isZibalPaymentVerified(verified, 1250000), true);
  assert.equal(isZibalPaymentVerified(verified, 1250001), false);
  assert.equal(isZibalPaymentVerified({ ...verified, status: -1 }, 1250000), false);
});

test('accepts idempotent already-verified responses only with matching amount', () => {
  const alreadyVerified = parseZibalState({ result: 201, amount: 1250000, trackId: 98765 });
  assert.equal(isZibalPaymentVerified(alreadyVerified, 1250000), true);
  assert.equal(isZibalPaymentVerified(alreadyVerified, 1250001), false);
  assert.equal(isZibalPaymentVerified({ ...alreadyVerified, status: 0 }, 1250000), false);
});

test('keeps pending and paid-but-unverified transactions unresolved', () => {
  const bankPending = parseZibalState({ result: 202, status: -1, amount: 1250000, trackId: 98765 });
  const paidUnverified = parseZibalState({ result: 202, status: 2, amount: 1250000, trackId: 98765 });
  assert.equal(isZibalInProgress(bankPending), true);
  assert.equal(isZibalInProgress(paidUnverified), true);
  assert.equal(isZibalDefinitiveFailure(bankPending), false);
  assert.equal(isZibalDefinitiveFailure(paidUnverified), false);
});

test('recognizes definitive failures but rejects contradictory paid status', () => {
  const failed = parseZibalState({ result: 202, status: 0, trackId: 98765 });
  const contradictory = parseZibalState({ result: 202, status: 1, amount: 1250000, trackId: 98765 });
  assert.equal(isZibalDefinitiveFailure(failed), true);
  assert.equal(isZibalDefinitiveFailure(contradictory), false);
});
