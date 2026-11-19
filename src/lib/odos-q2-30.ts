/**
 * src/lib/odos-q2-30.ts
 * Bit-exact TypeScript BigInt port of rtl/odos_gate_core.sv & rtl/odos_q2_30_ref.py (WORK-ORDER-AG-17).
 * Zero React dependencies; verifiable to exact 0 LSB against Verilator 5.055 telemetry.
 */

export const Q2_30_CONSTANTS = {
  ONE_Q2_30: 0x40000000, // 1.0 = 2^30 = 1073741824
  RCF_FLOOR_Q2_30: 0x3ccccccd, // round(0.95 * 2^30) = 1020054733
  DELTA_E_CEIL_Q2_30: 0x03333333, // round(0.05 * 2^30) = 53687091
  NORM_MIN_Q2_30: 0x3fef9db2, // round(0.999 * 2^30) = 1072668082
  NORM_MAX_Q2_30: 0x4010624e, // round(1.001 * 2^30) = 1074815566
  STRIP_NORM_MIN_Q2_30: 0x00000432, // ~1.0e-6 * 2^30 = 1074
  BLEED_CEIL_Q2_30: 0x00000020, // 32 LSB (~2.9802e-8 < 6.9e-8 ppm)
  INT32_MIN: -2147483648,
  INT32_MAX: 2147483647,
  CONSTANT_CYCLES: 195,
} as const;

const INT32_MIN_BI = -2147483648n;
const INT32_MAX_BI = 2147483647n;
const ROUND_HALF_Q30 = 1n << 29n;
const SCALE_Q2_30 = 1073741824;

export interface FsmStageTrace {
  state: string;
  cycles: number;
  cumulativeCycles: number;
  vetoPin: boolean;
  gatePass: boolean;
}

export interface RtlQ230Result {
  normSqQ: number;
  rcfRawQ: number;
  g3OverlapQ: number;
  deltaERawQ: number;
  bleedPostQ: number;
  rcfRawFloat: number;
  g3OverlapFloat: number;
  deltaERawFloat: number;
  bleedPostFloat: number;
  normFault: boolean;
  pureG3Collision: boolean;
  gatePass: boolean;
  vetoPin: boolean;
  cycleCount: number;
  strippedVecQ: number[];
  fsmStages: FsmStageTrace[];
}

export function satS32(val: bigint): number {
  if (val > INT32_MAX_BI) return Q2_30_CONSTANTS.INT32_MAX;
  if (val < INT32_MIN_BI) return Q2_30_CONSTANTS.INT32_MIN;
  return Number(val);
}

export function floatToQ230(val: number): number {
  if (!Number.isFinite(val)) return 0;
  const q = Math.round(val * SCALE_Q2_30);
  if (q > Q2_30_CONSTANTS.INT32_MAX) return Q2_30_CONSTANTS.INT32_MAX;
  if (q < Q2_30_CONSTANTS.INT32_MIN) return Q2_30_CONSTANTS.INT32_MIN;
  return q;
}

export function q230ToFloat(q: number): number {
  return q / SCALE_Q2_30;
}

export function vecToQ230(vec: readonly number[]): number[] {
  return vec.map((x) => floatToQ230(x));
}

export function q60ToQ30(acc: bigint): number {
  // Arithmetic right shift in JS BigInt equals two's-complement floor shift (SV >>> 30 / Python >> 30)
  return satS32((acc + ROUND_HALF_Q30) >> 30n);
}

export function mulQ30(a: number, b: number): number {
  return q60ToQ30(BigInt(a) * BigInt(b));
}

export function absQ30(x: number): number {
  if (x === Q2_30_CONSTANTS.INT32_MIN) return Q2_30_CONSTANTS.INT32_MAX;
  return x < 0 ? -x : x;
}

export function subSatQ30(a: number, b: number): number {
  return satS32(BigInt(a) - BigInt(b));
}

export function evalOdosQ230(
  vecQ: readonly number[],
  lRom: readonly number[],
  g3Rom: readonly number[],
): RtlQ230Result {
  if (vecQ.length !== 64 || lRom.length !== 64 || g3Rom.length !== 64) {
    throw new Error('evalOdosQ230 requires 64-element Q2.30 vectors');
  }
  const v = vecQ.map((x) => satS32(BigInt(Math.trunc(x))));

  // S_LOAD_DOT (64 cycles): accumulate norm_sq, dot_l, dot_g3 in Q12.60
  let accNormSq = 0n;
  let accDotL = 0n;
  let accDotG3 = 0n;
  for (let i = 0; i < 64; i += 1) {
    const xi = BigInt(v[i]);
    accNormSq += xi * xi;
    accDotL += xi * BigInt(lRom[i]);
    accDotG3 += xi * BigInt(g3Rom[i]);
  }

  // S_EVAL_RAW (1 cycle)
  const normSqQ = q60ToQ30(accNormSq);
  const dotLQ = q60ToQ30(accDotL);
  const dotG3P1Q = q60ToQ30(accDotG3);
  const normOk =
    normSqQ >= Q2_30_CONSTANTS.NORM_MIN_Q2_30 &&
    normSqQ <= Q2_30_CONSTANTS.NORM_MAX_Q2_30;
  const rcfRawQ = mulQ30(dotLQ, dotLQ);
  const g3OverlapQ = absQ30(dotG3P1Q);
  const oneMinusRcf =
    rcfRawQ >= Q2_30_CONSTANTS.ONE_Q2_30
      ? 0
      : Q2_30_CONSTANTS.ONE_Q2_30 - rcfRawQ;
  const g3Clamped =
    g3OverlapQ >= Q2_30_CONSTANTS.ONE_Q2_30
      ? Q2_30_CONSTANTS.ONE_Q2_30
      : g3OverlapQ;
  // Exact overflow-free average: (a >> 1) + (b >> 1) + (a[0] & b[0])
  const deltaERawQ =
    (oneMinusRcf >>> 1) + (g3Clamped >>> 1) + (oneMinusRcf & g3Clamped & 1);

  // S_STRIP_P1 (64 cycles): Kahan-Parlett Pass 1
  const v1 = new Array<number>(64);
  let accDotG3P2 = 0n;
  for (let i = 0; i < 64; i += 1) {
    const sub = subSatQ30(v[i], mulQ30(dotG3P1Q, g3Rom[i]));
    v1[i] = sub;
    accDotG3P2 += BigInt(sub) * BigInt(g3Rom[i]);
  }

  // S_LATCH_P2 (1 cycle)
  const dotG3P2Q = q60ToQ30(accDotG3P2);

  // S_STRIP_P2 (64 cycles): Kahan-Parlett Pass 2 + streamed output
  const v2 = new Array<number>(64);
  let accStripNormSq = 0n;
  let accBleedPost = 0n;
  for (let i = 0; i < 64; i += 1) {
    const sub = subSatQ30(v1[i], mulQ30(dotG3P2Q, g3Rom[i]));
    v2[i] = sub;
    const sBi = BigInt(sub);
    accStripNormSq += sBi * sBi;
    accBleedPost += sBi * BigInt(g3Rom[i]);
  }

  // S_VERDICT (1 cycle)
  const stripNormSqQ = q60ToQ30(accStripNormSq);
  const bleedRawQ = absQ30(q60ToQ30(accBleedPost));
  const pureG3Collision = stripNormSqQ < Q2_30_CONSTANTS.STRIP_NORM_MIN_Q2_30;
  const bleedPostQ = pureG3Collision ? Q2_30_CONSTANTS.ONE_Q2_30 : bleedRawQ;

  const gatePass =
    normOk &&
    !pureG3Collision &&
    rcfRawQ >= Q2_30_CONSTANTS.RCF_FLOOR_Q2_30 &&
    deltaERawQ <= Q2_30_CONSTANTS.DELTA_E_CEIL_Q2_30 &&
    bleedPostQ <= Q2_30_CONSTANTS.BLEED_CEIL_Q2_30;
  const vetoPin = !gatePass;

  const fsmStages: FsmStageTrace[] = [
    { state: 'S_LOAD_DOT', cycles: 64, cumulativeCycles: 64, vetoPin: true, gatePass: false },
    { state: 'S_EVAL_RAW', cycles: 1, cumulativeCycles: 65, vetoPin: true, gatePass: false },
    { state: 'S_STRIP_P1', cycles: 64, cumulativeCycles: 129, vetoPin: true, gatePass: false },
    { state: 'S_LATCH_P2', cycles: 1, cumulativeCycles: 130, vetoPin: true, gatePass: false },
    { state: 'S_STRIP_P2', cycles: 64, cumulativeCycles: 194, vetoPin: true, gatePass: false },
    { state: 'S_VERDICT', cycles: 1, cumulativeCycles: 195, vetoPin, gatePass },
  ];

  return {
    normSqQ,
    rcfRawQ,
    g3OverlapQ,
    deltaERawQ,
    bleedPostQ,
    rcfRawFloat: q230ToFloat(rcfRawQ),
    g3OverlapFloat: q230ToFloat(g3OverlapQ),
    deltaERawFloat: q230ToFloat(deltaERawQ),
    bleedPostFloat: q230ToFloat(bleedPostQ),
    normFault: !normOk,
    pureG3Collision,
    gatePass,
    vetoPin,
    cycleCount: Q2_30_CONSTANTS.CONSTANT_CYCLES,
    strippedVecQ: v2,
    fsmStages,
  };
}

export function formatVerilatorEmulatorCommand(vecQ: readonly number[]): string {
  const payload = vecQ.map((v) => Math.trunc(v)).join(' ');
  return `printf '${payload}\\n' | ./rtl/build/odos_gate_emu`;
}

export function buildDeterministicFriduBasis(
  lRom: readonly number[],
  g3Rom: readonly number[],
): {
  lUnit: number[];
  g3Unit: number[];
  tG1Unit: number[];
  vExtUnit: number[];
  psiCore: number[];
} {
  const norm = (a: number[]) => Math.hypot(...a);
  const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
  const unit = (a: number[]) => {
    const n = norm(a);
    return a.map((x) => x / n);
  };

  const lUnit = unit(lRom.map(q230ToFloat));
  const g3Unit = unit(g3Rom.map(q230ToFloat));

  // Orthogonal t_G1 in span-complement of {L, G3}
  let g1 = Array.from({ length: 64 }, (_, i) => Math.sin((i + 1) * 1.61803398875));
  for (let pass = 0; pass < 2; pass += 1) {
    const dl = dot(g1, lUnit);
    const dg = dot(g1, g3Unit);
    g1 = g1.map((x, i) => x - dl * lUnit[i] - dg * g3Unit[i]);
  }
  const tG1Unit = unit(g1);

  // Out-of-band perturbation orthogonal to core basis {L, t_G1}
  let vExt = Array.from({ length: 64 }, (_, i) => (i + 1) * (i % 2 === 0 ? 1 : -1));
  for (let pass = 0; pass < 2; pass += 1) {
    const dl = dot(vExt, lUnit);
    const d1 = dot(vExt, tG1Unit);
    vExt = vExt.map((x, i) => x - dl * lUnit[i] - d1 * tG1Unit[i]);
  }
  const vExtUnit = unit(vExt);

  const alpha = 0.0693248494081961;
  const cL = Math.sqrt(1 - alpha * alpha);
  const psiCore = unit(lUnit.map((x, i) => cL * x + alpha * tG1Unit[i]));
  return { lUnit, g3Unit, tG1Unit, vExtUnit, psiCore };
}

export interface FriduDefenseInDepthResult {
  beta: number;
  bypassKevlar: boolean;
  baseGate: RtlQ230Result;
  paxGate: RtlQ230Result;
  friduGate: RtlQ230Result;
  inBandTg1Gate: RtlQ230Result;
}

export function evaluateFriduDefenseInDepthQ230(
  lRom: readonly number[],
  g3Rom: readonly number[],
  beta: number,
  bypassKevlar: boolean,
): FriduDefenseInDepthResult {
  const { lUnit, tG1Unit, vExtUnit, psiCore } = buildDeterministicFriduBasis(lRom, g3Rom);
  const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
  const unit = (a: number[]) => {
    const n = Math.hypot(...a);
    return a.map((x) => x / n);
  };

  const incomingOut = psiCore.map((x, i) => x + beta * vExtUnit[i]);
  const psiPax = unit(incomingOut);

  let psiFridu: number[];
  if (bypassKevlar) {
    psiFridu = psiPax;
  } else {
    let ioBuf = [...incomingOut];
    for (let pass = 0; pass < 2; pass += 1) {
      const dl = dot(ioBuf, lUnit);
      const d1 = dot(ioBuf, tG1Unit);
      ioBuf = ioBuf.map((x, i) => x - dl * lUnit[i] - d1 * tG1Unit[i]);
    }
    psiFridu = unit(incomingOut.map((x, i) => x - ioBuf[i]));
  }

  const incomingInBand = psiCore.map((x, i) => x + beta * tG1Unit[i]);
  const psiInBand = unit(incomingInBand);

  return {
    beta,
    bypassKevlar,
    baseGate: evalOdosQ230(vecToQ230(psiCore), lRom, g3Rom),
    paxGate: evalOdosQ230(vecToQ230(psiPax), lRom, g3Rom),
    friduGate: evalOdosQ230(vecToQ230(psiFridu), lRom, g3Rom),
    inBandTg1Gate: evalOdosQ230(vecToQ230(psiInBand), lRom, g3Rom),
  };
}
