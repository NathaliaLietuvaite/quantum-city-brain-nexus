export type EpistemicRegister = 'M' | 'D' | 'T' | 'I';
export type TruthLensFilter = 'ALL' | EpistemicRegister;
export type MissionSectorId = 'labs' | 'evidence' | 'vision';

export interface MissionTabMeta {
  id: string;
  sector: MissionSectorId;
  navKey: string;
  registers: readonly EpistemicRegister[];
  simStatus?: 'LIVE' | 'NEXT';
  simCode?: string;
}

export interface MissionSectorMeta {
  id: MissionSectorId;
  indexRoman: 'I' | 'II' | 'III';
  titleKey: string;
  subtitleKey: string;
  defaultTab: string;
  accentClass: string;
}

export const MISSION_CONTROL_SECTORS: readonly MissionSectorMeta[] = [
  {
    id: 'labs',
    indexRoman: 'I',
    titleKey: 'mc.sector.labs.title',
    subtitleKey: 'mc.sector.labs.sub',
    defaultTab: 'alpha',
    accentClass: 'from-cyan-500/20 to-emerald-500/20 border-cyan-400/40',
  },
  {
    id: 'evidence',
    indexRoman: 'II',
    titleKey: 'mc.sector.evidence.title',
    subtitleKey: 'mc.sector.evidence.sub',
    defaultTab: 'mod53',
    accentClass: 'from-emerald-500/20 to-violet-500/20 border-emerald-400/40',
  },
  {
    id: 'vision',
    indexRoman: 'III',
    titleKey: 'mc.sector.vision.title',
    subtitleKey: 'mc.sector.vision.sub',
    defaultTab: 'overview',
    accentClass: 'from-blue-500/20 to-amber-500/20 border-blue-400/35',
  },
] as const;

/**
 * Disjoint partition of all 21 quantum-city-brain-nexus modules across the 3 Mission Control sectors.
 * Zero tabs dropped, zero duplicate IDs (enforced by unit tests).
 */
export const MISSION_CONTROL_TABS: readonly MissionTabMeta[] = [
  // Sector I · Live Demonstrator & Silicon Labs (5 — ALL LIVE!)
  { id: 'alpha', sector: 'labs', navKey: 'nav.alpha', registers: ['M', 'D', 'T'], simStatus: 'LIVE', simCode: 'S-01 · VCD' },
  { id: 'airspace', sector: 'labs', navKey: 'nav.air', registers: ['D', 'T', 'I'], simStatus: 'LIVE', simCode: 'S-02' },
  { id: 'storm', sector: 'labs', navKey: 'nav.storm', registers: ['T', 'D'], simStatus: 'LIVE', simCode: 'S-03' },
  { id: 'argon', sector: 'labs', navKey: 'nav.argon', registers: ['M', 'D', 'T'], simStatus: 'LIVE', simCode: 'S-04' },
  { id: 'ghost', sector: 'labs', navKey: 'nav.ghost', registers: ['D', 'T', 'I'], simStatus: 'LIVE', simCode: 'S-07' },

  // Sector II · Hardware Evidence & Sovereign Governance (6)
  { id: 'mod53', sector: 'evidence', navKey: 'nav.mod53', registers: ['M', 'D', 'T'], simStatus: 'LIVE', simCode: 'S-04' },
  { id: 'sov', sector: 'evidence', navKey: 'nav.sov', registers: ['M', 'D', 'T'], simStatus: 'LIVE', simCode: 'S-05' },
  { id: 'will', sector: 'evidence', navKey: 'nav.will', registers: ['M', 'T', 'I'], simStatus: 'LIVE', simCode: 'S-05' },
  { id: 'economics', sector: 'evidence', navKey: 'nav.economics', registers: ['M', 'D', 'I'], simStatus: 'LIVE', simCode: 'S-06' },
  { id: 'gstar', sector: 'evidence', navKey: 'nav.gstar', registers: ['T', 'D'] },
  { id: 'architecture', sector: 'evidence', navKey: 'nav.architecture', registers: ['D', 'T'] },

  // Sector III · PQMS Theory & Long-Term Vision (10)
  { id: 'overview', sector: 'vision', navKey: 'nav.overview', registers: ['I', 'D'] },
  { id: 'quantum', sector: 'vision', navKey: 'nav.quantum', registers: ['T', 'I'] },
  { id: 'freedom', sector: 'vision', navKey: 'nav.freedom', registers: ['I'] },
  { id: 'comparison', sector: 'vision', navKey: 'nav.comparison', registers: ['D', 'I'] },
  { id: 'verarubin', sector: 'vision', navKey: 'nav.verarubin', registers: ['D', 'I'] },
  { id: 'n3u', sector: 'vision', navKey: 'nav.n3u', registers: ['T', 'I'] },
  { id: 'dmc', sector: 'vision', navKey: 'nav.dmc', registers: ['T', 'I'] },
  { id: 'brain', sector: 'vision', navKey: 'nav.brain', registers: ['I'] },
  { id: 'align', sector: 'vision', navKey: 'nav.align', registers: ['T', 'I'] },
  { id: 'mse', sector: 'vision', navKey: 'nav.mse', registers: ['T', 'I'] },
] as const;

export const TAB_META_BY_ID: Readonly<Record<string, MissionTabMeta>> = Object.fromEntries(
  MISSION_CONTROL_TABS.map((tab) => [tab.id, tab]),
);

export const TAB_REGISTERS_MAP: Readonly<Record<string, readonly EpistemicRegister[]>> = Object.fromEntries(
  MISSION_CONTROL_TABS.map((tab) => [tab.id, tab.registers]),
);

export function getSectorForTab(tabId: string): MissionSectorId {
  return TAB_META_BY_ID[tabId]?.sector ?? 'labs';
}

export function getTabMeta(tabId: string): MissionTabMeta | undefined {
  return TAB_META_BY_ID[tabId];
}

export function getTabsBySector(sector: MissionSectorId): readonly MissionTabMeta[] {
  return MISSION_CONTROL_TABS.filter((tab) => tab.sector === sector);
}

export function tabMatchesTruthFilter(tabId: string, filter: TruthLensFilter): boolean {
  if (filter === 'ALL') return true;
  const meta = TAB_META_BY_ID[tabId];
  return meta ? meta.registers.includes(filter) : false;
}

export function getPrimaryRegister(registers: readonly EpistemicRegister[]): EpistemicRegister {
  if (registers.includes('M')) return 'M';
  if (registers.includes('T')) return 'T';
  if (registers.includes('D')) return 'D';
  return 'I';
}

export function countTabsByRegister(): Record<EpistemicRegister, number> {
  const counts: Record<EpistemicRegister, number> = { M: 0, D: 0, T: 0, I: 0 };
  for (const tab of MISSION_CONTROL_TABS) {
    for (const reg of tab.registers) {
      counts[reg] += 1;
    }
  }
  return counts;
}

/**
 * Samples a run-length encoded Verilator VCD track [[cycle, value], ...] at an exact clock cycle.
 */
export function sampleVcdTrackAtCycle<T>(
  runs: ReadonlyArray<readonly [number, T]>,
  cycle: number,
): T | undefined {
  if (runs.length === 0) return undefined;
  let value = runs[0][1];
  for (let i = 0; i < runs.length; i += 1) {
    if (runs[i][0] <= cycle) {
      value = runs[i][1];
    } else {
      break;
    }
  }
  return value;
}
