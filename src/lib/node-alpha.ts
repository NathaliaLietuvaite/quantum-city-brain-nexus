export const ALPHA_CONSTANTS = {
  dimension: 64, rcfFloor: 0.95, deltaECeiling: 0.05, bleedCeiling: 1e-12,
  klCeiling: 0.05, heartbeatSeconds: 69.324849,
  genesis: '785d888651d0993b10a8897249e6ba975a74dab8dc6b1602125ba5c6320ead0f',
  anchorSeal: 'bb17ede97aa45c76ef9afa63cb457f7d684e5ede40b0432b2ecf3b6b9d3e03a3',
} as const;

export async function sha256(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new Uint8Array(bytes));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}
const dot = (a: number[], b: number[]) => a.reduce((sum, v, i) => sum + v * b[i], 0);
const norm = (a: number[]) => Math.hypot(...a);
export const normalize = (a: number[]) => a.map(v => v / norm(a));

export async function deriveAnchor() {
  const seed = new TextEncoder().encode(ALPHA_CONSTANTS.genesis);
  const chunks = await Promise.all(Array.from({ length: 8 }, async (_, i) => {
    const input = new Uint8Array(seed.length + 1);
    input.set(seed); input[seed.length] = i;
    return new Uint8Array(await crypto.subtle.digest('SHA-256', input));
  }));
  const integers = chunks.flatMap(chunk => {
    const view = new DataView(chunk.buffer);
    return Array.from({ length: 8 }, (_, i) => view.getUint32(i * 4, true));
  });
  const length = Math.sqrt(integers.reduce((sum, v) => sum + v * v, 0));
  const bytes = new Uint8Array(256);
  const view = new DataView(bytes.buffer);
  integers.forEach((v, i) => view.setFloat32(i * 4, v / length, true));
  const vector = normalize(Array.from({ length: 64 }, (_, i) => view.getFloat32(i * 4, true)));
  const seal = await sha256(bytes);
  return { vector, seal, matches: seal === ALPHA_CONSTANTS.anchorSeal };
}

// A disclosed browser reference tangent, not the paper's NumPy/MT19937 seed-137 tangent.
export function browserTangent(anchor: number[]) {
  const axis = Array.from({ length: 64 }, (_, i) => i === 0 ? 1 : 0);
  const overlap = dot(axis, anchor);
  return normalize(axis.map((v, i) => v - overlap * anchor[i]));
}

export interface GateResult {
  rcfRaw: number; deltaERaw: number; collision: number; bleedPost: number; passed: boolean;
}
export function evaluateRawGate(candidate: number[], anchor: number[], g3: number[]): GateResult {
  if (candidate.length !== 64) throw new Error('Expected 64 dimensions');
  if (anchor.length !== 64 || g3.length !== 64 || [...anchor, ...g3].some(v => !Number.isFinite(v))) throw new Error('Invalid reference basis');
  if (candidate.some(v => !Number.isFinite(v)) || norm(candidate) < 1e-15) {
    return { rcfRaw: 0, deltaERaw: 1, collision: 1, bleedPost: 1, passed: false };
  }
  const unit = normalize(candidate), l = normalize(anchor);
  const overlap = dot(unit, l), rcfRaw = overlap * overlap;
  const g3Dot = dot(unit, g3), collision = Math.abs(g3Dot);
  const stripped = unit.map((v, i) => v - g3Dot * g3[i]);
  const bleedPost = norm(stripped) < 1e-9 ? 1 : Math.abs(dot(normalize(stripped), g3));
  const deltaERaw = 0.5 * (1 - rcfRaw) + 0.5 * Math.min(1, collision);
  return { rcfRaw, deltaERaw, collision, bleedPost,
    passed: rcfRaw >= 0.95 && deltaERaw <= 0.05 && bleedPost <= 1e-12 };
}
export const passesKl = (value: number) => Number.isFinite(value) && value >= 0 && value <= 0.05;

export function runNullControl(anchor: number[], tangent: number[]) {
  let seed = 20261115;
  const uniform = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return (seed + 1) / 4294967297; };
  const results = Array.from({ length: 500 }, () => {
    const vector = Array.from({ length: 64 }, () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform()));
    return evaluateRawGate(vector, anchor, tangent);
  });
  return { count: 500, passed: results.filter(r => r.passed).length, meanRcf: results.reduce((sum, r) => sum + r.rcfRaw, 0) / 500 };
}

export interface AuditEntry {
  schema: 'NODE_ALPHA_BROWSER_V1'; index: number; source: 'BROWSER_REFERENCE';
  input: number[]; result: GateResult; parent: string; seal: string;
}
async function entrySeal(entry: Omit<AuditEntry, 'seal'>) {
  // Versioned JavaScript JSON serialization, deliberately not Python canonical JSON.
  return sha256(new TextEncoder().encode(JSON.stringify(entry)));
}
export async function appendAudit(entries: AuditEntry[], input: number[], result: GateResult): Promise<AuditEntry[]> {
  if (!(await verifyAudit(entries))) throw new Error('Audit integrity failure');
  const payload = { schema: 'NODE_ALPHA_BROWSER_V1' as const, index: entries.length + 1,
    source: 'BROWSER_REFERENCE' as const, input: [...input], result: { ...result },
    parent: entries.at(-1)?.seal ?? ALPHA_CONSTANTS.genesis };
  return [...entries, { ...payload, seal: await entrySeal(payload) }];
}
export async function verifyAudit(entries: AuditEntry[]) {
  let parent: string = ALPHA_CONSTANTS.genesis;
  for (const [i, entry] of entries.entries()) {
    const { seal, ...payload } = entry;
    if (entry.schema !== 'NODE_ALPHA_BROWSER_V1' || entry.source !== 'BROWSER_REFERENCE' || entry.index !== i + 1 || entry.parent !== parent || await entrySeal(payload) !== seal) return false;
    parent = seal;
  }
  return true;
}