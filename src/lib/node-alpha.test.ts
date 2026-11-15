import { describe, test, expect } from 'bun:test';
import { deriveAnchor, browserTangent, evaluateRawGate, runNullControl, passesKl, appendAudit, verifyAudit } from './node-alpha';

describe('Node Alpha V1.3 browser reference', () => {
  test('canonical <64f> seal matches config.py and bridge B.6', async () => {
    const a = await deriveAnchor();
    expect(a.seal).toBe('bb17ede97aa45c76ef9afa63cb457f7d684e5ede40b0432b2ecf3b6b9d3e03a3');
    expect(a.matches).toBe(true);
  });
  test('anchor passes the raw gate without carrier mixing', async () => {
    const a = await deriveAnchor(); const r = evaluateRawGate(a.vector, a.vector, browserTangent(a.vector));
    expect(r.passed).toBe(true); expect(r.rcfRaw).toBeCloseTo(1, 12);
  });
  test('pure G3 collision gives delta E = 1 and veto', async () => {
    const a = await deriveAnchor(); const g = browserTangent(a.vector); const r = evaluateRawGate(g, a.vector, g);
    expect(r.passed).toBe(false); expect(r.deltaERaw).toBeCloseTo(1, 12); expect(r.bleedPost).toBe(1);
  });
  test('raw RCF floor is inclusive at 0.95 and rejects 0.949', () => {
    const a = [1, ...Array(63).fill(0)], g = [0, 0, 1, ...Array(61).fill(0)];
    const candidate = (rcf: number) => [Math.sqrt(rcf), Math.sqrt(1 - rcf), ...Array(62).fill(0)];
    expect(evaluateRawGate(candidate(0.9500000001), a, g).passed).toBe(true);
    expect(evaluateRawGate(candidate(0.949), a, g).passed).toBe(false);
  });
  test('delta E above 0.05 vetoes even with RCF above 0.95', () => {
    const a = [1, ...Array(63).fill(0)], g = [0, 1, ...Array(62).fill(0)];
    const r = evaluateRawGate([Math.sqrt(0.99), 0.1, ...Array(62).fill(0)], a, g);
    expect(r.rcfRaw).toBeCloseTo(0.99); expect(r.deltaERaw).toBeCloseTo(0.055); expect(r.passed).toBe(false);
  });
  test('zero and nonfinite candidates fail closed', async () => {
    const a = await deriveAnchor(), g = browserTangent(a.vector);
    expect(evaluateRawGate(Array(64).fill(0), a.vector, g).passed).toBe(false);
    expect(evaluateRawGate(Array(64).fill(NaN), a.vector, g).passed).toBe(false);
  });
  test('browser null control rejects all 500 vectors', async () => {
    const a = await deriveAnchor(); expect(runNullControl(a.vector, browserTangent(a.vector)).passed).toBe(0);
  });
  test('KL ceiling 0.05 includes boundary and rejects paper negative controls', () => {
    expect(passesKl(0.05)).toBe(true); expect(passesKl(0.0500001)).toBe(false);
    expect(passesKl(0.00354614)).toBe(true); expect(passesKl(0.01023408)).toBe(true);
    expect(passesKl(0.24835405)).toBe(false); expect(passesKl(7.62060567)).toBe(false);
  });
  test('audit seals input and result and detects tampering', async () => {
    const a = await deriveAnchor(); const r = evaluateRawGate(a.vector, a.vector, browserTangent(a.vector));
    const entries = await appendAudit([], a.vector, r); expect(await verifyAudit(entries)).toBe(true);
    entries[0].input[0] += 0.01; expect(await verifyAudit(entries)).toBe(false);
    await expect(appendAudit(entries, a.vector, r)).rejects.toThrow('Audit integrity failure');
  });
});
