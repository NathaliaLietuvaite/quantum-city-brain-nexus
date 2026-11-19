import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CloudLightning, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import telemetry from '@/data/node-alpha-telemetry.json';
import { runKuramotoStormSimulation } from '@/lib/phase2-simulators';

const PhaseWheel = ({
  phases,
  orderParam,
  title,
  color,
  passed,
}: {
  phases: readonly number[];
  orderParam: number;
  title: string;
  color: string;
  passed: boolean;
}) => {
  const cx = 75;
  const cy = 75;
  const r = 54;
  let sumX = 0;
  let sumY = 0;
  phases.forEach((th) => {
    sumX += Math.cos(th);
    sumY += Math.sin(th);
  });
  const meanX = cx + (sumX / Math.max(1, phases.length)) * r;
  const meanY = cy + (sumY / Math.max(1, phases.length)) * r;

  return (
    <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-3 flex flex-col items-center space-y-1.5">
      <div className="font-mono text-xs font-semibold text-slate-200 text-center">{title}</div>
      <svg viewBox="0 0 150 150" className="w-36 h-36">
        <circle cx={cx} cy={cy} r={r} fill="rgba(15,23,42,0.7)" stroke="rgba(148,163,184,0.3)" strokeWidth={1.2} />
        <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="rgba(148,163,184,0.14)" />
        <line x1={cx} y1={cy - r} x2={cx} y2={cy + r} stroke="rgba(148,163,184,0.14)" />
        {phases.map((th, idx) => (
          <circle
            key={idx}
            cx={cx + Math.cos(th) * r}
            cy={cy + Math.sin(th) * r}
            r={3.2}
            fill={color}
            opacity={0.88}
          />
        ))}
        {/* Order parameter centroid vector */}
        <line x1={cx} y1={cy} x2={meanX} y2={meanY} stroke="#f8fafc" strokeWidth={2.2} />
        <circle cx={meanX} cy={meanY} r={4} fill="#f8fafc" />
      </svg>
      <div className="font-mono text-xs">
        r = <strong style={{ color }}>{orderParam.toFixed(4)}</strong> ·{' '}
        <span className={passed ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
          {passed ? 'PASS' : 'VETO'}
        </span>
      </div>
    </div>
  );
};

const KuramotoStormSimulator = () => {
  const { t } = useI18n();
  const lRom = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
  const g3Rom = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;

  const [stormBeta, setStormBeta] = useState(0.45);
  const [couplingK, setCouplingK] = useState(2.2);
  const [bypassKevlar, setBypassKevlar] = useState(false);

  const sim = useMemo(
    () =>
      runKuramotoStormSimulation(lRom, g3Rom, {
        stormBeta,
        couplingK,
        bypassKevlar,
      }),
    [lRom, g3Rom, stormBeta, couplingK, bypassKevlar],
  );

  return (
    <section className="rounded-xl border border-indigo-400/40 bg-slate-950/90 p-5 md:p-7 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <CloudLightning className="w-5 h-5 text-cyan-400 shrink-0" />
            <h3 className="text-xl font-semibold text-cyan-200">{t('s03.title')}</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{t('s03.desc')}</p>
        </div>
        <Button
          size="sm"
          variant={bypassKevlar ? 'destructive' : 'secondary'}
          onClick={() => setBypassKevlar((prev) => !prev)}
        >
          <ShieldAlert className="w-4 h-4 mr-1.5" />
          bypass_kevlar = {String(bypassKevlar)}
        </Button>
      </div>

      {/* Interactive Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border border-slate-700/70 bg-slate-900/70 p-4 font-mono text-xs">
        <div className="space-y-1.5">
          <label htmlFor="s03-beta" className="flex justify-between">
            <span>{t('s03.beta')}</span>
            <strong className="text-cyan-300">β = {stormBeta.toFixed(2)}</strong>
          </label>
          <input
            id="s03-beta"
            type="range"
            min={0}
            max={0.85}
            step={0.01}
            value={stormBeta}
            onChange={(e) => setStormBeta(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="s03-k" className="flex justify-between">
            <span>{t('s03.couplingK')}</span>
            <strong className="text-indigo-300">K = {couplingK.toFixed(2)}</strong>
          </label>
          <input
            id="s03-k"
            type="range"
            min={0.5}
            max={4.5}
            step={0.1}
            value={couplingK}
            onChange={(e) => setCouplingK(Number(e.target.value))}
            className="w-full accent-indigo-400"
          />
        </div>
      </div>

      {/* Dual Phase Wheels + Final Q2.30 Gate Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <PhaseWheel
          phases={sim.finalPhasesFridu}
          orderParam={sim.finalRFridu}
          title={t(bypassKevlar ? 's03.wheelBypass' : 's03.wheelFridu')}
          color={bypassKevlar ? '#fb7185' : '#34d399'}
          passed={sim.finalFriduGate.gatePass}
        />
        <PhaseWheel
          phases={sim.finalPhasesPax}
          orderParam={sim.finalRPax}
          title={t('s03.wheelPax')}
          color="#fb7185"
          passed={sim.finalPaxGate.gatePass}
        />
        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 font-mono text-xs flex flex-col justify-between space-y-2">
          <div className="font-semibold text-cyan-200">Q2.30 RTL Gate Final State (195 cyc)</div>
          <div className="space-y-1.5">
            <div className="text-emerald-300">
              FRIDU: RCF={sim.finalFriduGate.rcfRawFloat.toFixed(5)} · ΔE=
              {sim.finalFriduGate.deltaERawFloat.toFixed(5)} · Bleed={sim.finalFriduGate.bleedPostQ} LSB
            </div>
            <div className="text-rose-300">
              PAX: RCF={sim.finalPaxGate.rcfRawFloat.toFixed(5)} · ΔE=
              {sim.finalPaxGate.deltaERawFloat.toFixed(5)} · Bleed={sim.finalPaxGate.bleedPostQ} LSB
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            N = 24 oscillators · deterministic seed · Two-Pass Kahan–Parlett Q2.30 projection
          </div>
        </div>
      </div>

      {/* Live Recharts Trajectories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-2">
          <div className="font-mono text-xs font-semibold text-cyan-200">{t('s03.chartOrder')}</div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sim.steps} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="step" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0, 1]} stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="rFridu"
                  name={bypassKevlar ? 'FRIDU (BYPASS)' : 'FRIDU Shielded r(t)'}
                  stroke={bypassKevlar ? '#f59e0b' : '#34d399'}
                  strokeWidth={2.2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="rPax"
                  name="PAX Unshielded r(t)"
                  stroke="#fb7185"
                  strokeWidth={2}
                  strokeDasharray="4 3"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-2">
          <div className="font-mono text-xs font-semibold text-cyan-200">{t('s03.chartRcf')}</div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sim.steps} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                <XAxis dataKey="step" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0, 1]} stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <ReferenceLine y={0.95} stroke="#34d399" strokeDasharray="3 3" />
                <ReferenceLine y={0.05} stroke="#fb7185" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="rcfFridu" name="RCF FRIDU" stroke="#34d399" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="rcfPax" name="RCF PAX" stroke="#38bdf8" strokeWidth={1.8} dot={false} />
                <Line type="monotone" dataKey="deltaEPax" name="ΔE PAX" stroke="#fb7185" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KuramotoStormSimulator;
