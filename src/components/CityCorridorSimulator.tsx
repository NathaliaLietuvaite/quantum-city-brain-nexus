import { useEffect, useMemo, useRef, useState } from 'react';
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
import { Check, Copy, Pause, Play, RotateCcw, ShieldAlert, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import telemetry from '@/data/node-alpha-telemetry.json';
import { formatVerilatorEmulatorCommand } from '@/lib/odos-q2-30';
import {
  evaluateCorridorTick,
  type CorridorInjectionMode,
  type CorridorTelemetryPoint,
} from '@/lib/phase2-simulators';

const MODES: readonly CorridorInjectionMode[] = [
  'nominal',
  'g3_spoof',
  'in_band_tg1',
  'norm_fault',
];

const CityCorridorSimulator = () => {
  const { t } = useI18n();
  const lRom = telemetry.rtl_v20_alpha.roms_q2_30.l_vec_q;
  const g3Rom = telemetry.rtl_v20_alpha.roms_q2_30.g3_vec_q;

  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(true);
  const [mode, setMode] = useState<CorridorInjectionMode>('nominal');
  const [severity, setSeverity] = useState(0.45);
  const [selectedAgentId, setSelectedAgentId] = useState('AT-01');
  const [history, setHistory] = useState<CorridorTelemetryPoint[]>([]);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const snapshot = useMemo(
    () => evaluateCorridorTick(tick, mode, severity, lRom, g3Rom),
    [tick, mode, severity, lRom, g3Rom],
  );

  // Append telemetry history on each tick
  useEffect(() => {
    setHistory((prev) => {
      const point: CorridorTelemetryPoint = {
        tick: snapshot.tick,
        meanRcf: Number(snapshot.meanRcf.toFixed(4)),
        maxDeltaE: Number(snapshot.maxDeltaE.toFixed(4)),
        maxBleedLsb: snapshot.maxBleedLsb,
        passCount: snapshot.passCount,
        vetoCount: snapshot.vetoCount,
      };
      const next = [...prev, point];
      return next.length > 36 ? next.slice(next.length - 36) : next;
    });
  }, [snapshot]);

  // Deterministic stepping loop when Play is active
  useEffect(() => {
    if (!running) return undefined;
    const id = window.setInterval(() => {
      setTick((prev) => prev + 1);
    }, 220);
    return () => window.clearInterval(id);
  }, [running]);

  // Render 2D/Layer City-Brain Corridor Grid onto <canvas>
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#040b18');
    bg.addColorStop(0.55, '#071426');
    bg.addColorStop(1, '#09111f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Subtle vertical distance grid
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 40; x < W; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    // Layer divider bands
    const bands = [
      { y: 0.17 * H, label: t('s02.layer2'), color: 'rgba(168, 85, 247, 0.25)' },
      { y: 0.40 * H, label: t('s02.layer1'), color: 'rgba(34, 211, 238, 0.25)' },
      { y: 0.66 * H, label: t('s02.layer0'), color: 'rgba(16, 185, 129, 0.22)' },
      { y: 0.84 * H, label: '', color: 'rgba(16, 185, 129, 0.18)' },
    ];

    bands.forEach((b) => {
      ctx.strokeStyle = b.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(18, b.y);
      ctx.lineTo(W - 18, b.y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Safe diversion track just underneath each corridor
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.14)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(18, b.y + 0.055 * H);
      ctx.lineTo(W - 18, b.y + 0.055 * H);
      ctx.stroke();
      ctx.setLineDash([]);

      if (b.label) {
        ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
        ctx.font = '600 10px ui-monospace, SFMono-Regular, monospace';
        ctx.fillText(b.label, 18, b.y - 12);
      }
    });

    // Draw agents
    snapshot.agents.forEach((ag) => {
      const px = 28 + ag.x * (W - 56);
      const py = ag.y * H;
      const isSelected = ag.id === selectedAgentId;
      const passed = ag.gate.gatePass;

      // Selection halo
      if (isSelected) {
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px, py, 16, 0, Math.PI * 2);
        ctx.stroke();
      }

      // ODOS Safety Envelope halo
      ctx.fillStyle = passed ? 'rgba(16, 185, 129, 0.22)' : 'rgba(244, 63, 94, 0.30)';
      ctx.beginPath();
      ctx.arc(px, py, 12, 0, Math.PI * 2);
      ctx.fill();

      // Diversion indicator vector if vetoed
      if (ag.diverted) {
        ctx.strokeStyle = '#fb7185';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py - 0.055 * H);
        ctx.lineTo(px, py);
        ctx.stroke();
      }

      // Agent body glyph by layer
      ctx.fillStyle = passed
        ? ag.layer === 2
          ? '#c084fc'
          : ag.layer === 1
            ? '#22d3ee'
            : '#34d399'
        : '#fb7185';

      if (ag.layer === 0) {
        ctx.fillRect(px - 8, py - 5, 16, 10);
      } else if (ag.layer === 1) {
        ctx.beginPath();
        ctx.moveTo(px + 9, py);
        ctx.lineTo(px - 7, py - 6);
        ctx.lineTo(px - 7, py + 6);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(px, py - 7);
        ctx.lineTo(px + 8, py);
        ctx.lineTo(px, py + 7);
        ctx.lineTo(px - 8, py);
        ctx.closePath();
        ctx.fill();
      }

      // Agent ID + status tag
      ctx.fillStyle = passed ? '#e2e8f0' : '#fecdd3';
      ctx.font = '700 10px ui-monospace, SFMono-Regular, monospace';
      ctx.fillText(passed ? ag.id : `${ag.id} VETO`, px - 14, py - 13);
    });
  }, [snapshot, selectedAgentId, t]);

  const inspected = snapshot.agents.find((a) => a.id === selectedAgentId) ?? snapshot.agents[0];

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const cy = ((e.clientY - rect.top) / rect.height) * canvas.height;
    let bestId = selectedAgentId;
    let bestDist = Infinity;
    snapshot.agents.forEach((ag) => {
      const px = 28 + ag.x * (canvas.width - 56);
      const py = ag.y * canvas.height;
      const d = Math.hypot(cx - px, cy - py);
      if (d < bestDist && d < 36) {
        bestDist = d;
        bestId = ag.id;
      }
    });
    setSelectedAgentId(bestId);
  };

  const copyAgentCli = async () => {
    const cmd = formatVerilatorEmulatorCommand(inspected.vecQ);
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-xl border border-cyan-400/40 bg-slate-950/90 p-5 md:p-7 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0" />
            <h3 className="text-xl font-semibold text-cyan-200">{t('s02.title')}</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{t('s02.desc')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={running ? 'secondary' : 'default'} onClick={() => setRunning((r) => !r)}>
            {running ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {t(running ? 's02.pause' : 's02.play')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRunning(false);
              setTick((prev) => prev + 1);
            }}
          >
            <SkipForward className="w-4 h-4 mr-1" />
            {t('s02.step')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setMode('nominal');
              setSeverity(0.45);
              setTick(0);
              setHistory([]);
            }}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            {t('s02.reset')}
          </Button>
        </div>
      </div>

      <p className="rounded-md border border-sky-400/30 bg-sky-950/25 px-3.5 py-2 text-xs text-sky-200 font-mono">
        {t('s02.disclaimer')}
      </p>

      {/* Fault Injection Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <Button
              key={m}
              size="sm"
              variant={mode === m ? (m === 'nominal' ? 'default' : 'destructive') : 'secondary'}
              onClick={() => setMode(m)}
            >
              {t(`s02.mode.${m}`)}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-slate-200">
          <label htmlFor="s02-severity">
            {t('s02.severity')}: <strong>{severity.toFixed(2)}</strong>
          </label>
          <input
            id="s02-severity"
            type="range"
            min={0.15}
            max={1.0}
            step={0.05}
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value))}
            disabled={mode === 'nominal'}
            className="w-36 accent-cyan-400"
          />
        </div>
      </div>

      {/* Live 2D/Layer Canvas */}
      <div className="overflow-x-auto rounded-lg border border-cyan-500/30 bg-[#040b18]">
        <canvas
          ref={canvasRef}
          width={860}
          height={310}
          onClick={handleCanvasClick}
          className="w-full min-w-[620px] h-auto block cursor-pointer"
        />
      </div>

      {/* Live Metrics Summary Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 font-mono text-xs">
        <div className="rounded-lg border bg-slate-900/80 p-3">
          <div className="text-slate-400 text-[10px]">CORRIDOR VERDICT</div>
          <div className="text-sm font-bold">
            <span className="text-emerald-400">{snapshot.passCount} PASS</span> ·{' '}
            <span className={snapshot.vetoCount > 0 ? 'text-rose-400' : 'text-slate-400'}>
              {snapshot.vetoCount} VETO
            </span>
          </div>
        </div>
        <div className="rounded-lg border bg-slate-900/80 p-3">
          <div className="text-slate-400 text-[10px]">MEAN RCF_RAW</div>
          <div className="text-sm font-bold text-cyan-300">{snapshot.meanRcf.toFixed(6)}</div>
        </div>
        <div className="rounded-lg border bg-slate-900/80 p-3">
          <div className="text-slate-400 text-[10px]">MAX ΔE_RAW</div>
          <div className={`text-sm font-bold ${snapshot.maxDeltaE <= 0.05 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {snapshot.maxDeltaE.toFixed(6)}
          </div>
        </div>
        <div className="rounded-lg border bg-slate-900/80 p-3">
          <div className="text-slate-400 text-[10px]">MAX BLEED_POST</div>
          <div className="text-sm font-bold text-violet-300">{snapshot.maxBleedLsb} LSB</div>
        </div>
        <div className="rounded-lg border bg-slate-900/80 p-3">
          <div className="text-slate-400 text-[10px]">RTL GATE BUDGET</div>
          <div className="text-sm font-bold text-amber-200">
            {snapshot.totalRtlCycles} cyc ({snapshot.totalLatencyUsAt100Mhz.toFixed(1)} µs)
          </div>
        </div>
      </div>

      {/* Inspected Agent Q2.30 Detail + Live Recharts Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-3 font-mono text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="font-semibold text-cyan-200">
              {t('s02.inspectAgent')}: {inspected.label}
            </div>
            <Button size="sm" variant="secondary" onClick={copyAgentCli}>
              {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {t(copied ? 's02.copiedCli' : 's02.copyCli')}
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {snapshot.agents.map((ag) => (
              <button
                key={ag.id}
                type="button"
                onClick={() => setSelectedAgentId(ag.id)}
                className={`px-2 py-0.5 rounded border text-[11px] transition ${
                  ag.id === inspected.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-bold'
                    : ag.gate.gatePass
                      ? 'border-emerald-400/35 text-emerald-200 bg-emerald-950/30'
                      : 'border-rose-400/45 text-rose-200 bg-rose-950/40'
                }`}
              >
                {ag.id}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1 text-slate-200">
            <div>
              gate_pass_o:{' '}
              <strong className={inspected.gate.gatePass ? 'text-emerald-400' : 'text-rose-400'}>
                {inspected.gate.gatePass ? '1 (PASS)' : '0 (VETO)'}
              </strong>
            </div>
            <div>
              veto_pin_o:{' '}
              <strong className={inspected.gate.vetoPin ? 'text-rose-400' : 'text-emerald-400'}>
                {inspected.gate.vetoPin ? '1 (LOCK)' : '0 (OPEN)'}
              </strong>
            </div>
            <div>rcf_raw = {inspected.gate.rcfRawFloat.toFixed(7)}</div>
            <div>delta_e_raw = {inspected.gate.deltaERawFloat.toFixed(7)}</div>
            <div>bleed_post = {inspected.gate.bleedPostQ} LSB</div>
            <div>norm_fault = {String(inspected.gate.normFault)}</div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-700/80 bg-slate-900/80 p-4 space-y-2">
          <div className="font-mono text-xs font-semibold text-cyan-200">{t('s02.chartTitle')}</div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 6, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.16)" />
                <XAxis dataKey="tick" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0, 1]} stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    fontSize: '11px',
                  }}
                />
                <ReferenceLine y={0.95} stroke="#34d399" strokeDasharray="4 4" />
                <ReferenceLine y={0.05} stroke="#fb7185" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="meanRcf" name="Mean RCF" stroke="#22d3ee" dot={false} strokeWidth={2} />
                <Line type="monotone" dataKey="maxDeltaE" name="Max ΔE_raw" stroke="#fb7185" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CityCorridorSimulator;
