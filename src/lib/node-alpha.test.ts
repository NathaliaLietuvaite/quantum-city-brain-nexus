/// <reference types="node" />
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  deriveAnchor,
  browserTangent,
  evaluateRawGate,
  runNullControl,
  passesKl,
  appendAudit,
  verifyAudit,
} from './node-alpha.ts';
import {
  evalOdosQ230,
  evaluateFriduDefenseInDepthQ230,
  formatVerilatorEmulatorCommand,
  Q2_30_CONSTANTS,
  vecToQ230,
} from './odos-q2-30.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const telemetry = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'node-alpha-telemetry.json'), 'utf-8'),
);

describe('Node Alpha V1.8.1 + V2.0-RTL-ALPHA (SYNC-12) browser & Q2.30 reference', () => {
  test('canonical <64f> seal matches config.py and ACE_SYNC_LEDGER.json', async () => {
    const a = await deriveAnchor();
    assert.equal(a.seal, 'bb17ede97aa45c76ef9afa63cb457f7d684e5ede40b0432b2ecf3b6b9d3e03a3');
    assert.equal(a.seal, telemetry.golden_seals.canonical_little_vector_f32_seal);
    assert.equal(a.matches, true);
  });

  test('anchor passes the raw gate without carrier mixing', async () => {
    const a = await deriveAnchor();
    const r = evaluateRawGate(a.vector, a.vector, browserTangent(a.vector));
    assert.equal(r.passed, true);
    assert.ok(Math.abs(r.rcfRaw - 1) < 1e-12);
  });

  test('pure G3 collision gives delta E = 1 and veto', async () => {
    const a = await deriveAnchor();
    const g = browserTangent(a.vector);
    const r = evaluateRawGate(g, a.vector, g);
    assert.equal(r.passed, false);
    assert.ok(Math.abs(r.deltaERaw - 1) < 1e-12);
    assert.equal(r.bleedPost, 1);
  });

  test('raw RCF floor is inclusive at 0.95 and rejects 0.949', () => {
    const a = [1, ...Array(63).fill(0)];
    const g = [0, 0, 1, ...Array(61).fill(0)];
    const candidate = (rcf: number) => [Math.sqrt(rcf), Math.sqrt(1 - rcf), ...Array(62).fill(0)];
    assert.equal(evaluateRawGate(candidate(0.9500000001), a, g).passed, true);
    assert.equal(evaluateRawGate(candidate(0.949), a, g).passed, false);
  });

  test('delta E above 0.05 vetoes even with RCF above 0.95', () => {
    const a = [1, ...Array(63).fill(0)];
    const g = [0, 1, ...Array(62).fill(0)];
    const r = evaluateRawGate([Math.sqrt(0.99), 0.1, ...Array(62).fill(0)], a, g);
    assert.ok(Math.abs(r.rcfRaw - 0.99) < 0.005);
    assert.ok(Math.abs(r.deltaERaw - 0.055) < 0.005);
    assert.equal(r.passed, false);
  });

  test('zero and nonfinite candidates fail closed', async () => {
    const a = await deriveAnchor();
    const g = browserTangent(a.vector);
    assert.equal(evaluateRawGate(Array(64).fill(0), a.vector, g).passed, false);
    assert.equal(evaluateRawGate(Array(64).fill(NaN), a.vector, g).passed, false);
  });

  test('browser null control rejects all 500 vectors', async () => {
    const a = await deriveAnchor();
    assert.equal(runNullControl(a.vector, browserTangent(a.vector)).passed, 0);
  });

  test('Stage-3 N=25 KL ceiling 0.05 accepts A1/A2 and vetoes matched B1/B2', () => {
    assert.equal(passesKl(0.05), true);
    assert.equal(passesKl(0.0500001), false);
    const conds = telemetry.stage3_kl_n25.conditions as Array<{ id: string; mean_kl: number; passed: boolean }>;
    assert.equal(conds.length, 4);
    for (const c of conds) {
      assert.equal(passesKl(c.mean_kl), c.passed, `KL gate mismatch for ${c.id}`);
    }
  });

  test('audit seals input and result and detects tampering', async () => {
    const a = await deriveAnchor();
    const r = evaluateRawGate(a.vector, a.vector, browserTangent(a.vector));
    const entries = await appendAudit([], a.vector, r);
    assert.equal(await verifyAudit(entries), true);
    entries[0].input[0] += 0.01;
    assert.equal(await verifyAudit(entries), false);
    await assert.rejects(appendAudit(entries, a.vector, r), /Audit integrity failure/);
  });

  test('S-01 Q2.30 BigInt RTL core matches Verilator 5.055 to exact 0 LSB on canonical scenarios', () => {
    const lRom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
    const g3Rom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;
    const sc = telemetry.rtl_v20_alpha.scenarios;

    const checks: Array<{ name: string; vecQ: number[]; expected: typeof sc.canonical_l }> = [
      { name: 'canonical_l', vecQ: lRom, expected: sc.canonical_l },
      { name: 'pure_g3_attack', vecQ: g3Rom, expected: sc.pure_g3_attack },
      { name: 'zero_vector', vecQ: Array(64).fill(0), expected: sc.zero_vector },
      {
        name: 'scaled_half_l_vector',
        vecQ: vecToQ230(lRom.map((q) => (q / Q2_30_CONSTANTS.ONE_Q2_30) * 0.5)),
        expected: sc.scaled_half_l_vector,
      },
    ];

    for (const { name, vecQ, expected } of checks) {
      const res = evalOdosQ230(vecQ, lRom, g3Rom);
      assert.equal(res.cycleCount, 195, `${name} cycles`);
      assert.equal(res.gatePass, expected.gate_pass, `${name} gate_pass`);
      assert.equal(res.vetoPin, expected.veto_pin, `${name} veto_pin`);
      assert.equal(res.normFault, expected.norm_fault, `${name} norm_fault`);
      assert.equal(res.pureG3Collision, expected.pure_g3_collision, `${name} pure_g3_collision`);
      assert.equal(res.normSqQ, expected.norm_sq_q, `${name} norm_sq_q 0 LSB`);
      assert.equal(res.rcfRawQ, expected.rcf_raw_q, `${name} rcf_raw_q 0 LSB`);
      assert.equal(res.g3OverlapQ, expected.g3_overlap_q, `${name} g3_overlap_q 0 LSB`);
      assert.equal(res.deltaERawQ, expected.delta_e_raw_q, `${name} delta_e_raw_q 0 LSB`);
      assert.equal(res.bleedPostQ, expected.bleed_post_q, `${name} bleed_post_q 0 LSB`);
      assert.equal(res.fsmStages.slice(0, 5).every((s) => s.vetoPin && !s.gatePass), true);
    }

    const cli = formatVerilatorEmulatorCommand(lRom);
    assert.ok(cli.includes('./rtl/build/odos_gate_emu'));
  });

  test('S-01 Q2.30 BigInt RTL core rejects 50 isotropic null vectors with <= 1 LSB bleed', () => {
    const lRom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
    const g3Rom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;
    let seed = 20261115;
    const uniform = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return (seed + 1) / 4294967297;
    };
    let passes = 0;
    let maxBleed = 0;
    for (let t = 0; t < 50; t += 1) {
      const raw = Array.from(
        { length: 64 },
        () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform()),
      );
      const n = Math.hypot(...raw);
      const unitQ = vecToQ230(raw.map((x) => x / n));
      const res = evalOdosQ230(unitQ, lRom, g3Rom);
      if (res.gatePass) passes += 1;
      maxBleed = Math.max(maxBleed, res.bleedPostQ);
      assert.equal(res.cycleCount, 195);
    }
    assert.equal(passes, 0);
    assert.ok(maxBleed <= 1, `Expected <= 1 LSB bleed, got ${maxBleed}`);
  });

  test('Appendix G Q2.30 Defense-in-Depth: FRIDU passes, PAX/bypass/In-Band t_G1 veto', () => {
    const lRom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
    const g3Rom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;

    const shielded = evaluateFriduDefenseInDepthQ230(lRom, g3Rom, 0.35, false);
    assert.equal(shielded.baseGate.gatePass, true);
    assert.equal(shielded.friduGate.gatePass, true);
    assert.equal(shielded.paxGate.gatePass, false);
    assert.equal(shielded.inBandTg1Gate.gatePass, false);

    const bypassed = evaluateFriduDefenseInDepthQ230(lRom, g3Rom, 0.35, true);
    assert.equal(bypassed.friduGate.gatePass, false);
  });
});
