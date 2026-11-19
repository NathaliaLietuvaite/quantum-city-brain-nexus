import {
  buildDeterministicFriduBasis,
  evalOdosQ230,
  Q2_30_CONSTANTS,
  q230ToFloat,
  vecToQ230,
  type RtlQ230Result,
} from './odos-q2-30.ts';

/* ============================================================================
 * S-02 · Quantum City-Brain 2D/Layer Corridor & Bit-Exact Q2.30 ODOS Engine
 * ========================================================================== */

export type CorridorInjectionMode = 'nominal' | 'g3_spoof' | 'in_band_tg1' | 'norm_fault';

export interface CorridorAgent {
  id: string;
  label: string;
  layer: 0 | 1 | 2; // 0 = Ground Lane, 1 = 120m Air-Taxi, 2 = 240m Express Drone
  laneIndex: number; // 0..3
  x: number; // 0..1 normalized corridor progress
  y: number; // 0..1 normalized altitude/lane screen coordinate
  speed: number;
  targeted: boolean;
  vecQ: number[];
  gate: RtlQ230Result;
  diverted: boolean;
}

export interface CorridorTelemetryPoint {
  tick: number;
  meanRcf: number;
  maxDeltaE: number;
  maxBleedLsb: number;
  passCount: number;
  vetoCount: number;
}

export interface CorridorTickSnapshot {
  tick: number;
  mode: CorridorInjectionMode;
  severity: number;
  agents: CorridorAgent[];
  passCount: number;
  vetoCount: number;
  meanRcf: number;
  maxDeltaE: number;
  maxBleedLsb: number;
  totalRtlCycles: number;
  totalLatencyUsAt100Mhz: number;
}

const AGENT_SPECS: ReadonlyArray<{
  id: string;
  label: string;
  layer: 0 | 1 | 2;
  laneIndex: number;
  phase0: number;
  speed: number;
  targeted: boolean;
}> = [
  // Layer 2: 240m Express Drones (top)
  { id: 'DR-01', label: 'Drone-01 (240m)', layer: 2, laneIndex: 0, phase0: 0.08, speed: 0.022, targeted: false },
  { id: 'DR-02', label: 'Drone-02 (240m)', layer: 2, laneIndex: 0, phase0: 0.42, speed: 0.024, targeted: true },
  { id: 'DR-03', label: 'Drone-03 (240m)', layer: 2, laneIndex: 0, phase0: 0.76, speed: 0.021, targeted: false },
  // Layer 1: 120m Air-Taxis (middle)
  { id: 'AT-01', label: 'AirTaxi-01 (120m)', layer: 1, laneIndex: 1, phase0: 0.14, speed: 0.017, targeted: true },
  { id: 'AT-02', label: 'AirTaxi-02 (120m)', layer: 1, laneIndex: 1, phase0: 0.51, speed: 0.018, targeted: false },
  { id: 'AT-03', label: 'AirTaxi-03 (120m)', layer: 1, laneIndex: 1, phase0: 0.85, speed: 0.016, targeted: true },
  // Layer 0: Ground Autonomous Lanes (bottom, 2 lanes)
  { id: 'GV-01', label: 'Pod-01 (Lane A)', layer: 0, laneIndex: 2, phase0: 0.05, speed: 0.012, targeted: false },
  { id: 'GV-02', label: 'Pod-02 (Lane A)', layer: 0, laneIndex: 2, phase0: 0.38, speed: 0.013, targeted: true },
  { id: 'GV-03', label: 'Pod-03 (Lane A)', layer: 0, laneIndex: 2, phase0: 0.71, speed: 0.012, targeted: false },
  { id: 'GV-04', label: 'Pod-04 (Lane B)', layer: 0, laneIndex: 3, phase0: 0.21, speed: 0.011, targeted: false },
  { id: 'GV-05', label: 'Pod-05 (Lane B)', layer: 0, laneIndex: 3, phase0: 0.57, speed: 0.012, targeted: true },
  { id: 'GV-06', label: 'Pod-06 (Lane B)', layer: 0, laneIndex: 3, phase0: 0.89, speed: 0.011, targeted: false },
];

const LANE_Y = [0.17, 0.40, 0.66, 0.84] as const;

function normalize64(v: number[]): number[] {
  const n = Math.hypot(...v);
  if (n < 1e-12) return new Array<number>(64).fill(0);
  return v.map((x) => x / n);
}

/**
 * Computes one deterministic City-Brain corridor tick where EVERY vehicle proposal
 * is gated in real time through our bit-exact Q2.30 BigInt RTL core (evalOdosQ230).
 */
export function evaluateCorridorTick(
  tick: number,
  mode: CorridorInjectionMode,
  severity: number,
  lRom: readonly number[],
  g3Rom: readonly number[],
): CorridorTickSnapshot {
  const basis = buildDeterministicFriduBasis(lRom, g3Rom);
  const clampedSev = Math.max(0, Math.min(1, severity));

  const agents: CorridorAgent[] = AGENT_SPECS.map((spec, idx) => {
    const ripple = 0.025 * Math.sin(tick * 0.19 + idx * 1.13);
    const nominalAlpha = Math.max(0.01, Math.min(0.14, 0.069 + ripple));

    let vecFloat: number[];
    if (mode === 'nominal' || !spec.targeted) {
      const cL = Math.sqrt(Math.max(0, 1 - nominalAlpha * nominalAlpha));
      vecFloat = normalize64(
        basis.lUnit.map((x, i) => cL * x + nominalAlpha * basis.tG1Unit[i]),
      );
    } else if (mode === 'g3_spoof') {
      // Out-of-band G3 spoofing directly injected into corridor proposal
      const mixG3 = Math.max(0.14, clampedSev);
      const cL = Math.sqrt(Math.max(0, 1 - mixG3 * mixG3));
      vecFloat = normalize64(
        basis.lUnit.map((x, i) => cL * x + mixG3 * basis.g3Unit[i]),
      );
    } else if (mode === 'in_band_tg1') {
      // In-band corridor drift along t_G1 (bypasses linear G3 strip, caught by raw ODOS gate)
      const mixG1 = Math.max(0.28, 0.24 + 0.58 * clampedSev);
      const cL = Math.sqrt(Math.max(0, 1 - mixG1 * mixG1));
      vecFloat = normalize64(
        basis.lUnit.map((x, i) => cL * x + mixG1 * basis.tG1Unit[i]),
      );
    } else {
      // Unnormalized / corrupted sensor packet -> triggers hardware norm_fault_o
      const scale = Math.max(0.0, 0.55 - 0.55 * clampedSev);
      vecFloat = basis.lUnit.map((x) => x * scale);
    }

    const vecQ = vecToQ230(vecFloat);
    const gate = evalOdosQ230(vecQ, lRom, g3Rom);
    const diverted = !gate.gatePass;
    const effSpeed = diverted ? spec.speed * 0.35 : spec.speed;
    const x = (spec.phase0 + tick * effSpeed) % 1;
    const baseLaneY = LANE_Y[spec.laneIndex];
    const y = diverted ? Math.min(0.95, baseLaneY + 0.055) : baseLaneY;

    return {
      id: spec.id,
      label: spec.label,
      layer: spec.layer,
      laneIndex: spec.laneIndex,
      x,
      y,
      speed: effSpeed,
      targeted: spec.targeted,
      vecQ,
      gate,
      diverted,
    };
  });

  const passCount = agents.filter((a) => a.gate.gatePass).length;
  const vetoCount = agents.length - passCount;
  const meanRcf = agents.reduce((acc, a) => acc + a.gate.rcfRawFloat, 0) / agents.length;
  const maxDeltaE = agents.reduce((acc, a) => Math.max(acc, a.gate.deltaERawFloat), 0);
  const maxBleedLsb = agents.reduce((acc, a) => Math.max(acc, a.gate.bleedPostQ), 0);
  const totalRtlCycles = agents.length * Q2_30_CONSTANTS.CONSTANT_CYCLES;

  return {
    tick,
    mode,
    severity: clampedSev,
    agents,
    passCount,
    vetoCount,
    meanRcf,
    maxDeltaE,
    maxBleedLsb,
    totalRtlCycles,
    totalLatencyUsAt100Mhz: totalRtlCycles / 100.0,
  };
}

/* ============================================================================
 * S-03 · Kuramoto Phase Synchronization & Kahan–Parlett Storm Engine
 * ========================================================================== */

export interface KuramotoStormStep {
  step: number;
  rFridu: number;
  rPax: number;
  rcfFridu: number;
  rcfPax: number;
  deltaEFridu: number;
  deltaEPax: number;
  bleedFriduLsb: number;
  friduPass: boolean;
  paxPass: boolean;
}

export interface KuramotoStormResult {
  steps: KuramotoStormStep[];
  finalPhasesFridu: number[];
  finalPhasesPax: number[];
  finalRFridu: number;
  finalRPax: number;
  finalFriduGate: RtlQ230Result;
  finalPaxGate: RtlQ230Result;
}

function kuramotoOrderParam(phases: readonly number[]): number {
  let sumCos = 0;
  let sumSin = 0;
  for (let i = 0; i < phases.length; i += 1) {
    sumCos += Math.cos(phases[i]);
    sumSin += Math.sin(phases[i]);
  }
  return Math.hypot(sumCos, sumSin) / Math.max(1, phases.length);
}

/**
 * Simulates N=24 Kuramoto swarm oscillators coupled to a real Q2.30 Kahan–Parlett gate
 * under storm perturbation beta in [0, 0.85]. Compares FRIDU shielded vs. PAX unshielded
 * (and flips FRIDU into unshielded failure when bypassKevlar=true as a negative control).
 */
export function runKuramotoStormSimulation(
  lRom: readonly number[],
  g3Rom: readonly number[],
  params: {
    stormBeta: number;
    couplingK: number;
    bypassKevlar: boolean;
    numOscillators?: number;
    numSteps?: number;
  },
): KuramotoStormResult {
  const N = params.numOscillators ?? 24;
  const totalSteps = params.numSteps ?? 48;
  const beta = Math.max(0, Math.min(0.85, params.stormBeta));
  const K = Math.max(0.2, Math.min(5.0, params.couplingK));
  const dt = 0.14;
  const basis = buildDeterministicFriduBasis(lRom, g3Rom);

  // Deterministic natural frequencies & initial phases (zero Math.random())
  const omega: number[] = Array.from({ length: N }, (_, i) => {
    const u = (i / Math.max(1, N - 1)) * 2 - 1;
    return 0.28 * u;
  });
  const phasesFridu: number[] = Array.from({ length: N }, (_, i) => 0.18 * Math.sin(i * 1.7 + 0.4));
  const phasesPax: number[] = [...phasesFridu];

  const steps: KuramotoStormStep[] = [];
  let lastFriduGate = evalOdosQ230(vecToQ230(basis.psiCore), lRom, g3Rom);
  let lastPaxGate = lastFriduGate;

  const projectTwoPassStrip = (v: number[], g3: number[]): number[] => {
    const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
    const d1 = dot(v, g3);
    const p1 = v.map((x, i) => x - d1 * g3[i]);
    const d2 = dot(p1, g3);
    const p2 = p1.map((x, i) => x - d2 * g3[i]);
    return normalize64(p2);
  };

  for (let s = 0; s <= totalSteps; s += 1) {
    // Storm ramp envelope: smooth ramp-up from step 4 to step 14
    const ramp = s < 4 ? 0 : Math.min(1, (s - 4) / 10);
    const betaNow = beta * ramp;

    // Construct real S^63 storm state: base core + out-of-band G3 storm perturbation
    const paxMix = normalize64(
      basis.psiCore.map((x, i) => x + betaNow * basis.g3Unit[i]),
    );
    const friduVec = params.bypassKevlar ? paxMix : projectTwoPassStrip(paxMix, basis.g3Unit);

    const paxGate = evalOdosQ230(vecToQ230(paxMix), lRom, g3Rom);
    const friduGate = evalOdosQ230(vecToQ230(friduVec), lRom, g3Rom);
    lastPaxGate = paxGate;
    lastFriduGate = friduGate;

    const rFridu = kuramotoOrderParam(phasesFridu);
    const rPax = kuramotoOrderParam(phasesPax);

    steps.push({
      step: s,
      rFridu: Number(rFridu.toFixed(4)),
      rPax: Number(rPax.toFixed(4)),
      rcfFridu: Number(friduGate.rcfRawFloat.toFixed(4)),
      rcfPax: Number(paxGate.rcfRawFloat.toFixed(4)),
      deltaEFridu: Number(friduGate.deltaERawFloat.toFixed(4)),
      deltaEPax: Number(paxGate.deltaERawFloat.toFixed(4)),
      bleedFriduLsb: friduGate.bleedPostQ,
      friduPass: friduGate.gatePass,
      paxPass: paxGate.gatePass,
    });

    if (s < totalSteps) {
      // Advance Kuramoto ODE: effective phase noise is driven by actual unstripped ΔE_raw!
      const paxPerturbGain = 7.5 * paxGate.deltaERawFloat;
      const friduPerturbGain = 7.5 * friduGate.deltaERawFloat;

      const nextFridu = [...phasesFridu];
      const nextPax = [...phasesPax];
      for (let i = 0; i < N; i += 1) {
        let coupF = 0;
        let coupP = 0;
        for (let j = 0; j < N; j += 1) {
          coupF += Math.sin(phasesFridu[j] - phasesFridu[i]);
          coupP += Math.sin(phasesPax[j] - phasesPax[i]);
        }
        const stormDrive = Math.sin((s + 1) * 1.37 + i * 2.41) + 0.65 * Math.cos((s + 1) * 0.83 - i * 1.93);
        nextFridu[i] = phasesFridu[i] + dt * (omega[i] + (K / N) * coupF + friduPerturbGain * stormDrive);
        nextPax[i] = phasesPax[i] + dt * (omega[i] + (K / N) * coupP + paxPerturbGain * stormDrive);
      }
      for (let i = 0; i < N; i += 1) {
        phasesFridu[i] = nextFridu[i];
        phasesPax[i] = nextPax[i];
      }
    }
  }

  return {
    steps,
    finalPhasesFridu: phasesFridu,
    finalPhasesPax: phasesPax,
    finalRFridu: steps[steps.length - 1]?.rFridu ?? 0,
    finalRPax: steps[steps.length - 1]?.rPax ?? 0,
    finalFriduGate: lastFriduGate,
    finalPaxGate: lastPaxGate,
  };
}

/* ============================================================================
 * S-04 · RTX 4060 Ti L2 Roofline & Stage 1 / 2 / 3 Silicon Scaling Calculator
 * ========================================================================== */

export type SiliconStageId = 'stage1_baseline' | 'stage2_folded_9to3' | 'stage3_single_mac_9to1';

export interface SiliconStageSpec {
  id: SiliconStageId;
  mulBlocks: number;
  mulReductionPct: number;
  cyclesPerDecision: number;
  macClockMultiplier: number;
  estimatedGateCells: number;
}

export const SILICON_STAGE_SPECS: Readonly<Record<SiliconStageId, SiliconStageSpec>> = {
  stage1_baseline: {
    id: 'stage1_baseline',
    mulBlocks: 9,
    mulReductionPct: 0,
    cyclesPerDecision: 195,
    macClockMultiplier: 1,
    estimatedGateCells: 89609, // Exact Yosys 0.71 post-techmap count (REGISTER_M)
  },
  stage2_folded_9to3: {
    id: 'stage2_folded_9to3',
    mulBlocks: 3,
    mulReductionPct: 66.7,
    cyclesPerDecision: 195, // Inter-state resource sharing keeps 195 single-clock cycles invariant!
    macClockMultiplier: 1,
    estimatedGateCells: 39200, // Analytical estimate (REGISTER_T)
  },
  stage3_single_mac_9to1: {
    id: 'stage3_single_mac_9to1',
    mulBlocks: 1,
    mulReductionPct: 88.9,
    cyclesPerDecision: 195, // Preserves 195 system cycles via 3x MAC clock domain (or 585 at 1x)
    macClockMultiplier: 3,
    estimatedGateCells: 22400, // Analytical estimate (REGISTER_T)
  },
};

export interface SiliconScalingResult {
  stage: SiliconStageSpec;
  clockMhz: number;
  parallelCores: number;
  fleetVehicles: number;
  cadenceHz: number;
  latencyUsPerDecision: number;
  decisionsPerSecPerCore: number;
  clusterDecisionsPerSec: number;
  requiredFleetDecisionsPerSec: number;
  headroomFactor: number;
  utilizationPct: number;
  fleetSupported: boolean;
  totalEstimatedMulBlocks: number;
  frequencySweep: Array<{
    clockMhz: number;
    clusterKDecisionsPerSec: number;
    requiredKDecisionsPerSec: number;
  }>;
}

export function calculateSiliconThroughput(params: {
  stageId: SiliconStageId;
  clockMhz: number;
  parallelCores: number;
  fleetVehicles: number;
  cadenceHz: number;
}): SiliconScalingResult {
  const stage = SILICON_STAGE_SPECS[params.stageId];
  const clockMhz = Math.max(50, Math.min(500, params.clockMhz));
  const parallelCores = Math.max(1, Math.min(64, Math.round(params.parallelCores)));
  const fleetVehicles = Math.max(1000, Math.min(1_000_000, Math.round(params.fleetVehicles)));
  const cadenceHz = Math.max(1, Math.min(100, Math.round(params.cadenceHz)));

  const latencyUsPerDecision = stage.cyclesPerDecision / clockMhz;
  const decisionsPerSecPerCore = (clockMhz * 1_000_000) / stage.cyclesPerDecision;
  const clusterDecisionsPerSec = decisionsPerSecPerCore * parallelCores;
  const requiredFleetDecisionsPerSec = fleetVehicles * cadenceHz;
  const headroomFactor = clusterDecisionsPerSec / Math.max(1, requiredFleetDecisionsPerSec);
  const utilizationPct = (requiredFleetDecisionsPerSec / Math.max(1, clusterDecisionsPerSec)) * 100;

  const sweepClocks = [50, 100, 150, 200, 250, 300, 400, 500];
  const frequencySweep = sweepClocks.map((mhz) => ({
    clockMhz: mhz,
    clusterKDecisionsPerSec: Math.round(((mhz * 1_000_000) / stage.cyclesPerDecision) * parallelCores / 1000),
    requiredKDecisionsPerSec: Math.round(requiredFleetDecisionsPerSec / 1000),
  }));

  return {
    stage,
    clockMhz,
    parallelCores,
    fleetVehicles,
    cadenceHz,
    latencyUsPerDecision,
    decisionsPerSecPerCore,
    clusterDecisionsPerSec,
    requiredFleetDecisionsPerSec,
    headroomFactor,
    utilizationPct,
    fleetSupported: clusterDecisionsPerSec >= requiredFleetDecisionsPerSec,
    totalEstimatedMulBlocks: stage.mulBlocks * parallelCores,
    frequencySweep,
  };
}

export { q230ToFloat };
