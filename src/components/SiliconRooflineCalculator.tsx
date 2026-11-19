import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckCircle2, Cpu, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import telemetry from '@/data/node-alpha-telemetry.json';
import {
  calculateSiliconThroughput,
  type SiliconStageId,
} from '@/lib/phase2-simulators';

const STAGES: readonly SiliconStageId[] = [
  'stage1_baseline',
  'stage2_folded_9to3',
  'stage3_single_mac_9to1',
];

const SiliconRooflineCalculator = () => {
  const { t } = useI18n();
  const hw = telemetry.hardware_l2_roofline;
  const rtl = telemetry.rtl_v20_alpha;

  const [stageId, setStageId] = useState<SiliconStageId>('stage2_folded_9to3');
  const [clockMhz, setClockMhz] = useState(150);
  const [parallelCores, setParallelCores] = useState(8);
  const [fleetVehicles, setFleetVehicles] = useState(100_000);
  const [cadenceHz, setCadenceHz] = useState(20);

  const rooflineBars = useMemo(
    () => [
      { name: 'Unpinned 2 MiB', gbps: hw.unpinned_median_gbps, color: '#94a3b8' },
      { name: 'GDDR6 Bus Max', gbps: hw.gddr6_bus_ceiling_gbps, color: '#f59e0b' },
      { name: 'Pinned L2 (1.852×)', gbps: hw.pinned_median_gbps, color: '#22d3ee' },
      { name: 'Warm L2 Roof', gbps: hw.warm_l2_roof_gbps, color: '#34d399' },
    ],
    [hw],
  );

  const calc = useMemo(
    () =>
      calculateSiliconThroughput({
        stageId,
        clockMhz,
        parallelCores,
        fleetVehicles,
        cadenceHz,
      }),
    [stageId, clockMhz, parallelCores, fleetVehicles, cadenceHz],
  );

  return (
    <section className="rounded-xl border border-emerald-400/40 bg-slate-950/90 p-5 md:p-7 space-y-5">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400 shrink-0" />
          <h3 className="text-xl font-semibold text-cyan-200">{t('s04.title')}</h3>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{t('s04.desc')}</p>
      </div>

      {/* Stage Selector */}
      <div className="flex flex-wrap gap-2">
        {STAGES.map((st) => (
          <Button
            key={st}
            size="sm"
            variant={stageId === st ? 'default' : 'secondary'}
            onClick={() => setStageId(st)}
          >
            {t(`s04.stage.${st}`)}
          </Button>
        ))}
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 rounded-lg border border-slate-700/70 bg-slate-900/75 p-4 font-mono text-xs">
        <div className="space-y-1.5">
          <label htmlFor="s04-clk" className="flex justify-between">
            <span>{t('s04.clock')}</span>
            <strong className="text-cyan-300">{clockMhz} MHz</strong>
          </label>
          <input
            id="s04-clk"
            type="range"
            min={50}
            max={500}
            step={10}
            value={clockMhz}
            onChange={(e) => setClockMhz(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s04-cores" className="flex justify-between">
            <span>{t('s04.cores')}</span>
            <strong className="text-emerald-300">{parallelCores}×</strong>
          </label>
          <input
            id="s04-cores"
            type="range"
            min={1}
            max={64}
            step={1}
            value={parallelCores}
            onChange={(e) => setParallelCores(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s04-fleet" className="flex justify-between">
            <span>{t('s04.fleet')}</span>
            <strong className="text-amber-300">{fleetVehicles.toLocaleString('en-US')}</strong>
          </label>
          <input
            id="s04-fleet"
            type="range"
            min={1000}
            max={1_000_000}
            step={5000}
            value={fleetVehicles}
            onChange={(e) => setFleetVehicles(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s04-hz" className="flex justify-between">
            <span>{t('s04.cadence')}</span>
            <strong className="text-violet-300">{cadenceHz} Hz</strong>
          </label>
          <input
            id="s04-hz"
            type="range"
            min={5}
            max={100}
            step={5}
            value={cadenceHz}
            onChange={(e) => setCadenceHz(Number(e.target.value))}
            className="w-full accent-violet-400"
          />
        </div>
      </div>

      {/* Verdict Banner + Key Metrics */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3 font-mono text-xs ${
          calc.fleetSupported
            ? 'border-emerald-400/45 bg-emerald-950/35 text-emerald-200'
            : 'border-rose-400/45 bg-rose-950/35 text-rose-200'
        }`}
      >
        <div className="flex items-center gap-2">
          {calc.fleetSupported ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <strong>
            {t(calc.fleetSupported ? 's04.supported' : 's04.overloaded')} ({calc.headroomFactor.toFixed(2)}×)
          </strong>
        </div>
        <div>
          Latency = <strong>{calc.latencyUsPerDecision.toFixed(2)} µs</strong> · Cluster ={' '}
          <strong>{(calc.clusterDecisionsPerSec / 1_000_000).toFixed(2)} M/s</strong> vs. Demand ={' '}
          <strong>{(calc.requiredFleetDecisionsPerSec / 1_000_000).toFixed(2)} M/s</strong> · Total $mul ={' '}
          <strong>{calc.totalEstimatedMulBlocks}</strong>
        </div>
      </div>

      {/* Dual Charts: Empirical RTX 4060 Ti Roofline (M) + Analytical Silicon Throughput Sweep (T) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-2">
          <div className="font-mono text-xs font-semibold text-emerald-300">{t('s04.rooflineTitle')}</div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rooflineBars} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[0, 900]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <ReferenceLine y={288} stroke="#f59e0b" strokeDasharray="4 4" />
                <Bar dataKey="gbps" name="Bandwidth (GB/s)" radius={[4, 4, 0, 0]}>
                  {rooflineBars.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Yosys 0.71 baseline: {rtl.yosys_coarse_cells} coarse RTL cells ({rtl.yosys_mul_blocks} $mul) →{' '}
            {rtl.yosys_gate_cells.toLocaleString('en-US')} gate cells ({rtl.yosys_flip_flops.toLocaleString('en-US')} FFs)
          </div>
        </div>

        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-2">
          <div className="font-mono text-xs font-semibold text-cyan-300">{t('s04.scalingTitle')}</div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={calc.frequencySweep} margin={{ top: 10, right: 12, left: -4, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="clockMhz" stroke="#cbd5e1" fontSize={10} unit=" MHz" />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="clusterKDecisionsPerSec"
                  name="Cluster Capacity (k/s)"
                  stroke="#22d3ee"
                  fill="rgba(34,211,238,0.22)"
                  strokeWidth={2}
                />
                <ReferenceLine
                  y={Math.round(calc.requiredFleetDecisionsPerSec / 1000)}
                  stroke="#fb7185"
                  strokeWidth={2}
                  strokeDasharray="5 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            195 cyc/decision · Stage multiplier reduction: −{calc.stage.mulReductionPct}% · MAC clk ×
            {calc.stage.macClockMultiplier} · Util: {calc.utilizationPct.toFixed(1)}%
          </div>
        </div>
      </div>
    </section>
  );
};

export default SiliconRooflineCalculator;
