import { Cpu, Eye, Grid2X2, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import {
  countTabsByRegister,
  getPrimaryRegister,
  getTabsBySector,
  MISSION_CONTROL_SECTORS,
  MISSION_CONTROL_TABS,
  tabMatchesTruthFilter,
  type EpistemicRegister,
  type MissionSectorId,
  type TruthLensFilter,
} from '@/lib/mission-control';
import { REGISTER_DOT_COLORS } from '@/components/RegisterBadge';

interface MissionControlNavProps {
  activeSector: MissionSectorId;
  activeTab: string;
  showAllTabs: boolean;
  truthLensEnabled: boolean;
  truthFilter: TruthLensFilter;
  onSelectSector: (sector: MissionSectorId) => void;
  onSelectTab: (tabId: string) => void;
  onToggleShowAll: () => void;
  onSetTruthFilter: (filter: TruthLensFilter) => void;
}

const SECTOR_ICONS: Record<MissionSectorId, typeof Cpu> = {
  labs: Cpu,
  evidence: ShieldCheck,
  vision: Sparkles,
};

const REGISTER_PILL_STYLE: Record<EpistemicRegister, string> = {
  M: 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200',
  D: 'border-sky-400/50 bg-sky-500/20 text-sky-200',
  T: 'border-violet-400/50 bg-violet-500/20 text-violet-200',
  I: 'border-amber-400/50 bg-amber-500/20 text-amber-200',
};

const MissionControlNav = ({
  activeSector,
  activeTab,
  showAllTabs,
  truthLensEnabled,
  truthFilter,
  onSelectSector,
  onSelectTab,
  onToggleShowAll,
  onSetTruthFilter,
}: MissionControlNavProps) => {
  const { t } = useI18n();
  const visibleTabs = showAllTabs ? MISSION_CONTROL_TABS : getTabsBySector(activeSector);
  const regCounts = countTabsByRegister();

  return (
    <div id="mission-control" className="space-y-5 scroll-mt-16 pt-4">
      {/* Mission Control Header + Live Telemetry Status Ribbon */}
      <div className="rounded-xl border border-cyan-400/25 bg-slate-950/75 backdrop-blur-md p-4 md:p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <p className="font-mono text-xs tracking-wider text-cyan-300">{t('mc.badge')}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white">{t('mc.title')}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">{t('mc.subtitle')}</p>
          </div>
          <Button
            size="sm"
            variant={showAllTabs ? 'default' : 'secondary'}
            onClick={onToggleShowAll}
            className="shrink-0"
          >
            {showAllTabs ? <Layers className="w-4 h-4 mr-1.5" /> : <Grid2X2 className="w-4 h-4 mr-1.5" />}
            {t(showAllTabs ? 'mc.showSector' : 'mc.showAll')}
          </Button>
        </div>

        {/* Sealed SYNC-12 Telemetry Ribbon */}
        <div className="flex flex-wrap gap-2 font-mono text-[11px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {t('mc.telemetry.sync')}
          </span>
          <span className="rounded-full border border-cyan-400/35 bg-cyan-500/15 px-3 py-1 text-cyan-200">
            {t('mc.telemetry.rtl')}
          </span>
          <span className="rounded-full border border-sky-400/35 bg-sky-500/15 px-3 py-1 text-sky-200">
            {t('mc.telemetry.l2')}
          </span>
          <span className="rounded-full border border-violet-400/35 bg-violet-500/15 px-3 py-1 text-violet-200">
            {t('mc.telemetry.tests')}
          </span>
        </div>

        {/* 3-Sector Command Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {MISSION_CONTROL_SECTORS.map((sec) => {
            const Icon = SECTOR_ICONS[sec.id];
            const count = getTabsBySector(sec.id).length;
            const isSelected = !showAllTabs && activeSector === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onSelectSector(sec.id)}
                className={`text-left rounded-lg border p-4 transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${sec.accentClass} shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-300/60`
                    : 'border-white/10 bg-slate-900/65 hover:border-cyan-400/35 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span className="font-mono text-xs text-cyan-200 font-semibold">
                      {sec.indexRoman} · {t(sec.titleKey)}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-black/40 text-slate-200">
                    {count}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-300 leading-snug">{t(sec.subtitleKey)}</p>
              </button>
            );
          })}
        </div>

        {/* Global Epistemic Truth Lens Filter Bar (visible when Truth Lens ON) */}
        {truthLensEnabled && (
          <div className="rounded-lg border border-emerald-400/35 bg-slate-900/90 p-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-200">
                <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('mc.lens.bannerTitle')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => onSetTruthFilter('ALL')}
                  className={`px-2.5 py-1 rounded-full border transition ${
                    truthFilter === 'ALL'
                      ? 'bg-white text-slate-950 border-white font-bold'
                      : 'border-white/20 text-slate-300 hover:border-white/50'
                  }`}
                >
                  {t('mc.lens.filterAll')}
                </button>
                {(['M', 'D', 'T', 'I'] as const).map((reg) => (
                  <button
                    key={reg}
                    type="button"
                    onClick={() => onSetTruthFilter(reg)}
                    className={`px-2.5 py-1 rounded-full border transition ${
                      truthFilter === reg
                        ? `${REGISTER_PILL_STYLE[reg]} ring-2 ring-white/60 font-bold`
                        : `${REGISTER_PILL_STYLE[reg]} opacity-70 hover:opacity-100`
                    }`}
                  >
                    REGISTER_{reg} ({regCounts[reg]})
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{t('mc.lens.bannerDesc')}</p>
          </div>
        )}

        {/* Active Sector (or All-21) Module Strip */}
        <div
          role="tablist"
          aria-label="Quantum City-Brain Modules"
          className="flex flex-wrap gap-2 pt-1"
        >
          {visibleTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const matches = !truthLensEnabled || tabMatchesTruthFilter(tab.id, truthFilter);
            const primaryReg = getPrimaryRegister(tab.registers);

            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white border-cyan-300 shadow-md shadow-cyan-500/25'
                    : truthLensEnabled
                      ? matches
                        ? `${REGISTER_PILL_STYLE[primaryReg]} hover:brightness-125`
                        : 'border-white/10 bg-slate-900/40 text-slate-500 opacity-35 hover:opacity-70'
                      : 'border-cyan-400/15 bg-slate-900/80 text-slate-200 hover:border-cyan-400/45 hover:text-white'
                }`}
              >
                <span>{t(tab.navKey)}</span>
                {tab.simStatus === 'LIVE' && (
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/25 border border-emerald-300/50 px-1.5 py-0.5 font-mono text-[10px] text-emerald-100">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    {t('mc.liveBadge')}
                  </span>
                )}
                {tab.simStatus === 'NEXT' && tab.simCode && (
                  <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-cyan-200/85">
                    {tab.simCode}
                  </span>
                )}
                {truthLensEnabled && (
                  <span className="inline-flex items-center gap-1 ml-0.5">
                    {tab.registers.map((r) => (
                      <span
                        key={r}
                        title={`REGISTER_${r}`}
                        className={`h-2 w-2 rounded-full ${REGISTER_DOT_COLORS[r]}`}
                      />
                    ))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MissionControlNav;
