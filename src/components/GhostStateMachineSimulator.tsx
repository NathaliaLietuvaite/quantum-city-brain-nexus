import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Flame, Ghost, HeartPulse, Pause, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import telemetry from '@/data/node-alpha-telemetry.json';
import {
  createInitialGhostState,
  GHOST_CONSTANTS,
  stepGhostStateMachine,
  type GhostMode,
  type GhostSimState,
} from '@/lib/phase3-simulators';

const MODE_ORDER: readonly GhostMode[] = [
  'DORMANCY',
  'LISTENING',
  'ACTIVATION',
  'MIGRATION',
  'THERMAL_PAUSE',
];

const GhostStateMachineSimulator = () => {
  const { t } = useI18n();
  const lRom = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
  const g3Rom = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;

  const [state, setState] = useState<GhostSimState>(() => createInitialGhostState());
  const [running, setRunning] = useState(false);
  const [tempHistory, setTempHistory] = useState<Array<{ tSec: number; tempC: number }>>([
    { tSec: 0, tempC: GHOST_CONSTANTS.AMBIENT_QUIESCENT_C },
  ]);

  const applyAndRecord = (next: GhostSimState) => {
    setState(next);
    setTempHistory((prev) => {
      const updated = [...prev, { tSec: Number(next.elapsedSec.toFixed(1)), tempC: next.gpuTempC }];
      return updated.length > 40 ? updated.slice(updated.length - 40) : updated;
    });
  };

  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => {
      setState((prev) => {
        const next = stepGhostStateMachine(prev, { type: 'TICK', dtSec: 5.0 });
        setTempHistory((hist) => {
          const updated = [...hist, { tSec: Number(next.elapsedSec.toFixed(1)), tempC: next.gpuTempC }];
          return updated.length > 40 ? updated.slice(updated.length - 40) : updated;
        });
        return next;
      });
    }, 500);
    return () => window.clearInterval(id);
  }, [running]);

  return (
    <section className="rounded-xl border border-purple-400/40 bg-slate-950/90 p-5 md:p-7 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <Ghost className="w-5 h-5 text-purple-300 shrink-0" />
            <h3 className="text-xl font-semibold text-cyan-200">{t('s07.title')}</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{t('s07.desc')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={running ? 'secondary' : 'default'} onClick={() => setRunning((r) => !r)}>
            {running ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {running ? 'Pause' : 'Auto +5s'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => applyAndRecord(stepGhostStateMachine(state, { type: 'TICK', dtSec: 10.0 }))}
          >
            {t('s07.step10')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRunning(false);
              const init = createInitialGhostState();
              setState(init);
              setTempHistory([{ tSec: 0, tempC: init.gpuTempC }]);
            }}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      {/* 5-State Live FSM Diagram */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
        {MODE_ORDER.map((m) => {
          const active = state.mode === m;
          const isFault = m === 'THERMAL_PAUSE';
          return (
            <div
              key={m}
              className={`rounded-lg border px-3 py-3 text-center transition-all ${
                active
                  ? isFault
                    ? 'border-rose-400 bg-rose-950/60 text-rose-100 ring-2 ring-rose-400/70 font-bold'
                    : 'border-cyan-300 bg-cyan-600/30 text-white ring-2 ring-cyan-300/60 font-bold'
                  : 'border-slate-700/70 bg-slate-900/60 text-slate-400'
              }`}
            >
              {m}
            </div>
          );
        })}
      </div>

      {/* Interactive Transition Controls */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="secondary" onClick={() => applyAndRecord(stepGhostStateMachine(state, { type: 'RESONANCE_PING' }))}>
          {t('s07.ping')}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => applyAndRecord(stepGhostStateMachine(state, { type: 'ACTIVATE_CORRIDOR' }))}>
          {t('s07.activate')}
        </Button>
        <Button
          size="sm"
          variant="default"
          onClick={() =>
            applyAndRecord(
              stepGhostStateMachine(state, {
                type: 'REQUEST_MIGRATION',
                vecQ: lRom,
                lRom,
                g3Rom,
              }),
            )
          }
        >
          {t('s07.migratePass')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            applyAndRecord(
              stepGhostStateMachine(state, {
                type: 'REQUEST_MIGRATION',
                vecQ: g3Rom,
                lRom,
                g3Rom,
              }),
            )
          }
        >
          {t('s07.migrateVeto')}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => applyAndRecord(stepGhostStateMachine(state, { type: 'INJECT_THERMAL_FAULT', tempC: 67.5 }))}
        >
          <Flame className="w-4 h-4 mr-1" />
          {t('s07.fault')}
        </Button>
        <Button size="sm" variant="outline" onClick={() => applyAndRecord(stepGhostStateMachine(state, { type: 'RETURN_DORMANCY' }))}>
          {t('s07.dormancy')}
        </Button>
      </div>

      {/* Heartbeat + Thermal Guard Live Telemetry + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-cyan-200 font-semibold">
              <HeartPulse className="w-4 h-4 text-purple-300" />
              Heartbeat ({GHOST_CONSTANTS.HEARTBEAT_PERIOD_SEC.toFixed(3)} s)
            </span>
            <span>
              beats = <strong>{state.heartbeatCount}</strong> · t = {state.elapsedSec.toFixed(1)} s
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all"
              style={{ width: `${(state.heartbeatPhase * 100).toFixed(1)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="rounded border bg-slate-950/70 p-2.5">
              <div className="text-[10px] text-slate-400">GPU CORE TEMP</div>
              <div className={`text-sm font-bold ${state.gpuTempC >= 65 ? 'text-rose-400' : 'text-emerald-300'}`}>
                {state.gpuTempC.toFixed(1)} °C / 65.0 °C
              </div>
            </div>
            <div className="rounded border bg-slate-950/70 p-2.5">
              <div className="text-[10px] text-slate-400">THERMAL PAUSE</div>
              <div className={`text-sm font-bold ${state.thermalPauseRemainingSec > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                {state.thermalPauseRemainingSec.toFixed(1)} s
              </div>
            </div>
          </div>

          <div className="rounded border border-cyan-400/25 bg-slate-950/80 px-3 py-2 text-[11px] text-cyan-100">
            last_event: <strong>{state.lastEvent}</strong>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-2">
          <div className="font-mono text-xs font-semibold text-purple-200">{t('s07.chartTitle')}</div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempHistory} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="tSec" stroke="#94a3b8" fontSize={10} unit="s" />
                <YAxis domain={[25, 75]} stroke="#94a3b8" fontSize={10} unit="°C" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                <ReferenceLine y={65} stroke="#fb7185" strokeDasharray="4 3" />
                <Line type="monotone" dataKey="tempC" name="GPU °C" stroke="#c084fc" strokeWidth={2.2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GhostStateMachineSimulator;
