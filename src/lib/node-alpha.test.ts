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
  buildCrossSubstrateProofPack,
  evalOdosQ230,
  evaluateFriduDefenseInDepthQ230,
  formatVerilatorEmulatorCommand,
  Q2_30_CONSTANTS,
  vecToQ230,
} from './odos-q2-30.ts';
import {
  countTabsByRegister,
  getPrimaryRegister,
  getSectorForTab,
  getTabsBySector,
  MISSION_CONTROL_SECTORS,
  MISSION_CONTROL_TABS,
  sampleVcdTrackAtCycle,
  tabMatchesTruthFilter,
} from './mission-control.ts';
import {
  calculateSiliconThroughput,
  evaluateCorridorTick,
  runKuramotoStormSimulation,
} from './phase2-simulators.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const telemetry = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'node-alpha-telemetry.json'), 'utf-8'),
);
const vcdWaveforms = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'rtl-vcd-waveforms.json'), 'utf-8'),
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

  test('[MOD-142] Colab portable SYNC-12 telemetry seals and skip policy match ACE_SYNC_LEDGER.json', () => {
    const colab = telemetry.colab_mod142_portable_rtl;
    assert.equal(
      telemetry.golden_seals.colab_mod142_notebook_sha256,
      '51a1e4e9c7b4a611b50c82876ec307210c5efd9df7e5e8204e727c50eb0b3265',
    );
    assert.equal(colab.notebook_sha256, telemetry.golden_seals.colab_mod142_notebook_sha256);
    assert.equal(colab.golden_checksums_verified, 9);
    assert.equal(
      colab.portable_tests_executed_without_eda + colab.portable_tests_skipped_without_eda,
      colab.portable_tests_total,
    );
    assert.equal(colab.isotropic_null_passes, 0);
    assert.ok(colab.isotropic_max_bleed_lsb <= 1);
    assert.equal(colab.rtl_ast_semicolon_packers, 0);
    assert.ok(colab.rtl_ast_max_cyclomatic_complexity <= colab.rtl_ast_cc_limit);
  });

  test('Mission Control 3-sector partition covers all 21 unique modules with zero drops or duplicates', () => {
    assert.equal(MISSION_CONTROL_SECTORS.length, 3);
    assert.equal(MISSION_CONTROL_TABS.length, 21);
    const ids = new Set(MISSION_CONTROL_TABS.map((tab) => tab.id));
    assert.equal(ids.size, 21);

    const sectorSum = MISSION_CONTROL_SECTORS.reduce(
      (acc, sec) => acc + getTabsBySector(sec.id).length,
      0,
    );
    assert.equal(sectorSum, 21);

    for (const sec of MISSION_CONTROL_SECTORS) {
      assert.equal(getSectorForTab(sec.defaultTab), sec.id);
    }
    assert.equal(getSectorForTab('alpha'), 'labs');
    assert.equal(getSectorForTab('overview'), 'vision');
  });

  test('Epistemic Truth Lens register filter & priority accurately separate M/D/T/I', () => {
    const counts = countTabsByRegister();
    assert.equal(counts.M, 3);
    assert.equal(tabMatchesTruthFilter('alpha', 'M'), true);
    assert.equal(tabMatchesTruthFilter('argon', 'M'), true);
    assert.equal(tabMatchesTruthFilter('mod53', 'M'), true);
    assert.equal(tabMatchesTruthFilter('overview', 'M'), false);
    assert.equal(tabMatchesTruthFilter('overview', 'I'), true);
    assert.equal(tabMatchesTruthFilter('freedom', 'ALL'), true);
    assert.equal(getPrimaryRegister(['I', 'D', 'M']), 'M');
    assert.equal(getPrimaryRegister(['I', 'T']), 'T');
    assert.equal(getPrimaryRegister(['I']), 'I');
  });

  test('Real Verilator 5.055 VCD traces enforce glitch-free 195-cycle fail-closed timing', () => {
    const passTrace = vcdWaveforms.traces.canonical_l_pass;
    const vetoTrace = vcdWaveforms.traces.g3_attack_veto;

    assert.equal(passTrace.compute_cycles, 195);
    assert.equal(vetoTrace.compute_cycles, 195);
    assert.equal(passTrace.source_vcd_sha256.length, 64);
    assert.equal(vetoTrace.source_vcd_sha256.length, 64);

    // Fail-closed invariant: veto_pin_o === 1 across ALL compute cycles 0..196 in PASS trace
    for (let cyc = 0; cyc <= 196; cyc += 1) {
      assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.veto_pin_o, cyc), 1, `PASS veto low early at ${cyc}`);
      assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.gate_pass_o, cyc), 0, `PASS high early at ${cyc}`);
    }
    assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.veto_pin_o, 197), 0);
    assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.gate_pass_o, 197), 1);
    assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.done_o, 197), 1);
    assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.state_q, 2), 'S_LOAD_DOT');
    assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.state_q, 66), 'S_EVAL_RAW');
    assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.state_q, 67), 'S_STRIP_P1');
    assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.state_q, 131), 'S_LATCH_P2');
    assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.state_q, 132), 'S_STRIP_P2');
    assert.equal(sampleVcdTrackAtCycle(passTrace.tracks.state_q, 196), 'S_VERDICT');

    // Pure G3 attack trace: veto_pin_o === 1 across EVERY cycle 0..197, zero glitches
    for (let cyc = 0; cyc <= 197; cyc += 1) {
      assert.equal(sampleVcdTrackAtCycle(vetoTrace.tracks.veto_pin_o, cyc), 1, `VETO glitch at ${cyc}`);
      assert.equal(sampleVcdTrackAtCycle(vetoTrace.tracks.gate_pass_o, cyc), 0, `VETO pass glitch at ${cyc}`);
    }
    assert.equal(sampleVcdTrackAtCycle(vetoTrace.tracks.pure_g3_collision_o, 197), 1);
  });

  test('Cross-Substrate Proof Pack JSON matches Q2.30 Verilator outputs and golden seals', () => {
    const lRom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
    const g3Rom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;
    const res = evalOdosQ230(lRom, lRom, g3Rom);
    const pack = buildCrossSubstrateProofPack('canonical_l', lRom, res, {
      syncId: telemetry.sync_id,
      lRomSha256: telemetry.golden_seals.l_vec_q2_30_hex_sha256,
      g3RomSha256: telemetry.golden_seals.g3_vec_q2_30_hex_sha256,
      rtlReportSha256: telemetry.golden_seals.rtl_odos_gate_emulator_report_sha256,
    });
    assert.equal(pack.schema, 'VMAX12_CROSS_SUBSTRATE_PROOF_PACK_V1');
    assert.equal(pack.input_vector_q2_30.length, 64);
    assert.equal(pack.verification_instructions.expected_cycle_count, 195);
    assert.equal(pack.verification_instructions.expected_max_lsb_diff, 0);
    assert.ok(pack.verification_instructions.verilator_cli_command.includes('./rtl/build/odos_gate_emu'));
    assert.equal(pack.expected_q2_30_outputs.gate_pass, true);
    assert.equal(pack.expected_q2_30_outputs.veto_pin, false);
    assert.equal(pack.golden_seals.l_vec_q2_30_hex_sha256, telemetry.golden_seals.l_vec_q2_30_hex_sha256);
  });

  test('S-02 City-Brain Corridor Simulator passes all 12 ground/aerial agents in nominal mode', () => {
    const lRom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
    const g3Rom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;
    const snap = evaluateCorridorTick(7, 'nominal', 0.45, lRom, g3Rom);
    assert.equal(snap.agents.length, 12);
    assert.equal(snap.passCount, 12);
    assert.equal(snap.vetoCount, 0);
    assert.equal(snap.totalRtlCycles, 12 * 195);
    assert.ok(snap.meanRcf >= 0.98);
    assert.ok(snap.maxDeltaE <= 0.05);
    assert.ok(snap.maxBleedLsb <= 1);
  });

  test('S-02 Corridor fault injections (G3 spoof, In-Band t_G1, norm_fault) trigger exact fail-closed vetoes', () => {
    const lRom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
    const g3Rom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;

    const spoof = evaluateCorridorTick(10, 'g3_spoof', 0.5, lRom, g3Rom);
    assert.equal(spoof.vetoCount, 5);
    assert.equal(spoof.passCount, 7);
    assert.equal(spoof.agents.filter((a) => a.targeted).every((a) => a.diverted && a.gate.vetoPin), true);

    const inBand = evaluateCorridorTick(10, 'in_band_tg1', 0.5, lRom, g3Rom);
    assert.equal(inBand.vetoCount, 5);
    assert.ok(inBand.maxBleedLsb <= 1, 'In-band attack has minimal G3 bleed yet is caught by raw ODOS gate');

    const normFault = evaluateCorridorTick(10, 'norm_fault', 0.8, lRom, g3Rom);
    assert.equal(normFault.vetoCount, 5);
    assert.equal(normFault.agents.filter((a) => a.targeted).every((a) => a.gate.normFault && a.gate.vetoPin), true);
  });

  test('S-03 Kuramoto & Kahan–Parlett storm preserves FRIDU coherence while PAX collapses', () => {
    const lRom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
    const g3Rom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;
    const res = runKuramotoStormSimulation(lRom, g3Rom, {
      stormBeta: 0.55,
      couplingK: 2.2,
      bypassKevlar: false,
    });
    assert.equal(res.finalFriduGate.gatePass, true);
    assert.ok(res.finalFriduGate.bleedPostQ <= 1);
    assert.equal(res.finalPaxGate.gatePass, false);
    assert.ok(res.finalRFridu > 0.90, `Expected FRIDU r > 0.90, got ${res.finalRFridu}`);
    assert.ok(res.finalRPax < res.finalRFridu, `Expected PAX collapse below FRIDU (${res.finalRPax} vs ${res.finalRFridu})`);
  });

  test('S-03 Negative control bypass_kevlar=true collapses FRIDU identically onto PAX', () => {
    const lRom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
    const g3Rom: number[] = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;
    const res = runKuramotoStormSimulation(lRom, g3Rom, {
      stormBeta: 0.55,
      couplingK: 2.2,
      bypassKevlar: true,
    });
    assert.equal(res.finalFriduGate.gatePass, false);
    assert.equal(res.finalRFridu, res.finalRPax);
  });

  test('S-04 Silicon throughput & Stage 1/2/3 MAC scaling matches 195-cycle analytical law', () => {
    const s1 = calculateSiliconThroughput({
      stageId: 'stage1_baseline',
      clockMhz: 100,
      parallelCores: 1,
      fleetVehicles: 10_000,
      cadenceHz: 20,
    });
    assert.equal(s1.stage.mulBlocks, 9);
    assert.equal(s1.stage.estimatedGateCells, 89609);
    assert.ok(Math.abs(s1.latencyUsPerDecision - 1.95) < 1e-9);
    assert.equal(Math.round(s1.decisionsPerSecPerCore), 512821);
    assert.equal(s1.fleetSupported, true);

    const s2 = calculateSiliconThroughput({
      stageId: 'stage2_folded_9to3',
      clockMhz: 100,
      parallelCores: 1,
      fleetVehicles: 100_000,
      cadenceHz: 50,
    });
    assert.equal(s2.stage.mulBlocks, 3);
    assert.equal(s2.stage.cyclesPerDecision, 195);
    assert.equal(s2.fleetSupported, false);

    const s3 = calculateSiliconThroughput({
      stageId: 'stage3_single_mac_9to1',
      clockMhz: 200,
      parallelCores: 16,
      fleetVehicles: 500_000,
      cadenceHz: 20,
    });
    assert.equal(s3.stage.mulBlocks, 1);
    assert.equal(s3.totalEstimatedMulBlocks, 16);
    assert.equal(s3.fleetSupported, true);
  });
});
