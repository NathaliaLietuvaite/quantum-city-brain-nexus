import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Zap } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import telemetry from '@/data/node-alpha-telemetry.json';
import { calculateFleetEnergyEconomics } from '@/lib/phase3-simulators';

const FleetEnergyCalculator = () => {
  const { t } = useI18n();
  const pwr = telemetry.hwinfo64_power_regimes;

  const [nodeCount, setNodeCount] = useState(2500);
  const [hoursPerDay, setHoursPerDay] = useState(24);
  const [electricityPrice, setElectricityPrice] = useState(0.28);
  const [triageOffloadShare, setTriageOffloadShare] = useState(0.95);

  const res = useMemo(
    () =>
      calculateFleetEnergyEconomics({
        nodeCount,
        hoursPerDay,
        electricityEurPerKwh: electricityPrice,
        triageOffloadShare,
        regime1PeakW: pwr.regime_1_peak_power_w,
        regime2QuiescentW: pwr.regime_2_min_power_w,
      }),
    [nodeCount, hoursPerDay, electricityPrice, triageOffloadShare, pwr],
  );

  return (
    <section className="rounded-xl border border-emerald-400/40 bg-slate-950/90 p-5 md:p-7 space-y-5">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400 shrink-0" />
          <h3 className="text-xl font-semibold text-cyan-200">{t('s06.title')}</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{t('s06.desc')}</p>
      </div>

      {/* Sealed REGISTER_M Hardware Anchor Bar */}
      <div className="flex flex-wrap gap-2 font-mono text-[11px]">
        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-emerald-200">
          REGISTER_M · Regime I Peak: {pwr.regime_1_peak_power_w} W ({pwr.regime_1_peak_vram_mb} MB, {pwr.regime_1_peak_temp_c} °C)
        </span>
        <span className="rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1 text-cyan-200">
          REGISTER_M · Regime II Sanctuary: {pwr.regime_2_min_power_w}–{pwr.regime_2_max_power_w} W ({pwr.power_reduction_max_x}×, {pwr.whea_errors} WHEA)
        </span>
      </div>

      {/* Adjustable REGISTER_D Municipal Scenario Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg border border-sky-400/30 bg-slate-900/75 p-4 font-mono text-xs">
        <div className="space-y-1.5">
          <label htmlFor="s06-nodes" className="flex justify-between">
            <span>{t('s06.nodes')}</span>
            <strong className="text-cyan-300">{nodeCount.toLocaleString('en-US')}</strong>
          </label>
          <input
            id="s06-nodes"
            type="range"
            min={100}
            max={50000}
            step={100}
            value={nodeCount}
            onChange={(e) => setNodeCount(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s06-hours" className="flex justify-between">
            <span>{t('s06.hours')}</span>
            <strong className="text-emerald-300">{hoursPerDay} h/d</strong>
          </label>
          <input
            id="s06-hours"
            type="range"
            min={4}
            max={24}
            step={1}
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s06-price" className="flex justify-between">
            <span>{t('s06.price')}</span>
            <strong className="text-amber-300">€{electricityPrice.toFixed(2)}</strong>
          </label>
          <input
            id="s06-price"
            type="range"
            min={0.1}
            max={0.55}
            step={0.01}
            value={electricityPrice}
            onChange={(e) => setElectricityPrice(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s06-offload" className="flex justify-between">
            <span>{t('s06.offload')}</span>
            <strong className="text-violet-300">{(triageOffloadShare * 100).toFixed(0)}%</strong>
          </label>
          <input
            id="s06-offload"
            type="range"
            min={0.5}
            max={0.99}
            step={0.01}
            value={triageOffloadShare}
            onChange={(e) => setTriageOffloadShare(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </div>
      </div>

      {/* Live Output KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
        <div className="rounded-lg border border-emerald-400/35 bg-emerald-950/25 p-3.5">
          <div className="text-[10px] text-slate-400">PQMS EFFECTIVE POWER</div>
          <div className="text-lg font-bold text-emerald-300">{res.pqmsEffectiveWPerNode.toFixed(2)} W/node</div>
          <div className="text-[11px] text-slate-300">{res.pqmsAnnualMwh.toFixed(1)} MWh/yr</div>
        </div>
        <div className="rounded-lg border border-cyan-400/35 bg-cyan-950/25 p-3.5">
          <div className="text-[10px] text-slate-400">SAVED vs. CONTINUOUS 4B</div>
          <div className="text-lg font-bold text-cyan-200">{res.savingsVsRegime1Pct.toFixed(1)}%</div>
          <div className="text-[11px] text-slate-300">{res.savingsVsRegime1Mwh.toFixed(1)} MWh/yr</div>
        </div>
        <div className="rounded-lg border border-amber-400/35 bg-amber-950/25 p-3.5">
          <div className="text-[10px] text-slate-400">ANNUAL € SAVED (vs. R-I)</div>
          <div className="text-lg font-bold text-amber-200">
            €{Math.round(res.savingsVsRegime1Eur).toLocaleString('en-US')}
          </div>
          <div className="text-[11px] text-slate-300">
            vs. 350W GPU: €{Math.round(res.savingsVsCloudEur).toLocaleString('en-US')}
          </div>
        </div>
        <div className="rounded-lg border border-violet-400/35 bg-violet-950/25 p-3.5">
          <div className="text-[10px] text-slate-400">EST. CO₂ AVOIDED (0.35 kg/kWh)</div>
          <div className="text-lg font-bold text-violet-200">{res.co2SavedVsRegime1Tons.toFixed(1)} t/yr</div>
          <div className="text-[11px] text-slate-300">REGISTER_D scenario model</div>
        </div>
      </div>

      {/* 5-Year Cumulative Cost Chart */}
      <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-2">
        <div className="font-mono text-xs font-semibold text-cyan-200">{t('s06.chartTitle')}</div>
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={res.fiveYearSeries} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
              <XAxis dataKey="year" stroke="#cbd5e1" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={10} unit=" k€" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="pqmsKeur" name="PQMS Triage (Regime II + Burst)" fill="#34d399" radius={[3, 3, 0, 0]} />
              <Bar dataKey="continuousRegime1Keur" name="Continuous 4B (85.78 W)" fill="#38bdf8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="cloudGpuKeur" name="Cloud GPU Ref (350 W)" fill="#f43f5e" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default FleetEnergyCalculator;
