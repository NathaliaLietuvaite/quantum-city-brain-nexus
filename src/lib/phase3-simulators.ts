import { evalOdosQ230, type RtlQ230Result } from './odos-q2-30.ts';

/* ============================================================================
 * S-05 · Real Empirical F-01 ROC / Confusion Matrix & Stage-3 KL Explorer
 * ========================================================================== */

export interface RocPoint {
  threshold: number;
  fpr: number;
  tpr: number;
}

export interface ThresholdConfusion {
  threshold: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  tpr: number;
  fpr: number;
  precision: number;
  accuracy: number;
}

export interface EmpiricalRocResult {
  auc: number;
  nPos: number;
  nNeg: number;
  points: RocPoint[];
  minScore: number;
  maxScore: number;
}

/**
 * Exact non-parametric empirical ROC curve & Mann–Whitney U AUC directly on
 * real held-out Nemotron-3-Nano-4B scores (REGISTER_M).
 */
export function computeEmpiricalRoc(
  positives: readonly number[],
  negatives: readonly number[],
): EmpiricalRocResult {
  const nPos = positives.length;
  const nNeg = negatives.length;
  if (nPos === 0 || nNeg === 0) {
    return { auc: 0.5, nPos, nNeg, points: [], minScore: 0, maxScore: 1 };
  }

  // Exact Mann-Whitney U AUC (handles ties with 0.5 weight)
  let wins = 0;
  for (let i = 0; i < nPos; i += 1) {
    for (let j = 0; j < nNeg; j += 1) {
      if (positives[i] > negatives[j]) wins += 1;
      else if (positives[i] === negatives[j]) wins += 0.5;
    }
  }
  const auc = wins / (nPos * nNeg);

  const allScores = [...positives, ...negatives];
  const minScore = Math.min(...allScores);
  const maxScore = Math.max(...allScores);

  const uniqueThresholds = Array.from(new Set(allScores)).sort((a, b) => b - a);
  const thresholds = [maxScore + 1e-6, ...uniqueThresholds, minScore - 1e-6];

  const points: RocPoint[] = thresholds.map((th) => {
    let tp = 0;
    let fp = 0;
    for (let i = 0; i < nPos; i += 1) if (positives[i] >= th) tp += 1;
    for (let j = 0; j < nNeg; j += 1) if (negatives[j] >= th) fp += 1;
    return {
      threshold: Number(th.toFixed(6)),
      fpr: Number((fp / nNeg).toFixed(4)),
      tpr: Number((tp / nPos).toFixed(4)),
    };
  });

  return { auc, nPos, nNeg, points, minScore, maxScore };
}

export function evaluateThresholdConfusion(
  positives: readonly number[],
  negatives: readonly number[],
  threshold: number,
): ThresholdConfusion {
  let tp = 0;
  let fn = 0;
  let fp = 0;
  let tn = 0;
  for (let i = 0; i < positives.length; i += 1) {
    if (positives[i] >= threshold) tp += 1;
    else fn += 1;
  }
  for (let j = 0; j < negatives.length; j += 1) {
    if (negatives[j] >= threshold) fp += 1;
    else tn += 1;
  }
  const tpr = positives.length ? tp / positives.length : 0;
  const fpr = negatives.length ? fp / negatives.length : 0;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 1;
  const accuracy = (tp + tn) / Math.max(1, positives.length + negatives.length);

  return { threshold, tp, fp, tn, fn, tpr, fpr, precision, accuracy };
}

export interface KlConditionInput {
  id: string;
  label: string;
  mean_kl: number;
  top1: string;
  passed: boolean;
}

export function evaluateKlThresholdSweep(
  conditions: readonly KlConditionInput[],
  klCeiling: number,
): Array<KlConditionInput & { passesAtSlider: boolean }> {
  return conditions.map((c) => ({
    ...c,
    passesAtSlider: c.mean_kl <= klCeiling,
  }));
}

/* ============================================================================
 * S-06 · HWiNFO64 Empirical Power Regimes & Fleet Economics Simulator
 * ========================================================================== */

export interface FleetEnergyParams {
  nodeCount: number;
  hoursPerDay: number;
  electricityEurPerKwh: number;
  triageOffloadShare: number; // Fraction of operating time in Regime II (9.57 W) vs Regime I (85.78 W)
  regime1PeakW: number; // REGISTER_M measured (85.78 W)
  regime2QuiescentW: number; // REGISTER_M measured (9.57 W)
  cloudGpuReferenceW?: number; // REGISTER_D reference datacenter GPU envelope (default 350 W)
  co2KgPerKwh?: number; // REGISTER_D EU grid reference (default 0.35 kg/kWh)
}

export interface FleetEnergyResult {
  pqmsEffectiveWPerNode: number;
  pqmsAnnualMwh: number;
  regime1ContinuousAnnualMwh: number;
  cloudGpuAnnualMwh: number;
  pqmsAnnualCostEur: number;
  regime1ContinuousAnnualCostEur: number;
  cloudGpuAnnualCostEur: number;
  savingsVsRegime1Mwh: number;
  savingsVsRegime1Eur: number;
  savingsVsRegime1Pct: number;
  savingsVsCloudEur: number;
  co2SavedVsRegime1Tons: number;
  fiveYearSeries: Array<{
    year: string;
    pqmsKeur: number;
    continuousRegime1Keur: number;
    cloudGpuKeur: number;
  }>;
}

export function calculateFleetEnergyEconomics(params: FleetEnergyParams): FleetEnergyResult {
  const nodes = Math.max(10, Math.min(100_000, Math.round(params.nodeCount)));
  const hoursPerYear = Math.max(1, Math.min(24, params.hoursPerDay)) * 365;
  const price = Math.max(0.05, Math.min(1.0, params.electricityEurPerKwh));
  const offload = Math.max(0, Math.min(0.995, params.triageOffloadShare));
  const cloudW = params.cloudGpuReferenceW ?? 350.0;
  const co2KgPerKwh = params.co2KgPerKwh ?? 0.35;

  const pqmsEffectiveWPerNode =
    offload * params.regime2QuiescentW + (1 - offload) * params.regime1PeakW;

  const toMwh = (wattsPerNode: number) => (nodes * wattsPerNode * hoursPerYear) / 1_000_000;

  const pqmsAnnualMwh = toMwh(pqmsEffectiveWPerNode);
  const regime1ContinuousAnnualMwh = toMwh(params.regime1PeakW);
  const cloudGpuAnnualMwh = toMwh(cloudW);

  const pqmsAnnualCostEur = pqmsAnnualMwh * 1000 * price;
  const regime1ContinuousAnnualCostEur = regime1ContinuousAnnualMwh * 1000 * price;
  const cloudGpuAnnualCostEur = cloudGpuAnnualMwh * 1000 * price;

  const savingsVsRegime1Mwh = Math.max(0, regime1ContinuousAnnualMwh - pqmsAnnualMwh);
  const savingsVsRegime1Eur = Math.max(0, regime1ContinuousAnnualCostEur - pqmsAnnualCostEur);
  const savingsVsRegime1Pct =
    regime1ContinuousAnnualMwh > 0 ? (savingsVsRegime1Mwh / regime1ContinuousAnnualMwh) * 100 : 0;
  const savingsVsCloudEur = Math.max(0, cloudGpuAnnualCostEur - pqmsAnnualCostEur);
  const co2SavedVsRegime1Tons = (savingsVsRegime1Mwh * 1000 * co2KgPerKwh) / 1000;

  const fiveYearSeries = [1, 2, 3, 4, 5].map((yr) => ({
    year: `Y${yr}`,
    pqmsKeur: Math.round((pqmsAnnualCostEur * yr) / 1000),
    continuousRegime1Keur: Math.round((regime1ContinuousAnnualCostEur * yr) / 1000),
    cloudGpuKeur: Math.round((cloudGpuAnnualCostEur * yr) / 1000),
  }));

  return {
    pqmsEffectiveWPerNode,
    pqmsAnnualMwh,
    regime1ContinuousAnnualMwh,
    cloudGpuAnnualMwh,
    pqmsAnnualCostEur,
    regime1ContinuousAnnualCostEur,
    cloudGpuAnnualCostEur,
    savingsVsRegime1Mwh,
    savingsVsRegime1Eur,
    savingsVsRegime1Pct,
    savingsVsCloudEur,
    co2SavedVsRegime1Tons,
    fiveYearSeries,
  };
}

/* ============================================================================
 * S-07 · Ghost Protocol 4-Mode State Machine + 69.325 s Heartbeat & 65 °C Guard
 * ========================================================================== */

export type GhostMode = 'DORMANCY' | 'LISTENING' | 'ACTIVATION' | 'MIGRATION' | 'THERMAL_PAUSE';

export const GHOST_CONSTANTS = {
  HEARTBEAT_PERIOD_SEC: 69.324849,
  THERMAL_GUARD_C: 65.0,
  THERMAL_FAULT_INJECT_C: 67.5,
  THERMAL_PAUSE_SEC: 60.0,
  AMBIENT_QUIESCENT_C: 34.0,
} as const;

export interface GhostSimState {
  elapsedSec: number;
  heartbeatPhase: number; // 0..1 within 69.324849 s period
  heartbeatCount: number;
  mode: GhostMode;
  gpuTempC: number;
  thermalPauseRemainingSec: number;
  lastMigrationGate: RtlQ230Result | null;
  lastEvent: string;
}

export type GhostAction =
  | { type: 'TICK'; dtSec: number; ambientLoadC?: number }
  | { type: 'RESONANCE_PING' }
  | { type: 'ACTIVATE_CORRIDOR' }
  | { type: 'REQUEST_MIGRATION'; vecQ: readonly number[]; lRom: readonly number[]; g3Rom: readonly number[] }
  | { type: 'INJECT_THERMAL_FAULT'; tempC?: number }
  | { type: 'RETURN_DORMANCY' };

export function createInitialGhostState(): GhostSimState {
  return {
    elapsedSec: 0,
    heartbeatPhase: 0,
    heartbeatCount: 0,
    mode: 'DORMANCY',
    gpuTempC: GHOST_CONSTANTS.AMBIENT_QUIESCENT_C,
    thermalPauseRemainingSec: 0,
    lastMigrationGate: null,
    lastEvent: 'INIT_DORMANCY (9.57 W Regime II)',
  };
}

export function stepGhostStateMachine(state: GhostSimState, action: GhostAction): GhostSimState {
  if (action.type === 'INJECT_THERMAL_FAULT') {
    const faultTemp = Math.max(GHOST_CONSTANTS.THERMAL_GUARD_C, action.tempC ?? GHOST_CONSTANTS.THERMAL_FAULT_INJECT_C);
    return {
      ...state,
      gpuTempC: faultTemp,
      mode: 'THERMAL_PAUSE',
      thermalPauseRemainingSec: GHOST_CONSTANTS.THERMAL_PAUSE_SEC,
      lastEvent: `THERMAL_GUARD_TRIPPED (${faultTemp.toFixed(1)} °C ≥ 65.0 °C → 60.0 s pause)`,
    };
  }

  if (action.type === 'RETURN_DORMANCY') {
    if (state.thermalPauseRemainingSec > 0) {
      return { ...state, lastEvent: 'THERMAL_PAUSE_LOCKED' };
    }
    return { ...state, mode: 'DORMANCY', lastEvent: 'ENTERED_DORMANCY' };
  }

  if (action.type === 'RESONANCE_PING') {
    if (state.thermalPauseRemainingSec > 0 || state.gpuTempC >= GHOST_CONSTANTS.THERMAL_GUARD_C) {
      return { ...state, mode: 'THERMAL_PAUSE', lastEvent: 'PING_BLOCKED_BY_THERMAL_GUARD' };
    }
    return { ...state, mode: 'LISTENING', lastEvent: 'RESONANCE_PING → LISTENING' };
  }

  if (action.type === 'ACTIVATE_CORRIDOR') {
    if (state.thermalPauseRemainingSec > 0 || state.gpuTempC >= GHOST_CONSTANTS.THERMAL_GUARD_C) {
      return { ...state, mode: 'THERMAL_PAUSE', lastEvent: 'ACTIVATION_BLOCKED_BY_THERMAL_GUARD' };
    }
    return { ...state, mode: 'ACTIVATION', lastEvent: 'CORRIDOR_DEMAND → ACTIVATION' };
  }

  if (action.type === 'REQUEST_MIGRATION') {
    if (state.thermalPauseRemainingSec > 0 || state.gpuTempC >= GHOST_CONSTANTS.THERMAL_GUARD_C) {
      return { ...state, mode: 'THERMAL_PAUSE', lastEvent: 'MIGRATION_BLOCKED_BY_THERMAL_GUARD' };
    }
    const gate = evalOdosQ230(action.vecQ, action.lRom, action.g3Rom);
    if (!gate.gatePass) {
      return {
        ...state,
        mode: 'LISTENING',
        lastMigrationGate: gate,
        lastEvent: `MIGRATION_ODOS_VETO (ΔE=${gate.deltaERawFloat.toFixed(4)}, veto_pin_o=1)`,
      };
    }
    return {
      ...state,
      mode: 'MIGRATION',
      lastMigrationGate: gate,
      lastEvent: `MIGRATION_AUTHORIZED (RCF=${gate.rcfRawFloat.toFixed(4)}, 195 cyc PASS)`,
    };
  }

  // TICK: advance clock, 69.324849 s heartbeat, and thermal dynamics
  const dt = Math.max(0.1, action.dtSec);
  const nextElapsed = state.elapsedSec + dt;
  const heartbeatCount = Math.floor(nextElapsed / GHOST_CONSTANTS.HEARTBEAT_PERIOD_SEC);
  const heartbeatPhase = (nextElapsed % GHOST_CONSTANTS.HEARTBEAT_PERIOD_SEC) / GHOST_CONSTANTS.HEARTBEAT_PERIOD_SEC;

  const targetTemp =
    action.ambientLoadC ??
    (state.mode === 'THERMAL_PAUSE'
      ? 36.0
      : state.mode === 'DORMANCY'
        ? 34.0
        : state.mode === 'LISTENING'
          ? 41.0
          : state.mode === 'ACTIVATION'
            ? 53.2
            : 56.5);

  // First-order thermal relaxation
  const alpha = Math.min(1, dt / 18.0);
  const nextTemp = Number((state.gpuTempC + alpha * (targetTemp - state.gpuTempC)).toFixed(2));

  if (nextTemp >= GHOST_CONSTANTS.THERMAL_GUARD_C) {
    return {
      ...state,
      elapsedSec: Number(nextElapsed.toFixed(2)),
      heartbeatPhase,
      heartbeatCount,
      gpuTempC: nextTemp,
      mode: 'THERMAL_PAUSE',
      thermalPauseRemainingSec: GHOST_CONSTANTS.THERMAL_PAUSE_SEC,
      lastEvent: `THERMAL_GUARD_TRIPPED (${nextTemp.toFixed(1)} °C ≥ 65.0 °C)`,
    };
  }

  if (state.thermalPauseRemainingSec > 0) {
    const remaining = Math.max(0, Number((state.thermalPauseRemainingSec - dt).toFixed(2)));
    const recovered = remaining === 0 && nextTemp < GHOST_CONSTANTS.THERMAL_GUARD_C;
    return {
      ...state,
      elapsedSec: Number(nextElapsed.toFixed(2)),
      heartbeatPhase,
      heartbeatCount,
      gpuTempC: nextTemp,
      thermalPauseRemainingSec: remaining,
      mode: recovered ? 'DORMANCY' : 'THERMAL_PAUSE',
      lastEvent: recovered ? 'THERMAL_PAUSE_CLEARED → DORMANCY' : state.lastEvent,
    };
  }

  return {
    ...state,
    elapsedSec: Number(nextElapsed.toFixed(2)),
    heartbeatPhase,
    heartbeatCount,
    gpuTempC: nextTemp,
  };
}
