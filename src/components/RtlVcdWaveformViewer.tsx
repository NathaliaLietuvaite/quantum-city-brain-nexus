import { useMemo, useState } from 'react';
import { Activity, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/lib/i18n';
import { sampleVcdTrackAtCycle } from '@/lib/mission-control';
import vcdData from '@/data/rtl-vcd-waveforms.json';

type TraceKey = 'canonical_l_pass' | 'g3_attack_veto';
type ZoomKey = 'full' | 'entry' | 'verdict';

const ZOOM_RANGES: Record<ZoomKey, readonly [number, number]> = {
  full: [0, 197],
  entry: [0, 72],
  verdict: [175, 197],
};

const STATE_FILL: Record<string, { bg: string; stroke: string; text: string }> = {
  S_IDLE: { bg: 'rgba(100,116,139,0.28)', stroke: '#94a3b8', text: '#cbd5e1' },
  S_LOAD_DOT: { bg: 'rgba(6,182,212,0.28)', stroke: '#22d3ee', text: '#a5f3fc' },
  S_EVAL_RAW: { bg: 'rgba(234,179,8,0.34)', stroke: '#facc15', text: '#fef08a' },
  S_STRIP_P1: { bg: 'rgba(139,92,246,0.30)', stroke: '#a78bfa', text: '#ddd6fe' },
  S_LATCH_P2: { bg: 'rgba(249,115,22,0.34)', stroke: '#fb923c', text: '#fed7aa' },
  S_STRIP_P2: { bg: 'rgba(59,130,246,0.30)', stroke: '#60a5fa', text: '#bfdbfe' },
  S_VERDICT: { bg: 'rgba(16,185,129,0.38)', stroke: '#34d399', text: '#a7f3d0' },
};

const BINARY_SIGNALS = [
  { key: 'rst_ni', label: 'rst_ni', color: '#94a3b8', highlight: false },
  { key: 'in_valid_i', label: 'in_valid_i', color: '#38bdf8', highlight: false },
  { key: 'busy_o', label: 'busy_o', color: '#a78bfa', highlight: false },
  { key: 'out_valid_o', label: 'out_valid_o', color: '#22d3ee', highlight: false },
  { key: 'done_o', label: 'done_o', color: '#facc15', highlight: false },
  { key: 'veto_pin_o', label: 'veto_pin_o', color: '#fb7185', highlight: true },
  { key: 'gate_pass_o', label: 'gate_pass_o', color: '#34d399', highlight: true },
  { key: 'pure_g3_collision_o', label: 'pure_g3_o', color: '#f97316', highlight: false },
] as const;

type BinarySignalKey = (typeof BINARY_SIGNALS)[number]['key'];

const RtlVcdWaveformViewer = () => {
  const { t } = useI18n();
  const [traceKey, setTraceKey] = useState<TraceKey>('canonical_l_pass');
  const [zoom, setZoom] = useState<ZoomKey>('full');
  const [cursorCycle, setCursorCycle] = useState<number>(197);

  const trace = vcdData.traces[traceKey];
  const maxCycle = trace.total_cycles - 1;
  const [viewStart, viewEnd] = ZOOM_RANGES[zoom];
  const span = Math.max(1, viewEnd - viewStart + 1);

  const labelW = 108;
  const plotW = 760;
  const totalW = labelW + plotW + 18;
  const rowH = 30;
  const headerH = 26;
  const stateRowY = headerH + 6;
  const firstBinY = stateRowY + rowH + 8;
  const totalH = firstBinY + BINARY_SIGNALS.length * rowH + 16;

  const xOf = (cyc: number) => labelW + ((cyc - viewStart) / span) * plotW;

  const stateSegments = useMemo(() => {
    const runs = trace.tracks.state_q as Array<[number, string]>;
    const segs: Array<{ start: number; end: number; name: string }> = [];
    for (let i = 0; i < runs.length; i += 1) {
      const start = runs[i][0];
      const end = i + 1 < runs.length ? runs[i + 1][0] : trace.total_cycles;
      const clampedStart = Math.max(start, viewStart);
      const clampedEnd = Math.min(end, viewEnd + 1);
      if (clampedEnd > clampedStart) {
        segs.push({ start: clampedStart, end: clampedEnd, name: runs[i][1] });
      }
    }
    return segs;
  }, [trace, viewStart, viewEnd]);

  const buildBinaryPath = (sigKey: BinarySignalKey, rowY: number) => {
    const runs = trace.tracks[sigKey] as Array<[number, number]>;
    const hiY = rowY + 5;
    const loY = rowY + rowH - 6;
    const points: string[] = [];

    const initialVal = sampleVcdTrackAtCycle(runs, viewStart) ?? 0;
    let curVal = initialVal;
    points.push(`M ${xOf(viewStart).toFixed(2)} ${(curVal ? hiY : loY).toFixed(2)}`);

    for (let i = 0; i < runs.length; i += 1) {
      const [cyc, nextVal] = runs[i];
      if (cyc <= viewStart) continue;
      if (cyc > viewEnd + 1) break;
      const x = xOf(cyc);
      points.push(`L ${x.toFixed(2)} ${(curVal ? hiY : loY).toFixed(2)}`);
      points.push(`L ${x.toFixed(2)} ${(nextVal ? hiY : loY).toFixed(2)}`);
      curVal = nextVal;
    }

    points.push(`L ${xOf(viewEnd + 1).toFixed(2)} ${(curVal ? hiY : loY).toFixed(2)}`);
    return points.join(' ');
  };

  const probe = useMemo(() => {
    const c = Math.max(0, Math.min(maxCycle, cursorCycle));
    return {
      cycle: c,
      state: sampleVcdTrackAtCycle(trace.tracks.state_q as Array<[number, string]>, c) ?? 'S_IDLE',
      inValid: sampleVcdTrackAtCycle(trace.tracks.in_valid_i as Array<[number, number]>, c) ?? 0,
      busy: sampleVcdTrackAtCycle(trace.tracks.busy_o as Array<[number, number]>, c) ?? 0,
      outValid: sampleVcdTrackAtCycle(trace.tracks.out_valid_o as Array<[number, number]>, c) ?? 0,
      done: sampleVcdTrackAtCycle(trace.tracks.done_o as Array<[number, number]>, c) ?? 0,
      veto: sampleVcdTrackAtCycle(trace.tracks.veto_pin_o as Array<[number, number]>, c) ?? 1,
      pass: sampleVcdTrackAtCycle(trace.tracks.gate_pass_o as Array<[number, number]>, c) ?? 0,
      pureG3: sampleVcdTrackAtCycle(trace.tracks.pure_g3_collision_o as Array<[number, number]>, c) ?? 0,
    };
  }, [trace, cursorCycle, maxCycle]);

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * totalW;
    if (relX < labelW || relX > labelW + plotW) return;
    const rawCyc = Math.floor(viewStart + ((relX - labelW) / plotW) * span);
    setCursorCycle(Math.max(0, Math.min(maxCycle, rawCyc)));
  };

  const tickStep = zoom === 'verdict' ? 2 : zoom === 'entry' ? 10 : 20;
  const ticks: number[] = [];
  for (let c = Math.ceil(viewStart / tickStep) * tickStep; c <= viewEnd; c += tickStep) {
    ticks.push(c);
  }
  if (!ticks.includes(197) && 197 >= viewStart && 197 <= viewEnd) ticks.push(197);

  const cursorVisible = probe.cycle >= viewStart && probe.cycle <= viewEnd;
  const cursorX = xOf(probe.cycle + 0.5);

  return (
    <section
      id="rtl-vcd-viewer"
      className="rounded-lg border border-emerald-400/40 bg-slate-950/90 p-5 md:p-7 space-y-5 scroll-mt-24"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
          <h3 className="text-xl font-semibold text-primary">{t('vcd.title')}</h3>
        </div>
        <span className="font-mono text-xs px-2.5 py-1 rounded-full border border-emerald-400/40 bg-emerald-500/15 text-emerald-200">
          {vcdData.tool}
        </span>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">{t('vcd.desc')}</p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={traceKey === 'canonical_l_pass' ? 'default' : 'secondary'}
            onClick={() => {
              setTraceKey('canonical_l_pass');
              setCursorCycle(197);
            }}
          >
            {t('vcd.tracePass')}
          </Button>
          <Button
            size="sm"
            variant={traceKey === 'g3_attack_veto' ? 'destructive' : 'secondary'}
            onClick={() => {
              setTraceKey('g3_attack_veto');
              setCursorCycle(197);
            }}
          >
            {t('vcd.traceVeto')}
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ['full', 'vcd.zoomFull'],
              ['entry', 'vcd.zoomEntry'],
              ['verdict', 'vcd.zoomVerdict'],
            ] as const
          ).map(([zKey, labelKey]) => (
            <Button
              key={zKey}
              size="sm"
              variant={zoom === zKey ? 'default' : 'outline'}
              onClick={() => {
                setZoom(zKey);
                const [s, e] = ZOOM_RANGES[zKey];
                if (cursorCycle < s || cursorCycle > e) setCursorCycle(e);
              }}
            >
              {t(labelKey)}
            </Button>
          ))}
        </div>
      </div>

      {/* Fail-Closed Verdict Strip */}
      <div
        className={`flex items-center gap-2 rounded-md border px-3.5 py-2 font-mono text-xs ${
          trace.final_verdict.gate_pass
            ? 'border-emerald-400/45 bg-emerald-950/35 text-emerald-200'
            : 'border-rose-400/45 bg-rose-950/35 text-rose-200'
        }`}
      >
        {trace.final_verdict.gate_pass ? (
          <Unlock className="w-4 h-4 shrink-0 text-emerald-300" />
        ) : (
          <Lock className="w-4 h-4 shrink-0 text-rose-300" />
        )}
        <span>{t(trace.final_verdict.gate_pass ? 'vcd.failClosedOk' : 'vcd.failClosedHold')}</span>
      </div>

      {/* Interactive SVG Logic Analyzer */}
      <div className="overflow-x-auto rounded-lg border border-slate-700/80 bg-[#050b16] p-2">
        <svg
          viewBox={`0 0 ${totalW} ${totalH}`}
          className="w-full min-w-[680px] h-auto select-none cursor-crosshair"
          onClick={handleSvgClick}
          role="img"
          aria-label={t('vcd.title')}
        >
          {/* Vertical cycle grid lines & header ticks */}
          {ticks.map((c) => {
            const x = xOf(c);
            return (
              <g key={c}>
                <line
                  x1={x}
                  y1={headerH}
                  x2={x}
                  y2={totalH - 10}
                  stroke={c === 197 ? 'rgba(52,211,153,0.45)' : 'rgba(148,163,184,0.14)'}
                  strokeDasharray={c === 197 ? '4 2' : '2 4'}
                />
                <text
                  x={x}
                  y={16}
                  textAnchor="middle"
                  fill={c === 197 ? '#6ee7b7' : '#94a3b8'}
                  fontSize="10"
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                >
                  {c}
                </text>
              </g>
            );
          })}

          {/* State Bus Track (state_q[2:0]) */}
          <text
            x={8}
            y={stateRowY + rowH / 2 + 4}
            fill="#67e8f9"
            fontSize="11"
            fontWeight="700"
            fontFamily="ui-monospace, SFMono-Regular, monospace"
          >
            state_q[2:0]
          </text>
          {stateSegments.map((seg, idx) => {
            const x1 = xOf(seg.start);
            const x2 = xOf(seg.end);
            const w = Math.max(2, x2 - x1);
            const style = STATE_FILL[seg.name] ?? STATE_FILL.S_IDLE;
            return (
              <g key={`${seg.name}-${idx}`}>
                <rect
                  x={x1}
                  y={stateRowY + 2}
                  width={w}
                  height={rowH - 4}
                  rx={3}
                  fill={style.bg}
                  stroke={style.stroke}
                  strokeWidth={1.1}
                />
                {w > 46 && (
                  <text
                    x={x1 + w / 2}
                    y={stateRowY + rowH / 2 + 4}
                    textAnchor="middle"
                    fill={style.text}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="ui-monospace, SFMono-Regular, monospace"
                  >
                    {seg.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Binary Signal Tracks */}
          {BINARY_SIGNALS.map((sig, idx) => {
            const y = firstBinY + idx * rowH;
            return (
              <g key={sig.key}>
                {sig.highlight && (
                  <rect
                    x={labelW}
                    y={y}
                    width={plotW}
                    height={rowH}
                    fill={sig.key === 'veto_pin_o' ? 'rgba(244,63,94,0.06)' : 'rgba(16,185,129,0.06)'}
                  />
                )}
                <line
                  x1={0}
                  y1={y + rowH}
                  x2={totalW}
                  y2={y + rowH}
                  stroke="rgba(148,163,184,0.10)"
                />
                <text
                  x={8}
                  y={y + rowH / 2 + 4}
                  fill={sig.highlight ? sig.color : '#cbd5e1'}
                  fontSize="11"
                  fontWeight={sig.highlight ? '700' : '500'}
                  fontFamily="ui-monospace, SFMono-Regular, monospace"
                >
                  {sig.label}
                </text>
                <path
                  d={buildBinaryPath(sig.key, y)}
                  fill="none"
                  stroke={sig.color}
                  strokeWidth={sig.highlight ? 2.1 : 1.5}
                  strokeLinejoin="miter"
                />
              </g>
            );
          })}

          {/* Interactive Cycle Cursor */}
          {cursorVisible && (
            <g>
              <line
                x1={cursorX}
                y1={headerH - 2}
                x2={cursorX}
                y2={totalH - 8}
                stroke="#f8fafc"
                strokeWidth={1.4}
                strokeDasharray="3 2"
              />
              <circle cx={cursorX} cy={headerH - 2} r={3.5} fill="#22d3ee" />
            </g>
          )}
        </svg>
      </div>

      {/* Cycle Scrubber & Live Signal Probe Readout */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-4">
          <label htmlFor="vcd-cycle-slider" className="font-mono text-xs text-cyan-200 whitespace-nowrap">
            {t('vcd.probeCycle')}: <strong>{probe.cycle}</strong> / {maxCycle} ({(probe.cycle * 0.01).toFixed(2)} µs @{' '}
            {vcdData.clock_mhz_reference} MHz)
          </label>
          <input
            id="vcd-cycle-slider"
            type="range"
            min={viewStart}
            max={viewEnd}
            step={1}
            value={Math.max(viewStart, Math.min(viewEnd, probe.cycle))}
            onChange={(e) => setCursorCycle(Number(e.target.value))}
            className="flex-1 min-w-[200px] accent-emerald-400"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 font-mono text-xs">
          <div className="rounded border bg-card p-2">
            <div className="text-[10px] text-muted-foreground">state_q</div>
            <div className="font-semibold text-cyan-300 truncate">{probe.state}</div>
          </div>
          <div className="rounded border bg-card p-2">
            <div className="text-[10px] text-muted-foreground">in_valid_i</div>
            <div className="font-semibold">{probe.inValid}</div>
          </div>
          <div className="rounded border bg-card p-2">
            <div className="text-[10px] text-muted-foreground">busy_o</div>
            <div className="font-semibold">{probe.busy}</div>
          </div>
          <div className="rounded border bg-card p-2">
            <div className="text-[10px] text-muted-foreground">out_valid_o</div>
            <div className="font-semibold">{probe.outValid}</div>
          </div>
          <div className="rounded border bg-card p-2">
            <div className="text-[10px] text-muted-foreground">done_o</div>
            <div className="font-semibold">{probe.done}</div>
          </div>
          <div className="rounded border bg-card p-2">
            <div className="text-[10px] text-muted-foreground">veto_pin_o</div>
            <div className={probe.veto ? 'font-bold text-rose-400' : 'font-bold text-emerald-400'}>
              {probe.veto ? '1 (LOCK)' : '0 (OPEN)'}
            </div>
          </div>
          <div className="rounded border bg-card p-2">
            <div className="text-[10px] text-muted-foreground">gate_pass_o</div>
            <div className={probe.pass ? 'font-bold text-emerald-400' : 'font-semibold text-slate-400'}>
              {probe.pass}
            </div>
          </div>
          <div className="rounded border bg-card p-2">
            <div className="text-[10px] text-muted-foreground">pure_g3_o</div>
            <div className={probe.pureG3 ? 'font-bold text-amber-300' : 'font-semibold text-slate-400'}>
              {probe.pureG3}
            </div>
          </div>
        </div>

        <div className="rounded-md border bg-card/60 px-3 py-2 font-mono text-[11px] text-muted-foreground break-all">
          source_vcd: <strong>{trace.source_file}</strong> ({trace.source_vcd_bytes.toLocaleString('en-US')} B) ·
          SHA-256: <span className="text-emerald-300">{trace.source_vcd_sha256}</span> · compute_cycles ={' '}
          {trace.compute_cycles}
        </div>
      </div>
    </section>
  );
};

export default RtlVcdWaveformViewer;
