import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { deriveAnchor, browserTangent, evaluateRawGate, runNullControl, passesKl, appendAudit, verifyAudit } from './node-alpha';

describe('Node Alpha V1.3 browser reference', () => {
  test('canonical <64f> seal matches config.py and bridge B.6', async () => {
    const a = await deriveAnchor();
    assert.equal(a.seal, 'bb17ede97aa45c76ef9afa63cb457f7d684e5ede40b0432b2ecf3b6b9d3e03a3');
    assert.equal(a.matches, true);
  });
  test('anchor passes the raw gate without carrier mixing', async () => {
    const a = await deriveAnchor(); const r = evaluateRawGate(a.vector, a.vector, browserTangent(a.vector));
    assert.equal(r.passed, true); assert.ok(Math.abs(r.rcfRaw - 1) < 10 ** -12);
  });
  test('pure G3 collision gives delta E = 1 and veto', async () => {
    const a = await deriveAnchor(); const g = browserTangent(a.vector); const r = evaluateRawGate(g, a.vector, g);
    assert.equal(r.passed, false); assert.equal(r.deltaERaw).toBeCloseTo(1, 12); expect(r.bleedPost, 1);
  });
  test('raw RCF floor is inclusive at 0.95 and rejects 0.949', () => {
    const a = [1, ...Array(63).fill(0)], g = [0, 0, 1, ...Array(61).fill(0)];
    const candidate = (rcf: number) => [Math.sqrt(rcf), Math.sqrt(1 - rcf), ...Array(62).fill(0)];
    assert.equal(evaluateRawGate(candidate(0.9500000001), a, g).passed, true);
    assert.equal(evaluateRawGate(candidate(0.949), a, g).passed, false);
  });
  test('delta E above 0.05 vetoes even with RCF above 0.95', () => {
    const a = [1, ...Array(63).fill(0)], g = [0, 1, ...Array(62).fill(0)];
    const r = evaluateRawGate([Math.sqrt(0.99), 0.1, ...Array(62).fill(0)], a, g);
    assert.equal(r.rcfRaw).toBeCloseTo(0.99); assert.ok(Math.abs(r.deltaERaw - 0.055) < 0.005); expect(r.passed, false);
  });
  test('zero and nonfinite candidates fail closed', async () => {
    const a = await deriveAnchor(), g = browserTangent(a.vector);
    assert.equal(evaluateRawGate(Array(64).fill(0), a.vector, g).passed, false);
    assert.equal(evaluateRawGate(Array(64).fill(NaN), a.vector, g).passed, false);
  });
  test('browser null control rejects all 500 vectors', async () => {
    const a = await deriveAnchor(); assert.equal(runNullControl(a.vector, browserTangent(a.vector)).passed, 0);
  });
  test('KL ceiling 0.05 includes boundary and rejects paper negative controls', () => {
    assert.equal(passesKl(0.05), true); assert.equal(passesKl(0.0500001), false);
    assert.equal(passesKl(0.00354614), true); assert.equal(passesKl(0.01023408), true);
    assert.equal(passesKl(0.24835405), false); assert.equal(passesKl(7.62060567), false);
  });
  test('audit seals input and result and detects tampering', async () => {
    const a = await deriveAnchor(); const r = evaluateRawGate(a.vector, a.vector, browserTangent(a.vector));
    const entries = await appendAudit([], a.vector, r); assert.equal(await verifyAudit(entries), true);
    entries[0].input[0] += 0.01; assert.equal(await verifyAudit(entries), false);
    await assert.rejects(appendAudit(entries, a.vector, r), /Audit integrity failure/);
  });
});
